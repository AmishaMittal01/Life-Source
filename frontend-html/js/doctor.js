
const doctor = JSON.parse(localStorage.getItem("doctor"));

if (!doctor && location.pathname.includes("doctor-")) {
  window.location.href = "doctor-login.html";
}


if (doctor && document.getElementById("doctorWelcome")) {
  document.getElementById("doctorWelcome").innerText =
    `Welcome, Dr. ${doctor.name} 👋`;
}


async function loadDoctorCamps() {
  if (!document.getElementById("doctorCamps")) return;

  try {
    const res = await fetch("http://localhost:5001/api/camps");
    const camps = await res.json();

    const myCamps = camps.filter(c => c.doctor_id === doctor.doctor_id);
    const container = document.getElementById("doctorCamps");

    if (!myCamps.length) {
      container.innerHTML = `<p class="text-slate-600">No camps assigned yet.</p>`;
      return;
    }

    container.innerHTML = myCamps.map(camp => `
      <div class="bg-white p-6 rounded-xl shadow-lg border border-red-200 flex justify-between items-center">
        <div>
          <h3 class="text-xl font-bold text-slate-800">${camp.camp_name}</h3>
          <p class="text-slate-600 mt-1">${camp.location}</p>
          <p class="mt-2 text-slate-700 text-sm">
            📅 ${camp.date} <br>
            ⏰ ${camp.start_time} - ${camp.end_time}
          </p>
        </div>

        <button onclick='openCampRegistrations(${JSON.stringify(camp).replace(/"/g, "&quot;")})'
          class="bg-red-600 text-white px-4 py-2 rounded-full text-sm shadow hover:bg-red-700">
          View Registrations
        </button>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
  }
}

loadDoctorCamps();


function openCampRegistrations(camp) {
  localStorage.setItem("selectedCamp", JSON.stringify(camp));
  window.location.href = "doctor-registrations.html";
}


async function loadRegistrations() {
  if (!location.pathname.includes("doctor-registrations")) return;

  const camp = JSON.parse(localStorage.getItem("selectedCamp"));

  if (!camp) {
    alert("No camp selected!");
    window.location.href = "doctor-dashboard.html";
    return;
  }

  document.getElementById("campTitle").innerText = camp.camp_name;
  document.getElementById("campDetails").innerText =
    `${camp.location} • ${camp.date} • ${camp.start_time} - ${camp.end_time}`;

  try {
    const res = await fetch(`http://localhost:5001/api/camps/${camp.camp_id}/registrations`);
    const regs = await res.json();

    const tbody = document.getElementById("registrationsBody");

    if (!regs.length) {
      tbody.innerHTML =
        `<tr><td colspan="4" class="py-3 text-center text-slate-500">No registrations yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = regs.map(r => `
      <tr class="border-b align-top">
        <td class="py-3 font-medium">${r.donor_name}</td>
        <td class="py-3">${r.blood_group}</td>
        <td class="py-3">${r.status}</td>

        <td class="py-3 text-sm leading-6">
          <b>Weight:</b> ${r.weight ?? "-"} kg<br>
          <b>Hemoglobin:</b> ${r.hemoglobin ?? "-"} g/dL<br>
          <b>BP:</b> ${r.blood_pressure ?? "-"}<br>
          <b>Pulse:</b> ${r.pulse ?? "-"} bpm<br>
          <b>Temp:</b> ${r.temperature ?? "-"} °C<br>
          <b>Eligibility:</b> ${r.eligibility ?? "Pending"}<br>
          <b>Remarks:</b> ${r.remarks ?? "None"}
        </td>
      </tr>
    `).join("");

  } catch (err) {
    console.error("❌ Error loading registrations:", err);
  }
}

loadRegistrations();


function logout() {
  localStorage.removeItem("doctor");
  window.location.href = "doctor-login.html";
}
