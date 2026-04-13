import { useEffect, useState } from "react";
import "./Users.css";
import API_BASE from "../apiBase";

export default function Users({ token }) {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (!token) return;

    let ignore = false;

    const loadUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();

        if (!ignore) {
          setUsers(data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    loadUsers();

    return () => {
      ignore = true;
    };
  }, [token]);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`${API_BASE}/api/users/${userToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm({
      firstName: "",
      lastName: "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await res.json();

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? updatedUser : u))
      );

      handleCancelEdit();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => {
              const isEditing = editingUserId === u._id;

              return (
                <tr key={u._id}>
                  <td>{index + 1}</td>

                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleEditChange}
                        className="users-input"
                      />
                    ) : (
                      u.firstName
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleEditChange}
                        className="users-input"
                      />
                    ) : (
                      u.lastName
                    )}
                  </td>

                  <td>{u.email}</td>
                  <td>{u.role}</td>

                  <td className="users-actions">
                    {isEditing ? (
                      <>
                        <button
                          className="users-btn users-btn-save"
                          onClick={() => handleSaveEdit(u._id)}
                        >
                          Save
                        </button>
                        <button
                          className="users-btn users-btn-cancel"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="users-btn users-btn-edit"
                          onClick={() => handleEditClick(u)}
                        >
                          Edit
                        </button>

                        <button
                          className="users-btn users-btn-delete"
                          onClick={() => openDeleteModal(u)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showModal && userToDelete && (
        <div className="users-modal-backdrop">
          <div className="users-modal">
            <h3>Confirm Delete</h3>
            <p className="users-modal-text">
              Are you sure you want to delete{" "}
              <strong>
                {userToDelete.firstName} {userToDelete.lastName}
              </strong>
              ?
            </p>

            <div className="users-modal-actions">
              <button
                className="users-btn users-btn-cancel"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>

              <button
                className="users-btn users-btn-delete-text"
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
}