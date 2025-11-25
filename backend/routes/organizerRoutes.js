import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = express.Router();
const JWT_SECRET = "lifesource-secret";

// ----------------------------
// ORGANIZER REGISTER
// ----------------------------
router.post("/register", async (req, res) => {
  const { name, email, password, contact } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO organizers (name, email, password, contact) VALUES (?, ?, ?, ?)",
      [name, email, hashed, contact]
    );

    res.json({ message: "Organizer registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Registration failed" });
  }
});

// ----------------------------
// ORGANIZER LOGIN
// ----------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM organizers WHERE email = ?",
      [email]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Organizer not found" });

    const organizer = rows[0];

    const match = await bcrypt.compare(password, organizer.password);
    if (!match)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { organizer_id: organizer.organizer_id },
      JWT_SECRET
    );

    res.json({ message: "Login successful", organizer, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;