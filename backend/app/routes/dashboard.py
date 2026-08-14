from fastapi import APIRouter
from app.database import driver

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("")
def get_dashboard():
    query = """
    MATCH (ticket:Ticket)
    WITH count(ticket) AS totalTickets

    OPTIONAL MATCH (openTicket:Ticket {status: "Open"})
    WITH totalTickets, count(openTicket) AS openTickets

    OPTIONAL MATCH (resolvedTicket:Ticket {status: "Resolved"})
    WITH totalTickets, openTickets, count(resolvedTicket) AS resolvedTickets

    OPTIONAL MATCH (site:Site {status: "Offline"})
    WITH totalTickets, openTickets, resolvedTickets,
         count(site) AS offlineSites

    OPTIONAL MATCH (file:DataFile {generationStatus: "NOT_GENERATING"})
    WITH totalTickets, openTickets, resolvedTickets, offlineSites,
         count(file) AS filesNotGenerating

    OPTIONAL MATCH (issue:Issue)<-[:REPORTS]-(ticket2:Ticket)
    WITH totalTickets,
         openTickets,
         resolvedTickets,
         offlineSites,
         filesNotGenerating,
         issue,
         count(ticket2) AS issueCount
    ORDER BY issueCount DESC

    WITH totalTickets,
         openTickets,
         resolvedTickets,
         offlineSites,
         filesNotGenerating,
         collect({
             issue: issue.name,
             count: issueCount
         })[0..5] AS commonIssues

    RETURN
        totalTickets,
        openTickets,
        resolvedTickets,
        offlineSites,
        filesNotGenerating,
        commonIssues
    """

    with driver.session() as session:
        result = session.run(query)
        record = result.single()

        if not record:
            return {
                "totalTickets": 0,
                "openTickets": 0,
                "resolvedTickets": 0,
                "offlineSites": 0,
                "filesNotGenerating": 0,
                "commonIssues": []
            }

        return record.data()