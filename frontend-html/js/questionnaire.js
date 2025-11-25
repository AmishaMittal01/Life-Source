document.addEventListener("DOMContentLoaded", () => {

  const donor = JSON.parse(localStorage.getItem("donor"));
  const camp = JSON.parse(localStorage.getItem("selectedCamp"));


  console.log("questionnaire.js loaded!");

  if (!donor) {
    alert("Please login first!");
    window.location.href = "donor-login.html";
    return;
  }

  if (!camp) {
    alert("No camp selected!");
    window.location.href = "donor-camps.html";
    return;
  }

  
  document.getElementById("campInfo").innerHTML =
    `Registering for <b>${camp.camp_name}</b><br>
     ${camp.date} @ ${camp.location}`;

 
  document.getElementById("questionnaireForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    try {
     
      const registerRes = await fetch("http://localhost:5001/api/camps/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_id: donor.donor_id,
          camp_id: camp.camp_id
        })
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        alert(registerData.message || "Registration failed");
        return;
      }

      const registration_id = registerData.registration_id;

      
      const screeningPayload = {
        registration_id,
        weight: document.getElementById("weight").value,
        hemoglobin: document.getElementById("hemoglobin").value,
        blood_pressure: document.getElementById("blood_pressure").value,
        pulse: document.getElementById("pulse").value,
        temperature: document.getElementById("temperature").value,
        remarks: document.getElementById("remarks").value
      };

      const screeningRes = await fetch("http://localhost:5001/api/screening/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(screeningPayload)
      });

      const screeningData = await screeningRes.json();

      if (!screeningRes.ok) {
        alert(screeningData.message || "Screening failed");
        return;
      }

    
      alert("Screening submitted successfully!");
      window.location.href = "donor-dashboard.html";

    } catch (error) {
      console.error(error);
      alert("Something went wrong! Check console.");
    }
  });
});
