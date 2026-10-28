"use strict";

const PLANE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>';
const MULT = { ECONOMY: 1, BUSINESS: 2.4, FIRST: 4 };
const CLASS_NAME = { ECONOMY: "Economy", BUSINESS: "Business", FIRST: "First" };
const STORE_KEY = "skyport.tickets";

const state = { flights: [], tele: {}, selected: null, tickets: [], bookingFor: null };
const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n, d = 2) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const duration = m => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
const flightOf = no => state.flights.find(f => f.flightNumber === no);

async function api(path, options = {}) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
  return data;
}

let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3800);
}

/* ---------- departures board ---------- */
function renderBoard() {
  $("#boardRows").innerHTML = state.flights.map(f => `
    <div class="row" role="listitem" data-no="${f.flightNumber}" tabindex="0">
      <div><div class="fno">${f.flightNumber}</div><div class="fair">${esc(f.aircraft)}</div></div>
      <div class="rt">
        <div><b>${f.origin}</b><small>${esc(f.originCity)}</small></div>
        <span class="arrow">&rarr;</span>
        <div><b>${f.destination}</b><small>${esc(f.destinationCity)}</small></div>
      </div>
      <div class="prog"><div class="bar"><span class="fill"></span></div><div class="ph"><span class="phase-txt">Waiting for signal</span><span class="eta-txt"></span></div></div>
      <div class="dur">${duration(f.durationMinutes)}</div>
      <div class="price">${money(f.basePrice, 0)}<small>Economy</small></div>
      <div class="go"><button class="btn amber small" data-book="${f.flightNumber}" type="button">Book</button></div>
    </div>`).join("");
  markSelected();
}

function markSelected() {
  document.querySelectorAll(".row").forEach(r => r.classList.toggle("sel", r.dataset.no === state.selected));
}

function select(no) {
  state.selected = no;
  markSelected();
  const f = flightOf(no);
  if (!f) return;
  $("#pFlight").textContent = f.flightNumber;
  $("#pRoute").textContent = `${f.originCity} to ${f.destinationCity}`;
  paintPanel();
}

function paintPanel() {
  const t = state.tele[state.selected];
  if (!t) return;
  $("#pAlt").textContent = t.altitudeFt.toLocaleString("en-US");
  $("#pSpd").textContent = t.speedKts;
  $("#pHdg").textContent = t.headingDeg;
  $("#pEta").textContent = duration(t.etaMinutes);
  $("#pPhase").textContent = t.phase;
  $("#pPhase").className = "phase " + t.phase;
  $("#pBar").style.width = (t.progress * 100).toFixed(1) + "%";
}

function applyTelemetry(t) {
  state.tele[t.flightNumber] = t;
  const row = $(`.row[data-no="${t.flightNumber}"]`);
  if (row) {
    $(".fill", row).style.width = (t.progress * 100).toFixed(1) + "%";
    $(".phase-txt", row).textContent = t.phase;
    $(".eta-txt", row).textContent = duration(t.etaMinutes) + " left";
  }
  if (t.flightNumber === state.selected) paintPanel();
}

function connectStream() {
  const live = $("#live");
  const es = new EventSource("/api/telemetry/stream");
  es.onopen = () => { live.classList.add("on"); $("span", live).textContent = "Live"; };
  es.onmessage = e => applyTelemetry(JSON.parse(e.data));
  es.onerror = () => { live.classList.remove("on"); $("span", live).textContent = "Reconnecting"; };
}

/* ---------- radar ---------- */
const canvas = $("#radar-canvas");
const ctx = canvas.getContext("2d");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let W = 0, H = 0;
const LAT_TOP = 78, LAT_BOTTOM = -58;
const project = (lat, lon) => [(lon + 180) / 360 * W, (LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM) * H];

function resize() {
  const r = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  W = r.width; H = r.height;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
new ResizeObserver(resize).observe(canvas);

function planeShape(x, y, angle, size, fill) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.7, size * 0.8);
  ctx.lineTo(0, size * 0.4);
  ctx.lineTo(-size * 0.7, size * 0.8);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

function drawRadar(now) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "rgba(147,163,193,.22)";
  for (let lon = -180; lon <= 180; lon += 10) {
    for (let lat = LAT_BOTTOM; lat <= LAT_TOP; lat += 10) {
      const [x, y] = project(lat, lon);
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }

  const airports = new Map();
  for (const f of state.flights) {
    const [x1, y1] = project(f.originLat, f.originLon);
    const [x2, y2] = project(f.destLat, f.destLon);
    airports.set(f.origin, [x1, y1]);
    airports.set(f.destination, [x2, y2]);
    const sel = f.flightNumber === state.selected;
    ctx.beginPath();
    ctx.setLineDash(sel ? [] : [4, 6]);
    ctx.lineWidth = sel ? 2 : 1;
    ctx.strokeStyle = sel ? "rgba(57,211,195,.85)" : "rgba(147,163,193,.35)";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.font = "600 12px 'Instrument Sans', sans-serif";
  ctx.textBaseline = "middle";
  for (const [code, [x, y]] of airports) {
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#0b1322"; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = "#93a3c1"; ctx.stroke();
    ctx.fillStyle = "#c5d0e6";
    ctx.fillText(code, x + 8, y - 9);
  }

  for (const f of state.flights) {
    const t = state.tele[f.flightNumber];
    if (!t) continue;
    const [x, y] = project(t.latitude, t.longitude);
    const [x2, y2] = project(f.destLat, f.destLon);
    const [x1, y1] = project(f.originLat, f.originLon);
    const angle = Math.atan2(x2 - x1, -(y2 - y1));
    const sel = f.flightNumber === state.selected;
    if (sel) {
      const pulse = reduceMotion ? 0.5 : ((now / 1600) % 1);
      ctx.beginPath(); ctx.arc(x, y, 10 + pulse * 22, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,182,39,${0.7 * (1 - pulse)})`;
      ctx.lineWidth = 2; ctx.stroke();
      ctx.shadowColor = "#ffb627"; ctx.shadowBlur = 16;
    }
    planeShape(x, y, angle, sel ? 9 : 6.5, sel ? "#ffb627" : "#e9eef7");
    ctx.shadowBlur = 0;
    ctx.fillStyle = sel ? "#ffb627" : "#e9eef7";
    ctx.font = "700 13px 'Barlow Condensed', sans-serif";
    ctx.fillText(f.flightNumber, x + 12, y + 12);
  }
  requestAnimationFrame(drawRadar);
}

canvas.addEventListener("click", e => {
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left, my = e.clientY - r.top;
  let best = null, bestDist = 28;
  for (const f of state.flights) {
    const t = state.tele[f.flightNumber];
    if (!t) continue;
    const [x, y] = project(t.latitude, t.longitude);
    const d = Math.hypot(x - mx, y - my);
    if (d < bestDist) { best = f.flightNumber; bestDist = d; }
  }
  if (best) select(best);
});

/* ---------- booking ---------- */
const dialog = $("#bookDialog");

function openBooking(no) {
  const f = flightOf(no);
  if (!f) return;
  state.bookingFor = f;
  $("#bkRoute").textContent = `${f.flightNumber}: ${f.originCity} to ${f.destinationCity}, ${duration(f.durationMinutes)}`;
  $("#bkClasses").innerHTML = Object.keys(MULT).map((c, i) => `
    <label><input type="radio" name="cls" value="${c}" ${i === 0 ? "checked" : ""}>
      <span><b>${CLASS_NAME[c]}</b>${money(f.basePrice * MULT[c])}</span></label>`).join("");
  $("#bkError").hidden = true;
  dialog.showModal();
  $("#bkName").focus();
}

$("#bookForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = $("#bkSubmit");
  btn.disabled = true; btn.textContent = "Booking";
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
    toast(`Booked seat ${booking.seat}. Your reference is ${booking.reference}.`);
    $("#tickets").scrollIntoView();
  } catch (err) {
    $("#bkError").textContent = err.message;
    $("#bkError").hidden = false;
  } finally {
    btn.disabled = false; btn.textContent = "Book seat";
  }
});
$("#bkClose").onclick = $("#bkCancel").onclick = () => dialog.close();

/* ---------- tickets ---------- */
const readRefs = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } };
const writeRefs = refs => { try { localStorage.setItem(STORE_KEY, JSON.stringify(refs)); } catch { /* storage blocked */ } };
const saveRef = ref => writeRefs([ref, ...readRefs().filter(r => r !== ref)]);

async function loadTickets() {
  const refs = readRefs();
  const results = await Promise.all(refs.map(r => api("/api/bookings/" + encodeURIComponent(r)).catch(err => ({ _gone: /not found/i.test(err.message), reference: r }))));
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
  if (!state.tickets.length) {
    list.innerHTML = '<div class="empty">No tickets yet. Choose a flight on the board and select Book.</div>';
    return;
  }
  list.innerHTML = state.tickets.map(b => {
    const f = flightOf(b.flightNumber) || {};
    const cancelled = b.status === "CANCELLED";
    return `<article class="pass ${cancelled ? "cancelled" : ""}">
      <div class="pass-main">
        <div class="pass-route">
          <div><b>${esc(f.origin || "---")}</b><small>${esc(f.originCity || "")}</small></div>${PLANE}
          <div><b>${esc(f.destination || "---")}</b><small>${esc(f.destinationCity || "")}</small></div>
        </div>
        <div class="pass-meta">
          <div><span>Passenger</span><b>${esc(b.passengerName)}</b></div>
          <div><span>Flight</span><b>${esc(b.flightNumber)}</b></div>
          <div><span>Seat</span><b>${esc(b.seat)}</b></div>
          <div><span>${esc(CLASS_NAME[b.seatClass] || b.seatClass)}</span><b>${money(b.price)}</b></div>
        </div>
      </div>
      <div class="pass-stub">
        <div><span class="st">${cancelled ? "Cancelled" : "Confirmed"}</span><div class="ref">${esc(b.reference)}</div></div>
        <div class="bars" aria-hidden="true">${barcode(b.reference)}</div>
        ${cancelled ? "" : `<button class="btn ghost" data-cancel="${esc(b.reference)}" type="button">Cancel ticket</button>`}
      </div>
    </article>`;
  }).join("");
}

$("#ticketList").addEventListener("click", async e => {
  const ref = e.target.dataset.cancel;
  if (!ref || !confirm(`Cancel ticket ${ref}?`)) return;
  try {
    await api("/api/bookings/" + encodeURIComponent(ref), { method: "DELETE" });
    toast(`Cancelled ${ref}.`);
    await loadTickets();
  } catch (err) { toast(err.message); }
});

/* ---------- wiring ---------- */
$("#boardRows").addEventListener("click", e => {
  const book = e.target.closest("[data-book]");
  if (book) return openBooking(book.dataset.book);
  const row = e.target.closest(".row");
  if (row) { select(row.dataset.no); $("#radar").scrollIntoView(); }
});
$("#boardRows").addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.classList.contains("row")) select(e.target.dataset.no);
});
$("#pBook").onclick = () => openBooking(state.selected);

async function start() {
  try {
    state.flights = (await api("/api/flights")).flights;
    renderBoard();
    select(state.flights[0].flightNumber);
    (await api("/api/telemetry")).forEach(applyTelemetry);
  } catch (err) {
    $("#boardRows").innerHTML = `<div class="empty">${esc(err.message)} The page will keep trying.</div>`;
    setTimeout(start, 3000);
    return;
  }
  connectStream();
  loadTickets();
}
$("#brandMark").innerHTML = PLANE;
resize();
requestAnimationFrame(drawRadar);
start();
