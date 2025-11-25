import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const registerDoctor = (req, res) => {
  const { name, email, password, specialization, contact } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "CALL sp_register_doctor(?,?,?,?,?)";

  db.query(sql, [name, email, hashedPassword, specialization, contact], (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: err.message });
    }
    res.json({ message: "Doctor registered successfully" });
  });
};

// LOGIN DOCTOR

export const loginDoctor = (req, res) => {
  const { email, password } = req.body;
  const sql = "CALL sp_get_doctor_by_email(?)";
  db.query(sql, [email], (err, resultSets) => {
    if (err) return res.status(500).json({ message: "Database error" });
    const rows = resultSets[0];
    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email" });

    const doctor = rows[0];

    const isMatch = bcrypt.compareSync(password, doctor.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: doctor.doctor_id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Doctor login successful",
      token,
      doctor,
    });
  });
};

export const getDoctorByEmail = (req, res) => {
  const email = req.params.email;
  const sql = "CALL sp_get_doctor_by_email(?)";

  db.query(sql, [email], (err, resultSets) => {
    if (err) return res.status(500).json({ message: "Database error" });

    const rows = resultSets[0];
    if (rows.length === 0)
      return res.status(404).json({ message: "Doctor not found" });

    res.json(rows[0]);
  });
};
