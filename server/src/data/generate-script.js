const fs = require('fs');

const levels = [
  { id: 7, title: "Feature Branch Start", topic: "branching-workflows", cmds: [["git branch", "git checkout"], ["git switch -c"], ["git branch -d", "git branch"]] },
  { id: 8, title: "Parallel Workstreams", topic: "branching-workflows", cmds: [["git checkout"], ["git stash", "git checkout"], ["git stash pop"]] },
  { id: 9, title: "Fast-Forward Merge", topic: "branching-workflows", cmds: [["git merge"], ["git merge --ff-only"], ["git branch -d"]] },
  { id: 10, title: "Release Branch Drill", topic: "branching-workflows", cmds: [["git checkout -b", "git commit -m"], ["git merge"], ["git tag", "git push"]] },
  { id: 11, title: "Branch Policy", topic: "branching-workflows", cmds: [["git log --oneline --graph"], ["git diff main...HEAD"], ["git rebase main"]] },
  { id: 12, title: "Integration Readiness", topic: "branching-workflows", cmds: [["git fetch"], ["git rebase origin/main"], ["git push -f"]] },
  { id: 13, title: "Rebase Control", topic: "merge-and-history", cmds: [["git rebase"], ["git rebase -i"], ["git rebase --continue"]] },
  { id: 14, title: "Conflict Surgery", topic: "merge-and-history", cmds: [["git merge"], ["git status", "git add ."], ["git commit -m"]] },
  { id: 15, title: "Recovery Toolkit", topic: "merge-and-history", cmds: [["git revert"], ["git reflog", "git reset --hard"], ["git cherry-pick"]] },
  { id: 16, title: "Remote Sync Master", topic: "advanced-collaboration", cmds: [["git remote add origin", "git fetch origin"], ["git pull origin main", "git rebase origin/main"], ["git push -u origin"]] },
  { id: 17, title: "PR Command Center", topic: "advanced-collaboration", cmds: [["git checkout -b feature/pr-cleanup", "git commit -m", "git push -u origin"], ["git fetch origin", "git rebase origin/main", "git log --oneline"], ["git checkout main", "git merge --squash", "git commit -m"]] },
  { id: 18, title: "Git & GitHub King", topic: "advanced-collaboration", cmds: [["git bisect start", "git bisect bad", "git bisect good"], ["git blame README.md", "git log --oneline"], ["git reflog", "git reset --soft HEAD~1", "git commit -m"]] }
];

let output = "";

for (const level of levels) {
  output += `\n/* ═══════════════════════════════════════════════════════════════\n   LEVEL ${level.id} — ${level.title}\n   ═══════════════════════════════════════════════════════════════ */\n\n`;
  output += `const level${level.id} = [\n`;
  
  for (let i = 0; i < 3; i++) {
    const mNum = i + 1;
    const cmdList = level.cmds[i];
    
    output += `  {\n`;
    output += `    missionId: "git-l${level.id}-m${mNum}-${level.topic}-${i}",\n`;
    output += `    title: "${level.title} - Step ${mNum}",\n`;
    output += `    topicId: "${level.topic}",\n`;
    output += `    level: ${level.id},\n`;
    output += `    orderIndex: ${i},\n`;
    output += `    difficulty: Math.floor(${level.id}/3) + 1,\n`;
    output += `    xp: ${level.id * 100 + i * 20},\n`;
    output += `    steps: [\n`;
    
    for (let j = 0; j < cmdList.length; j++) {
      output += `      {\n`;
      output += `        id: "step-${j+1}",\n`;
      output += `        instruction: "Use \`${cmdList[j]}\` to proceed.",\n`;
      output += `        completedBy: "${cmdList[j]}",\n`;
      output += `        alternates: [],\n`;
      output += `        hint: "This step requires using ${cmdList[j]}.",\n`;
      output += `      },\n`;
    }
    
    output += `    ],\n`;
    output += `    initialGraphState: mainWithCommits([\n`;
    output += `      { id: "c${Math.random().toString(36).substr(2, 4)}", message: "initial" }\n`;
    output += `    ]),\n`;
    output += `  },\n`;
  }
  
  output += `]\n`;
}

// Write the exports append
output += `\nObject.assign(gitMissionsByLevel, {\n`;
for (let i = 7; i <= 18; i++) {
  output += `  ${i}: level${i},\n`;
}
output += `});\n`;

fs.writeFileSync('d:/Code king/generate-l7-18.js', output);
