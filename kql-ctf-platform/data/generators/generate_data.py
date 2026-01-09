#!/usr/bin/env python3
"""
KQL Kung Fu CTF - Synthetic Data Generator

Generates realistic Azure log data with embedded flags for CTF challenges.
Each challenge gets its own dataset with hidden flags.

Usage:
    python generate_data.py --challenge hello-kql --output ./samples/
    python generate_data.py --all --output ./samples/
"""

import argparse
import json
import random
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

# Seed for reproducibility
random.seed(42)

# =============================================================================
# CONFIGURATION
# =============================================================================

COMPANY_DOMAIN = "yourcompany.com"
NORMAL_USERS = [
    f"user{i}@{COMPANY_DOMAIN}" for i in range(1, 51)
] + [
    f"alice.wong@{COMPANY_DOMAIN}",
    f"bob.chen@{COMPANY_DOMAIN}",
    f"carol.davis@{COMPANY_DOMAIN}",
    f"admin@{COMPANY_DOMAIN}",
]

SUSPICIOUS_USERS = [
    f"john.smith@{COMPANY_DOMAIN}",
    f"sarah.jones@{COMPANY_DOMAIN}",
    f"mike.wilson@{COMPANY_DOMAIN}",
]

APPS = [
    "Microsoft Office 365",
    "Azure Portal",
    "Microsoft Teams",
    "SharePoint Online",
    "Exchange Online",
    "Power BI",
    "Dynamics 365",
    "Azure DevOps",
]

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
]

LOCATIONS = ["US", "GB", "DE", "FR", "JP", "AU", "CA", "BR", "IN", "SG"]

INTERNAL_IPS = [f"10.0.{random.randint(1,254)}.{random.randint(1,254)}" for _ in range(100)]
EXTERNAL_IPS = [f"{random.randint(1,223)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}" for _ in range(100)]

# Result types for sign-in logs
RESULT_TYPES = {
    0: "Success",
    50126: "Invalid username or password",
    50053: "Account locked",
    50057: "User account disabled",
    50055: "Password expired",
    53003: "Blocked by Conditional Access",
}

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def random_timestamp(days_back: int = 7) -> str:
    """Generate a random timestamp within the last N days."""
    now = datetime.utcnow()
    delta = timedelta(
        days=random.randint(0, days_back),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
        seconds=random.randint(0, 59),
    )
    return (now - delta).isoformat() + "Z"


def random_timestamp_night() -> str:
    """Generate a timestamp between midnight and 4 AM."""
    now = datetime.utcnow()
    day_offset = random.randint(0, 7)
    return (now - timedelta(days=day_offset)).replace(
        hour=random.randint(0, 3),
        minute=random.randint(0, 59),
        second=random.randint(0, 59),
    ).isoformat() + "Z"


def generate_correlation_id() -> str:
    """Generate a GUID for correlation."""
    return str(uuid.uuid4())


# =============================================================================
# DATA GENERATORS BY TABLE
# =============================================================================

def generate_signin_log(
    user: str = None,
    result_type: int = 0,
    ip: str = None,
    timestamp: str = None,
    user_agent: str = None,
    app: str = None,
) -> dict[str, Any]:
    """Generate a single SigninLogs record."""
    return {
        "TimeGenerated": timestamp or random_timestamp(),
        "UserPrincipalName": user or random.choice(NORMAL_USERS),
        "UserDisplayName": (user or "").split("@")[0].replace(".", " ").title(),
        "IPAddress": ip or random.choice(EXTERNAL_IPS),
        "Location": random.choice(LOCATIONS),
        "ResultType": result_type,
        "ResultDescription": RESULT_TYPES.get(result_type, "Unknown"),
        "ClientAppUsed": "Browser",
        "UserAgent": user_agent or random.choice(USER_AGENTS),
        "AppDisplayName": app or random.choice(APPS),
        "ResourceDisplayName": "Microsoft Graph",
        "ConditionalAccessStatus": "success" if result_type == 0 else "failure",
        "RiskLevelDuringSignIn": "none",
        "CorrelationId": generate_correlation_id(),
    }


def generate_security_event(
    event_id: int = 4624,
    activity: str = None,
    computer: str = None,
    account: str = None,
) -> dict[str, Any]:
    """Generate a single SecurityEvent record."""
    return {
        "TimeGenerated": random_timestamp(),
        "EventID": event_id,
        "Activity": activity or f"{event_id} - Security Event",
        "Computer": computer or f"SERVER{random.randint(1, 10):02d}.{COMPANY_DOMAIN}",
        "Account": account or random.choice(NORMAL_USERS).split("@")[0],
        "AccountType": "User",
        "TargetAccount": random.choice(NORMAL_USERS).split("@")[0],
        "LogonType": 10,
        "LogonTypeName": "RemoteInteractive",
        "IpAddress": random.choice(INTERNAL_IPS),
        "WorkstationName": f"WS{random.randint(100, 999)}",
        "Process": "svchost.exe",
    }


def generate_azure_activity(
    operation: str = None,
    caller: str = None,
    resource: str = None,
) -> dict[str, Any]:
    """Generate a single AzureActivity record."""
    operations = [
        "Microsoft.Compute/virtualMachines/start/action",
        "Microsoft.Compute/virtualMachines/deallocate/action",
        "Microsoft.Storage/storageAccounts/write",
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Resources/deployments/write",
        "Microsoft.KeyVault/vaults/secrets/read",
    ]
    return {
        "TimeGenerated": random_timestamp(),
        "OperationName": operation or random.choice(operations),
        "CategoryValue": "Administrative",
        "Caller": caller or random.choice(NORMAL_USERS),
        "CallerIpAddress": random.choice(EXTERNAL_IPS),
        "ResourceGroup": f"rg-{random.choice(['prod', 'dev', 'test'])}-{random.randint(1, 5):02d}",
        "Resource": resource or f"resource-{random.randint(1, 100):03d}",
        "ResourceProvider": "Microsoft.Compute",
        "SubscriptionId": str(uuid.uuid4()),
        "ActivityStatus": "Succeeded",
        "Level": "Information",
    }


def generate_nsg_flow(
    src_ip: str = None,
    dest_ip: str = None,
    dest_port: int = None,
    status: str = "A",
    direction: str = "I",
) -> dict[str, Any]:
    """Generate a single AzureNetworkAnalytics_CL record."""
    return {
        "TimeGenerated": random_timestamp(),
        "FlowStartTime_t": random_timestamp(),
        "SrcIP_s": src_ip or random.choice(EXTERNAL_IPS),
        "DestIP_s": dest_ip or random.choice(INTERNAL_IPS),
        "SrcPort_d": random.randint(1024, 65535),
        "DestPort_d": dest_port or random.choice([22, 80, 443, 3389, 8080]),
        "Protocol_s": random.choice(["T", "U"]),
        "FlowDirection_s": direction,
        "FlowStatus_s": status,
        "NSGName_s": f"nsg-{random.choice(['web', 'app', 'db'])}-tier",
        "NSGRuleName_s": "DefaultRule_AllowInternetOutbound" if status == "A" else "DefaultRule_DenyAllInbound",
        "InboundBytes_d": random.randint(100, 10000),
        "OutboundBytes_d": random.randint(100, 10000),
        "Region_s": "eastus",
    }


def generate_security_alert(
    alert_name: str = None,
    severity: str = None,
) -> dict[str, Any]:
    """Generate a single SecurityAlert record."""
    alert_types = [
        ("Suspicious sign-in activity", "Medium"),
        ("Credential theft attempt detected", "High"),
        ("Brute force attack", "High"),
        ("Impossible travel", "Medium"),
        ("Anonymous IP address", "Low"),
        ("Unfamiliar sign-in properties", "Medium"),
    ]
    name, sev = random.choice(alert_types)
    return {
        "TimeGenerated": random_timestamp(),
        "AlertName": alert_name or name,
        "AlertSeverity": severity or sev,
        "Description": f"Detection of {name.lower()} in your environment",
        "ProviderName": "Azure Sentinel",
        "VendorName": "Microsoft",
        "Status": "New",
        "Tactics": "CredentialAccess",
        "Techniques": "T1110",
        "CompromisedEntity": random.choice(NORMAL_USERS),
        "ConfidenceLevel": random.choice(["Low", "Medium", "High"]),
    }


# =============================================================================
# CHALLENGE-SPECIFIC DATA GENERATORS
# =============================================================================

def generate_hello_kql_data(num_records: int = 1000) -> dict[str, list]:
    """Generate data for the 'Hello KQL' challenge."""
    events = []

    # Normal events
    for _ in range(num_records - 1):
        events.append(generate_security_event())

    # Hidden flag event
    events.append(generate_security_event(
        event_id=9999,
        activity="FLAG{kql_kung_fu_first_steps}",
    ))

    random.shuffle(events)
    return {"SecurityEvent": events}


def generate_counting_101_data() -> dict[str, list]:
    """Generate data for 'Counting 101' - exactly 1337 records."""
    logs = [generate_signin_log() for _ in range(1337)]
    return {"SigninLogs": logs}


def generate_project_basics_data(num_records: int = 500) -> dict[str, list]:
    """Generate data for 'Project Basics' challenge."""
    logs = []

    for _ in range(num_records - 1):
        logs.append(generate_signin_log())

    # Add the flag user
    logs.append(generate_signin_log(
        user="FLAG{kql_kung_fu_proj3ct_m4st3r}@yourcompany.com",
    ))

    random.shuffle(logs)
    return {"SigninLogs": logs}


def generate_limit_yourself_data(num_records: int = 2000) -> dict[str, list]:
    """Generate data for 'Know Your Limits' challenge."""
    flows = []

    for _ in range(num_records - 1):
        flows.append(generate_nsg_flow())

    # Add the flag - most recent denied inbound flow
    flag_flow = generate_nsg_flow(
        dest_ip="10.13.37.100",
        status="D",
        direction="I",
    )
    # Make it the most recent
    flag_flow["TimeGenerated"] = datetime.utcnow().isoformat() + "Z"
    flows.append(flag_flow)

    return {"AzureNetworkAnalytics_CL": flows}


def generate_distinct_possibilities_data(num_records: int = 5000) -> dict[str, list]:
    """Generate data for 'Distinct Possibilities' challenge."""
    logs = []
    users = NORMAL_USERS + ["FLAG{kql_kung_fu_unique_find}@yourcompany.com"]

    for _ in range(num_records):
        logs.append(generate_signin_log(user=random.choice(users)))

    return {"SigninLogs": logs}


def generate_brute_force_data(num_records: int = 10000) -> dict[str, list]:
    """Generate data for 'Brute Force 101' challenge."""
    logs = []
    target_user = "admin@yourcompany.com"
    attacker_ua = "Mozilla/5.0 FLAG{kql_kung_fu_brut3_f0rc3_d3t3ct3d} BruteForcer/1.0"
    attacker_ip = "185.234.72.100"

    # Normal traffic
    for _ in range(num_records - 500):
        result = random.choices([0, 50126], weights=[95, 5])[0]
        logs.append(generate_signin_log(result_type=result))

    # Brute force attack on admin
    for _ in range(500):
        logs.append(generate_signin_log(
            user=target_user,
            result_type=50126,
            ip=attacker_ip,
            user_agent=attacker_ua,
        ))

    random.shuffle(logs)
    return {"SigninLogs": logs}


def generate_time_traveler_data(num_records: int = 3000) -> dict[str, list]:
    """Generate data for 'Time Traveler' challenge."""
    logs = []

    # Normal daytime traffic
    for _ in range(num_records - 50):
        logs.append(generate_signin_log())

    # Late night activity
    for _ in range(49):
        log = generate_signin_log()
        log["TimeGenerated"] = random_timestamp_night()
        logs.append(log)

    # The flag - late night with suspicious app
    flag_log = generate_signin_log(app="FLAG{kql_kung_fu_midnight_hacker}")
    flag_log["TimeGenerated"] = random_timestamp_night()
    logs.append(flag_log)

    random.shuffle(logs)
    return {"SigninLogs": logs}


def generate_string_theory_data(num_records: int = 500) -> dict[str, list]:
    """Generate data for 'String Theory' challenge."""
    alerts = []

    credential_alerts = [
        "Credential theft attempt",
        "CREDENTIAL ACCESS detected",
        "Suspicious credential activity",
        "credential harvesting tool",
    ]

    other_alerts = [
        "Malware detected",
        "Suspicious process execution",
        "Lateral movement detected",
        "Data exfiltration attempt",
    ]

    for _ in range(num_records - 1):
        alert_name = random.choice(credential_alerts + other_alerts)
        alerts.append(generate_security_alert(alert_name=alert_name))

    # Flag alert
    alerts.append(generate_security_alert(
        alert_name="FLAG{kql_kung_fu_str1ng_n1nja} - Credential Alert"
    ))

    random.shuffle(alerts)
    return {"SecurityAlert": alerts}


def generate_port_scanner_data(num_records: int = 50000) -> dict[str, list]:
    """Generate data for 'Port Scanner' challenge."""
    flows = []
    scanner_ip = "192.168.100.50"

    # Normal traffic
    for _ in range(num_records - 443):
        flows.append(generate_nsg_flow())

    # Port scan - 443 unique ports (the flag!)
    for port in range(1, 444):
        flows.append(generate_nsg_flow(
            src_ip=scanner_ip,
            dest_port=port,
            status="D",
        ))

    random.shuffle(flows)
    return {"AzureNetworkAnalytics_CL": flows}


def generate_insider_data(num_records: int = 5000) -> dict[str, list]:
    """Generate data for 'The Insider' challenge."""
    activities = []

    # Normal activity from various users
    for _ in range(num_records - 50):
        activities.append(generate_azure_activity())

    # Suspicious users' normal activity
    for user in SUSPICIOUS_USERS:
        for _ in range(15):
            activities.append(generate_azure_activity(caller=user))

    # The flag - one insider doing something suspicious
    activities.append(generate_azure_activity(
        caller=SUSPICIOUS_USERS[1],  # sarah.jones
        operation="FLAG{kql_kung_fu_1ns1d3r_f0und}",
    ))

    random.shuffle(activities)
    return {"AzureActivity": activities}


# =============================================================================
# MAIN GENERATOR
# =============================================================================

CHALLENGE_GENERATORS = {
    "hello-kql": generate_hello_kql_data,
    "counting-101": generate_counting_101_data,
    "project-basics": generate_project_basics_data,
    "limit-yourself": generate_limit_yourself_data,
    "distinct-possibilities": generate_distinct_possibilities_data,
    "brute-force-101": generate_brute_force_data,
    "time-traveler": generate_time_traveler_data,
    "string-theory": generate_string_theory_data,
    "port-scanner": generate_port_scanner_data,
    "the-insider": generate_insider_data,
}


def save_data(data: dict[str, list], output_dir: Path, challenge_id: str) -> None:
    """Save generated data to JSON files."""
    challenge_dir = output_dir / challenge_id
    challenge_dir.mkdir(parents=True, exist_ok=True)

    for table_name, records in data.items():
        output_file = challenge_dir / f"{table_name}.json"
        with open(output_file, "w") as f:
            json.dump(records, f, indent=2)
        print(f"  Generated {len(records):,} records -> {output_file}")


def main():
    parser = argparse.ArgumentParser(description="Generate CTF challenge data")
    parser.add_argument("--challenge", "-c", help="Challenge ID to generate")
    parser.add_argument("--all", "-a", action="store_true", help="Generate all challenges")
    parser.add_argument("--output", "-o", default="./samples", help="Output directory")
    parser.add_argument("--list", "-l", action="store_true", help="List available challenges")
    args = parser.parse_args()

    if args.list:
        print("Available challenges:")
        for cid in CHALLENGE_GENERATORS:
            print(f"  - {cid}")
        return

    output_dir = Path(args.output)

    if args.all:
        print(f"Generating data for all {len(CHALLENGE_GENERATORS)} challenges...")
        for challenge_id, generator in CHALLENGE_GENERATORS.items():
            print(f"\n[{challenge_id}]")
            data = generator()
            save_data(data, output_dir, challenge_id)
    elif args.challenge:
        if args.challenge not in CHALLENGE_GENERATORS:
            print(f"Unknown challenge: {args.challenge}")
            print("Use --list to see available challenges")
            return
        print(f"Generating data for: {args.challenge}")
        data = CHALLENGE_GENERATORS[args.challenge]()
        save_data(data, output_dir, args.challenge)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
