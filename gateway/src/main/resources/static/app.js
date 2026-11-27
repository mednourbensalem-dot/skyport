"use strict";

/* ---------- constants ---------- */
const PLANE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>';
const CABINS = ["ECONOMY", "BUSINESS", "FIRST"];
const CABIN_HINT = { ECONOMY: "", BUSINESS: "×2.4", FIRST: "×4" };
const PHASES = ["ALL", "Climbing", "Cruising", "Descending"];
const STORE_KEY = "skyport.tickets.v2";
const LANG_KEY = "skyport.lang";
const THEME_KEY = "skyport.theme";
const TOKEN_KEY = "skyport.token";
const USER_KEY = "skyport.user";
const NAME_KEY = "skyport.name";
const EMAIL_KEY = "skyport.email";

/* ---------- translations ---------- */
const I18N = {
  en: {
    "meta.title": "SkyPort — live flights & booking",
    "brand.tag": "Tunis–Carthage",
    "nav.track": "Live", "nav.board": "Flights", "nav.tickets": "Tickets", "nav.admin": "Staff",
    "status.connecting": "Connecting", "status.live": "Live", "status.reconnecting": "Reconnecting",
    "hero.eyebrow": "Live network · Mediterranean",
    "hero.title": "Flights over the Mediterranean, tracked second by second.",
    "hero.sub": "Watch the SkyPort fleet move in real time, compare cabins, choose your seat and check in — all from one page.",
    "hero.airborne": "Airborne now", "hero.alt": "Average altitude", "hero.seats": "Seats available", "hero.onTime": "On-time average",
    "planner.title": "Plan a flight", "planner.badge": "9 routes",
    "planner.from": "From", "planner.to": "To", "planner.cabin": "Cabin",
    "planner.search": "Search flights", "planner.any": "Any destination",
    "planner.note": "{n} of {total} flights match.",
    "track.title": "Live operations",
    "track.note": "Every plane on this map moves in real time — no need to refresh.",
    "map.dest": "Destination", "map.route": "Route",
    "inspect.flight": "Flight", "inspect.book": "Book this flight",
    "gauge.alt": "Height, ft", "gauge.spd": "Speed, knots", "gauge.hdg": "Direction", "gauge.eta": "Arrives in",
    "micro.wind": "Wind", "micro.temp": "Outside", "micro.fuel": "Fuel", "micro.vs": "Climb",
    "feed.title": "Live activity", "feed.empty": "No activity yet. Book a seat to see events here.",
    "feed.BOOKED": "Booked", "feed.CANCELLED": "Cancelled", "feed.CHECKED_IN": "Checked in",
    "board.title": "Departures",
    "board.note": "Prices shown are Economy. Business and First cost more, and a few seats have a small extra fee.",
    "board.search": "Search flight, city or gate…", "board.count": "{n} flights",
    "board.noMatch": "No flights match these filters.", "board.loading": "Loading flights…",
    "board.base": "base fare", "board.gate": "Gate {gate}",
    "board.onTime": "{n}% on time", "board.seats": "{n} seats left",
    "phase.ALL": "All flights", "phase.Climbing": "Climbing", "phase.Cruising": "Cruising",
    "phase.Descending": "Descending", "phase.Waiting": "Waiting",
    "tickets.title": "My tickets",
    "tickets.note": "Your tickets are saved on this device, so you can come back to them any time.",
    "tickets.empty": "No tickets yet. Pick a flight and book a seat.",
    "ticket.confirmed": "Confirmed", "ticket.checkedin": "Checked in", "ticket.cancelled": "Cancelled",
    "ticket.passenger": "Passenger", "ticket.seat": "Seat", "ticket.cabin": "Cabin",
    "ticket.group": "Boarding group", "ticket.price": "Total", "ticket.booked": "Booked",
    "ticket.download": "Download", "ticket.checkin": "Check in", "ticket.cancel": "Cancel",
    "ticket.cancelConfirm": "Cancel ticket {ref}?",
    "admin.title": "Staff area",
    "admin.note": "For SkyPort staff only.",
    "admin.cardTitle": "Ground staff",
    "admin.cardNote": "Sign in to see how the fleet is doing and how tickets are selling.",
    "admin.point1": "How many planes are in the air, and where",
    "admin.point2": "Tickets sold, check-ins and money taken",
    "admin.point3": "You are signed out automatically after one hour",
    "admin.user": "Username", "admin.pass": "Password", "admin.login": "Sign in",
    "admin.logout": "Sign out", "admin.hint": "Demo login: admin / skyport-admin",
    "admin.invalid": "Wrong username or password.", "admin.signed": "Signed in as {user}",
    "admin.airborne": "Airborne", "admin.alt": "Avg altitude", "admin.revenue": "Revenue",
    "admin.bookings": "Bookings", "admin.confirmed": "Confirmed", "admin.checkedin": "Checked in",
    "admin.cancelled": "Cancelled", "admin.fleet": "Fleet", "admin.flight": "Flight",
    "admin.phase": "Phase", "admin.altCol": "Altitude", "admin.spdCol": "Speed",
    "dlg.kicker": "SkyPort booking", "dlg.title": "Book a seat",
    "dlg.step1": "Passenger", "dlg.step2": "Seat", "dlg.step3": "Review",
    "dlg.name": "Passenger name", "dlg.namePh": "As on your passport",
    "dlg.email": "Email", "dlg.emailPh": "you@example.com", "dlg.cabin": "Cabin",
    "dlg.seat": "Choose a seat", "dlg.anySeat": "Let us pick",
    "dlg.seatNote": "Optional. Seats with a gold dot carry an extra fee.",
    "dlg.route": "Route", "dlg.passenger": "Passenger", "dlg.base": "Base fare",
    "dlg.taxes": "Taxes", "dlg.fees": "Seat & service fees", "dlg.total": "Total",
    "dlg.seatChosen": "Seat {seat}", "dlg.auto": "Assigned at check-in",
    "legend.free": "Free", "legend.taken": "Taken", "legend.picked": "Selected", "legend.plus": "Extra fee",
    "checkin.kicker": "Boarding", "checkin.title": "Check in",
    "checkin.hint": "Choose a free seat or keep your current one.",
    "checkin.confirm": "Confirm check-in", "checkin.note": "Seat {seat} selected.",
    "btn.book": "Book", "btn.back": "Back", "btn.cancel": "Cancel", "btn.continue": "Continue",
    "btn.confirm": "Confirm booking", "btn.booking": "Booking…", "btn.loading": "Loading…",
    "seat.none": "No seats left in this cabin.",
    "cls.ECONOMY": "Economy", "cls.BUSINESS": "Business", "cls.FIRST": "First",
    "toast.booked": "Seat {seat} booked — reference {ref}.",
    "toast.cancelled": "Ticket {ref} cancelled.",
    "toast.checkedin": "Checked in. Boarding group {group}.",
    "toast.retry": "Something went wrong. Try again.",
    "toast.pdfMissing": "Your ticket file could not be created. Check your connection.",
    "toast.login": "Signed in as {user}.",
    "footer.note": "SkyPort is a demo. Flights are simulated and bookings are saved.",
    "fmt.left": "{m} left", "fmt.seats": "{n} seats", "fmt.onTime": "{n}% on time",
    "theme.toDark": "Switch to dark mode", "theme.toLight": "Switch to light mode",
    "top.label": "Back to top",
    "unit.kts": "kts", "unit.fpm": "ft/min", "unit.deg": "°"
  },
  fr: {
    "meta.title": "SkyPort — vols en direct et réservation",
    "brand.tag": "Tunis–Carthage",
    "nav.track": "Direct", "nav.board": "Vols", "nav.tickets": "Billets", "nav.admin": "Personnel",
    "status.connecting": "Connexion", "status.live": "En direct", "status.reconnecting": "Reconnexion",
    "hero.eyebrow": "Réseau en direct · Méditerranée",
    "hero.title": "Les vols au-dessus de la Méditerranée, suivis seconde par seconde.",
    "hero.sub": "Suivez la flotte SkyPort en temps réel, comparez les cabines, choisissez votre siège et enregistrez-vous — sur une seule page.",
    "hero.airborne": "En vol", "hero.alt": "Altitude moyenne", "hero.seats": "Sièges libres", "hero.onTime": "Ponctualité moyenne",
    "planner.title": "Planifier un vol", "planner.badge": "9 routes",
    "planner.from": "Départ", "planner.to": "Destination", "planner.cabin": "Cabine",
    "planner.search": "Rechercher des vols", "planner.any": "Toutes les destinations",
    "planner.note": "{n} vols sur {total} correspondent.",
    "track.title": "Opérations en direct",
    "track.note": "Chaque avion sur cette carte bouge en temps réel — inutile d'actualiser.",
    "map.dest": "Destination", "map.route": "Trajet",
    "inspect.flight": "Vol", "inspect.book": "Réserver ce vol",
    "gauge.alt": "Hauteur, ft", "gauge.spd": "Vitesse, nœuds", "gauge.hdg": "Direction", "gauge.eta": "Arrivée dans",
    "micro.wind": "Vent", "micro.temp": "Extérieur", "micro.fuel": "Carburant", "micro.vs": "Montée",
    "feed.title": "Activité en direct", "feed.empty": "Aucune activité. Réservez un siège pour voir les événements.",
    "feed.BOOKED": "Réservé", "feed.CANCELLED": "Annulé", "feed.CHECKED_IN": "Enregistré",
    "board.title": "Départs",
    "board.note": "Les prix affichés sont en Économie. Les classes Affaires et Première coûtent plus cher, et certains sièges ont un petit supplément.",
    "board.search": "Rechercher vol, ville ou porte…", "board.count": "{n} vols",
    "board.noMatch": "Aucun vol ne correspond à ces filtres.", "board.loading": "Chargement des vols…",
    "board.base": "tarif de base", "board.gate": "Porte {gate}",
    "board.onTime": "{n}% à l'heure", "board.seats": "{n} sièges",
    "phase.ALL": "Tous les vols", "phase.Climbing": "Montée", "phase.Cruising": "Croisière",
    "phase.Descending": "Descente", "phase.Waiting": "En attente",
    "tickets.title": "Mes billets",
    "tickets.note": "Vos billets sont enregistrés sur cet appareil : vous pouvez les retrouver à tout moment.",
    "tickets.empty": "Aucun billet. Choisissez un vol et réservez un siège.",
    "ticket.confirmed": "Confirmé", "ticket.checkedin": "Enregistré", "ticket.cancelled": "Annulé",
    "ticket.passenger": "Passager", "ticket.seat": "Siège", "ticket.cabin": "Cabine",
    "ticket.group": "Embarquement", "ticket.price": "Total", "ticket.booked": "Réservé le",
    "ticket.download": "Télécharger", "ticket.checkin": "S'enregistrer", "ticket.cancel": "Annuler",
    "ticket.cancelConfirm": "Annuler le billet {ref} ?",
    "admin.title": "Espace personnel",
    "admin.note": "Réservé au personnel SkyPort.",
    "admin.cardTitle": "Personnel au sol",
    "admin.cardNote": "Connectez-vous pour voir l'état de la flotte et les ventes de billets.",
    "admin.point1": "Combien d'avions sont en vol, et où",
    "admin.point2": "Billets vendus, enregistrements et recettes",
    "admin.point3": "Déconnexion automatique au bout d'une heure",
    "admin.user": "Utilisateur", "admin.pass": "Mot de passe", "admin.login": "Se connecter",
    "admin.logout": "Se déconnecter", "admin.hint": "Démo : admin / skyport-admin",
    "admin.invalid": "Utilisateur ou mot de passe incorrect.", "admin.signed": "Connecté en tant que {user}",
    "admin.airborne": "En vol", "admin.alt": "Altitude moy.", "admin.revenue": "Recettes",
    "admin.bookings": "Réservations", "admin.confirmed": "Confirmées", "admin.checkedin": "Enregistrées",
    "admin.cancelled": "Annulées", "admin.fleet": "Flotte", "admin.flight": "Vol",
    "admin.phase": "Phase", "admin.altCol": "Altitude", "admin.spdCol": "Vitesse",
    "dlg.kicker": "Réservation SkyPort", "dlg.title": "Réserver un siège",
    "dlg.step1": "Passager", "dlg.step2": "Siège", "dlg.step3": "Vérification",
    "dlg.name": "Nom du passager", "dlg.namePh": "Comme sur votre passeport",
    "dlg.email": "E-mail", "dlg.emailPh": "vous@exemple.com", "dlg.cabin": "Cabine",
    "dlg.seat": "Choisir un siège", "dlg.anySeat": "Choisir pour moi",
    "dlg.seatNote": "Facultatif. Les sièges avec un point doré ont un supplément.",
    "dlg.route": "Trajet", "dlg.passenger": "Passager", "dlg.base": "Tarif de base",
    "dlg.taxes": "Taxes", "dlg.fees": "Frais de siège et service", "dlg.total": "Total",
    "dlg.seatChosen": "Siège {seat}", "dlg.auto": "Attribué à l'enregistrement",
    "legend.free": "Libre", "legend.taken": "Occupé", "legend.picked": "Choisi", "legend.plus": "Supplément",
    "checkin.kicker": "Embarquement", "checkin.title": "Enregistrement",
    "checkin.hint": "Choisissez un siège libre ou gardez le vôtre.",
    "checkin.confirm": "Confirmer l'enregistrement", "checkin.note": "Siège {seat} sélectionné.",
    "btn.book": "Réserver", "btn.back": "Retour", "btn.cancel": "Annuler", "btn.continue": "Continuer",
    "btn.confirm": "Confirmer la réservation", "btn.booking": "Réservation…", "btn.loading": "Chargement…",
    "seat.none": "Plus de sièges dans cette cabine.",
    "cls.ECONOMY": "Économie", "cls.BUSINESS": "Business", "cls.FIRST": "Première",
    "toast.booked": "Siège {seat} réservé — référence {ref}.",
    "toast.cancelled": "Billet {ref} annulé.",
    "toast.checkedin": "Enregistré. Embarquement groupe {group}.",
    "toast.retry": "Une erreur est survenue. Réessayez.",
    "toast.pdfMissing": "Le fichier du billet n'a pas pu être créé. Vérifiez votre connexion.",
    "toast.login": "Connecté en tant que {user}.",
    "footer.note": "SkyPort est une démo. Les vols sont simulés et les réservations sont enregistrées.",
    "fmt.left": "{m} restant", "fmt.seats": "{n} sièges", "fmt.onTime": "{n}% à l'heure",
    "theme.toDark": "Passer en mode sombre", "theme.toLight": "Passer en mode clair",
    "top.label": "Retour en haut",
    "unit.kts": "kts", "unit.fpm": "ft/min", "unit.deg": "°"
  },
  ar: {
    "meta.title": "سكايبورت — رحلات مباشرة وحجز",
    "brand.tag": "تونس–قرطاج",
    "nav.track": "مباشر", "nav.board": "الرحلات", "nav.tickets": "التذاكر", "nav.admin": "الطاقم",
    "status.connecting": "جارٍ الاتصال", "status.live": "مباشر", "status.reconnecting": "إعادة الاتصال",
    "hero.eyebrow": "شبكة مباشرة · البحر المتوسط",
    "hero.title": "رحلات فوق البحر الأبيض المتوسط، تُتابع ثانية بثانية.",
    "hero.sub": "تابع أسطول سكايبورت لحظيًا، وقارن الدرجات، واختر مقعدك، وسجّل وصولك — من صفحة واحدة.",
    "hero.airborne": "في الجو الآن", "hero.alt": "متوسط الارتفاع", "hero.seats": "مقاعد متاحة", "hero.onTime": "متوسط الانتظام",
    "planner.title": "خطط لرحلة", "planner.badge": "9 مسارات",
    "planner.from": "من", "planner.to": "إلى", "planner.cabin": "الدرجة",
    "planner.search": "ابحث عن رحلات", "planner.any": "كل الوجهات",
    "planner.note": "{n} من {total} رحلة مطابقة.",
    "track.title": "العمليات المباشرة",
    "track.note": "كل طائرة على هذه الخريطة تتحرك لحظيًا — دون حاجة لتحديث الصفحة.",
    "map.dest": "الوجهة", "map.route": "المسار",
    "inspect.flight": "الرحلة", "inspect.book": "احجز هذه الرحلة",
    "gauge.alt": "الارتفاع، قدم", "gauge.spd": "السرعة، عقدة", "gauge.hdg": "الاتجاه", "gauge.eta": "الوصول بعد",
    "micro.wind": "الريح", "micro.temp": "الخارج", "micro.fuel": "الوقود", "micro.vs": "معدل الصعود",
    "feed.title": "نشاط مباشر", "feed.empty": "لا نشاط بعد. احجز مقعدًا لعرض الأحداث.",
    "feed.BOOKED": "تم الحجز", "feed.CANCELLED": "أُلغي", "feed.CHECKED_IN": "تم تسجيل الوصول",
    "board.title": "المغادرات",
    "board.note": "الأسعار المعروضة بالدرجة الاقتصادية. درجتا الأعمال والأولى أغلى، وبعض المقاعد عليها رسم بسيط.",
    "board.search": "ابحث عن رحلة أو مدينة أو بوابة…", "board.count": "{n} رحلات",
    "board.noMatch": "لا رحلات مطابقة لهذه المرشحات.", "board.loading": "جارٍ تحميل الرحلات…",
    "board.base": "السعر الأساسي", "board.gate": "البوابة {gate}",
    "board.onTime": "انتظام {n}%", "board.seats": "{n} مقعدًا",
    "phase.ALL": "كل الرحلات", "phase.Climbing": "صعود", "phase.Cruising": "تحليق",
    "phase.Descending": "هبوط", "phase.Waiting": "بانتظار الإشارة",
    "tickets.title": "تذاكرتي",
    "tickets.note": "تُحفظ تذاكرك على هذا الجهاز لتعود إليها في أي وقت.",
    "tickets.empty": "لا تذاكر. اختر رحلة واحجز مقعدًا.",
    "ticket.confirmed": "مؤكدة", "ticket.checkedin": "تم التسجيل", "ticket.cancelled": "ملغاة",
    "ticket.passenger": "الراكب", "ticket.seat": "المقعد", "ticket.cabin": "الدرجة",
    "ticket.group": "مجموعة الصعود", "ticket.price": "الإجمالي", "ticket.booked": "تاريخ الحجز",
    "ticket.download": "تنزيل", "ticket.checkin": "تسجيل الوصول", "ticket.cancel": "إلغاء",
    "ticket.cancelConfirm": "إلغاء التذكرة {ref}؟",
    "admin.title": "منطقة الطاقم",
    "admin.note": "لطاقم سكايبورت فقط.",
    "admin.cardTitle": "طاقم الأرض",
    "admin.cardNote": "سجّل الدخول لمعرفة حالة الأسطول ومبيعات التذاكر.",
    "admin.point1": "عدد الطائرات في الجو وأماكنها",
    "admin.point2": "التذاكر المباعة والتسجيلات والإيرادات",
    "admin.point3": "يتم تسجيل خروجك تلقائيًا بعد ساعة",
    "admin.user": "المستخدم", "admin.pass": "كلمة المرور", "admin.login": "دخول",
    "admin.logout": "خروج", "admin.hint": "دخول تجريبي: admin / skyport-admin",
    "admin.invalid": "مستخدم أو كلمة مرور غير صحيحة.", "admin.signed": "متصل باسم {user}",
    "admin.airborne": "في الجو", "admin.alt": "متوسط الارتفاع", "admin.revenue": "الإيرادات",
    "admin.bookings": "الحجوزات", "admin.confirmed": "مؤكدة", "admin.checkedin": "مسجّلة",
    "admin.cancelled": "ملغاة", "admin.fleet": "الأسطول", "admin.flight": "الرحلة",
    "admin.phase": "المرحلة", "admin.altCol": "الارتفاع", "admin.spdCol": "السرعة",
    "dlg.kicker": "حجز سكايبورت", "dlg.title": "احجز مقعدًا",
    "dlg.step1": "الراكب", "dlg.step2": "المقعد", "dlg.step3": "المراجعة",
    "dlg.name": "اسم الراكب", "dlg.namePh": "كما في جواز سفرك",
    "dlg.email": "البريد الإلكتروني", "dlg.emailPh": "you@example.com", "dlg.cabin": "الدرجة",
    "dlg.seat": "اختر مقعدًا", "dlg.anySeat": "اختر لي",
    "dlg.seatNote": "اختياري. المقاعد ذات النقطة الذهبية عليها رسم إضافي.",
    "dlg.route": "المسار", "dlg.passenger": "الراكب", "dlg.base": "السعر الأساسي",
    "dlg.taxes": "الضرائب", "dlg.fees": "رسوم المقعد والخدمة", "dlg.total": "الإجمالي",
    "dlg.seatChosen": "المقعد {seat}", "dlg.auto": "يُحدد عند التسجيل",
    "legend.free": "متاح", "legend.taken": "محجوز", "legend.picked": "مختار", "legend.plus": "رسم إضافي",
    "checkin.kicker": "الصعود", "checkin.title": "تسجيل الوصول",
    "checkin.hint": "اختر مقعدًا متاحًا أو أبقِ مقعدك.",
    "checkin.confirm": "تأكيد التسجيل", "checkin.note": "تم اختيار المقعد {seat}.",
    "btn.book": "احجز", "btn.back": "رجوع", "btn.cancel": "إلغاء", "btn.continue": "متابعة",
    "btn.confirm": "تأكيد الحجز", "btn.booking": "جارٍ الحجز…", "btn.loading": "جارٍ التحميل…",
    "seat.none": "لا مقاعد متاحة في هذه الدرجة.",
    "cls.ECONOMY": "اقتصادية", "cls.BUSINESS": "أعمال", "cls.FIRST": "أولى",
    "toast.booked": "تم حجز المقعد {seat} — المرجع {ref}.",
    "toast.cancelled": "أُلغيت التذكرة {ref}.",
    "toast.checkedin": "تم التسجيل. مجموعة الصعود {group}.",
    "toast.retry": "حدث خطأ. أعد المحاولة.",
    "toast.pdfMissing": "تعذّر إنشاء ملف التذكرة. تحقق من اتصالك.",
    "toast.login": "متصل باسم {user}.",
    "footer.note": "سكايبورت تجريبي. الرحلات محاكاة والحجوزات محفوظة.",
    "fmt.left": "باقٍ {m}", "fmt.seats": "{n} مقعدًا", "fmt.onTime": "انتظام {n}%",
    "theme.toDark": "التبديل إلى الوضع الليلي", "theme.toLight": "التبديل إلى الوضع النهاري",
    "top.label": "العودة إلى الأعلى",
    "unit.kts": "عقدة", "unit.fpm": "قدم/د", "unit.deg": "°"
  }
};

let lang = localStorage.getItem(LANG_KEY) || "en";
if (!I18N[lang]) lang = "en";
const t = key => (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
const tr = (key, vars = {}) => {
  let out = t(key);
  for (const k in vars) out = out.split("{" + k + "}").join(vars[k]);
  return out;
};

/* ---------- state ---------- */
const state = {
  flights: [],
  tele: {},
  selected: null,
  tickets: [],
  ticketsLoaded: false,
  query: "",
  phase: "ALL",
  filterFrom: "",
  filterTo: "",
  cabin: "ECONOMY",
  liveStatus: "connecting",
  stats: null,
  feed: [],
  booking: null,
  checkin: null,
  admin: { token: sessionStorage.getItem(TOKEN_KEY), user: sessionStorage.getItem(USER_KEY), stats: null }
};

/* ---------- helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n, digits = 2) => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const number = n => Number(n || 0).toLocaleString("en-US");
const dur = minutes => `${Math.floor(minutes / 60)}h ${String(Math.round(minutes % 60)).padStart(2, "0")}m`;
const flightOf = no => state.flights.find(f => f.flightNumber === no);
const locale = () => lang === "ar" ? "ar-TN" : lang === "fr" ? "fr-FR" : "en-GB";
const fmtDate = iso => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString(locale(), { dateStyle: "medium", timeStyle: "short" }); }
  catch { return iso; }
};
const fmtTime = iso => {
  try { return new Date(iso).toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
};

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const res = await fetch(path, { ...options, headers });
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok) {
    let message = (data && data.error) || t("toast.retry");
    if (res.status === 401 && !data) message = t("admin.invalid");
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data;
}

let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 4000);
}

/* ---------- theme ---------- */
const themeBtn = $("#themeBtn");

function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function syncThemeLabel() {
  if (!themeBtn) return;
  const dark = currentTheme() === "dark";
  const label = t(dark ? "theme.toLight" : "theme.toDark");
  themeBtn.setAttribute("aria-label", label);
  themeBtn.setAttribute("title", label);
  themeBtn.setAttribute("aria-pressed", String(dark));
}

function setTheme(next, persist) {
  document.documentElement.dataset.theme = next === "dark" ? "dark" : "light";
  if (persist) {
    try { localStorage.setItem(THEME_KEY, next === "dark" ? "dark" : "light"); } catch { /* storage blocked */ }
  }
  syncThemeLabel();
}

/* ---------- back to top ---------- */
const toTop = $("#toTop");
function syncToTop() { toTop.classList.toggle("show", window.scrollY > 420); }
window.addEventListener("scroll", syncToTop, { passive: true });

/* ---------- i18n wiring ---------- */
function setLang(next) {
  if (!I18N[next]) return;
  lang = next;
  localStorage.setItem(LANG_KEY, next);
  $$(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === next));
  populatePlanner(true);
  applyI18n();
}

function applyI18n() {
  $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  syncThemeLabel();
  if (toTop) {
    toTop.setAttribute("aria-label", t("top.label"));
    toTop.setAttribute("title", t("top.label"));
  }
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", lang === "ar");

  const liveLabel = $("#live span");
  if (liveLabel) liveLabel.textContent = t("status." + state.liveStatus);

  renderCabins();
  renderPhaseChips();
  renderBoard();
  if (state.ticketsLoaded) renderTickets();
  renderFeed();
  renderAdminStats();
  if (state.booking) {
    renderBookingCabins();
    renderSteps();
    renderBookingSeats();
    renderTotal();
    renderReview();
  }
  if (state.checkin && state.checkin.seatMap) {
    $("#ciSeatMap").innerHTML = seatMapHtml(state.checkin.seatMap, state.checkin.seat);
  }
  setTimeout(() => { if (map) map.invalidateSize(); }, 200);
}

/* ---------- map ---------- */
let map;
const routeLines = {};
const planeMarkers = {};
const TUN = [36.851, 10.227];

function planeIcon(heading, selected) {
  return L.divIcon({
    className: "plane-divicon" + (selected ? " sel" : ""),
    html: `<div class="plane-rot" style="transform:rotate(${heading || 0}deg)">${PLANE}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
}

function initMap() {
  map = L.map("map", { scrollWheelZoom: true, minZoom: 2, zoomControl: true, attributionControl: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
}

function renderMap() {
  if (!map) return;
  L.circleMarker(TUN, { radius: 7, color: "#B11226", weight: 2, fillColor: "#B11226", fillOpacity: 1 })
    .addTo(map)
    .bindTooltip("TUN · Tunis", { permanent: true, direction: "right", className: "airport-tip hub-tip", offset: [6, 0] });

  const bounds = L.latLngBounds([TUN]);
  state.flights.forEach(f => {
    L.circleMarker([f.destLat, f.destLon], { radius: 5, color: "#C9A227", weight: 2, fillColor: "#fff", fillOpacity: 1 })
      .addTo(map)
      .bindTooltip(`${f.destination} · ${f.destinationCity}`, { permanent: true, direction: "right", className: "airport-tip", offset: [6, 0] });
    routeLines[f.flightNumber] = L.polyline(
      [[f.originLat, f.originLon], [f.destLat, f.destLon]],
      { color: "#C9A227", weight: 1.5, dashArray: "2 6", opacity: .6 }
    ).addTo(map);
    planeMarkers[f.flightNumber] = L.marker([f.originLat, f.originLon], { icon: planeIcon(0, false), zIndexOffset: 1000 }).addTo(map);
    planeMarkers[f.flightNumber].on("click", () => select(f.flightNumber));
    bounds.extend([f.destLat, f.destLon]);
  });
  map.fitBounds(bounds, { padding: [30, 30] });
}

function highlightRoute(no) {
  Object.keys(routeLines).forEach(key => {
    routeLines[key].setStyle({ color: "#C9A227", weight: 1.5, dashArray: "2 6", opacity: .6 });
  });
  if (routeLines[no]) routeLines[no].setStyle({ color: "#B11226", weight: 3, dashArray: null, opacity: .9 });
}

/* ---------- flights / board ---------- */
function visibleFlights() {
  const q = state.query.trim().toLowerCase();
  return state.flights.filter(f => {
    if (state.filterFrom && f.origin !== state.filterFrom) return false;
    if (state.filterTo && f.destination !== state.filterTo) return false;
    if (state.phase !== "ALL") {
      const tel = state.tele[f.flightNumber];
      if ((tel ? tel.phase : "Waiting") !== state.phase) return false;
    }
    if (!q) return true;
    return [f.flightNumber, f.origin, f.originCity, f.destination, f.destinationCity, f.gate]
      .some(v => String(v == null ? "" : v).toLowerCase().includes(q));
  });
}

function renderBoard() {
  const box = $("#boardRows");
  const count = $("#boardCount");
  if (!state.flights.length) {
    if (count) count.textContent = "";
    if (box) box.innerHTML = `<div class="empty">${t("board.loading")}</div>`;
    return;
  }
  const list = visibleFlights();
  if (count) count.textContent = tr("board.count", { n: list.length });
  if (!list.length) {
    box.innerHTML = `<div class="empty">${t("board.noMatch")}</div>`;
    return;
  }
  box.innerHTML = list.map(f => {
    const tel = state.tele[f.flightNumber];
    const phase = tel ? tel.phase : "Waiting";
    const progress = tel ? (tel.progress * 100).toFixed(1) : 0;
    const eta = tel ? tr("fmt.left", { m: dur(tel.etaMinutes) }) : "";
    return `<article class="flight-row${f.flightNumber === state.selected ? " sel" : ""}" role="listitem" tabindex="0" data-no="${f.flightNumber}">
      <div class="fr-no"><b>${f.flightNumber}</b><span>${esc(f.aircraft)}</span></div>
      <div class="fr-route" dir="ltr">
        <div><b>${f.origin}</b><span>${esc(f.originCity)}</span></div>
        <i>&rarr;</i>
        <div><b>${f.destination}</b><span>${esc(f.destinationCity)}</span></div>
      </div>
      <div class="fr-status">
        <div class="bar"><span style="width:${progress}%"></span></div>
        <div class="fr-status-meta"><span class="phase-txt">${t("phase." + phase)}</span><span class="eta-txt">${eta}</span></div>
      </div>
      <div class="fr-facts">
        <span>${tr("board.gate", { gate: esc(f.gate) })}</span>
        <span>${tr("board.onTime", { n: f.onTimePercent })}</span>
        <span>${tr("board.seats", { n: f.seatsAvailable })}</span>
      </div>
      <div class="fr-price"><b>${money(f.basePrice, 0)}</b><span>${t("board.base")}</span></div>
      <div class="go"><button class="btn primary small" data-book="${f.flightNumber}" type="button">${t("btn.book")}</button></div>
    </article>`;
  }).join("");
}

function markSelected() {
  $$(".flight-row").forEach(row => row.classList.toggle("sel", row.dataset.no === state.selected));
}

function select(no) {
  const flight = flightOf(no);
  if (!flight) return;
  state.selected = no;
  markSelected();
  highlightRoute(no);
  $("#pFlight").textContent = flight.flightNumber;
  $("#pRoute").textContent = `${flight.originCity} → ${flight.destinationCity} · ${dur(flight.durationMinutes)}`;
  $("#pFare").textContent = `${t("cls.ECONOMY")} · ${t("board.base")} ${money(flight.basePrice, 0)}`;
  paintPanel();
  const tel = state.tele[no];
  if (map && tel) map.panTo([tel.latitude, tel.longitude], { animate: true });
}

function paintPanel() {
  const tel = state.tele[state.selected];
  if (!tel) return;
  $("#pAlt").textContent = number(tel.altitudeFt);
  $("#pSpd").textContent = number(tel.speedKts);
  $("#pHdg").textContent = tel.headingDeg + "°";
  $("#pEta").textContent = dur(tel.etaMinutes);
  $("#pWind").textContent = `${tel.windKts} ${t("unit.kts")}`;
  $("#pTemp").textContent = `${tel.outsideTempC}°C`;
  $("#pFuel").textContent = `${tel.fuelPercent}%`;
  $("#pVs").textContent = `${tel.verticalSpeedFpm > 0 ? "+" : ""}${number(tel.verticalSpeedFpm)} ${t("unit.fpm")}`;
  const phase = $("#pPhase");
  phase.textContent = t("phase." + tel.phase);
  phase.className = "phase " + tel.phase;
  $("#pBar").style.width = (tel.progress * 100).toFixed(1) + "%";
}

function applyTelemetry(tel) {
  if (!tel || !tel.flightNumber) return;
  state.tele[tel.flightNumber] = tel;
  const row = $(`.flight-row[data-no="${tel.flightNumber}"]`);
  if (row) {
    const fill = $(".bar span", row);
    if (fill) fill.style.width = (tel.progress * 100).toFixed(1) + "%";
    const phaseText = $(".phase-txt", row);
    if (phaseText) phaseText.textContent = t("phase." + tel.phase);
    const etaText = $(".eta-txt", row);
    if (etaText) etaText.textContent = tr("fmt.left", { m: dur(tel.etaMinutes) });
  }
  const marker = planeMarkers[tel.flightNumber];
  if (marker) {
    marker.setLatLng([tel.latitude, tel.longitude]);
    marker.setIcon(planeIcon(tel.headingDeg, tel.flightNumber === state.selected));
  }
  if (tel.flightNumber === state.selected) paintPanel();
}

function connectStream() {
  const live = $("#live");
  const label = $("#live span");
  const es = new EventSource("/api/telemetry/stream");
  es.onopen = () => {
    state.liveStatus = "live";
    live.classList.add("on");
    label.textContent = t("status.live");
  };
  es.onmessage = event => {
    try { applyTelemetry(JSON.parse(event.data)); } catch { /* ignore malformed frame */ }
  };
  es.onerror = () => {
    state.liveStatus = "reconnecting";
    live.classList.remove("on");
    label.textContent = t("status.reconnecting");
  };
}

async function loadStats() {
  try {
    const stats = await api("/api/fleet/stats");
    state.stats = stats;
    $("#statAirborne").textContent = number(stats.airborne);
    $("#statAlt").textContent = number(stats.avgAltitudeFt);
    $("#statSeats").textContent = number(stats.seatsAvailable);
    $("#statOnTime").textContent = number(stats.avgOnTimePercent) + "%";
    renderAdminStats();
  } catch { /* the hero keeps its last values */ }
}

/* ---------- planner + filters ---------- */
function populatePlanner(preserve) {
  const from = $("#plFrom");
  const to = $("#plTo");
  if (!from || !to) return;
  const keepFrom = preserve ? from.value : "";
  const keepTo = preserve ? to.value : "";
  const origins = [...new Set(state.flights.map(f => f.origin))];
  const destinations = [...new Set(state.flights.map(f => f.destination))];
  from.innerHTML = origins.map(o => {
    const f = state.flights.find(x => x.origin === o);
    return `<option value="${o}">${o} · ${esc(f ? f.originCity : "")}</option>`;
  }).join("");
  to.innerHTML = `<option value="">${t("planner.any")}</option>` + destinations.map(d => {
    const f = state.flights.find(x => x.destination === d);
    return `<option value="${d}">${d} · ${esc(f ? f.destinationCity : "")}</option>`;
  }).join("");
  if (keepFrom && origins.includes(keepFrom)) from.value = keepFrom;
  if (keepTo) to.value = keepTo;
}

function renderCabins() {
  const box = $("#plannerCabins");
  if (!box) return;
  box.innerHTML = CABINS.map(c =>
    `<button type="button" class="chip${state.cabin === c ? " active" : ""}" data-cabin="${c}">${t("cls." + c)}${CABIN_HINT[c] ? `<small>${CABIN_HINT[c]}</small>` : ""}</button>`
  ).join("");
}

function renderPhaseChips() {
  const box = $("#phaseChips");
  if (!box) return;
  box.innerHTML = PHASES.map(p =>
    `<button type="button" class="chip${state.phase === p ? " active" : ""}" data-phase="${p}">${t("phase." + p)}</button>`
  ).join("");
}

/* ---------- booking ---------- */
function saveRef(ref) {
  let refs = [];
  try { refs = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { refs = []; }
  refs = [ref, ...refs.filter(r => r !== ref)];
  try { localStorage.setItem(STORE_KEY, JSON.stringify(refs)); } catch { /* storage blocked */ }
}

function openBooking(no) {
  const flight = flightOf(no);
  if (!flight) return;
  state.booking = { flight, cabin: state.cabin, seat: "", seatMap: null, quote: null, step: 1 };
  $("#bkRoute").textContent = `${flight.flightNumber} · ${flight.originCity} → ${flight.destinationCity}`;
  $("#bkName").value = localStorage.getItem(NAME_KEY) || "";
  $("#bkEmail").value = localStorage.getItem(EMAIL_KEY) || "";
  $("#bkError").hidden = true;
  $("#bkSeatNote").textContent = t("dlg.seatNote");
  renderBookingCabins();
  goStep(1);
  $("#bookDialog").showModal();
}

function renderBookingCabins() {
  const booking = state.booking;
  if (!booking) return;
  $("#bkCabins").innerHTML = CABINS.map(c =>
    `<button type="button" class="chip${booking.cabin === c ? " active" : ""}" data-bk-cabin="${c}">${t("cls." + c)}${CABIN_HINT[c] ? `<small>${CABIN_HINT[c]}</small>` : ""}</button>`
  ).join("");
}

function renderSteps() {
  const booking = state.booking;
  if (!booking) return;
  const labels = ["dlg.step1", "dlg.step2", "dlg.step3"];
  $("#bkSteps").innerHTML = labels.map((key, index) => {
    const n = index + 1;
    const cls = n === booking.step ? "active" : n < booking.step ? "done" : "";
    return `<div class="step ${cls}"><b>${n}</b>${t(key)}</div>`;
  }).join("");
}

function goStep(n) {
  const booking = state.booking;
  if (!booking) return;
  booking.step = n;
  $$("#bookDialog .step-panel").forEach(panel => { panel.hidden = Number(panel.dataset.step) !== n; });
  renderSteps();
  $("#bkBack").hidden = n === 1;
  $("#bkNext").hidden = n === 3;
  $("#bkSubmit").hidden = n !== 3;
  $("#bkError").hidden = true;
  if (n === 2) loadSeatMap();
  if (n === 3) { renderReview(); refreshQuote(); }
}

async function loadSeatMap() {
  const booking = state.booking;
  if (!booking) return;
  $("#bkSeatMap").innerHTML = `<p class="seat-note">${t("btn.loading")}</p>`;
  try {
    booking.seatMap = await api(`/api/seats?flightNumber=${encodeURIComponent(booking.flight.flightNumber)}&seatClass=${encodeURIComponent(booking.cabin)}`);
    renderBookingSeats();
  } catch (error) {
    $("#bkSeatMap").innerHTML = `<p class="seat-note">${esc(error.message)}</p>`;
  }
}

function renderBookingSeats() {
  const booking = state.booking;
  if (!booking) return;
  const box = $("#bkSeatMap");
  if (!booking.seatMap) return;
  box.innerHTML = seatMapHtml(booking.seatMap, booking.seat);
  $("#bkSeatNote").textContent = booking.seat
    ? tr("checkin.note", { seat: booking.seat })
    : t("dlg.seatNote");
}

function seatMapHtml(mapData, selected) {
  const seats = (mapData && mapData.seats) || [];
  if (!seats.length) return `<p class="seat-note">${t("seat.none")}</p>`;
  const rows = [...new Set(seats.map(s => Number(String(s.number).replace(/\D/g, ""))))].sort((a, b) => a - b);
  const letters = [...new Set(seats.map(s => String(s.number).replace(/\d/g, "")))];
  const cols = [];
  letters.forEach(letter => {
    cols.push(letter);
    if (letter === "C") cols.push("aisle");
  });
  const lookup = new Map(seats.map(s => [s.number, s]));

  const head = `<div class="seat-row head"><span class="rownum"></span>${
    cols.map(c => c === "aisle" ? `<span class="aisle"></span>` : `<span class="col">${c}</span>`).join("")
  }</div>`;

  const body = rows.map(row => {
    const cells = cols.map(c => {
      if (c === "aisle") return `<span class="aisle"></span>`;
      const seat = lookup.get(row + c);
      if (!seat) return `<span class="seat empty"></span>`;
      const picked = seat.number === selected;
      const classes = ["seat", seat.taken ? "taken" : "", picked ? "picked" : "", Number(seat.extra) > 0 ? "plus" : ""]
        .filter(Boolean).join(" ");
      const extra = Number(seat.extra) > 0 ? ` · +${money(seat.extra, 0)}` : "";
      return `<button type="button" class="${classes}" data-seat="${seat.number}" aria-label="${seat.number}${extra}"
        title="${seat.number}${extra}" ${seat.taken && !picked ? "disabled" : ""}>${c}</button>`;
    }).join("");
    return `<div class="seat-row"><span class="rownum">${row}</span>${cells}</div>`;
  }).join("");

  return head + body;
}

async function refreshQuote() {
  const booking = state.booking;
  if (!booking) return;
  try {
    booking.quote = await api("/api/fare/quote", {
      method: "POST",
      body: JSON.stringify({
        flightNumber: booking.flight.flightNumber,
        seatClass: booking.cabin,
        passengers: 1,
        seat: booking.seat || ""
      })
    });
    renderTotal();
    renderReview();
  } catch (error) {
    $("#bkError").textContent = error.message;
    $("#bkError").hidden = false;
  }
}

function renderTotal() {
  const booking = state.booking;
  if (!booking) return;
  const el = $("#bkTotal");
  el.innerHTML = booking.quote
    ? `<span>${t("dlg.total")}</span><b>${money(booking.quote.total)}</b>`
    : "";
}

function renderReview() {
  const booking = state.booking;
  if (!booking) return;
  const box = $("#bkReview");
  if (!box) return;
  const quote = booking.quote;
  const row = (label, value, cls = "") =>
    `<div class="review-row ${cls}"><span>${label}</span><b>${value}</b></div>`;
  box.innerHTML =
    row(t("dlg.route"), `<span dir="ltr">${esc(booking.flight.flightNumber)} · ${booking.flight.origin} → ${booking.flight.destination}</span>`) +
    row(t("dlg.passenger"), esc($("#bkName").value.trim() || "—")) +
    row(t("dlg.cabin"), t("cls." + booking.cabin)) +
    row(t("ticket.seat"), booking.seat ? esc(booking.seat) : t("dlg.auto")) +
    (quote
      ? row(t("dlg.base"), money(quote.baseFare)) +
        row(t("dlg.taxes"), money(quote.taxes)) +
        row(t("dlg.fees"), money(quote.fees)) +
        row(t("dlg.total"), money(quote.total) + " " + esc(quote.currency || "USD"), "total")
      : `<div class="review-row"><span>${t("btn.loading")}</span></div>`);
}

/* ---------- tickets ---------- */
const readRefs = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; }
};

async function loadTickets() {
  const refs = readRefs();
  const email = localStorage.getItem(EMAIL_KEY);
  let list = [];
  try {
    if (email) {
      const result = await api("/api/bookings?email=" + encodeURIComponent(email));
      list = result.bookings || [];
      const known = new Set(list.map(b => b.reference));
      const missing = refs.filter(r => !known.has(r));
      const extra = await Promise.all(missing.map(r => api("/api/bookings/" + encodeURIComponent(r)).catch(() => null)));
      list = list.concat(extra.filter(Boolean));
    } else {
      list = (await Promise.all(refs.map(r => api("/api/bookings/" + encodeURIComponent(r)).catch(() => null)))).filter(Boolean);
    }
  } catch {
    list = (await Promise.all(refs.map(r => api("/api/bookings/" + encodeURIComponent(r)).catch(() => null)))).filter(Boolean);
  }
  state.tickets = list;
  state.ticketsLoaded = true;
  renderTickets();
}

function barcode(ref) {
  let out = "";
  for (const ch of ref + ref) {
    out += `<i style="width:${1 + (ch.charCodeAt(0) % 4)}px"></i><i style="width:2px;background:transparent"></i>`;
  }
  return out;
}

function renderTickets() {
  const list = $("#ticketList");
  if (!list) return;
  if (!state.tickets.length) {
    list.innerHTML = `<div class="empty">${t("tickets.empty")}</div>`;
    return;
  }
  list.innerHTML = state.tickets.map(b => {
    const flight = flightOf(b.flightNumber) || {};
    const status = b.status || "CONFIRMED";
    const cancelled = status === "CANCELLED";
    const checked = status === "CHECKED_IN";
    return `<article class="pass${cancelled ? " cancelled" : ""}">
      <div class="pass-main">
        <div class="pass-top">
          <span class="pass-brand">SKYPORT</span>
          <span class="pass-status${cancelled ? " cancelled" : ""}">${cancelled ? t("ticket.cancelled") : checked ? t("ticket.checkedin") : t("ticket.confirmed")}</span>
          <b>${esc(b.flightNumber)}</b>
        </div>
        <div class="pass-route" dir="ltr">
          <div class="ap"><b>${esc(flight.origin || "---")}</b><small>${esc(flight.originCity || "")}</small></div>
          <span class="arr">&#9992;</span>
          <div class="ap"><b>${esc(flight.destination || "---")}</b><small>${esc(flight.destinationCity || "")}</small></div>
          <div class="seat-tag">${t("ticket.seat")}<b>${esc(b.seat || "—")}</b></div>
        </div>
        <dl class="pass-grid">
          <div><dt>${t("ticket.passenger")}</dt><dd>${esc(b.passengerName)}</dd></div>
          <div><dt>${t("ticket.cabin")}</dt><dd>${esc(t("cls." + b.seatClass))}</dd></div>
          <div><dt>${t("ticket.group")}</dt><dd>${esc(b.boardingGroup || "—")}</dd></div>
          <div><dt>${t("ticket.price")}</dt><dd>${money(b.price)}</dd></div>
          <div><dt>${t("ticket.booked")}</dt><dd>${esc(fmtDate(b.createdAt))}</dd></div>
        </dl>
      </div>
      <div class="pass-stub">
        <div>
          <div class="ref">${esc(b.reference)}</div>
          <div class="group">${t("ticket.group")}<b>${esc(b.boardingGroup || "—")}</b></div>
        </div>
        <div class="bars" aria-hidden="true">${barcode(b.reference)}</div>
        <div class="stub-actions">
          <button class="btn small" data-download="${esc(b.reference)}" type="button">${t("ticket.download")}</button>
          ${!cancelled && !checked ? `<button class="btn small" data-checkin="${esc(b.reference)}" type="button">${t("ticket.checkin")}</button>` : ""}
          ${!cancelled ? `<button class="btn small" data-cancel="${esc(b.reference)}" type="button">${t("ticket.cancel")}</button>` : ""}
        </div>
      </div>
    </article>`;
  }).join("");
}

async function cancelTicket(reference) {
  if (!confirm(tr("ticket.cancelConfirm", { ref: reference }))) return;
  try {
    await api("/api/bookings/" + encodeURIComponent(reference), { method: "DELETE" });
    toast(tr("toast.cancelled", { ref: reference }));
    await loadTickets();
  } catch (error) {
    toast(error.message);
  }
}

/* ---------- check-in ---------- */
function openCheckIn(reference) {
  const ticket = state.tickets.find(x => x.reference === reference);
  if (!ticket) return;
  state.checkin = { ticket, seat: ticket.seat, seatMap: null };
  $("#ciRoute").textContent = `${ticket.flightNumber} · ${t("cls." + ticket.seatClass)} · ${ticket.passengerName}`;
  $("#ciNote").textContent = t("checkin.hint");
  $("#ciError").hidden = true;
  $("#ciSeat").innerHTML = `<span>${t("ticket.seat")}</span><b>${esc(ticket.seat)}</b>`;
  $("#ciSeatMap").innerHTML = `<p class="seat-note">${t("btn.loading")}</p>`;
  $("#seatDialog").showModal();
  loadCheckInSeats();
}

async function loadCheckInSeats() {
  const checkin = state.checkin;
  if (!checkin) return;
  try {
    checkin.seatMap = await api(`/api/seats?flightNumber=${encodeURIComponent(checkin.ticket.flightNumber)}&seatClass=${encodeURIComponent(checkin.ticket.seatClass)}`);
    $("#ciSeatMap").innerHTML = seatMapHtml(checkin.seatMap, checkin.seat);
  } catch (error) {
    $("#ciSeatMap").innerHTML = `<p class="seat-note">${esc(error.message)}</p>`;
  }
}

/* ---------- live activity ---------- */
function renderFeed() {
  const list = $("#feed");
  if (!list) return;
  if (!state.feed.length) {
    list.innerHTML = `<li class="empty">${t("feed.empty")}</li>`;
    return;
  }
  list.innerHTML = state.feed.slice(0, 8).map(event => `
    <li>
      <i></i>
      <div class="feed-body">
        <b>${esc(t("feed." + event.type))}</b>
        <span>${esc(event.flightNumber || "")} · ${esc(event.reference || "")}</span>
      </div>
      <time>${fmtTime(event.at)}</time>
    </li>`).join("");
}

async function loadFeed() {
  try {
    const events = await api("/api/events");
    state.feed = Array.isArray(events) ? events : [];
    renderFeed();
  } catch { /* the stream will fill it */ }
}

function connectFeed() {
  const es = new EventSource("/api/events/stream");
  es.onmessage = event => {
    try {
      state.feed.unshift(JSON.parse(event.data));
      state.feed = state.feed.slice(0, 12);
      renderFeed();
    } catch { /* ignore malformed event */ }
  };
}

/* ---------- admin console ---------- */
function showAdminPanel() {
  $("#adminLogin").hidden = true;
  $("#adminPanel").hidden = false;
  $("#adminWho").textContent = tr("admin.signed", { user: state.admin.user || "admin" });
}

function logoutAdmin() {
  state.admin = { token: null, user: null, stats: null };
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  $("#adminLogin").hidden = false;
  $("#adminPanel").hidden = true;
}

async function loadAdmin() {
  if (!state.admin.token) return;
  try {
    state.admin.stats = await api("/api/admin/stats", {
      headers: { Authorization: "Bearer " + state.admin.token }
    });
    renderAdminStats();
  } catch (error) {
    if (error.status === 401) {
      logoutAdmin();
      $("#adminError").textContent = t("admin.invalid");
      $("#adminError").hidden = false;
    } else {
      toast(error.message);
    }
  }
}

function renderAdminStats() {
  const box = $("#adminStats");
  if (!box) return;
  const stats = state.admin.stats;
  if (!stats) return;
  const fleet = stats.fleet || {};
  const bookings = stats.bookings || {};
  const tile = (label, value) => `<div class="stat-tile"><b>${value}</b><span>${label}</span></div>`;
  box.innerHTML =
    tile(t("admin.airborne"), number(fleet.airborne)) +
    tile(t("admin.revenue"), money(bookings.revenue, 0)) +
    tile(t("admin.bookings"), number(bookings.totalBookings)) +
    tile(t("admin.confirmed"), number(bookings.confirmed)) +
    tile(t("admin.checkedin"), number(bookings.checkedIn)) +
    tile(t("admin.cancelled"), number(bookings.cancelled));

  const rows = state.flights.map(f => {
    const tel = state.tele[f.flightNumber] || {};
    return `<tr>
      <td>${f.flightNumber}</td>
      <td>${t("phase." + (tel.phase || "Waiting"))}</td>
      <td>${tel.altitudeFt == null ? "—" : number(tel.altitudeFt)}</td>
      <td>${tel.speedKts == null ? "—" : number(tel.speedKts)}</td>
    </tr>`;
  }).join("");
  $("#adminTable").innerHTML = `<table>
    <thead><tr>
      <th>${t("admin.flight")}</th><th>${t("admin.phase")}</th>
      <th>${t("admin.altCol")}</th><th>${t("admin.spdCol")}</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

/* ---------- PDF boarding pass ---------- */
function drawBarcode(doc, x, y, w, h, ref) {
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, w, h, "F");
  doc.setFillColor(35, 20, 32);
  let cx = x + 4;
  for (const ch of (ref + ref)) {
    const bw = 1 + (ch.charCodeAt(0) % 4);
    if (ch.charCodeAt(0) % 2) doc.rect(cx, y + 4, bw, h - 8, "F");
    cx += bw + 2;
    if (cx > x + w - 4) break;
  }
}

/* jsPDF's built-in fonts only cover Latin-1: anything outside it prints as
   garbage, so every string is cleaned before it reaches the page. */
function pdfSafe(value) {
  return String(value == null ? "" : value)
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/[^\u0020-\u00FF]/g, "")
    .trim();
}

/* Shrinks then truncates a string so it can never run past its column. */
function fitText(doc, value, maxWidth, size) {
  let text = pdfSafe(value) || "-";
  let fontSize = size;
  doc.setFontSize(fontSize);
  while (fontSize > 7 && doc.getTextWidth(text) > maxWidth) {
    fontSize = Math.max(7, fontSize - 0.5);
    doc.setFontSize(fontSize);
  }
  if (doc.getTextWidth(text) > maxWidth) {
    while (text.length > 1 && doc.getTextWidth(text + "...") > maxWidth) text = text.slice(0, -1);
    text = text.replace(/[\s.,;:/-]+$/, "") + "...";
  }
  return text;
}

function drawArrow(doc, x, y, width, color) {
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setFillColor(color[0], color[1], color[2]);
  doc.setLineWidth(1.4);
  doc.line(x, y, x + width - 8, y);
  doc.triangle(x + width, y, x + width - 9, y - 4.6, x + width - 9, y + 4.6, "F");
}

function downloadTicket(ticket) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    toast(t("toast.pdfMissing"));
    return;
  }
  const { jsPDF } = window.jspdf;
  const PAGE_W = 640, PAGE_H = 300, PAD = 32;
  const STUB_X = 452, STUB_W = PAGE_W - STUB_X, LEFT_W = STUB_X - PAD * 2;
  const COL_W = (LEFT_W - 18) / 2;
  /* orientation must be landscape: otherwise jsPDF swaps a wide custom format
     into a portrait page and the right-hand side of the ticket is clipped. */
  const doc = new jsPDF({ unit: "pt", orientation: "landscape", format: [PAGE_W, PAGE_H] });
  const flight = flightOf(ticket.flightNumber) || {};
  const RED = [177, 18, 38], GOLD = [201, 162, 39], INK = [35, 20, 32], SOFT = [107, 90, 99], WHITE = [255, 255, 255];
  const ink = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const fill = (c) => doc.setFillColor(c[0], c[1], c[2]);
  /* Arabic is written right to left and its glyphs are missing from the PDF
     fonts, so Arabic readers get the English wording on the printed ticket. */
  const dict = I18N[lang === "ar" ? "en" : lang] || I18N.en;
  const label = (key) => pdfSafe(dict[key] || I18N.en[key] || key);
  /* Arabic numerals would not survive the PDF font, so the date stays Latin. */
  const pdfDate = () => {
    if (!ticket.createdAt) return "-";
    try {
      return new Date(ticket.createdAt).toLocaleString(lang === "ar" ? "en-GB" : locale(), { dateStyle: "medium", timeStyle: "short" });
    } catch { return pdfSafe(ticket.createdAt); }
  };

  /* header */
  fill(RED); doc.rect(0, 0, PAGE_W, 58, "F");
  fill(GOLD); doc.rect(0, 58, PAGE_W, 3, "F");
  ink(WHITE); doc.setFont("helvetica", "bold"); doc.setFontSize(20);
  doc.text("SKYPORT", PAD, 37);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
  doc.text(ticket.status === "CHECKED_IN" ? "BOARDING PASS" : "E-TICKET", PAGE_W - PAD, 37, { align: "right" });

  /* route */
  const routeY = 108;
  ink(INK); doc.setFont("times", "bold");
  doc.text(fitText(doc, flight.origin || "---", 92, 30), PAD, routeY);
  ink(SOFT); doc.setFont("helvetica", "normal");
  doc.text(fitText(doc, String(flight.originCity || "").toUpperCase(), 110, 8.5), PAD, routeY + 16);

  drawArrow(doc, PAD + 122, routeY - 8, 34, GOLD);

  const destX = PAD + 172;
  ink(INK); doc.setFont("times", "bold");
  doc.text(fitText(doc, flight.destination || "---", 92, 30), destX, routeY);
  ink(SOFT); doc.setFont("helvetica", "normal");
  doc.text(fitText(doc, String(flight.destinationCity || "").toUpperCase(), STUB_X - PAD - destX, 8.5), destX, routeY + 16);

  ink(RED); doc.setFont("helvetica", "bold");
  doc.text(fitText(doc, ticket.flightNumber, 78, 18), STUB_X - PAD, routeY, { align: "right" });

  /* passenger details, two columns */
  const fields = [
    [label("ticket.passenger"), ticket.passengerName],
    [label("ticket.cabin"), label("cls." + ticket.seatClass)],
    [label("ticket.seat"), ticket.seat],
    [label("ticket.group"), ticket.boardingGroup]
  ];
  fields.forEach((field, index) => {
    const x = PAD + (index % 2) * (COL_W + 18);
    const y = 158 + Math.floor(index / 2) * 36;
    ink(SOFT); doc.setFont("helvetica", "bold");
    doc.text(fitText(doc, String(field[0]).toUpperCase(), COL_W, 7.5), x, y);
    ink(INK); doc.setFont("helvetica", "normal");
    doc.text(fitText(doc, field[1] || "-", COL_W, 13), x, y + 15);
  });

  /* booked + price */
  const footY = 240;
  ink(SOFT); doc.setFont("helvetica", "bold");
  doc.text(fitText(doc, label("ticket.booked").toUpperCase(), COL_W, 7.5), PAD, footY);
  ink(INK); doc.setFont("helvetica", "normal");
  doc.text(fitText(doc, pdfDate(), COL_W, 10.5), PAD, footY + 15);

  const priceX = PAD + COL_W + 18;
  ink(SOFT); doc.setFont("helvetica", "bold");
  doc.text(fitText(doc, label("ticket.price").toUpperCase(), COL_W, 7.5), priceX, footY);
  ink(GOLD); doc.setFont("helvetica", "bold");
  doc.text(fitText(doc, money(ticket.price), COL_W, 14), priceX, footY + 16);

  /* ticket stub */
  fill(RED); doc.rect(STUB_X, 61, STUB_W, PAGE_H - 61, "F");
  fill(GOLD); doc.rect(STUB_X, 61, 2, PAGE_H - 61, "F");
  const sx = STUB_X + 18, sw = STUB_W - 36;

  ink(WHITE); doc.setFont("helvetica", "bold");
  doc.text(fitText(doc, "REFERENCE", sw, 7.5), sx, 98);
  doc.setFont("times", "bold");
  doc.text(fitText(doc, ticket.reference, sw, 20), sx, 122);
  doc.setFont("helvetica", "bold");
  doc.text(fitText(doc, ticket.status === "CANCELLED" ? label("ticket.cancelled").toUpperCase()
    : ticket.status === "CHECKED_IN" ? label("ticket.checkedin").toUpperCase()
    : label("ticket.confirmed").toUpperCase(), sw, 9), sx, 140);

  drawBarcode(doc, sx, 154, sw, 46, ticket.reference);

  ink(WHITE); doc.setFont("helvetica", "normal");
  doc.text(fitText(doc, "SKYPORT - " + (flight.aircraft || ""), sw, 7.5), sx, 272);

  doc.save(`SkyPort-Ticket-${ticket.reference}.pdf`);
}

/* ---------- events ---------- */
function bindEvents() {
  $("#planner").addEventListener("submit", event => {
    event.preventDefault();
    state.filterFrom = $("#plFrom").value;
    state.filterTo = $("#plTo").value;
    state.phase = "ALL";
    renderPhaseChips();
    renderBoard();
    const flights = visibleFlights();
    $("#plannerNote").textContent = tr("planner.note", { n: flights.length, total: state.flights.length });
    if (flights.length) select(flights[0].flightNumber);
    $("#board").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#plannerCabins").addEventListener("click", event => {
    const chip = event.target.closest("[data-cabin]");
    if (!chip) return;
    state.cabin = chip.dataset.cabin;
    renderCabins();
  });

  $("#phaseChips").addEventListener("click", event => {
    const chip = event.target.closest("[data-phase]");
    if (!chip) return;
    state.phase = chip.dataset.phase;
    renderPhaseChips();
    renderBoard();
  });

  $("#boardSearch").addEventListener("input", event => {
    state.query = event.target.value;
    renderBoard();
  });

  $("#boardRows").addEventListener("click", event => {
    const book = event.target.closest("[data-book]");
    if (book) {
      openBooking(book.dataset.book);
      return;
    }
    const row = event.target.closest(".flight-row");
    if (row) {
      select(row.dataset.no);
      $("#track").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  $("#boardRows").addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    const row = event.target.closest(".flight-row");
    if (row) select(row.dataset.no);
  });

  $("#pBook").addEventListener("click", () => { if (state.selected) openBooking(state.selected); });

  $$(".lang-btn").forEach(button => button.addEventListener("click", () => setLang(button.dataset.lang)));

  themeBtn.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark", true));

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  $("#bkClose").addEventListener("click", () => $("#bookDialog").close());
  $("#bkCancel").addEventListener("click", () => $("#bookDialog").close());
  $("#bkAnySeat").addEventListener("click", () => {
    if (!state.booking) return;
    state.booking.seat = "";
    renderBookingSeats();
    if (state.booking.quote) refreshQuote();
  });

  $("#bkNext").addEventListener("click", () => {
    const booking = state.booking;
    if (!booking) return;
    if (booking.step === 1) {
      const name = $("#bkName").value.trim();
      const email = $("#bkEmail").value.trim();
      if (!name || !email.includes("@")) {
        $("#bkError").textContent = "Enter the passenger name and a valid email.";
        $("#bkError").hidden = false;
        return;
      }
    }
    goStep(Math.min(3, booking.step + 1));
  });

  $("#bkBack").addEventListener("click", () => {
    if (state.booking) goStep(Math.max(1, state.booking.step - 1));
  });

  $("#bkCabins").addEventListener("click", event => {
    const chip = event.target.closest("[data-bk-cabin]");
    if (!chip || !state.booking) return;
    state.booking.cabin = chip.dataset.bkCabin;
    state.booking.seat = "";
    state.booking.seatMap = null;
    renderBookingCabins();
    loadSeatMap();
    if (state.booking.quote) refreshQuote();
  });

  $("#bkSeatMap").addEventListener("click", event => {
    const seat = event.target.closest("button.seat");
    if (!seat || !state.booking) return;
    state.booking.seat = seat.dataset.seat;
    renderBookingSeats();
    if (state.booking.quote) refreshQuote();
  });

  $("#bookForm").addEventListener("submit", async event => {
    event.preventDefault();
    const booking = state.booking;
    if (!booking) return;
    if (booking.step !== 3) {
      goStep(Math.min(3, booking.step + 1));
      return;
    }
    const name = $("#bkName").value.trim();
    const email = $("#bkEmail").value.trim();
    if (!name || !email.includes("@")) {
      goStep(1);
      $("#bkError").textContent = "Enter the passenger name and a valid email.";
      $("#bkError").hidden = false;
      return;
    }
    const button = $("#bkSubmit");
    button.disabled = true;
    button.textContent = t("btn.booking");
    try {
      const bookingResult = await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          flightNumber: booking.flight.flightNumber,
          passengerName: name,
          email,
          seatClass: booking.cabin,
          seat: booking.seat || ""
        })
      });
      localStorage.setItem(NAME_KEY, name);
      localStorage.setItem(EMAIL_KEY, email);
      saveRef(bookingResult.reference);
      $("#bookDialog").close();
      toast(tr("toast.booked", { seat: bookingResult.seat, ref: bookingResult.reference }));
      await loadTickets();
      $("#tickets").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      $("#bkError").textContent = error.message;
      $("#bkError").hidden = false;
      if (booking.step === 2 && /seat/i.test(error.message)) loadSeatMap();
    } finally {
      button.disabled = false;
      button.textContent = t("btn.confirm");
    }
  });

  $("#ticketList").addEventListener("click", event => {
    const download = event.target.dataset.download;
    if (download) {
      const ticket = state.tickets.find(x => x.reference === download);
      if (ticket) downloadTicket(ticket);
      return;
    }
    const checkin = event.target.dataset.checkin;
    if (checkin) { openCheckIn(checkin); return; }
    const cancel = event.target.dataset.cancel;
    if (cancel) cancelTicket(cancel);
  });

  $("#ciClose").addEventListener("click", () => $("#seatDialog").close());
  $("#ciCancel").addEventListener("click", () => $("#seatDialog").close());

  $("#ciSeatMap").addEventListener("click", event => {
    const seat = event.target.closest("button.seat");
    if (!seat || !state.checkin) return;
    state.checkin.seat = seat.dataset.seat;
    $("#ciSeatMap").innerHTML = seatMapHtml(state.checkin.seatMap, state.checkin.seat);
    $("#ciSeat").innerHTML = `<span>${t("ticket.seat")}</span><b>${esc(state.checkin.seat)}</b>`;
  });

  $("#ciForm").addEventListener("submit", async event => {
    event.preventDefault();
    const checkin = state.checkin;
    if (!checkin) return;
    try {
      const result = await api(`/api/bookings/${encodeURIComponent(checkin.ticket.reference)}/checkin`, {
        method: "POST",
        body: JSON.stringify({ seat: checkin.seat || "" })
      });
      $("#seatDialog").close();
      toast(tr("toast.checkedin", { group: result.boardingGroup }));
      await loadTickets();
    } catch (error) {
      $("#ciError").textContent = error.message;
      $("#ciError").hidden = false;
    }
  });

  $("#adminLogin").addEventListener("submit", async event => {
    event.preventDefault();
    $("#adminError").hidden = true;
    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: $("#adminUser").value.trim(), password: $("#adminPass").value })
      });
      state.admin = { token: result.token, user: result.username, stats: null };
      sessionStorage.setItem(TOKEN_KEY, result.token);
      sessionStorage.setItem(USER_KEY, result.username);
      $("#adminPass").value = "";
      showAdminPanel();
      toast(tr("toast.login", { user: result.username }));
      await loadAdmin();
    } catch (error) {
      $("#adminError").textContent = error.status === 401 ? t("admin.invalid") : error.message;
      $("#adminError").hidden = false;
    }
  });

  $("#adminLogout").addEventListener("click", () => {
    logoutAdmin();
    $("#adminPass").value = "";
  });
}

/* ---------- boot ---------- */
async function boot() {
  try {
    const catalog = await api("/api/flights");
    state.flights = catalog.flights || [];
    populatePlanner(false);
    renderMap();
    renderBoard();
    if (state.flights.length) select(state.flights[0].flightNumber);
    const telemetry = await api("/api/telemetry");
    (telemetry || []).forEach(applyTelemetry);
    renderAdminStats();
  } catch (error) {
    $("#boardRows").innerHTML = `<div class="empty">${esc(error.message)} ${t("toast.retry")}</div>`;
    setTimeout(boot, 3000);
    return;
  }
  connectStream();
  connectFeed();
  loadFeed();
  loadStats();
  setInterval(loadStats, 15000);
  loadTickets();
  if (state.admin.token) {
    showAdminPanel();
    loadAdmin();
  }
}

$("#brandMark").innerHTML = PLANE;
$$(".lang-btn").forEach(button => button.classList.toggle("active", button.dataset.lang === lang));
setTheme(currentTheme(), false);
syncToTop();
renderCabins();
renderPhaseChips();
applyI18n();
bindEvents();
initMap();
boot();
