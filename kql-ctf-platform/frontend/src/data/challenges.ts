import type { Challenge } from '../types/challenge';

export const challenges: Challenge[] = [
  // ============= WHITE BELT =============
  {
    id: 'hello-kql',
    title: 'Hello, KQL',
    belt: 'white',
    points: 50,
    category: 'misc',
    scenario: `Welcome to the KQL Kung Fu dojo, young grasshopper!

Before you can find needles in haystacks, you must first learn to see the hay. Your Azure environment has been logging security events, and somewhere in those logs, we've hidden your first flag.

The flag is hidden in a SecurityEvent record where the Activity field contains something special. Can you find it?`,
    objective: 'Query the SecurityEvent table and find the record containing the flag.',
    tables: ['SecurityEvent'],
    flag: {
      value: 'FLAG{kql_kung_fu_first_steps}',
      format: 'exact',
    },
    hints: [
      { cost: 10, text: 'Start by just typing the table name: SecurityEvent' },
      { cost: 15, text: 'Use the "where" operator to filter. Try: where Activity contains "FLAG"' },
      { cost: 25, text: 'The full query is: SecurityEvent | where Activity contains "FLAG"' },
    ],
    solution: {
      query: 'SecurityEvent\n| where Activity contains "FLAG"',
      explanation: `This challenge introduces the most basic KQL pattern:
1. Start with a table name (SecurityEvent)
2. Use the pipe (|) to chain operators
3. Use 'where' to filter rows based on conditions
4. Use 'contains' for case-insensitive substring matching`,
    },
    learningObjectives: [
      'Understanding table-based queries',
      'Using the pipe operator to chain commands',
      'Basic filtering with "where"',
      'String matching with "contains"',
    ],
    author: 'KQL Kung Fu Team',
  },
  {
    id: 'counting-101',
    title: 'Counting 101',
    belt: 'white',
    points: 50,
    category: 'identity',
    scenario: `Your security team needs a quick health check on the Azure AD environment.

The SigninLogs table contains authentication attempts. Your mission is simple: count the total number of sign-in events in the dataset.

But here's the twist - the flag is the count itself! Format your answer as: FLAG{kql_kung_fu_COUNT} where COUNT is the exact number you find.`,
    objective: 'Count all records in the SigninLogs table and submit the count as the flag.',
    tables: ['SigninLogs'],
    flag: {
      value: 'FLAG{kql_kung_fu_1337}',
      format: 'exact',
    },
    hints: [
      { cost: 10, text: 'KQL has a "count" operator that returns the number of rows' },
      { cost: 15, text: 'Try: SigninLogs | count' },
      { cost: 20, text: 'The result will be a single number - format it as FLAG{kql_kung_fu_NUMBER}' },
    ],
    solution: {
      query: 'SigninLogs\n| count',
      explanation: `The 'count' operator returns the total number of records in the result set. This is one of the simplest aggregation operations in KQL.

Alternative using summarize: SigninLogs | summarize count()`,
    },
    learningObjectives: [
      'Using the "count" operator',
      'Understanding record counts',
      'Introduction to aggregation concepts',
    ],
    author: 'KQL Kung Fu Team',
  },
  {
    id: 'project-basics',
    title: 'The Art of Projection',
    belt: 'white',
    points: 75,
    category: 'identity',
    scenario: `A security analyst needs to review recent sign-ins, but they're overwhelmed by all the columns in the SigninLogs table.

Help them out by creating a clean view showing only:
- TimeGenerated
- UserPrincipalName
- ResultType
- IPAddress

In the results, you'll find a suspicious user whose name IS the flag. Look for the user with the most unusual UserPrincipalName!`,
    objective: 'Project specific columns and identify the suspicious username that is the flag.',
    tables: ['SigninLogs'],
    flag: {
      value: 'FLAG{kql_kung_fu_proj3ct_m4st3r}',
      format: 'case-insensitive',
    },
    hints: [
      { cost: 15, text: 'Use "project" to select specific columns: | project Column1, Column2' },
      { cost: 20, text: 'After projecting, look through the UserPrincipalName values for something unusual' },
      { cost: 30, text: 'SigninLogs | project TimeGenerated, UserPrincipalName, ResultType, IPAddress | where UserPrincipalName contains "FLAG"' },
    ],
    solution: {
      query: 'SigninLogs\n| project TimeGenerated, UserPrincipalName, ResultType, IPAddress\n| where UserPrincipalName contains "FLAG"',
      explanation: `The 'project' operator selects which columns to include in the output. This is similar to SELECT in SQL.

Variants:
- project: Select specific columns
- project-away: Remove specific columns, keep the rest
- project-keep: Keep columns matching a pattern
- project-rename: Rename columns`,
    },
    learningObjectives: [
      'Using "project" to select columns',
      'Combining multiple operators',
      'Data reduction for readability',
    ],
    author: 'KQL Kung Fu Team',
  },
  {
    id: 'limit-yourself',
    title: 'Know Your Limits',
    belt: 'white',
    points: 75,
    category: 'network',
    scenario: `The network team captured flow logs but the dataset is HUGE! They need you to find the most recent 10 network flows to verify logging is working.

But wait - one of those flows has a secret destination IP address that's actually your flag. The flag format is: FLAG{kql_kung_fu_IPADDRESS} where IPADDRESS is the destination IP from the most recent denied inbound flow.`,
    objective: 'Find the 10 most recent flows, identify the most recent denied inbound flow\'s destination IP.',
    tables: ['AzureNetworkAnalytics_CL'],
    flag: {
      value: 'FLAG{kql_kung_fu_10.13.37.100}',
      format: 'exact',
    },
    hints: [
      { cost: 15, text: 'Use "order by" (or "sort by") to sort results, and "limit" (or "take") to restrict count' },
      { cost: 20, text: 'Filter for denied (FlowStatus_s == "D") and inbound (FlowDirection_s == "I")' },
      { cost: 30, text: 'AzureNetworkAnalytics_CL | where FlowStatus_s == "D" and FlowDirection_s == "I" | order by TimeGenerated desc | limit 1' },
    ],
    solution: {
      query: 'AzureNetworkAnalytics_CL\n| where FlowStatus_s == "D" and FlowDirection_s == "I"\n| order by TimeGenerated desc\n| limit 1\n| project DestIP_s',
      explanation: `Key operators learned:
- 'order by' (alias: 'sort by'): Sort results by a column
- 'desc' / 'asc': Sort direction (descending/ascending)
- 'limit' (alias: 'take'): Restrict output to N rows

Always sort before limiting to get meaningful "top N" results!`,
    },
    learningObjectives: [
      'Sorting with "order by"',
      'Limiting results with "limit" or "take"',
      'Combining where, order by, and limit',
      'Understanding flow log fields',
    ],
    author: 'KQL Kung Fu Team',
  },
  {
    id: 'distinct-possibilities',
    title: 'Distinct Possibilities',
    belt: 'white',
    points: 100,
    category: 'identity',
    scenario: `The identity team wants to know how many unique users have attempted to sign in to your Azure AD tenant this month.

Find all distinct UserPrincipalName values in the SigninLogs. Among them, you'll find one that doesn't belong - it's the flag disguised as a username!`,
    objective: 'List all distinct users and find the one that\'s actually a flag.',
    tables: ['SigninLogs'],
    flag: {
      value: 'FLAG{kql_kung_fu_unique_find}',
      format: 'exact',
    },
    hints: [
      { cost: 20, text: 'The "distinct" operator returns unique values from a column' },
      { cost: 25, text: 'Try: SigninLogs | distinct UserPrincipalName' },
      { cost: 35, text: 'Pipe your distinct results through a where filter looking for "FLAG"' },
    ],
    solution: {
      query: 'SigninLogs\n| distinct UserPrincipalName\n| where UserPrincipalName contains "FLAG"',
      explanation: `The 'distinct' operator returns unique values, removing duplicates.

Useful variations:
- distinct Column1: Unique values of one column
- distinct Column1, Column2: Unique combinations
- summarize dcount(Column1): Count of distinct values`,
    },
    learningObjectives: [
      'Using "distinct" for unique values',
      'Understanding deduplication',
      'Chaining distinct with other operators',
    ],
    author: 'KQL Kung Fu Team',
  },

  // ============= YELLOW BELT =============
  {
    id: 'brute-force-101',
    title: 'The Persistent Attacker',
    belt: 'yellow',
    points: 150,
    category: 'identity',
    scenario: `Your SOC received an alert about potential brute force activity. Someone (or something) is hammering away at your Azure AD, trying to guess passwords.

Analyze the SigninLogs to find the user account that received the MOST failed sign-in attempts. The attacker left a calling card in the UserAgent string of their attempts - that's your flag!`,
    objective: 'Find the most targeted account and extract the flag from the attacker\'s UserAgent.',
    tables: ['SigninLogs'],
    flag: {
      value: 'FLAG{kql_kung_fu_brut3_f0rc3_d3t3ct3d}',
      format: 'exact',
    },
    hints: [
      { cost: 25, text: 'Failed sign-ins have ResultType != 0. Use summarize with count() to aggregate.' },
      { cost: 35, text: 'Group by UserPrincipalName: SigninLogs | where ResultType != 0 | summarize count() by UserPrincipalName' },
      { cost: 50, text: 'After finding the most targeted user, query their failed sign-ins and look at UserAgent' },
    ],
    solution: {
      query: `// Step 1: Find most targeted account
SigninLogs
| where ResultType != 0
| summarize Attempts = count() by UserPrincipalName
| order by Attempts desc
| limit 1

// Step 2: Get the flag from UserAgent
SigninLogs
| where ResultType != 0
| where UserPrincipalName == "admin@yourcompany.com"
| where UserAgent contains "FLAG"
| distinct UserAgent`,
      explanation: `This challenge teaches the critical 'summarize' operator:
- summarize creates aggregations like count(), sum(), avg()
- 'by' clause groups the aggregation

Real-world application: This exact pattern is used to detect brute force attacks in production SOC environments.`,
    },
    learningObjectives: [
      'Using "summarize" for aggregation',
      'Grouping with the "by" clause',
      'Identifying brute force attack patterns',
      'Multi-step investigation queries',
    ],
    mitreAttack: ['T1110.001'],
    author: 'KQL Kung Fu Team',
  },
  {
    id: 'time-traveler',
    title: 'The Time Traveler',
    belt: 'yellow',
    points: 150,
    category: 'identity',
    scenario: `Something strange happened exactly at midnight last week. A sign-in occurred at an unusual hour that your security team flagged as suspicious.

Find all sign-ins that occurred between midnight (00:00) and 4:00 AM across all days in the logs. Among these late-night authentications, one has a suspicious AppDisplayName that contains your flag.`,
    objective: 'Filter for late-night sign-ins (00:00-04:00) and find the flag in AppDisplayName.',
    tables: ['SigninLogs'],
    flag: {
      value: 'FLAG{kql_kung_fu_midnight_hacker}',
      format: 'exact',
    },
    hints: [
      { cost: 25, text: 'Use hourofday() to extract the hour from TimeGenerated' },
      { cost: 35, text: 'Filter for hours 0-3: where hourofday(TimeGenerated) between (0 .. 3)' },
      { cost: 50, text: 'SigninLogs | where hourofday(TimeGenerated) >= 0 and hourofday(TimeGenerated) < 4 | where AppDisplayName contains "FLAG"' },
    ],
    solution: {
      query: 'SigninLogs\n| where hourofday(TimeGenerated) >= 0 and hourofday(TimeGenerated) < 4\n| where AppDisplayName contains "FLAG"\n| project TimeGenerated, UserPrincipalName, AppDisplayName',
      explanation: `KQL has powerful datetime functions:
- ago(1h), ago(1d), ago(7d): Relative time
- hourofday(), dayofweek(), dayofmonth(): Extract components
- between (start .. end): Range filtering
- datetime_diff(): Calculate time differences

Security relevance: Unusual login times are a common indicator of compromise.`,
    },
    learningObjectives: [
      'Using datetime functions (hourofday, ago)',
      'Time-based filtering',
      'Detecting anomalous timing patterns',
    ],
    mitreAttack: ['T1078'],
    author: 'KQL Kung Fu Team',
  },
  {
    id: 'string-theory',
    title: 'String Theory',
    belt: 'yellow',
    points: 175,
    category: 'security-alerts',
    scenario: `Security alerts are flooding in, and you need to triage them efficiently. Your task is to find all alerts related to "credential" threats.

But the data is messy - some alerts say "Credential", others say "CREDENTIAL", and some say "credential access". You need to catch them all!

Among the credential-related alerts, one has an unusual AlertName that IS your flag.`,
    objective: 'Find all credential-related alerts using case-insensitive matching and locate the flag.',
    tables: ['SecurityAlert'],
    flag: {
      value: 'FLAG{kql_kung_fu_str1ng_n1nja}',
      format: 'exact',
    },
    hints: [
      { cost: 25, text: 'Use "contains" for case-insensitive substring matching (not "contains_cs")' },
      { cost: 35, text: 'String operators: contains (case-insensitive), contains_cs (case-sensitive), has (word boundary)' },
      { cost: 50, text: 'SecurityAlert | where AlertName contains "credential" or Description contains "credential" | where AlertName contains "FLAG"' },
    ],
    solution: {
      query: 'SecurityAlert\n| where AlertName contains "credential"\n     or Description contains "credential"\n| where AlertName contains "FLAG"\n| distinct AlertName',
      explanation: `String operators comparison:
- contains: Case-insensitive substring
- contains_cs: Case-sensitive substring
- has: Word boundary matching (more performant)
- has_cs: Case-sensitive word boundary
- startswith, endswith: Prefix/suffix matching`,
    },
    learningObjectives: [
      'Case-sensitive vs case-insensitive operators',
      'Understanding "contains" vs "has"',
      'Combining multiple string conditions',
      'Alert triage patterns',
    ],
    mitreAttack: ['T1110', 'TA0006'],
    author: 'KQL Kung Fu Team',
  },
  {
    id: 'port-scanner',
    title: 'The Port Scanner',
    belt: 'yellow',
    points: 200,
    category: 'network',
    scenario: `Your network security team detected suspicious traffic patterns in the NSG flow logs. It looks like someone might be scanning your network!

A port scan typically shows:
- One source IP hitting many destination ports
- Usually short-lived connections
- Often denied by firewall rules

Find the source IP that attempted to connect to the MOST unique destination ports. The number of unique ports they scanned IS your flag!

Format: FLAG{kql_kung_fu_PORTNUMBER}`,
    objective: 'Identify the source IP with the most destination port diversity and count the ports.',
    tables: ['AzureNetworkAnalytics_CL'],
    flag: {
      value: 'FLAG{kql_kung_fu_443}',
      format: 'exact',
    },
    hints: [
      { cost: 30, text: 'Use dcount() to count distinct values: summarize dcount(DestPort_d) by SrcIP_s' },
      { cost: 40, text: 'Sort by the distinct count descending to find the top scanner' },
      { cost: 55, text: 'AzureNetworkAnalytics_CL | summarize UniquePortsScanned = dcount(DestPort_d) by SrcIP_s | order by UniquePortsScanned desc | limit 1' },
    ],
    solution: {
      query: 'AzureNetworkAnalytics_CL\n| summarize\n    UniquePortsScanned = dcount(DestPort_d),\n    TotalConnections = count()\n  by SrcIP_s\n| order by UniquePortsScanned desc\n| limit 5',
      explanation: `Advanced summarize techniques:
- dcount(): Distinct count (cardinality)
- Multiple aggregations in one summarize
- Naming aggregation results with '='

Port scan detection thresholds:
- Normal: ~5-10 unique ports per source IP
- Suspicious: 50+ unique ports
- Definite scan: 100+ unique ports in short time`,
    },
    learningObjectives: [
      'Using dcount() for distinct counts',
      'Multiple aggregations in summarize',
      'Network threat detection patterns',
      'Understanding port scanning indicators',
    ],
    mitreAttack: ['T1046'],
    author: 'KQL Kung Fu Team',
  },
  {
    id: 'the-insider',
    title: 'The Insider Threat',
    belt: 'yellow',
    points: 200,
    category: 'activity-logs',
    scenario: `HR flagged three employees for suspicious behavior:
- john.smith@yourcompany.com
- sarah.jones@yourcompany.com
- mike.wilson@yourcompany.com

Your task is to audit their Azure activity. Check the AzureActivity logs for any actions performed by these three users.

One of them performed an unusual operation - and the OperationName contains your flag!`,
    objective: 'Filter for activities by the three flagged users and find the suspicious operation.',
    tables: ['AzureActivity'],
    flag: {
      value: 'FLAG{kql_kung_fu_1ns1d3r_f0und}',
      format: 'exact',
    },
    hints: [
      { cost: 30, text: 'Use the "in" operator to match multiple values: where Caller in ("value1", "value2")' },
      { cost: 40, text: 'let suspectUsers = dynamic(["john.smith@yourcompany.com", ...]); AzureActivity | where Caller in (suspectUsers)' },
      { cost: 55, text: 'After filtering to the three users, look for OperationName containing "FLAG"' },
    ],
    solution: {
      query: `let suspectUsers = dynamic([
    "john.smith@yourcompany.com",
    "sarah.jones@yourcompany.com",
    "mike.wilson@yourcompany.com"
]);
AzureActivity
| where Caller in (suspectUsers)
| where OperationName contains "FLAG"
| project TimeGenerated, Caller, OperationName`,
      explanation: `The 'in' operator efficiently checks if a value is in a list:
- in: Case-insensitive match against list
- !in: Not in list
- has_any: Any word from a list

Using 'let' to define reusable variables makes queries more readable and maintainable.`,
    },
    learningObjectives: [
      'Using "in" operator for multiple value matching',
      'Introduction to "let" statements',
      'Insider threat investigation patterns',
      'Auditing specific user activities',
    ],
    mitreAttack: ['T1078', 'T1530'],
    author: 'KQL Kung Fu Team',
  },
];

export function getChallengesByBelt(belt: string): Challenge[] {
  return challenges.filter(c => c.belt === belt);
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find(c => c.id === id);
}

export function getAllBelts(): string[] {
  return [...new Set(challenges.map(c => c.belt))];
}
