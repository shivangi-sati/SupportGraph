from app.database import driver


def seed_database():
    query = """
    // ============================================================
    // CUSTOMERS
    // ============================================================

    MERGE (customer1:Customer {id: "CUS-001"})
    SET customer1.name = "NorthStar Energy"

    MERGE (customer2:Customer {id: "CUS-002"})
    SET customer2.name = "BluePeak Manufacturing"


    // ============================================================
    // SITES
    // ============================================================

    MERGE (site1:Site {id: "SITE-001"})
    SET site1.name = "NorthStar Delhi Plant",
        site1.location = "Delhi",
        site1.status = "Offline"

    MERGE (site2:Site {id: "SITE-002"})
    SET site2.name = "NorthStar Mumbai Plant",
        site2.location = "Mumbai",
        site2.status = "Online"

    MERGE (site3:Site {id: "SITE-003"})
    SET site3.name = "BluePeak Noida Plant",
        site3.location = "Noida",
        site3.status = "Offline"

    MERGE (site4:Site {id: "SITE-004"})
    SET site4.name = "BluePeak Gurgaon Plant",
        site4.location = "Gurgaon",
        site4.status = "Online"


    // ============================================================
    // EDGE BOXES
    // ============================================================

    MERGE (edge1:EdgeBox {id: "EDGE-001"})
    SET edge1.name = "Delhi Edge Box",
        edge1.status = "Offline"

    MERGE (edge2:EdgeBox {id: "EDGE-002"})
    SET edge2.name = "Mumbai Edge Box",
        edge2.status = "Online"

    MERGE (edge3:EdgeBox {id: "EDGE-003"})
    SET edge3.name = "Noida Edge Box",
        edge3.status = "Offline"

    MERGE (edge4:EdgeBox {id: "EDGE-004"})
    SET edge4.name = "Gurgaon Edge Box",
        edge4.status = "Online"


    // ============================================================
    // APPLICATIONS
    // ============================================================

    MERGE (app1:Application {id: "APP-001"})
    SET app1.name = "Site Monitor",
        app1.version = "3.4.1",
        app1.status = "Running"

    MERGE (app2:Application {id: "APP-002"})
    SET app2.name = "Operations Dashboard",
        app2.version = "2.8.0",
        app2.status = "Running"


    // ============================================================
    // CUSTOMER ENVIRONMENTS
    // ============================================================

    MERGE (env1:CustomerEnvironment {id: "ENV-001"})
    SET env1.name = "NorthStar Remote Environment",
        env1.accessMethod = "RDP"

    MERGE (env2:CustomerEnvironment {id: "ENV-002"})
    SET env2.name = "BluePeak Remote Environment",
        env2.accessMethod = "RDP"


    // ============================================================
    // DATA FILES
    // ============================================================

    MERGE (file1:DataFile {id: "FILE-001"})
    SET file1.name = "delhi_site_data.csv",
        file1.generationStatus = "NOT_GENERATING"

    MERGE (file2:DataFile {id: "FILE-002"})
    SET file2.name = "mumbai_site_data.csv",
        file2.generationStatus = "GENERATING"

    MERGE (file3:DataFile {id: "FILE-003"})
    SET file3.name = "noida_site_data.csv",
        file3.generationStatus = "GENERATING"

    MERGE (file4:DataFile {id: "FILE-004"})
    SET file4.name = "gurgaon_site_data.csv",
        file4.generationStatus = "GENERATING"


    // ============================================================
    // ISSUES
    // ============================================================

    MERGE (issue1:Issue {id: "ISSUE-001"})
    SET issue1.name = "Site Offline",
        issue1.category = "Connectivity"

    MERGE (issue2:Issue {id: "ISSUE-002"})
    SET issue2.name = "Data Not Displaying",
        issue2.category = "Data"

    MERGE (issue3:Issue {id: "ISSUE-003"})
    SET issue3.name = "Application Not Loading",
        issue3.category = "Application"


    // ============================================================
    // TEAMS
    // ============================================================

    MERGE (team1:Team {id: "TEAM-001"})
    SET team1.name = "Edge Operations"

    MERGE (team2:Team {id: "TEAM-002"})
    SET team2.name = "Data Operations"

    MERGE (team3:Team {id: "TEAM-003"})
    SET team3.name = "Application Support"


    // ============================================================
    // RESOLUTIONS
    // ============================================================

    MERGE (resolution1:Resolution {id: "RES-001"})
    SET resolution1.name = "Restart Edge Box",
        resolution1.description =
            "Restarted the affected edge box and verified site connectivity."

    MERGE (resolution2:Resolution {id: "RES-002"})
    SET resolution2.name = "Restore Data Generation",
        resolution2.description =
            "Restored the process responsible for generating site data files."

    MERGE (resolution3:Resolution {id: "RES-003"})
    SET resolution3.name = "Restart Application",
        resolution3.description =
            "Restarted the application and verified that the site loaded successfully."

    MERGE (resolution4:Resolution {id: "RES-004"})
    SET resolution4.name = "Application Investigation",
        resolution4.description =
            "Application-side investigation after confirming that data files were being generated."


    // ============================================================
    // INVESTIGATION STEPS
    // ============================================================

    MERGE (step1:InvestigationStep {id: "STEP-001"})
    SET step1.name = "Check Edge Box Status",
        step1.description =
            "Verify whether the edge box associated with the site is online."

    MERGE (step2:InvestigationStep {id: "STEP-002"})
    SET step2.name = "Connect to Customer Environment",
        step2.description =
            "Access the customer's remote environment through RDP."

    MERGE (step3:InvestigationStep {id: "STEP-003"})
    SET step3.name = "Check Data File Generation",
        step3.description =
            "Verify whether expected site data files are being generated."

    MERGE (step4:InvestigationStep {id: "STEP-004"})
    SET step4.name = "Check Application Status",
        step4.description =
            "Verify whether the affected application is available."


    // ============================================================
    // SITE RELATIONSHIPS
    // ============================================================

    MERGE (site1)-[:HAS_EDGE_BOX]->(edge1)
    MERGE (site2)-[:HAS_EDGE_BOX]->(edge2)
    MERGE (site3)-[:HAS_EDGE_BOX]->(edge3)
    MERGE (site4)-[:HAS_EDGE_BOX]->(edge4)

    MERGE (site1)-[:HAS_APPLICATION]->(app1)
    MERGE (site2)-[:HAS_APPLICATION]->(app1)
    MERGE (site3)-[:HAS_APPLICATION]->(app2)
    MERGE (site4)-[:HAS_APPLICATION]->(app2)


    // ============================================================
    // SITE → DATA FILE
    // ============================================================

    MERGE (site1)-[:GENERATES_DATA_FILE]->(file1)
    MERGE (site2)-[:GENERATES_DATA_FILE]->(file2)
    MERGE (site3)-[:GENERATES_DATA_FILE]->(file3)
    MERGE (site4)-[:GENERATES_DATA_FILE]->(file4)


    // ============================================================
    // DATA FILE → CUSTOMER ENVIRONMENT
    // ============================================================

    MERGE (file1)-[:LOCATED_IN]->(env1)
    MERGE (file2)-[:LOCATED_IN]->(env1)
    MERGE (file3)-[:LOCATED_IN]->(env2)
    MERGE (file4)-[:LOCATED_IN]->(env2)


    // ============================================================
    // TICKETS
    // ============================================================

    MERGE (ticket1:Ticket {id: "TKT-1001"})
    SET ticket1.title = "Site is offline",
        ticket1.description =
            "Customer reports that the Delhi site is offline.",
        ticket1.priority = "High",
        ticket1.status = "Resolved"

    MERGE (ticket2:Ticket {id: "TKT-1002"})
    SET ticket2.title = "Site data is not visible",
        ticket2.description =
            "Customer reports that data is not appearing in the application.",
        ticket2.priority = "Medium",
        ticket2.status = "Resolved"

    MERGE (ticket3:Ticket {id: "TKT-1003"})
    SET ticket3.title = "Latest site data is not showing",
        ticket3.description =
            "Customer reports that the application is not showing the latest site data.",
        ticket3.priority = "Medium",
        ticket3.status = "Resolved"

    MERGE (ticket4:Ticket {id: "TKT-1004"})
    SET ticket4.title = "Application is not loading",
        ticket4.description =
            "Customer reports that the monitoring application is unavailable.",
        ticket4.priority = "High",
        ticket4.status = "Resolved"

    MERGE (ticket5:Ticket {id: "TKT-1005"})
    SET ticket5.title = "Dashboard unavailable",
        ticket5.description =
            "Customer reports that the operations dashboard is not loading.",
        ticket5.priority = "High",
        ticket5.status = "Resolved"

    MERGE (ticket6:Ticket {id: "TKT-1006"})
    SET ticket6.title = "Edge Box offline",
        ticket6.description =
            "Customer reports that the Noida site is offline.",
        ticket6.priority = "High",
        ticket6.status = "Resolved"

    MERGE (ticket7:Ticket {id: "TKT-1007"})
    SET ticket7.title = "Data missing from dashboard",
        ticket7.description =
            "Customer reports missing site data in the dashboard.",
        ticket7.priority = "Medium",
        ticket7.status = "Resolved"


    // ============================================================
    // CUSTOMER → TICKET
    // ============================================================

    MERGE (customer1)-[:RAISED]->(ticket1)
    MERGE (customer1)-[:RAISED]->(ticket2)
    MERGE (customer1)-[:RAISED]->(ticket3)
    MERGE (customer1)-[:RAISED]->(ticket4)
    MERGE (customer1)-[:RAISED]->(ticket5)

    MERGE (customer2)-[:RAISED]->(ticket6)
    MERGE (customer2)-[:RAISED]->(ticket7)


    // ============================================================
    // TICKET → SITE
    // ============================================================

    MERGE (ticket1)-[:AFFECTS]->(site1)
    MERGE (ticket2)-[:AFFECTS]->(site2)
    MERGE (ticket3)-[:AFFECTS]->(site2)
    MERGE (ticket4)-[:AFFECTS]->(site1)
    MERGE (ticket5)-[:AFFECTS]->(site3)
    MERGE (ticket6)-[:AFFECTS]->(site3)
    MERGE (ticket7)-[:AFFECTS]->(site4)


    // ============================================================
    // TICKET → ISSUE
    // ============================================================

    MERGE (ticket1)-[:REPORTS]->(issue1)
    MERGE (ticket2)-[:REPORTS]->(issue2)
    MERGE (ticket3)-[:REPORTS]->(issue2)
    MERGE (ticket4)-[:REPORTS]->(issue3)
    MERGE (ticket5)-[:REPORTS]->(issue3)
    MERGE (ticket6)-[:REPORTS]->(issue1)
    MERGE (ticket7)-[:REPORTS]->(issue2)


    // ============================================================
    // TICKET → INVESTIGATION STEPS
    // ============================================================

    MERGE (ticket1)-[:HAS_INVESTIGATION_STEP]->(step1)
    MERGE (ticket6)-[:HAS_INVESTIGATION_STEP]->(step1)

    MERGE (ticket2)-[:HAS_INVESTIGATION_STEP]->(step2)
    MERGE (ticket2)-[:HAS_INVESTIGATION_STEP]->(step3)

    MERGE (ticket3)-[:HAS_INVESTIGATION_STEP]->(step2)
    MERGE (ticket3)-[:HAS_INVESTIGATION_STEP]->(step3)

    MERGE (ticket4)-[:HAS_INVESTIGATION_STEP]->(step4)
    MERGE (ticket5)-[:HAS_INVESTIGATION_STEP]->(step4)

    MERGE (ticket7)-[:HAS_INVESTIGATION_STEP]->(step2)
    MERGE (ticket7)-[:HAS_INVESTIGATION_STEP]->(step3)


    // ============================================================
    // TICKET → ACTUAL RESOLUTION
    // ============================================================

    MERGE (ticket1)-[:RESOLVED_BY]->(resolution1)
    MERGE (ticket2)-[:RESOLVED_BY]->(resolution2)
    MERGE (ticket3)-[:RESOLVED_BY]->(resolution4)
    MERGE (ticket4)-[:RESOLVED_BY]->(resolution3)
    MERGE (ticket5)-[:RESOLVED_BY]->(resolution3)
    MERGE (ticket6)-[:RESOLVED_BY]->(resolution1)
    MERGE (ticket7)-[:RESOLVED_BY]->(resolution4)


    // ============================================================
    // RESOLUTION → TEAM
    // ============================================================

    MERGE (resolution1)-[:PERFORMED_BY]->(team1)
    MERGE (resolution2)-[:PERFORMED_BY]->(team2)
    MERGE (resolution3)-[:PERFORMED_BY]->(team3)
    MERGE (resolution4)-[:PERFORMED_BY]->(team3)


    RETURN count(*) AS seed_completed
    """

    with driver.session() as session:
        result = session.run(query)
        record = result.single()

        print("Seed completed successfully!")
        print(record)


if __name__ == "__main__":
    seed_database()
    driver.close()