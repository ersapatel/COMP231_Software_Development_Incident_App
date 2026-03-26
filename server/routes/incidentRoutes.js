import express from 'express';
import incidentCtrl from '../controllers/incident.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get All Incidents
router.get('/', incidentCtrl.getAllIncidents);

// Get Incident by Id
router.get('/:id', incidentCtrl.getIncidentById);

// Create a new Incident
router.post('/', authenticate, incidentCtrl.createIncident);

// Update an existing Incident
router.put('/:id', authenticate, incidentCtrl.updateIncident);

// Delete Incident by Id
router.delete('/:id', authenticate, incidentCtrl.deleteIncidentById);

// Delete All Incidents
router.delete('/', authenticate, incidentCtrl.deleteAllIncidents);

export default router;
