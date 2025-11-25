import db from "../config/db.js";

export const createCamp = (req, res) => {
  const { organizer_id, doctor_id, camp_name, location, date, start_time, end_time, capacity } = req.body;

  const sql = "CALL sp_create_camp(?,?,?,?,?,?,?,?)";

  db.query(
    sql,
    [organizer_id, doctor_id, camp_name, location, date, start_time, end_time, capacity],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
      }
      res.json({ message: "Camp created successfully (via stored procedure)" });
    }
  );
};

export const registerDonorToCamp = (req, res) => {
  const { donor_id, camp_id } = req.body;

  db.query("CALL sp_register_donor_to_camp(?,?)", [donor_id, camp_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: err.message });
    }

    res.json({
      message: "Donor registered for camp successfully (via stored procedure)",
      registration_id: result?.[0]?.[0]?.registration_id || null
    });
  });
};
