import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER ORGANIZER
export const registerOrganizer = (req, res) => {
  const { name, email, password, contact } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "CALL sp_register_organizer(?,?,?,?)";

  db.query(sql, [name, email, hashedPassword, contact], (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: err.message });
    }

    res.status(201).json({
      message: "Organizer registered successfully",
    });
  });
};

// LOGIN ORGANIZER
export const loginOrganizer = (req, res) => {
  const { email, password } = req.body;
  const sql = "CALL sp_get_organizer_by_email(?)";
  db.query(sql, [email], (err, resultSets) => {
    if (err) return res.status(500).json({ message: "Database error" });
    const rows = resultSets[0];
    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email" });

    const organizer = rows[0];
    const isMatch = bcrypt.compareSync(password, organizer.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: organizer.organizer_id, role: "organizer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      message: "Login successful",
      token,
      organizer,
    });
  });
};
