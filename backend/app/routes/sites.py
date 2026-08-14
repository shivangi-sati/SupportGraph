from fastapi import APIRouter, HTTPException
from app.database import driver


router = APIRouter(prefix="/api/sites", tags=["Sites"])


# Get all sites
@router.get("")
def get_all_sites():
    query = """
    MATCH (site:Site)

    OPTIONAL MATCH (site)-[:HAS_EDGE_BOX]->(edge:EdgeBox)

    OPTIONAL MATCH (site)-[:HAS_APPLICATION]->(app:Application)

    OPTIONAL MATCH (site)-[:GENERATES_DATA_FILE]->(file:DataFile)

    RETURN
        site.id AS siteId,
        site.name AS site,
        site.location AS location,
        site.status AS status,
        edge.name AS edgeBox,
        edge.status AS edgeBoxStatus,
        app.name AS application,
        collect(DISTINCT {
            name: file.name,
            status: file.generationStatus
        }) AS dataFiles

    ORDER BY site.id
    """

    try:
        with driver.session() as session:
            result = session.run(query)

            return [dict(record) for record in result]

    except Exception as error:
        print(f"Database error: {error}")

        raise HTTPException(
            status_code=503,
            detail="Unable to connect to the support database"
        )


# Get one site
@router.get("/{site_id}")
def get_site(site_id: str):
    query = """
    MATCH (site:Site {id: $site_id})
    
    OPTIONAL MATCH (site)-[:HAS_EDGE_BOX]->(edge:EdgeBox)
    
    OPTIONAL MATCH (site)-[:HAS_APPLICATION]->(app:Application)
    
    OPTIONAL MATCH (site)-[:GENERATES_DATA_FILE]->(file:DataFile)
    
    OPTIONAL MATCH (file)-[:LOCATED_IN]->(environment:CustomerEnvironment)

    OPTIONAL MATCH (ticket:Ticket)-[:AFFECTS]->(site)
    OPTIONAL MATCH (ticket)-[:RESOLVED_BY]->(resolution:Resolution)

    RETURN
        site.id AS siteId,
        site.name AS site,
        site.location AS location,
        site.status AS status,
        edge.name AS edgeBox,
        edge.status AS edgeBoxStatus,
        app.name AS application,
        collect(DISTINCT {
            name: file.name,
            status: file.generationStatus
        }) AS dataFiles,
        environment.name AS customerEnvironment,
        collect(DISTINCT {
            ticketId: ticket.id,
            title: ticket.title,
            resolution: resolution.name
        }) AS previousTickets
    """

    try:
        with driver.session() as session:
            result = session.run(
                query,
                site_id=site_id
            )

            record = result.single()

            if not record:
                raise HTTPException(
                    status_code=404,
                    detail="Site not found"
                )

            return dict(record)

    except HTTPException:
        raise

    except Exception as error:
        print(f"Database error: {error}")

        raise HTTPException(
            status_code=503,
            detail="Unable to connect to the support database"
        )