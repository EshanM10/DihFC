import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const CACHE_DIR = path.resolve(__dirname, 'data');
const CACHE_FILE = path.resolve(CACHE_DIR, 'fantasy-cache.json');
const API_BASE = 'https://v3.football.api-sports.io';
const DAILY_HARD_CAP = 95; // Keep 5-request safety buffer under 100/day Free plan cap
const SQUAD_TTL_MS = 7 * 24 * 60 * 60 * 1000; // Active rosters cached 7 days
const LEADERS_TTL_MS = 24 * 60 * 60 * 1000; // League leaders cached 24 hours
const FIXTURES_TTL_MS = 6 * 60 * 60 * 1000; // Daily fixture form refreshed max every 6h
const MANUAL_REFRESH_COOLDOWN_MS = 5 * 60 * 1000;

export type LeagueCode = 'EPL' | 'LIGA' | 'SERA' | 'BUND' | 'LIG1' | 'MLS' | 'ROSH';
export type FantasyTier = 'bronze' | 'silver' | 'gold' | 'totw' | 'elite';
export type FantasyPos = 'GK' | 'LB' | 'CB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';

export interface LeagueConfig {
  code: LeagueCode;
  apiId: number;
  name: string;
  region: string;
  difficultyMult: number;
  seasonFallback: number;
}

export const FANTASY_LEAGUE_MAP: Record<LeagueCode, LeagueConfig> = {
  EPL: { code: 'EPL', apiId: 39, name: 'Premier League', region: 'England', difficultyMult: 1.15, seasonFallback: 2024 },
  LIGA: { code: 'LIGA', apiId: 140, name: 'LaLiga EA', region: 'Spain', difficultyMult: 1.12, seasonFallback: 2024 },
  SERA: { code: 'SERA', apiId: 135, name: 'Serie A', region: 'Italy', difficultyMult: 1.10, seasonFallback: 2024 },
  BUND: { code: 'BUND', apiId: 78, name: 'Bundesliga', region: 'Germany', difficultyMult: 1.10, seasonFallback: 2024 },
  LIG1: { code: 'LIG1', apiId: 61, name: 'Ligue 1', region: 'France', difficultyMult: 1.06, seasonFallback: 2024 },
  MLS: { code: 'MLS', apiId: 253, name: 'Major League Soccer', region: 'USA', difficultyMult: 1.02, seasonFallback: 2024 },
  ROSH: { code: 'ROSH', apiId: 307, name: 'Roshn Pro League', region: 'Saudi Arabia', difficultyMult: 1.05, seasonFallback: 2024 },
};

const VALID_LEAGUE_CODES = new Set<string>(Object.keys(FANTASY_LEAGUE_MAP));
const LEAGUE_BY_API_ID = new Map<number, LeagueCode>(
  Object.values(FANTASY_LEAGUE_MAP).map((cfg) => [cfg.apiId, cfg.code])
);

export interface FantasyPlayerCard {
  id: string;
  apiPlayerId: number;
  name: string;
  ovr: number;
  tier: FantasyTier;
  pos: FantasyPos;
  role: 'GK' | 'DEF' | 'MID' | 'FWD';
  nation: string;
  club: string;
  teamId: number;
  teamLogo: string;
  photo: string;
  league: LeagueCode;
  shirtNum: number;
  age: number;
  teamForm: string;
  recentRating: number;
  recentGoals: number;
  recentAssists: number;
  recentMinutes: number;
  recentSaves: number;
  formTag: string;
  stats: {
    pac: number;
    sho: number;
    fin: number;
    pas: number;
    vis: number;
    dri: number;
    def: number;
    phy: number;
  };
}

interface TeamCacheRecord {
  teamId: number;
  name: string;
  logo: string;
  league: LeagueCode;
  rank: number;
  points: number;
  form: string;
  goalsDiff: number;
  squadFetchedAt: number;
  players: Array<{
    apiPlayerId: number;
    name: string;
    age: number;
    number: number | null;
    rawPosition: string;
    photo: string;
  }>;
}

interface LeaderStatRecord {
  apiPlayerId: number;
  teamId: number;
  name: string;
  nationality: string;
  position: string;
  rating: number;
  goals: number;
  assists: number;
  minutes: number;
  appearances: number;
  shots: number;
  passes: number;
  dribbles: number;
  tackles: number;
  saves: number;
}

interface FixturePlayerPerf {
  apiPlayerId: number;
  teamId: number;
  fixtureId: number;
  fixtureDate: string;
  rating: number;
  goals: number;
  assists: number;
  minutes: number;
  saves: number;
  tackles: number;
  dribbles: number;
  passes: number;
  shots: number;
}

interface LeagueCacheEntry {
  league: LeagueCode;
  standingsFetchedAt: number;
  leadersFetchedAt: number;
  teamIds: number[];
  leaders: Record<number, LeaderStatRecord>;
}

interface FantasyDiskCache {
  quota: {
    date: string;
    usedToday: number;
    apiRemaining: number | null;
    lastRefreshAt: number;
  };
  fixturesFetchedAt: number;
  fetchedFixtureIds: Record<string, boolean>;
  teams: Record<number, TeamCacheRecord>;
  leagues: Partial<Record<LeagueCode, LeagueCacheEntry>>;
  recentPerfs: Record<number, FixturePlayerPerf>;
}

function todayUtcStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateOffsetUtcStr(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function createEmptyCache(): FantasyDiskCache {
  return {
    quota: {
      date: todayUtcStr(),
      usedToday: 0,
      apiRemaining: null,
      lastRefreshAt: 0,
    },
    fixturesFetchedAt: 0,
    fetchedFixtureIds: {},
    teams: {},
    leagues: {},
    recentPerfs: {},
  };
}

function loadDiskCache(): FantasyDiskCache {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      const base = createEmptyCache();
      const merged: FantasyDiskCache = {
        ...base,
        ...raw,
        quota: {
          ...base.quota,
          ...(raw?.quota || {}),
        },
        fetchedFixtureIds: raw?.fetchedFixtureIds || {},
        teams: raw?.teams || {},
        leagues: raw?.leagues || {},
        recentPerfs: raw?.recentPerfs || {},
      };
      if (merged.quota.date !== todayUtcStr()) {
        merged.quota.date = todayUtcStr();
        merged.quota.usedToday = 0;
      }
      return merged;
    }
  } catch {
    // Ignore corrupt cache and rebuild cleanly
  }
  return createEmptyCache();
}

function saveDiskCache(cache: FantasyDiskCache): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
  } catch {
    // Non-fatal if read-only filesystem
  }
}

let memoryCache: FantasyDiskCache = loadDiskCache();
const inFlightLeagueSync = new Map<LeagueCode, Promise<void>>();

function getApiKey(): string {
  return String(process.env.API_FOOTBALL_KEY || '').trim();
}

function resetDailyQuotaIfNeeded(): void {
  const today = todayUtcStr();
  if (memoryCache.quota.date !== today) {
    memoryCache.quota.date = today;
    memoryCache.quota.usedToday = 0;
  }
}

function canSpendRequests(count = 1): boolean {
  resetDailyQuotaIfNeeded();
  if (!getApiKey()) return false;
  if (memoryCache.quota.usedToday + count > DAILY_HARD_CAP) return false;
  if (
    memoryCache.quota.apiRemaining !== null &&
    memoryCache.quota.apiRemaining <= 5
  ) {
    return false;
  }
  return true;
}

let lastApiCallAt = 0;
const MIN_REQ_GAP_MS = 6400; // Free plan allows 10 req/min

async function callApiFootball(endpointWithQuery: string): Promise<any | null> {
  const key = getApiKey();
  if (!key || !canSpendRequests(1)) return null;

  const waitMs = MIN_REQ_GAP_MS - (Date.now() - lastApiCallAt);
  if (waitMs > 0) {
    await new Promise((r) => setTimeout(r, waitMs));
  }
  lastApiCallAt = Date.now();

  resetDailyQuotaIfNeeded();
  memoryCache.quota.usedToday += 1;

  try {
    const res = await fetch(`${API_BASE}${endpointWithQuery}`, {
      headers: {
        'x-apisports-key': key,
      },
    });
    const remHeader = res.headers.get('x-ratelimit-requests-remaining');
    if (remHeader !== null && !Number.isNaN(Number(remHeader))) {
      memoryCache.quota.apiRemaining = Number(remHeader);
    }
    if (!res.ok) {
      saveDiskCache(memoryCache);
      return null;
    }
    const json = await res.json();
    saveDiskCache(memoryCache);
    if (json?.errors && (Array.isArray(json.errors) ? json.errors.length > 0 : Object.keys(json.errors).length > 0)) {
      return null;
    }
    return json;
  } catch {
    saveDiskCache(memoryCache);
    return null;
  }
}

function hashSeed(input: number): number {
  let x = (input * 2654435761) >>> 0;
  x ^= x >>> 16;
  return (x % 1000) / 1000;
}

function mapPositionFromApi(rawPos: string, number: number | null, apiPlayerId: number): { pos: FantasyPos; role: 'GK' | 'DEF' | 'MID' | 'FWD' } {
  const norm = String(rawPos || '').toLowerCase();
  const n = number || 0;
  const h = hashSeed(apiPlayerId);
  if (norm.includes('goal') || norm === 'g' || norm === 'gk') {
    return { pos: 'GK', role: 'GK' };
  }
  if (norm.includes('def') || norm === 'd') {
    if (n === 2 || (h < 0.24 && n !== 4 && n !== 5)) return { pos: 'RB', role: 'DEF' };
    if (n === 3 || (h >= 0.24 && h < 0.48 && n !== 4 && n !== 5)) return { pos: 'LB', role: 'DEF' };
    return { pos: 'CB', role: 'DEF' };
  }
  if (norm.includes('mid') || norm === 'm') {
    if (n === 6 || h < 0.26) return { pos: 'CDM', role: 'MID' };
    if (n === 10 || h > 0.72) return { pos: 'CAM', role: 'MID' };
    return { pos: 'CM', role: 'MID' };
  }
  if (n === 7 || h < 0.24) return { pos: 'RW', role: 'FWD' };
  if (n === 11 || (h >= 0.24 && h < 0.48)) return { pos: 'LW', role: 'FWD' };
  return { pos: 'ST', role: 'FWD' };
}

function computeFormPoints(form: string): number {
  let pts = 0;
  for (const ch of String(form || '').slice(-5)) {
    if (ch === 'W') pts += 3;
    else if (ch === 'D') pts += 1;
  }
  return pts; // 0..15
}

function clampStat(v: number, min = 38, max = 96): number {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function buildFantasyCard(
  team: TeamCacheRecord,
  rawPlayer: TeamCacheRecord['players'][number],
  leader: LeaderStatRecord | undefined,
  recent: FixturePlayerPerf | undefined
): FantasyPlayerCard {
  const { pos, role } = mapPositionFromApi(rawPlayer.rawPosition, rawPlayer.number, rawPlayer.apiPlayerId);
  const formPts = computeFormPoints(team.form);
  const rankBonus = Math.max(0, (20 - (team.rank || 10)) / 19); // 0..1
  const shirtStarterBoost =
    rawPlayer.number !== null && rawPlayer.number >= 1 && rawPlayer.number <= 25
      ? 0.22
      : rawPlayer.number !== null && rawPlayer.number <= 32
        ? 0.06
        : -0.22;
  const agePrimeBoost = rawPlayer.age >= 22 && rawPlayer.age <= 30 ? 0.14 : rawPlayer.age >= 19 && rawPlayer.age <= 33 ? 0.04 : -0.18;

  const recentGoals = (recent?.goals || 0) + (leader?.goals || 0);
  const recentAssists = (recent?.assists || 0) + (leader?.assists || 0);
  const recentMinutes = recent?.minutes || leader?.minutes || 0;
  const recentSaves = recent?.saves || leader?.saves || 0;

  let rating = 6.32 + rankBonus * 0.48 + (formPts / 15) * 0.32 + shirtStarterBoost + agePrimeBoost;
  if (leader && leader.rating > 0) {
    rating = rating * 0.35 + leader.rating * 0.65;
  }
  if (recent && recent.rating > 0) {
    rating = leader && leader.rating > 0 ? leader.rating * 0.45 + recent.rating * 0.55 : rating * 0.25 + recent.rating * 0.75;
  }

  // Recent match contribution bonus
  const goalImpact = (recent?.goals || 0) * 0.42 + Math.min(0.45, (leader?.goals || 0) * 0.025);
  const assistImpact = (recent?.assists || 0) * 0.30 + Math.min(0.35, (leader?.assists || 0) * 0.025);
  const saveImpact = role === 'GK' ? Math.min(0.4, (recentSaves || 0) * 0.06) : 0;
  const recentRating = Math.round(Math.max(5.5, Math.min(9.8, rating + goalImpact * 0.35 + assistImpact * 0.3 + saveImpact)) * 10) / 10;

  // Performance-based card tier (applying Bronze / Silver / Gold / TOTW / Elite card styles)
  let tier: FantasyTier = 'silver';
  if (recentRating >= 8.15 || (recent && recent.goals + recent.assists >= 2 && recentRating >= 7.6)) {
    tier = 'elite';
  } else if (recentRating >= 7.55 || (recent && recent.goals + recent.assists >= 1 && recentRating >= 7.2) || (leader && leader.goals + leader.assists >= 12)) {
    tier = 'totw';
  } else if (recentRating >= 6.95) {
    tier = 'gold';
  } else if (recentRating >= 6.38) {
    tier = 'silver';
  } else {
    tier = 'bronze';
  }

  const ovrBase = 52 + (recentRating - 5.5) * 9.5 + (leader ? 3 : 0) + (recent && recent.minutes >= 60 ? 2 : 0);
  const ovr = Math.max(56, Math.min(93, Math.round(ovrBase)));

  const tags: string[] = [];
  if (recent && (recent.goals > 0 || recent.assists > 0)) {
    tags.push(`${recent.goals}G ${recent.assists}A LAST`);
  } else if (leader && (leader.goals > 0 || leader.assists > 0)) {
    tags.push(`${leader.goals}G ${leader.assists}A`);
  }
  if (recentRating >= 7.0 || recent || leader) {
    tags.push(`${recentRating.toFixed(1)} RTG`);
  } else if (team.form) {
    tags.push(`FORM ${team.form.slice(-5)}`);
  } else {
    tags.push(`#${rawPlayer.number ?? '-'}`);
  }

  const jitter = (hashSeed(rawPlayer.apiPlayerId + 17) - 0.5) * 6;
  const paceBase = role === 'GK' ? 42 : role === 'DEF' ? ovr - 4 : role === 'MID' ? ovr - 2 : ovr + 4;
  const shoBase = role === 'GK' ? 32 : role === 'DEF' ? ovr - 14 : role === 'MID' ? ovr - 3 : ovr + 5;
  const pasBase = role === 'GK' ? ovr - 10 : role === 'MID' ? ovr + 5 : ovr - 2;
  const driBase = role === 'GK' ? 40 : role === 'DEF' ? ovr - 8 : ovr + 3;
  const defBase = role === 'GK' ? ovr + 4 : role === 'DEF' ? ovr + 5 : role === 'MID' ? ovr - 4 : ovr - 28;
  const phyBase = role === 'DEF' ? ovr + 3 : role === 'GK' ? ovr - 2 : ovr - 4;

  return {
    id: `af_${rawPlayer.apiPlayerId}`,
    apiPlayerId: rawPlayer.apiPlayerId,
    name: rawPlayer.name,
    ovr,
    tier,
    pos,
    role,
    nation: leader?.nationality || team.name.slice(0, 3).toUpperCase(),
    club: team.name,
    teamId: team.teamId,
    teamLogo: team.logo,
    photo: rawPlayer.photo,
    league: team.league,
    shirtNum: rawPlayer.number || 99,
    age: rawPlayer.age || 24,
    teamForm: team.form || '',
    recentRating,
    recentGoals,
    recentAssists,
    recentMinutes,
    recentSaves,
    formTag: tags.join(' · '),
    stats: {
      pac: clampStat(paceBase + jitter),
      sho: clampStat(shoBase + jitter * 0.8),
      fin: clampStat(shoBase + (role === 'FWD' ? 4 : -2) + jitter * 0.7),
      pas: clampStat(pasBase - jitter * 0.5),
      vis: clampStat(pasBase + (role === 'MID' ? 3 : -2)),
      dri: clampStat(driBase + jitter * 0.6),
      def: clampStat(defBase - jitter * 0.5),
      phy: clampStat(phyBase + jitter * 0.4),
    },
  };
}

async function syncRecentFixturesGlobal(force = false): Promise<number> {
  const now = Date.now();
  if (!force && now - memoryCache.fixturesFetchedAt < FIXTURES_TTL_MS) {
    return 0;
  }
  if (!canSpendRequests(2)) return 0;

  let requestsSpent = 0;
  const dates = [dateOffsetUtcStr(-1), todayUtcStr()];
  const candidateFixtureIds: Array<{ fixtureId: number; date: string }> = [];

  for (const dStr of dates) {
    const json = await callApiFootball(`/fixtures?date=${dStr}`);
    requestsSpent += 1;
    const rows = Array.isArray(json?.response) ? json.response : [];
    for (const fx of rows) {
      const fId = fx?.fixture?.id;
      const status = fx?.fixture?.status?.short;
      const hId = fx?.teams?.home?.id;
      const aId = fx?.teams?.away?.id;
      const leagueApiId = fx?.league?.id;
      const isFinished = status === 'FT' || status === 'AET' || status === 'PEN';
      const touchesCachedTeam = Boolean((hId && memoryCache.teams[hId]) || (aId && memoryCache.teams[aId]));
      const touchesTrackedLeague = LEAGUE_BY_API_ID.has(leagueApiId) || leagueApiId === 2 || leagueApiId === 3;
      if (isFinished && fId && !memoryCache.fetchedFixtureIds[String(fId)] && (touchesCachedTeam || touchesTrackedLeague)) {
        candidateFixtureIds.push({ fixtureId: Number(fId), date: String(fx?.fixture?.date || dStr).slice(0, 10) });
      }
    }
  }

  memoryCache.fixturesFetchedAt = now;

  // Fetch player stats for up to 4 newly finished relevant fixtures (permanent cache per fixture)
  for (const item of candidateFixtureIds.slice(0, 4)) {
    if (!canSpendRequests(1)) break;
    const pJson = await callApiFootball(`/fixtures/players?fixture=${item.fixtureId}`);
    requestsSpent += 1;
    memoryCache.fetchedFixtureIds[String(item.fixtureId)] = true;
    const teamsArr = Array.isArray(pJson?.response) ? pJson.response : [];
    for (const tBlock of teamsArr) {
      const teamId = Number(tBlock?.team?.id || 0);
      for (const pRow of tBlock?.players || []) {
        const pid = Number(pRow?.player?.id || 0);
        const st = pRow?.statistics?.[0];
        if (!pid || !st) continue;
        const mins = Number(st?.games?.minutes || 0);
        const rating = Number(st?.games?.rating || 0);
        if (mins <= 0 && rating <= 0) continue;
        memoryCache.recentPerfs[pid] = {
          apiPlayerId: pid,
          teamId,
          fixtureId: item.fixtureId,
          fixtureDate: item.date,
          rating: rating > 0 ? rating : 6.6,
          goals: Number(st?.goals?.total || 0),
          assists: Number(st?.goals?.assists || 0),
          minutes: mins,
          saves: Number(st?.goals?.saves || 0),
          tackles: Number(st?.tackles?.total || 0),
          dribbles: Number(st?.dribbles?.success || 0),
          passes: Number(st?.passes?.total || 0),
          shots: Number(st?.shots?.total || 0),
        };
      }
    }
  }

  saveDiskCache(memoryCache);
  return requestsSpent;
}

async function ensureLeagueSynced(code: LeagueCode): Promise<void> {
  const existing = inFlightLeagueSync.get(code);
  if (existing) return existing;

  const job = (async () => {
    const cfg = FANTASY_LEAGUE_MAP[code];
    const now = Date.now();
    let entry: LeagueCacheEntry = memoryCache.leagues[code] || {
      league: code,
      standingsFetchedAt: 0,
      leadersFetchedAt: 0,
      teamIds: [],
      leaders: {},
    };

    // 1. Fetch league standings (gives all teams, rank, form, logo in 1 request!)
    if (entry.teamIds.length === 0 || now - entry.standingsFetchedAt > SQUAD_TTL_MS) {
      if (canSpendRequests(1)) {
        const stJson = await callApiFootball(`/standings?league=${cfg.apiId}&season=${cfg.seasonFallback}`);
        const groups = stJson?.response?.[0]?.league?.standings || [];
        const rows = groups.flat();
        const teamIds: number[] = [];
        for (const r of rows) {
          const tid = Number(r?.team?.id || 0);
          if (!tid) continue;
          teamIds.push(tid);
          const prevTeam = memoryCache.teams[tid];
          memoryCache.teams[tid] = {
            teamId: tid,
            name: String(r.team.name || prevTeam?.name || 'Club'),
            logo: String(r.team.logo || prevTeam?.logo || ''),
            league: code,
            rank: Number(r.rank || 10),
            points: Number(r.points || 0),
            form: String(r.form || prevTeam?.form || ''),
            goalsDiff: Number(r.goalsDiff || 0),
            squadFetchedAt: prevTeam?.squadFetchedAt || 0,
            players: prevTeam?.players || [],
          };
        }
        if (teamIds.length > 0) {
          entry.teamIds = Array.from(new Set(teamIds));
          entry.standingsFetchedAt = now;
        }
      }
    }

    // 2. Fetch league top scorers & top assists (just 2 requests total per league per 24h)
    if (now - entry.leadersFetchedAt > LEADERS_TTL_MS) {
      const endpoints = [
        `/players/topscorers?league=${cfg.apiId}&season=${cfg.seasonFallback}`,
        `/players/topassists?league=${cfg.apiId}&season=${cfg.seasonFallback}`,
      ];
      let gotAny = false;
      for (const ep of endpoints) {
        if (!canSpendRequests(1)) break;
        const lJson = await callApiFootball(ep);
        const rows = Array.isArray(lJson?.response) ? lJson.response : [];
        if (rows.length > 0) gotAny = true;
        for (const row of rows) {
          const pid = Number(row?.player?.id || 0);
          const st = row?.statistics?.[0];
          if (!pid || !st) continue;
          entry.leaders[pid] = {
            apiPlayerId: pid,
            teamId: Number(st?.team?.id || 0),
            name: String(row.player.name || ''),
            nationality: String(row.player.nationality || '').slice(0, 3).toUpperCase(),
            position: String(st?.games?.position || ''),
            rating: Number(st?.games?.rating || 0),
            goals: Number(st?.goals?.total || 0),
            assists: Number(st?.goals?.assists || 0),
            minutes: Number(st?.games?.minutes || 0),
            appearances: Number(st?.games?.appearences || 0),
            shots: Number(st?.shots?.total || 0),
            passes: Number(st?.passes?.total || 0),
            dribbles: Number(st?.dribbles?.success || 0),
            tackles: Number(st?.tackles?.total || 0),
            saves: Number(st?.goals?.saves || 0),
          };
        }
      }
      if (gotAny) {
        entry.leadersFetchedAt = now;
      }
    }

    // 3. Fetch live current squad for each team in the league (1 req per team, cached 7 days)
    for (const tid of entry.teamIds) {
      const team = memoryCache.teams[tid];
      if (!team) continue;
      if (team.players.length > 0 && now - team.squadFetchedAt < SQUAD_TTL_MS) {
        continue;
      }
      if (!canSpendRequests(1)) break;
      const sqJson = await callApiFootball(`/players/squads?team=${tid}`);
      const sqBlock = sqJson?.response?.[0];
      if (sqBlock && Array.isArray(sqBlock.players) && sqBlock.players.length > 0) {
        team.squadFetchedAt = now;
        team.name = String(sqBlock.team?.name || team.name);
        team.logo = String(sqBlock.team?.logo || team.logo);
        team.players = sqBlock.players.map((p: any) => ({
          apiPlayerId: Number(p.id),
          name: String(p.name || 'Player'),
          age: Number(p.age || 24),
          number: p.number !== null && p.number !== undefined ? Number(p.number) : null,
          rawPosition: String(p.position || 'Midfielder'),
          photo: String(p.photo || ''),
        }));
      }
    }

    memoryCache.leagues[code] = entry;
    saveDiskCache(memoryCache);

    // 4. Opportunistically sync today/yesterday fixtures if stale
    await syncRecentFixturesGlobal(false);
  })();

  inFlightLeagueSync.set(code, job);
  try {
    await job;
  } finally {
    inFlightLeagueSync.delete(code);
  }
}

function getLeaguePlayersPayload(code: LeagueCode) {
  const cfg = FANTASY_LEAGUE_MAP[code];
  const entry = memoryCache.leagues[code];
  const players: FantasyPlayerCard[] = [];
  const seenPlayerIds = new Set<number>();

  for (const tid of entry?.teamIds || []) {
    const team = memoryCache.teams[tid];
    if (!team) continue;
    for (const rawP of team.players) {
      if (!rawP.apiPlayerId || seenPlayerIds.has(rawP.apiPlayerId)) continue;
      seenPlayerIds.add(rawP.apiPlayerId);
      const leader = entry?.leaders?.[rawP.apiPlayerId];
      const recent = memoryCache.recentPerfs?.[rawP.apiPlayerId];
      players.push(buildFantasyCard(team, rawP, leader, recent));
    }
  }

  players.sort((a, b) => b.ovr - a.ovr || b.recentRating - a.recentRating);

  resetDailyQuotaIfNeeded();
  return {
    league: cfg,
    players,
    teamsCount: entry?.teamIds?.filter((tid) => (memoryCache.teams[tid]?.players?.length || 0) > 0).length || 0,
    totalTeamsInLeague: entry?.teamIds?.length || 0,
    syncing: inFlightLeagueSync.has(code),
    syncedAt: entry?.standingsFetchedAt || 0,
    fixturesSyncedAt: memoryCache.fixturesFetchedAt || 0,
    hasApiKey: Boolean(getApiKey()),
    quota: {
      date: memoryCache.quota.date,
      usedToday: memoryCache.quota.usedToday,
      dailyCap: 100,
      apiRemaining: memoryCache.quota.apiRemaining,
    },
  };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/fantasy/leagues', (_req, res) => {
    resetDailyQuotaIfNeeded();
    const list = Object.values(FANTASY_LEAGUE_MAP).map((cfg) => {
      const entry = memoryCache.leagues[cfg.code];
      let playerCount = 0;
      for (const tid of entry?.teamIds || []) {
        playerCount += memoryCache.teams[tid]?.players?.length || 0;
      }
      return {
        ...cfg,
        id: cfg.code,
        cachedPlayers: playerCount,
        cachedTeams: entry?.teamIds?.length || 0,
        syncedAt: entry?.standingsFetchedAt || 0,
      };
    });
    res.json({
      leagues: list,
      hasApiKey: Boolean(getApiKey()),
      quota: {
        date: memoryCache.quota.date,
        usedToday: memoryCache.quota.usedToday,
        dailyCap: 100,
        apiRemaining: memoryCache.quota.apiRemaining,
      },
    });
  });

  app.get('/api/fantasy/league/:code', async (req, res) => {
    const code = String(req.params.code || '').toUpperCase();
    if (!VALID_LEAGUE_CODES.has(code)) {
      res.status(400).json({ error: 'Invalid fantasy league code.' });
      return;
    }
    const typedCode = code as LeagueCode;
    const entry = memoryCache.leagues[typedCode];
    const hasMissingSquads =
      !entry ||
      entry.teamIds.length === 0 ||
      entry.teamIds.some((tid) => !memoryCache.teams[tid]?.players?.length);

    if (hasMissingSquads && getApiKey() && canSpendRequests(1) && !inFlightLeagueSync.has(typedCode)) {
      // Kick off paced sync in background so HTTP response never stalls on 10 req/min limiter
      void ensureLeagueSynced(typedCode);
      // Give fast initial batch ~1.5s if completely empty so first teams appear if ready
      if (!entry || entry.teamIds.length === 0) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    const payload = getLeaguePlayersPayload(typedCode);
    res.json(payload);
  });

  app.post('/api/fantasy/refresh', async (req, res) => {
    const codeRaw = String(req.body?.league || 'EPL').toUpperCase();
    const code: LeagueCode = VALID_LEAGUE_CODES.has(codeRaw) ? (codeRaw as LeagueCode) : 'EPL';
    const now = Date.now();

    if (now - (memoryCache.quota.lastRefreshAt || 0) < MANUAL_REFRESH_COOLDOWN_MS) {
      const waitSecs = Math.ceil((MANUAL_REFRESH_COOLDOWN_MS - (now - memoryCache.quota.lastRefreshAt)) / 1000);
      res.json({
        ...getLeaguePlayersPayload(code),
        throttled: true,
        message: `Live form synced recently. Next manual sync available in ${waitSecs}s to protect daily API quota.`,
      });
      return;
    }

    if (!getApiKey()) {
      res.json({
        ...getLeaguePlayersPayload(code),
        needsKey: true,
        message: 'Configure API_FOOTBALL_KEY in environment secrets to refresh live matches.',
      });
      return;
    }

    memoryCache.quota.lastRefreshAt = now;
    await ensureLeagueSynced(code);
    const spent = await syncRecentFixturesGlobal(true);
    res.json({
      ...getLeaguePlayersPayload(code),
      requestsSpent: spent,
      message: spent > 0 ? `Synced live fixture ratings (${spent} API request${spent === 1 ? '' : 's'}).` : 'Cache is up to date.',
    });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kick Dih FC server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
