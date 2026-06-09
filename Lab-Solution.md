# Lab Solution Day09

## Overview

This submission completes the Day09 multi-agent assignment with a distributed
A2A legal assistant system and an additional visual demo for presentation.

## Implemented Architecture

```text
User
  -> Customer Agent
  -> Registry discovery
  -> Law Agent / Supervisor
  -> Tax Agent + Compliance Agent workers
  -> Aggregated legal response
```

## Main Components

- `customer_agent/`: Receives the user question and delegates legal questions.
- `registry/`: Stores and resolves agent capabilities.
- `law_agent/`: Acts as supervisor/orchestrator, performs legal analysis, routes
  to specialist workers and aggregates results.
- `tax_agent/`: Handles tax-law related analysis.
- `compliance_agent/`: Handles regulatory compliance analysis.
- `common/`: Shared A2A, registry and LLM utilities.
- `visual_worker/`: Static HTML/CSS/JavaScript demo that visualizes the worker flow.

## Completed Exercises

### Exercise 2

File: `exercises/exercise_2_tools.py`

- Added `labor_law` knowledge base entry.
- Added `check_statute_of_limitations`.
- Bound the tools to the LLM and handled tool-call responses.

### Exercise 4

File: `exercises/exercise_4_multiagent.py`

- Added `privacy_agent`.
- Added conditional routing for tax, compliance and privacy/GDPR/data questions.
- Aggregated results from all selected agents.

## Latency Bonus

`CODELAB.md` includes the Stage 5 latency analysis:

- Valid baseline latency: `81.1 seconds`.
- Optimization proposal:
  - use a faster/lighter model;
  - set `OPENROUTER_MAX_TOKENS`;
  - shorten prompts;
  - keep specialist worker calls parallel.
- `common/llm.py` reads `OPENROUTER_MAX_TOKENS`.
- A later optimized run could not be counted as valid because OpenRouter returned
  a credit/token-limit error before a successful response was produced.

## Run Commands

```bash
uv sync
cp .env.example .env
./start_all.sh
uv run python test_client.py
```

Visual demo:

```text
visual_worker/index.html
```

