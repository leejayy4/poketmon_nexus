import { RUNTIME_DATABASE } from './runtime';

export interface ReferenceIssue { table: string; id: string | number; message: string }

/** Explicit authoring diagnostic only. Never executed at boot, during play or by importing this file. */
export function inspectRuntimeReferences(): ReferenceIssue[] {
  const issues: ReferenceIssue[] = [];
  const report = (table: string, id: string | number, message: string) => issues.push({ table, id, message });
  const db = RUNTIME_DATABASE;
  for (const row of db.species.all()) {
    for (const name of [...row.data.learnset.map(entry => entry.move), ...row.data.tm]) {
      if (!db.moveByName(name)) report('species', row.id, `Missing move: ${name}`);
    }
  }
  for (const row of db.evolutions.all()) {
    if (!db.species.has(row.from)) report('evolutions', row.id, `Missing parent: ${row.from}`);
    if (!db.species.has(row.to)) report('evolutions', row.id, `Missing result: ${row.to}`);
    if (!Number.isInteger(row.level) || row.level < 1) report('evolutions', row.id, 'Invalid evolution level');
  }
  for (const row of db.pools.all()) {
    if (!row.slots.length) report('pools', row.node, 'Empty encounter pool');
    if (row.levels.length !== 2 || row.levels.some(level => !Number.isInteger(level) || level < 1)
        || row.levels[0] > row.levels[1]) report('pools', row.node, 'Invalid level range');
    for (const slot of row.slots) {
      const species = db.species.get(slot.speciesId);
      if (!species) report('pools', row.node, `Missing species: ${slot.speciesId}`);
      else if (!species.ownable) report('pools', row.node, `Species not ownable: ${slot.speciesId}`);
      if (!Number.isFinite(slot.weight) || slot.weight <= 0) report('pools', row.node, 'Nonpositive encounter weight');
    }
  }
  return issues;
}

