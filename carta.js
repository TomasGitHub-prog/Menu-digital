let lang = loadLang();
let curGroup = "comida", curSec = "tapas", gridGroup = "comida", pastGrid = false;
const picked = new Map();                 // clave "cat:plato" -> cantidad
const _f = loadFilters();
const avoid = new Set(_f.avoid);
const diet = new Set(_f.diet);
let showAl = loadAl(), panelOpen = false, searchOpen = false, query = "";
let trayState = "closed", dragged = false, fichaKey = null;
let visible = new Set();                  // ids de categorías con resultados

const $ = (id) => document.getElementById(id);
const money = (n) => moneyFmt(n, lang);
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-9.33-8.85C1.2 9.2 2.8 5.5 6.3 5.5c2 0 3.7 1.1 5.7 3.2 2-2.1 3.7-3.2 5.7-3.2 3.5 0 5.1 3.7 3.63 6.65C19 16.65 12 21 12 21z" stroke-linejoin="round"/></svg>';
const CAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.2"/></svg>';
// ---- iconos de trazo (24×24): categorías, alérgenos y dieta ----
const ico = (p) => '<svg viewBox="0 0 24 24" class="ico" aria-hidden="true">' + p + "</svg>";
const WINE = `<path d="M8 3h8l-.5 6a3.5 3.5 0 0 1-7 0z"/><path d="M12 12.5V20M8.5 20h7"/><path d="M8.2 6.5h7.6"/>`;
const CAT_ICON = {
  tapas: `<path d="M3 17h18"/><path d="M5 17c0 1.5 3 2.5 7 2.5s7-1 7-2.5"/><path d="M6 14c0-2 2-3 6-3s6 1 6 3"/><path d="M14 4l-3 7"/>`,
  ensaladas: `<path d="M3 12h18c0 4.5-4 8-9 8s-9-3.5-9-8z"/><path d="M7 12c0-3 1.5-4.5 3-4.5S12 9 12 12"/><path d="M12 12c0-4 2-6 4-6s2 3 1 6"/>`,
  "pa-amb-oli": `<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M4 10A4 4 0 0 1 7 4H17A4 4 0 0 1 20 10"/>`,
  pizzas: `<path d="M3 6c6-3 12-3 18 0L12 21z"/><circle cx="10" cy="9.5" r="1"/><circle cx="14" cy="11" r="1"/><circle cx="12" cy="15" r="1"/>`,
  burgers: `<path d="M4 11A8 6 0 0 1 20 11z"/><path d="M3 14h18"/><path d="M4 17h16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>`,
  woks: `<path d="M3 13h18c0 4-3.5 7-9 7s-9-3-9-7z"/><path d="M8 4c-1 1.5 1 2.5 0 4"/><path d="M12 4c-1 1.5 1 2.5 0 4"/><path d="M14 11l7-6"/>`,
  carnes: `<circle cx="14.5" cy="9.5" r="5"/><path d="M11 13l-5 5"/><circle cx="5.5" cy="18.5" r="1.4"/><circle cx="7.5" cy="20.2" r="1.4"/>`,
  pescados: `<path d="M3 12c3-5 9-6 13-3l5-3v12l-5-3c-4 3-10 2-13-3z"/><circle cx="8" cy="11" r=".8" fill="currentColor" stroke="none"/>`,
  arroces: `<circle cx="12" cy="12" r="7"/><path d="M2 12h3M19 12h3"/><circle cx="9.5" cy="10" r="1"/><circle cx="14" cy="10.5" r="1"/><circle cx="12" cy="14" r="1"/>`,
  postres: `<path d="M8 12h8l-4 9z"/><path d="M7.5 12a4.5 4.5 0 1 1 9 0"/>`,
  refrescos: `<path d="M10 3h4v3l1.5 2.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V8.5L10 6z"/><path d="M8.5 12h7"/>`,
  cervezas: `<path d="M5 8h10v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M15 10h2.5a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H15"/><path d="M5 8c0-1.7 1.3-2.7 3-2.3.9-1 3.1-1 4 0 1.7-.4 3 .6 3 2.3"/>`,
  aperitivos: `<path d="M6 5h12l-1.2 12a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8z"/><path d="M6.8 9h10.4"/><circle cx="16.5" cy="6.5" r="2"/>`,
  cafes: `<path d="M5 10h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M9 4c-.8 1 .8 1.8 0 3M12.5 4c-.8 1 .8 1.8 0 3"/>`,
  sangria: `<path d="M7 5h8v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"/><path d="M15 8h2.5A1.5 1.5 0 0 1 19 9.5v3a1.5 1.5 0 0 1-1.5 1.5H15"/><circle cx="10" cy="12" r=".9"/><circle cx="12.5" cy="15.5" r=".9"/>`,
  cocteles: `<path d="M4 5h16l-8 9z"/><path d="M12 14v6M8.5 20h7"/><path d="M15 3l-2.5 4"/>`,
  destilados: `<path d="M6.5 6h11l-1 13a1 1 0 0 1-1 .9h-7a1 1 0 0 1-1-.9z"/><path d="M7 11h10"/>`,
  combinados: `<path d="M8 4h8l-1 15.5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/><path d="M9.5 9h5"/><path d="M14.5 2.5l-2 4"/>`,
  licores: `<path d="M8 6h8l-1 12a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/><path d="M8.6 11h6.8"/>`,
  blancos: WINE, rosados: WINE, tintos: WINE,
  cavas: `<path d="M9.5 3h5l-.6 8a2.4 2.4 0 0 1-3.8 0z"/><path d="M12 13.5V20M9 20h6"/>`
};
// Un icono por alérgeno, en el mismo orden que ALLERGENS (clave = número de alérgeno).
const AL_ICON = {
  1: `<path d="M12 21V9"/><path d="M12 9c-2.5 0-3.5-2-3.5-4 2.5 0 3.5 2 3.5 4z"/><path d="M12 9c2.5 0 3.5-2 3.5-4-2.5 0-3.5 2-3.5 4z"/><path d="M12 15c-2.5 0-3.5-2-3.5-4 2.5 0 3.5 2 3.5 4z"/><path d="M12 15c2.5 0 3.5-2 3.5-4-2.5 0-3.5 2-3.5 4z"/>`,
  2: `<path d="M5 15c0-5 3-9 8-9 3 0 5 2 5 4s-2 3-3 3c-2 0-2-2-4-2s-3 2-3 5"/><path d="M9 18l-3 2"/><circle cx="16" cy="9" r=".7" fill="currentColor" stroke="none"/>`,
  3: `<path d="M12 3c-3.5 0-6 6-6 10a6 6 0 0 0 12 0c0-4-2.5-10-6-10z"/>`,
  4: CAT_ICON.pescados,
  5: `<circle cx="12" cy="8" r="3.5"/><circle cx="12" cy="16" r="3.5"/>`,
  6: `<path d="M5 17c0-8 6-12 14-12 0 8-5 14-14 12z"/><circle cx="10" cy="12" r=".9"/><circle cx="13" cy="9.5" r=".9"/>`,
  7: `<path d="M10 3h4M10.5 3v4L8 10v9a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 16 19v-9l-2.5-3V3"/><path d="M8 13h8"/>`,
  8: `<path d="M12 4c4 0 7 3 7 7 0 5-3.5 9-7 9s-7-4-7-9c0-4 3-7 7-7z"/><path d="M12 4v16"/>`,
  9: `<path d="M12 21V9M9 21l-2-9M15 21l2-9"/><path d="M12 9c-2-1-3-3-3-5 2 0 3 2 3 5zM12 9c2-1 3-3 3-5-2 0-3 2-3 5z"/>`,
  10: `<path d="M9 3.5h6V7H9z"/><path d="M8 7h8v12a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 19z"/><path d="M8 12h8"/>`,
  11: `<ellipse cx="8" cy="8" rx="2" ry="3" transform="rotate(-30 8 8)"/><ellipse cx="16" cy="9" rx="2" ry="3" transform="rotate(30 16 9)"/><ellipse cx="12" cy="16" rx="2" ry="3"/>`,
  12: `<circle cx="12" cy="12" r="9"/><text x="12" y="15.2" text-anchor="middle" font-size="8.5" font-weight="700" font-family="sans-serif" fill="currentColor" stroke="none">SO₂</text>`,
  13: `<path d="M12 21V8"/><circle cx="12" cy="5" r="1.6"/><circle cx="9.5" cy="9" r="1.6"/><circle cx="14.5" cy="9" r="1.6"/><circle cx="9" cy="13" r="1.6"/><circle cx="15" cy="13" r="1.6"/>`,
  14: `<path d="M3 17a9 9 0 0 1 18 0z"/><path d="M12 8v9M7.5 10l2 7M16.5 10l-2 7"/>`
};
const DIET_ICON = {
  v: `<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>`,
  vg: `<path d="M12 21v-9"/><path d="M12 12c0-4-3-6-7-6 0 4 3 6 7 6z"/><path d="M12 14c0-3 2.5-5 6-5 0 3-2.5 5-6 5z"/>`
};
const alPill = (k, hit) => '<span class="al-pill' + (hit ? " hit" : "") + '">' + ico(AL_ICON[k] || "") + alName(k) + "</span>";
const dietTag = (it, t) => it[7] && it[7].length ? '<span class="tag diet">' + ico(it[7].includes("vg") ? DIET_ICON.vg : DIET_ICON.v) + (it[7].includes("vg") ? t.diets.vg : t.diets.v) + "</span>" : "";

const key = (ci, ii) => ci + ":" + ii;
const byKey = (k) => { const [ci, ii] = k.split(":").map(Number); return MENU[ci].items[ii]; };
const ai = () => (lang === "es" ? [0, 1] : [2, 3]);
const detail = (text, t) => text.replace("@glass", t.glass).replace("@bottle", t.bottle);
const alName = (k, l) => ALLERGENS[k - 1][(l || lang) === "es" ? 0 : 1];
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const matches = (it, c) => {
  if (!query) return true;
  const hay = norm(it[0] + " " + it[1] + " " + it[2] + " " + it[3] + " " + c.es + " " + c.en);
  return norm(query).split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
};
const fits = (it, k) => k === "gf" ? !it[6].includes(1) : k === "lf" ? !it[6].includes(7) : it[7] === null || it[7].includes(k) || (k === "v" && it[7].includes("vg"));
const dishFits = (it) => [...diet].every((k) => fits(it, k)) && !(showAl && it[6].some((a) => avoid.has(a)));
const filtersCount = () => diet.size + (showAl ? avoid.size : 0);

function renderStatic() {
  const t = UI[lang];
  document.documentElement.lang = lang;
  document.title = "Sunsets Beach · " + t.cartaTitle;
  $("homeLink").setAttribute("aria-label", t.home);
  $("addr").textContent = t.addr;
  $("phone").textContent = t.phone;
  $("reserve").textContent = t.reserve;
  $("reserve").href = waLink(t);
  $("q").placeholder = t.searchPh;
  $("q").setAttribute("aria-label", t.searchPh);
  $("trayNote").textContent = t.note;
  $("trayClear").textContent = t.clear;
  $("waiterBtn").textContent = t.waiterBtn;
  $("lang").innerHTML = langButtons(lang, t, true);
  $("langCur").textContent = lang.toUpperCase();
  $("langCur").setAttribute("aria-label", t.langLabel + ": " + LANG_NAMES[lang]);
  $("searchBtn").setAttribute("aria-label", t.searchOpen);
  renderControls();
  renderMenu();
}

function renderControls() {
  const t = UI[lang], n = filtersCount();
  const fb = $("filtersBtn");
  fb.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>' + t.filters + (n ? '<span class="badge">' + n + "</span>" : "");
  fb.setAttribute("aria-expanded", String(panelOpen));
  let h = "";
  if (n) {
    const parts = [...diet].map((k) => t.diets[k]);
    if (showAl && avoid.size) parts.push(t.avoidingWord + " " + [...avoid].sort((a, b) => a - b).map((k) => alName(k)).join(", ").toLowerCase());
    h += '<p class="avoid-status"><b>' + t.active + ":</b> " + parts.join(" · ") +
      ' · <button type="button" class="link-btn" id="filtersClear">' + t.clearAll + "</button></p>";
  }
  $("alControls").innerHTML = h;
  renderSheet();
}

function renderSheet() {
  const t = UI[lang], host = $("sheetWrap");
  if (!panelOpen) { host.innerHTML = ""; return; }
  const old = host.querySelector(".sheet"), top = old ? old.scrollTop : 0;
  const ae = document.activeElement, sel = ae && host.contains(ae) ? (ae.id ? "#" + ae.id : ae.dataset.d ? '[data-d="' + ae.dataset.d + '"]' : ae.dataset.a ? '[data-a="' + ae.dataset.a + '"]' : ae.dataset.theme ? '[data-theme-set="' + ae.dataset.theme + '"]' : "") : "";
  const th = loadTheme();
  let h = '<div class="sheet-back" id="sheetBack"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle"><div class="sheet-inner">' +
    '<div class="sheet-top"><h2 id="sheetTitle">' + t.filters + '</h2><button type="button" class="btn small" id="sheetClose">' + t.done + "</button></div>" +
    '<div class="filter-sec"><button type="button" class="switch" id="alToggle" role="switch" aria-checked="' + showAl + '"><span class="track"></span><span>' + t.alShow + "</span></button></div>" +
    '<div class="filter-sec"><h3>' + t.dietTitle + '</h3><div class="opts">' +
    ["v", "vg", "gf", "lf"].map((k) => '<button type="button" class="opt" data-d="' + k + '" aria-pressed="' + diet.has(k) + '">' + t.diets[k] + "</button>").join("") + "</div></div>";
  if (showAl) {
    h += '<div class="filter-sec"><h3>' + t.avoidTitle + '</h3><div class="opts">' +
      ALLERGENS.map((a, i) => '<button type="button" class="opt" data-a="' + (i + 1) + '" aria-pressed="' + avoid.has(i + 1) + '">' + a[lang === "es" ? 0 : 1] + "</button>").join("") + "</div></div>";
  }
  h += '<p class="tray-note">' + t.filterNote + "</p>";
  if (filtersCount()) h += '<p style="margin:12px 0 0"><button type="button" class="link-btn" id="sheetClear">' + t.clearAll + "</button></p>";
  h += '<div class="filter-sec"><h3>' + t.theme + '</h3><div class="opts">' +
    '<button type="button" class="opt" data-theme-set="dark" aria-pressed="' + (th === "dark") + '">' + t.themeDark + "</button>" +
    '<button type="button" class="opt" data-theme-set="light" aria-pressed="' + (th === "light") + '">' + t.themeLight + "</button></div></div></div></div>";
  host.innerHTML = h;
  const sh = host.querySelector(".sheet");
  sh.scrollTop = top;
  const target = sel && host.querySelector(sel);
  (target || $("sheetClose")).focus({ preventScroll: true });
}
function closeSheet() { panelOpen = false; renderControls(); $("filtersBtn").focus(); }

function renderStars() {
  const t = UI[lang], [n, d] = ai();
  if (query) { $("starsWrap").innerHTML = ""; return; }
  const cards = STARS.map((name) => {
    for (let ci = 0; ci < MENU.length; ci++) {
      const ii = MENU[ci].items.findIndex((it) => it[0] === name);
      if (ii >= 0) {
        const it = MENU[ci].items[ii];
        return '<button type="button" class="star' + (dishFits(it) ? "" : " nofit") + '" data-go="' + key(ci, ii) + '"><h3>' + it[n] + (FICHAS_ON && DETAIL[it[0]] ? '<span class="cam-ico">' + CAM + "</span>" : "") + "</h3><p>" + it[d] +
          '</p><span class="sp">' + money(it[4]) + (it[5] ? " <small>" + t.pp + "</small>" : "") + "</span></button>";
      }
    }
    return "";
  }).join("");
  $("starsWrap").innerHTML = cards ? "<h2>" + t.starsTitle + '</h2><div class="stars">' + cards + "</div>" : "";
}

function renderMenu() {
  const t = UI[lang];
  const [n, d] = ai();
  let html = "", total = 0, lastGroup = "";
  visible = new Set();
  MENU.forEach((c, ci) => {
    const rows = c.items.map((it, ii) => ({ it, ii })).filter((r) => matches(r.it, c));
    if (!rows.length) return;
    visible.add(c.id);
    total += rows.length;
    if (c.group !== lastGroup) {
      html += '<h2 class="group-title" id="' + c.group + '">' + GROUPS[c.group][lang] + "</h2>";
      lastGroup = c.group;
    }
    const items = rows.map(({ it, ii }) => {
      const on = picked.has(key(ci, ii));
      const price = money(it[4]) + (it[5] ? "<small>" + t.pp + "</small>" : "");
      const det = it[d] ? "<p>" + detail(it[d], t) + "</p>" : "";
      const fd = FICHAS_ON && DETAIL[it[0]];
      const tags = it[7] && it[7].length ? '<div class="tags">' + dietTag(it, t) + "</div>" : "";
      const cam = fd ? '<button type="button" class="cam" aria-label="' + t.viewCard + ": " + it[n] + '">' + CAM + "</button>" : "";
      const al = showAl && it[6].length
        ? '<div class="al-row"><span class="al-label">' + t.contains + "</span>" + it[6].map((k) => alPill(k, avoid.has(k))).join("") + "</div>" : "";
      return '<li class="dish' + (dishFits(it) ? "" : " nofit") + (fd ? " has-ficha" : "") + '"' + (fd ? ' data-ficha="' + key(ci, ii) + '"' : "") + ' id="d-' + key(ci, ii).replace(":", "-") + '"><div><h3>' + it[n] + cam + "</h3>" + det + tags + al + '</div><span class="price">' + price +
        '</span><button type="button" class="fav" data-k="' + key(ci, ii) + '" aria-pressed="' + on + '" aria-label="' + (on ? t.rmFav : t.addFav) + ": " + it[n] + '">' + heart + "</button></li>";
    }).join("");
    const note = c.note && !query ? '<p class="note">' + c.note[lang === "es" ? 0 : 1] + "</p>" : "";
    const extras = c.extras && !query ? '<div class="extras"><h3>' + t.extras + "</h3><ul>" +
      c.extras.map((e) => "<li><span>" + e[lang === "es" ? 0 : 1] + "</span><span>" + money(e[2]) + "</span></li>").join("") + "</ul></div>" : "";
    html += '<section class="section" id="' + c.id + '" data-sec="' + c.id + '"><h2>' + c[lang] + "</h2>" + note + '<ul class="dishes">' + items + "</ul>" + extras + "</section>";
  });
  $("menu").innerHTML = html;
  $("qInfo").textContent = !query ? "" : total ? total + " " + (total === 1 ? t.result1 : t.results) : t.none + " «" + query + "»";
  // asegura que el grupo y la categoría activos existen
  const cur = MENU.find((c) => c.id === curSec);
  if (!cur || !visible.has(curSec)) {
    const first = MENU.find((c) => visible.has(c.id));
    if (first) { curSec = first.id; curGroup = first.group; }
  }
  renderIndex();
  renderStars();
  renderBar();
  observe();
  renderTray();
}

// Índice de categorías (cuadrícula de iconos) del grupo activo. Se oculta al buscar.
function renderIndex() {
  const host = $("catIndex");
  host.hidden = !!query;
  host.innerHTML = query ? "" : MENU.filter((c) => c.group === gridGroup && visible.has(c.id)).map((c) =>
    '<button type="button" class="cat-tile" data-c="' + c.id + '"><span class="ct-ico">' + ico(CAT_ICON[c.id] || CAT_ICON.tapas) + '</span><span class="ct-name">' + c[lang] + "</span></button>").join("");
  syncChipsBar();
}
// La barra de categorías con iconos aparece cuando el índice sale de la pantalla (o al buscar).
function syncChipsBar() { document.body.classList.toggle("chips-on", pastGrid || !!query); }

function renderBar() {
  const hasGroup = (g) => MENU.some((c) => c.group === g && visible.has(c.id));
  const seg = $("seg"), chips = $("chips");
  // Píldora Comida/Bebidas: se reconstruye solo si cambia el idioma o lo visible; si no, solo se cambia la marcada (con transición).
  const segSig = lang + "|" + Object.keys(GROUPS).map((g) => hasGroup(g)).join();
  if (seg.dataset.sig !== segSig) {
    seg.innerHTML = Object.keys(GROUPS).map((g) =>
      '<button type="button" data-g="' + g + '" aria-pressed="' + (g === curGroup) + '"' + (hasGroup(g) ? "" : " disabled") + ">" + GROUPS[g][lang] + "</button>").join("");
    seg.dataset.sig = segSig;
  } else {
    seg.querySelectorAll("[data-g]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.g === curGroup)));
  }
  // Categorías: si es el mismo grupo, se mantienen y la marcada cambia con transición; la barra se desplaza suavemente hasta la nueva.
  const list = MENU.filter((c) => c.group === curGroup && visible.has(c.id));
  const sig = lang + "|" + curGroup + "|" + list.map((c) => c.id).join();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rebuilt = chips.dataset.sig !== sig;
  if (rebuilt) {
    chips.innerHTML = list.map((c) => '<button type="button" class="chip" data-c="' + c.id + '" aria-current="' + (c.id === curSec) + '">' + ico(CAT_ICON[c.id] || CAT_ICON.tapas) + "<span>" + c[lang] + "</span></button>").join("") + '<span class="chips-end" aria-hidden="true"></span>';
    fitChipsEnd();
    chips.dataset.sig = sig;
    chips.classList.remove("swap"); void chips.offsetWidth; if (!reduce) chips.classList.add("swap");
  } else {
    chips.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-current", String(b.dataset.c === curSec)));
  }
  const active = chips.querySelector('.chip[aria-current="true"]');
  if (active) {
    // La categoría activa queda siempre pegada al borde izquierdo (salvo al final de la lista).
    const pad = parseFloat(getComputedStyle(chips).paddingLeft) || 0;
    const left = Math.max(0, chips.scrollLeft + active.getBoundingClientRect().left - chips.getBoundingClientRect().left - pad);
    if (rebuilt || reduce) { cancelAnimationFrame(chipsAnim); chips.scrollLeft = left; } else glideChips(chips, left);
  }
}

// Espacio en blanco al final de la barra: así hasta la última categoría puede quedar pegada a la izquierda.
function fitChipsEnd() {
  const chips = $("chips"), last = chips.querySelector(".chip:last-of-type"), end = chips.querySelector(".chips-end");
  const pad = parseFloat(getComputedStyle(chips).paddingLeft) || 0;
  if (last && end) end.style.flexBasis = Math.max(0, chips.clientWidth - pad - last.offsetWidth) + "px";
}
window.addEventListener("resize", fitChipsEnd);

// Desplazamiento propio de la barra: más lento y con aceleración y frenado suaves.
let chipsAnim = 0;
function glideChips(el, to) {
  cancelAnimationFrame(chipsAnim);
  const from = el.scrollLeft, dist = to - from, dur = Math.min(900, 420 + Math.abs(dist) * 0.9), t0 = performance.now();
  if (Math.abs(dist) < 1) return;
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.scrollLeft = from + dist * ease(p);
    if (p < 1) chipsAnim = requestAnimationFrame(step);
  };
  chipsAnim = requestAnimationFrame(step);
}

function trayTotals() {
  let count = 0, sum = 0;
  picked.forEach((q, k) => { count += q; sum += q * byKey(k)[4]; });
  return { count, sum };
}

function setTray(st) {
  trayState = st;
  $("tray").dataset.state = st;
  $("trayBody").inert = st === "closed";
  $("trayHead").setAttribute("aria-expanded", String(st !== "closed"));
  $("trayBack").hidden = st !== "full";
  $("trayHint").textContent = UI[lang][st === "closed" ? "trayShow" : "trayHide"];
}

function renderTray() {
  const t = UI[lang];
  $("tray").hidden = picked.size === 0;
  if (!picked.size) { setTray("closed"); return; }
  const [n] = ai();
  const { count, sum } = trayTotals();
  $("trayList").innerHTML = [...picked].map(([k, q]) => {
    const it = byKey(k);
    return '<li><span class="nm">' + it[n] + '</span><span class="step"><button type="button" data-step="-1" data-k="' + k + '" aria-label="' + t.dec + ": " + it[n] + '">−</button><span>' + q +
      '</span><button type="button" data-step="1" data-k="' + k + '" aria-label="' + t.inc + ": " + it[n] + '">+</button></span><span class="pr">' + money(it[4] * q) + "</span></li>";
  }).join("");
  $("trayCount").textContent = count + " " + (count === 1 ? t.sel1 : t.selN);
  $("trayTotal").textContent = money(sum);
  $("trayTotal").setAttribute("aria-label", t.total + ": " + money(sum));
  setTray(trayState);
}

// Arrastrar el asa del resumen: arriba amplía (cerrado → abierto → ampliado), abajo reduce.
(function () {
  const head = document.getElementById("trayHead");
  let y0 = null, id = null;
  head.addEventListener("pointerdown", (e) => { y0 = e.clientY; id = e.pointerId; dragged = false; head.setPointerCapture(id); });
  head.addEventListener("pointermove", (e) => { if (y0 !== null && Math.abs(e.clientY - y0) > 8) dragged = true; });
  const end = (e) => {
    if (y0 === null) return;
    const dy = e.clientY - y0; y0 = null;
    if (Math.abs(dy) < 36) return;
    const order = ["closed", "open", "full"], i = order.indexOf(trayState);
    setTray(order[Math.max(0, Math.min(2, i + (dy < 0 ? 1 : -1)))]);
  };
  head.addEventListener("pointerup", end);
  head.addEventListener("pointercancel", () => { y0 = null; });
})();

// ---- ficha de plato ----
function renderFicha() {
  const k = fichaKey, it = byKey(k), fd = DETAIL[it[0]], t = UI[lang], li = lang === "es" ? 0 : 1, [n] = ai();
  const on = picked.has(k);
  const al = it[6].length
    ? it[6].map((a) => alPill(a, showAl && avoid.has(a))).join("")
    : '<span class="muted">' + t.noAllergens + "</span>";
  const dietTags = dietTag(it, t);
  $("fichaWrap").innerHTML = '<div class="sheet-back" id="fichaBack"></div><div class="sheet ficha" role="dialog" aria-modal="true" aria-labelledby="fichaTitle">' +
    '<div class="ficha-photo" id="fichaPhoto"><img draggable="false" src="' + fd.photo + '" alt="' + fd.alt[li] + '"><span class="ph-fallback">' + t.photoSoon + '</span>' +
    '<span class="grab" aria-hidden="true"></span><button type="button" class="icon-btn ficha-close" id="fichaClose" aria-label="' + t.closeCard + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="sheet-inner ficha-body"><div class="ficha-head"><h2 id="fichaTitle">' + it[n] + '</h2><span class="ficha-price">' + money(it[4]) + (it[5] ? "<small>" + t.pp + "</small>" : "") + "</span></div>" +
    "<p class=\"ficha-short\">" + fd.short[li] + "</p>" +
    (dietTags ? '<div class="tags">' + dietTags + "</div>" : "") +
    "<h3>" + t.ingredients + '</h3><p class="ficha-ing">' + fd.ingredients[li].join(", ") + "</p>" +
    "<h3>" + t.allergensH + '</h3><div class="tags al-tags">' + al + "</div>" +
    '<button type="button" class="btn ' + (on ? "" : "primary ") + 'big ficha-add" id="fichaAdd">' + (on ? t.rmSel : t.addSel) + "</button></div></div>";
  const img = document.querySelector("#fichaPhoto img");
  const miss = () => document.getElementById("fichaPhoto").classList.add("no-photo");
  img.addEventListener("error", miss);
  if (img.complete && img.naturalWidth === 0) miss();
  bindFichaSwipe();
}
function openFicha(k) {
  fichaKey = k; renderFicha();
  document.body.style.overflow = "hidden";
  $("fichaClose").focus({ preventScroll: true });
}
function closeFicha() {
  if (!fichaKey) return;
  const k = fichaKey; fichaKey = null;
  $("fichaWrap").innerHTML = "";
  if ($("waiter").hidden) document.body.style.overflow = "";
  document.getElementById("d-" + k.replace(":", "-"))?.focus({ preventScroll: true });
}
function bindFichaSwipe() {
  const ph = document.getElementById("fichaPhoto");
  let y0 = null;
  ph.addEventListener("pointerdown", (e) => { if (e.target.closest("button")) return; y0 = e.clientY; ph.setPointerCapture(e.pointerId); });
  ph.addEventListener("pointerup", (e) => { if (y0 !== null && e.clientY - y0 > 70) closeFicha(); y0 = null; });
  ph.addEventListener("pointercancel", () => { y0 = null; });
}

function syncFav(k) {
  const el = document.querySelector('.fav[data-k="' + k + '"]');
  if (!el) return;
  const on = picked.has(k), t = UI[lang], old = el.getAttribute("aria-label");
  el.setAttribute("aria-pressed", String(on));
  el.setAttribute("aria-label", (on ? t.rmFav : t.addFav) + old.slice(old.indexOf(":")));
}

function openWaiter() {
  const es = WAITER.es, en = WAITER.en, other = lang !== "es";
  const items = [...picked].map(([k, q]) => {
    const it = byKey(k);
    return '<li><span class="w-qty">' + q + '×</span><span class="w-name">' + it[0] +
      (other && it[2] !== it[0] ? '<span class="w-trans">' + it[2] + "</span>" : "") + "</span></li>";
  }).join("");
  let extra = "";
  const avoidList = showAl ? [...avoid].sort((a, b) => a - b) : [];
  if (avoidList.length) {
    extra += '<div class="w-avoid"><b>' + es.avoid + "</b> " + avoidList.map((k) => alName(k, "es")).join(", ") +
      (other ? "<small>" + en.avoid + " " + avoidList.map((k) => alName(k, "en")).join(", ") + "</small>" : "") + "</div>";
  }
  if (diet.size) {
    extra += '<div class="w-avoid"><b>' + es.diet + "</b> " + [...diet].map((k) => UI.es.diets[k]).join(", ") +
      (other ? "<small>" + en.diet + " " + [...diet].map((k) => UI.en.diets[k]).join(", ") + "</small>" : "") + "</div>";
  }
  $("waiterBody").innerHTML = '<div class="waiter-top"><span></span><button type="button" class="btn small" id="waiterClose">' + UI[lang].close + "</button></div>" +
    "<h2>" + es.title + "</h2>" + (other ? '<p class="sub">' + en.title + "</p>" : '<p class="sub"></p>') +
    '<ul class="w-list">' + items + "</ul>" + extra +
    '<p class="w-note">' + es.note + (other ? "<br>" + en.note : "") + "</p>";
  $("waiter").hidden = false;
  document.body.style.overflow = "hidden";
  $("waiterClose").focus();
}
function closeWaiter() { $("waiter").hidden = true; document.body.style.overflow = ""; }

let io;
function observe() {
  if (io) io.disconnect();
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const c = MENU.find((x) => x.id === e.target.dataset.sec);
      if (!c || c.id === curSec) return;
      curSec = c.id;
      curGroup = c.group;
      renderBar();
    });
  }, { rootMargin: "-140px 0px -70% 0px" });
  document.querySelectorAll("[data-sec]").forEach((s) => io.observe(s));
}

document.addEventListener("click", (ev) => {
  const refresh = () => { saveFilters(avoid, diet); renderControls(); renderMenu(); };
  if (ev.target.closest("#fichaClose") || ev.target.closest("#fichaBack")) { closeFicha(); return; }
  if (ev.target.closest("#fichaAdd")) {
    const k = fichaKey;
    if (picked.has(k)) picked.delete(k); else picked.set(k, 1);
    syncFav(k); renderTray(); renderFicha(); document.getElementById("fichaAdd").focus({ preventScroll: true });
    return;
  }
  if (ev.target.closest("#trayBack")) { setTray("open"); return; }
  if (ev.target.closest("#waiterClose")) { closeWaiter(); return; }
  if (ev.target.closest("#waiterBtn")) { openWaiter(); return; }
  if (ev.target.closest("#alToggle")) { showAl = !showAl; saveAl(showAl); refresh(); return; }
  if (ev.target.closest("#filtersBtn")) { panelOpen = true; renderControls(); return; }
  if (ev.target.closest("#sheetClose") || ev.target.closest("#sheetBack")) { closeSheet(); return; }
  const ths = ev.target.closest("[data-theme-set]");
  if (ths) { saveTheme(ths.dataset.themeSet); renderSheet(); return; }
  if (ev.target.closest("#searchBtn")) {
    searchOpen = !searchOpen;
    $("searchRow").hidden = !searchOpen;
    $("searchBtn").setAttribute("aria-expanded", String(searchOpen));
    if (searchOpen) $("q").focus();
    else if (query) { query = ""; curSec = ""; $("q").value = ""; renderMenu(); }
    return;
  }
  if (!ev.target.closest("#langMenu")) $("langMenu").open = false;
  const dopt = ev.target.closest("[data-d]");
  if (dopt) { const k = dopt.dataset.d; if (diet.has(k)) diet.delete(k); else diet.add(k); refresh(); return; }
  const opt = ev.target.closest(".opt[data-a]");
  if (opt) { const a = Number(opt.dataset.a); if (avoid.has(a)) avoid.delete(a); else avoid.add(a); refresh(); return; }
  if (ev.target.closest("#filtersClear, #sheetClear")) { avoid.clear(); diet.clear(); refresh(); return; }
  const go = ev.target.closest("[data-go]");
  if (go) {
    if (FICHAS_ON && DETAIL[byKey(go.dataset.go)[0]]) { openFicha(go.dataset.go); return; }
    const el = document.getElementById("d-" + go.dataset.go.replace(":", "-"));
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
    }
    return;
  }
  const chip = ev.target.closest(".chip, .cat-tile");
  if (chip) { document.getElementById(chip.dataset.c)?.scrollIntoView(); return; }
  const seg = ev.target.closest("[data-g]");
  if (seg && !seg.disabled) {
    const g = seg.dataset.g;
    if (!pastGrid && !query) {
      // Arriba del todo, Comida/Bebidas cambia el índice de categorías en el sitio, sin saltar.
      const first = MENU.find((c) => c.group === g && visible.has(c.id));
      gridGroup = curGroup = g;
      if (first) curSec = first.id;
      renderIndex(); renderBar();
    } else document.getElementById(g)?.scrollIntoView();
    return;
  }
  const l = ev.target.closest("[data-l]");
  if (l && !l.disabled) { lang = l.dataset.l; saveLang(lang); $("langMenu").open = false; renderStatic(); return; }
  const step = ev.target.closest("[data-step]");
  if (step) {
    const k = step.dataset.k, q = (picked.get(k) || 0) + Number(step.dataset.step);
    if (q <= 0) picked.delete(k); else picked.set(k, q);
    syncFav(k);
    renderTray();
    return;
  }
  const fav = ev.target.closest(".fav");
  if (fav) {
    const k = fav.dataset.k;
    if (picked.has(k)) picked.delete(k); else picked.set(k, 1);
    syncFav(k);
    renderTray();
    return;
  }
  if (ev.target.closest("#trayHead")) {
    if (dragged) { dragged = false; return; }
    setTray(trayState === "closed" ? "open" : "closed");
    return;
  }
  const row = ev.target.closest(".dish[data-ficha]");
  if (row) { openFicha(row.dataset.ficha); return; }
  if (ev.target.closest("#trayClear")) { picked.clear(); setTray("closed"); closeWaiter(); renderMenu(); }
});

// El índice "ha pasado" cuando queda por encima de la pantalla (bajo la barra fija): entonces aparece la barra de iconos.
new IntersectionObserver(([e]) => { pastGrid = !e.isIntersecting && e.boundingClientRect.top < 0; syncChipsBar(); }, { rootMargin: "-70px 0px 0px 0px" }).observe($("catIndex"));
$("q").addEventListener("input", (ev) => { const was = query; query = ev.target.value.trim(); if (was && !query) curSec = ""; renderMenu(); });
document.addEventListener("keydown", (ev) => {
  if (ev.key !== "Escape") return;
  if (!$("waiter").hidden) closeWaiter();
  else if (fichaKey) closeFicha();
  else if (trayState === "full") setTray("open");
  else if (panelOpen) closeSheet();
  else if ($("langMenu").open) $("langMenu").open = false;
});

renderStatic();
