const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "server.json");

const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return {};
  }
};

const writeData = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

/* ---------- GET ROUTES ---------- */
app.get("/admin", (req, res) => res.json(readData().admin || []));
app.get("/users", (req, res) => res.json(readData().users || []));
app.get("/doctors", (req, res) => res.json(readData().doctors || []));
app.get("/patients", (req, res) => res.json(readData().patients || []));
app.get("/patients/:id", (req, res) => {
  const data = readData();
  const patient = (data.patients || []).find(p => p.id === req.params.id);
  if (patient) res.json(patient);
  else res.status(404).json({ error: "Patient not found" });
});
app.get("/appointments", (req, res) => res.json(readData().appointments || []));
app.get("/medicalRecords", (req, res) => res.json(readData().medicalRecords || []));

/* ---------- POST ROUTES ---------- */
app.post("/medicalRecords", (req, res) => {
  const data = readData();
  data.medicalRecords = data.medicalRecords || [];
  const record = { id: Date.now().toString(), ...req.body };
  data.medicalRecords.push(record);
  writeData(data);
  res.status(201).json(record);
});

app.post("/appointments", (req, res) => {
  const data = readData();
  data.appointments = data.appointments || [];
  const appt = { id: Date.now().toString(), ...req.body };
  data.appointments.push(appt);
  writeData(data);
  res.status(201).json(appt);
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
