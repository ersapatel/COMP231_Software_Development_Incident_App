import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IncidentList from "./IncidentList";
import Users from "./Users";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("incidents");

  if (!user) return null;

  const isAdmin = user.role === "admin";

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
                <h4>Reports</h4>
                <p>Reports content will be displayed here.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;