let lang = loadLang();
const $ = (id) => document.getElementById(id);

const P = {
  es: {
    about: "Sobre el local",
    aboutText: "Restaurante familiar frente a la playa de Colònia de Sant Pere, con terraza y vistas a la bahía de Alcudia. Cocina mediterránea: paellas, tapas, pescado, pizzas y cócteles.",
    service: "Comer en el local o para llevar. Sin entrega a domicilio.",
    photos: "El local",
    photoSlot: "Foto del local",
    find: "Cómo llegar y horarios",
    days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    closedWord: "Cerrado",
    book: "Reservas",
    bookText: "Escríbenos por WhatsApp con el día, la hora y cuántos sois, o llama por teléfono.",
    seeRoute: "Abrir en Google Maps",
    openNow: "Abierto ahora", closesAt: "cierra a las 22:00", closedNow: "Cerrado ahora",
    opensToday: "abre hoy a las 11:30", opensTomorrow: "abre mañana a las 11:30", opensOn: "abre el %d a las 11:30", today: "hoy"
  },
  en: {
    about: "About us",
    aboutText: "A family restaurant on the beach in Colònia de Sant Pere, with a terrace and views over the Bay of Alcudia. Mediterranean cooking: paellas, tapas, fish, pizzas and cocktails.",
    service: "Dine in or take away. No home delivery.",
    photos: "The place",
    photoSlot: "Venue photo",
    find: "Getting here and opening hours",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    closedWord: "Closed",
    book: "Reservations",
    bookText: "Message us on WhatsApp with the day, the time and how many of you there are, or call us.",
    seeRoute: "Open in Google Maps",
    openNow: "Open now", closesAt: "closes at 10:00 pm", closedNow: "Closed now",
    opensToday: "opens today at 11:30 am", opensTomorrow: "opens tomorrow at 11:30 am", opensOn: "opens %d at 11:30 am", today: "today"
  }
};

// Horario: lunes a domingo 11:30–22:00, cerrado los miércoles. Se calcula con la hora de Mallorca.
const OPEN_MIN = 11 * 60 + 30, CLOSE_MIN = 22 * 60, CLOSED_DAY = 2;
function madridNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const get = (type) => parts.find((x) => x.type === type).value;
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  return { day, mins: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}
function renderStatus() {
  const p = P[lang], { day, mins } = madridNow();
  const openDay = day !== CLOSED_DAY;
  let text, open = false;
  if (openDay && mins >= OPEN_MIN && mins < CLOSE_MIN) { open = true; text = p.openNow + " · " + p.closesAt; }
  else if (openDay && mins < OPEN_MIN) { text = p.closedNow + " · " + p.opensToday; }
  else {
    let nd = (day + 1) % 7; if (nd === CLOSED_DAY) nd = (nd + 1) % 7;
    text = p.closedNow + " · " + (nd === (day + 1) % 7 ? p.opensTomorrow : p.opensOn.replace("%d", p.days[nd].toLowerCase()));
  }
  const el = $("status");
  el.textContent = text;
  el.className = "status" + (open ? " open" : "");
  document.querySelectorAll("#hours > div").forEach((row, i) => {
    row.classList.toggle("today", i === day);
    const dt = row.querySelector("dt"), old = dt.querySelector("small");
    if (old) old.remove();
    if (i === day) { const s = document.createElement("small"); s.textContent = "· " + p.today; dt.appendChild(s); }
  });
}

function render() {
  const t = UI[lang], p = P[lang];
  document.documentElement.lang = lang;
  $("tagline").textContent = t.tagline;
  $("facts").innerHTML = "<li><b>" + t.hours + "</b></li><li>" + t.closed + "</li><li>" + t.rating + "</li><li>" + t.avg + "</li>";
  $("seeMenu").textContent = t.seeMenu;
  $("reserve").textContent = t.reserve;
  $("reserve").href = waLink(t);
  $("route").textContent = t.route;
  $("contact").textContent = t.contact;
  $("lang").innerHTML = langButtons(lang, t);
  $("aboutH").textContent = p.about;
  $("aboutP").textContent = p.aboutText;
  $("serviceP").textContent = p.service;
  $("photosH").textContent = p.photos;
  $("photos").innerHTML = [0, 1, 2].map(() => '<div class="ph">' + p.photoSlot + "</div>").join("");
  $("findH").textContent = p.find;
  $("addr").textContent = t.addr;
  $("phone").textContent = t.phone;
  $("hours").innerHTML = p.days.map((d, i) => {
    const off = i === 2;
    return '<div class="' + (off ? "off" : "") + '"><dt>' + d + "</dt><dd>" + (off ? p.closedWord : "11:30 – 22:00") + "</dd></div>";
  }).join("");
  $("mapLink").textContent = p.seeRoute;
  $("bookH").textContent = p.book;
  $("bookP").textContent = p.bookText;
  $("bookWa").textContent = t.reserve;
  $("bookWa").href = waLink(t);
  $("footMenu").textContent = t.seeMenu;
  renderStatus();
}

document.addEventListener("click", (ev) => {
  const l = ev.target.closest("[data-l]");
  if (l && !l.disabled) { lang = l.dataset.l; saveLang(lang); render(); }
});
render();
setInterval(renderStatus, 60000);
