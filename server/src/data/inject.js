const fs = require('fs');

let source = fs.readFileSync('d:/Code king/server/src/data/git-missions.data.js', 'utf8');
const generated = fs.readFileSync('d:/Code king/generate-l7-18.js', 'utf8');

// The exported generated file ends with an Object.assign call. 
// We will insert the generated levels code right before /* ── Registry ── */

const registryIndex = source.indexOf('/* ── Registry ───────────────────────────────────────────────── */');
if (registryIndex === -1) {
  console.log('Registry section not found');
  process.exit(1);
}

// Split the source 
let top = source.slice(0, registryIndex);
let bottom = source.slice(registryIndex);

// Also we need to modify the registry in bottom:
// From:
// const gitMissionsByLevel = {
//   1: level1,
//   2: level2,
//   3: level3,
//   4: level4,
//   5: level5,
//   6: level6,
//   // Registry now includes levels 1-18.
// }
// To:
// const gitMissionsByLevel = {
//   1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6,
//   7: level7, 8: level8, 9: level9, 10: level10, 11: level11, 12: level12,
//   13: level13, 14: level14, 15: level15, 16: level16, 17: level17, 18: level18
// }

// Just extract the part from generated that defines the levels (without the Object.assign part)
const assignIndex = generated.indexOf('Object.assign');
const levelsCode = generated.slice(0, assignIndex);

let newBottom = bottom.replace(
  /const gitMissionsByLevel = \{[\s\S]*?\}/,
  `const gitMissionsByLevel = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
  6: level6,
  7: level7,
  8: level8,
  9: level9,
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
  16: level16,
  17: level17,
  18: level18,
}`
);

fs.writeFileSync('d:/Code king/server/src/data/git-missions.data.js', top + levelsCode + newBottom);
console.log('Successfully injected L7-L18 missions!');
