"use strict";

/* ---------- shared constants ---------- */
const PLANE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>';
const MULT = { ECONOMY: 1, BUSINESS: 2.4, FIRST: 4 };
const STORE_KEY = "skyport.tickets";
const LANG_KEY = "skyport.lang";

/* ---------- translations ---------- */
const I18N = {
  en: {
    "meta.title": "SkyPort — live flights & tickets",
    "nav.map": "Live map", "nav.board": "Departures", "nav.tickets": "My tickets",
    "status.connecting": "Connecting", "status.live": "Live", "status.reconnecting": "Reconnecting",
    "hero.title": "Live flights from Tunis–Carthage",
    "hero.subtitle": "Track SkyPort aircraft across the Mediterranean in real time, then book your seat in seconds.",
    "stat.altitude": "Altitude, ft", "stat.speed": "Speed, kts", "stat.heading": "Heading, °", "stat.eta": "Arrives in",
    "btn.bookFlight": "Book this flight", "btn.book": "Book", "btn.cancel": "Cancel",
    "btn.bookSeat": "Book seat", "btn.booking": "Booking…", "btn.cancelTicket": "Cancel ticket", "btn.download": "Download ticket",
    "board.title": "Departures", "board.note": "Prices are for Economy. Business costs 2.4× more, First 4×.",
    "board.search": "Search destination, flight or city…", "board.noMatch": "No flights match your search.",
    "tickets.title": "My tickets", "tickets.note": "Tickets you book here are stored securely and available on this device.",
    "tickets.empty": "No tickets yet. Choose a flight on the board and select Book.",
    "footer.note": "SkyPort is a demo platform. All flights are simulated.",
    "dlg.title": "Book a seat", "dlg.passenger": "Passenger name", "dlg.passengerPh": "As on your passport",
    "dlg.email": "Email", "dlg.emailPh": "you@example.com", "dlg.seatClass": "Seat class",
    "dlg.confirmCancel": "Cancel ticket {ref}?",
    "ticket.passenger": "Passenger", "ticket.flight": "Flight", "ticket.seat": "Seat",
    "ticket.class": "Class", "ticket.price": "Price", "ticket.date": "Booked on",
    "ticket.confirmed": "Confirmed", "ticket.cancelled": "Cancelled",
    "toast.booked": "Booked seat {seat}. Your reference is {ref}.",
    "toast.cancelled": "Ticket {ref} cancelled.", "toast.retry": "The page will keep trying.",
    "toast.pdfMissing": "PDF library not loaded. Check your connection.",
    "fmt.left": "{m} left",
    "phase.Climbing": "Climbing", "phase.Cruising": "Cruising", "phase.Descending": "Descending", "phase.Waiting": "Waiting for signal",
    "cls.ECONOMY": "Economy", "cls.BUSINESS": "Business", "cls.FIRST": "First"
  },
  fr: {
    "meta.title": "SkyPort — vols en direct & billets",
    "nav.map": "Carte en direct", "nav.board": "Départs", "nav.tickets": "Mes billets",
    "status.connecting": "Connexion", "status.live": "En direct", "status.reconnecting": "Reconnexion",
    "hero.title": "Vols en direct depuis Tunis-Carthage",
    "hero.subtitle": "Suivez les avions SkyPort en temps réel à travers la Méditerranée, puis réservez votre siège en quelques secondes.",
    "stat.altitude": "Altitude, ft", "stat.speed": "Vitesse, kts", "stat.heading": "Cap, °", "stat.eta": "Arrive dans",
    "btn.bookFlight": "Réserver ce vol", "btn.book": "Réserver", "btn.cancel": "Annuler",
    "btn.bookSeat": "Réserver le siège", "btn.booking": "Réservation…", "btn.cancelTicket": "Annuler le billet", "btn.download": "Télécharger le billet",
    "board.title": "Départs", "board.note": "Prix en classe Économie. Business 2,4× plus, First 4×.",
    "board.search": "Rechercher destination, vol ou ville…", "board.noMatch": "Aucun vol ne correspond à votre recherche.",
    "tickets.title": "Mes billets", "tickets.note": "Vos billets sont stockés en toute sécurité et disponibles sur cet appareil.",
    "tickets.empty": "Aucun billet. Choisissez un vol et sélectionnez Réserver.",
    "footer.note": "SkyPort est une plateforme de démonstration. Tous les vols sont simulés.",
    "dlg.title": "Réserver un siège", "dlg.passenger": "Nom du passager", "dlg.passengerPh": "Comme sur votre passeport",
    "dlg.email": "E-mail", "dlg.emailPh": "vous@exemple.com", "dlg.seatClass": "Classe de siège",
    "dlg.confirmCancel": "Annuler le billet {ref} ?",
    "ticket.passenger": "Passager", "ticket.flight": "Vol", "ticket.seat": "Siège",
    "ticket.class": "Classe", "ticket.price": "Prix", "ticket.date": "Réservé le",
    "ticket.confirmed": "Confirmé", "ticket.cancelled": "Annulé",
    "toast.booked": "Siège {seat} réservé. Votre référence est {ref}.",
    "toast.cancelled": "Billet {ref} annulé.", "toast.retry": "La page va réessayer.",
    "toast.pdfMissing": "Bibliothèque PDF non chargée. Vérifiez votre connexion.",
    "fmt.left": "{m} restant",
    "phase.Climbing": "Montée", "phase.Cruising": "Croisière", "phase.Descending": "Descente", "phase.Waiting": "En attente du signal",
    "cls.ECONOMY": "Économie", "cls.BUSINESS": "Business", "cls.FIRST": "First"
  },
  ar: {
    "meta.title": "سكايبورت — رحلات مباشرة وتذاكر",
    "nav.map": "الخريطة المباشرة", "nav.board": "المغادرات", "nav.tickets": "تذاكرتي",
    "status.connecting": "جارٍ الاتصال", "status.live": "مباشر", "status.reconnecting": "إعادة الاتصال",
    "hero.title": "رحلات مباشرة من تونس قرطاج",
    "hero.subtitle": "تتبّع طائرات سكايبورت لحظة بلحظة عبر البحر الأبيض المتوسط، ثم احجز مقعدك في ثوانٍ.",
    "stat.altitude": "الارتفاع، قدم", "stat.speed": "السرعة، عقدة", "stat.heading": "الاتجاه، °", "stat.eta": "تصل خلال",
    "btn.bookFlight": "احجز هذه الرحلة", "btn.book": "احجز", "btn.cancel": "إلغاء",
    "btn.bookSeat": "احجز المقعد", "btn.booking": "جارٍ الحجز…", "btn.cancelTicket": "إلغاء التذكرة", "btn.download": "تنزيل التذكرة",
    "board.title": "المغادرات", "board.note": "الأسعار للدرجة الاقتصادية. درجة الأعمال 2.4× أكثر، الأولى 4×.",
    "board.search": "ابحث عن وجهة أو رحلة أو مدينة…", "board.noMatch": "لا توجد رحلات مطابقة لبحثك.",
    "tickets.title": "تذاكرتي", "tickets.note": "تُحفظ تذاكرك هنا بأمان وتكون متاحة على هذا الجهاز.",
    "tickets.empty": "لا توجد تذاكر بعد. اختر رحلة من اللوحة ثم اضغط احجز.",
    "footer.note": "سكايبورت منصة تجريبية. جميع الرحلات محاكاة.",
    "dlg.title": "احجز مقعدًا", "dlg.passenger": "اسم الراكب", "dlg.passengerPh": "كما في جواز سفرك",
    "dlg.email": "البريد الإلكتروني", "dlg.emailPh": "you@example.com", "dlg.seatClass": "درجة المقعد",
    "dlg.confirmCancel": "إلغاء التذكرة {ref}؟",
    "ticket.passenger": "الراكب", "ticket.flight": "الرحلة", "ticket.seat": "المقعد",
    "ticket.class": "الدرجة", "ticket.price": "السعر", "ticket.date": "تاريخ الحجز",
    "ticket.confirmed": "مؤكَّدة", "ticket.cancelled": "ملغاة",
    "toast.booked": "تم حجز المقعد {seat}. مرجعك هو {ref}.",
    "toast.cancelled": "تم إلغاء التذكرة {ref}.", "toast.retry": "ستحاول الصفحة مرة أخرى.",
    "toast.pdfMissing": "مكتبة PDF غير محمّلة. تحقق من اتصالك.",
    "fmt.left": "باقٍ {m}",
    "phase.Climbing": "تسلّق", "phase.Cruising": "تحليق", "phase.Descending": "هبوط", "phase.Waiting": "بانتظار الإشارة",
    "cls.ECONOMY": "اقتصادية", "cls.BUSINESS": "أعمال", "cls.FIRST": "أولى"
  }
};
let lang = localStorage.getItem(LANG_KEY) || "en";
function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }
function tr(key, vars = {}) { let s = t(key); for (const k in vars) s = s.replaceAll("{" + k + "}", vars[k]); return s; }

/* ---------- state ---------- */
const state = { flights: [], tele: {}, selected: null, tickets: [], bookingFor: null, query: "", liveStatus: "connecting" };
const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n, d = 2) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const duration = m => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
const flightOf = no => state.flights.find(f => f.flightNumber === no);
const fmtDate = (iso) => {
  const loc = lang === "ar" ? "ar-TN" : lang === "fr" ? "fr-FR" : "en-GB";
  try { return new Date(iso).toLocaleString(loc, { dateStyle: "medium", timeStyle: "short" }); }
  catch { return iso || ""; }
};

/* ---------- api + toast ---------- */
async function api(path, options = {}) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || t("toast.retry"));
  return data;
}
let toastTimer;
function toast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3800);
}

/* ---------- i18n ---------- */
function setLang(l) {
  lang = l; localStorage.setItem(LANG_KEY, l); applyI18n();
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === l));
}
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", lang === "ar");
  // keep the live indicator in sync with its real state
  const span = $("span", $("#live"));
  if (span) span.textContent = t("status." + state.liveStatus);
  if (state.flights.length) { renderBoard(); if (state.selected) select(state.selected); }
  if (state.tickets.length) renderTickets();
  setTimeout(() => { if (map) map.invalidateSize(); }, 200);
}

/* ---------- map (Leaflet) ---------- */
let map, routeLines = {}, planeMarkers = {};
const TUN = [36.851, 10.227];
function planeIcon(heading, selected) {
  return L.divIcon({
    className: "plane-divicon" + (selected ? " sel" : ""),
    html: `<div class="plane-rot" style="transform:rotate(${heading || 0}deg)">${PLANE}</div>`,
    iconSize: [26, 26], iconAnchor: [13, 13]
  });
}
function initMap() {
  map = L.map("map", { scrollWheelZoom: true, minZoom: 2, zoomControl: true, attributionControl: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
}
function renderMapFlights() {
  L.circleMarker(TUN, { radius: 7, color: "#B11226", weight: 2, fillColor: "#B11226", fillOpacity: 1 })
    .addTo(map).bindTooltip("TUN · Tunis", { permanent: true, direction: "right", className: "airport-tip hub-tip", offset: [6, 0] });
  const bounds = L.latLngBounds([TUN]);
  state.flights.forEach(f => {
    L.circleMarker([f.destLat, f.destLon], { radius: 5, color: "#C9A227", weight: 2, fillColor: "#fff", fillOpacity: 1 })
      .addTo(map).bindTooltip(f.destination, { permanent: true, direction: "right", className: "airport-tip", offset: [6, 0] });
    routeLines[f.flightNumber] = L.polyline([[f.originLat, f.originLon], [f.destLat, f.destLon]],
      { color: "#C9A227", weight: 1.5, dashArray: "2 6", opacity: 0.65 }).addTo(map);
    planeMarkers[f.flightNumber] = L.marker([f.originLat, f.originLon], { icon: planeIcon(0, false), zIndexOffset: 1000 }).addTo(map);
    planeMarkers[f.flightNumber].on("click", () => select(f.flightNumber));
    bounds.extend([f.destLat, f.destLon]);
  });
  map.fitBounds(bounds, { padding: [30, 30] });
}
function highlightRoute(no) {
  for (const k in routeLines) routeLines[k].setStyle({ color: "#C9A227", weight: 1.5, dashArray: "2 6", opacity: 0.65 });
  if (routeLines[no]) routeLines[no].setStyle({ color: "#B11226", weight: 3, dashArray: null, opacity: 0.9 });
}

/* ---------- departures board ---------- */
function renderBoard() {
  const q = state.query.trim().toLowerCase();
  const list = state.flights.filter(f => !q || [f.flightNumber, f.origin, f.originCity, f.destination, f.destinationCity]
    .some(v => String(v).toLowerCase().includes(q)));
  const box = $("#boardRows");
  if (!list.length) { box.innerHTML = `<div class="empty">${t("board.noMatch")}</div>`; return; }
  box.innerHTML = list.map(f => {
    const t0 = state.tele[f.flightNumber];
    const phaseTxt = t0 ? t("phase." + t0.phase) : t("phase.Waiting");
    const etaTxt = t0 ? tr("fmt.left", { m: duration(t0.etaMinutes) }) : "";
    const fill = t0 ? (t0.progress * 100).toFixed(1) : 0;
    return `<div class="row" role="listitem" data-no="${f.flightNumber}" tabindex="0">
      <div><div class="fno">${f.flightNumber}</div><div class="fair">${esc(f.aircraft)}</div></div>
      <div class="rt"><div><b>${f.origin}</b><small>${esc(f.originCity)}</small></div><span class="arrow">&rarr;</span><div><b>${f.destination}</b><small>${esc(f.destinationCity)}</small></div></div>
      <div class="prog"><div class="bar"><span class="fill" style="width:${fill}%"></span></div><div class="ph"><span class="phase-txt">${phaseTxt}</span><span class="eta-txt">${etaTxt}</span></div></div>
      <div class="dur">${duration(f.durationMinutes)}</div>
      <div class="price">${money(f.basePrice, 0)}<small>${t("cls.ECONOMY")}</small></div>
      <div class="go"><button class="btn primary small" data-book="${f.flightNumber}" type="button">${t("btn.book")}</button></div>
    </div>`;
  }).join("");
  markSelected();
}
function markSelected() {
  document.querySelectorAll(".row").forEach(r => r.classList.toggle("sel", r.dataset.no === state.selected));
}
function select(no) {
  state.selected = no; markSelected(); highlightRoute(no);
  const f = flightOf(no); if (!f) return;
  $("#pFlight").textContent = f.flightNumber;
  $("#pRoute").textContent = `${f.originCity} → ${f.destinationCity}`;
  paintPanel();
  const t0 = state.tele[no]; if (map && t0) map.panTo([t0.latitude, t0.longitude], { animate: true });
}
function paintPanel() {
  const t0 = state.tele[state.selected]; if (!t0) return;
  $("#pAlt").textContent = t0.altitudeFt.toLocaleString("en-US");
  $("#pSpd").textContent = t0.speedKts;
  $("#pHdg").textContent = t0.headingDeg;
  $("#pEta").textContent = duration(t0.etaMinutes);
  const ph = $("#pPhase"); ph.textContent = t("phase." + t0.phase); ph.className = "phase " + t0.phase;
  $("#pBar").style.width = (t0.progress * 100).toFixed(1) + "%";
}
function applyTelemetry(t0) {
  state.tele[t0.flightNumber] = t0;
  const row = $(`.row[data-no="${t0.flightNumber}"]`);
  if (row) {
    const fill = $(".fill", row); if (fill) fill.style.width = (t0.progress * 100).toFixed(1) + "%";
    const pt = $(".phase-txt", row); if (pt) pt.textContent = t("phase." + t0.phase);
    const et = $(".eta-txt", row); if (et) et.textContent = tr("fmt.left", { m: duration(t0.etaMinutes) });
  }
  const m = planeMarkers[t0.flightNumber];
  if (m) { m.setLatLng([t0.latitude, t0.longitude]); m.setIcon(planeIcon(t0.headingDeg, t0.flightNumber === state.selected)); }
  if (t0.flightNumber === state.selected) paintPanel();
}
function connectStream() {
  const live = $("#live"), span = $("span", live);
  const es = new EventSource("/api/telemetry/stream");
  es.onopen = () => { state.liveStatus = "live"; live.classList.add("on"); span.textContent = t("status.live"); };
  es.onmessage = e => applyTelemetry(JSON.parse(e.data));
  es.onerror = () => { state.liveStatus = "reconnecting"; live.classList.remove("on"); span.textContent = t("status.reconnecting"); };
}

/* ---------- booking ---------- */
const dialog = $("#bookDialog");
function openBooking(no) {
  const f = flightOf(no); if (!f) return;
  state.bookingFor = f;
  $("#bkRoute").textContent = `${f.flightNumber}: ${f.originCity} → ${f.destinationCity}, ${duration(f.durationMinutes)}`;
  $("#bkClasses").innerHTML = Object.keys(MULT).map((c, i) => `
    <label><input type="radio" name="cls" value="${c}" ${i === 0 ? "checked" : ""}>
      <span><b>${t("cls." + c)}</b>${money(f.basePrice * MULT[c])}</span></label>`).join("");
  $("#bkError").hidden = true;
  dialog.showModal();
  $("#bkName").focus();
}
$("#bookForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = $("#bkSubmit"); btn.disabled = true; btn.textContent = t("btn.booking");
  try {
    const booking = await api("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        flightNumber: state.bookingFor.flightNumber,
        passengerName: $("#bkName").value,
        email: $("#bkEmail").value,
        seatClass: $('input[name="cls"]:checked').value
      })
    });
    saveRef(booking.reference);
    dialog.close();
    await loadTickets();
    toast(tr("toast.booked", { seat: booking.seat, ref: booking.reference }));
    $("#tickets").scrollIntoView();
  } catch (err) {
    $("#bkError").textContent = err.message; $("#bkError").hidden = false;
  } finally {
    btn.disabled = false; btn.textContent = t("btn.bookSeat");
  }
});
$("#bkClose").onclick = $("#bkCancel").onclick = () => dialog.close();

/* ---------- tickets ---------- */
const readRefs = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } };
const writeRefs = refs => { try { localStorage.setItem(STORE_KEY, JSON.stringify(refs)); } catch { /* storage blocked */ } };
const saveRef = ref => writeRefs([ref, ...readRefs().filter(r => r !== ref)]);
async function loadTickets() {
  const refs = readRefs();
  const results = await Promise.all(refs.map(r => api("/api/bookings/" + encodeURIComponent(r))
    .catch(err => ({ _gone: /not found/i.test(err.message), reference: r }))));
  writeRefs(results.filter(r => !r._gone).map(r => r.reference));
  state.tickets = results.filter(r => !r._gone && r.flightNumber);
  renderTickets();
}
function barcode(ref) {
  let out = "";
  for (const ch of ref + ref) out += `<i style="width:${1 + (ch.charCodeAt(0) % 4)}px"></i><i style="width:2px;background:transparent"></i>`;
  return out;
}
function renderTickets() {
  const list = $("#ticketList");
  if (!state.tickets.length) { list.innerHTML = `<div class="empty">${t("tickets.empty")}</div>`; return; }
  list.innerHTML = state.tickets.map(b => {
    const f = flightOf(b.flightNumber) || {};
    const cancelled = b.status === "CANCELLED";
    return `<article class="pass ${cancelled ? "cancelled" : ""}">
      <div class="pass-main">
        <div class="pass-band"><span>SKYPORT</span><b>${esc(b.flightNumber)}</b></div>
        <div class="pass-route" dir="ltr">
          <div class="ap"><b>${esc(f.origin || "---")}</b><small>${esc(f.originCity || "")}</small></div>
          <span class="arr">&#9992;</span>
          <div class="ap"><b>${esc(f.destination || "---")}</b><small>${esc(f.destinationCity || "")}</small></div>
        </div>
        <div class="pass-meta">
          <div><span>${t("ticket.passenger")}</span><b>${esc(b.passengerName)}</b></div>
          <div><span>${t("ticket.seat")}</span><b>${esc(b.seat)}</b></div>
          <div><span>${t("ticket.class")}</span><b>${esc(t("cls." + b.seatClass))}</b></div>
          <div><span>${t("ticket.price")}</span><b>${money(b.price)}</b></div>
          <div><span>${t("ticket.date")}</span><b>${esc(fmtDate(b.createdAt))}</b></div>
        </div>
      </div>
      <div class="pass-stub">
        <div class="stub-top">
          <span class="st ${cancelled ? "canc" : "conf"}">${cancelled ? t("ticket.cancelled") : t("ticket.confirmed")}</span>
          <div class="ref">${esc(b.reference)}</div>
        </div>
        <div class="bars" aria-hidden="true">${barcode(b.reference)}</div>
        <div class="stub-btns">
          <button class="btn outline small" data-download="${esc(b.reference)}" type="button">${t("btn.download")}</button>
          ${cancelled ? "" : `<button class="btn outline small" data-cancel="${esc(b.reference)}" type="button">${t("btn.cancelTicket")}</button>`}
        </div>
      </div>
    </article>`;
  }).join("");
}
$("#ticketList").addEventListener("click", async e => {
  const dl = e.target.dataset.download, cRef = e.target.dataset.cancel;
  if (dl) { const b = state.tickets.find(x => x.reference === dl); if (b) downloadTicket(b); return; }
  if (cRef) {
    if (!confirm(tr("dlg.confirmCancel", { ref: cRef }))) return;
    try {
      await api("/api/bookings/" + encodeURIComponent(cRef), { method: "DELETE" });
      toast(tr("toast.cancelled", { ref: cRef }));
      await loadTickets();
    } catch (err) { toast(err.message); }
  }
});

/* ---------- PDF ticket download (jsPDF, client-side) ---------- */
function drawBarcode(doc, x, y, w, h, ref) {
  doc.setFillColor(255, 255, 255); doc.rect(x, y, w, h, "F");
  doc.setFillColor(35, 20, 32);
  let cx = x + 4;
  for (const ch of (ref + ref)) {
    const bw = 1 + (ch.charCodeAt(0) % 4);
    if (ch.charCodeAt(0) % 2) doc.rect(cx, y + 4, bw, h - 8, "F");
    cx += bw + 2;
    if (cx > x + w - 4) break;
  }
}
function downloadTicket(b) {
  if (!window.jspdf || !window.jspdf.jsPDF) { toast(t("toast.pdfMissing")); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: [600, 260] });
  const f = flightOf(b.flightNumber) || {};
  const RED = [177, 18, 38], GOLD = [201, 162, 39], INK = [35, 20, 32], SOFT = [107, 90, 99], W = [255, 255, 255];
  const set = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const fill = (c) => doc.setFillColor(c[0], c[1], c[2]);

  // header band
  fill(RED); doc.rect(0, 0, 600, 54, "F");
  fill(GOLD); doc.rect(0, 54, 600, 3, "F");
  set(W); doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.text("SKYPORT", 26, 34);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.text("BOARDING PASS", 574, 34, { align: "right" });

  // route
  set(INK); doc.setFont("times", "bold"); doc.setFontSize(30);
  doc.text(f.origin || "---", 26, 104);
  set(SOFT); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text((f.originCity || "").toUpperCase(), 26, 118);
  set(GOLD); doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text("→", 200, 102);
  set(INK); doc.setFont("times", "bold"); doc.setFontSize(30); doc.text(f.destination || "---", 240, 104);
  set(SOFT); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text((f.destinationCity || "").toUpperCase(), 240, 118);
  set(RED); doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(b.flightNumber, 418, 104, { align: "right" });

  // fields grid
  const fields = [
    [t("ticket.passenger"), b.passengerName],
    [t("ticket.flight"), b.flightNumber],
    [t("ticket.seat"), b.seat],
    [t("ticket.class"), t("cls." + b.seatClass)]
  ];
  fields.forEach((fld, i) => {
    const x = 26 + (i % 2) * 205, y = 146 + Math.floor(i / 2) * 30;
    set(SOFT); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
    doc.text(fld[0].toUpperCase(), x, y);
    set(INK); doc.setFont("helvetica", "normal"); doc.setFontSize(13);
    doc.text(String(fld[1] || ""), x, y + 13);
  });

  // date + price
  set(SOFT); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.text(t("ticket.date").toUpperCase(), 26, 206);
  set(INK); doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.text(fmtDate(b.createdAt), 26, 219);
  set(SOFT); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.text(t("ticket.price").toUpperCase(), 320, 206);
  set(GOLD); doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text(money(b.price), 320, 219);

  // stub (red)
  fill(RED); doc.rect(430, 57, 170, 203, "F");
  set(W); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.text("REFERENCE", 444, 82);
  doc.setFont("times", "bold"); doc.setFontSize(20); doc.text(b.reference, 444, 104);
  doc.setFont("helvetica", "bold"); doc.setFontSize(9);
  doc.text(b.status === "CANCELLED" ? t("ticket.cancelled").toUpperCase() : t("ticket.confirmed").toUpperCase(), 444, 122);
  drawBarcode(doc, 444, 134, 142, 40, b.reference);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); set(W);
  doc.text("SKYPORT · " + (f.aircraft || ""), 444, 244);

  doc.save(`SkyPort-Ticket-${b.reference}.pdf`);
}

/* ---------- wiring ---------- */
$("#boardRows").addEventListener("click", e => {
  const book = e.target.closest("[data-book]");
  if (book) return openBooking(book.dataset.book);
  const row = e.target.closest(".row");
  if (row) { select(row.dataset.no); $("#map").scrollIntoView(); }
});
$("#boardRows").addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.classList.contains("row")) select(e.target.dataset.no);
});
$("#boardSearch").addEventListener("input", e => { state.query = e.target.value; renderBoard(); });
$("#pBook").onclick = () => { if (state.selected) openBooking(state.selected); };
document.querySelectorAll(".lang-btn").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

async function start() {
  try {
    state.flights = (await api("/api/flights")).flights;
    renderMapFlights();
    renderBoard();
    select(state.flights[0].flightNumber);
    (await api("/api/telemetry")).forEach(applyTelemetry);
  } catch (err) {
    $("#boardRows").innerHTML = `<div class="empty">${esc(err.message)} ${t("toast.retry")}</div>`;
    setTimeout(start, 3000); return;
  }
  connectStream();
  loadTickets();
}

$("#brandMark").innerHTML = PLANE;
applyI18n();
document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
initMap();
start();
