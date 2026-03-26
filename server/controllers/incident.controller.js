import Incidents from '../models/incident.js';

// GET all Incident
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incidents.find();
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Incident by id
const getIncidentById = async (req, res) => {
    try {
        const id = req.params.id;
        const incident = await Incidents.findById(id);

        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }
        res.json(incident);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Create new incident
const createIncident = async (req, res) => {
 try {

  const newIncident = new Incidents(req.body);

  const savedIncident = await newIncident.save();

  res.status(201).json(savedIncident);

 } catch (err) {
  res.status(400).json({ error: err.message });
 }
};

// Update Incident
const updateIncident = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedIncident = await Incidents.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedIncident) {
            return res.status(404).json({ message: 'Incident not found'});
        }
if (req.user.role !== 'admin' && updatedIncident.reporterId !== String(req.user.userId)) {
  return res.status(403).json({ message: 'Forbidden. Not the reporter.' });
}
    
  res.json(updatedIncident);
    } catch (err) {
        res.status(400).json( { error: err.message });
    }
};

// Delete Incident by ID
const deleteIncidentById = async (req, res) => {
    try {
        const id = req.params.id;
        const deteleIncident = await Incidents.findByIdAndDelete(id);

        if (!deteleIncident) {
        return res.status(404).json({ message: 'Incident not found' });
        }

        res.json(deteleIncident);
    } catch (err) {
        res.status(400).json( { error: err.message });
    }
};

// Delete all incidents
const deleteAllIncidents = async (req, res) => {
    try {
        const deteleAllIncidents = await Incidents.deleteMany({});

        res.json(deteleAllIncidents);
    } catch (err) {
        res.status(400).json( { error: err.message });
    }
};

export default { 
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncidentById,
  deleteAllIncidents 
};