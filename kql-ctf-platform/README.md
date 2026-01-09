# KQL Kung Fu CTF Platform

> *Master the art of Kusto Query Language through capture-the-flag challenges*

A gamified learning platform for mastering KQL (Kusto Query Language) through progressively challenging security scenarios. Hunt for flags hidden in Azure log data while learning real-world threat detection skills.

## Overview

KQL Kung Fu CTF transforms the journey of learning KQL into an engaging martial arts progression. Start as a White Belt with basic queries, and advance to Black Belt mastery through increasingly complex threat hunting challenges.

```
⬜ White Belt   → Basic operators (where, project, limit)
🟨 Yellow Belt  → Aggregation & time (summarize, ago, datetime)
🟧 Orange Belt  → Multi-table queries (join, union)
🟩 Green Belt   → Advanced parsing (parse, extract, regex)
🟦 Blue Belt    → Expert techniques (externaldata, functions)
🟫 Brown Belt   → Complex correlation (multi-stage hunting)
⬛ Black Belt   → Grandmaster (novel attack detection)
```

## Project Structure

```
kql-ctf-platform/
├── challenges/           # Challenge definitions by belt level
│   ├── challenge-schema.json
│   ├── white-belt/
│   │   ├── 01-hello-kql.yaml
│   │   ├── 02-counting-101.yaml
│   │   └── ...
│   ├── yellow-belt/
│   └── ...
├── data/
│   ├── schemas/          # Table schema definitions
│   ├── generators/       # Synthetic data generators
│   └── samples/          # Generated sample data
├── frontend/             # Web UI (TBD)
├── backend/              # API server (TBD)
├── docs/                 # Documentation
└── scripts/              # Utility scripts
```

## Quick Start

### 1. Generate Challenge Data

```bash
cd data/generators
python generate_data.py --all --output ../samples/
```

This creates JSON files with log data for each challenge, flags hidden inside.

### 2. Test Queries

You can test your KQL queries using:

- **Azure Data Explorer**: https://dataexplorer.azure.com/
- **Log Analytics Demo**: https://aka.ms/lademo
- **Local Development**: Load JSON into ADX free cluster

### 3. Try a Challenge

Open a challenge file (e.g., `challenges/white-belt/01-hello-kql.yaml`) and:

1. Read the scenario
2. Load the corresponding data
3. Write KQL to find the flag
4. Submit your answer!

## Challenge Format

Challenges are defined in YAML with this structure:

```yaml
id: brute-force-101
title: "The Persistent Attacker"
belt: yellow
points: 150
category: identity

scenario: |
  Your SOC received an alert about potential brute force activity...

objective: "Find the most targeted account and extract the flag."

tables:
  - SigninLogs

flag:
  value: "FLAG{kql_kung_fu_example}"
  format: exact

hints:
  - cost: 25
    text: "Look at ResultType values"
  - cost: 50
    text: "Use summarize with count()"

solution:
  query: |
    SigninLogs
    | where ResultType != 0
    | summarize count() by UserPrincipalName

learning_objectives:
  - "Using summarize for aggregation"
  - "Identifying brute force patterns"

mitre_attack:
  - T1110.001
```

## Current Challenges

### White Belt (Beginner)

| # | Challenge | Points | Concepts |
|---|-----------|--------|----------|
| 1 | Hello KQL | 50 | where, contains |
| 2 | Counting 101 | 50 | count |
| 3 | The Art of Projection | 75 | project |
| 4 | Know Your Limits | 75 | order by, limit |
| 5 | Distinct Possibilities | 100 | distinct |

### Yellow Belt (Novice)

| # | Challenge | Points | Concepts |
|---|-----------|--------|----------|
| 1 | The Persistent Attacker | 150 | summarize, brute force detection |
| 2 | The Time Traveler | 150 | datetime functions, ago() |
| 3 | String Theory | 175 | string operators, contains vs has |
| 4 | The Port Scanner | 200 | dcount(), network analysis |
| 5 | The Insider Threat | 200 | in operator, let statements |

### Coming Soon

- Orange Belt: join, union, multi-table correlation
- Green Belt: parse, extract, regex patterns
- Blue Belt: externaldata, custom functions
- Brown Belt: Complex hunting scenarios
- Black Belt: Advanced threat detection

## Data Tables

The platform uses realistic Azure log schemas:

| Table | Description |
|-------|-------------|
| `SigninLogs` | Azure AD authentication events |
| `SecurityEvent` | Windows Security Events |
| `AzureActivity` | Azure subscription activity |
| `AzureNetworkAnalytics_CL` | NSG Flow Logs |
| `SecurityAlert` | Defender/Sentinel alerts |

See `data/schemas/tables.json` for full column definitions.

## Development Roadmap

- [x] **Phase 0**: Scaffolding & challenge format
- [ ] **Phase 1**: MVP web UI with query editor
- [ ] **Phase 2**: User auth, leaderboards, progress tracking
- [ ] **Phase 3**: Community challenges, teams, competitions
- [ ] **Phase 4**: Enterprise features, certifications

## Tech Stack Options

We're evaluating multiple approaches:

| Option | Frontend | Backend | Query Engine |
|--------|----------|---------|--------------|
| Azure-Native | Next.js | Azure Functions | ADX Free Cluster |
| Self-Hosted | React/Vite | FastAPI | ClickHouse/DuckDB |
| Minimal MVP | Vanilla JS | Serverless | Log Analytics Demo |

## Contributing

We welcome contributions!

- **New Challenges**: Create a YAML file following the schema
- **Data Generators**: Add to `data/generators/`
- **Bug Fixes**: Submit PRs
- **Ideas**: Open an issue

## Resources

- [KQL Quick Reference](https://docs.microsoft.com/en-us/azure/data-explorer/kql-quick-reference)
- [Log Analytics Demo](https://aka.ms/lademo)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [Original DEFCON Presentation](../DEFCON30-KQL-Kung-Fu.pdf)

## License

MIT License - See LICENSE file

---

*"Finding the needle in the haystack, one query at a time"*

Built with dedication by the KQL Kung Fu Team
