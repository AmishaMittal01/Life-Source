import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
const router = express.Router();
const JWT_SECRET = "lifesource-secret"; 
function generateToken(user, role) {
  return jwt.sign(
    {
      id: user.donor_id || user.doctor_id,
      role,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

router.post("/donor/register", async (req, res) => {
  const { name, email, password, blood_group, contact } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO donors (name, email, password, blood_group, contact) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, blood_group, contact]
    );

    res.json({ message: "Donor registered successfully ✅" });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ message: "Registration failed" });
  }
});

router.post("/donor/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM donors WHERE email = ?", [email]);
    const donor = result[0][0];

    if (!donor) return res.status(404).json({ message: "Donor not found" });

    const match = await bcrypt.compare(password, donor.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(donor, "donor");

    res.json({ message: "Login successful ", donor, token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/doctor/register", async (req, res) => {
  const { name, email, password, specialization, contact } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO doctors (name, email, password, specialization, contact) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, specialization, contact]
    );

    res.json({ message: "Doctor registered successfully ✅" });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ message: "Registration failed" });
  }
});

router.post("/doctor/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM doctors WHERE email = ?", [email]);
    const doctor = result[0][0];
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const match = await bcrypt.compare(password, doctor.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });
    const token = generateToken(doctor, "doctor");
    res.json({ message: "Login successful ", doctor, token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;

