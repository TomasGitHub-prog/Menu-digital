let lang = loadLang();
let curGroup = "comida", curSec = "tapas";
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
      const tags = it[7] && it[7].length ? '<div class="tags"><span class="tag">' + (it[7].includes("vg") ? t.diets.vg : t.diets.v) + "</span></div>" : "";
      const cam = fd ? '<button type="button" class="cam" aria-label="' + t.viewCard + ": " + it[n] + '">' + CAM + "</button>" : "";
      const al = showAl && it[6].length
        ? '<p class="al-text">' + t.contains + ": " + it[6].map((k) => avoid.has(k) ? '<b class="hit">' + alName(k) + "</b>" : alName(k)).join(", ") + "</p>" : "";
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
  renderStars();
  renderBar();
  observe();
  renderTray();
}

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
    chips.innerHTML = list.map((c) => '<button type="button" class="chip" data-c="' + c.id + '" aria-current="' + (c.id === curSec) + '">' + c[lang] + "</button>").join("");
    chips.dataset.sig = sig;
    chips.classList.remove("swap"); void chips.offsetWidth; if (!reduce) chips.classList.add("swap");
  } else {
    chips.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-current", String(b.dataset.c === curSec)));
  }
  const active = chips.querySelector('.chip[aria-current="true"]');
  if (active) {
    const left = Math.max(0, active.offsetLeft - (chips.clientWidth - active.offsetWidth) / 2);
    chips.scrollTo({ left, behavior: rebuilt || reduce ? "auto" : "smooth" });
  }
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
    ? it[6].map((a) => '<span class="tag' + (showAl && avoid.has(a) ? " hit" : "") + '">' + alName(a) + "</span>").join("")
    : '<span class="muted">' + t.noAllergens + "</span>";
  const dietTags = it[7] && it[7].length ? '<span class="tag">' + (it[7].includes("vg") ? t.diets.vg : t.diets.v) + "</span>" : "";
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
  }, { rootMargin: "-130px 0px -70% 0px" });
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
  const chip = ev.target.closest(".chip");
  if (chip) { document.getElementById(chip.dataset.c)?.scrollIntoView(); return; }
  const seg = ev.target.closest("[data-g]");
  if (seg && !seg.disabled) { document.getElementById(seg.dataset.g)?.scrollIntoView(); return; }
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
