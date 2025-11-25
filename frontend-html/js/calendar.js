document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("http://127.0.0.1:5001/api/camps");
  const camps = await res.json();

  const events = camps.map(camp => ({
    title: camp.camp_name,
    start: camp.date,
    extendedProps: camp,
  }));

  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events,
    eventClick: (info) => {
      const camp = info.event.extendedProps;
      localStorage.setItem("selectedCamp", JSON.stringify(camp));
      window.location.href = "donor-questionnaire.html";
    },
  });

  calendar.render();
});
