from fastapi import APIRouter, HTTPException
from app.database import driver
from app import fallback


router = APIRouter(prefix="/api/tickets", tags=["Tickets"])

@router.get("")
def get_all_tickets():
    query = """
    MATCH (customer:Customer)-[:RAISED]->(ticket:Ticket)
    OPTIONAL MATCH (ticket)-[:AFFECTS]->(site:Site)
    OPTIONAL MATCH (ticket)-[:REPORTS]->(issue:Issue)
    OPTIONAL MATCH (ticket)-[:RESOLVED_BY]->(resolution:Resolution)

    RETURN
        ticket.id AS ticketId,
        ticket.title AS title,
        ticket.description AS description,
        ticket.priority AS priority,
        ticket.status AS status,
        customer.name AS customer,
        site.name AS site,
        issue.name AS issue,
        resolution.name AS resolution

    ORDER BY ticket.id
    """

    try:
        with driver.session() as session:
            result = session.run(query)

            return [dict(record) for record in result]

    except Exception as error:
        print(f"Database error: {error}. Serving built-in demo data.")
        return fallback.tickets()


@router.get("/{ticket_id}")
def get_ticket(ticket_id: str):
    query = """
    MATCH (customer:Customer)-[:RAISED]->(ticket:Ticket {id: $ticket_id})
    MATCH (ticket)-[:AFFECTS]->(site:Site)
    MATCH (ticket)-[:REPORTS]->(issue:Issue)
    MATCH (ticket)-[:HAS_INVESTIGATION_STEP]->(step:InvestigationStep)
    MATCH (ticket)-[:RESOLVED_BY]->(resolution:Resolution)
    OPTIONAL MATCH (resolution)-[:PERFORMED_BY]->(team:Team)

    RETURN
        ticket.id AS ticketId,
        ticket.title AS title,
        ticket.description AS description,
        ticket.priority AS priority,
        ticket.status AS status,
        customer.name AS customer,
        site.name AS site,
        issue.name AS issue,
        collect(DISTINCT step.name) AS investigationSteps,
        resolution.name AS resolution,
        team.name AS team
    """

    try:
        with driver.session() as session:
            result = session.run(
                query,
                ticket_id=ticket_id
            )

            record = result.single()

            if not record:
                raise HTTPException(
                    status_code=404,
                    detail="Ticket not found"
                )

            return dict(record)

    except HTTPException:
        raise

    except Exception as error:
        print(f"Database error: {error}. Serving built-in demo data.")
        result = fallback.ticket(ticket_id)

        if not result:
            raise HTTPException(
                status_code=404,
                detail="Ticket not found"
            )

        return result


@router.get("/{ticket_id}/similar")
def get_similar_tickets(ticket_id: str):
    query = """
    MATCH (current:Ticket {id: $ticket_id})
          -[:REPORTS]->(issue:Issue)
          <-[:REPORTS]-(similar:Ticket)
          -[:RESOLVED_BY]->(resolution:Resolution)

    WHERE similar.id <> current.id

    RETURN
        similar.id AS ticketId,
        similar.title AS title,
        issue.name AS issue,
        resolution.name AS resolution

    ORDER BY similar.id
    """

    try:
        with driver.session() as session:
            result = session.run(
                query,
                ticket_id=ticket_id
            )

            return [dict(record) for record in result]

    except Exception as error:
        print(f"Database error: {error}. Serving built-in demo data.")
        return fallback.similar_tickets(ticket_id)


@router.get("/{ticket_id}/investigation")
def get_ticket_investigation(ticket_id: str):
    query = """
    MATCH (customer:Customer)-[:RAISED]->(ticket:Ticket {id: $ticket_id})

    OPTIONAL MATCH (ticket)-[:AFFECTS]->(site:Site)

    OPTIONAL MATCH (site)-[:HAS_EDGE_BOX]->(edge:EdgeBox)

    OPTIONAL MATCH (site)-[:HAS_APPLICATION]->(app:Application)

    OPTIONAL MATCH (site)-[:GENERATES_DATA_FILE]->(file:DataFile)

    OPTIONAL MATCH (file)-[:LOCATED_IN]->(environment:CustomerEnvironment)

    OPTIONAL MATCH (ticket)-[:REPORTS]->(issue:Issue)

    OPTIONAL MATCH (ticket)-[:HAS_INVESTIGATION_STEP]->(step:InvestigationStep)

    OPTIONAL MATCH (ticket)-[:RESOLVED_BY]->(resolution:Resolution)
    OPTIONAL MATCH (resolution)-[:PERFORMED_BY]->(team:Team)

    OPTIONAL MATCH (ticket)-[:REPORTS]->(sharedIssue:Issue)
    OPTIONAL MATCH (similar:Ticket)-[:REPORTS]->(sharedIssue)
    WHERE similar IS NULL OR similar.id <> ticket.id

    OPTIONAL MATCH (similar)-[:RESOLVED_BY]->(similarResolution:Resolution)

    RETURN
        ticket.id AS ticketId,
        ticket.title AS title,
        ticket.description AS description,
        ticket.priority AS priority,
        ticket.status AS status,

        collect(DISTINCT customer.name)[0] AS customer,

        collect(DISTINCT {
            id: site.id,
            name: site.name,
            location: site.location,
            status: site.status
        })[0] AS site,

        collect(DISTINCT {
            name: edge.name,
            status: edge.status
        })[0] AS edgeBox,

        collect(DISTINCT {
            name: app.name,
            version: app.version,
            status: app.status
        })[0] AS application,

        collect(DISTINCT {
            name: file.name,
            status: file.generationStatus
        }) AS dataFiles,

        collect(DISTINCT environment.name)[0] AS customerEnvironment,

        collect(DISTINCT issue.name)[0] AS issue,

        collect(DISTINCT step.name) AS investigationSteps,

        collect(DISTINCT {
            name: resolution.name,
            description: resolution.description,
            team: team.name
        })[0] AS resolution,

        collect(DISTINCT {
            ticketId: similar.id,
            title: similar.title,
            resolution: similarResolution.name
        }) AS similarTickets
    """

    try:
        with driver.session() as session:
            result = session.run(
                query,
                ticket_id=ticket_id
            )

            record = result.single()

            if not record:
                return {
                    "error": "Ticket not found",
                    "ticketId": ticket_id
                }

            return record.data()

    except Exception as error:
        print(f"Database error: {error}. Serving built-in demo data.")
        result = fallback.investigation(ticket_id)

        if not result:
            return {
                "error": "Ticket not found",
                "ticketId": ticket_id
            }

        return result