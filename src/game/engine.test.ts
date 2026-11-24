import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSquadChemistry,
  evaluateSBC,
  calculateEloResult,
  getDivisionFromElo,
  rollPackCards,
  createSeededRng,
  stepMatchPhysics,
  FORMATIONS,
  type PlayerCard,
  type SimMatchState,
  type PitchDot,
} from './engine';

const SAMPLE_POOL: PlayerCard[] = [
  { id: '1', name: 'B. Moore', ovr: 61, tier: 'bronze', pos: 'CB', nation: 'ENG', club: 'AFC Iron', league: 'L2', stats: { pac: 58, sho: 42, pas: 55, dri: 52, def: 64, phy: 66 }, shirtNum: 4 },
  { id: '2', name: 'J. Silva', ovr: 72, tier: 'silver', pos: 'CM', nation: 'BRA', club: 'Santos Pixel', league: 'BR1', stats: { pac: 71, sho: 65, pas: 74, dri: 76, def: 62, phy: 66 }, shirtNum: 8 },
  { id: '3', name: 'M. Rash', ovr: 81, tier: 'gold', pos: 'LW', nation: 'ENG', club: 'Red Devils', league: 'EPL', stats: { pac: 87, sho: 81, pas: 76, dri: 83, def: 42, phy: 72 }, shirtNum: 10 },
  { id: '4', name: 'B. Saka', ovr: 87, tier: 'elite', pos: 'RW', nation: 'ENG', club: 'North Gunners', league: 'EPL', stats: { pac: 86, sho: 83, pas: 85, dri: 89, def: 58, phy: 73 }, shirtNum: 7 },
  { id: '5', name: 'F. Valverde', ovr: 89, tier: 'totw', pos: 'CM', nation: 'URU', club: 'Madrid Royal', league: 'LIGA', stats: { pac: 89, sho: 85, pas: 87, dri: 84, def: 82, phy: 84 }, shirtNum: 15 },
  { id: '6', name: 'L. Donovan', ovr: 90, tier: 'hero', pos: 'CAM', nation: 'USA', club: 'LA Retro', league: 'MLS', stats: { pac: 90, sho: 86, pas: 88, dri: 90, def: 48, phy: 72 }, shirtNum: 10 },
  { id: '7', name: 'Pele 8-Bit', ovr: 98, tier: 'icon', pos: 'ST', nation: 'BRA', club: 'Icons FC', league: 'ICON', stats: { pac: 96, sho: 97, pas: 93, dri: 98, def: 60, phy: 78 }, shirtNum: 10 },
  { id: '8', name: 'Van Dijk ST', ovr: 95, tier: 'shapeshifter', pos: 'ST', nation: 'NED', club: 'Mersey Reds', league: 'EPL', stats: { pac: 92, sho: 95, pas: 85, dri: 88, def: 84, phy: 96 }, shirtNum: 9, isOutOfPositionSpecial: true },
  { id: '9', name: 'K. Walker GK', ovr: 93, tier: 'shapeshifter', pos: 'GK', nation: 'ENG', club: 'Sky Blues', league: 'EPL', stats: { pac: 91, sho: 55, pas: 86, dri: 84, def: 93, phy: 91 }, shirtNum: 1, isOutOfPositionSpecial: true },
  { id: '10', name: 'Messi CB', ovr: 96, tier: 'shapeshifter', pos: 'CB', nation: 'ARG', club: 'Inter Palms', league: 'MLS', stats: { pac: 90, sho: 88, pas: 96, dri: 97, def: 95, phy: 82 }, shirtNum: 5, isOutOfPositionSpecial: true },
  { id: '11', name: 'Neuer CAM', ovr: 94, tier: 'shapeshifter', pos: 'CAM', nation: 'GER', club: 'Bavaria FC', league: 'BUND', stats: { pac: 86, sho: 91, pas: 95, dri: 91, def: 78, phy: 90 }, shirtNum: 10, isOutOfPositionSpecial: true },
];

test('chemistry awards 33/33 for aligned EPL + Shapeshifter + Icon squad', () => {
  const slots = FORMATIONS['4-3-3'];
  const squad: PlayerCard[] = slots.map((s, idx) => ({
    ...SAMPLE_POOL[3],
    id: `sq-${idx}`,
    pos: s.pos,
    nation: 'ENG',
    club: 'North Gunners',
    league: 'EPL',
    tier: idx === 10 ? 'icon' : 'elite',
  }));
  const res = calculateSquadChemistry(squad, '4-3-3');
  assert.equal(res.totalChem, 33);
  assert.ok(res.oopPenalties.every((p) => !p));
});

test('chemistry penalizes out-of-position non-shapeshifter player', () => {
  const slots = FORMATIONS['4-3-3'];
  const squad: PlayerCard[] = slots.map((s, idx) => ({
    ...SAMPLE_POOL[3],
    id: `sq-${idx}`,
    pos: idx === 0 ? 'ST' : s.pos, // Put ST in GK slot!
    tier: 'gold',
  }));
  const res = calculateSquadChemistry(squad, '4-3-3');
  assert.equal(res.oopPenalties[0], true);
  assert.equal(res.playerChems[0], 0);
});

test('SBC evaluation rejects missing Shapeshifters and accepts valid submission', () => {
  const challenge = {
    id: 'sbc-icon',
    title: 'Shapeshifter Icon Challenge',
    requiredCount: 4,
    minAvgOvr: 85,
    minShapeshifters: 2,
  };
  const bad = evaluateSBC(challenge, [SAMPLE_POOL[2], SAMPLE_POOL[3], SAMPLE_POOL[4], SAMPLE_POOL[5]]);
  assert.equal(bad.valid, false);
  assert.ok(bad.reasons.some((r) => r.includes('Shapeshifters')));

  const good = evaluateSBC(challenge, [SAMPLE_POOL[7], SAMPLE_POOL[8], SAMPLE_POOL[9], SAMPLE_POOL[10]]);
  assert.equal(good.valid, true);
});

test('ELO calculation & Division ladder mapping work accurately', () => {
  const win = calculateEloResult(3, 1, 1000);
  assert.equal(win.eloDelta, 25);
  assert.equal(win.newElo, 1025);
  assert.equal(getDivisionFromElo(1025), 8);
  assert.equal(getDivisionFromElo(1950), 1);

  const loss = calculateEloResult(0, 2, 1000);
  assert.equal(loss.eloDelta, -15);
  assert.equal(loss.newElo, 985);
});

test('seeded pack roll is deterministic and triggers walkout on 86+/special', () => {
  const rng1 = createSeededRng(4242);
  const rng2 = createSeededRng(4242);
  const roll1 = rollPackCards('icon', SAMPLE_POOL, rng1);
  const roll2 = rollPackCards('icon', SAMPLE_POOL, rng2);
  assert.deepEqual(roll1.cards.map((c) => c.id), roll2.cards.map((c) => c.id));
  assert.equal(roll1.isWalkout, true);
});

test('2D match physics steps deterministically and scores goals', () => {
  const dots: PitchDot[] = [
    {
      id: 'h-st', team: 'home', slotIndex: 9, shirtNum: 9, name: 'Striker',
      role: 'FWD', x: 910, y: 290, vx: 0, vy: 0, homeX: 700, homeY: 290,
      pac: 90, sho: 95, pas: 80, dri: 85, def: 40, redCarded: false, yellowCards: 0, diveTimer: 0, diveVy: 0,
    },
    {
      id: 'a-gk', team: 'away', slotIndex: 0, shirtNum: 1, name: 'Keeper',
      role: 'GK', x: 918, y: 120, vx: 0, vy: 0, homeX: 918, homeY: 290,
      pac: 60, sho: 40, pas: 70, dri: 60, def: 85, redCarded: false, yellowCards: 0, diveTimer: 0, diveVy: 0,
    },
  ];
  const state: SimMatchState = {
    pitchW: 960,
    pitchH: 580,
    dots,
    ball: { x: 938, y: 290, z: 0, vx: 320, vy: 0, vz: 0, ownerId: null, lastTouchTeam: 'home', kickCooldown: 0 },
    homeScore: 0,
    awayScore: 0,
    homeShots: 0,
    awayShots: 0,
    homePossessionTicks: 0,
    awayPossessionTicks: 0,
    elapsedMinutes: 0,
    freezeTicks: 0,
    goalBannerTimer: 0,
    lastEvent: null,
  };

  const rng = createSeededRng(777);
  const ev = stepMatchPhysics(state, 1 / 60, rng);
  assert.ok(ev.includes('GOAL_HOME'));
  assert.equal(state.homeScore, 1);
  assert.equal(state.ball.x, 480);
});

test('public/players.json contains 550 unique cards across all 8 tiers', async () => {
  const { readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  const raw = readFileSync(resolve(process.cwd(), 'public/players.json'), 'utf8');
  const players: PlayerCard[] = JSON.parse(raw);
  assert.equal(players.length, 550);
  const ids = new Set(players.map((p) => p.id));
  assert.equal(ids.size, 550);
  const tiers = new Set(players.map((p) => p.tier));
  for (const tier of ['bronze', 'silver', 'gold', 'elite', 'totw', 'hero', 'icon', 'shapeshifter'] as const) {
    assert.ok(tiers.has(tier), `Missing tier ${tier}`);
  }
  assert.ok(players.some((p) => p.tier === 'shapeshifter' && /van dijk/i.test(p.name)));
});

