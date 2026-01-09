# Contributing to KQL Kung Fu CTF

Thank you for your interest in contributing! This document outlines how to create new challenges, improve existing ones, and contribute to the platform.

## Creating New Challenges

### Challenge Guidelines

1. **Educational Value**: Every challenge should teach a specific KQL concept
2. **Real-World Relevance**: Base scenarios on actual security use cases
3. **Progressive Difficulty**: Match the belt level appropriately
4. **Clear Objectives**: Players should understand what they're looking for
5. **Meaningful Hints**: Hints should guide without giving away the answer

### Challenge Template

```yaml
id: your-challenge-id          # kebab-case, unique
title: "Your Challenge Title"  # Human-readable
belt: yellow                   # white/yellow/orange/green/blue/brown/black
points: 150                    # 50-2000 based on difficulty
category: identity             # identity/network/activity-logs/security-alerts/resource-graph/multi-table/misc

scenario: |
  Write an engaging scenario here. Include:
  - Context about what's happening
  - Why this matters from a security perspective
  - What the player needs to investigate

objective: "Clear, one-sentence goal for the player."

tables:
  - SigninLogs                 # List all tables available

flag:
  value: "FLAG{kql_kung_fu_your_flag_here}"
  format: exact                # exact/regex/case-insensitive
  location: "Internal note about where the flag is hidden"

hints:
  - cost: 25                   # Point penalty for using
    text: "First hint - gentle nudge"
  - cost: 50
    text: "Second hint - more specific"
  - cost: 75
    text: "Third hint - almost the answer"

solution:
  query: |
    YourTable
    | where Condition == "value"
    | project RelevantColumns
  explanation: |
    Explain the solution approach and why it works.
    Include any KQL concepts being demonstrated.

learning_objectives:
  - "Primary concept taught"
  - "Secondary concept taught"

mitre_attack:                  # Optional but encouraged
  - T1110.001                  # Technique IDs

author: "Your Name"
version: "1.0"
```

### Difficulty Guidelines

| Belt | Points | Data Size | Tables | Concepts |
|------|--------|-----------|--------|----------|
| White | 50-100 | ~1K | 1 | Single operators |
| Yellow | 100-200 | ~10K | 1-2 | Aggregation, time |
| Orange | 200-300 | ~50K | 2-3 | Joins, unions |
| Green | 300-500 | ~100K | 3-4 | Parsing, regex |
| Blue | 500-750 | ~500K | 4-5 | Advanced functions |
| Brown | 750-1000 | ~1M | 5+ | Multi-stage hunting |
| Black | 1000-2000 | Variable | All | Novel scenarios |

### Flag Embedding Techniques

Flags can be hidden in various ways:

1. **Direct Field Value**
   ```
   UserAgent: "FLAG{kql_kung_fu_found_it}"
   ```

2. **Username/Email Format**
   ```
   UserPrincipalName: "FLAG{kql_kung_fu_user}@company.com"
   ```

3. **Computed Result** (describe in challenge)
   ```
   "The flag is FLAG{kql_kung_fu_<COUNT>} where COUNT is the number you found"
   ```

4. **Encoded**
   ```
   A field contains base64-encoded flag
   ```

5. **Pattern Across Records**
   ```
   First letter of each top result spells the flag
   ```

## Creating Data Generators

Add your generator to `data/generators/generate_data.py`:

```python
def generate_your_challenge_data(num_records: int = 5000) -> dict[str, list]:
    """Generate data for 'Your Challenge' challenge."""
    records = []

    # Generate baseline normal data
    for _ in range(num_records - 10):
        records.append(generate_signin_log())  # Or appropriate table

    # Add attack/anomaly pattern with hidden flag
    for _ in range(9):
        records.append(generate_signin_log(
            # Anomalous attributes
        ))

    # Add the flag
    records.append(generate_signin_log(
        user_agent="FLAG{kql_kung_fu_your_flag}"
    ))

    random.shuffle(records)
    return {"SigninLogs": records}

# Register in CHALLENGE_GENERATORS dict
CHALLENGE_GENERATORS["your-challenge-id"] = generate_your_challenge_data
```

## Testing Your Challenge

1. **Generate the data**:
   ```bash
   python generate_data.py -c your-challenge-id -o ../samples/
   ```

2. **Load into ADX** (or test environment)

3. **Verify the solution works**:
   - Run your solution query
   - Confirm the flag is found
   - Check hints make sense without revealing too much

4. **Test hint progression**:
   - Can someone solve with hint 1 alone?
   - Is hint 2 more helpful?
   - Does hint 3 make it obvious?

5. **Validate difficulty**:
   - Time yourself solving without hints
   - Get someone else to test it

## Code Style

- YAML files: 2-space indentation
- Python: Follow PEP 8, use type hints
- JavaScript/TypeScript: Prettier defaults
- Commit messages: Conventional commits format

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b challenge/your-challenge-name`
3. Add your challenge YAML and data generator
4. Test thoroughly
5. Submit PR with:
   - Challenge description
   - Expected difficulty level
   - Testing notes

## Questions?

Open an issue or reach out to the maintainers.

Happy hunting!
