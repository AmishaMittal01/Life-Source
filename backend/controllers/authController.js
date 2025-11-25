const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
    const { email, password, role } = req.body;

    let table = "";
    if (role === "donor") table = "donors";
    else if (role === "doctor") table = "doctors";
    else if (role === "organizer") table = "organizers";
    else return res.status(400).json({ success: false, message: "Invalid role" });

    const query = `SELECT * FROM ${table} WHERE email = ?`;

    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: "Email not found" });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.donor_id || user.doctor_id || user.organizer_id,
                name: user.name,
                email: user.email,
                role
            }
        });
    });
};
