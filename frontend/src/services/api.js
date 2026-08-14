import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
});

export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export const getTickets = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

export const getTicket = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}`);
  return response.data;
};

export const getTicketInvestigation = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}/investigation`);
  return response.data;
};

export const getSites = async () => {
  const response = await api.get("/sites");
  return response.data;
};

export const getSite = async (siteId) => {
  const response = await api.get(`/sites/${siteId}`);
  return response.data;
};

export default api;