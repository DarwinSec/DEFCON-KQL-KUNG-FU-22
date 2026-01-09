# Security Games & CTF Proposals for Monad.com

> **Target Audience**: Security beginners (101 level)
> **Core Focus**: Real-time streaming, enrichment, data transformation, rule-based routing

---

## Game 1: "Stream Defender" - The Traffic Triage Challenge

### Concept
Players act as a SOC analyst's first day on the job. Raw log streams flow in real-time, and players must build routing rules to send suspicious events to the right investigation queues before the buffer overflows.

### Learning Objectives
- Understand log triage fundamentals
- Learn basic pattern matching for security events
- Experience real-time decision making under pressure

### Gameplay
```
Level 1: "The Calm Before the Storm"
- Simple traffic: HTTP 200s, normal DNS queries, standard logins
- Task: Route failed logins (>3 attempts) to the "Suspicious" queue
- Success: Catch 80% of bad events without false positives flooding the queue

Level 2: "Port Scanner Panic"
- Traffic includes port scanning activity
- Task: Build a rule that detects sequential port access from single IPs
- Bonus: Don't accidentally block the vulnerability scanner team!

Level 3: "The Exfil Express"
- Normal traffic mixed with data exfiltration patterns
- Task: Spot unusually large outbound transfers to rare destinations
- Challenge: Real-time byte counting and destination enrichment
```

### Monad Tie-in
Players literally build streaming rules using simplified Monad-style syntax:
```yaml
WHEN source_ip.failed_logins > 3 IN 5_minutes
ROUTE TO suspicious_queue
ENRICH WITH geo_location, threat_intel
```

---

## Game 2: "Enrich or Perish" - The Context Quest

### Concept
Raw alerts are meaningless without context. Players receive barebones security events and must choose the right enrichment sources to make them actionable—but enrichment costs "cycles" and time is limited.

### Learning Objectives
- Understand the value of log enrichment
- Learn common enrichment sources (GeoIP, threat intel, asset inventory)
- Practice prioritization under resource constraints

### Gameplay
```
Scenario: Alert - "Connection to 185.234.xx.xx on port 443"

Available Enrichments (each costs cycles):
├── GeoIP Lookup (2 cycles) → Reveals: Russia
├── Threat Intel (3 cycles) → Reveals: Known C2 server
├── Asset Lookup (2 cycles) → Reveals: Source is CEO's laptop
├── DNS History (4 cycles) → Reveals: Recently registered domain
└── Certificate Check (3 cycles) → Reveals: Self-signed cert

Budget: 8 cycles
Optimal Path: GeoIP + Threat Intel + Asset = 7 cycles → HIGH PRIORITY ALERT

Wrong Path: Spending all cycles on low-value enrichments = missed attack
```

### Scoring
- **Speed**: Faster enrichment decisions = more points
- **Accuracy**: Correct severity classification
- **Efficiency**: Cycles saved can be banked for boss rounds

### Monad Tie-in
Demonstrates Monad's enrichment pipeline capabilities. Post-game shows how this would be automated:
```
stream.logs
  | enrich(geoip, when: external_ip)
  | enrich(threat_intel, when: destination_ip)
  | enrich(asset_db, when: source_ip)
  | route(high_priority, when: threat_score > 7)
```

---

## Game 3: "Transform or Die" - The Log Normalization Gauntlet

### Concept
Logs arrive in chaos—different formats, schemas, timestamps. Players must transform them into a unified format before correlation is possible. Wrong transformations corrupt the data permanently.

### Learning Objectives
- Understand log normalization challenges
- Learn common log formats (JSON, CEF, Syslog, Windows Event)
- Practice field mapping and parsing

### Gameplay
```
INCOMING LOG CHAOS:

Log A (Firewall - CEF):
CEF:0|Palo Alto|NGFW|9.0|threat|THREAT|8|src=10.0.0.5 dst=evil.com

Log B (Linux Auth - Syslog):
Jan 15 10:23:45 server01 sshd[2234]: Failed password for admin from 10.0.0.5

Log C (Cloud - JSON):
{"timestamp":"2024-01-15T10:23:47Z","actor":"10.0.0.5","action":"s3:GetObject","bucket":"secrets"}

MISSION: Transform all three to unified schema:
{
  "timestamp": "ISO8601",
  "source_ip": "string",
  "action": "string",
  "severity": "int",
  "destination": "string"
}
```

### Challenge Modes
- **Speed Round**: Parse 50 logs in 60 seconds
- **Boss Battle**: Malformed logs with missing fields
- **Nightmare Mode**: Attacker-crafted logs designed to break parsers (log injection!)

### Monad Tie-in
Shows how Monad's transformation pipelines handle this automatically:
```
transform firewall_logs:
  | parse(cef_format)
  | rename(src → source_ip, dst → destination)
  | normalize(timestamp, to: iso8601)
```

---

## Game 4: "Rule Royale" - The Detection Engineering Arena

### Concept
Battle royale but for detection rules! Players write real-time detection rules. The environment simulates attacks, and whoever's rules catch the most threats (with fewest false positives) wins.

### Learning Objectives
- Understand detection rule logic
- Learn threshold tuning and time windows
- Experience the false positive / false negative tradeoff

### Gameplay
```
ROUND 1: "Brute Force Basics"
Attacks Simulated: SSH brute force, credential stuffing
Write a rule to detect without blocking IT admin password resets

ROUND 2: "Beacon Hunter"
Attacks Simulated: C2 beaconing at regular intervals
Write a rule to detect periodic callbacks (hint: timing analysis)

ROUND 3: "The Insider Threat"
Attacks Simulated: Legitimate user doing suspicious things
Write a rule that considers user behavior baselines

FINAL BOSS: "The APT Gauntlet"
All attack types at once, stealth mode enabled
Your rules compete head-to-head against other players
```

### Scoring Matrix
| Metric | Points |
|--------|--------|
| True Positive | +100 |
| True Negative | +10 |
| False Positive | -50 |
| False Negative | -200 |

### Monad Tie-in
Players write rules in Monad's routing syntax:
```
rule brute_force_detector:
  when: event.type == "auth_failure"
  window: 5 minutes
  threshold: count(source_ip) > 10
  action: route_to(high_priority) | enrich(user_context)
```

---

## Game 5: "Pipeline Panic" - The Real-Time Debugging Challenge

### Concept
Something's wrong with the security data pipeline! Events are getting lost, duplicated, or misrouted. Players must trace the flow and fix the issues before attackers exploit the blind spots.

### Learning Objectives
- Understand data pipeline architecture
- Learn debugging and observability concepts
- Practice systematic troubleshooting

### Gameplay
```
INCIDENT: "Alerts are arriving 10 minutes late!"

Investigation Tools:
├── Pipeline Visualizer (see the flow)
├── Latency Metrics (find the bottleneck)
├── Sample Inspector (examine actual events)
└── Config Viewer (check routing rules)

Possible Causes:
- Overwhelmed enrichment service
- Regex rule causing backtracking
- Downstream queue full
- Network timeout misconfiguration

MISSION: Find and fix the issue in under 5 minutes
```

### Levels
1. **"The Missing Logs"** - Find why firewall logs aren't reaching SIEM
2. **"The Duplicate Disaster"** - Debug why alerts fire twice
3. **"The Schema Drift"** - Fix broken parsing after upstream format change
4. **"The Cardinality Crisis"** - Optimize rules causing memory explosion

### Monad Tie-in
Directly teaches Monad pipeline debugging:
```
# Players add observability to find issues
stream.logs
  | observe(latency_histogram)
  | transform(...)
  | observe(throughput_counter)
  | route(...)
```

---

## Game 6: "Threat Intel Trader" - The Enrichment Economy

### Concept
A card-trading game where players collect and trade threat intelligence to enrich their detection capabilities. Different intel sources have different costs, freshness, and accuracy.

### Learning Objectives
- Understand threat intelligence types (IP, domain, hash, behavioral)
- Learn intel quality assessment (confidence, timeliness)
- Practice prioritizing limited security resources

### Gameplay
```
YOUR HAND:
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ IP Blocklist    │ │ YARA Rules      │ │ Domain Intel    │
│ ───────────────│ │ ───────────────│ │ ───────────────│
│ Cost: Low       │ │ Cost: Medium    │ │ Cost: High      │
│ Confidence: 60% │ │ Confidence: 85% │ │ Confidence: 90% │
│ Freshness: 24hr │ │ Freshness: 7day │ │ Freshness: 1hr  │
│ Coverage: IPs   │ │ Coverage: Files │ │ Coverage: C2    │
└─────────────────┘ └─────────────────┘ └─────────────────┘

ATTACK INCOMING: Ransomware with C2 callback

Best Play: Domain Intel (matches attack type, high confidence)
```

### Monad Tie-in
Shows how Monad integrates multiple threat intel feeds:
```
enrich_chain:
  | enrich(ip_reputation, timeout: 100ms)
  | enrich(domain_intel, when: has_domain)
  | enrich(file_hash, when: has_hash)
  | merge(confidence_weighted_average)
```

---

## Bonus: "The Monad Dojo" - Progressive Learning Path

### Structure
```
WHITE BELT - Streaming Basics
├── What is a log stream?
├── Real-time vs batch processing
└── Exercise: Route logs by severity

YELLOW BELT - Enrichment Fundamentals
├── Why context matters
├── Common enrichment sources
└── Exercise: Build an enrichment pipeline

ORANGE BELT - Transformation Techniques
├── Parsing and normalization
├── Schema design
└── Exercise: Unify 3 log formats

GREEN BELT - Rule-Based Routing
├── Conditional logic
├── Thresholds and windows
└── Exercise: Write detection rules

BLUE BELT - Pipeline Architecture
├── Scaling and reliability
├── Error handling
└── Exercise: Debug a broken pipeline

BROWN BELT - Advanced Patterns
├── Correlation across streams
├── Stateful processing
└── Exercise: Detect multi-stage attacks

BLACK BELT - The Gauntlet
├── All skills combined
├── Real attack simulation
└── Exercise: Defend against APT campaign
```

---

## Implementation Recommendations

### Technical Stack
1. **Browser-based playground** - No setup friction for beginners
2. **Simulated log generator** - Realistic traffic patterns with injected threats
3. **Visual pipeline builder** - Drag-and-drop for 101 level
4. **Code mode unlock** - Progress to real syntax as skills improve

### Gamification Elements
- **Achievements**: "First Rule Written", "100 Threats Caught", "Zero False Positives"
- **Leaderboards**: Weekly challenges with community rankings
- **Badges**: Shareable credentials for LinkedIn/Twitter

### Community Integration
- **Monthly challenges** tied to real-world threat trends
- **Rule sharing marketplace** - players share and rate each other's rules
- **War stories mode** - recreate famous breaches for educational purposes

---

## Why This Works for Monad

| Game Element | Monad Capability Highlighted |
|--------------|------------------------------|
| Real-time decisions | Streaming architecture |
| Enrichment choices | Data enrichment pipelines |
| Format chaos | Transformation engine |
| Detection rules | Rule-based routing |
| Pipeline debugging | Observability & reliability |
| Intel integration | Multi-source enrichment |

Each game naturally leads players to understand why Monad's capabilities matter—without feeling like a product demo.

---

*Inspired by the hands-on approach of DEFCON workshops like KQL Kung Fu*
