import type { QueryResult } from '../types/challenge';

// Mock data for each table - in production this would come from ADX
const mockSigninLogs = [
  { TimeGenerated: '2024-01-15T10:30:00Z', UserPrincipalName: 'alice.wong@yourcompany.com', ResultType: 0, IPAddress: '10.0.1.50', UserAgent: 'Mozilla/5.0 Chrome/120', AppDisplayName: 'Microsoft Office 365' },
  { TimeGenerated: '2024-01-15T10:31:00Z', UserPrincipalName: 'bob.chen@yourcompany.com', ResultType: 0, IPAddress: '10.0.1.51', UserAgent: 'Mozilla/5.0 Firefox/121', AppDisplayName: 'Azure Portal' },
  { TimeGenerated: '2024-01-15T02:15:00Z', UserPrincipalName: 'hacker@evil.com', ResultType: 0, IPAddress: '185.234.72.100', UserAgent: 'Mozilla/5.0', AppDisplayName: 'FLAG{kql_kung_fu_midnight_hacker}' },
  { TimeGenerated: '2024-01-15T11:00:00Z', UserPrincipalName: 'admin@yourcompany.com', ResultType: 50126, IPAddress: '185.234.72.100', UserAgent: 'Mozilla/5.0 FLAG{kql_kung_fu_brut3_f0rc3_d3t3ct3d} BruteForcer/1.0', AppDisplayName: 'Azure Portal' },
  { TimeGenerated: '2024-01-15T11:00:05Z', UserPrincipalName: 'admin@yourcompany.com', ResultType: 50126, IPAddress: '185.234.72.100', UserAgent: 'Mozilla/5.0 FLAG{kql_kung_fu_brut3_f0rc3_d3t3ct3d} BruteForcer/1.0', AppDisplayName: 'Azure Portal' },
  { TimeGenerated: '2024-01-15T11:00:10Z', UserPrincipalName: 'admin@yourcompany.com', ResultType: 50126, IPAddress: '185.234.72.100', UserAgent: 'Mozilla/5.0 FLAG{kql_kung_fu_brut3_f0rc3_d3t3ct3d} BruteForcer/1.0', AppDisplayName: 'Azure Portal' },
  { TimeGenerated: '2024-01-15T12:00:00Z', UserPrincipalName: 'FLAG{kql_kung_fu_proj3ct_m4st3r}@yourcompany.com', ResultType: 0, IPAddress: '10.0.1.99', UserAgent: 'Mozilla/5.0', AppDisplayName: 'Microsoft Teams' },
  { TimeGenerated: '2024-01-15T12:30:00Z', UserPrincipalName: 'FLAG{kql_kung_fu_unique_find}@yourcompany.com', ResultType: 0, IPAddress: '10.0.1.100', UserAgent: 'Mozilla/5.0', AppDisplayName: 'SharePoint' },
];

// Add more records to make counting work (total 1337)
for (let i = 0; i < 1329; i++) {
  mockSigninLogs.push({
    TimeGenerated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    UserPrincipalName: `user${i % 50}@yourcompany.com`,
    ResultType: Math.random() > 0.95 ? 50126 : 0,
    IPAddress: `10.0.${Math.floor(i / 255)}.${i % 255}`,
    UserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
    AppDisplayName: ['Microsoft Office 365', 'Azure Portal', 'Teams', 'SharePoint'][i % 4],
  });
}

const mockSecurityEvents = [
  { TimeGenerated: '2024-01-15T09:00:00Z', EventID: 4624, Activity: '4624 - An account was successfully logged on', Computer: 'SERVER01.yourcompany.com', Account: 'alice' },
  { TimeGenerated: '2024-01-15T09:05:00Z', EventID: 4625, Activity: '4625 - An account failed to log on', Computer: 'SERVER01.yourcompany.com', Account: 'bob' },
  { TimeGenerated: '2024-01-15T09:10:00Z', EventID: 9999, Activity: 'FLAG{kql_kung_fu_first_steps}', Computer: 'SECRETSERVER.yourcompany.com', Account: 'system' },
  { TimeGenerated: '2024-01-15T09:15:00Z', EventID: 4672, Activity: '4672 - Special privileges assigned to new logon', Computer: 'DC01.yourcompany.com', Account: 'admin' },
];

const mockAzureActivity = [
  { TimeGenerated: '2024-01-15T10:00:00Z', OperationName: 'Microsoft.Compute/virtualMachines/start/action', Caller: 'alice.wong@yourcompany.com', Resource: 'vm-prod-01' },
  { TimeGenerated: '2024-01-15T10:30:00Z', OperationName: 'Microsoft.Storage/storageAccounts/write', Caller: 'bob.chen@yourcompany.com', Resource: 'storageaccount01' },
  { TimeGenerated: '2024-01-15T11:00:00Z', OperationName: 'FLAG{kql_kung_fu_1ns1d3r_f0und}', Caller: 'sarah.jones@yourcompany.com', Resource: 'secret-keyvault' },
  { TimeGenerated: '2024-01-15T11:30:00Z', OperationName: 'Microsoft.Authorization/roleAssignments/write', Caller: 'john.smith@yourcompany.com', Resource: 'subscription-prod' },
  { TimeGenerated: '2024-01-15T12:00:00Z', OperationName: 'Microsoft.KeyVault/vaults/secrets/read', Caller: 'mike.wilson@yourcompany.com', Resource: 'keyvault-prod' },
];

const mockNetworkFlows: Array<Record<string, unknown>> = [
  { TimeGenerated: '2024-01-15T10:00:00Z', SrcIP_s: '10.0.1.50', DestIP_s: '10.0.2.100', SrcPort_d: 54321, DestPort_d: 443, FlowStatus_s: 'A', FlowDirection_s: 'O' },
  { TimeGenerated: '2024-01-15T10:01:00Z', SrcIP_s: '185.234.72.100', DestIP_s: '10.13.37.100', SrcPort_d: 12345, DestPort_d: 22, FlowStatus_s: 'D', FlowDirection_s: 'I' },
];

// Add port scanning data (443 unique ports)
const scannerIP = '192.168.100.50';
for (let port = 1; port <= 443; port++) {
  mockNetworkFlows.push({
    TimeGenerated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    SrcIP_s: scannerIP,
    DestIP_s: '10.0.2.100',
    SrcPort_d: 40000 + port,
    DestPort_d: port,
    FlowStatus_s: 'D',
    FlowDirection_s: 'I',
  });
}

// Make sure most recent denied inbound has the flag IP
mockNetworkFlows.push({
  TimeGenerated: new Date().toISOString(),
  SrcIP_s: '185.234.72.100',
  DestIP_s: '10.13.37.100',
  SrcPort_d: 55555,
  DestPort_d: 3389,
  FlowStatus_s: 'D',
  FlowDirection_s: 'I',
});

const mockSecurityAlerts = [
  { TimeGenerated: '2024-01-15T08:00:00Z', AlertName: 'Suspicious sign-in activity', AlertSeverity: 'Medium', Description: 'Unusual sign-in detected' },
  { TimeGenerated: '2024-01-15T08:30:00Z', AlertName: 'Credential theft attempt detected', AlertSeverity: 'High', Description: 'Credential access attempt' },
  { TimeGenerated: '2024-01-15T09:00:00Z', AlertName: 'FLAG{kql_kung_fu_str1ng_n1nja} - Credential Alert', AlertSeverity: 'High', Description: 'Credential harvesting detected' },
  { TimeGenerated: '2024-01-15T09:30:00Z', AlertName: 'Malware detected', AlertSeverity: 'High', Description: 'Malicious file execution' },
  { TimeGenerated: '2024-01-15T10:00:00Z', AlertName: 'CREDENTIAL ACCESS detected', AlertSeverity: 'Medium', Description: 'Suspicious credential activity' },
];

const mockTables: Record<string, Array<Record<string, unknown>>> = {
  SigninLogs: mockSigninLogs,
  SecurityEvent: mockSecurityEvents,
  AzureActivity: mockAzureActivity,
  AzureNetworkAnalytics_CL: mockNetworkFlows,
  SecurityAlert: mockSecurityAlerts,
};

// Simple KQL parser for basic operations
export function executeQuery(query: string): QueryResult {
  const startTime = performance.now();

  try {
    const lines = query
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('//'));

    if (lines.length === 0) {
      return { columns: [], rows: [], rowCount: 0, executionTime: 0, error: 'Empty query' };
    }

    // Find the table name (first non-empty, non-comment line)
    const tableName = lines[0];
    let data = mockTables[tableName];

    if (!data) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTime: performance.now() - startTime,
        error: `Unknown table: ${tableName}. Available tables: ${Object.keys(mockTables).join(', ')}`,
      };
    }

    // Make a copy to avoid mutating original
    let results = [...data];

    // Process each operator
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.startsWith('|')) continue;

      const operation = line.substring(1).trim();

      // Handle 'where' operator
      if (operation.startsWith('where ')) {
        const condition = operation.substring(6).trim();
        results = applyWhere(results, condition);
      }
      // Handle 'project' operator
      else if (operation.startsWith('project ')) {
        const columns = operation.substring(8).split(',').map(c => c.trim());
        results = results.map(row => {
          const newRow: Record<string, unknown> = {};
          columns.forEach(col => {
            if (row[col] !== undefined) {
              newRow[col] = row[col];
            }
          });
          return newRow;
        });
      }
      // Handle 'count' operator
      else if (operation === 'count') {
        results = [{ Count: results.length }];
      }
      // Handle 'limit' or 'take' operator
      else if (operation.startsWith('limit ') || operation.startsWith('take ')) {
        const num = parseInt(operation.split(' ')[1], 10);
        results = results.slice(0, num);
      }
      // Handle 'order by' or 'sort by'
      else if (operation.startsWith('order by ') || operation.startsWith('sort by ')) {
        const parts = operation.replace('order by ', '').replace('sort by ', '').trim().split(' ');
        const column = parts[0];
        const desc = parts[1]?.toLowerCase() === 'desc';
        results.sort((a, b) => {
          const aVal = String(a[column] || '');
          const bVal = String(b[column] || '');
          return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        });
      }
      // Handle 'distinct'
      else if (operation.startsWith('distinct ')) {
        const column = operation.substring(9).trim();
        const seen = new Set<string>();
        results = results.filter(row => {
          const val = String(row[column] || '');
          if (seen.has(val)) return false;
          seen.add(val);
          return true;
        }).map(row => ({ [column]: row[column] }));
      }
      // Handle 'summarize'
      else if (operation.startsWith('summarize ')) {
        results = applySummarize(results, operation.substring(10).trim());
      }
    }

    const columns = results.length > 0 ? Object.keys(results[0]) : [];

    return {
      columns,
      rows: results,
      rowCount: results.length,
      executionTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTime: performance.now() - startTime,
      error: `Query execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

function applyWhere(data: Array<Record<string, unknown>>, condition: string): Array<Record<string, unknown>> {
  // Handle 'and' conditions
  if (condition.includes(' and ')) {
    const parts = condition.split(' and ');
    let result = data;
    for (const part of parts) {
      result = applyWhere(result, part.trim());
    }
    return result;
  }

  // Handle 'or' conditions
  if (condition.includes(' or ')) {
    const parts = condition.split(' or ');
    const results = new Set<Record<string, unknown>>();
    for (const part of parts) {
      applyWhere(data, part.trim()).forEach(r => results.add(r));
    }
    return Array.from(results);
  }

  // Handle 'contains' operator
  if (condition.includes(' contains ')) {
    const [field, value] = condition.split(' contains ').map(s => s.trim().replace(/"/g, ''));
    return data.filter(row => {
      const fieldValue = String(row[field] || '').toLowerCase();
      return fieldValue.includes(value.toLowerCase());
    });
  }

  // Handle '==' operator
  if (condition.includes(' == ')) {
    const [field, value] = condition.split(' == ').map(s => s.trim().replace(/"/g, ''));
    return data.filter(row => String(row[field]) === value);
  }

  // Handle '!=' operator
  if (condition.includes(' != ')) {
    const [field, value] = condition.split(' != ').map(s => s.trim().replace(/"/g, ''));
    return data.filter(row => String(row[field]) !== value);
  }

  // Handle '>=' operator
  if (condition.includes(' >= ')) {
    const [field, value] = condition.split(' >= ').map(s => s.trim());
    return data.filter(row => Number(row[field]) >= Number(value));
  }

  // Handle '<' operator
  if (condition.includes(' < ')) {
    const [field, value] = condition.split(' < ').map(s => s.trim());
    return data.filter(row => Number(row[field]) < Number(value));
  }

  // Handle 'in' operator
  if (condition.includes(' in ')) {
    const match = condition.match(/(\w+)\s+in\s*\(([^)]+)\)/);
    if (match) {
      const field = match[1];
      const values = match[2].split(',').map(v => v.trim().replace(/"/g, '').replace(/'/g, ''));
      return data.filter(row => values.includes(String(row[field])));
    }
  }

  // Handle hourofday function
  if (condition.includes('hourofday(')) {
    const match = condition.match(/hourofday\((\w+)\)\s*([><=!]+)\s*(\d+)/);
    if (match) {
      const field = match[1];
      const op = match[2];
      const value = parseInt(match[3], 10);
      return data.filter(row => {
        const date = new Date(String(row[field]));
        const hour = date.getUTCHours();
        if (op === '>=') return hour >= value;
        if (op === '<') return hour < value;
        if (op === '==') return hour === value;
        return false;
      });
    }
  }

  return data;
}

function applySummarize(data: Array<Record<string, unknown>>, expression: string): Array<Record<string, unknown>> {
  // Handle 'by' clause
  const byMatch = expression.match(/(.+)\s+by\s+(.+)/);

  if (byMatch) {
    const aggPart = byMatch[1].trim();
    const groupBy = byMatch[2].trim();

    // Group the data
    const groups = new Map<string, Array<Record<string, unknown>>>();
    for (const row of data) {
      const key = String(row[groupBy] || '');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }

    // Apply aggregation to each group
    const results: Array<Record<string, unknown>> = [];
    for (const [key, groupData] of groups) {
      const result: Record<string, unknown> = { [groupBy]: key };

      // Parse aggregations
      if (aggPart.includes('count()')) {
        const alias = aggPart.match(/(\w+)\s*=\s*count\(\)/) || ['', 'count_'];
        result[alias[1] || 'count_'] = groupData.length;
      }
      if (aggPart.includes('dcount(')) {
        const match = aggPart.match(/(\w+)\s*=\s*dcount\((\w+)\)/);
        if (match) {
          const uniqueValues = new Set(groupData.map(r => String(r[match[2]])));
          result[match[1]] = uniqueValues.size;
        }
      }

      results.push(result);
    }

    return results;
  }

  // Simple count without grouping
  if (expression.includes('count()')) {
    return [{ count_: data.length }];
  }

  return data;
}
