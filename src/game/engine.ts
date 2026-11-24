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
    return { eloDelta: 25, newElo, coinsEarned: 650, outcome: 'WIN' };
  }
  if (homeGoals < awayGoals) {
    const newElo = Math.max(500, currentElo - 15);
    return { eloDelta: newElo - currentElo, newElo, coinsEarned: 200, outcome: 'LOSS' };
  }
  return { eloDelta: 5, newElo: currentElo + 5, coinsEarned: 350, outcome: 'DRAW' };
}

export type PackType = 'bronze' | 'gold' | 'elite' | 'shapeshifter' | 'icon';

export function rollPackCards(
  packType: PackType,
  pool: PlayerCard[],
  rng: () => number
): { cards: PlayerCard[]; bestCard: PlayerCard; isWalkout: boolean } {
  const weights: Record<PackType, Record<TierId, number>> = {
    bronze: { bronze: 65, silver: 30, gold: 5, elite: 0, totw: 0, hero: 0, icon: 0, shapeshifter: 0 },
    gold: { bronze: 0, silver: 25, gold: 52, elite: 14, totw: 5, hero: 2, icon: 1, shapeshifter: 1 },
    elite: { bronze: 0, silver: 0, gold: 32, elite: 36, totw: 15, hero: 8, icon: 4, shapeshifter: 5 },
    shapeshifter: { bronze: 0, silver: 0, gold: 15, elite: 25, totw: 15, hero: 10, icon: 5, shapeshifter: 30 },
    icon: { bronze: 0, silver: 0, gold: 10, elite: 25, totw: 15, hero: 15, icon: 25, shapeshifter: 10 },
  };

  const tierTable = weights[packType];
  const tiers = Object.keys(tierTable) as TierId[];
  const totalWeight = tiers.reduce((acc, t) => acc + tierTable[t], 0);

  const pickTier = (guaranteedSpecial: boolean): TierId => {
    if (guaranteedSpecial && packType === 'shapeshifter') return 'shapeshifter';
    if (guaranteedSpecial && packType === 'icon') return 'icon';
    if (guaranteedSpecial && packType === 'elite') {
      return rng() < 0.5 ? 'elite' : rng() < 0.6 ? 'totw' : 'hero';
    }
    let roll = rng() * totalWeight;
    for (const t of tiers) {
      roll -= tierTable[t];
      if (roll <= 0) return t;
    }
    return 'gold';
  };

  const cards: PlayerCard[] = [];
  for (let i = 0; i < 3; i++) {
    const tier = pickTier(i === 0);
    const matching = pool.filter((p) => p.tier === tier);
    const source = matching.length > 0 ? matching : pool;
    const picked = source[Math.floor(rng() * source.length)];
    cards.push(picked);
  }

  cards.sort((a, b) => b.ovr - a.ovr);
  const bestCard = cards[0];
  const isSpecial =
    bestCard.tier === 'totw' ||
    bestCard.tier === 'hero' ||
    bestCard.tier === 'icon' ||
    bestCard.tier === 'shapeshifter';
  const isWalkout = bestCard.ovr >= 86 || isSpecial;

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
}

export function stepMatchPhysics(state: SimMatchState, dt: number, rng: () => number): string[] {
  const events: string[] = [];
  const { pitchW, pitchH, ball, dots } = state;

  if (state.freezeTicks > 0) {
    state.freezeTicks -= 1;
    return events;
  }

  if (state.goalBannerTimer > 0) {
    state.goalBannerTimer -= dt;
  }

  if (ball.kickCooldown > 0) {
    ball.kickCooldown = Math.max(0, ball.kickCooldown - dt);
  }

  // Advance ball
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  ball.z = Math.max(0, ball.z + ball.vz * dt);
  if (ball.z > 0) {
    ball.vz -= 420 * dt;
    if (ball.z <= 0) {
      ball.z = 0;
      ball.vz = Math.abs(ball.vz) > 45 ? -ball.vz * 0.45 : 0;
    }
  }
  const friction = ball.z > 2 ? 0.992 : 0.976;
  ball.vx *= Math.pow(friction, dt * 60);
  ball.vy *= Math.pow(friction, dt * 60);

  const goalTop = pitchH * 0.37;
  const goalBot = pitchH * 0.63;
  const inGoalMouthY = ball.y >= goalTop && ball.y <= goalBot;

  // Check goal or pitch bounds
  if (ball.x <= 24) {
    if (inGoalMouthY) {
      state.awayScore += 1;
      state.goalBannerTimer = 2.0;
      state.freezeTicks = 40;
      events.push('GOAL_AWAY');
      resetKickoff(state);
      return events;
    }
    ball.x = 26;
    ball.vx = Math.abs(ball.vx) * 0.72;
    if (Math.abs(ball.y - goalTop) < 12 || Math.abs(ball.y - goalBot) < 12) {
      events.push('WOODWORK');
    }
  } else if (ball.x >= pitchW - 24) {
    if (inGoalMouthY) {
      state.homeScore += 1;
      state.goalBannerTimer = 2.0;
      state.freezeTicks = 40;
      events.push('GOAL_HOME');
      resetKickoff(state);
      return events;
    }
    ball.x = pitchW - 26;
    ball.vx = -Math.abs(ball.vx) * 0.72;
    if (Math.abs(ball.y - goalTop) < 12 || Math.abs(ball.y - goalBot) < 12) {
      events.push('WOODWORK');
    }
  }

  if (ball.y <= 22) {
    ball.y = 24;
    ball.vy = Math.abs(ball.vy) * 0.78;
  } else if (ball.y >= pitchH - 22) {
    ball.y = pitchH - 24;
    ball.vy = -Math.abs(ball.vy) * 0.78;
  }

  // Possession tracking
  if (ball.lastTouchTeam === 'home') state.homePossessionTicks += 1;
  else if (ball.lastTouchTeam === 'away') state.awayPossessionTicks += 1;

  // Find nearest non-GK dot per team to press/chase ball
  let nearestHome: PitchDot | null = null;
  let nearestHomeDist = Infinity;
  let nearestAway: PitchDot | null = null;
  let nearestAwayDist = Infinity;

  for (const d of dots) {
    if (d.redCarded || d.role === 'GK') continue;
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

  const ballRatioX = ball.x / pitchW;

  for (const dot of dots) {
    if (dot.redCarded) continue;

    if (dot.diveTimer > 0) {
      dot.diveTimer = Math.max(0, dot.diveTimer - dt);
      dot.y = Math.max(goalTop - 10, Math.min(goalBot + 10, dot.y + dot.diveVy * dt));
      continue;
    }

    const isOwner = ball.ownerId === dot.id;
    const speedBase = 88 + dot.pac * 1.15;

    let targetX = dot.homeX;
    let targetY = dot.homeY;

    if (dot.role === 'GK') {
      targetX = dot.team === 'home' ? 42 : pitchW - 42;
      targetY = Math.max(goalTop + 12, Math.min(goalBot - 12, ball.y));
    } else if (isOwner) {
      const attackDir = dot.team === 'home' ? 1 : -1;
      targetX = dot.x + attackDir * 120;
      targetY = dot.y + (pitchH * 0.5 - dot.y) * 0.25;
    } else if (dot === nearestHome || dot === nearestAway) {
      targetX = ball.x;
      targetY = ball.y;
    } else {
      // Tactical shift with ball
      const shiftX = (ballRatioX - 0.5) * pitchW * 0.34;
      targetX = Math.max(48, Math.min(pitchW - 48, dot.homeX + shiftX));
      targetY = Math.max(36, Math.min(pitchH - 36, dot.homeY + (ball.y - pitchH * 0.5) * 0.2));
    }

    const dx = targetX - dot.x;
    const dy = targetY - dot.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 3) {
      const turnRate = 0.08 + (dot.dri / 100) * 0.14;
      const desiredVx = (dx / dist) * speedBase;
      const desiredVy = (dy / dist) * speedBase;
      dot.vx += (desiredVx - dot.vx) * turnRate;
      dot.vy += (desiredVy - dot.vy) * turnRate;
      dot.x = Math.max(28, Math.min(pitchW - 28, dot.x + dot.vx * dt));
      dot.y = Math.max(26, Math.min(pitchH - 26, dot.y + dot.vy * dt));
    }

    // Ball pickup / interaction
    const ballDist = Math.hypot(ball.x - dot.x, ball.y - dot.y);
    const reach = dot.role === 'GK' ? 19 : 14 + (dot.def > 80 ? 3 : 0);

    if (ballDist < reach && ball.z < 26 && ball.kickCooldown <= 0) {
      if (dot.role === 'GK') {
        // Save!
        const clearDir = dot.team === 'home' ? 1 : -1;
        ball.ownerId = null;
        ball.lastTouchTeam = dot.team;
        ball.vx = clearDir * (290 + rng() * 110);
        ball.vy = (rng() - 0.5) * 220;
        ball.vz = 150;
        ball.kickCooldown = 0.28;
        dot.diveTimer = 0.35;
        dot.diveVy = (ball.y - dot.y) * 2.5;
        events.push(`SAVE_${dot.team.toUpperCase()}`);
      } else if (!ball.ownerId || (ball.lastTouchTeam !== dot.team && rng() < 0.25 + (dot.def / 100) * 0.45)) {
        // Win ball or tackle
        if (ball.ownerId && ball.lastTouchTeam !== dot.team) {
          events.push(`TACKLE_${dot.team.toUpperCase()}`);
          if (rng() < 0.055) {
            events.push(`FOUL_${dot.team.toUpperCase()}`);
          }
        }
        ball.ownerId = dot.id;
        ball.lastTouchTeam = dot.team;
        ball.kickCooldown = 0.16;
      }
    }

    // Owner decision: dribble, pass, or shoot
    if (ball.ownerId === dot.id) {
      ball.x = dot.x + (dot.team === 'home' ? 10 : -10);
      ball.y = dot.y;
      ball.vx = dot.vx;
      ball.vy = dot.vy;

      const goalX = dot.team === 'home' ? pitchW - 24 : 24;
      const distToGoal = Math.hypot(goalX - dot.x, pitchH * 0.5 - dot.y);

      if (distToGoal < 245 && rng() < 0.08 + (dot.sho / 100) * 0.09) {
        // Shoot!
        const aimY = pitchH * (0.39 + rng() * 0.22);
        const sdx = goalX - dot.x;
        const sdy = aimY - dot.y;
        const sLen = Math.hypot(sdx, sdy) || 1;
        const shotSpeed = 380 + dot.sho * 2.6;
        ball.ownerId = null;
        ball.vx = (sdx / sLen) * shotSpeed;
        ball.vy = (sdy / sLen) * shotSpeed;
        ball.vz = 40 + rng() * 75;
        ball.kickCooldown = 0.3;
        if (dot.team === 'home') state.homeShots += 1;
        else state.awayShots += 1;
        events.push(`SHOT_${dot.team.toUpperCase()}:${dot.name}`);
      } else if (rng() < 0.05 + (dot.pas / 100) * 0.06) {
        // Pass to forward/open teammate
        const mates = dots.filter((m) => m.team === dot.team && m.id !== dot.id && !m.redCarded);
        if (mates.length > 0) {
          const forwardMates = mates.filter((m) =>
            dot.team === 'home' ? m.x > dot.x - 25 : m.x < dot.x + 25
          );
          const pool = forwardMates.length > 0 ? forwardMates : mates;
          const target = pool[Math.floor(rng() * pool.length)];
          const err = ((100 - dot.pas) / 100) * 42;
          const pdx = target.x + (rng() - 0.5) * err - dot.x;
          const pdy = target.y + (rng() - 0.5) * err - dot.y;
          const pLen = Math.hypot(pdx, pdy) || 1;
          const passSpeed = Math.min(390, 210 + pLen * 0.85);
          ball.ownerId = null;
          ball.vx = (pdx / pLen) * passSpeed;
          ball.vy = (pdy / pLen) * passSpeed;
          ball.vz = pLen > 180 ? 110 : 10;
          ball.kickCooldown = 0.22;
          events.push(`PASS_${dot.team.toUpperCase()}`);
        }
      }
    }
  }

  return events;
}

export function resetKickoff(state: SimMatchState): void {
  const { pitchW, pitchH, ball, dots } = state;
  ball.x = pitchW / 2;
  ball.y = pitchH / 2;
  ball.z = 0;
  ball.vx = 0;
  ball.vy = 0;
  ball.vz = 0;
  ball.ownerId = null;
  ball.kickCooldown = 0.5;
  for (const d of dots) {
    d.x = d.homeX;
    d.y = d.homeY;
    d.vx = 0;
    d.vy = 0;
    d.diveTimer = 0;
  }
}
