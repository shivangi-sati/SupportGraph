import axios from "axios";

import {
  demoDashboard,
  demoInvestigation,
  demoSite,
  demoSites,
  demoTicket,
  demoTickets,
} from "./demoData";

const API_URL =
  import.meta.env.VITE_API_URL || "https://supportgraph-api.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 20000,
});

const RETRYABLE_CODES = new Set(["ECONNABORTED", "ERR_NETWORK", "ETIMEDOUT"]);
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

let dataSource = "live";

export const getDataSource = () => dataSource;

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const isRetryable = (error) =>
  RETRYABLE_CODES.has(error.code) ||
  RETRYABLE_STATUS.has(error.response?.status);

async function request(path, fallback) {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await api.get(path);
      dataSource = "live";
      return response.data;
    } catch (error) {
      lastError = error;

      if (!isRetryable(error) || attempt === 1) {
        break;
      }

      await wait(750 * (attempt + 1));
    }
  }

  // Only mask transport/warming failures. A real 4xx response still surfaces.
  if (fallback && (!lastError.response || isRetryable(lastError))) {
    dataSource = "demo";
    return fallback();
  }

  dataSource = "error";
  throw lastError;
}

export const getDashboard = () => request("/dashboard", demoDashboard);

export const getTickets = () => request("/tickets", demoTickets);

export const getTicket = (ticketId) =>
  request(`/tickets/${ticketId}`, () => demoTicket(ticketId));

export const getTicketInvestigation = (ticketId) =>
  request(`/tickets/${ticketId}/investigation`, () =>
    demoInvestigation(ticketId)
  );

export const getSites = () => request("/sites", demoSites);

export const getSite = (siteId) =>
  request(`/sites/${siteId}`, () => demoSite(siteId));

export default api;
