// ===========================
// ORGANIZER LOGIN
// ===========================
if (document.getElementById("organizerLoginForm")) {
  document.getElementById("organizerLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:5001/api/organizers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("organizer", JSON.stringify(data.organizer));
      window.location.href = "organizer-create-camp.html";
    } else {
      alert(data.message);
    }
  });
}

// ===========================
// ORGANIZER REGISTER
// ===========================
if (document.getElementById("organizerRegisterForm")) {
  document.getElementById("organizerRegisterForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      contact: document.getElementById("contact").value,
      password: document.getElementById("password").value
    };

    const res = await fetch("http://localhost:5001/api/organizers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Organizer registered!");
      window.location.href = "organizer-login.html";
    } else {
      alert(data.message);
    }
  });
}


// ===========================
// CREATE CAMP
// ===========================
if (document.getElementById("campForm")) {
  document.getElementById("campForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      camp_name: document.getElementById("camp_name").value,
      location: document.getElementById("location").value,
      date: document.getElementById("date").value,
      start_time: document.getElementById("start_time").value,
      end_time: document.getElementById("end_time").value,
      doctor_id: document.getElementById("doctor_id").value
    };

    const res = await fetch("http://localhost:5001/api/camps/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Camp Created Successfully!");
      document.getElementById("campForm").reset();
    } else {
      alert(data.message);
    }
  });
}