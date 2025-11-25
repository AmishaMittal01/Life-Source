import db from "../config/db.js";

export const recordDonation = (req, res) => {
  const { donor_id, camp_id, blood_group } = req.body;

  const donation_date = new Date().toISOString().slice(0, 10);

  // CALL the stored procedure
  const sql = "CALL sp_record_donation(?,?,?,?)";

  db.query(sql, [donor_id, camp_id, blood_group, donation_date], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(400).json({ message: err.message });
    }

    // Stored procedure returns LAST_INSERT_ID()
    res.json({
      message: "Donation recorded ",
      donation_id: results[0][0].donation_id
    });
  });
};
