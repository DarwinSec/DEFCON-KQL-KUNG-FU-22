# KQL Kung Fu CTF Platform - Technical Specification

> *"Find the needle in the haystack, capture the flag"*

## Executive Summary

A gamified Capture The Flag platform for learning and mastering Kusto Query Language (KQL) through progressively challenging security scenarios. Players query pre-loaded Azure log datasets to hunt for hidden flags, earning belts (white → black) as they advance.

---

## Table of Contents

1. [Project Goals](#project-goals)
2. [Core Concepts](#core-concepts)
3. [User Experience](#user-experience)
4. [Challenge Design](#challenge-design)
5. [Technical Architecture](#technical-architecture)
6. [Data Strategy](#data-strategy)
7. [Scoring & Progression](#scoring--progression)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Future Enhancements](#future-enhancements)

---

## Project Goals

### Primary Objectives
- **Learn by doing**: Hands-on KQL practice with real-world security scenarios
- **Progressive difficulty**: Guide users from basics to advanced threat hunting
- **Instant feedback**: Validate queries and show results in real-time
- **Community building**: Leaderboards, shared challenges, discussion

### Target Audience
- Security analysts learning KQL
- SOC team members upskilling
- Detection engineers practicing threat hunting
- Students preparing for security certifications
- DEFCON/security conference attendees

### Success Metrics
- Monthly active users
- Challenge completion rates by difficulty
- Average time-to-solve per challenge
- User progression (belt advancement)
- Community-submitted challenges

---

## Core Concepts

### The Kung Fu Theme (Belt System)

| Belt | Level | Skills Demonstrated |
|------|-------|---------------------|
| ⬜ **White Belt** | Beginner | Basic operators: `where`, `project`, `limit`, `count` |
| 🟨 **Yellow Belt** | Novice | String operators, `summarize`, `distinct`, time filtering |
| 🟧 **Orange Belt** | Intermediate | `join`, `union`, multiple tables, `let` statements |
| 🟩 **Green Belt** | Advanced | `parse`, `extract`, regex, `mv-expand`, nested queries |
| 🟦 **Blue Belt** | Expert | `externaldata`, functions, optimization, complex joins |
| 🟫 **Brown Belt** | Master | Multi-stage hunting, correlation, custom functions |
| ⬛ **Black Belt** | Grandmaster | Novel attack detection, zero-day hunting, teaching others |

### Flag Format
```
FLAG{kql_kung_fu_<unique_identifier>}
```
Examples:
- `FLAG{kql_kung_fu_first_blood_2024}`
- `FLAG{kql_kung_fu_lateral_movement_detected}`
- `FLAG{kql_kung_fu_cryptominer_c2_found}`

---

## User Experience

### User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE                              │
│  "Master the art of KQL threat hunting"                         │
│  [Start Training]  [Leaderboard]  [About]                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DOJO (Challenge Hub)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ White    │ │ Yellow   │ │ Orange   │ │ Green    │  ...      │
│  │ Belt     │ │ Belt     │ │ Belt     │ │ Belt     │           │
│  │ 5/5 ✓    │ │ 3/5      │ │ 🔒       │ │ 🔒       │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHALLENGE VIEW                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ SCENARIO                                                 │    │
│  │ "An attacker has brute-forced an account. Find the      │    │
│  │  username and submit the flag hidden in the logs."      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ KQL QUERY EDITOR                                        │    │
│  │ SigninLogs                                              │    │
│  │ | where ResultType != 0                                 │    │
│  │ | summarize count() by UserPrincipalName                │    │
│  │                                            [Run Query]  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ RESULTS                                                  │    │
│  │ UserPrincipalName          | count_                     │    │
│  │ admin@contoso.com          | 847                        │    │
│  │ FLAG{kql_kung_fu_...}      | 1     ← hidden in data    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Flag: [________________________] [Submit]                       │
│                                                                  │
│  [Hint 1: -50pts] [Hint 2: -100pts] [Solution: -ALL pts]        │
└─────────────────────────────────────────────────────────────────┘
```

### Key UI Components

1. **Query Editor**
   - Syntax highlighting for KQL
   - Auto-complete for operators and table names
   - Schema browser (available tables/columns)
   - Query history

2. **Results Panel**
   - Tabular results display
   - Row count and query time
   - Export to CSV
   - Visualization (optional charts)

3. **Challenge Context**
   - Scenario narrative
   - Available tables for this challenge
   - Hints (point penalty)
   - Discussion thread

4. **Progress Dashboard**
   - Current belt and points
   - Challenges completed
   - Time spent
   - Ranking

---

## Challenge Design

### Challenge Structure

```yaml
challenge:
  id: "brute-force-101"
  title: "The Persistent Attacker"
  belt: "yellow"
  points: 100

  scenario: |
    Our Azure AD logs show unusual activity. An attacker appears to be
    attempting to brute-force their way into an account.

    Find the account with the most failed sign-in attempts and discover
    the flag hidden in the attacker's user agent string.

  tables_available:
    - SigninLogs

  hints:
    - cost: 25
      text: "Look at ResultType values - what indicates failure?"
    - cost: 50
      text: "The UserAgent field contains interesting data..."

  flag: "FLAG{kql_kung_fu_useragent_forensics}"

  validation:
    type: "exact_match"  # or "regex", "query_result"

  solution: |
    SigninLogs
    | where ResultType != 0
    | summarize FailedAttempts=count() by UserPrincipalName, UserAgent
    | order by FailedAttempts desc
    | limit 10

  learning_objectives:
    - "Using where to filter results"
    - "Summarize with multiple group-by columns"
    - "Identifying brute-force patterns"

  mitre_attack:
    - T1110.001  # Brute Force: Password Guessing
```

### Challenge Categories

#### Category 1: Azure AD & Identity
- Failed sign-ins analysis
- Impossible travel detection
- Privileged account monitoring
- Guest user enumeration
- Conditional Access bypass attempts

#### Category 2: Network Security (NSG Flow Logs)
- Port scanning detection
- Denied traffic analysis
- Data exfiltration patterns
- Suspicious outbound connections
- Geographic anomalies

#### Category 3: Azure Activity Logs
- Resource deletion events
- Permission changes
- Subscription-level threats
- Policy modifications
- Suspicious deployments

#### Category 4: Microsoft Defender / Security Alerts
- Alert triage
- Incident correlation
- False positive identification
- Threat actor TTPs

#### Category 5: Azure Resource Graph
- Misconfiguration hunting
- Compliance violations
- Public exposure detection
- Cost anomalies
- Shadow IT discovery

#### Category 6: Multi-Table Challenges
- Correlating identity + network
- Timeline reconstruction
- Kill chain analysis
- Lateral movement tracking

### Sample Challenges by Belt

#### ⬜ White Belt: "Hello, KQL"
> *Query the SecurityEvent table and find how many events exist. The flag is in an event with "FLAG" in the Activity field.*

```kql
SecurityEvent
| where Activity contains "FLAG"
```

#### 🟨 Yellow Belt: "The Noisy Neighbor"
> *Someone is generating excessive failed logins. Find them and extract the flag from their most common error message.*

```kql
SigninLogs
| where ResultType != 0
| summarize count() by UserPrincipalName, ResultDescription
| order by count_ desc
```

#### 🟩 Green Belt: "Phantom Persistence"
> *An attacker created a backdoor account. Correlate Azure Activity logs with Sign-in logs to find the rogue account created in the last 7 days that has successfully authenticated.*

```kql
let newAccounts = AzureActivity
| where TimeGenerated > ago(7d)
| where OperationName == "Add user"
| extend CreatedUser = tostring(parse_json(Properties).targetResources[0].userPrincipalName);
SigninLogs
| where TimeGenerated > ago(7d)
| where ResultType == 0
| join kind=inner newAccounts on $left.UserPrincipalName == $right.CreatedUser
```

#### ⬛ Black Belt: "APT29 Emulation"
> *A sophisticated threat actor has compromised your environment. Using all available data sources, reconstruct the kill chain and identify each stage. Submit flags for: Initial Access, Execution, Persistence, Lateral Movement, and Exfiltration.*

---

## Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   React/    │  │   Monaco    │  │   D3.js/    │                 │
│  │   Next.js   │  │   Editor    │  │   Charts    │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    REST / GraphQL API                        │   │
│  │   /challenges  /submit  /leaderboard  /user  /query         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │    Auth     │  │   Rate      │  │   Query     │                 │
│  │  (OAuth)    │  │  Limiter    │  │  Sanitizer  │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        QUERY ENGINE                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Azure Data Explorer (ADX) Cluster               │   │
│  │                    - or -                                    │   │
│  │              Log Analytics Workspace                         │   │
│  │                    - or -                                    │   │
│  │              Self-hosted KQL Engine                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │  Challenge  │  │   User      │  │   Logs/     │                 │
│  │   Data DB   │  │   Data DB   │  │  Telemetry  │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Stack Options

#### Option A: Azure-Native (Recommended for Production)
| Component | Technology |
|-----------|------------|
| Frontend | Next.js + TypeScript |
| Query Editor | Monaco Editor (VSCode's editor) |
| API | Azure Functions (Node.js) |
| Auth | Azure AD B2C / GitHub OAuth |
| Query Engine | Azure Data Explorer (Free cluster) |
| User Data | Azure Cosmos DB |
| Challenge Data | ADX tables |
| Hosting | Azure Static Web Apps |
| CDN | Azure CDN |

#### Option B: Self-Hosted / Open Source
| Component | Technology |
|-----------|------------|
| Frontend | React + Vite |
| Query Editor | Monaco Editor |
| API | FastAPI (Python) or Express (Node) |
| Auth | Auth0 / Supabase Auth |
| Query Engine | ClickHouse (KQL-compatible) or DuckDB |
| User Data | PostgreSQL |
| Challenge Data | Parquet files in S3/MinIO |
| Hosting | Vercel / Railway / Docker |

#### Option C: Minimal Viable Product (Hackathon)
| Component | Technology |
|-----------|------------|
| Frontend | Single HTML + vanilla JS |
| Query Editor | CodeMirror |
| API | Serverless functions |
| Auth | Magic links |
| Query Engine | Azure Log Analytics demo workspace |
| User Data | Local storage + simple backend |

### Key Technical Decisions

#### Query Execution Security
```
┌─────────────────────────────────────────────────────────────┐
│                    QUERY SANDBOX                             │
│                                                              │
│  1. Parse incoming KQL                                       │
│  2. Validate against allowlist of operators                  │
│  3. Check query complexity limits                            │
│  4. Scope to challenge-specific tables only                  │
│  5. Apply row/time limits                                    │
│  6. Execute in isolated context                              │
│  7. Return results (max 1000 rows)                          │
│                                                              │
│  BLOCKED:                                                    │
│  - .create, .drop, .set commands                            │
│  - Cross-database queries                                    │
│  - External data (unless part of challenge)                  │
│  - Queries > 30 seconds                                      │
└─────────────────────────────────────────────────────────────┘
```

#### Data Isolation Per Challenge
```
Challenge 1: Can only query → SigninLogs_Challenge1
Challenge 2: Can only query → AzureActivity_Challenge2, SigninLogs_Challenge2
Challenge 3: Can only query → SecurityEvent_Challenge3
```

---

## Data Strategy

### Data Sources

#### Synthetic Data Generation
Create realistic but fake log data:
```python
# Example: Generate failed sign-in data
def generate_signin_logs(num_records, attack_scenario):
    logs = []

    # Normal baseline
    for i in range(num_records * 0.9):
        logs.append({
            "TimeGenerated": random_timestamp(),
            "UserPrincipalName": random.choice(normal_users),
            "ResultType": random.choice([0, 0, 0, 50126]),  # Mostly success
            "IPAddress": random_internal_ip(),
            "Location": "US",
            # ... embed flag in specific record
        })

    # Attack pattern (brute force)
    attacker_ip = "185.234.XX.XX"
    for i in range(num_records * 0.1):
        logs.append({
            "TimeGenerated": sequential_timestamp(),  # Rapid succession
            "UserPrincipalName": "admin@contoso.com",
            "ResultType": 50126,  # Invalid password
            "IPAddress": attacker_ip,
            "UserAgent": f"Mozilla/5.0 FLAG{{kql_kung_fu_{scenario_id}}}"
        })

    return logs
```

#### Public Datasets (Anonymized)
- CICIDS dataset converted to KQL schema
- BETH dataset (authentication logs)
- Microsoft's own demo data
- Community-contributed sanitized logs

#### Flag Embedding Strategies
| Method | Example |
|--------|---------|
| In field value | `UserAgent: "FLAG{...}"` |
| In computed result | Sum of specific values = flag |
| Base64 encoded | Decode a field to reveal flag |
| Across multiple rows | Concat first letter of each result |
| Time-based | Timestamp pattern reveals flag |

### Data Volume Guidelines

| Belt Level | Records per Table | Tables Available |
|------------|-------------------|------------------|
| White | 1,000 | 1 |
| Yellow | 10,000 | 1-2 |
| Orange | 50,000 | 2-3 |
| Green | 100,000 | 3-4 |
| Blue | 500,000 | 4-5 |
| Brown | 1,000,000 | 5+ |
| Black | 5,000,000+ | All |

---

## Scoring & Progression

### Points System

```
Base Points per Challenge:
- White Belt:  50-100 pts
- Yellow Belt: 100-200 pts
- Orange Belt: 200-300 pts
- Green Belt:  300-500 pts
- Blue Belt:   500-750 pts
- Brown Belt:  750-1000 pts
- Black Belt:  1000-2000 pts

Modifiers:
- First blood (first solve):     +50% bonus
- Speed bonus (< 5 min):         +25% bonus
- No hints used:                 +10% bonus
- Each hint used:                -25% per hint
- Solution viewed:               0 points (learning mode)

Streak Bonuses:
- 3 day streak:                  +10% all points
- 7 day streak:                  +25% all points
- 30 day streak:                 +50% all points
```

### Belt Progression

```
⬜ White Belt:    0 pts      (Starting rank)
🟨 Yellow Belt:  500 pts     + Complete all White challenges
🟧 Orange Belt:  1,500 pts   + Complete 80% Yellow challenges
🟩 Green Belt:   4,000 pts   + Complete 80% Orange challenges
🟦 Blue Belt:    10,000 pts  + Complete 80% Green challenges
🟫 Brown Belt:   25,000 pts  + Complete 80% Blue challenges
⬛ Black Belt:   50,000 pts  + Complete 80% Brown + 1 community contribution
```

### Leaderboard Categories

1. **Global Ranking** - All-time points
2. **Monthly Champions** - Reset monthly
3. **Speed Demons** - Fastest solvers
4. **Completionists** - Most challenges completed
5. **Hint-Free Heroes** - No hints used
6. **Belt Leaders** - Top 10 per belt level
7. **Team Rankings** - Corporate/group competitions

---

## Implementation Roadmap

### Phase 1: MVP (4-6 weeks)
**Goal**: Playable proof of concept

- [ ] Basic web UI with query editor
- [ ] 5 White Belt challenges
- [ ] 5 Yellow Belt challenges
- [ ] Simple flag submission
- [ ] Local user accounts
- [ ] Point tracking
- [ ] Use Azure Log Analytics demo workspace

**Deliverable**: Deployable demo for DEFCON/conference

### Phase 2: Core Platform (6-8 weeks)
**Goal**: Full challenge experience

- [ ] All belt levels (35+ challenges)
- [ ] Hint system with point penalties
- [ ] OAuth authentication (GitHub/Microsoft)
- [ ] Global leaderboard
- [ ] User profiles and progress tracking
- [ ] Challenge discussions
- [ ] Dedicated ADX cluster with custom data

**Deliverable**: Public beta launch

### Phase 3: Community Features (4-6 weeks)
**Goal**: Self-sustaining platform

- [ ] Community challenge submissions
- [ ] Challenge rating/voting
- [ ] Teams and competitions
- [ ] Event mode (time-limited CTFs)
- [ ] Badges and achievements
- [ ] API for integrations

**Deliverable**: Community-driven platform

### Phase 4: Enterprise & Advanced (Ongoing)
**Goal**: Professional training tool

- [ ] Private instances for organizations
- [ ] Custom challenge creation
- [ ] Progress reports for managers
- [ ] Integration with Microsoft Learn
- [ ] Advanced analytics on learning patterns
- [ ] Mobile app

---

## Future Enhancements

### Competitive Features
- **Live CTF Events**: Time-boxed competitions with unique challenges
- **1v1 Duels**: Real-time head-to-head query battles
- **Team Wars**: Company vs company competitions

### Learning Features
- **Guided Learning Paths**: Structured curriculum
- **Video Walkthroughs**: Embedded tutorials
- **Query Explain**: AI-powered query explanation
- **Mistake Analysis**: "Here's why your query didn't work"

### Advanced Scenarios
- **Red Team Simulations**: Multi-day attack scenarios
- **Incident Response Mode**: Time pressure, evolving situation
- **Purple Team Exercises**: Create detection for given attack

### Integrations
- **Microsoft Sentinel**: Direct challenge import
- **MITRE ATT&CK Navigator**: Visual coverage mapping
- **Certification Prep**: Align with SC-200, AZ-500 objectives

---

## Appendix

### A. Sample API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/challenges
GET    /api/challenges/:id
POST   /api/challenges/:id/query
POST   /api/challenges/:id/submit
GET    /api/challenges/:id/hints/:num
GET    /api/user/profile
GET    /api/user/progress
GET    /api/leaderboard
GET    /api/leaderboard/monthly
```

### B. Database Schema (Simplified)

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE,
    points INTEGER DEFAULT 0,
    current_belt VARCHAR(20) DEFAULT 'white',
    created_at TIMESTAMP
);

-- Challenges
CREATE TABLE challenges (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200),
    belt VARCHAR(20),
    points INTEGER,
    scenario TEXT,
    flag VARCHAR(255),
    tables_available JSONB,
    hints JSONB,
    created_at TIMESTAMP
);

-- Submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    challenge_id VARCHAR(50) REFERENCES challenges(id),
    submitted_flag VARCHAR(255),
    is_correct BOOLEAN,
    points_earned INTEGER,
    hints_used INTEGER DEFAULT 0,
    solved_at TIMESTAMP
);
```

### C. Resources & References

- [KQL Quick Reference](https://docs.microsoft.com/en-us/azure/data-explorer/kql-quick-reference)
- [Azure Data Explorer Free Cluster](https://dataexplorer.azure.com/freecluster)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [CTFd Platform](https://ctfd.io/) - Inspiration for CTF mechanics
- [HackTheBox](https://hackthebox.com/) - Inspiration for progression system
- [SANS Holiday Hack](https://holidayhackchallenge.com/) - Inspiration for theming

---

## Contributing

This spec is a living document. Contributions welcome!

- **Challenge Ideas**: Open an issue with scenario description
- **Technical Improvements**: Submit a PR
- **Bug Reports**: Use issue templates
- **Feedback**: Discussions tab

---

*Spec Version: 1.0*
*Last Updated: 2026-01-09*
*Author: KQL Kung Fu Team*
