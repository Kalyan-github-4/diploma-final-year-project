# CodeKing DSA Hackathon Demo Script

## Demo Goal
Show that CodeKing teaches algorithm understanding through interactive visualization, not code memorization.

## Total Time
7-8 minutes

## Setup
- Open `Data Structures & Algorithms` module.
- Start `Binary Search Fundamentals` level.
- Keep browser DevTools closed unless judges ask for telemetry proof.

## Demo Flow

### 1) Product framing (45s)
- "Traditional platforms grade code. CodeKing visualizes algorithm decisions."
- "Every algorithm returns deterministic steps, and the UI animates those steps."

### 2) Binary Search in Watch mode (2m)
- Show controls: Reset, Back, Play/Pause, Next, End, Speed.
- Play through 3-4 steps and point to:
  - active code line highlight
  - low/mid/high indicators
  - progress bar movement
- Emphasize that step descriptions and pointer movement stay synchronized.

### 3) Predict mode checkpoint (1m 30s)
- Switch to `Predict` mode.
- At a `compare` step, intentionally choose a wrong option once.
- Show corrective feedback and explain why the wrong branch is invalid.
- Answer correctly and continue.

### 4) Custom input rerun (1m)
- Enter a new sorted array and target.
- Click `Apply & rerun`.
- Show that the full timeline recomputes deterministically.

### 5) Bubble Sort reuse (1m 30s)
- Switch algorithm to `Bubble Sort`.
- Show compare/swap/sorted visual states.
- Point out same controls, same right panel, same contract-driven flow.

### 6) Architecture proof (45s)
- Mention contract files:
  - `src/types/dsa.types.ts`
  - `src/lib/algorithms/binarySearch.ts`
  - `src/lib/algorithms/bubbleSort.ts`
- Explain that adding a new algorithm only needs a new step generator + optional predict rules.

### 7) Metrics proof (30s)
- Mention tracked events:
  - `started`
  - `completed`
  - `predict_miss`
  - `replay`
- Event store path: localStorage key `codeking_dsa_events`.

## Judge Q&A Anchors
- Why not full code submission? "MVP focuses on concept mastery, not syntax grading."
- Is it scalable? "Yes, shared step contract and reusable player UI."
- Can it personalize? "Predict checkpoints and custom inputs are already mode-aware."

## Backup Plan (if live bug)
- Refresh level and run only Watch mode for Binary Search.
- Use pre-filled default inputs.
- Skip Predict if timing is tight.
