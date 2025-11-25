
const donor = JSON.parse(localStorage.getItem("donor"));
if (!donor) {
  
  window.location.href = "donor-login.html";
}
async function loadCamps() {
  try {
    const res = await fetch("http://localhost:5001/api/camps");
    const camps = await res.json();

    const container = document.getElementById("campsContainer");

    if (!camps.length) {
      container.innerHTML = `<p class="text-slate-600 text-center col-span-2">No camps found.</p>`;
      return;
    }

    
    container.innerHTML = camps
      .map(
        (camp) => `
      <div class="bg-white p-6 rounded-xl shadow-lg border border-red-200">
        <h3 class="text-xl font-bold text-slate-800">${camp.camp_name}</h3>
        <p class="text-slate-600 mt-1">📍 ${camp.location}</p>

        <p class="mt-2 text-slate-700 text-sm">
          📅 ${camp.date}<br>
          ⏰ ${camp.start_time} - ${camp.end_time}
        </p>

        <button onclick='selectCamp(${JSON.stringify(camp).replace(/"/g, "&quot;")})'
          class="mt-4 bg-red-600 w-full text-white py-2 rounded-full shadow hover:bg-red-700">
          Register
        </button>
      </div>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    alert("Error loading camps");
  }
}


function selectCamp(camp) {
  
  localStorage.setItem("selectedCamp", JSON.stringify(camp));

  
  window.location.href = "donor-questionnaire.html";
}


loadCamps();

