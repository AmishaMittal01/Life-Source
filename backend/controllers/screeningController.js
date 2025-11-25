import db from "../config/db.js";
export const submitScreening = async (req, res) => {
  const {
    registration_id,
    weight,
    hemoglobin,
    blood_pressure,
    pulse,
    temperature,
    remarks
  } = req.body;
  if (!registration_id) {
    return res.status(400).json({ message: "registration_id is required" });
  }
  try {
    const [rows] = await db.query(
      "CALL sp_submit_screening(?, ?, ?, ?, ?, ?, ?)",
      [registration_id, weight, hemoglobin, blood_pressure, pulse, temperature, remarks]
    );
    res.json({
      message: "Screening submitted (Eligibility auto-calculated in DB)",
      result: rows
    });
  } catch (err) {
    console.error("submitScreening error:", err);
    res.status(500).json({ message: "Failed to submit screening", error: err.message });
  }
};
