
const donor = JSON.parse(localStorage.getItem("donor"));
if (!donor && location.pathname.includes("donor-")) {
  window.location.href = "donor-login.html";
}


if (donor && document.getElementById("welcomeText")) {
  document.getElementById("welcomeText").innerText = `Welcome, ${donor.name} 👋`;
}

async function loadUpcomingCamps() {
  if (!document.getElementById("upcomingCamps")) return;

  try {
    const res = await fetch("http://localhost:5001/api/camps");
    const camps = await res.json();

    const container = document.getElementById("upcomingCamps");

    if (!camps.length) {
      container.innerHTML = `<p class="text-slate-600">No camps scheduled.</p>`;
      return;
    }

    container.innerHTML = camps
      .slice(0, 3)
      .map(
        (camp) => `
        <div class="border border-red-200 p-3 rounded-lg bg-red-50">
          <b class="text-slate-800">${camp.camp_name}</b><br>
          <span class="text-slate-600 text-sm">
            📅 ${camp.date} — ⏰ ${camp.start_time}<br>
            📍 ${camp.location}
          </span>
        </div>
        `
      )
      .join("");

  } catch (err) {
    console.error("Error loading camps:", err);
  }
}

loadUpcomingCamps();

 
async function loadMyRegistrations() {
  const container = document.getElementById("myRegistrations");
  if (!container) return;

  try {
    const res = await fetch(
      `http://localhost:5001/api/camps/donor/${donor.donor_id}`
    );
    const regs = await res.json();

    if (!regs.length) {
      container.innerHTML = `<p class="text-slate-600">You have not registered for any camps yet.</p>`;
      return;
    }

    container.innerHTML = regs
      .map(
        (r) => `
      <div class="bg-white p-4 rounded-xl shadow border border-red-200">

        <h3 class="text-lg font-bold text-red-600">${r.camp_name}</h3>

        <p class="text-slate-700 mt-1">
          📅 ${r.date} — ⏰ ${r.start_time}<br>
          📍 ${r.location}
        </p>

        <p class="mt-2 font-medium">
  Status: 
  <span class="${r.eligibility === 'Deferred' ? 'text-red-600' : 'text-green-600'}">
    ${r.eligibility || r.status}
  </span>
</p>


      </div>`
      )
      .join("");

  } catch (err) {
    console.error("Error loading registrations:", err);
  }
}

loadMyRegistrations();


function logout() {
  localStorage.removeItem("donor");
  window.location.href = "donor-login.html";
}
