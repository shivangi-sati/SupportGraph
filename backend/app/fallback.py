"""Built-in sample data used when CognoDB is unreachable.

The records mirror backend/seed.py, so the public demo still shows the same
domain model and relationship traversals when the hosted graph database is
asleep or its credentials have expired. Real database results always win;
this data is only served after a connection/query failure.
"""


RESOLUTIONS = {
    "Restart Edge Box": {
        "name": "Restart Edge Box",
        "description": "Restarted the affected edge box and verified site connectivity.",
        "team": "Edge Operations",
    },
    "Restore Data Generation": {
        "name": "Restore Data Generation",
        "description": "Restored the process responsible for generating site data files.",
        "team": "Data Operations",
    },
    "Restart Application": {
        "name": "Restart Application",
        "description": "Restarted the application and verified that the site loaded successfully.",
        "team": "Application Support",
    },
    "Application Investigation": {
        "name": "Application Investigation",
        "description": "Application-side investigation after confirming that data files were being generated.",
        "team": "Application Support",
    },
}

SITES = [
    {
        "siteId": "SITE-001",
        "site": "NorthStar Delhi Plant",
        "location": "Delhi",
        "status": "Offline",
        "edgeBox": "Delhi Edge Box",
        "edgeBoxStatus": "Offline",
        "application": "Site Monitor",
        "applicationVersion": "3.4.1",
        "applicationStatus": "Running",
        "dataFiles": [
            {"name": "delhi_site_data.csv", "status": "NOT_GENERATING"}
        ],
        "customerEnvironment": "NorthStar Remote Environment",
    },
    {
        "siteId": "SITE-002",
        "site": "NorthStar Mumbai Plant",
        "location": "Mumbai",
        "status": "Online",
        "edgeBox": "Mumbai Edge Box",
        "edgeBoxStatus": "Online",
        "application": "Site Monitor",
        "applicationVersion": "3.4.1",
        "applicationStatus": "Running",
        "dataFiles": [
            {"name": "mumbai_site_data.csv", "status": "GENERATING"}
        ],
        "customerEnvironment": "NorthStar Remote Environment",
    },
    {
        "siteId": "SITE-003",
        "site": "BluePeak Noida Plant",
        "location": "Noida",
        "status": "Offline",
        "edgeBox": "Noida Edge Box",
        "edgeBoxStatus": "Offline",
        "application": "Operations Dashboard",
        "applicationVersion": "2.8.0",
        "applicationStatus": "Running",
        "dataFiles": [
            {"name": "noida_site_data.csv", "status": "GENERATING"}
        ],
        "customerEnvironment": "BluePeak Remote Environment",
    },
    {
        "siteId": "SITE-004",
        "site": "BluePeak Gurgaon Plant",
        "location": "Gurgaon",
        "status": "Online",
        "edgeBox": "Gurgaon Edge Box",
        "edgeBoxStatus": "Online",
        "application": "Operations Dashboard",
        "applicationVersion": "2.8.0",
        "applicationStatus": "Running",
        "dataFiles": [
            {"name": "gurgaon_site_data.csv", "status": "GENERATING"}
        ],
        "customerEnvironment": "BluePeak Remote Environment",
    },
]

TICKETS = [
    {
        "ticketId": "TKT-1001",
        "title": "Site is offline",
        "description": "Customer reports that the Delhi site is offline.",
        "priority": "High",
        "status": "Resolved",
        "customer": "NorthStar Energy",
        "site": "NorthStar Delhi Plant",
        "issue": "Site Offline",
        "resolution": "Restart Edge Box",
    },
    {
        "ticketId": "TKT-1002",
        "title": "Site data is not visible",
        "description": "Customer reports that data is not appearing in the application.",
        "priority": "Medium",
        "status": "Resolved",
        "customer": "NorthStar Energy",
        "site": "NorthStar Mumbai Plant",
        "issue": "Data Not Displaying",
        "resolution": "Restore Data Generation",
    },
    {
        "ticketId": "TKT-1003",
        "title": "Latest site data is not showing",
        "description": "Customer reports that the application is not showing the latest site data.",
        "priority": "Medium",
        "status": "Resolved",
        "customer": "NorthStar Energy",
        "site": "NorthStar Mumbai Plant",
        "issue": "Data Not Displaying",
        "resolution": "Application Investigation",
    },
    {
        "ticketId": "TKT-1004",
        "title": "Application is not loading",
        "description": "Customer reports that the monitoring application is unavailable.",
        "priority": "High",
        "status": "Resolved",
        "customer": "NorthStar Energy",
        "site": "NorthStar Delhi Plant",
        "issue": "Application Not Loading",
        "resolution": "Restart Application",
    },
    {
        "ticketId": "TKT-1005",
        "title": "Dashboard unavailable",
        "description": "Customer reports that the operations dashboard is not loading.",
        "priority": "High",
        "status": "Resolved",
        "customer": "NorthStar Energy",
        "site": "BluePeak Noida Plant",
        "issue": "Application Not Loading",
        "resolution": "Restart Application",
    },
    {
        "ticketId": "TKT-1006",
        "title": "Edge Box offline",
        "description": "Customer reports that the Noida site is offline.",
        "priority": "High",
        "status": "Resolved",
        "customer": "BluePeak Manufacturing",
        "site": "BluePeak Noida Plant",
        "issue": "Site Offline",
        "resolution": "Restart Edge Box",
    },
    {
        "ticketId": "TKT-1007",
        "title": "Data missing from dashboard",
        "description": "Customer reports missing site data in the dashboard.",
        "priority": "Medium",
        "status": "Resolved",
        "customer": "BluePeak Manufacturing",
        "site": "BluePeak Gurgaon Plant",
        "issue": "Data Not Displaying",
        "resolution": "Application Investigation",
    },
]

STEPS = {
    "TKT-1001": ["Check Edge Box Status"],
    "TKT-1002": ["Connect to Customer Environment", "Check Data File Generation"],
    "TKT-1003": ["Connect to Customer Environment", "Check Data File Generation"],
    "TKT-1004": ["Check Application Status"],
    "TKT-1005": ["Check Application Status"],
    "TKT-1006": ["Check Edge Box Status"],
    "TKT-1007": ["Connect to Customer Environment", "Check Data File Generation"],
}


def _find_ticket(ticket_id):
    return next(
        (t for t in TICKETS if t["ticketId"] == ticket_id),
        None,
    )


def _find_site(ticket):
    return next(
        (s for s in SITES if s["site"] == ticket["site"]),
        None,
    )


def dashboard():
    issue_counts = {}
    for ticket in TICKETS:
        issue_counts[ticket["issue"]] = issue_counts.get(ticket["issue"], 0) + 1

    common_issues = [
        {"issue": issue, "count": count}
        for issue, count in sorted(
            issue_counts.items(),
            key=lambda item: (-item[1], item[0]),
        )[:5]
    ]

    return {
        "totalTickets": len(TICKETS),
        "openTickets": sum(1 for t in TICKETS if t["status"] == "Open"),
        "resolvedTickets": sum(1 for t in TICKETS if t["status"] == "Resolved"),
        "offlineSites": sum(1 for s in SITES if s["status"] == "Offline"),
        "filesNotGenerating": sum(
            1
            for s in SITES
            for file in s["dataFiles"]
            if file["status"] == "NOT_GENERATING"
        ),
        "commonIssues": common_issues,
    }


def tickets():
    return [dict(ticket) for ticket in TICKETS]


def ticket(ticket_id):
    found = _find_ticket(ticket_id)
    if not found:
        return None

    return {
        **found,
        "investigationSteps": STEPS.get(ticket_id, []),
        "team": RESOLUTIONS[found["resolution"]]["team"],
    }


def similar_tickets(ticket_id):
    found = _find_ticket(ticket_id)
    if not found:
        return []

    return [
        {
            "ticketId": other["ticketId"],
            "title": other["title"],
            "issue": other["issue"],
            "resolution": other["resolution"],
        }
        for other in TICKETS
        if other["ticketId"] != ticket_id
        and other["issue"] == found["issue"]
    ]


def investigation(ticket_id):
    found = _find_ticket(ticket_id)
    if not found:
        return None

    site = _find_site(found)

    return {
        **found,
        "site": {
            "id": site["siteId"],
            "name": site["site"],
            "location": site["location"],
            "status": site["status"],
        },
        "edgeBox": {
            "name": site["edgeBox"],
            "status": site["edgeBoxStatus"],
        },
        "application": {
            "name": site["application"],
            "version": site["applicationVersion"],
            "status": site["applicationStatus"],
        },
        "dataFiles": site["dataFiles"],
        "customerEnvironment": site["customerEnvironment"],
        "investigationSteps": STEPS.get(ticket_id, []),
        "resolution": RESOLUTIONS[found["resolution"]],
        "similarTickets": similar_tickets(ticket_id),
    }


def sites():
    return [dict(site) for site in SITES]


def site(site_id):
    found = next((s for s in SITES if s["siteId"] == site_id), None)
    if not found:
        return None

    return {
        **found,
        "previousTickets": [
            {
                "ticketId": ticket["ticketId"],
                "title": ticket["title"],
                "resolution": ticket["resolution"],
            }
            for ticket in TICKETS
            if ticket["site"] == found["site"]
        ],
    }
