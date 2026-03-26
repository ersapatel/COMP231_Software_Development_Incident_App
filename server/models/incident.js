import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema({
  description: { type: String, required: true },
  dateOccured: { type: Date, required: true },
  dateReported: { type: Date, required: true },
  reporterId: {type: String,required: true },
  place: { type: String, required: true },
  severity: {type: String, enum: ["High", "Medium", "Low"], required: true }
});

const Incident = mongoose.model("Incident", IncidentSchema);
export default Incident;