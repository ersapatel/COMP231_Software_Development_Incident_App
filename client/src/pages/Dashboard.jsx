import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IncidentList from "./IncidentList";
import ViewReport from "./ViewReport";
import Users from "./Users";
import "./Dashboard.css";
import API_BASE from "../apiBase";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("incidents");
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);

  if (!user) return null;

  const isAdmin = user.role === "admin";
  console.log("incidents in Dashboard:", incidents);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchIncidents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/incidents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!Array.isArray(data)) {
          setIncidents([]);
          return;
        }

        if (user?.role === "admin") {
          setIncidents(data);
        } else {
          const filteredIncidents = data.filter(
            (incident) => incident.reporterId === user?.id
          );
          setIncidents(filteredIncidents);
        }
      } catch (err) {
        console.error("Error fetching incidents:", err);
      }
    };

    if (token && user) {
      fetchUsers();
      fetchIncidents();
    }
  }, [token, user]);

  return (
    <div className="dashboard-container">
      <h3 className="dashboard-title">
        Welcome, {user.firstName} {user.lastName}
      </h3>

      {!isAdmin ? (
        <>
          <button
            className="dashboard-create-btn"
            onClick={() => navigate("/incidents/create")}
          >
            Create New Incident
          </button>

          <div className="dashboard-list-section">
            <IncidentList token={token} user={user} />
          </div>
        </>
      ) : (
        <>
          <div className="dashboard-tabs">
            <button
              className={`dashboard-tab ${
                activeTab === "incidents" ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab("incidents")}
            >
              Incidents
            </button>

            <button
              className={`dashboard-tab ${
                activeTab === "users" ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>

            <button
              className={`dashboard-tab ${
                activeTab === "reports" ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab("reports")}
            >
              Reports
            </button>
          </div>

          <div className="dashboard-list-section">
            {activeTab === "incidents" && (
              <IncidentList token={token} user={user} />
            )}

            {activeTab === "users" && (
              <Users token={token} />
            )}

            {activeTab === "reports" && (
              <div>
                <ViewReport incidents={incidents} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;