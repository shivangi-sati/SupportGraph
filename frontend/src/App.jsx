import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SiteDetails from "./pages/SiteDetails";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Sites from "./pages/Sites";
import Layout from "./components/Layout";
import TicketInvestigation from "./pages/TicketInvestigation";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/tickets"
            element={<Tickets />}
          />
          <Route
            path="/tickets/:ticketId"
            element={<TicketInvestigation />}
          />

          <Route
            path="/sites"
            element={<Sites />}
          />
          <Route
            path="/sites/:siteId"
            element={<SiteDetails />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;