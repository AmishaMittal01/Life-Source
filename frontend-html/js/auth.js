// ================= DONOR LOGIN =================
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:5001/api/auth/donor/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("donor", JSON.stringify(data.donor));
      window.location.href = "donor-dashboard.html";
    } else {
      alert(data.message || "Donor login failed");
    }
  });
}

// ================ DONOR REGISTER =================
if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      gender: document.getElementById("gender").value,
      date_of_birth: document.getElementById("dob").value,
      blood_group: document.getElementById("blood_group").value,
      contact: document.getElementById("contact").value,
      address: document.getElementById("address").value,
    };

    const res = await fetch("http://localhost:5001/api/auth/donor/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Donor registration successful!");
      window.location.href = "donor-login.html";
    } else {
      alert(data.message || "Donor registration failed");
    }
  });
}

// ================= DOCTOR LOGIN =================
if (document.getElementById("doctorLoginForm")) {
  document.getElementById("doctorLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("doctorEmail").value;
    const password = document.getElementById("doctorPassword").value;

    const res = await fetch("http://localhost:5001/api/auth/doctor/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("doctor", JSON.stringify(data.doctor));
      window.location.href = "doctor-dashboard.html";
    } else {
      alert(data.message || "Doctor login failed");
    }
  });
}

// ================ DOCTOR REGISTER =================
if (document.getElementById("doctorRegisterForm")) {
  document.getElementById("doctorRegisterForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("doctorName").value,
      email: document.getElementById("doctorRegEmail").value,
      password: document.getElementById("doctorRegPassword").value,
      specialization: document.getElementById("specialization").value,
      contact: document.getElementById("doctorContact").value,
    };

    const res = await fetch("http://localhost:5001/api/auth/doctor/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Doctor registration successful!");
      window.location.href = "doctor-login.html";
    } else {
      alert(data.message || "Doctor registration failed");
    }
  });
}

