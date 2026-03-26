import { useNavigate } from "react-router-dom";
import IncidentList from "./IncidentList";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <>
      {user && (
        <div className="dashboard-container">
          <h3 className="dashboard-title">Welcome, {user.firstName} {user.lastName}</h3>

          <button
            className="dashboard-create-btn"
            onClick={() => navigate("/incidents/create")}
          >
            Create New Incident
          </button>

          <div className="dashboard-list-section">
            <IncidentList token={token} />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
