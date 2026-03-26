import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IncidentList.css";
import API_BASE from "../apiBase";

const IncidentList = ({ token }) => {
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      const data = await res.json();
      setUsers(data);
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
      setIncidents(data);
    } catch (err) {
      console.error("Error fetching incidents:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchIncidents();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error deleting incident");
      setIncidents((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openDeleteModal = (incident) => {
    setIncidentToDelete(incident);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setIncidentToDelete(null);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (!incidentToDelete) return;
    await handleDelete(incidentToDelete._id);
    closeDeleteModal();
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const dateOnly = value.slice(0, 10);
  
    const [year, month, day] = dateOnly.split("-");
    const d = new Date(Number(year), Number(month) - 1, Number(day));
  
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

    //the reporter name
  const getReporterName = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? `${user.firstName} ${user.lastName}` : "Reporter Not Found";
  };

  return (
    <div className="incident-container">
      <h3 className="incident-title">All Incidents</h3>

      {incidents.length === 0 ? (
        <p className="incident-empty">No incidents found.</p>
      ) : (
        <table className="incident-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Description</th>
              <th>Date Occured</th>
              <th>Reporter Name</th>
              <th>Date Reported</th>
              <th>Place</th>
              <th>Severity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc, index) => (
              <tr key={inc._id}>
                <td>{index + 1}</td>
                <td>{inc.description}</td>
                <td>{formatDate(inc.dateOccured)}</td>
                <td>{getReporterName(inc.reporterId)}</td>
                <td>{formatDate(inc.dateReported)}</td>
                <td>{inc.place}</td>
                <td>{inc.severity}</td>
                <td className="incident-actions">
                  <button
                    className="incident-btn incident-btn-edit"
                    onClick={() => navigate(`/incidents/${inc._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="incident-btn incident-btn-delete"
                    onClick={() => openDeleteModal(inc)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Modal */}
      {showModal && incidentToDelete && (
        <div className="incident-modal-backdrop">
          <div className="incident-modal">
            <h3>Are you sure want to perform this action?</h3>
            <p className="incident-modal-text">
              {incidentToDelete.description} ({incidentToDelete._id})
            </p>
            <div className="incident-modal-actions">
              <button
                className="incident-btn incident-btn-cancel"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="incident-btn incident-btn-delete"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentList;
