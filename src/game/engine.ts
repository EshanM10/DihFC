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
    fin?: number;
    pas: number;
    vis?: number;
    dri: number;
    def: number;
    phy: number;
  };
  shirtNum: number;
  isOutOfPositionSpecial?: boolean;
}

export interface SubTierInfo {
  id: string;
  label: string;
  shortLabel: string;
  cssClass: string;
  rank: number;
}

export function getCardSubTier(card: Pick<PlayerCard, 'tier' | 'ovr'>): SubTierInfo {
  const ovr = Number(card.ovr) || 60;
  switch (card.tier) {
    case 'bronze':
      return ovr >= 57
        ? { id: 'bronze-rare', label: 'RARE BRONZE', shortLabel: 'RARE BRONZE', cssClass: 'subtier-rare', rank: 2 }
        : { id: 'bronze-common', label: 'COMMON BRONZE', shortLabel: 'BRONZE', cssClass: 'subtier-common', rank: 1 };
    case 'silver':
      return ovr >= 70
        ? { id: 'silver-rare', label: 'RARE SILVER', shortLabel: 'RARE SILVER', cssClass: 'subtier-rare', rank: 2 }
        : { id: 'silver-common', label: 'COMMON SILVER', shortLabel: 'SILVER', cssClass: 'subtier-common', rank: 1 };
    case 'gold':
      if (ovr >= 82) return { id: 'gold-walkout', label: 'GOLD WALKOUT', shortLabel: 'GOLD STAR', cssClass: 'subtier-walkout', rank: 3 };
      if (ovr >= 79) return { id: 'gold-rare', label: 'RARE GOLD', shortLabel: 'RARE GOLD', cssClass: 'subtier-rare', rank: 2 };
      return { id: 'gold-common', label: 'NON-RARE GOLD', shortLabel: 'GOLD', cssClass: 'subtier-common', rank: 1 };
    case 'elite':
      if (ovr >= 88) return { id: 'elite-galactico', label: 'GALACTICO', shortLabel: 'GALACTICO', cssClass: 'subtier-galactico', rank: 3 };
      if (ovr >= 86) return { id: 'elite-worldclass', label: 'WORLD CLASS', shortLabel: 'WORLD CLASS', cssClass: 'subtier-worldclass', rank: 2 };
      return { id: 'elite-star', label: 'ELITE STAR', shortLabel: 'ELITE', cssClass: 'subtier-rare', rank: 1 };
    case 'totw':
      if (ovr >= 89) return { id: 'totw-superstar', label: 'TOTW SUPERSTAR', shortLabel: 'IF SUPER', cssClass: 'subtier-superstar', rank: 3 };
      if (ovr >= 86) return { id: 'totw-master', label: 'TOTW MASTER', shortLabel: 'IF MASTER', cssClass: 'subtier-master', rank: 2 };
      return { id: 'totw-inform', label: 'TOTW IN-FORM', shortLabel: 'IN-FORM', cssClass: 'subtier-rare', rank: 1 };
    case 'hero':
      return ovr >= 88
        ? { id: 'hero-prime', label: 'PRIME HERO', shortLabel: 'PRIME HERO', cssClass: 'subtier-prime', rank: 2 }
        : { id: 'hero-cult', label: 'CULT HERO', shortLabel: 'CULT HERO', cssClass: 'subtier-rare', rank: 1 };
    case 'icon':
      if (ovr >= 92) return { id: 'icon-immortal', label: 'IMMORTAL ICON', shortLabel: 'IMMORTAL', cssClass: 'subtier-immortal', rank: 3 };
      if (ovr >= 89) return { id: 'icon-prime', label: 'PRIME ICON', shortLabel: 'PRIME ICON', cssClass: 'subtier-prime', rank: 2 };
      return { id: 'icon-base', label: 'BASE ICON', shortLabel: 'BASE ICON', cssClass: 'subtier-rare', rank: 1 };
    case 'shapeshifter':
      return ovr >= 91
        ? { id: 'ss-apex', label: 'APEX SHIFTER', shortLabel: 'APEX SS', cssClass: 'subtier-apex', rank: 2 }
        : { id: 'ss-glitch', label: 'GLITCH SHIFTER', shortLabel: 'GLITCH SS', cssClass: 'subtier-rare', rank: 1 };
    default:
      return { id: 'standard', label: 'STANDARD', shortLabel: 'CARD', cssClass: 'subtier-common', rank: 1 };
  }
}

export type MentalityId =
  | 'PARK_THE_BUS'
  | 'COUNTER'
  | 'BALANCED'
  | 'TIKI_TAKA'
  | 'WING_PLAY'
  | 'GEGENPRESS'
  | 'ALL_OUT'
  | 'CUSTOM';

export interface TeamTactics {
  mentality: MentalityId;
  passIntensity: number;      // 0..100 (low = patient carry/dribble, high = quick passing)
  dribbleTendency: number;    // 0..100 (how eagerly carriers take defenders on 1v1)
  crossIntensity: number;     // 0..100 (wide players whipping crosses into box)
  shootIntensity: number;     // 0..100 (long-shot & shot trigger eagerness)
  aggressiveness: number;     // 0..100 (pressing urgency & tackle/card risk)
  positioningLine: number;    // 0..100 (0 = deep low block, 100 = high offside trap)
  positioningFreedom: number; // 0..100 (0 = strict formation discipline, 100 = fluid roaming)
  manMarking: number;         // 0..100 (0 = zonal defense, 100 = tight 1v1 marking)
}

export const DEFAULT_TACTICS: TeamTactics = {
  mentality: 'BALANCED',
  passIntensity: 45,
  dribbleTendency: 52,
  crossIntensity: 48,
  shootIntensity: 50,
  aggressiveness: 50,
  positioningLine: 50,
  positioningFreedom: 45,
  manMarking: 40,
};

export const TACTIC_PRESETS: Record<Exclude<MentalityId, 'CUSTOM'>, { label: string; desc: string; tactics: TeamTactics }> = {
  PARK_THE_BUS: {
    label: 'Park the Bus',
    desc: 'Deep low block, tight man-marking, low risk passing, absorb pressure.',
    tactics: {
      mentality: 'PARK_THE_BUS',
      passIntensity: 32,
      dribbleTendency: 28,
      crossIntensity: 30,
      shootIntensity: 35,
      aggressiveness: 38,
      positioningLine: 18,
      positioningFreedom: 18,
      manMarking: 76,
    },
  },
  COUNTER: {
    label: 'Counter Attack',
    desc: 'Compact mid-block that springs direct dribbles & fast vertical balls.',
    tactics: {
      mentality: 'COUNTER',
      passIntensity: 48,
      dribbleTendency: 68,
      crossIntensity: 55,
      shootIntensity: 62,
      aggressiveness: 46,
      positioningLine: 34,
      positioningFreedom: 42,
      manMarking: 52,
    },
  },
  BALANCED: {
    label: 'Balanced',
    desc: 'Natural shape, measured build-up, balanced dribbling and shots.',
    tactics: { ...DEFAULT_TACTICS },
  },
  TIKI_TAKA: {
    label: 'Tiki-Taka',
    desc: 'Short triangles, fluid movement, patient shot selection inside the box.',
    tactics: {
      mentality: 'TIKI_TAKA',
      passIntensity: 78,
      dribbleTendency: 48,
      crossIntensity: 24,
      shootIntensity: 40,
      aggressiveness: 58,
      positioningLine: 68,
      positioningFreedom: 72,
      manMarking: 30,
    },
  },
  WING_PLAY: {
    label: 'Wing Play & Cross',
    desc: 'Stretch flanks, carry wide, whip early & byline crosses to strikers.',
    tactics: {
      mentality: 'WING_PLAY',
      passIntensity: 44,
      dribbleTendency: 64,
      crossIntensity: 88,
      shootIntensity: 52,
      aggressiveness: 50,
      positioningLine: 55,
      positioningFreedom: 56,
      manMarking: 38,
    },
  },
  GEGENPRESS: {
    label: 'Gegenpress',
    desc: 'Relentless high line pressing, tight man-marking, aggressive tackles.',
    tactics: {
      mentality: 'GEGENPRESS',
      passIntensity: 56,
      dribbleTendency: 54,
      crossIntensity: 46,
      shootIntensity: 64,
      aggressiveness: 88,
      positioningLine: 82,
      positioningFreedom: 64,
      manMarking: 84,
    },
  },
  ALL_OUT: {
    label: 'All-Out Attack',
    desc: 'Push everyone forward, shoot on sight, maximum attacking waves.',
    tactics: {
      mentality: 'ALL_OUT',
      passIntensity: 52,
      dribbleTendency: 72,
      crossIntensity: 70,
      shootIntensity: 86,
      aggressiveness: 76,
      positioningLine: 88,
      positioningFreedom: 82,
      manMarking: 48,
    },
  },
};

export function getPlayerTraits(card: PlayerCard): string[] {
  const traits: string[] = [];
  const fin = card.stats.fin ?? card.stats.sho;
  const vis = card.stats.vis ?? card.stats.pas;
  if (card.pos === 'GK') {
    if (card.stats.pac >= 65 || vis >= 80 || card.stats.pas >= 78) traits.push('Sweeper Keeper');
    else traits.push('Shot Stopper');
    return traits;
  }
  if (card.stats.dri >= 82 || (card.stats.pac >= 84 && card.stats.dri >= 76)) {
    traits.push('Speed Dribbler');
  }
  if ((card.pos === 'LW' || card.pos === 'RW' || card.pos === 'LM' || card.pos === 'RM' || card.pos === 'LB' || card.pos === 'RB') && card.stats.pas >= 72) {
    traits.push('Whipped Crosser');
  }
  if ((card.pos === 'CAM' || card.pos === 'CM') && (vis >= 82 || card.stats.pas >= 78)) {
    traits.push('Playmaker');
  }
  if (card.pos === 'ST' && fin >= 78) {
    traits.push(card.stats.phy >= 80 ? 'Target Finisher' : 'Clinical Poacher');
  } else if (card.stats.sho >= 82) {
    traits.push('Long Shot');
  }
  if ((card.pos === 'CB' || card.pos === 'CDM') && card.stats.def >= 76) {
    traits.push('Ball Winner');
  }
  if (card.tier === 'shapeshifter' || card.isOutOfPositionSpecial) {
    traits.push('Wildcard');
  }
  if (traits.length === 0) {
    traits.push(card.stats.pas >= card.stats.def ? 'Box-to-Box' : 'Anchor');
  }
  return traits.slice(0, 2);
}

export function getCardShardValue(card: PlayerCard): { buyPrice: number; sellValue: number } {
  const tierMult: Record<TierId, number> = {
    bronze: 1.0,
    silver: 1.35,
    gold: 1.75,
    elite: 2.5,
    totw: 3.1,
    hero: 3.5,
    icon: 4.8,
    shapeshifter: 4.5,
  };
  const base = Math.max(20, Math.round(Math.pow(Math.max(1, card.ovr - 42), 1.56) * (tierMult[card.tier] || 1.25)));
  const buyPrice = Math.max(25, Math.round(base / 5) * 5);
  const sellValue = Math.max(10, Math.round((buyPrice * 0.4) / 2) * 2);
  return { buyPrice, sellValue };
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
  pos?: Position;
  role: RoleGroup;
  traits?: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  kickoffX?: number;
  kickoffY?: number;
  ovr?: number;
  pac: number;
  sho: number;
  fin?: number;
  pas: number;
  vis?: number;
  dri: number;
  def: number;
  phy?: number;
  redCarded: boolean;
  yellowCards: number;
  diveTimer: number;
  diveVy: number;
  dribbleCD?: number;
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
  homeTactics?: TeamTactics;
  awayTactics?: TeamTactics;
  homePasses?: number;
  awayPasses?: number;
  homeCrosses?: number;
  awayCrosses?: number;
  homeDribbles?: number;
  awayDribbles?: number;
  homeTackles?: number;
  awayTackles?: number;
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

  // Nonlinear stat normalizer: OVR & stats create a clear real-football skill gap
  const statNorm = (val: number) => Math.pow(Math.max(0, Math.min(1, (val - 35) / 64)), 1.45);
  const dotOvr = (d: PitchDot) => d.ovr ?? Math.round((d.pac + d.sho + d.pas + d.dri + d.def + (d.phy ?? 70)) / 6);

  // Check GK swept saves before goal line check so rockets cannot tunnel through keepers
  if (!ball.ownerId && ball.kickCooldown <= 0 && ball.z < 52) {
    for (const gk of dots) {
      if (gk.redCarded || gk.role !== 'GK') continue;
      const gkDefN = statNorm(gk.def);
      const gkOvrN = statNorm(dotOvr(gk));
      const gkReach = 14 + gkDefN * 20 + gkOvrN * 6;
      const segDist = distPointToSeg(gk.x, gk.y, prevX, prevY, ball.x, ball.y);
      if (segDist < gkReach) {
        const isShot = Boolean(state.shotInFlight && state.shotInFlight.team !== gk.team);
        const speed = Math.hypot(ball.vx, ball.vy);
        if (isShot || speed > 220) {
          const shotPowerPenalty = Math.min(0.32, Math.max(0, (speed - 360) / 1400));
          const saveChance = Math.max(0.18, Math.min(0.84, 0.24 + gkDefN * 0.46 + gkOvrN * 0.14 - shotPowerPenalty));
          if (rng() < saveChance) {
            const catchChance = 0.42 + gkDefN * 0.35 - shotPowerPenalty * 0.5;
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

  const homeTac = state.homeTactics || DEFAULT_TACTICS;
  const awayTac = state.awayTactics || DEFAULT_TACTICS;
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
    if ((dot.dribbleCD || 0) > 0) {
      dot.dribbleCD = Math.max(0, (dot.dribbleCD || 0) - dt);
    }

    const tac = dot.team === 'home' ? homeTac : awayTac;
    const isOwner = ball.ownerId === dot.id;
    const ovrN = statNorm(dotOvr(dot));
    const pacN = statNorm(dot.pac);
    const driN = statNorm(dot.dri);
    const defN = statNorm(dot.def);
    const phyN = statNorm(dot.phy ?? 70);
    const shoN = statNorm(dot.sho);
    const finN = statNorm(dot.fin ?? dot.sho);
    const pasN = statNorm(dot.pas);
    const visN = statNorm(dot.vis ?? dot.pas);

    const pressBoost = dot === nearestHome || dot === nearestAway ? 0.94 + (tac.aggressiveness / 100) * 0.16 + ovrN * 0.06 : 1;
    const speedBase = (78 + pacN * 144 + ovrN * 16) * pressBoost;
    const pos = dot.pos || dot.role;
    const traits = dot.traits || [];
    let targetX = dot.homeX;
    let targetY = dot.homeY;

    if (dot.role === 'GK') {
      const baseX = dot.team === 'home' ? padX + 20 : pitchW - padX - 20;
      const sweeperRange = traits.includes('Sweeper Keeper') ? 34 : 16;
      const stepOut = dot.team === 'home'
        ? (ball.x < pitchW * 0.25 ? sweeperRange : 0)
        : (ball.x > pitchW * 0.75 ? -sweeperRange : 0);
      targetX = isOwner ? baseX : baseX + stepOut;
      targetY = Math.max(goalTop + 10, Math.min(goalBot - 10, ball.y));
    } else if (isOwner) {
      const attackDir = dot.team === 'home' ? 1 : -1;
      const isWideRole = pos === 'LW' || pos === 'RW' || pos === 'LM' || pos === 'RM' || pos === 'LB' || pos === 'RB';
      const goalX = dot.team === 'home' ? pitchW - padX : padX;
      const distGoal = Math.hypot(goalX - dot.x, pitchH * 0.5 - dot.y);
      let repelX = 0;
      let repelY = 0;
      let evaded = false;

      for (const opp of dots) {
        if (opp.team === dot.team || opp.redCarded) continue;
        const od = Math.hypot(dot.x - opp.x, dot.y - opp.y);
        if (od < 76 && od > 1) {
          const evadeBoost = (0.55 + driN * 0.85 + ovrN * 0.25) * (0.7 + (tac.dribbleTendency / 100) * 0.65);
          repelX += ((dot.x - opp.x) / od) * ((76 - od) / 76) * 78 * evadeBoost;
          repelY += ((dot.y - opp.y) / od) * ((76 - od) / 76) * 105 * evadeBoost;
          if (od < 34 && (dot.dribbleCD || 0) <= 0 && rng() < (0.02 + driN * 0.09) * (0.6 + tac.dribbleTendency / 100)) {
            evaded = true;
          }
        }
      }
      if (evaded) {
        dot.dribbleCD = 0.75;
        if (dot.team === 'home') state.homeDribbles = (state.homeDribbles || 0) + 1;
        else state.awayDribbles = (state.awayDribbles || 0) + 1;
        events.push(`DRIBBLE_${dot.team.toUpperCase()}:${dot.name}`);
      }

      // Wingers drive wide before cutting in or crossing; strikers drive directly at box
      const preferFlank = isWideRole && distGoal > pitchW * 0.12 && tac.crossIntensity >= 45;
      const desiredY = preferFlank
        ? (dot.y < pitchH * 0.5 ? padY + 62 : pitchH - padY - 62)
        : pitchH * 0.5;
      targetX = Math.max(padX + 20, Math.min(pitchW - padX - 20, dot.x + attackDir * 140 + repelX));
      targetY = Math.max(padY + 22, Math.min(pitchH - padY - 22, dot.y + (desiredY - dot.y) * 0.28 + repelY));
    } else if (state.passTargetId === dot.id && !ball.ownerId) {
      targetX = ball.x + ball.vx * 0.16;
      targetY = ball.y + ball.vy * 0.16;
    } else if (dot === nearestHome || dot === nearestAway) {
      targetX = ball.x;
      targetY = ball.y;
    } else {
      const teamAttacking = possessingTeam === dot.team;
      const attackDir = dot.team === 'home' ? 1 : -1;
      const lineBias = ((tac.positioningLine - 50) / 100) * pitchW * 0.18 * attackDir;
      const freedom = 0.28 + (tac.positioningFreedom / 100) * 0.45;
      const phaseBias = teamAttacking ? attackDir * pitchW * 0.075 : -attackDir * pitchW * 0.085;
      const shiftX = (ballRatioX - 0.5) * pitchW * (0.32 + freedom * 0.22) + phaseBias + lineBias;
      targetX = dot.homeX + shiftX;
      targetY = dot.homeY + (ball.y - pitchH * 0.5) * (0.18 + freedom * 0.2);

      if (teamAttacking) {
        if (pos === 'ST') {
          targetX += attackDir * (65 + tac.positioningFreedom * 0.4);
          targetY += (pitchH * 0.5 - targetY) * 0.28;
        } else if (pos === 'LW' || pos === 'LM') {
          targetX += attackDir * 58;
          targetY = Math.min(targetY, pitchH * 0.24);
        } else if (pos === 'RW' || pos === 'RM') {
          targetX += attackDir * 58;
          targetY = Math.max(targetY, pitchH * 0.76);
        } else if ((pos === 'LB' || pos === 'RB') && (tac.positioningFreedom > 55 || tac.crossIntensity > 60)) {
          targetX += attackDir * 85;
        } else if (pos === 'CAM') {
          targetX += attackDir * 42;
        }
        if (dot.role === 'FWD') {
          if (dot.team === 'home') targetX = Math.min(targetX, awayBackLineX - 6);
          else targetX = Math.max(targetX, homeBackLineX + 6);
        }
      } else {
        // Defending: Man marking vs Zonal shape
        if ((dot.role === 'DEF' || pos === 'CDM') && tac.manMarking >= 35) {
          let markOpp: PitchDot | null = null;
          let markDist = 175 + tac.manMarking * 1.4;
          for (const opp of dots) {
            if (opp.team === dot.team || opp.redCarded || opp.role === 'GK') continue;
            const d = Math.hypot(opp.x - dot.x, opp.y - dot.y);
            if (d < markDist) {
              markDist = d;
              markOpp = opp;
            }
          }
          if (markOpp) {
            const w = (tac.manMarking / 100) * 0.68;
            const goalSideX = markOpp.x - attackDir * 16;
            targetX = targetX * (1 - w) + goalSideX * w;
            targetY = targetY * (1 - w) + markOpp.y * w;
          }
        }
        if (dot.role === 'DEF') {
          const ownGoalX = dot.team === 'home' ? padX + 55 : pitchW - padX - 55;
          const deepPull = Math.max(0.15, 0.48 - (tac.positioningLine / 100) * 0.28);
          targetX = ownGoalX * deepPull + targetX * (1 - deepPull);
        }
      }

      targetX = Math.max(padX + 28, Math.min(pitchW - padX - 28, targetX));
      targetY = Math.max(padY + 24, Math.min(pitchH - padY - 24, targetY));
    }

    const dx = targetX - dot.x;
    const dy = targetY - dot.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 3) {
      const turnRate = 0.08 + driN * 0.16 + ovrN * 0.05;
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
      const aggFactor = tac.aggressiveness / 100;
      const reach = 9.5 + defN * 4.5 + ovrN * 2.5 + aggFactor * 2.2;
      if (segDist < reach) {
        if (state.shotInFlight && state.shotInFlight.team !== dot.team && !ball.ownerId) {
          ball.vx = (dot.team === 'home' ? 1 : -1) * (110 + rng() * 90);
          ball.vy = (rng() - 0.5) * 180;
          ball.vz = 25;
          ball.lastTouchTeam = dot.team;
          ball.kickCooldown = 0.25;
          state.shotInFlight = null;
          events.push(`BLOCK_${dot.team.toUpperCase()}`);
          continue;
        }
        const ownerDriN = ownerDot ? statNorm(ownerDot.dri) : 0;
        const ownerPhyN = ownerDot ? statNorm(ownerDot.phy ?? 70) : 0;
        const ownerOvrN = ownerDot ? statNorm(dotOvr(ownerDot)) : 0;
        const tackleOdds = Math.max(
          0.05,
          Math.min(0.75, 0.12 + defN * 0.42 + phyN * 0.18 + ovrN * 0.16 + aggFactor * 0.16 - ownerDriN * 0.28 - ownerPhyN * 0.12 - ownerOvrN * 0.14)
        );
        const looseControlOdds = ball.ownerId ? tackleOdds : Math.min(0.98, 0.45 + ovrN * 0.45 + driN * 0.15);
        if ((!ball.ownerId && rng() < looseControlOdds) || (ball.ownerId && ball.lastTouchTeam !== dot.team && rng() < tackleOdds)) {
          if (ball.ownerId && ball.lastTouchTeam !== dot.team) {
            if (dot.team === 'home') state.homeTackles = (state.homeTackles || 0) + 1;
            else state.awayTackles = (state.awayTackles || 0) + 1;
            events.push(`TACKLE_${dot.team.toUpperCase()}`);
            if (rng() < 0.015 + aggFactor * 0.045) events.push(`FOUL_${dot.team.toUpperCase()}`);
          }
          ball.ownerId = dot.id;
          ball.lastTouchTeam = dot.team;
          ball.z = 0;
          ball.vz = 0;
          ball.kickCooldown = 0.18;
          state.carryTime = 0;
          state.passTargetId = null;
          state.shotInFlight = null;
        }
      }
    }

    // Owner decision: GK distribution, kickoff back-pass, shoot, cross, dribble, or pass
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
            ball.kickCooldown = 0.26;
            state.passTargetId = target.id;
            if (dot.team === 'home') state.homePasses = (state.homePasses || 0) + 1;
            else state.awayPasses = (state.awayPasses || 0) + 1;
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
            if (dot.team === 'home') state.homePasses = (state.homePasses || 0) + 1;
            else state.awayPasses = (state.awayPasses || 0) + 1;
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
      const shootScale = 0.5 + (tac.shootIntensity / 100) * 1.1;
      const maxShotRange = pitchW * (0.14 + shoN * 0.09 + (tac.shootIntensity / 100) * 0.08 + (traits.includes('Long Shot') ? 0.04 : 0));
      const goodAngle = Math.abs(dot.y - pitchH * 0.5) < pitchH * 0.28;
      const roleShootBoost = dot.role === 'FWD' ? 1.38 : dot.role === 'DEF' ? 0.42 : 0.9;
      const shotProb = (distToGoal < pitchW * 0.13 ? (0.08 + finN * 0.14 + ovrN * 0.05) : (0.016 + shoN * 0.055 + finN * 0.035)) * shootScale * roleShootBoost;

      if ((state.carryTime || 0) > 0.18 && distToGoal < maxShotRange && goodAngle && rng() < shotProb) {
        const spread = (1 - finN) * (pitchH * 0.175) + (1 - ovrN) * (pitchH * 0.045) + (nearestOppDist < 34 ? pitchH * 0.045 : 0);
        const aimY = pitchH * 0.5 + (rng() - 0.5) * (goalBot - goalTop + spread * 2);
        const sdx = goalX - dot.x;
        const sdy = aimY - dot.y;
        const sLen = Math.hypot(sdx, sdy) || 1;
        const shotSpeed = 365 + shoN * 290 + ovrN * 45;
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
        continue;
      }

      // Crossing mechanic: wide players in attacking channels whip lofted crosses into the box
      const attackDir = dot.team === 'home' ? 1 : -1;
      const inAttackingThird = dot.team === 'home' ? dot.x > pitchW * 0.58 : dot.x < pitchW * 0.42;
      const inWideChannel = dot.y < pitchH * 0.39 || dot.y > pitchH * 0.61;
      const isCrosserPos = pos === 'LW' || pos === 'RW' || pos === 'LM' || pos === 'RM' || pos === 'LB' || pos === 'RB';
      const crossTraitBoost = traits.includes('Whipped Crosser') ? 1.45 : 1.0;
      const crossChance = (tac.crossIntensity / 100) * (0.14 + pasN * 0.10 + visN * 0.05) * crossTraitBoost * (isCrosserPos ? 1.45 : 0.75);

      if ((state.carryTime || 0) > 0.2 && inAttackingThird && inWideChannel && rng() < crossChance) {
        const boxTargets = dots.filter(
          (m) => m.team === dot.team && m.id !== dot.id && !m.redCarded && m.role !== 'GK' && (m.role === 'FWD' || m.pos === 'CAM' || m.pos === 'CM')
        );
        if (boxTargets.length > 0) {
          const target = boxTargets.find((m) => m.pos === 'ST') || boxTargets[0];
          const crossErr = (1 - pasN) * 75;
          const targetBoxX = dot.team === 'home' ? Math.max(target.x, pitchW - padX - 155) : Math.min(target.x, padX + 155);
          const targetBoxY = pitchH * 0.5 + (rng() - 0.5) * (60 + crossErr);
          const cdx = targetBoxX - dot.x;
          const cdy = targetBoxY - dot.y;
          const cLen = Math.hypot(cdx, cdy) || 1;
          const crossSpeed = Math.min(480, 275 + pasN * 75 + cLen * 0.52);
          ball.ownerId = null;
          ball.vx = (cdx / cLen) * crossSpeed;
          ball.vy = (cdy / cLen) * crossSpeed;
          ball.vz = 145 + rng() * 35;
          ball.kickCooldown = 0.28;
          state.passTargetId = target.id;
          if (dot.team === 'home') {
            state.homeCrosses = (state.homeCrosses || 0) + 1;
            state.homePasses = (state.homePasses || 0) + 1;
          } else {
            state.awayCrosses = (state.awayCrosses || 0) + 1;
            state.awayPasses = (state.awayPasses || 0) + 1;
          }
          events.push(`CROSS_${dot.team.toUpperCase()}:${dot.name}`);
          continue;
        }
      }

      // Realistic Dribble vs Pass decision: hold & dribble longer before passing!
      const underPressure = nearestOppDist < 42;
      const minCarryForDribble = 0.44 + (tac.dribbleTendency / 100) * 0.56 - (tac.passIntensity / 100) * 0.34 + (traits.includes('Speed Dribbler') ? 0.16 : 0);
      if ((state.carryTime || 0) < minCarryForDribble && !underPressure) {
        continue;
      }

      const rolePassBias = dot.role === 'DEF' ? 1.2 : pos === 'CM' || pos === 'CAM' ? 1.2 : pos === 'ST' ? 0.65 : 0.92;
      const passTacScale = Math.max(0.16, 0.16 + Math.pow(tac.passIntensity / 100, 1.3) * 1.48 - (tac.dribbleTendency / 100) * 0.32);
      const basePassProb = ((state.carryTime || 0) > 0.65 ? 0.026 : 0.011) + pasN * 0.024 + visN * 0.014 + (underPressure ? 0.042 : 0);
      const passChance = Math.max(0.004, basePassProb * passTacScale * rolePassBias);

      if (rng() < passChance) {
        const mates = dots.filter((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded && m.role !== 'GK');
        if (mates.length > 0) {
          let bestMate = mates[0];
          let bestScore = -Infinity;
          for (const m of mates) {
            const progress = (m.x - dot.x) * attackDir;
            const distM = Math.hypot(m.x - dot.x, m.y - dot.y);
            if (distM < 38) continue;
            let minLaneOpp = Infinity;
            let minRecOpp = Infinity;
            for (const opp of dots) {
              if (opp.team === dot.team || opp.redCarded) continue;
              const dLane = distPointToSeg(opp.x, opp.y, dot.x, dot.y, m.x, m.y);
              if (dLane < minLaneOpp) minLaneOpp = dLane;
              const dRec = Math.hypot(opp.x - m.x, opp.y - m.y);
              if (dRec < minRecOpp) minRecOpp = dRec;
            }
            // High Vision spots forward runs & avoids intercepted passing lanes!
            const visionWeight = 0.4 + visN * 1.15;
            let score = progress * 0.52 * visionWeight + Math.min(95, minRecOpp) * (0.65 + visN * 0.75) + (minLaneOpp < 22 ? -175 * visionWeight : minLaneOpp * 0.85 * visionWeight);
            if (underPressure && progress < 0) score += 45;
            if ((traits.includes('Playmaker') || visN > 0.7) && progress > 45 && m.role === 'FWD') score += 48;
            if (score > bestScore) {
              bestScore = score;
              bestMate = m;
            }
          }
          const err = (1 - pasN) * 44 + (1 - ovrN) * 18 + (underPressure ? 10 * (1 - pasN) : 0);
          const leadFactor = 0.08 + visN * 0.16;
          const pdx = bestMate.x + bestMate.vx * leadFactor + (rng() - 0.5) * err - dot.x;
          const pdy = bestMate.y + bestMate.vy * leadFactor + (rng() - 0.5) * err - dot.y;
          const pLen = Math.hypot(pdx, pdy) || 1;
          const passSpeed = Math.min(460, 215 + pasN * 55 + pLen * 0.78);
          ball.ownerId = null;
          ball.vx = (pdx / pLen) * passSpeed;
          ball.vy = (pdy / pLen) * passSpeed;
          ball.vz = pLen > 260 ? 85 : 6;
          ball.kickCooldown = 0.25;
          state.passTargetId = bestMate.id;
          if (dot.team === 'home') state.homePasses = (state.homePasses || 0) + 1;
          else state.awayPasses = (state.awayPasses || 0) + 1;
          events.push(`PASS_${dot.team.toUpperCase()}`);
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
