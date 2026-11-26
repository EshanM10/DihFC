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
  passIntensity: number;      // 0..100
  dribbleTendency: number;    // 0..100
  crossIntensity: number;     // 0..100
  shootIntensity: number;     // 0..100
  aggressiveness: number;     // 0..100
  positioningLine: number;    // 0..100
  positioningFreedom: number; // 0..100
  manMarking: number;         // 0..100
}

export const DEFAULT_TACTICS: TeamTactics = {
  mentality: 'BALANCED',
  passIntensity: 48,
  dribbleTendency: 52,
  crossIntensity: 48,
  shootIntensity: 50,
  aggressiveness: 50,
  positioningLine: 50,
  positioningFreedom: 46,
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
      passIntensity: 80,
      dribbleTendency: 48,
      crossIntensity: 24,
      shootIntensity: 42,
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
      passIntensity: 46,
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
      passIntensity: 58,
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
      passIntensity: 54,
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

const FINESSE_SPECIALIST_NAMES = [
  'messi', 'son', 'salah', 'saka', 'palmer', 'neymar', 'griezmann', 'bellingham',
  'yamal', 'robben', 'del piero', 'ronaldinho', 'henry', 'maradona', 'zidane',
  'kvaratskhelia', 'dybala', 'odegaard', 'vinicius', 'foden', 'musiala', 'olise',
  'rodrygo', 'de bruyne', 'raphinha', 'hazard', 'bale', 'ribery', 'mahrez', 'coutinho',
  'rivaldo', 'baggio', 'totti', 'pirlo', 'beckham', 'cruyff', 'kaka', 'cole palmer',
];

export function hasFinesseSpecialty(card: Pick<PlayerCard, 'name' | 'pos' | 'stats'>): boolean {
  if (card.pos === 'GK') return false;
  const lower = String(card.name || '').toLowerCase();
  if (FINESSE_SPECIALIST_NAMES.some((n) => lower.includes(n))) return true;
  const fin = card.stats.fin ?? card.stats.sho;
  return fin >= 86 && card.stats.dri >= 85 && card.stats.sho >= 82;
}

export function getPlayerTraits(card: PlayerCard): string[] {
  const traits: string[] = [];
  const fin = card.stats.fin ?? card.stats.sho;
  const vis = card.stats.vis ?? card.stats.pas;
  if (card.pos === 'GK') {
    if (card.stats.pac >= 60 || vis >= 76 || card.stats.pas >= 74) traits.push('Sweeper Keeper');
    else traits.push('Shot Stopper');
    return traits;
  }
  if (hasFinesseSpecialty(card)) {
    traits.push('Finesse Shot');
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
  return traits.slice(0, 3);
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

export type PlaystyleTier = 'bronze' | 'silver' | 'gold' | 'purple';

export interface PlaystyleEffects {
  pacMult?: number;
  burstMult?: number;
  shoMult?: number;
  finMult?: number;
  longShotFreq?: number;
  pasMult?: number;
  visMult?: number;
  lobFreq?: number;
  crossMult?: number;
  driMult?: number;
  defMult?: number;
  phyMult?: number;
  gkMult?: number;
  pressMult?: number;
}

export interface PlaystyleDef {
  id: string;
  typeKey: string;
  typeName: string;
  name: string;
  tier: PlaystyleTier;
  category: 'ATTACK' | 'MIDFIELD' | 'DEFENSE' | 'SPECIAL';
  costCoins: number;
  costShards: number;
  shortTag: string;
  focusStat: string;
  desc: string;
  effects: PlaystyleEffects;
}

export interface PlayerPlaystyleDef {
  id: string;
  name: string;
  tier: PlaystyleTier;
  costCoins: number;
  costShards: number;
  shortTag: string;
  focusStat: string;
  desc: string;
  effects: PlaystyleEffects;
}

export const PLAYSTYLE_TIER_META: Record<PlaystyleTier, { label: string; color: string; cssClass: string; rank: number }> = {
  bronze: { label: 'BRONZE', color: '#cd7f32', cssClass: 'ps-tier-bronze', rank: 1 },
  silver: { label: 'SILVER', color: '#e2e8f0', cssClass: 'ps-tier-silver', rank: 2 },
  gold: { label: 'GOLD', color: '#ffd600', cssClass: 'ps-tier-gold', rank: 3 },
  purple: { label: 'MYTHIC PURPLE', color: '#c084fc', cssClass: 'ps-tier-purple', rank: 4 },
};

interface PlaystyleBlueprint {
  typeKey: string;
  typeName: string;
  category: 'ATTACK' | 'MIDFIELD' | 'DEFENSE' | 'SPECIAL';
  focusStat: string;
  shortBase: string;
  tiers: Record<PlaystyleTier, {
    name: string;
    costCoins: number;
    costShards: number;
    desc: string;
    effects: PlaystyleEffects;
  }>;
}

const PLAYSTYLE_BLUEPRINTS: PlaystyleBlueprint[] = [
  {
    typeKey: 'quickstep',
    typeName: 'Quick Step',
    category: 'ATTACK',
    focusStat: 'PAC + ACCEL',
    shortBase: 'PAC',
    tiers: {
      bronze: { name: 'Quick Step I', costCoins: 420, costShards: 28, desc: 'Boosts sprint pace (+10%) & burst acceleration (+12%).', effects: { pacMult: 1.10, burstMult: 1.12 } },
      silver: { name: 'Quick Step II', costCoins: 900, costShards: 64, desc: 'Sharper transition sprints (+16% PAC, +20% Burst).', effects: { pacMult: 1.16, burstMult: 1.20 } },
      gold: { name: 'Quick Step III', costCoins: 1850, costShards: 140, desc: 'Blistering wing separation (+24% PAC, +30% Burst).', effects: { pacMult: 1.24, burstMult: 1.30 } },
      purple: { name: 'Rapid Hyperdrive', costCoins: 3600, costShards: 300, desc: 'Mythic pace surge (+34% PAC, +44% Burst).', effects: { pacMult: 1.34, burstMult: 1.44 } },
    },
  },
  {
    typeKey: 'finisher',
    typeName: 'Clinical Finisher',
    category: 'ATTACK',
    focusStat: 'FIN + BOX SHOT',
    shortBase: 'FIN',
    tiers: {
      bronze: { name: 'Clinical Finisher I', costCoins: 450, costShards: 32, desc: 'Steadier 1v1 composure inside the area (+14% FIN).', effects: { finMult: 1.14 } },
      silver: { name: 'Clinical Finisher II', costCoins: 980, costShards: 72, desc: 'Reliable corner placement (+24% FIN, +10% SHO).', effects: { finMult: 1.24, shoMult: 1.10 } },
      gold: { name: 'Clinical Finisher III', costCoins: 1950, costShards: 155, desc: 'Lethal box conversion (+36% FIN, +18% SHO).', effects: { finMult: 1.36, shoMult: 1.18 } },
      purple: { name: 'Lethal Executioner', costCoins: 3800, costShards: 330, desc: 'Mythic box precision (+52% FIN, +26% SHO).', effects: { finMult: 1.52, shoMult: 1.26 } },
    },
  },
  {
    typeKey: 'longshot',
    typeName: 'Deadeye Longshot',
    category: 'ATTACK',
    focusStat: 'SHO + RANGE',
    shortBase: 'RNG',
    tiers: {
      bronze: { name: 'Power Shot I', costCoins: 460, costShards: 32, desc: 'Cleaner long-range strikes (+12% SHO, 1.4x long-shot tries).', effects: { shoMult: 1.12, longShotFreq: 1.4 } },
      silver: { name: 'Power Shot II', costCoins: 1020, costShards: 78, desc: 'Outside-box threat (+22% SHO, 1.9x long-shot tries).', effects: { shoMult: 1.22, longShotFreq: 1.9 } },
      gold: { name: 'Long Shot Cannon', costCoins: 2100, costShards: 165, desc: 'Curled top-corner screamers (+36% SHO, 2.6x range shots).', effects: { shoMult: 1.36, longShotFreq: 2.6 } },
      purple: { name: 'Deadeye Rocket+', costCoins: 4100, costShards: 360, desc: 'Mythic 30-yard cannons (+54% SHO, 3.4x range shots).', effects: { shoMult: 1.54, longShotFreq: 3.4 } },
    },
  },
  {
    typeKey: 'crosser',
    typeName: 'Whipped Crosser',
    category: 'MIDFIELD',
    focusStat: 'CROSS + PAS',
    shortBase: 'CRS',
    tiers: {
      bronze: { name: 'Whipped Cross I', costCoins: 400, costShards: 26, desc: 'More frequent flank deliveries (+25% Cross frequency).', effects: { crossMult: 1.25 } },
      silver: { name: 'Whipped Cross II', costCoins: 920, costShards: 68, desc: 'Bending deliveries onto strikers (+52% Cross, +8% PAS).', effects: { crossMult: 1.52, pasMult: 1.08 } },
      gold: { name: 'Whipped Cross III', costCoins: 1800, costShards: 138, desc: 'Pinpoint early & byline crosses (+85% Cross, +15% PAS).', effects: { crossMult: 1.85, pasMult: 1.15 } },
      purple: { name: 'Beckham Arc+', costCoins: 3500, costShards: 295, desc: 'Mythic aerial flank laser (+125% Cross, +24% PAS).', effects: { crossMult: 2.25, pasMult: 1.24 } },
    },
  },
  {
    typeKey: 'lobber',
    typeName: 'Lob Through Master',
    category: 'MIDFIELD',
    focusStat: 'LOB + PAS',
    shortBase: 'LOB',
    tiers: {
      bronze: { name: 'Chipped Lob I', costCoins: 430, costShards: 30, desc: 'Unlocks chipped balls over pressing lines (1.55x lobs).', effects: { lobFreq: 1.55 } },
      silver: { name: 'Chipped Lob II', costCoins: 980, costShards: 74, desc: 'Frequent lofted passes behind CBs (2.2x lobs, +10% PAS).', effects: { lobFreq: 2.2, pasMult: 1.10 } },
      gold: { name: 'Lob Architect III', costCoins: 1920, costShards: 150, desc: 'Precision over-the-top launches (2.9x lobs, +18% PAS).', effects: { lobFreq: 2.9, pasMult: 1.18 } },
      purple: { name: 'Skyline Quarterback', costCoins: 3750, costShards: 320, desc: 'Mythic diagonal aerial switches (3.8x lobs, +28% PAS).', effects: { lobFreq: 3.8, pasMult: 1.28 } },
    },
  },
  {
    typeKey: 'playmaker',
    typeName: 'Vision Playmaker',
    category: 'MIDFIELD',
    focusStat: 'PAS + VIS',
    shortBase: 'VIS',
    tiers: {
      bronze: { name: 'Incisive Pass I', costCoins: 420, costShards: 28, desc: 'Tighter short pass accuracy (+10% PAS, +10% VIS).', effects: { pasMult: 1.10, visMult: 1.10 } },
      silver: { name: 'Incisive Pass II', costCoins: 940, costShards: 70, desc: 'Splits compact blocks (+18% PAS, +20% VIS).', effects: { pasMult: 1.18, visMult: 1.20 } },
      gold: { name: 'Tiki-Taka Maestro', costCoins: 1900, costShards: 148, desc: 'Rapid triangle threading (+30% PAS, +32% VIS).', effects: { pasMult: 1.30, visMult: 1.32 } },
      purple: { name: 'Oracle Vision+', costCoins: 3700, costShards: 315, desc: 'Mythic through-ball mastery (+44% PAS, +48% VIS).', effects: { pasMult: 1.44, visMult: 1.48 } },
    },
  },
  {
    typeKey: 'dribbler',
    typeName: 'Technical Dribbler',
    category: 'MIDFIELD',
    focusStat: 'DRI + EVADE',
    shortBase: 'DRI',
    tiers: {
      bronze: { name: 'Soft First Touch I', costCoins: 440, costShards: 30, desc: 'Cleaner ball control & close turns (+12% DRI).', effects: { driMult: 1.12 } },
      silver: { name: 'Technical Glider II', costCoins: 960, costShards: 72, desc: 'Slick 1v1 ball carry (+22% DRI, +12% Burst).', effects: { driMult: 1.22, burstMult: 1.12 } },
      gold: { name: 'Silk Footwork III', costCoins: 1980, costShards: 158, desc: 'Breaks ankles in tight spaces (+36% DRI, +22% Burst).', effects: { driMult: 1.36, burstMult: 1.22 } },
      purple: { name: 'Glitch Dribbler+', costCoins: 3900, costShards: 340, desc: 'Mythic magnetic dribble control (+54% DRI, +36% Burst).', effects: { driMult: 1.54, burstMult: 1.36 } },
    },
  },
  {
    typeKey: 'stopper',
    typeName: 'Brick Wall Stopper',
    category: 'DEFENSE',
    focusStat: 'DEF + BLOCK',
    shortBase: 'DEF',
    tiers: {
      bronze: { name: 'Compact Anchor I', costCoins: 420, costShards: 28, desc: 'Sharper standing tackle timing (+12% DEF).', effects: { defMult: 1.12 } },
      silver: { name: 'Intercept Shield II', costCoins: 950, costShards: 70, desc: 'Stronger lane blocks & steals (+22% DEF, +8% PHY).', effects: { defMult: 1.22, phyMult: 1.08 } },
      gold: { name: 'Brick Wall III', costCoins: 1950, costShards: 155, desc: 'Commanding 1v1 shutdowns (+36% DEF, +16% PHY).', effects: { defMult: 1.36, phyMult: 1.16 } },
      purple: { name: 'Fortress Bastion+', costCoins: 3800, costShards: 330, desc: 'Mythic defensive lockdown (+52% DEF, +28% PHY).', effects: { defMult: 1.52, phyMult: 1.28 } },
    },
  },
  {
    typeKey: 'presser',
    typeName: 'Pressing Engine',
    category: 'DEFENSE',
    focusStat: 'PRESS + DEF',
    shortBase: 'PRS',
    tiers: {
      bronze: { name: 'High Press I', costCoins: 430, costShards: 30, desc: 'Faster closing down on ball carriers (+12% Press).', effects: { pressMult: 1.12 } },
      silver: { name: 'Counter-Press II', costCoins: 960, costShards: 72, desc: 'Relentless midfield swarming (+22% Press, +12% DEF).', effects: { pressMult: 1.22, defMult: 1.12 } },
      gold: { name: 'Gegenpress Engine', costCoins: 1900, costShards: 150, desc: 'Suffocating trap speed (+34% Press, +20% DEF).', effects: { pressMult: 1.34, defMult: 1.20 } },
      purple: { name: 'Relentless Hound+', costCoins: 3650, costShards: 310, desc: 'Mythic nonstop recovery (+48% Press, +30% DEF).', effects: { pressMult: 1.48, defMult: 1.30 } },
    },
  },
  {
    typeKey: 'sweeper',
    typeName: 'Sweeper Keeper',
    category: 'DEFENSE',
    focusStat: 'GK + DISTRIB',
    shortBase: 'GK',
    tiers: {
      bronze: { name: 'Shot Stopper I', costCoins: 410, costShards: 26, desc: 'Wider keeper dive reach (+14% GK).', effects: { gkMult: 1.14 } },
      silver: { name: 'Sweeper Keeper II', costCoins: 900, costShards: 66, desc: 'Quick rush angles & clean passes (+26% GK, +10% PAS).', effects: { gkMult: 1.26, pasMult: 1.10 } },
      gold: { name: 'Spider Gloves III', costCoins: 1850, costShards: 145, desc: 'Acrobatic top-corner fingertips (+40% GK, +16% PAS).', effects: { gkMult: 1.40, pasMult: 1.16 } },
      purple: { name: 'Brick Wall GK+', costCoins: 3550, costShards: 300, desc: 'Mythic penalty-area command (+58% GK, +24% PAS).', effects: { gkMult: 1.58, pasMult: 1.24 } },
    },
  },
  {
    typeKey: 'poacher',
    typeName: 'Fox In The Box',
    category: 'SPECIAL',
    focusStat: 'FIN + PAC',
    shortBase: 'FOX',
    tiers: {
      bronze: { name: 'Poacher Instinct I', costCoins: 450, costShards: 32, desc: 'Snappy six-yard movement (+10% FIN, +8% PAC).', effects: { finMult: 1.10, pacMult: 1.08 } },
      silver: { name: 'Poacher Instinct II', costCoins: 1000, costShards: 76, desc: 'Ghosting behind CBs (+18% FIN, +14% PAC).', effects: { finMult: 1.18, pacMult: 1.14 } },
      gold: { name: 'Shadow Striker III', costCoins: 2050, costShards: 160, desc: 'Clinical near-post bursts (+30% FIN, +22% PAC).', effects: { finMult: 1.30, pacMult: 1.22 } },
      purple: { name: 'Apex Predator+', costCoins: 4000, costShards: 350, desc: 'Mythic shoulder-of-defender bursts (+44% FIN, +30% PAC).', effects: { finMult: 1.44, pacMult: 1.30 } },
    },
  },
  {
    typeKey: 'enforcer',
    typeName: 'Iron Enforcer',
    category: 'SPECIAL',
    focusStat: 'PHY + DUELS',
    shortBase: 'PHY',
    tiers: {
      bronze: { name: 'Shoulder Charge I', costCoins: 410, costShards: 28, desc: 'Stronger shielding & duel balance (+14% PHY).', effects: { phyMult: 1.14 } },
      silver: { name: 'Iron Body II', costCoins: 920, costShards: 68, desc: 'Shrugs off challenges cleanly (+26% PHY, +10% DEF).', effects: { phyMult: 1.26, defMult: 1.10 } },
      gold: { name: 'Tank Destroyer III', costCoins: 1880, costShards: 148, desc: 'Dominates 50/50 collisions (+40% PHY, +18% DEF).', effects: { phyMult: 1.40, defMult: 1.18 } },
      purple: { name: 'Titan Juggernaut+', costCoins: 3700, costShards: 315, desc: 'Mythic physical dominance (+56% PHY, +28% DEF).', effects: { phyMult: 1.56, defMult: 1.28 } },
    },
  },
];

const TIER_ORDER: PlaystyleTier[] = ['bronze', 'silver', 'gold', 'purple'];
const TIER_TAG_SUFFIX: Record<PlaystyleTier, string> = {
  bronze: '+',
  silver: '++',
  gold: '+++',
  purple: ' MAX',
};

export const PLAYSTYLES: PlaystyleDef[] = PLAYSTYLE_BLUEPRINTS.flatMap((bp) =>
  TIER_ORDER.map((tier) => {
    const t = bp.tiers[tier];
    return {
      id: `ps_${bp.typeKey}_${tier}`,
      typeKey: bp.typeKey,
      typeName: bp.typeName,
      name: t.name,
      tier,
      category: bp.category,
      costCoins: t.costCoins,
      costShards: t.costShards,
      shortTag: `${bp.shortBase}${TIER_TAG_SUFFIX[tier]}`,
      focusStat: bp.focusStat,
      desc: t.desc,
      effects: t.effects,
    };
  })
);

export const PLAYSTYLE_BY_ID: Record<string, PlaystyleDef> = Object.fromEntries(
  PLAYSTYLES.map((p) => [p.id, p])
);

// Maps legacy 14-item playstyle IDs cleanly onto the 48-item system so user saves never lose unlocks
export const LEGACY_PLAYSTYLE_MAP: Record<string, string> = {
  ps_first_touch: 'ps_dribbler_bronze',
  ps_low_block: 'ps_stopper_bronze',
  ps_sprint_burst: 'ps_quickstep_bronze',
  ps_whipped_cross: 'ps_crosser_silver',
  ps_lob_master: 'ps_lobber_silver',
  ps_interceptor: 'ps_presser_silver',
  ps_sweeper_gk: 'ps_sweeper_silver',
  ps_clinical_finisher: 'ps_finisher_gold',
  ps_long_shot_cannon: 'ps_longshot_gold',
  ps_tiki_taka: 'ps_playmaker_gold',
  ps_brick_wall: 'ps_stopper_gold',
  ps_rapid_maestro: 'ps_dribbler_purple',
  ps_deadeye_screamer: 'ps_longshot_purple',
  ps_total_football: 'ps_poacher_purple',
};

export function resolvePlaystyleId(id: string): string {
  return PLAYSTYLE_BY_ID[id] ? id : (LEGACY_PLAYSTYLE_MAP[id] || id);
}

// Cheaper, ultra-specific Player-Equippable Playstyles (up to 2 equipped per card)
export const PLAYER_PLAYSTYLES: PlayerPlaystyleDef[] = [
  { id: 'pp_jet_bronze', name: 'Rocket Cleats', tier: 'bronze', costCoins: 120, costShards: 8, shortTag: 'PAC+', focusStat: 'PAC +14%', desc: 'Single-player sprint boost (+14% PAC).', effects: { pacMult: 1.14 } },
  { id: 'pp_finisher_bronze', name: 'Cold Blood', tier: 'bronze', costCoins: 130, costShards: 9, shortTag: 'FIN+', focusStat: 'FIN +16%', desc: 'Single-player box composure (+16% FIN).', effects: { finMult: 1.16 } },
  { id: 'pp_pass_bronze', name: 'Silk Touch', tier: 'bronze', costCoins: 120, costShards: 8, shortTag: 'PAS+', focusStat: 'PAS +14%', desc: 'Single-player pass accuracy (+14% PAS).', effects: { pasMult: 1.14 } },
  { id: 'pp_tackler_silver', name: 'Clean Snapper', tier: 'silver', costCoins: 260, costShards: 20, shortTag: 'DEF++', focusStat: 'DEF +22%', desc: 'Single-player tackle reach & win rate (+22% DEF).', effects: { defMult: 1.22 } },
  { id: 'pp_dribble_silver', name: 'Ankle Breaker', tier: 'silver', costCoins: 280, costShards: 22, shortTag: 'DRI++', focusStat: 'DRI +22%', desc: 'Single-player 1v1 evasion (+22% DRI, +14% Burst).', effects: { driMult: 1.22, burstMult: 1.14 } },
  { id: 'pp_cross_silver', name: 'Early Whip', tier: 'silver', costCoins: 260, costShards: 20, shortTag: 'CRS++', focusStat: 'CROSS +40%', desc: 'Single-player wing curl deliveries (+40% Cross).', effects: { crossMult: 1.40 } },
  { id: 'pp_rocket_gold', name: 'Outside Boot', tier: 'gold', costCoins: 520, costShards: 42, shortTag: 'SHO+++', focusStat: 'SHO +32%', desc: 'Unlocks frequent outside-the-box rockets (+32% SHO, 2.0x range).', effects: { shoMult: 1.32, longShotFreq: 2.0 } },
  { id: 'pp_maestro_gold', name: 'Through Thread', tier: 'gold', costCoins: 500, costShards: 40, shortTag: 'VIS+++', focusStat: 'VIS +32%', desc: 'Killer ground & lobbed through-balls (+32% VIS, 1.9x lobs).', effects: { visMult: 1.32, lobFreq: 1.9 } },
  { id: 'pp_gk_gold', name: 'Cat Reflexes', tier: 'gold', costCoins: 480, costShards: 38, shortTag: 'GK+++', focusStat: 'GK +34%', desc: 'Elite goalkeeper dive reaction & reach (+34% GK).', effects: { gkMult: 1.34 } },
  { id: 'pp_titan_purple', name: 'Tank Shield', tier: 'purple', costCoins: 920, costShards: 78, shortTag: 'PHY MAX', focusStat: 'PHY +48%', desc: 'Mythic physical ball shield & tackles (+48% PHY, +24% DEF).', effects: { phyMult: 1.48, defMult: 1.24 } },
  { id: 'pp_glitch_purple', name: 'Quantum Glide', tier: 'purple', costCoins: 980, costShards: 84, shortTag: 'DRI MAX', focusStat: 'DRI +46%', desc: 'Mythic ball-carrier acceleration & turns (+46% DRI, +24% PAC).', effects: { driMult: 1.46, pacMult: 1.24 } },
  { id: 'pp_snipe_purple', name: 'Top Bins+', tier: 'purple', costCoins: 980, costShards: 84, shortTag: 'FIN MAX', focusStat: 'FIN +48%', desc: 'Mythic unstoppable striker precision (+48% FIN, +32% SHO).', effects: { finMult: 1.48, shoMult: 1.32 } },
];

export const PLAYER_PLAYSTYLE_BY_ID: Record<string, PlayerPlaystyleDef> = Object.fromEntries(
  PLAYER_PLAYSTYLES.map((p) => [p.id, p])
);

export interface ComputedPlaystyleMods {
  pacMult: number;
  burstMult: number;
  shoMult: number;
  finMult: number;
  longShotFreq: number;
  pasMult: number;
  visMult: number;
  lobFreq: number;
  crossMult: number;
  driMult: number;
  defMult: number;
  phyMult: number;
  gkMult: number;
  pressMult: number;
}

export function createNeutralMods(): ComputedPlaystyleMods {
  return {
    pacMult: 1,
    burstMult: 1,
    shoMult: 1,
    finMult: 1,
    longShotFreq: 1,
    pasMult: 1,
    visMult: 1,
    lobFreq: 1,
    crossMult: 1,
    driMult: 1,
    defMult: 1,
    phyMult: 1,
    gkMult: 1,
    pressMult: 1,
  };
}

function applyEffectsToMods(mods: ComputedPlaystyleMods, fx?: PlaystyleEffects): void {
  if (!fx) return;
  if (fx.pacMult) mods.pacMult *= fx.pacMult;
  if (fx.burstMult) mods.burstMult *= fx.burstMult;
  if (fx.shoMult) mods.shoMult *= fx.shoMult;
  if (fx.finMult) mods.finMult *= fx.finMult;
  if (fx.longShotFreq) mods.longShotFreq *= fx.longShotFreq;
  if (fx.pasMult) mods.pasMult *= fx.pasMult;
  if (fx.visMult) mods.visMult *= fx.visMult;
  if (fx.lobFreq) mods.lobFreq *= fx.lobFreq;
  if (fx.crossMult) mods.crossMult *= fx.crossMult;
  if (fx.driMult) mods.driMult *= fx.driMult;
  if (fx.defMult) mods.defMult *= fx.defMult;
  if (fx.phyMult) mods.phyMult *= fx.phyMult;
  if (fx.gkMult) mods.gkMult *= fx.gkMult;
  if (fx.pressMult) mods.pressMult *= fx.pressMult;
}

export function computePlaystyleMods(playstyleIds?: string[]): ComputedPlaystyleMods {
  const mods = createNeutralMods();
  if (!Array.isArray(playstyleIds)) return mods;
  const unique = Array.from(new Set(playstyleIds.map(resolvePlaystyleId))).slice(0, 4);
  for (const id of unique) {
    const def = PLAYSTYLE_BY_ID[id];
    if (def) applyEffectsToMods(mods, def.effects);
  }
  return mods;
}

export function computePlayerPlaystyleMods(playerPlaystyleIds?: string[]): ComputedPlaystyleMods {
  const mods = createNeutralMods();
  if (!Array.isArray(playerPlaystyleIds)) return mods;
  const unique = Array.from(new Set(playerPlaystyleIds)).slice(0, 2);
  for (const id of unique) {
    const def = PLAYER_PLAYSTYLE_BY_ID[id];
    if (def) applyEffectsToMods(mods, def.effects);
  }
  return mods;
}

export interface RedeemCodeDef {
  code: string;
  coins: number;
  shards: number;
  repeatable: boolean;
  label: string;
}

export const REDEEM_CODES: Record<string, RedeemCodeDef> = {
  '126MDIH': {
    code: '126MDIH',
    coins: 20000,
    shards: 10000,
    repeatable: true,
    label: 'Secret Vault Drop',
  },
};

export function redeemCodeReward(inputCode: string): {
  valid: boolean;
  code: string;
  coins: number;
  shards: number;
  message: string;
} {
  const norm = String(inputCode || '').trim().toUpperCase();
  const entry = REDEEM_CODES[norm];
  if (!entry) {
    return { valid: false, code: norm, coins: 0, shards: 0, message: 'Invalid redeem code.' };
  }
  return {
    valid: true,
    code: entry.code,
    coins: entry.coins,
    shards: entry.shards,
    message: `Redeemed ${entry.code}: +${entry.coins.toLocaleString()} Coins & +${entry.shards.toLocaleString()} Shards!`,
  };
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
    { slotIndex: 1, pos: 'LB', role: 'DEF', x: 0.23, y: 0.16 },
    { slotIndex: 2, pos: 'CB', role: 'DEF', x: 0.21, y: 0.38 },
    { slotIndex: 3, pos: 'CB', role: 'DEF', x: 0.21, y: 0.62 },
    { slotIndex: 4, pos: 'RB', role: 'DEF', x: 0.23, y: 0.84 },
    { slotIndex: 5, pos: 'CM', role: 'MID', x: 0.45, y: 0.26 },
    { slotIndex: 6, pos: 'CDM', role: 'MID', x: 0.38, y: 0.5 },
    { slotIndex: 7, pos: 'CAM', role: 'MID', x: 0.48, y: 0.74 },
    { slotIndex: 8, pos: 'LW', role: 'FWD', x: 0.72, y: 0.18 },
    { slotIndex: 9, pos: 'ST', role: 'FWD', x: 0.78, y: 0.5 },
    { slotIndex: 10, pos: 'RW', role: 'FWD', x: 0.72, y: 0.82 },
  ],
  '4-4-2': [
    { slotIndex: 0, pos: 'GK', role: 'GK', x: 0.06, y: 0.5 },
    { slotIndex: 1, pos: 'LB', role: 'DEF', x: 0.23, y: 0.16 },
    { slotIndex: 2, pos: 'CB', role: 'DEF', x: 0.21, y: 0.38 },
    { slotIndex: 3, pos: 'CB', role: 'DEF', x: 0.21, y: 0.62 },
    { slotIndex: 4, pos: 'RB', role: 'DEF', x: 0.23, y: 0.84 },
    { slotIndex: 5, pos: 'LM', role: 'MID', x: 0.48, y: 0.16 },
    { slotIndex: 6, pos: 'CM', role: 'MID', x: 0.45, y: 0.39 },
    { slotIndex: 7, pos: 'CM', role: 'MID', x: 0.45, y: 0.61 },
    { slotIndex: 8, pos: 'RM', role: 'MID', x: 0.48, y: 0.84 },
    { slotIndex: 9, pos: 'ST', role: 'FWD', x: 0.76, y: 0.36 },
    { slotIndex: 10, pos: 'ST', role: 'FWD', x: 0.76, y: 0.64 },
  ],
  '3-5-2': [
    { slotIndex: 0, pos: 'GK', role: 'GK', x: 0.06, y: 0.5 },
    { slotIndex: 1, pos: 'CB', role: 'DEF', x: 0.22, y: 0.24 },
    { slotIndex: 2, pos: 'CB', role: 'DEF', x: 0.2, y: 0.5 },
    { slotIndex: 3, pos: 'CB', role: 'DEF', x: 0.22, y: 0.76 },
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

/**
 * Assigns an 11-player lineup where every slot gets an exact or role-compatible player first,
 * preventing defenders like Maldini (CB) from ever lining up at ST when natural forwards exist.
 */
export function buildPositionAccurate11(
  pool: PlayerCard[],
  formation: FormationId = '4-3-3',
  rng?: () => number
): PlayerCard[] {
  const slots = FORMATIONS[formation] || FORMATIONS['4-3-3'];
  const candidates = rng
    ? [...pool].sort((a, b) => (b.ovr - a.ovr) * 0.65 + (rng() - 0.5) * 14)
    : [...pool].sort((a, b) => b.ovr - a.ovr);

  const usedIds = new Set<string>();
  const lineup: (PlayerCard | null)[] = new Array(11).fill(null);

  // Pass 1: exact position match
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const match = candidates.find((c) => !usedIds.has(c.id) && c.pos === slot.pos);
    if (match) {
      lineup[i] = match;
      usedIds.add(match.id);
    }
  }

  // Pass 2: same RoleGroup (GK -> GK, DEF -> DEF, MID -> MID, FWD -> FWD)
  for (let i = 0; i < slots.length; i++) {
    if (lineup[i]) continue;
    const slot = slots[i];
    const match = candidates.find(
      (c) => !usedIds.has(c.id) && getPositionGroup(c.pos) === slot.role
    );
    if (match) {
      lineup[i] = match;
      usedIds.add(match.id);
    }
  }

  // Pass 3: adjacent wide/mid compatibility (LM/RM <-> LW/RW, CDM <-> CB, CAM <-> ST), never mixing GK/outfield unless forced
  const adjacentMap: Partial<Record<RoleGroup, RoleGroup[]>> = {
    DEF: ['MID'],
    MID: ['FWD', 'DEF'],
    FWD: ['MID'],
    GK: [],
  };
  for (let i = 0; i < slots.length; i++) {
    if (lineup[i]) continue;
    const slot = slots[i];
    const adjRoles = adjacentMap[slot.role] || [];
    const match = candidates.find(
      (c) => !usedIds.has(c.id) && c.pos !== 'GK' && adjRoles.includes(getPositionGroup(c.pos))
    );
    if (match) {
      lineup[i] = match;
      usedIds.add(match.id);
    }
  }

  // Pass 4: emergency fallback from remaining pool (never leave null)
  for (let i = 0; i < slots.length; i++) {
    if (lineup[i]) continue;
    const slot = slots[i];
    const match =
      candidates.find((c) => !usedIds.has(c.id) && (slot.role === 'GK' ? c.pos === 'GK' : c.pos !== 'GK')) ||
      candidates.find((c) => !usedIds.has(c.id)) ||
      candidates[i % Math.max(1, candidates.length)];
    if (match) {
      lineup[i] = match;
      usedIds.add(match.id);
    }
  }

  return lineup.filter((c): c is PlayerCard => Boolean(c));
}

export function generateStarterClubSave(
  pool: PlayerCard[],
  rng: () => number = Math.random
): { inventoryIds: string[]; squadIds: string[]; formation: FormationId } {
  const formations: FormationId[] = ['4-3-3', '4-4-2'];
  const formation = formations[Math.floor(rng() * formations.length) % formations.length];
  const slots = FORMATIONS[formation];

  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Starter club consists of randomized Bronze (54-64), Silver (65-74), and 1-2 lower Golds (75-78)
  const starterPool = pool.filter((p) => p.ovr <= 78 && (p.tier === 'bronze' || p.tier === 'silver' || p.tier === 'gold'));
  const workingPool = starterPool.length >= 25 ? starterPool : pool.filter((p) => p.ovr <= 80);

  const gks = shuffle(workingPool.filter((p) => p.pos === 'GK'));
  const defs = shuffle(workingPool.filter((p) => getPositionGroup(p.pos) === 'DEF'));
  const mids = shuffle(workingPool.filter((p) => getPositionGroup(p.pos) === 'MID'));
  const fwds = shuffle(workingPool.filter((p) => getPositionGroup(p.pos) === 'FWD'));

  const pickedIds = new Set<string>();
  const inventoryIds: string[] = [];

  const takeMany = (source: PlayerCard[], count: number) => {
    for (const c of source) {
      if (inventoryIds.length >= 18) break;
      if (pickedIds.has(c.id)) continue;
      pickedIds.add(c.id);
      inventoryIds.push(c.id);
      count -= 1;
      if (count <= 0) break;
    }
  };

  // Pick 2 GKs, 6 DEFs, 5 MIDs, 5 FWDs so every formation slot has real positional coverage + bench depth
  takeMany(gks, 2);
  takeMany(defs, 6);
  takeMany(mids, 5);
  takeMany(fwds, 5);
  if (inventoryIds.length < 18) {
    takeMany(shuffle(workingPool), 18 - inventoryIds.length);
  }

  const invCards = inventoryIds
    .map((id) => pool.find((p) => p.id === id))
    .filter((p): p is PlayerCard => Boolean(p));

  const xi = buildPositionAccurate11(invCards, formation, rng);
  const squadIds = xi.slice(0, slots.length).map((c) => c.id);

  return { inventoryIds, squadIds, formation };
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

// =========================================================
// FANTASY MODE ENGINE (Single-League Draft + Fantasy Tokens)
// =========================================================

export interface FantasyLeagueDef {
  id: string;
  name: string;
  region: string;
  difficultyMult: number;
}

export const FANTASY_LEAGUES: FantasyLeagueDef[] = [
  { id: 'EPL', name: 'Premier League', region: 'England', difficultyMult: 1.15 },
  { id: 'LIGA', name: 'LaLiga EA', region: 'Spain', difficultyMult: 1.12 },
  { id: 'SERA', name: 'Serie A', region: 'Italy', difficultyMult: 1.10 },
  { id: 'BUND', name: 'Bundesliga', region: 'Germany', difficultyMult: 1.10 },
  { id: 'LIG1', name: 'Ligue 1', region: 'France', difficultyMult: 1.06 },
  { id: 'MLS', name: 'Major League Soccer', region: 'USA', difficultyMult: 1.02 },
  { id: 'ROSH', name: 'Roshn Pro League', region: 'Saudi Arabia', difficultyMult: 1.05 },
];

export interface FantasyExchangeOffer {
  id: string;
  title: string;
  costFP: number;
  rewardType: 'coins' | 'shards' | 'pack_elite' | 'pack_icon';
  amount?: number;
  desc: string;
}

export const FANTASY_EXCHANGE_OFFERS: FantasyExchangeOffer[] = [
  { id: 'fx_coins', title: 'Fantasy Prize Bag', costFP: 95, rewardType: 'coins', amount: 2200, desc: 'Convert Fantasy Points into +2,200 Club Coins.' },
  { id: 'fx_shards', title: 'Fantasy Shard Vault', costFP: 110, rewardType: 'shards', amount: 320, desc: 'Convert Fantasy Points into +320 Transfer Shards.' },
  { id: 'fx_elite', title: 'TOTW / Elite Reward Pack', costFP: 240, rewardType: 'pack_elite', desc: 'Open a guaranteed high-tier Elite Pack directly.' },
  { id: 'fx_icon', title: 'Iconic Fantasy Chest', costFP: 480, rewardType: 'pack_icon', desc: 'Open a Prime Icon / Shapeshifter Pack.' },
];

export interface FantasyMatchweekPlayerPerf {
  cardId: string;
  name: string;
  pos: Position;
  ovr: number;
  isCaptain: boolean;
  goals: number;
  assists: number;
  cleanSheet: boolean;
  savesOrTackles: number;
  matchRating: number;
  basePoints: number;
  totalPoints: number;
  summary: string;
}

export interface FantasyMatchweekResult {
  valid: boolean;
  error?: string;
  league: string;
  totalPoints: number;
  fantasyTokensEarned: number;
  coinsEarned: number;
  shardsEarned: number;
  starPlayerName: string;
  performances: FantasyMatchweekPlayerPerf[];
}

export function simulateFantasyMatchweek(
  lineup: (PlayerCard | null)[],
  captainId: string | null,
  league: string,
  rng: () => number
): FantasyMatchweekResult {
  const filled = lineup.filter((c): c is PlayerCard => Boolean(c));
  if (filled.length < 11) {
    return {
      valid: false,
      error: `Select all 11 players from ${league} (${filled.length}/11 filled).`,
      league,
      totalPoints: 0,
      fantasyTokensEarned: 0,
      coinsEarned: 0,
      shardsEarned: 0,
      starPlayerName: '',
      performances: [],
    };
  }
  const wrongLeague = filled.find((c) => c.league !== league);
  if (wrongLeague) {
    return {
      valid: false,
      error: `${wrongLeague.name} plays in ${wrongLeague.league}, not ${league}. Fantasy XI must come from a single league!`,
      league,
      totalPoints: 0,
      fantasyTokensEarned: 0,
      coinsEarned: 0,
      shardsEarned: 0,
      starPlayerName: '',
      performances: [],
    };
  }

  const leagueDef = FANTASY_LEAGUES.find((l) => l.id === league);
  const diffMult = leagueDef ? leagueDef.difficultyMult : 1.05;
  const effectiveCaptainId = captainId && filled.some((c) => c.id === captainId) ? captainId : filled[9].id;

  const performances: FantasyMatchweekPlayerPerf[] = [];
  let totalPoints = 0;

  for (const card of filled) {
    const role = getPositionGroup(card.pos);
    const fin = card.stats.fin ?? card.stats.sho;
    const vis = card.stats.vis ?? card.stats.pas;
    const ovrEdge = Math.max(0, (card.ovr - 55) / 44);
    const formRoll = rng();
    const formFactor = 0.55 + formRoll * 0.9; // 0.55..1.45 weekly form

    let goals = 0;
    let assists = 0;
    let cleanSheet = false;
    let savesOrTackles = 0;

    if (role === 'FWD') {
      const gChance = (0.14 + (fin / 100) * 0.42 + ovrEdge * 0.22) * formFactor;
      if (rng() < gChance) goals += 1;
      if (rng() < gChance * 0.48) goals += 1;
      if (rng() < (0.12 + (card.stats.pas / 100) * 0.28) * formFactor) assists += 1;
      savesOrTackles = Math.round(1 + (card.stats.dri / 35) * formFactor);
    } else if (role === 'MID') {
      const gChance = (0.07 + (card.stats.sho / 100) * 0.22 + ovrEdge * 0.14) * formFactor;
      const aChance = (0.14 + (vis / 100) * 0.36 + ovrEdge * 0.16) * formFactor;
      if (rng() < gChance) goals += 1;
      if (rng() < aChance) assists += 1;
      if (rng() < aChance * 0.35) assists += 1;
      savesOrTackles = Math.round(2 + (card.stats.pas / 28) * formFactor);
    } else if (role === 'DEF') {
      cleanSheet = rng() < Math.min(0.68, 0.22 + (card.stats.def / 100) * 0.34 * formFactor);
      if (rng() < 0.06 + (card.stats.phy / 100) * 0.08) goals += 1;
      if (rng() < 0.09 + (card.stats.pas / 100) * 0.12) assists += 1;
      savesOrTackles = Math.round(3 + (card.stats.def / 20) * formFactor);
    } else {
      cleanSheet = rng() < Math.min(0.65, 0.20 + (card.stats.def / 100) * 0.36 * formFactor);
      savesOrTackles = Math.round(2 + (card.stats.def / 18) * formFactor);
    }

    const goalPts = role === 'FWD' ? 4 : role === 'MID' ? 5 : 6;
    const csPts = role === 'GK' || role === 'DEF' ? (cleanSheet ? 4 : 0) : (cleanSheet && role === 'MID' ? 1 : 0);
    const statBonus = Math.floor(savesOrTackles / 3);
    const rawRating = Math.min(
      9.9,
      Math.max(5.6, 5.9 + ovrEdge * 1.1 + formRoll * 1.2 + goals * 0.85 + assists * 0.65 + (cleanSheet ? 0.55 : 0))
    );
    const matchRating = Math.round(rawRating * 10) / 10;
    const basePoints = 2 + goals * goalPts + assists * 3 + csPts + statBonus + (matchRating >= 8.2 ? 2 : 0);
    const isCaptain = card.id === effectiveCaptainId;
    const pts = isCaptain ? basePoints * 2 : basePoints;
    totalPoints += pts;

    const highlights: string[] = [];
    if (goals > 0) highlights.push(`${goals}G`);
    if (assists > 0) highlights.push(`${assists}A`);
    if (cleanSheet) highlights.push('CS');
    highlights.push(role === 'GK' ? `${savesOrTackles} SV` : `${savesOrTackles} ACT`);

    performances.push({
      cardId: card.id,
      name: card.name,
      pos: card.pos,
      ovr: card.ovr,
      isCaptain,
      goals,
      assists,
      cleanSheet,
      savesOrTackles,
      matchRating,
      basePoints,
      totalPoints: pts,
      summary: highlights.join(' · '),
    });
  }

  performances.sort((a, b) => b.totalPoints - a.totalPoints);
  const fantasyTokensEarned = Math.max(25, Math.round(totalPoints * 1.15 * diffMult));
  const coinsEarned = Math.max(180, Math.round(totalPoints * 7.5 * diffMult));
  const shardsEarned = Math.max(20, Math.round(totalPoints * 0.85 * diffMult));

  return {
    valid: true,
    league,
    totalPoints,
    fantasyTokensEarned,
    coinsEarned,
    shardsEarned,
    starPlayerName: performances[0]?.name || '',
    performances,
  };
}

export interface PitchDot {
  id: string;
  team: 'home' | 'away';
  slotIndex: number;
  shirtNum: number;
  name: string;
  pos?: Position;
  cardPos?: Position;
  role: RoleGroup;
  traits?: string[];
  playerPlaystyles?: string[];
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
  tackleCD?: number;
  burstPhase?: number;
}

export interface PitchBall {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  curveAx?: number;
  curveAy?: number;
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
  homeLongShots?: number;
  awayLongShots?: number;
  homeFinesseShots?: number;
  awayFinesseShots?: number;
  homePossessionTicks: number;
  awayPossessionTicks: number;
  elapsedMinutes: number; // 0..90
  halfTimeDone?: boolean;
  freezeTicks: number;
  goalBannerTimer: number;
  lastEvent: string | null;
  kickoffTimer?: number;
  carryTime?: number;
  passTargetId?: string | null;
  shotInFlight?: { team: 'home' | 'away'; shooterName: string; isLongShot?: boolean; isFinesse?: boolean; targetGoalY?: number } | null;
  gkHoldTimer?: number;
  goalKickSafeTimer?: number;
  goalKickTeam?: 'home' | 'away' | null;
  homeTactics?: TeamTactics;
  awayTactics?: TeamTactics;
  homePlaystyles?: string[];
  awayPlaystyles?: string[];
  homePasses?: number;
  awayPasses?: number;
  homeLobs?: number;
  awayLobs?: number;
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

function combineMods(teamMods: ComputedPlaystyleMods, playerMods: ComputedPlaystyleMods): ComputedPlaystyleMods {
  return {
    pacMult: teamMods.pacMult * playerMods.pacMult,
    burstMult: teamMods.burstMult * playerMods.burstMult,
    shoMult: teamMods.shoMult * playerMods.shoMult,
    finMult: teamMods.finMult * playerMods.finMult,
    longShotFreq: teamMods.longShotFreq * playerMods.longShotFreq,
    pasMult: teamMods.pasMult * playerMods.pasMult,
    visMult: teamMods.visMult * playerMods.visMult,
    lobFreq: teamMods.lobFreq * playerMods.lobFreq,
    crossMult: teamMods.crossMult * playerMods.crossMult,
    driMult: teamMods.driMult * playerMods.driMult,
    defMult: teamMods.defMult * playerMods.defMult,
    phyMult: teamMods.phyMult * playerMods.phyMult,
    gkMult: teamMods.gkMult * playerMods.gkMult,
    pressMult: teamMods.pressMult * playerMods.pressMult,
  };
}

export function stepMatchPhysics(state: SimMatchState, dt: number, rng: () => number): string[] {
  const events: string[] = [];
  const { pitchW, pitchH, ball, dots } = state;
  const padX = Math.round(pitchW * 0.028);
  const padY = Math.round(pitchH * 0.039);
  const goalTop = pitchH * 0.415;
  const goalBot = pitchH * 0.585;
  const boxW = Math.round(pitchW * 0.131); // ~168px on 1280w

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
  if ((state.goalKickSafeTimer || 0) > 0) {
    state.goalKickSafeTimer = Math.max(0, (state.goalKickSafeTimer || 0) - dt);
    if (state.goalKickSafeTimer <= 0) {
      state.goalKickTeam = null;
    }
  }

  // Advance match clock & trigger Halftime (45') clean center kickoff reset
  state.elapsedMinutes += dt * 1.85;
  if (state.elapsedMinutes >= 45 && !state.halfTimeDone) {
    state.halfTimeDone = true;
    state.elapsedMinutes = 45;
    resetKickoff(state, 'away');
    events.push('HALFTIME');
    return events;
  }

  if (ball.kickCooldown > 0) {
    ball.kickCooldown = Math.max(0, ball.kickCooldown - dt);
  }

  const prevX = ball.x;
  const prevY = ball.y;

  // Advance free ball physics (including Magnus finesse curve)
  if (!ball.ownerId) {
    if (ball.curveAx || ball.curveAy) {
      ball.vx += (ball.curveAx || 0) * dt;
      ball.vy += (ball.curveAy || 0) * dt;
      const curveDecay = Math.pow(0.96, dt * 60);
      ball.curveAx = (ball.curveAx || 0) * curveDecay;
      ball.curveAy = (ball.curveAy || 0) * curveDecay;
    }
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    ball.z = Math.max(0, ball.z + ball.vz * dt);
    if (ball.z > 0) {
      ball.vz -= 475 * dt;
      if (ball.z <= 0) {
        ball.z = 0;
        ball.vz = Math.abs(ball.vz) > 48 ? -ball.vz * 0.34 : 0;
      }
    }
    const friction = ball.z > 2 ? 0.993 : 0.976;
    ball.vx *= Math.pow(friction, dt * 60);
    ball.vy *= Math.pow(friction, dt * 60);
    if (Math.hypot(ball.vx, ball.vy) < 40) {
      state.shotInFlight = null;
      ball.curveAx = 0;
      ball.curveAy = 0;
    }
  } else {
    ball.curveAx = 0;
    ball.curveAy = 0;
  }

  const statNorm = (val: number) => Math.pow(Math.max(0, Math.min(1, (val - 35) / 64)), 1.45);
  const dotOvr = (d: PitchDot) => d.ovr ?? Math.round((d.pac + d.sho + d.pas + d.dri + d.def + (d.phy ?? 70)) / 6);
  const homeTeamMods = computePlaystyleMods(state.homePlaystyles);
  const awayTeamMods = computePlaystyleMods(state.awayPlaystyles);

  const getDotMods = (d: PitchDot): ComputedPlaystyleMods => {
    const teamM = d.team === 'home' ? homeTeamMods : awayTeamMods;
    if (!d.playerPlaystyles || d.playerPlaystyles.length === 0) return teamM;
    return combineMods(teamM, computePlayerPlaystyleMods(d.playerPlaystyles));
  };

  // Push opposing outfield players cleanly outside the penalty box + buffer on goal kicks
  const enforceGoalKickBoxClearance = (gkTeam: 'home' | 'away') => {
    const safeMinX = padX + boxW + 66;
    const safeMaxX = pitchW - padX - boxW - 66;
    for (const d of dots) {
      if (d.redCarded || d.role === 'GK' || d.team === gkTeam) continue;
      if (gkTeam === 'home' && d.x < safeMinX) {
        d.x = safeMinX + 10 + rng() * 28;
        d.vx = Math.max(0, d.vx);
      } else if (gkTeam === 'away' && d.x > safeMaxX) {
        d.x = safeMaxX - 10 - rng() * 28;
        d.vx = Math.min(0, d.vx);
      }
    }
  };

  // GK swept save check (enhanced reach & reaction against fast rockets & curlers)
  if (!ball.ownerId && ball.kickCooldown <= 0 && ball.z < 56) {
    for (const gk of dots) {
      if (gk.redCarded || gk.role !== 'GK') continue;
      const gkMods = getDotMods(gk);
      const shooterDot = state.shotInFlight ? dots.find((d) => d.name === state.shotInFlight!.shooterName && d.team === state.shotInFlight!.team) : null;
      const shooterMods = shooterDot ? getDotMods(shooterDot) : (state.shotInFlight ? (state.shotInFlight.team === 'home' ? homeTeamMods : awayTeamMods) : null);
      const gkDefN = Math.min(1.38, statNorm(gk.def) * gkMods.gkMult);
      const gkOvrN = statNorm(dotOvr(gk));
      const isShot = Boolean(state.shotInFlight && state.shotInFlight.team !== gk.team);
      const gkReach = (isShot ? 16.5 : 13.0) + gkDefN * 19 + gkOvrN * 6.0;
      const segDist = distPointToSeg(gk.x, gk.y, prevX, prevY, ball.x, ball.y);
      if (segDist < gkReach) {
        const speed = Math.hypot(ball.vx, ball.vy);
        if (isShot || speed > 210) {
          const isLongRocket = Boolean(state.shotInFlight?.isLongShot);
          const isFinesseShot = Boolean(state.shotInFlight?.isFinesse);
          const finisherEdge = shooterMods ? (shooterMods.finMult - 1) * 0.20 + (shooterMods.shoMult - 1) * 0.14 : 0;
          const shotPowerPenalty =
            Math.min(0.38, Math.max(0, (speed - 420) / 1450)) +
            (isLongRocket ? 0.08 : 0) +
            (isFinesseShot ? 0.14 : 0) +
            finisherEdge;
          const saveChance = Math.max(0.18, Math.min(0.86, 0.30 + gkDefN * 0.44 + gkOvrN * 0.14 - shotPowerPenalty));
          if (rng() < saveChance) {
            const catchChance = Math.max(0.14, 0.44 + gkDefN * 0.28 - shotPowerPenalty * 0.55 - (speed > 700 ? 0.16 : 0));
            if (rng() < catchChance) {
              ball.ownerId = gk.id;
              ball.lastTouchTeam = gk.team;
              ball.x = gk.x;
              ball.y = gk.y;
              ball.vx = 0;
              ball.vy = 0;
              ball.vz = 0;
              ball.curveAx = 0;
              ball.curveAy = 0;
              ball.z = 0;
              ball.kickCooldown = 0.28;
              state.gkHoldTimer = 0.65;
              state.shotInFlight = null;
              state.passTargetId = null;
              events.push(`SAVE_${gk.team.toUpperCase()}`);
            } else {
              const clearDir = gk.team === 'home' ? 1 : -1;
              const sideSign = ball.y >= pitchH / 2 ? 1 : -1;
              ball.ownerId = null;
              ball.lastTouchTeam = gk.team;
              ball.x = gk.x + clearDir * 14;
              ball.vx = clearDir * (195 + rng() * 110);
              ball.vy = sideSign * (220 + rng() * 140);
              ball.vz = 65;
              ball.curveAx = 0;
              ball.curveAy = 0;
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

  // Goal or Endline Restart (Corner Kick / Goal Kick)
  if (!ball.ownerId && ball.x <= padX) {
    if (inGoalMouthY && ball.z < 52) {
      state.awayScore += 1;
      state.goalBannerTimer = 2.0;
      state.freezeTicks = 40;
      events.push('GOAL_AWAY');
      if (state.shotInFlight?.isLongShot) events.push('LONG_GOAL_AWAY');
      resetKickoff(state, 'home');
      return events;
    }
    state.shotInFlight = null;
    state.passTargetId = null;
    if (Math.abs(ball.y - goalTop) < 12 || Math.abs(ball.y - goalBot) < 12) {
      events.push('WOODWORK');
    }
    if (ball.lastTouchTeam === 'home') {
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
      const gk = dots.find((d) => d.team === 'home' && d.role === 'GK');
      ball.x = padX + 36;
      ball.y = pitchH * 0.5;
      ball.z = 0;
      ball.vx = 0;
      ball.vy = 0;
      ball.vz = 0;
      ball.kickCooldown = 0.35;
      state.goalKickTeam = 'home';
      state.goalKickSafeTimer = 2.0;
      enforceGoalKickBoxClearance('home');
      if (gk) {
        gk.x = ball.x;
        gk.y = ball.y;
        ball.ownerId = gk.id;
        ball.lastTouchTeam = 'home';
        state.gkHoldTimer = 0.85;
      }
      events.push('GOALKICK_HOME');
    }
  } else if (!ball.ownerId && ball.x >= pitchW - padX) {
    if (inGoalMouthY && ball.z < 52) {
      state.homeScore += 1;
      state.goalBannerTimer = 2.0;
      state.freezeTicks = 40;
      events.push('GOAL_HOME');
      if (state.shotInFlight?.isLongShot) events.push('LONG_GOAL_HOME');
      resetKickoff(state, 'away');
      return events;
    }
    state.shotInFlight = null;
    state.passTargetId = null;
    if (Math.abs(ball.y - goalTop) < 12 || Math.abs(ball.y - goalBot) < 12) {
      events.push('WOODWORK');
    }
    if (ball.lastTouchTeam === 'away') {
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
      const gk = dots.find((d) => d.team === 'away' && d.role === 'GK');
      ball.x = pitchW - padX - 36;
      ball.y = pitchH * 0.5;
      ball.z = 0;
      ball.vx = 0;
      ball.vy = 0;
      ball.vz = 0;
      ball.kickCooldown = 0.35;
      state.goalKickTeam = 'away';
      state.goalKickSafeTimer = 2.0;
      enforceGoalKickBoxClearance('away');
      if (gk) {
        gk.x = ball.x;
        gk.y = ball.y;
        ball.ownerId = gk.id;
        ball.lastTouchTeam = 'away';
        state.gkHoldTimer = 0.85;
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

  // Continuously enforce goal-kick box clearance while safe timer is active
  if ((state.goalKickSafeTimer || 0) > 0 && state.goalKickTeam) {
    enforceGoalKickBoxClearance(state.goalKickTeam);
  }

  // Find 1st nearest presser & 2nd passing-lane screener per team + defensive lines
  let nearestHome: PitchDot | null = null;
  let nearestHomeDist = Infinity;
  let secondHome: PitchDot | null = null;
  let secondHomeDist = Infinity;

  let nearestAway: PitchDot | null = null;
  let nearestAwayDist = Infinity;
  let secondAway: PitchDot | null = null;
  let secondAwayDist = Infinity;

  const homeXs: number[] = [];
  const awayXs: number[] = [];

  for (const d of dots) {
    if (d.redCarded) continue;
    if (d.team === 'home') homeXs.push(d.x);
    else awayXs.push(d.x);
    if (d.role === 'GK') continue;
    const dist = Math.hypot(ball.x - d.x, ball.y - d.y);
    if (d.team === 'home') {
      if (dist < nearestHomeDist) {
        secondHome = nearestHome;
        secondHomeDist = nearestHomeDist;
        nearestHome = d;
        nearestHomeDist = dist;
      } else if (dist < secondHomeDist) {
        secondHome = d;
        secondHomeDist = dist;
      }
    } else {
      if (dist < nearestAwayDist) {
        secondAway = nearestAway;
        secondAwayDist = nearestAwayDist;
        nearestAway = d;
        nearestAwayDist = dist;
      } else if (dist < secondAwayDist) {
        secondAway = d;
        secondAwayDist = dist;
      }
    }
  }
  homeXs.sort((a, b) => a - b);
  awayXs.sort((a, b) => b - a);
  const homeBackLineX = homeXs[1] ?? padX + boxW;
  const awayBackLineX = awayXs[1] ?? pitchW - padX - boxW;

  const homeTac = state.homeTactics || DEFAULT_TACTICS;
  const awayTac = state.awayTactics || DEFAULT_TACTICS;
  const ballRatioX = ball.x / pitchW;
  const ownerDot = ball.ownerId ? dots.find((d) => d.id === ball.ownerId) || null : null;
  const possessingTeam = ownerDot ? ownerDot.team : ball.lastTouchTeam;
  const gkHoldingBall = Boolean(ownerDot && ownerDot.role === 'GK' && (state.gkHoldTimer || 0) > 0);
  const goalKickActive = (state.goalKickSafeTimer || 0) > 0 && state.goalKickTeam;

  for (const dot of dots) {
    if (dot.redCarded) continue;

    if (dot.diveTimer > 0) {
      dot.diveTimer = Math.max(0, dot.diveTimer - dt);
      dot.y = Math.max(goalTop - 6, Math.min(goalBot + 6, dot.y + dot.diveVy * dt));
      continue;
    }
    if ((dot.dribbleCD || 0) > 0) dot.dribbleCD = Math.max(0, (dot.dribbleCD || 0) - dt);
    if ((dot.tackleCD || 0) > 0) dot.tackleCD = Math.max(0, (dot.tackleCD || 0) - dt);

    const tac = dot.team === 'home' ? homeTac : awayTac;
    const mods = getDotMods(dot);
    const isOwner = ball.ownerId === dot.id;
    const ovrN = statNorm(dotOvr(dot));
    const pacN = Math.min(1.38, statNorm(dot.pac) * mods.pacMult);
    const driN = Math.min(1.42, statNorm(dot.dri) * mods.driMult);
    const defN = Math.min(1.42, statNorm(dot.def) * mods.defMult);
    const phyN = Math.min(1.42, statNorm(dot.phy ?? 70) * mods.phyMult);
    const shoN = Math.min(1.45, statNorm(dot.sho) * mods.shoMult);
    const finN = Math.min(1.45, statNorm(dot.fin ?? dot.sho) * mods.finMult);
    const pasN = Math.min(1.40, statNorm(dot.pas) * mods.pasMult);
    const visN = Math.min(1.40, statNorm(dot.vis ?? dot.pas) * mods.visMult * mods.pasMult);

    dot.burstPhase = (dot.burstPhase ?? (dot.slotIndex * 1.13)) + dt * (1.2 + pacN * 0.68);
    const burstWave = Math.sin(dot.burstPhase);
    const burstFactor = 0.87 + (burstWave > 0.25 ? 0.22 * mods.burstMult : 0.0) + (isOwner && burstWave > 0 ? 0.07 : 0);
    const isPrimaryPresser = dot === nearestHome || dot === nearestAway;
    const pressBoost = isPrimaryPresser
      ? (0.93 + (tac.aggressiveness / 100) * 0.14 + ovrN * 0.05) * mods.pressMult
      : 1;
    const speedBaseRaw = (63 + pacN * 114 + ovrN * 14) * pressBoost * burstFactor;
    const pos = dot.pos || dot.role;
    const traits = dot.traits || [];
    const attackDir = dot.team === 'home' ? 1 : -1;
    const blockedByGoalKick = Boolean(goalKickActive && goalKickActive !== dot.team);
    let speedBase = speedBaseRaw;

    let targetX = dot.homeX;
    let targetY = dot.homeY;

    if (dot.role === 'GK') {
      const goalLineX = dot.team === 'home' ? padX + 18 : pitchW - padX - 18;
      const goalY = pitchH * 0.5;
      const boxLimitX = dot.team === 'home' ? padX + boxW - 14 : pitchW - padX - boxW + 14;
      const isRusherGK = traits.includes('Sweeper Keeper') || mods.gkMult > 1.15 || dot.pac >= 60;
      const shotApproaching = Boolean(state.shotInFlight && state.shotInFlight.team !== dot.team);
      const ballTowardMyGoal = dot.team === 'home' ? ball.vx < -90 : ball.vx > 90;

      if (shotApproaching && ballTowardMyGoal && Math.abs(ball.vx) > 15) {
        // Active shot reaction: predict crossing Y along GK line and sprint/dive to cut off corners!
        const tToGk = Math.max(0.02, Math.min(1.4, (dot.x - ball.x) / ball.vx));
        const predY = state.shotInFlight?.targetGoalY ?? (ball.y + ball.vy * tToGk + 0.5 * (ball.curveAy || 0) * tToGk * tToGk);
        targetX = dot.x;
        targetY = Math.max(goalTop - 6, Math.min(goalBot + 6, predY));
        speedBase = 215 + statNorm(dot.def) * mods.gkMult * 185 + ovrN * 55;
      } else {
        // Angle-bisecting box command + Sweeper Rusher charge on 1v1 / loose balls in the box
        const ballDistToGoal = Math.hypot(ball.x - goalLineX, ball.y - goalY);
        const looseInBox = !ball.ownerId && (dot.team === 'home' ? ball.x < padX + boxW + 55 : ball.x > pitchW - padX - boxW - 55);
        const oppBreakaway = Boolean(
          ownerDot &&
          ownerDot.team !== dot.team &&
          (dot.team === 'home' ? ownerDot.x < padX + boxW + 75 : ownerDot.x > pitchW - padX - boxW - 75) &&
          !dots.some((d) => !d.redCarded && d.team === dot.team && d.role === 'DEF' && (dot.team === 'home' ? d.x < ownerDot.x : d.x > ownerDot.x))
        );

        if (!isOwner && (looseInBox || (isRusherGK && oppBreakaway))) {
          // Rush out decisively toward ball / attacker inside the penalty area!
          const rushTargetX = ball.x * 0.85 + goalLineX * 0.15;
          targetX = dot.team === 'home' ? Math.min(boxLimitX, Math.max(goalLineX + 12, rushTargetX)) : Math.max(boxLimitX, Math.min(goalLineX - 12, rushTargetX));
          targetY = Math.max(pitchH * 0.24, Math.min(pitchH * 0.76, ball.y));
          speedBase = (isRusherGK ? 185 : 152) + pacN * 65 + ovrN * 25;
        } else {
          // Dynamic cone narrowing inside the box (moves in BOTH X and Y, never glued strictly on goal line)
          const threatClose = Math.max(0, 1 - ballDistToGoal / (pitchW * 0.65));
          const maxBoxStep = isRusherGK ? 105 : 68;
          const desiredStep = isOwner ? 14 : 18 + threatClose * maxBoxStep;
          targetX = dot.team === 'home' ? Math.min(boxLimitX, goalLineX + desiredStep) : Math.max(boxLimitX, goalLineX - desiredStep);
          const coneT = Math.min(0.45, desiredStep / Math.max(85, Math.abs(ball.x - goalLineX)));
          const angleY = goalY + (ball.y - goalY) * coneT;
          targetY = Math.max(goalTop - 10, Math.min(goalBot + 10, angleY));
          speedBase = 120 + pacN * 55 + statNorm(dot.def) * 45;
        }
      }
    } else if (isOwner) {
      const isWideRole = pos === 'LW' || pos === 'RW' || pos === 'LM' || pos === 'RM' || pos === 'LB' || pos === 'RB';
      const goalX = dot.team === 'home' ? pitchW - padX : padX;
      const distGoal = Math.hypot(goalX - dot.x, pitchH * 0.5 - dot.y);
      let repelX = 0;
      let repelY = 0;
      let evaded = false;

      for (const opp of dots) {
        if (opp.team === dot.team || opp.redCarded) continue;
        const od = Math.hypot(dot.x - opp.x, dot.y - opp.y);
        if (od < 78 && od > 1) {
          const evadeBoost = (0.55 + driN * 0.85 + ovrN * 0.22) * (0.7 + (tac.dribbleTendency / 100) * 0.65);
          repelX += ((dot.x - opp.x) / od) * ((78 - od) / 78) * 72 * evadeBoost;
          repelY += ((dot.y - opp.y) / od) * ((78 - od) / 78) * 100 * evadeBoost;
          if (od < 34 && (dot.dribbleCD || 0) <= 0 && rng() < (0.022 + driN * 0.085) * (0.6 + tac.dribbleTendency / 100)) {
            evaded = true;
          }
        }
      }
      if (evaded) {
        dot.dribbleCD = 0.85;
        if (dot.team === 'home') state.homeDribbles = (state.homeDribbles || 0) + 1;
        else state.awayDribbles = (state.awayDribbles || 0) + 1;
        events.push(`DRIBBLE_${dot.team.toUpperCase()}:${dot.name}`);
      }

      const inCutInZone = distGoal < pitchW * 0.24;
      const preferFlank = isWideRole && !inCutInZone && (tac.crossIntensity >= 45 || distGoal > pitchW * 0.22);
      const desiredY = preferFlank
        ? (dot.y < pitchH * 0.5 ? padY + 64 : pitchH - padY - 64)
        : pitchH * 0.5;
      targetX = Math.max(padX + 20, Math.min(pitchW - padX - 20, dot.x + attackDir * 135 + repelX));
      targetY = Math.max(padY + 22, Math.min(pitchH - padY - 22, dot.y + (desiredY - dot.y) * 0.28 + repelY));
    } else if (state.passTargetId === dot.id && !ball.ownerId) {
      targetX = ball.x + ball.vx * 0.16;
      targetY = ball.y + ball.vy * 0.16;
    } else if (isPrimaryPresser && !blockedByGoalKick && !(gkHoldingBall && ownerDot?.team !== dot.team)) {
      targetX = ball.x + (ownerDot ? ownerDot.vx * 0.1 : 0);
      targetY = ball.y + (ownerDot ? ownerDot.vy * 0.1 : 0);
    } else if ((dot === secondHome || dot === secondAway) && possessingTeam !== dot.team && !blockedByGoalKick && !(gkHoldingBall && ownerDot?.team !== dot.team)) {
      const oppGoalX = dot.team === 'home' ? padX + 40 : pitchW - padX - 40;
      targetX = ball.x * 0.72 + oppGoalX * 0.28;
      targetY = ball.y * 0.68 + (pitchH * 0.5) * 0.32;
    } else {
      // Organic, role-staggered football positioning (breaks robotic synchronized rows!)
      const teamAttacking = possessingTeam === dot.team;
      const lineBias = ((tac.positioningLine - 50) / 100) * pitchW * 0.18 * attackDir;
      const freedom = 0.26 + (tac.positioningFreedom / 100) * 0.44;
      const phaseBias = teamAttacking ? attackDir * pitchW * 0.08 : -attackDir * pitchW * 0.068;
      const shiftX = (ballRatioX - 0.5) * pitchW * (0.28 + freedom * 0.18) + phaseBias + lineBias;
      const laneShiftY = (ball.y - pitchH * 0.5) * (teamAttacking ? 0.15 : 0.28);

      // Subtle individual tactical micro-drift so players breathe naturally on the pitch
      const tClock = state.elapsedMinutes * 0.65;
      const organicX = Math.sin(tClock + dot.slotIndex * 2.17) * (10 + freedom * 16);
      const organicY = Math.cos(tClock * 0.85 + dot.slotIndex * 1.73) * (12 + freedom * 18);

      const isBallSide = Math.abs(dot.homeY - ball.y) < pitchH * 0.24;
      const isStopperCB = (dot.homeY <= pitchH * 0.5) === (ball.y <= pitchH * 0.5);
      const ballOnTopFlank = ball.y < pitchH * 0.42;
      const ballOnBotFlank = ball.y > pitchH * 0.58;

      targetX = dot.homeX + shiftX + organicX;
      targetY = dot.homeY + laneShiftY + organicY;

      if (teamAttacking) {
        const ownThird = dot.team === 'home' ? ball.x < pitchW * 0.34 : ball.x > pitchW * 0.66;
        if (ownThird && dot.role === 'DEF') {
          if (pos === 'CB') {
            targetX = dot.team === 'home' ? padX + boxW + (isStopperCB ? 44 : 16) : pitchW - padX - boxW - (isStopperCB ? 44 : 16);
            targetY = dot.homeY < pitchH * 0.5 ? pitchH * 0.31 : pitchH * 0.69;
          } else {
            targetX += attackDir * (isBallSide ? 86 : 40);
          }
        } else if (ownThird && pos === 'CDM') {
          targetX = dot.team === 'home' ? padX + boxW + 135 : pitchW - padX - boxW - 135;
          targetY = pitchH * 0.5 + (ball.y - pitchH * 0.5) * 0.25;
        } else if (pos === 'CB') {
          // Stopper CB steps higher to support midfield, Cover CB holds depth
          targetX += attackDir * (isStopperCB ? 26 : -22);
        } else if (pos === 'ST') {
          const checkShort = ownThird ? -45 : 74 + tac.positioningFreedom * 0.38;
          targetX += attackDir * checkShort;
          targetY = pitchH * 0.5 + (ballOnTopFlank ? 44 : ballOnBotFlank ? -44 : 0) + organicY * 0.6;
        } else if (pos === 'LW' || pos === 'LM') {
          targetX += attackDir * (ballOnBotFlank ? 98 : 54);
          targetY = ballOnBotFlank ? pitchH * 0.26 : Math.min(targetY, pitchH * 0.18);
        } else if (pos === 'RW' || pos === 'RM') {
          targetX += attackDir * (ballOnTopFlank ? 98 : 54);
          targetY = ballOnTopFlank ? pitchH * 0.74 : Math.max(targetY, pitchH * 0.82);
        } else if (pos === 'LB' || pos === 'RB') {
          const onMySide = (pos === 'LB' && ballOnTopFlank) || (pos === 'RB' && ballOnBotFlank);
          if (onMySide || tac.crossIntensity > 65) {
            targetX += attackDir * 105;
          } else {
            // Far-side FB tucks inside as rest-defense rather than marching symmetrically!
            targetX += attackDir * 18;
            targetY += (pitchH * 0.5 - targetY) * 0.26;
          }
        } else if (pos === 'CM') {
          // Stagger ball-side CM vs far-side box-crasher CM
          targetX += attackDir * (isBallSide ? 24 : 76);
          targetY += isBallSide ? (ball.y - targetY) * 0.16 : 0;
        } else if (pos === 'CAM') {
          targetX += attackDir * 58;
          targetY = pitchH * 0.5 + (ball.y - pitchH * 0.5) * 0.26 + Math.sin(tClock * 1.1) * 32;
        }

        if (dot.role === 'FWD') {
          if (dot.team === 'home') targetX = Math.min(targetX, awayBackLineX - 6);
          else targetX = Math.max(targetX, homeBackLineX + 6);
        }
      } else {
        // Out of possession: Stopper + Cover CB stagger & far-side FB tuck-in
        if (pos === 'CB') {
          targetX += attackDir * (isStopperCB ? 28 : -24);
          if (!isStopperCB) targetY += (pitchH * 0.5 - targetY) * 0.24;
        } else if (pos === 'LB' || pos === 'RB') {
          const onMySide = (pos === 'LB' && ballOnTopFlank) || (pos === 'RB' && ballOnBotFlank);
          if (onMySide) {
            targetX += attackDir * 18;
          } else {
            targetX -= attackDir * 16;
            targetY += (pitchH * 0.5 - targetY) * 0.30;
          }
        } else if (dot.role === 'MID') {
          // Ball-side midfielder closes higher; weak-side midfielder tucks centrally to screen
          targetX += attackDir * (isBallSide ? 22 : -18);
          if (!isBallSide) targetY += (pitchH * 0.5 - targetY) * 0.22;
        }

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
            const w = (tac.manMarking / 100) * 0.65;
            const goalSideX = markOpp.x - attackDir * 18;
            targetX = targetX * (1 - w) + goalSideX * w;
            targetY = targetY * (1 - w) + markOpp.y * w;
          }
        }
        if (dot.role === 'DEF') {
          const lineDepth = padX + boxW + 30 + (tac.positioningLine / 100) * 145;
          const ballNearOwnBox = dot.team === 'home' ? ball.x < padX + boxW + 65 : ball.x > pitchW - padX - boxW - 65;
          if (!ballNearOwnBox) {
            if (dot.team === 'home') {
              targetX = Math.max(lineDepth * 0.85, Math.min(pitchW * 0.56, targetX));
            } else {
              const rightLine = pitchW - lineDepth;
              targetX = Math.min(pitchW - lineDepth * 0.85, Math.max(pitchW * 0.44, Math.min(targetX, rightLine + 80)));
            }
          }
        }
      }

      // Soft anti-clumping separation from nearby teammates
      for (const mate of dots) {
        if (mate === dot || mate.team !== dot.team || mate.redCarded || mate.role === 'GK') continue;
        const md = Math.hypot(dot.x - mate.x, dot.y - mate.y);
        if (md > 1 && md < 46) {
          targetX += ((dot.x - mate.x) / md) * (46 - md) * 0.85;
          targetY += ((dot.y - mate.y) / md) * (46 - md) * 0.85;
        }
      }

      if (blockedByGoalKick || (gkHoldingBall && ownerDot && ownerDot.team !== dot.team)) {
        const oppGkTeam = dot.team === 'home' ? 'away' : 'home';
        if (oppGkTeam === 'home') targetX = Math.max(targetX, padX + boxW + 66);
        else targetX = Math.min(targetX, pitchW - padX - boxW - 66);
      }

      targetX = Math.max(padX + 28, Math.min(pitchW - padX - 28, targetX));
      targetY = Math.max(padY + 24, Math.min(pitchH - padY - 24, targetY));
    }

    const dx = targetX - dot.x;
    const dy = targetY - dot.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 3) {
      const turnRate = dot.role === 'GK' ? 0.36 : Math.min(0.45, 0.08 + driN * 0.14 + ovrN * 0.045);
      const desiredVx = (dx / dist) * speedBase;
      const desiredVy = (dy / dist) * speedBase;
      dot.vx += (desiredVx - dot.vx) * turnRate;
      dot.vy += (desiredVy - dot.vy) * turnRate;
      dot.x = Math.max(padX + 10, Math.min(pitchW - padX - 10, dot.x + dot.vx * dt));
      dot.y = Math.max(padY + 10, Math.min(pitchH - padY - 10, dot.y + dot.vy * dt));
    }

    // Outfield ball pickup / interception / tackle / shot block
    if (dot.role !== 'GK' && ball.kickCooldown <= 0 && ball.z < 26 && (dot.tackleCD || 0) <= 0) {
      if (blockedByGoalKick || (gkHoldingBall && ownerDot?.team !== dot.team)) {
        continue;
      }
      const segDist = distPointToSeg(dot.x, dot.y, prevX, prevY, ball.x, ball.y);
      const aggFactor = tac.aggressiveness / 100;
      const reach = 9.0 + Math.min(1.25, defN) * 4.2 + ovrN * 2.2 + aggFactor * 2.0;
      if (segDist < reach) {
        if (state.shotInFlight && state.shotInFlight.team !== dot.team && !ball.ownerId) {
          ball.vx = (dot.team === 'home' ? 1 : -1) * (115 + rng() * 95);
          ball.vy = (rng() - 0.5) * 185;
          ball.vz = 25;
          ball.lastTouchTeam = dot.team;
          ball.kickCooldown = 0.25;
          state.shotInFlight = null;
          events.push(`BLOCK_${dot.team.toUpperCase()}`);
          continue;
        }
        const ownerMods = ownerDot ? getDotMods(ownerDot) : null;
        const ownerDriN = ownerDot ? statNorm(ownerDot.dri) * (ownerMods?.driMult || 1) : 0;
        const ownerPhyN = ownerDot ? statNorm(ownerDot.phy ?? 70) * (ownerMods?.phyMult || 1) : 0;
        const ownerOvrN = ownerDot ? statNorm(dotOvr(ownerDot)) : 0;
        const tackleOdds = Math.max(
          0.14,
          Math.min(0.76, 0.24 + defN * 0.36 + phyN * 0.14 + ovrN * 0.14 + aggFactor * 0.12 - ownerDriN * 0.24 - ownerPhyN * 0.08 - ownerOvrN * 0.10)
        );
        const looseControlOdds = ball.ownerId ? tackleOdds : Math.min(0.96, 0.54 + ovrN * 0.34 + driN * 0.12);
        if (!ball.ownerId && rng() < looseControlOdds) {
          ball.ownerId = dot.id;
          ball.lastTouchTeam = dot.team;
          ball.z = 0;
          ball.vz = 0;
          ball.kickCooldown = 0.26;
          state.carryTime = 0;
          state.passTargetId = null;
          state.shotInFlight = null;
        } else if (ball.ownerId && ball.lastTouchTeam !== dot.team && ownerDot) {
          if (rng() < tackleOdds) {
            if (dot.team === 'home') state.homeTackles = (state.homeTackles || 0) + 1;
            else state.awayTackles = (state.awayTackles || 0) + 1;
            events.push(`TACKLE_${dot.team.toUpperCase()}`);
            if (rng() < 0.014 + aggFactor * 0.04) events.push(`FOUL_${dot.team.toUpperCase()}`);
            const sepAngle = Math.atan2(ownerDot.y - dot.y, ownerDot.x - dot.x);
            ownerDot.x = Math.max(padX + 12, Math.min(pitchW - padX - 12, ownerDot.x + Math.cos(sepAngle) * 16));
            ownerDot.y = Math.max(padY + 12, Math.min(pitchH - padY - 12, ownerDot.y + Math.sin(sepAngle) * 16));
            ownerDot.tackleCD = 0.48;
            dot.tackleCD = 0.30;
            ball.ownerId = dot.id;
            ball.lastTouchTeam = dot.team;
            ball.z = 0;
            ball.vz = 0;
            ball.kickCooldown = 0.36;
            state.carryTime = 0;
            state.passTargetId = null;
            state.shotInFlight = null;
          } else {
            dot.tackleCD = 0.42;
            ball.kickCooldown = 0.20;
          }
        }
      }
    }

    // Owner decisions: GK calm distribution to most open mate, kickoff back-pass, shoot, cross, carry, switch/lob/pass
    if (ball.ownerId === dot.id) {
      ball.x = dot.x + (dot.team === 'home' ? 8 : -8);
      ball.y = dot.y;
      ball.vx = dot.vx;
      ball.vy = dot.vy;

      // GK smart open-teammate distribution
      if (dot.role === 'GK') {
        if ((state.gkHoldTimer || 0) <= 0) {
          const mates = dots.filter((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded && m.role !== 'FWD');
          const pool = mates.length > 0 ? mates : dots.filter((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded);
          if (pool.length > 0) {
            let bestTarget = pool[0];
            let bestSafety = -Infinity;
            for (const m of pool) {
              let minOppDist = Infinity;
              let minLaneDist = Infinity;
              for (const opp of dots) {
                if (opp.team === dot.team || opp.redCarded) continue;
                const dM = Math.hypot(opp.x - m.x, opp.y - m.y);
                if (dM < minOppDist) minOppDist = dM;
                const dL = distPointToSeg(opp.x, opp.y, dot.x, dot.y, m.x, m.y);
                if (dL < minLaneDist) minLaneDist = dL;
              }
              const wideBonus = m.pos === 'LB' || m.pos === 'RB' ? 28 : 0;
              const safetyScore = Math.min(180, minOppDist) * 1.4 + Math.min(100, minLaneDist) * 1.1 + wideBonus + rng() * 14;
              if (safetyScore > bestSafety) {
                bestSafety = safetyScore;
                bestTarget = m;
              }
            }
            const pdx = bestTarget.x - dot.x;
            const pdy = bestTarget.y - dot.y;
            const pLen = Math.hypot(pdx, pdy) || 1;
            const passSpeed = Math.min(440, 245 + pLen * 0.72);
            ball.ownerId = null;
            ball.vx = (pdx / pLen) * passSpeed;
            ball.vy = (pdy / pLen) * passSpeed;
            ball.vz = pLen > 210 ? 132 : 24;
            ball.kickCooldown = 0.28;
            state.passTargetId = bestTarget.id;
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
            ball.ownerId = null;
            ball.vx = (pdx / pLen) * 238;
            ball.vy = (pdy / pLen) * 238;
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
      const longShotRangeBonus = (mods.longShotFreq - 1) * 0.045 + (traits.includes('Long Shot') ? 0.04 : 0);
      const maxShotRange = pitchW * Math.min(0.41, 0.18 + shoN * 0.095 + (tac.shootIntensity / 100) * 0.075 + longShotRangeBonus);
      const goodAngle = Math.abs(dot.y - pitchH * 0.5) < pitchH * 0.29;
      const roleShootBoost = dot.role === 'FWD' ? 1.38 : dot.role === 'DEF' ? 0.36 : 0.96;
      const isOutsideBox = distToGoal > boxW + 38;
      const longShotProb = (0.008 + shoN * 0.022 + (traits.includes('Long Shot') ? 0.012 : 0)) * mods.longShotFreq;
      const shotProb = (
        !isOutsideBox
          ? (0.088 + finN * 0.15 + ovrN * 0.05)
          : longShotProb
      ) * shootScale * roleShootBoost;

      // Realistic first-touch settle before shooting; supports blazing Power/Long Shots & rare curving Finesse Shots
      const minShotSettle = isOutsideBox ? 0.22 : 0.12;
      if ((state.carryTime || 0) > minShotSettle && distToGoal < maxShotRange && goodAngle && rng() < shotProb) {
        const isFinesseSpecialist = traits.includes('Finesse Shot');
        const inHalfSpace = Math.abs(dot.y - pitchH * 0.5) > 48 && distToGoal > 120 && distToGoal < pitchW * 0.34;
        const finesseRollChance = isFinesseSpecialist ? 0.24 : 0.015;
        const isFinesseShot = inHalfSpace && rng() < finesseRollChance;

        const cornerAimBoost = isOutsideBox && (mods.longShotFreq > 1.3 || shoN > 0.65) ? 0.62 : 1.0;
        const spread = ((1 - Math.min(1, finN)) * (pitchH * 0.16) + (1 - ovrN) * (pitchH * 0.04) + (nearestOppDist < 30 ? pitchH * 0.04 : 0)) * cornerAimBoost;

        if (isFinesseShot) {
          // Whipped bending finesse aimed initially wider than the far corner, then curving back in!
          const farCornerSign = dot.y < pitchH * 0.5 ? 1 : -1;
          const targetGoalY = pitchH * 0.5 + farCornerSign * (goalBot - goalTop) * (isFinesseSpecialist ? 0.39 : 0.28) + (rng() - 0.5) * (isFinesseSpecialist ? 18 : 54);
          const preBendY = targetGoalY + farCornerSign * (isFinesseSpecialist ? 82 : 42);
          const sdx = goalX - dot.x;
          const sdy = preBendY - dot.y;
          const sLen = Math.hypot(sdx, sdy) || 1;
          const shotSpeed = 540 + shoN * 235 + ovrN * 45;
          const flightT = Math.max(0.25, sLen / shotSpeed);
          // Bend inward (-farCornerSign) across flight time
          const curveMag = (isFinesseSpecialist ? 380 : 170) / Math.max(0.45, flightT);
          ball.ownerId = null;
          ball.vx = (sdx / sLen) * shotSpeed;
          ball.vy = (sdy / sLen) * shotSpeed;
          ball.vz = 44 + rng() * 34;
          ball.curveAx = 0;
          ball.curveAy = -farCornerSign * curveMag;
          ball.kickCooldown = 0.28;
          state.shotInFlight = { team: dot.team, shooterName: dot.name, isLongShot: isOutsideBox, isFinesse: true, targetGoalY };
          state.passTargetId = null;
          if (dot.team === 'home') {
            state.homeShots += 1;
            state.homeFinesseShots = (state.homeFinesseShots || 0) + 1;
            if (isOutsideBox) state.homeLongShots = (state.homeLongShots || 0) + 1;
          } else {
            state.awayShots += 1;
            state.awayFinesseShots = (state.awayFinesseShots || 0) + 1;
            if (isOutsideBox) state.awayLongShots = (state.awayLongShots || 0) + 1;
          }
          events.push(`FINESSE_${dot.team.toUpperCase()}:${dot.name}`);
          continue;
        }

        const targetCornerOffset = isOutsideBox ? (rng() < 0.5 ? -0.36 : 0.36) * (goalBot - goalTop) : 0;
        const aimY = pitchH * 0.5 + targetCornerOffset + (rng() - 0.5) * ((goalBot - goalTop) * 0.68 + spread * 1.5);
        const sdx = goalX - dot.x;
        const sdy = aimY - dot.y;
        const sLen = Math.hypot(sdx, sdy) || 1;
        // Much faster long/power shots so rockets actually zip across the pitch
        const shotSpeed = (isOutsideBox ? 690 : 485) + shoN * (isOutsideBox ? 330 : 270) + ovrN * 56;
        ball.ownerId = null;
        ball.vx = (sdx / sLen) * shotSpeed;
        ball.vy = (sdy / sLen) * shotSpeed;
        ball.vz = isOutsideBox ? (34 + rng() * 42) : (16 + rng() * 34);
        ball.curveAx = 0;
        ball.curveAy = 0;
        ball.kickCooldown = 0.28;
        state.shotInFlight = { team: dot.team, shooterName: dot.name, isLongShot: isOutsideBox, isFinesse: false, targetGoalY: aimY };
        state.passTargetId = null;
        if (dot.team === 'home') {
          state.homeShots += 1;
          if (isOutsideBox) state.homeLongShots = (state.homeLongShots || 0) + 1;
        } else {
          state.awayShots += 1;
          if (isOutsideBox) state.awayLongShots = (state.awayLongShots || 0) + 1;
        }
        events.push(isOutsideBox ? `LONGSHOT_${dot.team.toUpperCase()}:${dot.name}` : `SHOT_${dot.team.toUpperCase()}:${dot.name}`);
        continue;
      }

      // Crossing mechanic: wide players in attacking channels whip lofted crosses into the box
      const inAttackingThird = dot.team === 'home' ? dot.x > pitchW * 0.58 : dot.x < pitchW * 0.42;
      const inWideChannel = dot.y < pitchH * 0.39 || dot.y > pitchH * 0.61;
      const isCrosserPos = pos === 'LW' || pos === 'RW' || pos === 'LM' || pos === 'RM' || pos === 'LB' || pos === 'RB';
      const crossTraitBoost = traits.includes('Whipped Crosser') ? 1.45 : 1.0;
      const crossChance = (tac.crossIntensity / 100) * (0.13 + pasN * 0.09 + visN * 0.04) * crossTraitBoost * mods.crossMult * (isCrosserPos ? 1.4 : 0.72);

      if ((state.carryTime || 0) > 0.22 && inAttackingThird && inWideChannel && rng() < crossChance) {
        const boxTargets = dots.filter(
          (m) => m.team === dot.team && m.id !== dot.id && !m.redCarded && m.role !== 'GK' && (m.role === 'FWD' || m.pos === 'CAM' || m.pos === 'CM')
        );
        if (boxTargets.length > 0) {
          const target = boxTargets.find((m) => m.pos === 'ST') || boxTargets[0];
          const crossErr = (1 - Math.min(1, pasN)) * 70;
          const targetBoxX = dot.team === 'home' ? Math.max(target.x, pitchW - padX - 155) : Math.min(target.x, padX + 155);
          const targetBoxY = pitchH * 0.5 + (rng() - 0.5) * (58 + crossErr);
          const cdx = targetBoxX - dot.x;
          const cdy = targetBoxY - dot.y;
          const cLen = Math.hypot(cdx, cdy) || 1;
          const crossSpeed = Math.min(470, 265 + pasN * 72 + cLen * 0.5);
          ball.ownerId = null;
          ball.vx = (cdx / cLen) * crossSpeed;
          ball.vy = (cdy / cLen) * crossSpeed;
          ball.vz = 155 + rng() * 35;
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

      // First-touch carry & dribble vs structured pass / diagonal switch / through-ball
      const underPressure = nearestOppDist < 42;
      const minCarryForDribble = 0.45 + (tac.dribbleTendency / 100) * 0.54 - (tac.passIntensity / 100) * 0.30 + (traits.includes('Speed Dribbler') ? 0.15 : 0);
      if ((state.carryTime || 0) < minCarryForDribble && !underPressure) {
        continue;
      }

      const rolePassBias = dot.role === 'DEF' ? 1.18 : pos === 'CM' || pos === 'CAM' || pos === 'CDM' ? 1.18 : pos === 'ST' ? 0.62 : 0.9;
      const passTacScale = Math.max(0.16, 0.16 + Math.pow(tac.passIntensity / 100, 1.3) * 1.42 - (tac.dribbleTendency / 100) * 0.28);
      const basePassProb = ((state.carryTime || 0) > 0.72 ? 0.025 : 0.011) + pasN * 0.022 + visN * 0.013 + (underPressure ? 0.04 : 0);
      const passChance = Math.max(0.004, basePassProb * passTacScale * rolePassBias);

      if (rng() < passChance) {
        const mates = dots.filter((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded && m.role !== 'GK');
        if (mates.length > 0) {
          let bestMate = mates[0];
          let bestScore = -Infinity;
          let bestLaneBlocked = false;
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
            const visionWeight = 0.45 + visN * 1.1;
            const wingSwitchBonus = Math.abs(m.y - dot.y) > pitchH * 0.36 && minRecOpp > 75 && visN > 0.5 ? 42 : 0;
            let score = progress * 0.50 * visionWeight + Math.min(95, minRecOpp) * (0.65 + visN * 0.75) + (minLaneOpp < 24 ? -145 * visionWeight : minLaneOpp * 0.85 * visionWeight) + wingSwitchBonus;
            if (underPressure && progress < 0) score += 45;
            if ((traits.includes('Playmaker') || visN > 0.68) && progress > 45 && m.role === 'FWD') score += 48;
            if (progress > 90 && minLaneOpp < 24 && (visN > 0.55 || mods.lobFreq > 1.2)) {
              score += 75 * mods.lobFreq;
            }
            if (score > bestScore) {
              bestScore = score;
              bestMate = m;
              bestLaneBlocked = minLaneOpp < 26;
            }
          }

          const targetDist = Math.hypot(bestMate.x - dot.x, bestMate.y - dot.y);
          const forwardGain = (bestMate.x - dot.x) * attackDir;
          const lobChance = Math.min(0.65, ((bestLaneBlocked ? 0.28 : 0.08) + visN * 0.14) * mods.lobFreq);
          const isLobPass = targetDist > 165 && forwardGain > 45 && rng() < lobChance;

          const err = (1 - Math.min(1, pasN)) * 40 + (1 - ovrN) * 16 + (underPressure ? 10 * (1 - Math.min(1, pasN)) : 0);
          const leadFactor = isLobPass ? (0.14 + visN * 0.18) : (0.08 + visN * 0.15);
          const pdx = bestMate.x + bestMate.vx * leadFactor + (rng() - 0.5) * err - dot.x;
          const pdy = bestMate.y + bestMate.vy * leadFactor + (rng() - 0.5) * err - dot.y;
          const pLen = Math.hypot(pdx, pdy) || 1;
          const passSpeed = isLobPass
            ? Math.min(460, 250 + pasN * 60 + pLen * 0.55)
            : Math.min(445, 212 + pasN * 52 + pLen * 0.74);

          ball.ownerId = null;
          ball.vx = (pdx / pLen) * passSpeed;
          ball.vy = (pdy / pLen) * passSpeed;
          ball.vz = isLobPass ? (160 + rng() * 48) : (pLen > 270 ? 78 : 6);
          ball.kickCooldown = 0.26;
          state.passTargetId = bestMate.id;
          if (dot.team === 'home') {
            state.homePasses = (state.homePasses || 0) + 1;
            if (isLobPass) state.homeLobs = (state.homeLobs || 0) + 1;
          } else {
            state.awayPasses = (state.awayPasses || 0) + 1;
            if (isLobPass) state.awayLobs = (state.awayLobs || 0) + 1;
          }
          events.push(isLobPass ? `LOB_PASS_${dot.team.toUpperCase()}:${dot.name}` : `PASS_${dot.team.toUpperCase()}`);
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
  state.gkHoldTimer = 0;
  state.goalKickSafeTimer = 0;
  state.goalKickTeam = null;

  let taker: PitchDot | null = null;
  for (const d of dots) {
    const defaultKoX = d.team === 'home'
      ? Math.min(pitchW / 2 - 22, padX + (d.homeX - padX) * 0.56)
      : Math.max(pitchW / 2 + 22, pitchW - padX - (pitchW - padX - d.homeX) * 0.56);
    const defaultKoY = Math.max(padY + 24, Math.min(pitchH - padY - 24, d.homeY));
    d.x = d.kickoffX ?? defaultKoX;
    d.y = d.kickoffY ?? defaultKoY;
    d.vx = 0;
    d.vy = 0;
    d.diveTimer = 0;
    d.dribbleCD = 0;
    d.tackleCD = 0;
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
