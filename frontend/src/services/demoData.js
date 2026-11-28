/** Bundled copy of backend/app/fallback.py for cold-start resilience.
 *
 * This is only served when the hosted API cannot be reached after retries.
 * The UI labels it as sample data so it is never presented as a live result.
 */

const RESOLUTIONS = {
  "Restart Edge Box": {
    name: "Restart Edge Box",
    description: "Restarted the affected edge box and verified site connectivity.",
    team: "Edge Operations",
  },
  "Restore Data Generation": {
    name: "Restore Data Generation",
    description: "Restored the process responsible for generating site data files.",
    team: "Data Operations",
  },
  "Restart Application": {
    name: "Restart Application",
    description: "Restarted the application and verified that the site loaded successfully.",
    team: "Application Support",
  },
  "Application Investigation": {
    name: "Application Investigation",
    description: "Application-side investigation after confirming that data files were being generated.",
    team: "Application Support",
  },
};

const SITES = [
  {
    siteId: "SITE-001",
    site: "NorthStar Delhi Plant",
    location: "Delhi",
    status: "Offline",
    edgeBox: "Delhi Edge Box",
    edgeBoxStatus: "Offline",
    application: "Site Monitor",
    applicationVersion: "3.4.1",
    applicationStatus: "Running",
    dataFiles: [{ name: "delhi_site_data.csv", status: "NOT_GENERATING" }],
    customerEnvironment: "NorthStar Remote Environment",
  },
  {
    siteId: "SITE-002",
    site: "NorthStar Mumbai Plant",
    location: "Mumbai",
    status: "Online",
    edgeBox: "Mumbai Edge Box",
    edgeBoxStatus: "Online",
    application: "Site Monitor",
    applicationVersion: "3.4.1",
    applicationStatus: "Running",
    dataFiles: [{ name: "mumbai_site_data.csv", status: "GENERATING" }],
    customerEnvironment: "NorthStar Remote Environment",
  },
  {
    siteId: "SITE-003",
    site: "BluePeak Noida Plant",
    location: "Noida",
    status: "Offline",
    edgeBox: "Noida Edge Box",
    edgeBoxStatus: "Offline",
    application: "Operations Dashboard",
    applicationVersion: "2.8.0",
    applicationStatus: "Running",
    dataFiles: [{ name: "noida_site_data.csv", status: "GENERATING" }],
    customerEnvironment: "BluePeak Remote Environment",
  },
  {
    siteId: "SITE-004",
    site: "BluePeak Gurgaon Plant",
    location: "Gurgaon",
    status: "Online",
    edgeBox: "Gurgaon Edge Box",
    edgeBoxStatus: "Online",
    application: "Operations Dashboard",
    applicationVersion: "2.8.0",
    applicationStatus: "Running",
    dataFiles: [{ name: "gurgaon_site_data.csv", status: "GENERATING" }],
    customerEnvironment: "BluePeak Remote Environment",
  },
];

const TICKETS = [
  {
    ticketId: "TKT-1001",
    title: "Site is offline",
    description: "Customer reports that the Delhi site is offline.",
    priority: "High",
    status: "Resolved",
    customer: "NorthStar Energy",
    site: "NorthStar Delhi Plant",
    issue: "Site Offline",
    resolution: "Restart Edge Box",
  },
  {
    ticketId: "TKT-1002",
    title: "Site data is not visible",
    description: "Customer reports that data is not appearing in the application.",
    priority: "Medium",
    status: "Resolved",
    customer: "NorthStar Energy",
    site: "NorthStar Mumbai Plant",
    issue: "Data Not Displaying",
    resolution: "Restore Data Generation",
  },
  {
    ticketId: "TKT-1003",
    title: "Latest site data is not showing",
    description: "Customer reports that the application is not showing the latest site data.",
    priority: "Medium",
    status: "Resolved",
    customer: "NorthStar Energy",
    site: "NorthStar Mumbai Plant",
    issue: "Data Not Displaying",
    resolution: "Application Investigation",
  },
  {
    ticketId: "TKT-1004",
    title: "Application is not loading",
    description: "Customer reports that the monitoring application is unavailable.",
    priority: "High",
    status: "Resolved",
    customer: "NorthStar Energy",
    site: "NorthStar Delhi Plant",
    issue: "Application Not Loading",
    resolution: "Restart Application",
  },
  {
    ticketId: "TKT-1005",
    title: "Dashboard unavailable",
    description: "Customer reports that the operations dashboard is not loading.",
    priority: "High",
    status: "Resolved",
    customer: "NorthStar Energy",
    site: "BluePeak Noida Plant",
    issue: "Application Not Loading",
    resolution: "Restart Application",
  },
  {
    ticketId: "TKT-1006",
    title: "Edge Box offline",
    description: "Customer reports that the Noida site is offline.",
    priority: "High",
    status: "Resolved",
    customer: "BluePeak Manufacturing",
    site: "BluePeak Noida Plant",
    issue: "Site Offline",
    resolution: "Restart Edge Box",
  },
  {
    ticketId: "TKT-1007",
    title: "Data missing from dashboard",
    description: "Customer reports missing site data in the dashboard.",
    priority: "Medium",
    status: "Resolved",
    customer: "BluePeak Manufacturing",
    site: "BluePeak Gurgaon Plant",
    issue: "Data Not Displaying",
    resolution: "Application Investigation",
  },
];

const STEPS = {
  "TKT-1001": ["Check Edge Box Status"],
  "TKT-1002": ["Connect to Customer Environment", "Check Data File Generation"],
  "TKT-1003": ["Connect to Customer Environment", "Check Data File Generation"],
  "TKT-1004": ["Check Application Status"],
  "TKT-1005": ["Check Application Status"],
  "TKT-1006": ["Check Edge Box Status"],
  "TKT-1007": ["Connect to Customer Environment", "Check Data File Generation"],
};

const findTicket = (ticketId) =>
  TICKETS.find((ticket) => ticket.ticketId === ticketId);

const findSite = (ticket) =>
  SITES.find((site) => site.site === ticket.site);

const similarTickets = (ticketId) => {
  const found = findTicket(ticketId);

  if (!found) {
    return [];
  }

  return TICKETS.filter(
    (ticket) =>
      ticket.ticketId !== ticketId && ticket.issue === found.issue
  ).map((ticket) => ({
    ticketId: ticket.ticketId,
    title: ticket.title,
    issue: ticket.issue,
    resolution: ticket.resolution,
  }));
};

export const demoDashboard = () => {
  const issueCounts = TICKETS.reduce((counts, ticket) => {
    counts[ticket.issue] = (counts[ticket.issue] || 0) + 1;
    return counts;
  }, {});

  return {
    totalTickets: TICKETS.length,
    openTickets: TICKETS.filter((ticket) => ticket.status === "Open").length,
    resolvedTickets: TICKETS.filter((ticket) => ticket.status === "Resolved").length,
    offlineSites: SITES.filter((site) => site.status === "Offline").length,
    filesNotGenerating: SITES.reduce(
      (count, site) =>
        count +
        site.dataFiles.filter((file) => file.status === "NOT_GENERATING").length,
      0
    ),
    commonIssues: Object.entries(issueCounts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([issue, count]) => ({ issue, count })),
  };
};

export const demoTickets = () => TICKETS.map((ticket) => ({ ...ticket }));

export const demoTicket = (ticketId) => {
  const found = findTicket(ticketId);

  if (!found) {
    return null;
  }

  return {
    ...found,
    investigationSteps: STEPS[ticketId] || [],
    team: RESOLUTIONS[found.resolution]?.team || "",
  };
};

export const demoInvestigation = (ticketId) => {
  const found = findTicket(ticketId);

  if (!found) {
    return null;
  }

  const site = findSite(found);

  return {
    ...found,
    site: {
      id: site.siteId,
      name: site.site,
      location: site.location,
      status: site.status,
    },
    edgeBox: { name: site.edgeBox, status: site.edgeBoxStatus },
    application: {
      name: site.application,
      version: site.applicationVersion,
      status: site.applicationStatus,
    },
    dataFiles: site.dataFiles.map((file) => ({ ...file })),
    customerEnvironment: site.customerEnvironment,
    investigationSteps: STEPS[ticketId] || [],
    resolution: RESOLUTIONS[found.resolution],
    similarTickets: similarTickets(ticketId),
  };
};

export const demoSites = () =>
  SITES.map((site) => ({
    ...site,
    dataFiles: site.dataFiles.map((file) => ({ ...file })),
  }));

export const demoSite = (siteId) => {
  const found = SITES.find((site) => site.siteId === siteId);

  if (!found) {
    return null;
  }

  return {
    ...found,
    dataFiles: found.dataFiles.map((file) => ({ ...file })),
    previousTickets: TICKETS.filter((ticket) => ticket.site === found.site).map(
      (ticket) => ({
        ticketId: ticket.ticketId,
        title: ticket.title,
        resolution: ticket.resolution,
      })
    ),
  };
};
