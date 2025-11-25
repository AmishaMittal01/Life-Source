import express from "express";
import db from "../config/db.js";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM camps ORDER BY date ASC, start_time ASC");
    const camps = result[0]; // ✅ Correct way (NOT destructuring)

    res.json(camps);
  } catch (err) {
    console.error("Error fetching camps:", err);
    res.status(500).json({ message: "Error fetching camps" });
  }
});


router.post("/register", async (req, res) => {
  const { donor_id, camp_id } = req.body;

  if (!donor_id || !camp_id) {
    return res.status(400).json({ message: "donor_id and camp_id required" });
  }

  try {
    const [rows] = await db.query("CALL sp_register_donor_to_camp(?, ?)", [
      donor_id,
      camp_id,
    ]);

    res.json({
      message: "Donor registered successfully",
      registration_id:
        rows?.[0]?.[0]?.registration_id || null,
    });
  } catch (err) {
    console.error("Error registering donor:", err);
    res.status(400).json({ message: err.message });
  }
});


router.get("/:campId/registrations", async (req, res) => {
  const { campId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
          cr.registration_id,
          cr.status,
          d.donor_id,
          d.name AS donor_name,
          d.blood_group,

          -- SCREENING VALUES (from pre_donation_checks)
          s.weight,
          s.hemoglobin,
          s.blood_pressure,
          s.pulse,
          s.temperature,
          s.eligibility,
          s.remarks

       FROM camp_registrations cr
       JOIN donors d 
            ON cr.donor_id = d.donor_id
       LEFT JOIN pre_donation_checks s 
            ON s.registration_id = cr.registration_id

       WHERE cr.camp_id = ?
       ORDER BY cr.registration_id DESC`,
      [campId]
    );

    res.json(rows);

  } catch (err) {
    console.error("❌ Error fetching registrations:", err);
    res.status(500).json({ message: "Error fetching registrations" });
  }
});

router.get("/donor/:donorId", async (req, res) => {
  const { donorId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
          c.camp_id,
          c.camp_name,
          c.location,
          c.date,
          c.start_time,
          c.end_time,
          cr.status,

          -- NEW: Eligibility from screening table
          s.eligibility

       FROM camp_registrations cr
       JOIN camps c ON cr.camp_id = c.camp_id
       LEFT JOIN pre_donation_checks s 
            ON s.registration_id = cr.registration_id

       WHERE cr.donor_id = ?
       ORDER BY c.date ASC`,
      [donorId]
    );

    res.json(rows);

  } catch (err) {
    console.error("Error fetching donor camps:", err);
    res.status(500).json({ message: "Error fetching donor camps" });
  }
});

router.post("/create", async (req, res) => {
  const { camp_name, location, date, start_time, end_time, doctor_id } = req.body;

  try {
    await db.query(
      `INSERT INTO camps (camp_name, location, date, start_time, end_time, doctor_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [camp_name, location, date, start_time, end_time, doctor_id]
    );

    res.json({ message: "Camp created successfully!" });

  } catch (err) {
    console.error("Camp creation error:", err);
    res.status(400).json({ message: "Failed to create camp" });
  }
});
export default router;

