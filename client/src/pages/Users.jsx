import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Users.css";
import API_BASE from "../apiBase";

export default function Users() {
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <h3 className="users-title">Users List</h3>

      {users.length === 0 ? (
        <p className="users-empty">No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id || index}>
                <td>{index + 1}</td>
                <td>{`${u.firstName || ""} ${u.lastName || ""}`.trim()}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
