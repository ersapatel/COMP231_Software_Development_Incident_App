import { createContext, useContext, useEffect, useState } from "react";
import API_BASE from "../apiBase";

const IncidentContext = createContext();

export const IncidentProvider = ({ children, user }) => {
  const [incidents, setIncidents] = useState([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);

  useEffect(() => {
    const fetchIncidents = async () => {
      const token = localStorage.getItem("token");

      if (!token || !user) {
        setIncidents([]);
        return;
      }

      try {
        setLoadingIncidents(true);

        const res = await fetch(`${API_BASE}/api/incidents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setIncidents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching incidents:", err);
        setIncidents([]);
      } finally {
        setLoadingIncidents(false);
      }
    };

    fetchIncidents();
  }, [user]);

  return (
    <IncidentContext.Provider value={{ incidents, setIncidents, loadingIncidents }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => useContext(IncidentContext);