export type TierId =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'elite'
  | 'totw'
  | 'hero'
  | 'icon'
  | 'shapeshifter';

export type Position = 'GK' | 'LB' | 'CB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'ST';
export type RoleGroup = 'GK' | 'DEF' | 'MID' | 'FWD';
export type FormationId = '4-3-3' | '4-4-2' | '3-5-2';

export interface PlayerCard {
  id: string;
  name: string;
  ovr: number;
  tier: TierId;
  pos: Position;
  nation: string;
  club: string;
  league: string;
  stats: {
    pac: number;
    sho: number;
    pas: number;
    dri: number;
    def: number;
    phy: number;
  };
  shirtNum: number;
  isOutOfPositionSpecial?: boolean;
}

export interface FormationSlot {
  slotIndex: number;
  pos: Position;
  role: RoleGroup;
  x: number; // 0..1 normalized in own half/pitch
  y: number;
}

export const FORMATIONS: Record<FormationId, FormationSlot[]> = {
  '4-3-3': [
    { slotIndex: 0, pos: 'GK', role: 'GK', x: 0.06, y: 0.5 },
    { slotIndex: 1, pos: 'LB', role: 'DEF', x: 0.22, y: 0.16 },
    { slotIndex: 2, pos: 'CB', role: 'DEF', x: 0.2, y: 0.38 },
    { slotIndex: 3, pos: 'CB', role: 'DEF', x: 0.2, y: 0.62 },
    { slotIndex: 4, pos: 'RB', role: 'DEF', x: 0.22, y: 0.84 },
    { slotIndex: 5, pos: 'CM', role: 'MID', x: 0.44, y: 0.26 },
    { slotIndex: 6, pos: 'CDM', role: 'MID', x: 0.38, y: 0.5 },
    { slotIndex: 7, pos: 'CAM', role: 'MID', x: 0.46, y: 0.74 },
    { slotIndex: 8, pos: 'LW', role: 'FWD', x: 0.72, y: 0.18 },
    { slotIndex: 9, pos: 'ST', role: 'FWD', x: 0.78, y: 0.5 },
    { slotIndex: 10, pos: 'RW', role: 'FWD', x: 0.72, y: 0.82 },
  ],
  '4-4-2': [
    { slotIndex: 0, pos: 'GK', role: 'GK', x: 0.06, y: 0.5 },
    { slotIndex: 1, pos: 'LB', role: 'DEF', x: 0.22, y: 0.16 },
    { slotIndex: 2, pos: 'CB', role: 'DEF', x: 0.2, y: 0.38 },
    { slotIndex: 3, pos: 'CB', role: 'DEF', x: 0.2, y: 0.62 },
    { slotIndex: 4, pos: 'RB', role: 'DEF', x: 0.22, y: 0.84 },
    { slotIndex: 5, pos: 'LM', role: 'MID', x: 0.48, y: 0.16 },
    { slotIndex: 6, pos: 'CM', role: 'MID', x: 0.45, y: 0.39 },
    { slotIndex: 7, pos: 'CM', role: 'MID', x: 0.45, y: 0.61 },
    { slotIndex: 8, pos: 'RM', role: 'MID', x: 0.48, y: 0.84 },
    { slotIndex: 9, pos: 'ST', role: 'FWD', x: 0.76, y: 0.36 },
    { slotIndex: 10, pos: 'ST', role: 'FWD', x: 0.76, y: 0.64 },
  ],
  '3-5-2': [
    { slotIndex: 0, pos: 'GK', role: 'GK', x: 0.06, y: 0.5 },
    { slotIndex: 1, pos: 'CB', role: 'DEF', x: 0.21, y: 0.24 },
    { slotIndex: 2, pos: 'CB', role: 'DEF', x: 0.19, y: 0.5 },
    { slotIndex: 3, pos: 'CB', role: 'DEF', x: 0.21, y: 0.76 },
    { slotIndex: 4, pos: 'LM', role: 'MID', x: 0.48, y: 0.14 },
    { slotIndex: 5, pos: 'CDM', role: 'MID', x: 0.4, y: 0.38 },
    { slotIndex: 6, pos: 'CAM', role: 'MID', x: 0.54, y: 0.5 },
    { slotIndex: 7, pos: 'CDM', role: 'MID', x: 0.4, y: 0.62 },
    { slotIndex: 8, pos: 'RM', role: 'MID', x: 0.48, y: 0.86 },
    { slotIndex: 9, pos: 'ST', role: 'FWD', x: 0.76, y: 0.36 },
    { slotIndex: 10, pos: 'ST', role: 'FWD', x: 0.76, y: 0.64 },
  ],
};

export function createSeededRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function getPositionGroup(pos: Position): RoleGroup {
  if (pos === 'GK') return 'GK';
  if (pos === 'LB' || pos === 'CB' || pos === 'RB') return 'DEF';
  if (pos === 'LW' || pos === 'RW' || pos === 'ST') return 'FWD';
  return 'MID';
}

export function isPositionCompatible(cardPos: Position, slotPos: Position, tier: TierId): boolean {
  if (cardPos === slotPos) return true;
  if (tier === 'shapeshifter') return true;
  const g1 = getPositionGroup(cardPos);
  const g2 = getPositionGroup(slotPos);
  if (g1 === 'GK' || g2 === 'GK') return false;
  return g1 === g2;
}

export interface ChemistryResult {
  totalChem: number; // 0..33
  playerChems: number[]; // 0..3 per slot
  oopPenalties: boolean[]; // true if out of position penalty applies
  avgRating: number;
}

export function calculateSquadChemistry(
  squad: (PlayerCard | null)[],
  formation: FormationId
): ChemistryResult {
  const slots = FORMATIONS[formation];
  const playerChems: number[] = new Array(11).fill(0);
  const oopPenalties: boolean[] = new Array(11).fill(false);

  const active = squad.map((card, idx) => ({ card, slot: slots[idx] }));
  const nationCounts: Record<string, number> = {};
  const clubCounts: Record<string, number> = {};
  const leagueCounts: Record<string, number> = {};

  let iconCount = 0;
  let shapeshifterCount = 0;

  for (const { card, slot } of active) {
    if (!card) continue;
    const exactMatch = card.pos === slot.pos || card.tier === 'shapeshifter';
    const groupMatch = getPositionGroup(card.pos) === slot.role;
    if (!exactMatch && !groupMatch) {
      oopPenalties[slot.slotIndex] = true;
    }
    if (card.tier === 'icon') {
      iconCount += 1;
    }
    if (card.tier === 'shapeshifter') {
      shapeshifterCount += 1;
    }
    nationCounts[card.nation] = (nationCounts[card.nation] || 0) + 1;
    const clubWeight = card.tier === 'hero' ? 2 : 1;
    clubCounts[card.club] = (clubCounts[card.club] || 0) + clubWeight;
    const leagueWeight = card.tier === 'hero' ? 2 : 1;
    leagueCounts[card.league] = (leagueCounts[card.league] || 0) + leagueWeight;
  }

  let ratingSum = 0;
  let cardCount = 0;

  for (let i = 0; i < 11; i++) {
    const card = squad[i];
    if (!card) continue;
    cardCount += 1;
    ratingSum += oopPenalties[i] ? Math.max(40, card.ovr - 6) : card.ovr;

    if (oopPenalties[i]) {
      playerChems[i] = 0;
      continue;
    }

    if (card.tier === 'icon' || card.tier === 'hero' || card.tier === 'shapeshifter') {
      playerChems[i] = 3;
      continue;
    }

    let pts = 0;
    const nCount = (nationCounts[card.nation] || 0) + iconCount;
    const cCount = (clubCounts[card.club] || 0) + shapeshifterCount;
    const lCount = (leagueCounts[card.league] || 0) + iconCount + shapeshifterCount;

    if (nCount >= 5) pts += 2;
    else if (nCount >= 2) pts += 1;

    if (cCount >= 4) pts += 2;
    else if (cCount >= 2) pts += 1;

    if (lCount >= 5) pts += 2;
    else if (lCount >= 3) pts += 1;

    playerChems[i] = Math.min(3, pts);
  }

  const totalChem = playerChems.reduce((a, b) => a + b, 0);
  return {
    totalChem,
    playerChems,
    oopPenalties,
    avgRating: cardCount > 0 ? Math.round(ratingSum / cardCount) : 0,
  };
}

export interface SBCCriteria {
  id: string;
  title: string;
  requiredCount: number;
  minAvgOvr: number;
  minShapeshifters?: number;
  minTotwOrSpecial?: number;
  minNations?: number;
}

export function evaluateSBC(
  criteria: SBCCriteria,
  cards: PlayerCard[]
): { valid: boolean; reasons: string[]; avgOvr: number } {
  const reasons: string[] = [];
  if (cards.length < criteria.requiredCount) {
    reasons.push(`Need ${criteria.requiredCount} players (${cards.length}/${criteria.requiredCount})`);
  }
  const avgOvr = cards.length > 0 ? Math.round(cards.reduce((s, c) => s + c.ovr, 0) / cards.length) : 0;
  if (avgOvr < criteria.minAvgOvr) {
    reasons.push(`Squad Rating ${avgOvr} < ${criteria.minAvgOvr}`);
  }
  if (criteria.minShapeshifters) {
    const ss = cards.filter((c) => c.tier === 'shapeshifter').length;
    if (ss < criteria.minShapeshifters) {
      reasons.push(`Shapeshifters ${ss}/${criteria.minShapeshifters}`);
    }
  }
  if (criteria.minTotwOrSpecial) {
    const sp = cards.filter((c) =>
      c.tier === 'totw' || c.tier === 'hero' || c.tier === 'icon' || c.tier === 'shapeshifter'
    ).length;
    if (sp < criteria.minTotwOrSpecial) {
      reasons.push(`Special Cards ${sp}/${criteria.minTotwOrSpecial}`);
    }
  }
  if (criteria.minNations) {
    const uniqueNations = new Set(cards.map((c) => c.nation)).size;
    if (uniqueNations < criteria.minNations) {
      reasons.push(`Unique Nations ${uniqueNations}/${criteria.minNations}`);
    }
  }
  return {
    valid: reasons.length === 0,
    reasons,
    avgOvr,
  };
}

export function getDivisionFromElo(elo: number): number {
  if (elo >= 1900) return 1;
  if (elo >= 1750) return 2;
  if (elo >= 1600) return 3;
  if (elo >= 1450) return 4;
  if (elo >= 1320) return 5;
  if (elo >= 1200) return 6;
  if (elo >= 1100) return 7;
  if (elo >= 1000) return 8;
  if (elo >= 900) return 9;
  return 10;
}

export function calculateEloResult(
  homeGoals: number,
  awayGoals: number,
  currentElo: number
): { eloDelta: number; newElo: number; coinsEarned: number; outcome: 'WIN' | 'LOSS' | 'DRAW' } {
  if (homeGoals > awayGoals) {
    const newElo = currentElo + 25;
    return { eloDelta: 25, newElo, coinsEarned: 150, outcome: 'WIN' };
  }
  if (homeGoals < awayGoals) {
    const newElo = Math.max(500, currentElo - 15);
    return { eloDelta: newElo - currentElo, newElo, coinsEarned: 25, outcome: 'LOSS' };
  }
  return { eloDelta: 5, newElo: currentElo + 5, coinsEarned: 65, outcome: 'DRAW' };
}

export type PackType = 'bronze' | 'gold' | 'elite' | 'shapeshifter' | 'icon';

function pickOvrWeightedCard(source: PlayerCard[], rng: () => number): PlayerCard {
  if (source.length === 1) return source[0];
  let totalW = 0;
  const wList = source.map((c) => {
    // Heavily bias against 84+ and especially 90+ cards so 70s/80s golds are common and 90+ are super rare
    const baseDecay = Math.pow(0.62, Math.max(0, c.ovr - 78));
    const ninetyGate = c.ovr >= 90 ? 0.14 : 1;
    const w = Math.max(0.002, baseDecay * ninetyGate);
    totalW += w;
    return w;
  });
  let r = rng() * totalW;
  for (let i = 0; i < source.length; i++) {
    r -= wList[i];
    if (r <= 0) return source[i];
  }
  return source[source.length - 1];
}

export function rollPackCards(
  packType: PackType,
  pool: PlayerCard[],
  rng: () => number
): { cards: PlayerCard[]; bestCard: PlayerCard; isWalkout: boolean } {
  const weights: Record<PackType, Record<TierId, number>> = {
    bronze: { bronze: 78, silver: 20, gold: 2, elite: 0, totw: 0, hero: 0, icon: 0, shapeshifter: 0 },
    gold: { bronze: 0, silver: 40, gold: 56, elite: 3.4, totw: 0.5, hero: 0.08, icon: 0.01, shapeshifter: 0.01 },
    elite: { bronze: 0, silver: 15, gold: 64, elite: 17, totw: 3, hero: 0.8, icon: 0.1, shapeshifter: 0.1 },
    shapeshifter: { bronze: 0, silver: 0, gold: 45, elite: 38, totw: 11, hero: 4, icon: 0.2, shapeshifter: 1.8 },
    icon: { bronze: 0, silver: 0, gold: 34, elite: 42, totw: 14, hero: 6, icon: 2.5, shapeshifter: 1.5 },
  };

  const leadWeights: Partial<Record<PackType, Record<TierId, number>>> = {
    elite: { bronze: 0, silver: 0, gold: 0, elite: 75, totw: 18, hero: 5.5, icon: 0.75, shapeshifter: 0.75 },
    shapeshifter: { bronze: 0, silver: 0, gold: 0, elite: 50, totw: 28, hero: 12, icon: 1, shapeshifter: 9 },
    icon: { bronze: 0, silver: 0, gold: 0, elite: 40, totw: 28, hero: 16, icon: 11, shapeshifter: 5 },
  };

  const pickFromTable = (table: Record<TierId, number>): TierId => {
    const tiers = Object.keys(table) as TierId[];
    const total = tiers.reduce((acc, t) => acc + table[t], 0);
    let roll = rng() * total;
    for (const t of tiers) {
      roll -= table[t];
      if (roll <= 0) return t;
    }
    return 'gold';
  };

  const cards: PlayerCard[] = [];
  for (let i = 0; i < 3; i++) {
    const table = i === 0 && leadWeights[packType] ? leadWeights[packType]! : weights[packType];
    const tier = pickFromTable(table);
    const matching = pool.filter((p) => p.tier === tier);
    const source = matching.length > 0 ? matching : pool;
    const picked = pickOvrWeightedCard(source, rng);
    cards.push(picked);
  }

  cards.sort((a, b) => b.ovr - a.ovr);
  const bestCard = cards[0];
  const isSpecial =
    bestCard.tier === 'totw' ||
    bestCard.tier === 'hero' ||
    bestCard.tier === 'icon' ||
    bestCard.tier === 'shapeshifter';
  const isWalkout = bestCard.ovr >= 85 || isSpecial;

  return { cards, bestCard, isWalkout };
}

export interface PitchDot {
  id: string;
  team: 'home' | 'away';
  slotIndex: number;
  shirtNum: number;
  name: string;
  role: RoleGroup;
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  kickoffX?: number;
  kickoffY?: number;
  pac: number;
  sho: number;
  pas: number;
  dri: number;
  def: number;
  redCarded: boolean;
  yellowCards: number;
  diveTimer: number;
  diveVy: number;
}

export interface PitchBall {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  ownerId: string | null;
  lastTouchTeam: 'home' | 'away' | null;
  kickCooldown: number;
}

export interface SimMatchState {
  pitchW: number;
  pitchH: number;
  dots: PitchDot[];
  ball: PitchBall;
  homeScore: number;
  awayScore: number;
  homeShots: number;
  awayShots: number;
  homePossessionTicks: number;
  awayPossessionTicks: number;
  elapsedMinutes: number; // 0..90
  freezeTicks: number;
  goalBannerTimer: number;
  lastEvent: string | null;
  kickoffTimer?: number;
  carryTime?: number;
  passTargetId?: string | null;
  shotInFlight?: { team: 'home' | 'away'; shooterName: string } | null;
  gkHoldTimer?: number;
}

function distPointToSeg(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-6) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

export function stepMatchPhysics(state: SimMatchState, dt: number, rng: () => number): string[] {
  const events: string[] = [];
  const { pitchW, pitchH, ball, dots } = state;
  const padX = Math.round(pitchW * 0.028);
  const padY = Math.round(pitchH * 0.039);
  const goalTop = pitchH * 0.415;
  const goalBot = pitchH * 0.585;

  if (state.freezeTicks > 0) {
    state.freezeTicks -= 1;
    return events;
  }

  if (state.goalBannerTimer > 0) {
    state.goalBannerTimer -= dt;
  }
  if ((state.kickoffTimer || 0) > 0) {
    state.kickoffTimer = Math.max(0, (state.kickoffTimer || 0) - dt);
  }
  if ((state.gkHoldTimer || 0) > 0) {
    state.gkHoldTimer = Math.max(0, (state.gkHoldTimer || 0) - dt);
  }

  if (ball.kickCooldown > 0) {
    ball.kickCooldown = Math.max(0, ball.kickCooldown - dt);
  }

  const prevX = ball.x;
  const prevY = ball.y;

  // Advance ball
  if (!ball.ownerId) {
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    ball.z = Math.max(0, ball.z + ball.vz * dt);
    if (ball.z > 0) {
      ball.vz -= 460 * dt;
      if (ball.z <= 0) {
        ball.z = 0;
        ball.vz = Math.abs(ball.vz) > 45 ? -ball.vz * 0.35 : 0;
      }
    }
    const friction = ball.z > 2 ? 0.992 : 0.974;
    ball.vx *= Math.pow(friction, dt * 60);
    ball.vy *= Math.pow(friction, dt * 60);
    if (Math.hypot(ball.vx, ball.vy) < 40) {
      state.shotInFlight = null;
    }
  }

  // Check GK swept saves before goal line check so rockets cannot tunnel through keepers
  if (!ball.ownerId && ball.kickCooldown <= 0 && ball.z < 52) {
    for (const gk of dots) {
      if (gk.redCarded || gk.role !== 'GK') continue;
      const gkReach = 22 + (gk.def / 100) * 14;
      const segDist = distPointToSeg(gk.x, gk.y, prevX, prevY, ball.x, ball.y);
      if (segDist < gkReach) {
        const isShot = Boolean(state.shotInFlight && state.shotInFlight.team !== gk.team);
        const speed = Math.hypot(ball.vx, ball.vy);
        if (isShot || speed > 220) {
          const catchChance = 0.52 + (gk.def / 100) * 0.25 - Math.min(0.25, speed / 2600);
          if (rng() < catchChance) {
            ball.ownerId = gk.id;
            ball.lastTouchTeam = gk.team;
            ball.x = gk.x;
            ball.y = gk.y;
            ball.vx = 0;
            ball.vy = 0;
            ball.vz = 0;
            ball.z = 0;
            ball.kickCooldown = 0.22;
            state.gkHoldTimer = 0.45;
            state.shotInFlight = null;
            state.passTargetId = null;
            events.push(`SAVE_${gk.team.toUpperCase()}`);
          } else {
            // Parry wide away from goal mouth
            const clearDir = gk.team === 'home' ? 1 : -1;
            const sideSign = ball.y >= pitchH / 2 ? 1 : -1;
            ball.ownerId = null;
            ball.lastTouchTeam = gk.team;
            ball.x = gk.x + clearDir * 10;
            ball.vx = clearDir * (170 + rng() * 110);
            ball.vy = sideSign * (210 + rng() * 140);
            ball.vz = 65;
            ball.kickCooldown = 0.28;
            gk.diveTimer = 0.36;
            gk.diveVy = (ball.y - gk.y) * 2.2;
            state.shotInFlight = null;
            state.passTargetId = null;
            events.push(`SAVE_${gk.team.toUpperCase()}`);
          }
          break;
        }
      }
    }
  }

  const inGoalMouthY = ball.y >= goalTop && ball.y <= goalBot;

  // Check goal or endline restart (Goal Kick / Corner)
  if (!ball.ownerId && ball.x <= padX) {
    if (inGoalMouthY && ball.z < 50) {
      state.awayScore += 1;
      state.goalBannerTimer = 2.0;
      state.freezeTicks = 40;
      events.push('GOAL_AWAY');
      resetKickoff(state, 'home');
      return events;
    }
    state.shotInFlight = null;
    state.passTargetId = null;
    if (Math.abs(ball.y - goalTop) < 12 || Math.abs(ball.y - goalBot) < 12) {
      events.push('WOODWORK');
    }
    if (ball.lastTouchTeam === 'home') {
      // Corner kick for Away
      ball.x = padX + 14;
      ball.y = ball.y < pitchH / 2 ? padY + 14 : pitchH - padY - 14;
      ball.z = 0;
      ball.vx = 0;
      ball.vy = 0;
      ball.vz = 0;
      ball.kickCooldown = 0.25;
      const taker = dots.find((d) => d.team === 'away' && !d.redCarded && d.role === 'FWD')
        || dots.find((d) => d.team === 'away' && !d.redCarded && d.role !== 'GK');
      if (taker) {
        taker.x = ball.x;
        taker.y = ball.y;
        ball.ownerId = taker.id;
        ball.lastTouchTeam = 'away';
      }
      events.push('CORNER_AWAY');
    } else {
      // Goal kick for Home GK
      const gk = dots.find((d) => d.team === 'home' && d.role === 'GK');
      ball.x = padX + 34;
      ball.y = pitchH * 0.5;
      ball.z = 0;
      ball.vx = 0;
      ball.vy = 0;
      ball.vz = 0;
      ball.kickCooldown = 0.25;
      if (gk) {
        gk.x = ball.x;
        gk.y = ball.y;
        ball.ownerId = gk.id;
        ball.lastTouchTeam = 'home';
        state.gkHoldTimer = 0.35;
      }
      events.push('GOALKICK_HOME');
    }
  } else if (!ball.ownerId && ball.x >= pitchW - padX) {
    if (inGoalMouthY && ball.z < 50) {
      state.homeScore += 1;
      state.goalBannerTimer = 2.0;
      state.freezeTicks = 40;
      events.push('GOAL_HOME');
      resetKickoff(state, 'away');
      return events;
    }
    state.shotInFlight = null;
    state.passTargetId = null;
    if (Math.abs(ball.y - goalTop) < 12 || Math.abs(ball.y - goalBot) < 12) {
      events.push('WOODWORK');
    }
    if (ball.lastTouchTeam === 'away') {
      // Corner kick for Home
      ball.x = pitchW - padX - 14;
      ball.y = ball.y < pitchH / 2 ? padY + 14 : pitchH - padY - 14;
      ball.z = 0;
      ball.vx = 0;
      ball.vy = 0;
      ball.vz = 0;
      ball.kickCooldown = 0.25;
      const taker = dots.find((d) => d.team === 'home' && !d.redCarded && d.role === 'FWD')
        || dots.find((d) => d.team === 'home' && !d.redCarded && d.role !== 'GK');
      if (taker) {
        taker.x = ball.x;
        taker.y = ball.y;
        ball.ownerId = taker.id;
        ball.lastTouchTeam = 'home';
      }
      events.push('CORNER_HOME');
    } else {
      // Goal kick for Away GK
      const gk = dots.find((d) => d.team === 'away' && d.role === 'GK');
      ball.x = pitchW - padX - 34;
      ball.y = pitchH * 0.5;
      ball.z = 0;
      ball.vx = 0;
      ball.vy = 0;
      ball.vz = 0;
      ball.kickCooldown = 0.25;
      if (gk) {
        gk.x = ball.x;
        gk.y = ball.y;
        ball.ownerId = gk.id;
        ball.lastTouchTeam = 'away';
        state.gkHoldTimer = 0.35;
      }
      events.push('GOALKICK_AWAY');
    }
  }

  // Sideline throw-ins
  if (!ball.ownerId && (ball.y <= padY || ball.y >= pitchH - padY)) {
    state.shotInFlight = null;
    state.passTargetId = null;
    const clampY = ball.y <= padY ? padY + 8 : pitchH - padY - 8;
    const clampX = Math.max(padX + 20, Math.min(pitchW - padX - 20, ball.x));
    const throwTeam = ball.lastTouchTeam === 'home' ? 'away' : 'home';
    let taker: PitchDot | null = null;
    let bestD = Infinity;
    for (const d of dots) {
      if (d.redCarded || d.role === 'GK' || d.team !== throwTeam) continue;
      const dist = Math.hypot(d.x - clampX, d.y - clampY);
      if (dist < bestD) {
        bestD = dist;
        taker = d;
      }
    }
    ball.x = clampX;
    ball.y = clampY;
    ball.z = 0;
    ball.vx = 0;
    ball.vy = 0;
    ball.vz = 0;
    ball.kickCooldown = 0.25;
    if (taker) {
      taker.x = clampX;
      taker.y = clampY;
      ball.ownerId = taker.id;
      ball.lastTouchTeam = throwTeam;
    }
  }

  // Possession tracking
  if (ball.lastTouchTeam === 'home') state.homePossessionTicks += 1;
  else if (ball.lastTouchTeam === 'away') state.awayPossessionTicks += 1;
  if (ball.ownerId) {
    state.carryTime = (state.carryTime || 0) + dt;
  } else {
    state.carryTime = 0;
  }

  // Find nearest presser per team & second-last defenders for offside awareness
  let nearestHome: PitchDot | null = null;
  let nearestHomeDist = Infinity;
  let nearestAway: PitchDot | null = null;
  let nearestAwayDist = Infinity;
  const homeXs: number[] = [];
  const awayXs: number[] = [];

  for (const d of dots) {
    if (d.redCarded) continue;
    if (d.team === 'home') homeXs.push(d.x);
    else awayXs.push(d.x);
    if (d.role === 'GK') continue;
    const dist = Math.hypot(ball.x - d.x, ball.y - d.y);
    if (d.team === 'home' && dist < nearestHomeDist) {
      nearestHomeDist = dist;
      nearestHome = d;
    }
    if (d.team === 'away' && dist < nearestAwayDist) {
      nearestAwayDist = dist;
      nearestAway = d;
    }
  }
  homeXs.sort((a, b) => a - b);
  awayXs.sort((a, b) => b - a);
  const homeBackLineX = homeXs[1] ?? padX + 120;
  const awayBackLineX = awayXs[1] ?? pitchW - padX - 120;

  const ballRatioX = ball.x / pitchW;
  const ownerDot = ball.ownerId ? dots.find((d) => d.id === ball.ownerId) || null : null;
  const possessingTeam = ownerDot ? ownerDot.team : ball.lastTouchTeam;

  for (const dot of dots) {
    if (dot.redCarded) continue;

    if (dot.diveTimer > 0) {
      dot.diveTimer = Math.max(0, dot.diveTimer - dt);
      dot.y = Math.max(goalTop - 6, Math.min(goalBot + 6, dot.y + dot.diveVy * dt));
      continue;
    }

    const isOwner = ball.ownerId === dot.id;
    const speedBase = 86 + dot.pac * 1.1;
    let targetX = dot.homeX;
    let targetY = dot.homeY;

    if (dot.role === 'GK') {
      const baseX = dot.team === 'home' ? padX + 20 : pitchW - padX - 20;
      const stepOut = dot.team === 'home'
        ? (ball.x < pitchW * 0.25 ? 16 : 0)
        : (ball.x > pitchW * 0.75 ? -16 : 0);
      targetX = isOwner ? baseX : baseX + stepOut;
      targetY = Math.max(goalTop + 10, Math.min(goalBot - 10, ball.y));
    } else if (isOwner) {
      const attackDir = dot.team === 'home' ? 1 : -1;
      let repelX = 0;
      let repelY = 0;
      for (const opp of dots) {
        if (opp.team === dot.team || opp.redCarded) continue;
        const od = Math.hypot(dot.x - opp.x, dot.y - opp.y);
        if (od < 72 && od > 1) {
          repelX += ((dot.x - opp.x) / od) * ((72 - od) / 72) * 90;
          repelY += ((dot.y - opp.y) / od) * ((72 - od) / 72) * 90;
        }
      }
      targetX = Math.max(padX + 20, Math.min(pitchW - padX - 20, dot.x + attackDir * 135 + repelX));
      targetY = Math.max(padY + 25, Math.min(pitchH - padY - 25, dot.y + (pitchH * 0.5 - dot.y) * 0.28 + repelY));
    } else if (state.passTargetId === dot.id && !ball.ownerId) {
      targetX = ball.x + ball.vx * 0.16;
      targetY = ball.y + ball.vy * 0.16;
    } else if (dot === nearestHome || dot === nearestAway) {
      targetX = ball.x;
      targetY = ball.y;
    } else {
      const teamAttacking = possessingTeam === dot.team;
      const attackDir = dot.team === 'home' ? 1 : -1;
      const phaseBias = teamAttacking ? attackDir * pitchW * 0.08 : -attackDir * pitchW * 0.09;
      const shiftX = (ballRatioX - 0.5) * pitchW * 0.42 + phaseBias;
      targetX = dot.homeX + shiftX;
      targetY = dot.homeY + (ball.y - pitchH * 0.5) * 0.26;
      if (teamAttacking && dot.role === 'FWD') {
        targetX += attackDir * 55;
        if (dot.team === 'home') {
          targetX = Math.min(targetX, awayBackLineX - 8);
        } else {
          targetX = Math.max(targetX, homeBackLineX + 8);
        }
      } else if (!teamAttacking && dot.role === 'DEF') {
        // Shield between ball and own goal
        const ownGoalX = dot.team === 'home' ? padX + 55 : pitchW - padX - 55;
        targetX = ownGoalX * 0.35 + targetX * 0.65;
      }
      targetX = Math.max(padX + 30, Math.min(pitchW - padX - 30, targetX));
      targetY = Math.max(padY + 26, Math.min(pitchH - padY - 26, targetY));
    }

    const dx = targetX - dot.x;
    const dy = targetY - dot.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 3) {
      const turnRate = 0.1 + (dot.dri / 100) * 0.14;
      const desiredVx = (dx / dist) * speedBase;
      const desiredVy = (dy / dist) * speedBase;
      dot.vx += (desiredVx - dot.vx) * turnRate;
      dot.vy += (desiredVy - dot.vy) * turnRate;
      dot.x = Math.max(padX + 10, Math.min(pitchW - padX - 10, dot.x + dot.vx * dt));
      dot.y = Math.max(padY + 10, Math.min(pitchH - padY - 10, dot.y + dot.vy * dt));
    }

    // Outfield ball pickup / interception / tackle / shot block
    if (dot.role !== 'GK' && ball.kickCooldown <= 0 && ball.z < 26) {
      const segDist = distPointToSeg(dot.x, dot.y, prevX, prevY, ball.x, ball.y);
      const reach = 12 + (dot.def > 80 ? 3 : 0);
      if (segDist < reach) {
        if (state.shotInFlight && state.shotInFlight.team !== dot.team && !ball.ownerId) {
          // Defender blocks shot!
          ball.vx = (dot.team === 'home' ? 1 : -1) * (110 + rng() * 90);
          ball.vy = (rng() - 0.5) * 180;
          ball.vz = 25;
          ball.lastTouchTeam = dot.team;
          ball.kickCooldown = 0.25;
          state.shotInFlight = null;
          events.push(`BLOCK_${dot.team.toUpperCase()}`);
          continue;
        }
        if (!ball.ownerId || (ball.lastTouchTeam !== dot.team && rng() < 0.24 + (dot.def / 100) * 0.42)) {
          if (ball.ownerId && ball.lastTouchTeam !== dot.team) {
            events.push(`TACKLE_${dot.team.toUpperCase()}`);
            if (rng() < 0.04) events.push(`FOUL_${dot.team.toUpperCase()}`);
          }
          ball.ownerId = dot.id;
          ball.lastTouchTeam = dot.team;
          ball.z = 0;
          ball.vz = 0;
          ball.kickCooldown = 0.16;
          state.carryTime = 0;
          state.passTargetId = null;
          state.shotInFlight = null;
        }
      }
    }

    // Owner decision: GK distribution, kickoff back-pass, shoot, or pass
    if (ball.ownerId === dot.id) {
      ball.x = dot.x + (dot.team === 'home' ? 8 : -8);
      ball.y = dot.y;
      ball.vx = dot.vx;
      ball.vy = dot.vy;

      // GK calm distribution to defender/midfielder
      if (dot.role === 'GK') {
        if ((state.gkHoldTimer || 0) <= 0) {
          const mates = dots.filter((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded && m.role !== 'FWD');
          const pool = mates.length > 0 ? mates : dots.filter((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded);
          if (pool.length > 0) {
            const target = pool[Math.floor(rng() * pool.length)];
            const pdx = target.x - dot.x;
            const pdy = target.y - dot.y;
            const pLen = Math.hypot(pdx, pdy) || 1;
            const passSpeed = Math.min(420, 230 + pLen * 0.75);
            ball.ownerId = null;
            ball.vx = (pdx / pLen) * passSpeed;
            ball.vy = (pdy / pLen) * passSpeed;
            ball.vz = pLen > 240 ? 95 : 10;
            ball.kickCooldown = 0.24;
            state.passTargetId = target.id;
            events.push(`PASS_${dot.team.toUpperCase()}`);
          }
        }
        continue;
      }

      // Kickoff forced safe back-pass to midfield
      if ((state.kickoffTimer || 0) > 0) {
        if ((state.kickoffTimer || 0) < 0.35) {
          const mids = dots.filter((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded && m.role === 'MID');
          const target = mids[0] || dots.find((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded);
          if (target) {
            const pdx = target.x - dot.x;
            const pdy = target.y - dot.y;
            const pLen = Math.hypot(pdx, pdy) || 1;
            const passSpeed = 240;
            ball.ownerId = null;
            ball.vx = (pdx / pLen) * passSpeed;
            ball.vy = (pdy / pLen) * passSpeed;
            ball.vz = 5;
            ball.kickCooldown = 0.24;
            state.kickoffTimer = 0;
            state.passTargetId = target.id;
            events.push(`PASS_${dot.team.toUpperCase()}`);
          }
        }
        continue;
      }

      let nearestOppDist = Infinity;
      for (const opp of dots) {
        if (opp.team === dot.team || opp.redCarded) continue;
        const d = Math.hypot(opp.x - dot.x, opp.y - dot.y);
        if (d < nearestOppDist) nearestOppDist = d;
      }

      const goalX = dot.team === 'home' ? pitchW - padX : padX;
      const distToGoal = Math.hypot(goalX - dot.x, pitchH * 0.5 - dot.y);
      const maxShotRange = pitchW * 0.22;
      const goodAngle = Math.abs(dot.y - pitchH * 0.5) < pitchH * 0.28;
      const shotProb = distToGoal < pitchW * 0.13 ? 0.16 : 0.055 + (dot.sho / 100) * 0.06;

      if ((state.carryTime || 0) > 0.14 && distToGoal < maxShotRange && goodAngle && rng() < shotProb) {
        const spread = ((105 - dot.sho) / 100) * (pitchH * 0.13) + (nearestOppDist < 34 ? pitchH * 0.04 : 0);
        const aimY = pitchH * 0.5 + (rng() - 0.5) * (goalBot - goalTop + spread * 2);
        const sdx = goalX - dot.x;
        const sdy = aimY - dot.y;
        const sLen = Math.hypot(sdx, sdy) || 1;
        const shotSpeed = 420 + dot.sho * 2.1;
        ball.ownerId = null;
        ball.vx = (sdx / sLen) * shotSpeed;
        ball.vy = (sdy / sLen) * shotSpeed;
        ball.vz = 18 + rng() * 45;
        ball.kickCooldown = 0.28;
        state.shotInFlight = { team: dot.team, shooterName: dot.name };
        state.passTargetId = null;
        if (dot.team === 'home') state.homeShots += 1;
        else state.awayShots += 1;
        events.push(`SHOT_${dot.team.toUpperCase()}:${dot.name}`);
      } else {
        const underPressure = nearestOppDist < 42;
        const passChance = ((state.carryTime || 0) > 0.25 ? 0.065 : 0.02) + (dot.pas / 100) * 0.06 + (underPressure ? 0.09 : 0);
        if (rng() < passChance) {
          const mates = dots.filter((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded && m.role !== 'GK');
          if (mates.length > 0) {
            const attackDir = dot.team === 'home' ? 1 : -1;
            let bestMate = mates[0];
            let bestScore = -Infinity;
            for (const m of mates) {
              const progress = (m.x - dot.x) * attackDir;
              const distM = Math.hypot(m.x - dot.x, m.y - dot.y);
              if (distM < 35) continue;
              let minLaneOpp = Infinity;
              let minRecOpp = Infinity;
              for (const opp of dots) {
                if (opp.team === dot.team || opp.redCarded) continue;
                const dLane = distPointToSeg(opp.x, opp.y, dot.x, dot.y, m.x, m.y);
                if (dLane < minLaneOpp) minLaneOpp = dLane;
                const dRec = Math.hypot(opp.x - m.x, opp.y - m.y);
                if (dRec < minRecOpp) minRecOpp = dRec;
              }
              let score = progress * 0.55 + Math.min(90, minRecOpp) * 1.1 + (minLaneOpp < 20 ? -160 : minLaneOpp * 0.8);
              if (underPressure && progress < 0) score += 45;
              if (score > bestScore) {
                bestScore = score;
                bestMate = m;
              }
            }
            const err = ((100 - dot.pas) / 100) * 28;
            const pdx = bestMate.x + bestMate.vx * 0.18 + (rng() - 0.5) * err - dot.x;
            const pdy = bestMate.y + bestMate.vy * 0.18 + (rng() - 0.5) * err - dot.y;
            const pLen = Math.hypot(pdx, pdy) || 1;
            const passSpeed = Math.min(440, 235 + pLen * 0.78);
            ball.ownerId = null;
            ball.vx = (pdx / pLen) * passSpeed;
            ball.vy = (pdy / pLen) * passSpeed;
            ball.vz = pLen > 260 ? 85 : 6;
            ball.kickCooldown = 0.22;
            state.passTargetId = bestMate.id;
            events.push(`PASS_${dot.team.toUpperCase()}`);
          }
        }
      }
    }
  }

  return events;
}

export function resetKickoff(state: SimMatchState, kickingTeam: 'home' | 'away' = 'home'): void {
  const { pitchW, pitchH, ball, dots } = state;
  const padX = Math.round(pitchW * 0.028);
  const padY = Math.round(pitchH * 0.039);
  ball.x = pitchW / 2;
  ball.y = pitchH / 2;
  ball.z = 0;
  ball.vx = 0;
  ball.vy = 0;
  ball.vz = 0;
  ball.ownerId = null;
  ball.kickCooldown = 0.22;
  state.kickoffTimer = 0.55;
  state.carryTime = 0;
  state.passTargetId = null;
  state.shotInFlight = null;

  let taker: PitchDot | null = null;
  for (const d of dots) {
    // Keep all players inside their own half on kickoff
    const defaultKoX = d.team === 'home'
      ? Math.min(pitchW / 2 - 22, padX + (d.homeX - padX) * 0.56)
      : Math.max(pitchW / 2 + 22, pitchW - padX - (pitchW - padX - d.homeX) * 0.56);
    const defaultKoY = Math.max(padY + 24, Math.min(pitchH - padY - 24, d.homeY));
    d.x = d.kickoffX ?? defaultKoX;
    d.y = d.kickoffY ?? defaultKoY;
    d.vx = 0;
    d.vy = 0;
    d.diveTimer = 0;
    if (!d.redCarded && d.team === kickingTeam && d.role === 'FWD') {
      taker = d;
    }
  }
  if (!taker) {
    taker = dots.find((d) => !d.redCarded && d.team === kickingTeam && d.role !== 'GK') || null;
  }
  if (taker) {
    taker.x = pitchW / 2 + (kickingTeam === 'home' ? -8 : 8);
    taker.y = pitchH / 2;
    ball.ownerId = taker.id;
    ball.lastTouchTeam = kickingTeam;
  }
}
