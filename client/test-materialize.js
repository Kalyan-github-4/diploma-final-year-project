import { createRepo } from "./src/lib/realGit/createRepo.ts";
import { materializeMission } from "./src/lib/realGit/materialize.ts";
import { buildSnapshot } from "./src/lib/realGit/snapshot.ts";

async function test() {
  const mission = {
    initialGraphState: {
      commits: {
        "4b2d0e1": { message: "initial", parent: null },
        "9f3a1c2": { message: "readme", parent: "4b2d0e1" },
      },
      branches: { main: "9f3a1c2" },
      HEAD: { type: "branch", ref: "main" },
    }
  };
  const ctx = await materializeMission(mission);
  const snap = await buildSnapshot(ctx);
  console.log(JSON.stringify(snap, null, 2));
}

test().catch(console.error);
