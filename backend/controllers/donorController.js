import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER DONOR
export const registerDonor = (req, res) => {
  const {
    name,
    email,
    password,
    gender,
    date_of_birth,
    blood_group,
    contact,
    address
  } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "CALL sp_register_donor(?,?,?,?,?,?,?,?)";

  db.query(
    sql,
    [name, email, hashedPassword, gender, date_of_birth, blood_group, contact, address],
    (err) => {
      if (err) return res.status(400).json({ message: err.message });
      res.json({ message: "Donor registered successfully" });
    }
  );
};

// LOGIN DONOR
export const loginDonor = (req, res) => {
  const { email, password } = req.body;
  const sql = "CALL sp_get_donor_by_email(?)";
  db.query(sql, [email], (err, resultSets) => {
    if (err) return res.status(500).json({ message: "Database error" });
    const rows = resultSets[0];
    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email" });

    const donor = rows[0];
    const isMatch = bcrypt.compareSync(password, donor.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });
    const token = jwt.sign(
      { id: donor.donor_id, role: "donor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      donor,
    });
  });
};

export const getDonorByEmail = (req, res) => {
  const email = req.params.email;
  const sql = "CALL sp_get_donor_by_email(?)";

  db.query(sql, [email], (err, resultSets) => {
    if (err) return res.status(500).json({ message: "Database error" });

    const rows = resultSets[0];
    if (rows.length === 0)
      return res.status(404).json({ message: "Donor not found" });

    res.json(rows[0]);
  });
};
