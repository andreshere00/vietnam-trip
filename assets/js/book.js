/* Reservas del viaje: estancia, transporte, eventos y comida según el itinerario elegido, y descarga del itinerario.
   Lo usan estancia.html, transporte.html, eventos.html, comida.html, itinerario.html e index.html. Necesita assets/js/data.js (VN); comida.html, además, assets/js/food.js. */
var VNB = (function () {
  'use strict';
  var NAMES = VN.NAMES, ALTS = VN.ALTS;
  var ORDER = Object.keys(NAMES);
  var SK = 'vn-alts2', BK = 'vn-buy';
  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var ALT_BY = {}; ALTS.forEach(function (a) { ALT_BY[a.id] = a; });
  var esc = function (t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };
  var eur = function (n) { return '€' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };

  /* ---------- Fechas ---------- */
  var dnum = function (d) { return 5 + ORDER.indexOf(d); };
  var iso = function (d) { var n = dnum(d); return '2027-02-' + (n < 10 ? '0' : '') + n; };
  var isoN = function (n) { return '2027-02-' + (n < 10 ? '0' : '') + n; };
  var short = function (d) { return NAMES[d] + ' feb'; };
  var longD = function (d) { return { vie: 'viernes', sab: 'sábado', dom: 'domingo', lun: 'lunes', mar: 'martes', mie: 'miércoles', jue: 'jueves' }[d.slice(0, 3)] + ' ' + dnum(d) + ' de febrero'; };
  var minus60 = function (d) { var t = new Date(Date.UTC(2027, 1, dnum(d)) - 60 * 864e5); return t.getUTCDate() + ' ' + MES[t.getUTCMonth()] + ' ' + t.getUTCFullYear(); };
  var daysTo60 = function (d) { var t = Date.UTC(2027, 1, dnum(d)) - 60 * 864e5, now = Date.now(); return Math.ceil((t - now) / 864e5); };

  /* ---------- Elección (compartida con la web principal) ---------- */
  var mode = 'mine', sel = {};
  var loadSel = function () {
    var s = {}; ALTS.forEach(function (a) { if (a.pref) s[a.id] = 1; });
    try { var raw = localStorage.getItem(SK); if (raw !== null) { s = {}; (JSON.parse(raw) || []).forEach(function (id) { if (ALT_BY[id]) s[id] = 1; }); } } catch (e) {}
    sel = s; return s;
  };
  loadSel();
  var has = function (id) { return mode === 'mine' && !!sel[id]; };
  var swapFor = function (d) {
    if (mode !== 'mine') return null;
    for (var i = 0; i < ALTS.length; i++) if (ALTS[i].kind === 'swap' && sel[ALTS[i].id] && ALTS[i].days[d]) return ALTS[i];
    return null;
  };
  var addsFor = function (d) { return mode === 'mine' ? ALTS.filter(function (a) { return a.kind === 'add' && sel[a.id] && a.days[d]; }) : []; };
  var chosen = function () { return mode === 'mine' ? ALTS.filter(function (a) { return sel[a.id]; }) : []; };

  /* ---------- Reservado: casillas guardadas ---------- */
  var done = {};
  try { (JSON.parse(localStorage.getItem(BK) || '[]') || []).forEach(function (k) { done[k] = 1; }); } catch (e) {}
  var saveDone = function () { try { localStorage.setItem(BK, JSON.stringify(Object.keys(done))); } catch (e) {} };
  var toggle = function (id, on) { if (on) done[id] = 1; else delete done[id]; saveDone(); };

  /* ---------- Enlaces ---------- */
  var L = function (n, u, best) { return { n: n, u: u, best: !!best }; };
  var enc = encodeURIComponent;
  var U = {
    gfl: function (a, b, d) { return 'https://www.google.com/travel/flights?q=' + enc('Flights from ' + a + ' to ' + b + ' on ' + iso(d)); },
    sky: function (a, b, d) { var s = iso(d); return 'https://www.skyscanner.es/transport/flights/' + a.toLowerCase() + '/' + b.toLowerCase() + '/' + s.slice(2, 4) + s.slice(5, 7) + s.slice(8, 10) + '/?adultsv2=3'; },
    gyg: function (q) { return 'https://www.getyourguide.com/s/?q=' + enc(q); },
    via: function (q) { return 'https://www.viator.com/searchResults/all?text=' + enc(q); },
    klk: function (q) { return 'https://www.klook.com/en-US/search/result/?query=' + enc(q); },
    go12: function (a, b) { return 'https://12go.asia/en/travel/' + a + '/' + b; },
    bk: function (ss, i, o, min, max) {
      return 'https://www.booking.com/searchresults.html?ss=' + enc(ss) + '&checkin=' + i + '&checkout=' + o + '&group_adults=3&no_rooms=1&group_children=0&selected_currency=EUR&nflt=' + enc('price=EUR-' + min + '-' + max + '-1');
    },
    ggh: function (ss, i, o) { return 'https://www.google.com/travel/search?q=' + enc('hotels in ' + ss) + '&qs=' + enc(i + ' to ' + o); }
  };
  var VJ = L('Vietjet', 'https://www.vietjetair.com/en'), VNA = L('Vietnam Airlines', 'https://www.vietnamairlines.com/');
  var GRAB = L('Grab', 'https://www.grab.com/vn/en/'), XANH = L('Xanh SM', 'https://www.xanhsm.com/');
  var RAIL = L('Vietnam Railways (web oficial)', 'https://dsvn.vn/'), VXR = L('Vexere (agente autorizado)', 'https://vexere.com/');

  /* ================= ESTANCIA ================= */
  var CITY = {
    hcm: { name: 'Ho Chi Minh', ss: 'District 1, Ho Chi Minh City, Vietnam', base: 55, c: '--red', tip: 'Distrito 1 (zona Bến Thành): templos, río y restaurantes a pie.' },
    hoian: { name: 'Hội An', ss: 'Hoi An, Vietnam', base: 55, c: '--gold', tip: 'Cerca del casco antiguo para volver a pie de noche; evitad la zona de playa si queréis farolillos.' },
    hue: { name: 'Huế', ss: 'Hue, Vietnam', base: 45, c: '--hue', tip: 'Orilla sur del río Perfume, cerca del puente Trường Tiền.' },
    hanoi: { name: 'Hà Nội (Old Quarter)', ss: 'Old Quarter, Hanoi, Vietnam', base: 52, c: '--indigo', tip: 'Old Quarter o lago Hoàn Kiếm: todo a pie, aunque con ruido de noche (pedid habitación interior).' },
    ninh: { name: 'Ninh Bình (Tam Cốc)', ss: 'Tam Coc, Ninh Binh, Vietnam', base: 50, c: '--lotus', tip: 'Un homestay entre arrozales es lo mejor de la zona.' },
    sapa: { name: 'Sa Pa', ss: 'Sa Pa, Lao Cai, Vietnam', base: 40, c: '--indigo', tip: 'Pedid calefacción y vistas a los valles; de febrero hace 3–12 °C.' },
    hagiang: { name: 'Hà Giang', ss: 'Ha Giang, Vietnam', base: 25, c: '--indigo', home: 1, tip: 'El easy rider suele incluir o recomendar el alojamiento.' },
    dongvan: { name: 'Đồng Văn', ss: 'Dong Van, Ha Giang, Vietnam', base: 18, c: '--indigo', home: 1, tip: 'Homestays sencillos; frío por la noche.' },
    duga: { name: 'Du Già', ss: 'Du Gia, Ha Giang, Vietnam', base: 18, c: '--indigo', home: 1, tip: 'Homestays entre arrozales; oferta limitada, reservad pronto.' },
    cruise: { name: 'Crucero por la bahía', ss: '', base: 200, c: '--teal', cruise: 1, tip: 'Elegid un operador ecológico (sin plásticos de un solo uso, aguas tratadas) y, a ser posible, la bahía de Lan Hạ.' }
  };
  var TIERS = [
    { k: 'eco', n: 'Económico', d: 'Hostal o guesthouse con habitación privada, aire acondicionado y baño propio.', min: 0, max: 45, typ: 32 },
    { k: 'mid', n: 'Medio (plan base)', d: 'Hotel de 3★ céntrico, con desayuno y buenas valoraciones. Es lo que cuenta el presupuesto.', min: 45, max: 85, typ: 68 },
    { k: 'com', n: 'Confort', d: 'Hotel de 4★, con piscina o desayuno amplio y mejor insonorización.', min: 85, max: 140, typ: 110 },
    { k: 'sup', n: 'Superior', d: 'Boutique de diseño, resort o 5★, con spa y habitaciones amplias.', min: 140, max: 9999, typ: 190 }
  ];
  var TIERS_HOME = [
    { k: 'eco', n: 'Homestay o dormitorio', d: 'Habitación sencilla o cama en un homestay familiar.', min: 0, max: 30, typ: 22 },
    { k: 'mid', n: 'Hotel local', d: 'Hotel de 2–3★ con baño privado y calefacción.', min: 30, max: 70, typ: 50 },
    { k: 'sup', n: 'Boutique', d: 'Alojamiento de diseño con vistas y desayuno.', min: 70, max: 9999, typ: 100 }
  ];
  var TIERS_CRUISE = [
    { k: 'eco', n: 'Estándar (3★)', d: 'Cabina básica, comidas incluidas, kayak y cueva. Barco más sencillo.', pp: [100, 140], typ: 120 },
    { k: 'mid', n: 'Medio (4★)', d: 'Cabina amplia con ventana, más actividades y mejor cocina.', pp: [145, 190], typ: 165 },
    { k: 'sup', n: 'Superior (5★)', d: 'Cabina con balcón, spa y menú de varios platos. Los de gama alta son los más tranquilos.', pp: [230, 320], typ: 275 }
  ];
  var BASE_CITY = { vie5: 'hcm', sab6: 'hcm', dom7: 'hcm', lun8: 'hoian', mar9: 'hoian', mie10: 'hoian', jue11: 'hoian', vie12: 'hue', sab13: 'hanoi', dom14: 'hanoi', lun15: 'ninh', mar16: 'cruise', mie17: 'hanoi', jue18: 'hanoi', vie19: 'hanoi' };
  var NIGHTS = ORDER.slice(0, 15);
  var cityOfN = function (n) {
    var m = [[/crucero/i, 'cruise'], [/Sa Pa/, 'sapa'], [/Hà Giang/, 'hagiang'], [/Đồng Văn/, 'dongvan'], [/Du Già/, 'duga'], [/Tam Cốc|Ninh/, 'ninh'], [/Hội An/, 'hoian'], [/Huế/, 'hue'], [/Hà Nội/, 'hanoi'], [/Ho Chi Minh/, 'hcm']];
    for (var i = 0; i < m.length; i++) if (m[i][0].test(n)) return m[i][1];
    return null;
  };
  var stays = function () {
    var out = [], cur = null;
    NIGHTS.forEach(function (d, i) {
      var sw = swapFor(d), key = BASE_CITY[d];
      if (sw && sw.days[d].n) key = cityOfN(sw.days[d].n) || key;
      if (cur && cur.key === key && !CITY[key].home) cur.nights++;
      else { cur = { key: key, from: d, nights: 1, alt: sw || null }; out.push(cur); }
      cur.last = d;
      cur.nextN = dnum(d) + 1;
    });
    out.forEach(function (s) { s.c = CITY[s.key]; s.in = iso(s.from); s.out = isoN(s.nextN); s.id = 'stay-' + s.key + '-' + s.from; s.first = s.from === 'vie5'; });
    return out;
  };
  var bkLink = function (s, t) { return U.bk(s.c.ss, s.in, s.out, t.min, t.max); };

  /* ================= TRANSPORTE ================= */
  var FL = function (a, b, d) { return L('Google Flights (comparar)', U.gfl(a, b, d), 1); };
  var flightOpts = function (a, b, d, price, time, vj, vna) {
    return [
      { m: 'flight', n: 'Vietjet Air', p: price[0], t: time, note: vj || 'La más barata; la maleta facturada se paga aparte (~€10–25). Suben mucho en Tết.', buy: [VJ, L('Skyscanner', U.sky(a, b, d))] },
      { m: 'flight', n: 'Vietnam Airlines', p: price[1], t: time, note: vna || 'Equipaje facturado incluido y más puntualidad; mejor si hay maletas grandes.', buy: [VNA, L('Skyscanner', U.sky(a, b, d))] },
      { m: 'search', best: 1, n: 'Comparar antes de comprar', p: 'Gratis', t: '', note: 'Mirad los dos días de cada lado y comprad en la web de la aerolínea (sin comisión) con la tarjeta que cubra cancelaciones.', buy: [FL(a, b, d), L('Skyscanner', U.sky(a, b, d))] }
    ];
  };
  var LEGS = [
    { id: 'arr', d: 'sab6', t: 'Aeropuerto SGN → hotel del Distrito 1', s: 'Aterrizáis a la 1:10 del sábado 6 (mùng 1).', ok: function () { return true; }, opts: [
      { m: 'taxi', n: 'Grab (coche)', p: '€7–10 por coche', t: '25–40 min', note: 'Con recargo nocturno y de Tết. Caben tres con maletas medianas; si no, pedid «Grab 7 plazas».', buy: [GRAB], best: 1 },
      { m: 'taxi', n: 'Taxi Vinasun o Mai Linh', p: '€8–12', t: '25–40 min', note: 'Cola oficial a la salida y taxímetro. Evitad a quien os aborda dentro.', buy: [L('Vinasun', 'https://www.vinasun.com.vn/')] },
      { m: 'car', n: 'Recogida reservada con cartel', p: '€12–20', t: '25–40 min', note: 'Os esperan con vuestro nombre aunque el vuelo se retrase. Cómodo a esa hora; pedidlo al hotel o en Klook.', buy: [L('Klook (traslados)', U.klk('Ho Chi Minh airport transfer'))] }
    ] },
    { id: 'sgn-dad', d: 'lun8', t: 'Vuelo Ho Chi Minh → Đà Nẵng', s: 'Lunes 8 de febrero, hacia las 14:30.', ok: function () { return true; }, flightOpts: ['SGN', 'DAD', 'lun8', ['€35–80 p. p.', '€70–120 p. p.'], '1 h 20'] },
    { id: 'dad-hoian', d: 'lun8', t: 'Aeropuerto de Đà Nẵng → Hội An', s: '30 km por la costa.', ok: function () { return true; }, opts: [
      { m: 'taxi', n: 'Grab (coche)', p: '€10–15', t: '45 min', note: 'El punto de recogida está fuera de llegadas. Sin recargo salvo hora punta.', buy: [GRAB], best: 1 },
      { m: 'car', n: 'Traslado reservado o del hotel', p: '€14–20', t: '45 min', note: 'Precio cerrado y conductor esperando. Pedidlo al hotel al reservar.', buy: [L('Klook (traslados)', U.klk('Da Nang airport to Hoi An transfer'))] },
      { m: 'bus', n: 'Taxi con taxímetro (Mai Linh)', p: '€11–16', t: '45 min', note: 'Cola oficial del aeropuerto; exigid el taxímetro.', buy: [L('Mai Linh', 'https://www.mailinh.vn/')] }
    ] },
    { id: 'hoian-hue', d: 'vie12', t: 'Hội An → Huế', s: 'Viernes 12 de febrero, por el paso de Hải Vân (~4 h).', ok: function () { return !has('hue-diario'); }, opts: [
      { m: 'car', n: 'Coche con conductor y paradas', p: '€50–70 el coche (~€17–23 p. p.)', t: '~4 h', note: 'Hải Vân, Lăng Cô y el almuerzo con vistas. Pedid presupuesto cerrado a 2–3 empresas por WhatsApp.', buy: [L('Klook', U.klk('Hoi An to Hue private car Hai Van pass')), L('GetYourGuide', U.gyg('Hoi An to Hue private car'))], best: 1 },
      { m: 'train', n: 'Tren Đà Nẵng → Huế', alt: 'vie12-tren', p: '€5–15 p. p.', t: '2 h 30', note: 'Tramo panorámico de la costa; hay que llegar a la estación de Đà Nẵng (~45 min desde Hội An). Con Tết, comprad pronto.', buy: [RAIL, VXR, L('12Go', U.go12('da-nang', 'hue'))], rail: 'vie12' },
      { m: 'bus', n: 'Minibús o autobús turístico', p: '€7–12 p. p.', t: '4–5 h', note: 'Lo más barato, con recogida en el hotel; poco margen para paradas y a veces con retrasos.', buy: [L('12Go', U.go12('hoi-an', 'hue')), VXR] }
    ] },
    { id: 'hue-han', d: 'sab13', t: 'Vuelo Huế → Hà Nội', s: 'Sábado 13 de febrero, por la tarde.', ok: function () { return !has('hue-diario'); }, flightOpts: ['HUI', 'HAN', 'sab13', ['€35–70 p. p.', '€65–110 p. p.'], '1 h 15'] },
    { id: 'dad-han', d: 'sab13', t: 'Vuelo Đà Nẵng → Hà Nội', s: 'Con «Huế en un día»: salís desde Hội An.', ok: function () { return has('hue-diario'); }, flightOpts: ['DAD', 'HAN', 'sab13', ['€35–75 p. p.', '€65–110 p. p.'], '1 h 20'] },
    { id: 'han-ninh', d: 'lun15', t: 'Hà Nội → Ninh Bình', s: 'Lunes 15 de febrero, ~2 h.', ok: function () { return true; }, opts: [
      { m: 'train', n: 'Tren Hà Nội → Ninh Bình', p: '€6–12 p. p.', t: '2 h – 2 h 30', note: 'Estación de Hà Nội, al oeste del Old Quarter. Sin atascos y con asiento garantizado.', buy: [RAIL, VXR, L('12Go', U.go12('hanoi', 'ninh-binh'))], rail: 'lun15', best: 1 },
      { m: 'bus', n: 'Limousine (minibús)', p: '€8–15 p. p.', t: '2 h 30', note: 'Recogida en el hotel. Es lo más directo si vais con maletas grandes.', buy: [L('12Go', U.go12('hanoi', 'ninh-binh')), VXR] },
      { m: 'car', n: 'Coche privado', p: '€45–60 el coche (~€15–20 p. p.)', t: '2 h', note: 'Para tres sale parecido al tren, sin traslados a la estación y con parada en Bái Đính si queréis.', buy: [L('Klook', U.klk('Hanoi to Ninh Binh private car')), L('GetYourGuide', U.gyg('Hanoi to Ninh Binh private transfer'))] }
    ] },
    { id: 'ninh-halong', d: 'mar16', t: 'Ninh Bình → puerto del crucero (Hạ Long)', s: 'Martes 16, ~3 h 30 hasta Tuần Châu.', ok: function () { return !swapFor('mar16'); }, opts: [
      { m: 'car', n: 'Coche privado', p: '€80–110 el coche (~€27–37 p. p.)', t: '3 h 30', note: 'Sin pasar por Hà Nội. Pedid al operador del crucero que lo organice: lo suele dejar en el puerto a la hora de embarque.', buy: [L('Klook', U.klk('Ninh Binh to Ha Long private car')), L('GetYourGuide', U.gyg('Ninh Binh to Halong Bay private transfer'))], best: 1 },
      { m: 'bus', n: 'Shuttle del crucero desde Hà Nội', p: '€40–50 ida y vuelta p. p.', t: '3 h – 3 h 30', note: 'Ninh Bình → Hà Nội en limousine y después el shuttle del crucero. Es más barato pero más largo.', buy: [L('12Go', U.go12('ninh-binh', 'hanoi')), L('Operadores de crucero', 'https://www.halongbaytours.com/')] }
    ] },
    { id: 'halong-han', d: 'mie17', t: 'Hạ Long → Hà Nội', s: 'Miércoles 17, ~3 h.', ok: function () { return !swapFor('mie17'); }, opts: [
      { m: 'bus', n: 'Shuttle del crucero', p: '€10–25 p. p. (a veces incluido)', t: '3 h', note: 'Preguntad al reservar el crucero si el regreso a Hà Nội va incluido y a qué hora llega.', buy: [L('Operadores de crucero', 'https://www.halongbaytours.com/')], best: 1 },
      { m: 'bus', n: 'Limousine', p: '€10–15 p. p.', t: '3 h – 3 h 30', note: 'Desde el puerto de Bãi Cháy o del propio crucero, según el operador.', buy: [L('12Go', U.go12('ha-long', 'hanoi')), VXR] },
      { m: 'car', n: 'Coche privado', p: '€70–100 el coche', t: '2 h 30', note: 'El más cómodo para tres si queréis salir cuando os venga bien.', buy: [L('Klook', U.klk('Ha Long to Hanoi private car'))] }
    ] },
    { id: 'han-sapa', d: 'jue18', t: 'Hà Nội → Sa Pa', s: 'Jueves 18, salida a las 7:00.', ok: function () { return has('sapa'); }, opts: [
      { m: 'bus', n: 'Limousine (minibús de 9–22 plazas)', p: '€13–20 p. p.', t: '5 h 30 – 6 h', note: 'Lo más cómodo y común. Reservad con recogida en el hotel y confirmad el punto de bajada en Sa Pa.', buy: [L('12Go', U.go12('hanoi', 'sapa')), VXR], best: 1 },
      { m: 'train', n: 'Tren nocturno a Lào Cai + minibús', p: '€25–45 p. p.', t: '8 h + 1 h', note: 'Como experiencia, no como ahorro: llegáis temprano y cansados. Se agota en Tết.', buy: [RAIL, VXR, L('12Go', U.go12('hanoi', 'lao-cai'))], rail: 'jue18' },
      { m: 'car', n: 'Coche privado', p: '€90–130 el coche (~€30–43 p. p.)', t: '5 h', note: 'Con parada en el puente de cristal de Lào Cai si os apetece; sale parecido para tres que dos billetes de lujo.', buy: [L('Klook', U.klk('Hanoi to Sapa private car')), L('GetYourGuide', U.gyg('Hanoi to Sapa private transfer'))] }
    ] },
    { id: 'sapa-han', d: 'vie19', t: 'Sa Pa → Hà Nội', s: 'Viernes 19, tras el Fansipan (~14:00).', ok: function () { return has('sapa'); }, opts: [
      { m: 'bus', n: 'Limousine', p: '€13–20 p. p.', t: '5 h 30 – 6 h', note: 'Elegid la salida de las 13:30–14:00: llegáis a Hà Nội hacia las 20:00 y el sábado hay que salir a las 6:45.', buy: [L('12Go', U.go12('sapa', 'hanoi')), VXR], best: 1 },
      { m: 'car', n: 'Coche privado', p: '€90–130 el coche', t: '5 h', note: 'Permite salir al terminar y parar donde queráis.', buy: [L('Klook', U.klk('Sapa to Hanoi private car'))] }
    ] },
    { id: 'han-maichau', d: 'jue18', t: 'Hà Nội ↔ Mai Châu', s: 'Excursión de un día, ~3 h por trayecto.', ok: function () { return has('maichau'); }, opts: [
      { m: 'car', n: 'Coche con conductor, ida y vuelta', p: '€70–100 el coche', t: '3 h por trayecto', note: 'Permite parar en el paso de Thung Khe. Es lo más práctico para un solo día.', buy: [L('Klook', U.klk('Hanoi to Mai Chau private car')), L('GetYourGuide', U.gyg('Mai Chau day trip from Hanoi'))], best: 1 },
      { m: 'bus', n: 'Autobús público', p: '€4–8 p. p.', t: '3 h – 3 h 30', note: 'Sale de la estación de Mỹ Đình, con pocas salidas; el regreso se complica.', buy: [L('12Go', U.go12('hanoi', 'mai-chau')), VXR] }
    ] },
    { id: 'han-hg', d: 'mar16', t: 'Ninh Bình → Hà Nội → Hà Giang', s: 'Con el Hà Giang Loop: dos tramos el martes 16.', ok: function () { return has('hagiang'); }, opts: [
      { m: 'bus', n: 'Limousine Hà Nội → Hà Giang', p: '€13–20 p. p.', t: '5 h 30 – 6 h', note: 'Primero Ninh Bình → Hà Nội (limousine o tren). Muchos easy riders recogen en la estación de Hà Giang.', buy: [L('12Go', U.go12('hanoi', 'ha-giang')), VXR], best: 1 },
      { m: 'car', n: 'Coche privado a Hà Giang', p: '€110–150 el coche', t: '6 h', note: 'Solo si queréis salir de Ninh Bình a primera hora sin pasar por Hà Nội.', buy: [L('Klook', U.klk('Hanoi to Ha Giang private car'))] }
    ] },
    { id: 'hg-han', d: 'vie19', t: 'Hà Giang → Hà Nội', s: 'Viernes 19, tras el Loop.', ok: function () { return has('hagiang'); }, opts: [
      { m: 'bus', n: 'Limousine Hà Giang → Hà Nội', p: '€13–20 p. p.', t: '5 h 30 – 6 h', note: 'Reservad el billete de vuelta el mismo día que el de ida y preguntad al easy rider por la mejor hora.', buy: [L('12Go', U.go12('ha-giang', 'hanoi')), VXR], best: 1 },
      { m: 'car', n: 'Coche privado', p: '€110–150 el coche', t: '5 h 30', note: 'Más caro; os evita depender de la salida de las 14:30.', buy: [L('Klook', U.klk('Ha Giang to Hanoi private car'))] }
    ] },
    { id: 'catba', d: 'mar16', t: 'Ninh Bình → Cát Bà (crucero eco)', s: 'Coche hasta el puerto de Đình Vũ y ferry rápido.', ok: function () { return has('catba'); }, opts: [
      { m: 'car', n: 'Coche + ferry rápido', p: '€45–60 p. p.', t: '~3 h 30', note: 'El ferry sale cada hora hacia las 8:00–17:00. Preguntad al operador si incluye el traslado.', buy: [L('Operadores de crucero', 'https://bhayacruises.com/'), L('Klook', U.klk('Cat Ba ferry transfer Hanoi'))], best: 1 },
      { m: 'bus', n: 'Autobús + ferry (12Go)', p: '€15–25 p. p.', t: '4–5 h', note: 'Más barato, con varios cambios. Dejad margen antes del embarque del crucero.', buy: [L('12Go', U.go12('hanoi', 'cat-ba')), VXR] }
    ] },
    { id: 'sgn-dlat', d: 'dom7', t: 'Vuelos Ho Chi Minh ↔ Đà Lạt', s: 'Excursión en el día, ida a las ~7:30 y vuelta a las ~17:30.', ok: function () { return has('dalat'); }, flightOpts: ['SGN', 'DLI', 'dom7', ['€25–55 p. p. por tramo', '€55–90 p. p. por tramo'], '1 h'] },
    { id: 'han-sgn', d: 'sab20', t: 'Vuelo Hà Nội → Ho Chi Minh', s: 'Sábado 20, salida a las 9:00 para tener margen antes del vuelo a Madrid.', ok: function () { return true; }, flightOpts: ['HAN', 'SGN', 'sab20', ['€40–90 p. p.', '€80–130 p. p.'], '2 h 10', 'Suele ser la más barata. Con el vuelo a Madrid de madrugada, no dejéis este tramo para la tarde.', 'La opción más segura para no perder el vuelo largo: a veces reembolsable o cambiable.'] },
    { id: 'dep', d: 'sab20', t: 'Hotel → aeropuerto SGN para el vuelo a Madrid', s: 'Salida hacia las 22:00 (vuelo a las 2:30).', ok: function () { return true; }, opts: [
      { m: 'taxi', n: 'Grab (coche)', p: '€7–10', t: '25–40 min', note: 'Pedid a las 22:00 desde el hotel; con tráfico ligero a esa hora.', buy: [GRAB], best: 1 },
      { m: 'taxi', n: 'Taxi Vinasun o Mai Linh', p: '€8–12', t: '25–40 min', note: 'Pedidlo desde el hotel, que lo llama y confirma el precio.', buy: [L('Vinasun', 'https://www.vinasun.com.vn/')] }
    ] },
    { id: 'city', d: null, t: 'Moverse dentro de cada ciudad', s: 'Todo el viaje: Grab y taxis eléctricos.', ok: function () { return true; }, opts: [
      { m: 'taxi', n: 'Grab (coche y moto)', p: '€1,5–4 por trayecto', t: '', note: 'La app más completa. Pagad con tarjeta o en efectivo; en Tết hay recargo y menos coches.', buy: [GRAB], best: 1 },
      { m: 'taxi', n: 'Xanh SM (taxi eléctrico)', p: '€1,5–4 por trayecto', t: '', note: 'Taxis eléctricos con tarifa fija en la app; sin regateos y con coches nuevos.', buy: [XANH] },
      { m: 'walk', n: 'A pie y en bici', p: 'Gratis', t: '', note: 'Hội An, Old Quarter y Huế se ven mejor andando; en Hội An alquilad bici en el hotel (~€1–2).', buy: [] }
    ] }
  ];
  var legs = function () {
    return LEGS.filter(function (l) { return l.ok(); }).map(function (l) {
      var o = {}; for (var k in l) o[k] = l[k];
      if (l.flightOpts) { var f = l.flightOpts; o.opts = flightOpts(f[0], f[1], f[2], f[3], f[4], f[5], f[6]); }
      o.opts = o.opts.map(function (x) { var y = {}; for (var kk in x) y[kk] = x[kk]; y.sel = !!(x.alt && has(x.alt)); return y; });
      o.stuff = 'leg-' + l.id;
      return o;
    }).sort(function (a, b) { return (a.d ? ORDER.indexOf(a.d) : 99) - (b.d ? ORDER.indexOf(b.d) : 99); });
  };

  /* ================= EVENTOS ================= */
  var SG = function (n, u, best) { return L(n, u, best); };
  var GYG = function (q, best) { return L('GetYourGuide', U.gyg(q), best); };
  var VIA = function (q) { return L('Viator', U.via(q)); };
  var KLK = function (q, best) { return L('Klook', U.klk(q), best); };
  var EV = [
    { id: 'esim', d: 'vie5', alt: '*', t: 'eSIM de Vietnam', w: 'Datos desde que aterrizáis (Grab y mapas a la 1:10).', p: '€8–20', how: 'online', links: [SG('Airalo', 'https://www.airalo.com/vietnam-esim', 1), SG('Holafly', 'https://esim.holafly.com/esim-vietnam/')], tip: 'Se instala en casa y se activa al aterrizar. Una por persona o una compartida con punto de acceso.' },
    { id: 'seguro', d: 'vie5', alt: '*', t: 'Seguro de viaje', w: 'Cobertura médica y de cancelación para 17 días en Vietnam.', p: '€30–60 p. p.', how: 'online', links: [SG('IATI Seguros', 'https://www.iatiseguros.com/', 1), SG('Heymondo', 'https://www.heymondo.es/')], tip: 'No está en el presupuesto. Contratadlo antes de pagar vuelos internos y alojamientos: cubre cancelaciones.' },
    { id: 'sab6-barco', d: 'sab6', alt: 'sab6-barco', t: 'Cena en barco por el río Sài Gòn', w: 'Buffet y música en directo, 1 h 30 desde el muelle de Bạch Đằng.', p: '€20–35 p. p.', how: 'tour', links: [GYG('Saigon river dinner cruise', 1), KLK('Saigon river dinner cruise'), VIA('Saigon dinner cruise')], tip: 'En Tết se llenan: reservad con antelación y elegid la salida de las 19:00.' },
    { id: 'sab6-masaje', d: 'sab6', alt: 'sab6-masaje', t: 'Masaje de una hora', w: 'Spa tras el viaje, en mùng 1.', p: '€12–25 p. p.', how: 'tour', links: [KLK('Ho Chi Minh massage spa', 1), GYG('Ho Chi Minh massage')], tip: 'Muchos spas abren en Tết con recargo. Confirmad el horario por teléfono o la app del hotel.' },
    { id: 'cuchi-mekong', d: 'dom7', alt: null, t: 'Excursión Củ Chi + delta del Mekong (día completo)', w: 'Túneles, campo de tiro y barco por el río Tiền, con recogida en el hotel.', p: '€40–75 p. p.', how: 'tour', links: [L('Headout', 'https://www.headout.com/cu-chi-tunnels/cu-chi-tunnels-mekong-delta-full-day-tour-e-23185/', 1), GYG('Cu Chi tunnels and Mekong Delta full day tour'), VIA('Cu Chi tunnels Mekong Delta day tour')], tip: 'Comprobad que incluye el campo de tiro (las balas se pagan aparte, ~€2 cada una, en efectivo) y que sale en mùng 2.' },
    { id: 'mekong-full', d: 'dom7', alt: 'mekong-full', t: 'Delta del Mekong de día completo', w: 'Mỹ Tho, Thới Sơn y Bến Tre con comida en finca.', p: '€30–55 p. p.', how: 'tour', links: [GYG('Mekong Delta full day tour from Ho Chi Minh', 1), KLK('Mekong Delta day tour'), VIA('Mekong Delta day tour')], tip: 'Mejor un grupo pequeño (máx. 12) para pasar más tiempo en las islas.' },
    { id: 'cuchi-solo', d: 'dom7', alt: 'cuchi', t: 'Túneles de Củ Chi y campo de tiro (media jornada)', w: 'Mañana de 4–5 h, con vuelta a la ciudad hacia las 13:00.', p: '€20–40 p. p.', how: 'tour', links: [GYG('Cu Chi tunnels half day tour', 1), KLK('Cu Chi tunnels half day tour'), VIA('Cu Chi tunnels half day')], tip: 'Salid temprano: a primera hora hay menos gente y menos calor.' },
    { id: 'dom7-privado', d: 'dom7', alt: 'dom7-privado', t: 'Coche privado a Mỹ Tho y Bến Tre', w: 'Conductor con vehículo para vosotros tres, a vuestro ritmo.', p: '€70–110 el coche', how: 'tour', links: [KLK('Ho Chi Minh private car Mekong Delta', 1), GYG('Mekong Delta private tour from Ho Chi Minh')], tip: 'Pedid el precio cerrado y qué incluye (barco, entradas, comida).' },
    { id: 'warmuseum', d: 'lun8', alt: null, t: 'Museo de los Vestigios de la Guerra', w: 'Uno de los museos más visitados del país.', p: '~€1,5 p. p.', how: 'taquilla', links: [], tip: 'Se paga en la entrada. Confirmad el horario de Tết y reservad 1,5 h.' },
    { id: 'skydeck', d: 'lun8', alt: 'lun8-tet', t: 'Bitexco Skydeck', w: 'Mirador a 178 m sobre el Distrito 1.', p: '€10–12 p. p.', how: 'online', links: [SG('Saigon Skydeck (web oficial)', 'https://saigonskydeck.com/', 1), KLK('Bitexco Skydeck')], tip: 'Se evitan colas comprando en línea. Mejor al atardecer.' },
    { id: 'hoianticket', d: 'mar9', alt: null, t: 'Entrada al casco antiguo de Hội An', w: 'Un único billete da acceso a 5 de los monumentos del casco.', p: '~€4,5 p. p. (120.000 ₫)', how: 'taquilla', links: [], tip: 'Se compra en los puestos de venta repartidos por el casco. Conservad el billete: se pide en cada visita.' },
    { id: 'myson', d: 'mie10', alt: null, t: 'Santuario de Mỹ Sơn', w: 'Templos cham, Patrimonio de la Humanidad.', p: '~€6 p. p.', how: 'taquilla', links: [], tip: 'Se paga en la entrada; salid antes de las 7:00 para evitar los autobuses de excursión.' },
    { id: 'banahills', d: 'mie10', alt: 'mie10-banahills', t: 'Bà Nà Hills y el Puente Dorado', w: 'Teleférico, Puente Dorado y jardines franceses.', p: '€30–40 p. p.', how: 'online', links: [L('Sun World (guía de compra)', 'https://sunparadiseland.com/en/SunParadiseLandDaNang/tin-tuc/guide-detailed-how-to-buy-ba-na-hills-tickets-online-latest-18146', 1), L('Klook', 'https://www.klook.com/en-US/activity/13283'), L('Booking.com', 'https://booking.com/attractions/vn/pr9of7hahjy9-sun-world-ba-na-hills-ticket.html')], tip: 'Comparad el precio oficial con el de los revendedores y comprad para entrar antes de las 9:00.' },
    { id: 'thung', d: 'mie10', alt: 'mie10-thung', t: 'Barca de cestas en Cẩm Thanh', w: 'Remar entre cocoteros de agua.', p: '€8–15 p. p.', how: 'tour', links: [KLK('Hoi An basket boat coconut jungle', 1), GYG('Hoi An basket boat')], tip: 'Mejor por la tarde, cuando el calor afloja.' },
    { id: 'cocina', d: 'jue11', alt: null, t: 'Clase de cocina y mercado en Hội An', w: 'Mercado, cocina en una casa de campo y comida.', p: '€20–35 p. p.', how: 'tour', links: [GYG('Hoi An cooking class market tour', 1), KLK('Hoi An cooking class'), VIA('Hoi An cooking class')], tip: 'Elegid grupos pequeños y reservad con tiempo: se llenan en Tết.' },
    { id: 'champan', d: 'jue11', alt: 'jue11-champan', t: 'Isla Cù Lao Chàm: snorkel', w: 'Lancha rápida, snorkel y comida de marisco.', p: '€30–45 p. p.', how: 'tour', links: [GYG('Cu Lao Cham snorkeling day trip Hoi An', 1), KLK('Cu Lao Cham snorkeling'), VIA('Cu Lao Cham island tour')], tip: 'Las salidas dependen del mar: confirmad la víspera y tened un día de reserva.' },
    { id: 'dragon', d: 'vie12', alt: 'vie12-dragon', t: 'Barco dragón por el río Perfume', w: '1 h de paseo con música tradicional.', p: '€7–10 p. p.', how: 'taquilla', links: [], tip: 'Se contrata en el muelle de Tòa Khâm. Acordad el precio del barco entero antes de subir.' },
    { id: 'hue-citadel', d: 'sab13', alt: null, t: 'Ciudadela Imperial y tumbas de Huế', w: 'Ciudadela (Đại Nội) y tumba de Khải Định; el combo cubre también Minh Mạng y Tự Đức.', p: 'Ciudadela ~€7 · combo ~€20', how: 'online', links: [SG('Entradas oficiales de Huế (e-ticket)', 'https://eticket.hueworldheritage.org.vn/', 1)], tip: 'El combo de ciudadela y tres tumbas vale 2 días. Comprobad el horario de Tết antes de ir.' },
    { id: 'hue-citadel-d', d: 'vie12', alt: 'hue-diario', t: 'Ciudadela Imperial y tumba de Khải Định', w: 'Huế en un día desde Hội An.', p: 'Ciudadela ~€7 · combo ~€20', how: 'online', links: [SG('Entradas oficiales de Huế (e-ticket)', 'https://eticket.hueworldheritage.org.vn/', 1)], tip: 'Con el día tan justo, comprad en línea y entrad por la puerta del Mediodía a primera hora.' },
    { id: 'puppets', d: 'dom14', alt: null, t: 'Teatro de marionetas sobre el agua Thăng Long', w: 'Una hora de marionetas con música en directo.', p: '€8–15 p. p.', how: 'online', links: [SG('Teatro Thăng Long (web oficial)', 'https://thanglongwaterpuppet.org/', 1), L('Klook', 'https://www.klook.com/en-US/activity/35653-thang-long-water-puppet-show-ticket-hanoi/'), L('Booking.com', 'https://www.booking.com/attractions/vn/priy47gam78x-thang-long-water-puppet-show.html')], tip: 'Reservad con antelación y elegid sección: hay aforo limitado y los revendedores suelen entregar un vale que se canjea en el teatro.' },
    { id: 'comida', d: 'dom14', alt: 'dom14-comida', t: 'Tour de comida callejera por el Old Quarter', w: 'Tres horas y 5–6 paradas con guía local.', p: '€20–35 p. p.', how: 'tour', links: [GYG('Hanoi street food tour', 1), KLK('Hanoi street food tour'), VIA('Hanoi street food tour')], tip: 'Mejor de tarde-noche; avisad de alergias al reservar.' },
    { id: 'cyclo', d: 'dom14', alt: 'dom14-tranvia', t: 'Paseo en ciclo por el Old Quarter', w: '45–60 min en triciclo.', p: '€10–15 por vehículo', how: 'taquilla', links: [], tip: 'Fijad el precio, el tiempo y la ruta antes de subir.' },
    { id: 'trangan', d: 'lun15', alt: null, t: 'Tràng An en barca y Hang Múa', w: 'Paseo remado de 2–3 h y 500 escalones hasta el mirador.', p: '~€9 + ~€4 p. p.', how: 'taquilla', links: [], tip: 'Se pagan en la taquilla de cada sitio. Id temprano y con calzado cerrado.' },
    { id: 'tamcoc', d: 'lun15', alt: 'lun15-tamcoc', t: 'Barca de Tam Cốc', w: 'Barca remada con los pies entre arrozales.', p: '~€8 p. p.', how: 'taquilla', links: [], tip: 'Se compra en el embarcadero. Evitad el mediodía.' },
    { id: 'cruise-link', d: 'mar16', alt: null, t: 'Crucero por la bahía de Hạ Long', w: 'Se reserva como alojamiento: elegid la categoría y el operador.', p: '€100–300 p. p.', how: 'online', links: [L('Ir a Estancia', 'estancia.html', 1)], tip: 'En Tết se llenan los mejores barcos. Preguntad por el traslado desde Ninh Bình y el regreso a Hà Nội.' },
    { id: 'etnologia', d: 'jue18', alt: null, t: 'Museo de Etnología y prisión de Hỏa Lò', w: 'Dos museos de entrada barata.', p: '~€1,5 + ~€4 p. p.', how: 'taquilla', links: [], tip: 'Se pagan en la taquilla.' },
    { id: 'maichau', d: 'jue18', alt: 'maichau', t: 'Valle de Mai Châu: aldeas y bici', w: 'Excursión de un día desde Hà Nội.', p: '€35–60 p. p.', how: 'tour', links: [GYG('Mai Chau day trip from Hanoi', 1), KLK('Mai Chau day tour'), VIA('Mai Chau day trip')], tip: 'Si ya tenéis coche, solo necesitáis la bici y la comida.' },
    { id: 'fansipan', d: 'vie19', alt: 'sapa', t: 'Teleférico del Fansipan', w: 'Ida y vuelta en teleférico y tren de cremallera hasta el mirador.', p: '€25–35 p. p.', how: 'online', links: [L('Sun World (guía de compra)', 'https://sunparadiseland.com/SunParadiseLandSaPa/tin-tuc/where-to-buy-fansipan-cable-car-tickets-complete-booking-guide-28376', 1), L('Headout', 'https://www.headout.com/tour/30781/vietnam/sa-pa/sun-world-fansipan-legend/'), L('Traveloka', 'https://traveloka.com/en-th/activities/vietnam/product/sun-world-fansipan-legend-cable-car-in-sapa-2000908873656')], tip: 'Se compra en línea o en taquilla. Si hay niebla fuerte, la cumbre puede quedar tapada: llevad abrigo y dejad margen.' },
    { id: 'hagiang', d: 'mar16', alt: 'hagiang', t: 'Hà Giang Loop con easy rider (3 días)', w: 'Moto con conductor, alojamiento en homestays y permisos de la zona fronteriza.', p: '€150–250 p. p.', how: 'tour', links: [GYG('Ha Giang Loop easy rider 3 days 2 nights', 1), VIA('Ha Giang Loop motorbike 3 days'), KLK('Ha Giang Loop')], tip: 'Mirad reseñas recientes y qué incluye (alojamiento, comidas, permiso). Pedid conductor con experiencia y casco para los tres.' },
    { id: 'vip', d: 'dom21', alt: 'dom21-sala', t: 'Sala VIP o ducha en SGN', w: 'Descanso y ducha antes de 24 h de viaje.', p: '€20–30 p. p.', how: 'online', links: [SG('Priority Pass', 'https://www.prioritypass.com/', 1), KLK('Tan Son Nhat airport lounge')], tip: 'Comprobad que la sala abre a la hora del vuelo (2:30).' }
  ];
  var events = function () {
    return EV.filter(function (e) {
      if (e.alt === '*') return true;
      if (e.alt === null) return !swapFor(e.d);
      var a = ALT_BY[e.alt];
      if (!a || !has(e.alt)) return false;
      return a.kind === 'swap' ? swapFor(e.d) === a : true;
    });
  };

  /* ---------- Totales y por día ---------- */
  var counts = function () {
    var s = stays(), l = legs(), e = events().filter(function (x) { return x.how !== 'taquilla'; }), n = 0, d = 0;
    s.forEach(function (x) { n++; if (done[x.id]) d++; });
    l.forEach(function (x) { n++; if (done[x.stuff]) d++; });
    e.forEach(function (x) { n++; if (done['ev-' + x.id]) d++; });
    n++; if (done.seguro) d++;
    return { stays: s.length, legs: l.length, events: e.length, total: n, done: d };
  };
  var forDay = function (d) {
    return {
      stays: stays().filter(function (s) { return s.from === d; }),
      legs: legs().filter(function (l) { return l.d === d; }),
      events: events().filter(function (e) { return e.d === d && e.how !== 'taquilla'; })
    };
  };
  var bestLink = function (links) { for (var i = 0; i < links.length; i++) if (links[i].best) return links[i]; return links[0] || null; };
  var linkA = function (l, cls) { return '<a class="' + (cls || 'lk') + (l.best ? ' best' : '') + '" href="' + esc(l.u) + '" target="' + (/^https?:/.test(l.u) ? '_blank" rel="noopener noreferrer' : '_self') + '">' + esc(l.n) + (/^https?:/.test(l.u) ? '<span class="mi" aria-hidden="true">open_in_new</span>' : '') + '</a>'; };
  var checkH = function (id, label) { return '<label class="done"><input type="checkbox" data-done="' + esc(id) + '"' + (done[id] ? ' checked' : '') + '><span>' + (label || 'Reservado') + '</span></label>'; };

  /* Reservas de un día, en formato compacto (página de la línea de tiempo) */
  var dayHtml = function (d) {
    var x = forDay(d), rows = [];
    x.stays.forEach(function (s) {
      var t = TIERS[1], l = s.c.cruise ? null : L('Buscar ' + s.c.name, bkLink(s, t), 1);
      rows.push({ i: 'hotel', t: 'Alojamiento en ' + s.c.name, s: s.nights + (s.nights > 1 ? ' noches' : ' noche') + ' · ' + short(s.from) + ' → ' + (NAMES[ORDER[ORDER.indexOf(s.last) + 1]] || ''), l: l || L('Elegir crucero', 'estancia.html#' + s.id, 1), id: s.id, page: 'estancia.html#' + s.id });
    });
    x.legs.forEach(function (l) { var o = l.opts.filter(function (q) { return q.best; })[0] || l.opts.filter(function (q) { return q.sel; })[0] || l.opts[0], b = bestLink(o.buy) || bestLink(l.opts[l.opts.length - 1].buy); rows.push({ i: o.m === 'flight' || o.m === 'search' ? 'flight' : o.m === 'train' ? 'train' : 'local_taxi', t: l.t, s: o.n + ' · ' + o.p, l: b, id: l.stuff, page: 'transporte.html#' + l.stuff }); });
    x.events.forEach(function (e) { var b = bestLink(e.links); rows.push({ i: e.how === 'tour' ? 'tour' : 'confirmation_number', t: e.t, s: e.p, l: b, id: 'ev-' + e.id, page: 'eventos.html#ev-' + e.id }); });
    if (!rows.length) return '';
    return '<ul class="bklist">' + rows.map(function (r) {
      return '<li><span class="mi bi" aria-hidden="true">' + r.i + '</span><div><b>' + esc(r.t) + '</b><small>' + esc(r.s) + '</small></div>' + (r.l ? linkA(r.l, 'btn mini') : '') + '<a class="btn mini ghost" href="' + r.page + '">Detalles</a>' + checkH(r.id, '') + '</li>';
    }).join('') + '</ul>';
  };

  /* ================= DESCARGA ================= */
  var plan = null;
  var parse = function (html) {
    var doc = new DOMParser().parseFromString(html, 'text/html'), days = {};
    doc.querySelectorAll('section.day').forEach(function (s) {
      var evs = []; s.querySelectorAll('.events > .ev').forEach(function (li) { var h = li.querySelector('h3'), p = li.querySelector('p'); evs.push({ time: li.querySelector('.time').textContent.trim(), title: h ? h.textContent.trim() : '', text: p ? p.textContent.trim() : '' }); });
      days[s.id] = { place: s.querySelector('.place').textContent.trim(), ev: evs };
    });
    return days;
  };
  var load = function () {
    if (plan) return Promise.resolve(plan);
    return fetch('index.html').then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (h) { plan = parse(h); return plan; });
  };
  var mins = function (t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); };
  var planDay = function (d) {
    var base = plan[d], sw = swapFor(d), items = [];
    if (sw) sw.days[d].ev.forEach(function (v) { items.push({ time: v[0], title: v[1], text: v[2], alt: sw }); });
    else base.ev.forEach(function (e) { items.push({ time: e.time, title: e.title, text: e.text }); });
    addsFor(d).forEach(function (a) {
      a.days[d].ev.forEach(function (v) {
        var m = mins(v[0]), at = items.length;
        for (var k = 0; k < items.length; k++) if (mins(items[k].time) > m) { at = k; break; }
        items.splice(at, 0, { time: v[0], title: v[1], text: v[2], alt: a });
      });
    });
    return { place: sw ? base.place : base.place, items: items, sw: sw, adds: addsFor(d) };
  };
  var saveFile = function (name, mime, text) {
    var b = new Blob([text], { type: mime + ';charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  var txt = function () {
    var o = ['VIETNAM · 5–21 DE FEBRERO DE 2027', 'Itinerario seleccionado para tres viajeros', ''];
    var ch = chosen();
    o.push(ch.length ? 'Alternativas elegidas: ' + ch.map(function (a) { return a.title; }).join('; ') + '.' : 'Plan base, sin alternativas.');
    o.push('');
    ORDER.forEach(function (d) {
      var p = planDay(d);
      o.push('— ' + longD(d).toUpperCase() + ' · ' + p.place + (p.sw ? ' (' + p.sw.title + ')' : ''));
      p.items.forEach(function (i) { o.push('  ' + i.time + '  ' + i.title + (i.alt && !p.sw ? ' [extra]' : '')); if (i.text) o.push('        ' + i.text); });
      o.push('');
    });
    o.push('ALOJAMIENTO');
    stays().forEach(function (s) { o.push('  ' + s.c.name + ': ' + s.in + ' → ' + s.out + ' (' + s.nights + (s.nights > 1 ? ' noches' : ' noche') + ')'); });
    o.push('', 'Horas locales de cada lugar. Precios y horarios son estimaciones; confirmadlos al reservar.');
    return o.join('\r\n');
  };
  var ical = function () {
    var fold = function (s) { var r = []; while (s.length > 60) { r.push(s.slice(0, 60)); s = ' ' + s.slice(60); } r.push(s); return r.join('\r\n'); };
    var ic = function (s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); };
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var stamp = (function () { var t = new Date(); return t.getUTCFullYear() + pad(t.getUTCMonth() + 1) + pad(t.getUTCDate()) + 'T' + pad(t.getUTCHours()) + pad(t.getUTCMinutes()) + pad(t.getUTCSeconds()) + 'Z'; })();
    var o = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vietnam trip//ES', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Vietnam 5-21 febrero 2027',
      'BEGIN:VTIMEZONE', 'TZID:Asia/Ho_Chi_Minh', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0700', 'TZOFFSETTO:+0700', 'TZNAME:ICT', 'END:STANDARD', 'END:VTIMEZONE',
      'BEGIN:VTIMEZONE', 'TZID:Europe/Madrid', 'BEGIN:STANDARD', 'DTSTART:19701025T030000', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD', 'BEGIN:DAYLIGHT', 'DTSTART:19700329T020000', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT', 'END:VTIMEZONE'];
    var n = 0, push = function (l) { o.push(fold(l)); };
    ORDER.forEach(function (d) {
      var p = planDay(d), it = p.items;
      it.forEach(function (e, k) {
        var tz = 'Asia/Ho_Chi_Minh', dn = dnum(d);
        if (d === 'vie5') { tz = 'Europe/Madrid'; if (mins(e.time) >= 12 * 60) dn = 4; }
        if (d === 'dom21' && k === 1) tz = 'Europe/Madrid';
        var m = mins(e.time), end = (k + 1 < it.length && mins(it[k + 1].time) > m) ? mins(it[k + 1].time) : m + 60;
        if (end - m > 240) end = m + 120;
        var day = '202702' + pad(dn), s = day + 'T' + pad(Math.floor(m / 60)) + pad(m % 60) + '00', ee = end >= 1440 ? '202702' + pad(dn + 1) + 'T' + pad(Math.floor((end - 1440) / 60)) + pad((end - 1440) % 60) + '00' : day + 'T' + pad(Math.floor(end / 60)) + pad(end % 60) + '00';
        push('BEGIN:VEVENT'); push('UID:vn-' + d + '-' + (n++) + '@vietnam-trip'); push('DTSTAMP:' + stamp);
        push('DTSTART;TZID=' + tz + ':' + s); push('DTEND;TZID=' + tz + ':' + ee);
        push('SUMMARY:' + ic(e.title)); if (e.text) push('DESCRIPTION:' + ic(e.text)); push('LOCATION:' + ic(p.place)); push('END:VEVENT');
      });
    });
    stays().forEach(function (s) {
      push('BEGIN:VEVENT'); push('UID:vn-stay-' + s.id + '@vietnam-trip'); push('DTSTAMP:' + stamp);
      push('DTSTART;VALUE=DATE:' + s.in.replace(/-/g, '')); push('DTEND;VALUE=DATE:' + s.out.replace(/-/g, ''));
      push('SUMMARY:' + ic('Alojamiento: ' + s.c.name)); push('TRANSP:TRANSPARENT'); push('END:VEVENT');
    });
    o.push('END:VCALENDAR');
    return o.join('\r\n');
  };
  var download = function (fmt) {
    return load().then(function () {
      if (fmt === 'ics') saveFile('vietnam-itinerario.ics', 'text/calendar', ical());
      else saveFile('vietnam-itinerario.txt', 'text/plain', txt());
    });
  };
  /* Botón con menú de formatos; se monta en el elemento dado */
  var mountDownload = function (el, cls) {
    var ic = cls === 'ic';
    el.innerHTML = '<details class="dl ' + (ic ? 'dlic' : '') + '"><summary class="' + (ic ? 'ibtn theme-btn' : 'btn') + '" title="Descargar el itinerario seleccionado" aria-label="Descargar el itinerario seleccionado"><span class="mi" aria-hidden="true">download</span>' + (ic ? '' : '<span class="dlt">Descargar itinerario</span>') + '</summary><div class="dlm" role="menu"><button type="button" role="menuitem" data-fmt="ics"><span class="mi" aria-hidden="true">calendar_month</span><b>Calendario (.ics)</b><small>Para Google, Apple u Outlook</small></button><button type="button" role="menuitem" data-fmt="txt"><span class="mi" aria-hidden="true">description</span><b>Texto (.txt)</b><small>Día a día, para leer o imprimir</small></button></div></details>';
    var dt = el.querySelector('details');
    dt.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fmt]'); if (!b) return;
      b.disabled = true;
      download(b.dataset.fmt).catch(function () { alert('No se ha podido preparar la descarga. Si abrís el archivo desde el disco, servid la carpeta o usad la web publicada.'); }).then(function () { b.disabled = false; dt.open = false; });
    });
    document.addEventListener('click', function (e) { if (!dt.contains(e.target)) dt.open = false; });
  };

  /* ================= PÁGINAS ================= */
  var PG = { itinerario: ['itinerario.html', 'Línea de tiempo', 'timeline'], estancia: ['estancia.html', 'Estancia', 'hotel'], transporte: ['transporte.html', 'Transporte', 'directions_transit'], eventos: ['eventos.html', 'Eventos', 'confirmation_number'], comida: ['comida.html', 'Comida', 'restaurant'] };
  var ACC = { itinerario: '--indigo', estancia: '--teal', transporte: '--red', eventos: '--gold', comida: '--jade' };
  var HEAD = { estancia: ['Dónde dormir', 'hotel'], transporte: ['Cómo moveros', 'directions_transit'], eventos: ['Qué reservar', 'confirmation_number'], comida: ['Dónde comer', 'restaurant'] };
  var mIcon = { flight: 'flight', search: 'travel_explore', train: 'train', bus: 'directions_bus', taxi: 'local_taxi', car: 'directions_car', walk: 'directions_walk' };
  var $ = function (id) { return document.getElementById(id); };
  var chrome = function (key, title, lead) {
    document.body.innerHTML = '<header class="top"><div class="wrap"><div class="bar"><a class="back" href="index.html" title="Volver a la web principal"><span class="mi" aria-hidden="true">arrow_back</span><span class="t">Web principal</span></a><h1 class="ttl">' + esc(title) + '<small>Vietnam · 5–21 de febrero de 2027</small></h1><span id="dlMount"></span><button type="button" class="ibtn" id="themeBtn" aria-label="Cambiar entre modo claro y nocturno" title="Modo claro o nocturno"><span class="mi" aria-hidden="true">contrast</span></button></div>' +
      '<nav class="tabs" aria-label="Secciones">' + Object.keys(PG).map(function (k) { return '<a href="' + PG[k][0] + '" style="--tz: var(' + ACC[k] + ')"' + (k === key ? ' aria-current="page"' : '') + '><span class="mi" aria-hidden="true">' + PG[k][2] + '</span>' + PG[k][1] + '</a>'; }).join('') + '</nav></div></header>' +
      '<main class="wrap"><header class="chap" style="--z: var(' + ACC[key] + ')"><span class="chap-ic" aria-hidden="true"><span class="mi">' + HEAD[key][1] + '</span></span><div><span class="chap-k">' + esc(PG[key][1]) + '</span><h2>' + esc(HEAD[key][0]) + '</h2></div><p class="chap-s">' + lead + '</p><div class="sum" id="sum"></div></header><div id="app"><p class="msg">Cargando…</p></div></main><footer class="wrap f">Los precios son estimaciones y los enlaces son de búsqueda o de la web de cada proveedor, sin comisiones. Comprobad el precio y la cancelación antes de pagar. <a href="index.html">Volver a la web principal</a></footer>';
    $('themeBtn').addEventListener('click', function () {
      var t = document.documentElement.getAttribute('data-theme'), dark = t ? t === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark'); try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) {}
    });
    mountDownload($('dlMount'), 'ic');
    var cur = document.querySelector('.tabs a[aria-current]'); if (cur && cur.scrollIntoView) { var tb = cur.parentNode; tb.scrollLeft = cur.offsetLeft - (tb.clientWidth - cur.offsetWidth) / 2; }
  };
  var summary = function () {
    var c = counts(), ch = chosen();
    $('sum').innerHTML = '<span><b>' + c.done + '</b> de <b>' + c.total + '</b> reservas hechas</span><span>' + (ch.length ? '<b>' + ch.length + '</b> alternativas elegidas' : 'Plan base') + ' · <a href="index.html#alternativas">cambiar</a></span>';
  };
  var bind = function (root) {
    root.addEventListener('change', function (e) {
      var i = e.target.closest('[data-done]'); if (!i) return;
      toggle(i.dataset.done, i.checked); var c = i.closest('.card, li'); if (c) c.classList.toggle('isdone', i.checked); summary();
    });
    window.addEventListener('storage', function (e) { if (e.key === SK || e.key === BK) location.reload(); });
  };
  var hashScroll = function () { if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) setTimeout(function () { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); }, 150); } };

  var grp = function (ic, t, sub, z) { return '<div class="grp" style="--z: var(' + (z || '--teal') + ')"><span class="gi" aria-hidden="true"><span class="mi">' + ic + '</span></span><div><b>' + esc(t) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div></div>'; };
  var pageStay = function () {
    chrome('estancia', 'Estancia', 'Dónde dormir en cada tramo de vuestro itinerario, con cuatro categorías de precio (tres en los homestays de montaña y en el crucero). Cada botón abre la búsqueda con las fechas, tres personas y el rango de precio ya puestos.');
    var ss = stays();
    $('app').innerHTML = '<div class="best"><span class="mi" aria-hidden="true">verified</span><div><b>Mejor sitio para reservar</b><p>Booking.com: la mayoría de las tarifas se cancelan gratis hasta unos días antes y se paga en el alojamiento, así que podéis reservar ya y ajustar después. Probad la misma búsqueda en Google Hoteles y comparad el precio final con impuestos. En Tết las habitaciones buenas se agotan.</p></div></div>' +
      '<p class="note">Los precios son por <b>habitación para tres personas</b> y noche, con impuestos. «P. p.» es por persona y refleja el coste típico de la categoría.</p>' +
      grp('bed', 'Noche a noche', ss.length + (ss.length === 1 ? ' alojamiento' : ' alojamientos') + ' según vuestro itinerario', '--teal') + ss.map(function (s) {
        var c = s.c, T = c.cruise ? TIERS_CRUISE : (c.home ? TIERS_HOME : TIERS), base = c.cruise ? c.base * 1.3 / 3 : c.base * 1.3 / 3 * s.nights;
        var tiers = T.map(function (t) {
          var pp = c.cruise ? t.typ : t.typ / 3, tot = c.cruise ? pp : pp * s.nights, dl = tot - base;
          var price = c.cruise ? '€' + t.pp[0] + '–' + t.pp[1] + ' p. p.' : (t.max > 9000 ? 'Desde ' + eur(t.min) : (t.min ? eur(t.min) + '–' + eur(t.max) : 'Hasta ' + eur(t.max))) + ' / noche';
          var links = c.cruise ? [L('Operadores en BestPrice', 'https://www.bestpricetravel.com/halong-bay-cruises/cruise-tours', t.k === 'mid'), L('Bhaya (eco)', 'https://bhayacruises.com/'), L('Halong Bay Tours', 'https://www.halongbaytours.com/')] : [L('Booking.com', bkLink(s, t), 1), L('Google Hoteles', U.ggh(c.ss, s.in, s.out))];
          return '<div class="tier' + (t.k === 'mid' ? ' base' : '') + '"><div class="th"><b>' + t.n + '</b>' + (t.k === 'mid' ? '<span class="pill">Plan base</span>' : '') + '</div><p class="price">' + price + '</p><p class="d">' + t.d + '</p><p class="pp">~' + eur(tot) + ' p. p. ' + (c.cruise ? 'la noche' : 'en ' + s.nights + (s.nights > 1 ? ' noches' : ' noche')) + ' <span class="' + (dl > 1 ? 'up' : dl < -1 ? 'down' : '') + '">(' + (dl >= 0 ? '+' : '−') + eur(Math.abs(dl)) + ' frente al presupuesto)</span></p><div class="lks">' + links.map(function (l) { return linkA(l, 'btn mini' + (l.best ? ' primary' : '')); }).join('') + '</div></div>';
        }).join('');
        var nb = s.nights + (s.nights > 1 ? ' noches' : ' noche');
        return '<section class="card' + (done[s.id] ? ' isdone' : '') + '" id="' + s.id + '" style="--z: var(' + c.c + ')"><header class="ch"><div><h2>' + esc(c.name) + '</h2><p class="meta"><span class="mi" aria-hidden="true">calendar_month</span>Entrada <b>' + longD(s.from) + '</b> · salida <b>' + dnum(ORDER[ORDER.indexOf(s.last) + 1]) + ' de febrero</b> · ' + nb + '</p></div>' + checkH(s.id) + '</header>' +
          (s.alt ? '<p class="pillrow"><span class="pill ok">Por «' + esc(s.alt.title) + '»</span></p>' : '') +
          (s.first ? '<p class="warn"><span class="mi" aria-hidden="true">schedule</span>Reservad desde la noche del 5: aterrizáis a la 1:10 del sábado y así entráis directamente a la habitación.</p>' : '') +
          '<p class="note">' + esc(c.tip) + (c.cruise ? ' El presupuesto base cuenta ~€87 p. p. por la noche en cabina; los precios habituales de mercado son más altos.' : '') + '</p><div class="tiers t' + T.length + '">' + tiers + '</div></section>';
      }).join('');
    summary(); bind($('app')); hashScroll();
  };


  /* Seguro de viaje: tres niveles, con enlaces a la web de cada aseguradora (sin cotizar; los precios son orientativos) */
  var INS = [
    { k: 'esencial', n: 'Esencial', p: '~€20–45 p. p.', d: 'Solo asistencia médica en el extranjero, repatriación y accidentes. Sin cancelación ni equipaje amplio.',
      pts: ['Gastos médicos de al menos 100.000 €', 'Repatriación sanitaria', 'Urgencias, hospitalización y medicinas'],
      links: [L('IATI Seguros', 'https://www.iatiseguros.com/'), L('Intermundial', 'https://www.intermundial.es/')] },
    { k: 'completo', n: 'Completo', p: '~€55–110 p. p.', d: 'Asistencia médica alta, equipaje, retrasos y cancelación por causas justificadas (enfermedad, accidente, etc.). La opción equilibrada.', best: true,
      pts: ['Gastos médicos de 150.000 € o más', 'Anulación por causas cubiertas, hasta ~€1.500–3.000 p. p.', 'Equipaje, demoras y pérdida de conexiones'],
      links: [L('IATI Seguros', 'https://www.iatiseguros.com/', 1), L('Heymondo', 'https://www.heymondo.es/'), L('Mapfre', 'https://www.mapfre.es/particulares/seguros-viaje/')] },
    { k: 'premium', n: 'Premium', p: '~€110–200 p. p.', d: 'Como el completo, con mayor límite de anulación y más motivos cubiertos. Merece la pena si no queréis perder lo ya pagado por ninguna razón razonable.',
      pts: ['Gastos médicos muy altos (cientos de miles de euros o más)', 'Anulación con límites altos y motivos ampliados', 'Deportes de aventura y más equipaje'],
      links: [L('IATI Anulación Premium', 'https://www.iatiseguros.com/seguros-viaje/38897/iati-anulacion-premium/', 1), L('Allianz', 'https://www.allianz-assistance.es/'), L('Heymondo', 'https://www.heymondo.es/')] }
  ];
  var insHtml = function () {
    var warn = [];
    if (has('hagiang')) warn.push('<b>Hà Giang Loop en moto:</b> muchas pólizas excluyen la moto sin carnet adecuado, o el uso de motos de más de 125 cc. Comprobad la letra pequeña o escoged un conductor local.');
    if (has('sapa')) warn.push('<b>Fansipan y trekking:</b> subir por sendero o a más de 3.000 m puede contar como deporte de aventura; confirmadlo en la póliza.');
    return '<section class="card' + (done.seguro ? ' isdone' : '') + '" id="seguro" style="--z: var(--red)"><header class="ch"><div><h2>Seguro de viaje</h2><p class="meta"><span class="mi" aria-hidden="true">health_and_safety</span>Para los tres, <b>5–21 de febrero</b> (17 días) · contratadlo antes de salir</p></div>' + checkH('seguro', 'Contratado') + '</header>' +
      '<p class="warn"><span class="mi" aria-hidden="true">schedule</span><span><b>Cuanto antes mejor:</b> los vuelos ya están comprados. Muchas aseguradoras dan la cobertura de cancelación completa si contratáis en las 24 h posteriores a la reserva o en pocos días; pasado ese plazo suele haber carencia (por ejemplo, 7 días). Mirad el plazo exacto de cada póliza antes de pagar.</span></p>' +
      '<p class="note">En Vietnam no sirve la tarjeta sanitaria europea: la sanidad privada es cara y la evacuación aún más, así que la asistencia médica es lo que más importa. Los precios son estimaciones para 17 días y no están en el presupuesto base.</p>' +
      warn.map(function (w) { return '<p class="warn"><span class="mi" aria-hidden="true">warning</span><span>' + w + '</span></p>'; }).join('') +
      '<div class="tiers t3">' + INS.map(function (t) {
        return '<div class="tier' + (t.best ? ' base' : '') + '"><div class="th"><b>' + t.n + '</b>' + (t.best ? '<span class="pill">Recomendado</span>' : '') + '</div><p class="price">' + t.p + '</p><p class="d">' + t.d + '</p><ul class="pts">' + t.pts.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><div class="lks">' + t.links.map(function (l, i) { return linkA(l, 'btn mini' + (i === 0 ? ' primary' : '')); }).join('') + '</div></div>';
      }).join('') + '</div></section>';
  };

  var pageTransport = function () {
    chrome('transporte', 'Transporte', 'El seguro de viaje y cada traslado de vuestro itinerario, con dos o tres formas de hacerlo, su precio y dónde comprarlo. Los billetes de tren se suelen abrir unos 60 días antes de la salida (confirmadlo en la web de Vietnam Railways).');
    var ls = legs();
    $('app').innerHTML = '<div class="best"><span class="mi" aria-hidden="true">verified</span><div><b>Mejor sitio para comprar</b><p><b>Vuelos:</b> comparad en Google Flights o Skyscanner y comprad en la web de la aerolínea. <b>Tren:</b> la web oficial de Vietnam Railways o un agente autorizado como Vexere (más fácil con tarjeta extranjera). <b>Autobús y traslados:</b> 12Go o Klook. <b>Ciudad:</b> Grab. <b>Seguro:</b> contratadlo ya, antes de nada más (ver abajo).</p></div></div>' + grp('health_and_safety', 'Antes de salir', 'Seguro de viaje', '--red') + insHtml() + grp('route', 'Traslados, día a día', ls.length + ' trayectos con dos o tres formas de hacerlos', '--indigo') +
      ls.map(function (l) {
        return '<section class="card' + (done[l.stuff] ? ' isdone' : '') + '" id="' + l.stuff + '" style="--z: var(' + (l.d ? '--teal' : '--muted') + ')"><header class="ch"><div><h2>' + esc(l.t) + '</h2><p class="meta"><span class="mi" aria-hidden="true">calendar_month</span>' + (l.d ? '<b>' + longD(l.d) + '</b> · ' : '') + esc(l.s) + '</p></div>' + checkH(l.stuff) + '</header><div class="opts">' +
          l.opts.map(function (o) {
            var rail = '';
            if (o.rail) { var dd = daysTo60(o.rail); rail = '<p class="rail"><span class="mi" aria-hidden="true">event</span>La venta abre hacia el <b>' + minus60(o.rail) + '</b> (' + (dd > 0 ? 'faltan ' + dd + ' días' : 'debería estar ya abierta') + ').</p>'; }
            return '<div class="opt' + (o.best ? ' rec' : '') + (o.sel ? ' sel' : '') + '"><span class="mi mic" aria-hidden="true">' + (mIcon[o.m] || 'commute') + '</span><div class="ob"><div class="oh"><b>' + esc(o.n) + '</b>' + (o.best ? '<span class="pill ok">Recomendada</span>' : '') + (o.sel ? '<span class="pill pref"><span class="mi" aria-hidden="true">star</span>En tu itinerario</span>' : '') + '</div><p class="op"><span>' + esc(o.p) + '</span>' + (o.t ? '<span><span class="mi" aria-hidden="true">schedule</span>' + esc(o.t) + '</span>' : '') + '</p><p class="d">' + esc(o.note) + '</p>' + rail + (o.buy.length ? '<div class="lks">' + o.buy.map(function (b, i) { return linkA(i === 0 ? L(b.n, b.u, 1) : b, 'btn mini' + (i === 0 ? ' primary' : '')); }).join('') + '</div>' : '') + '</div></div>';
          }).join('') + '</div></section>';
      }).join('');
    summary(); bind($('app')); hashScroll();
  };

  var pageEvents = function () {
    chrome('eventos', 'Eventos', 'Entradas, excursiones y extras de vuestro itinerario elegido, con el mejor sitio para comprarlos. Si cambiáis las alternativas, esta lista cambia con ellas.');
    var es = events(), f = 'all';
    var draw = function () {
      var byDay = {};
      es.forEach(function (e) { if (f === 'buy' && e.how === 'taquilla') return; if (f === 'door' && e.how !== 'taquilla') return; (byDay[e.d] = byDay[e.d] || []).push(e); });
      var days = Object.keys(byDay).sort(function (a, b) { return ORDER.indexOf(a) - ORDER.indexOf(b); });
      var HOW = { online: ['Comprar en línea', 'language'], tour: ['Reservar excursión', 'tour'], taquilla: ['En la entrada', 'storefront'] };
      $('list').innerHTML = days.length ? days.map(function (d) {
        return '<section class="dayg"><h2>' + longD(d) + '<small>' + esc((plan0[d] || '')) + '</small></h2>' + byDay[d].map(function (e) {
          var h = HOW[e.how];
          return '<article class="card ev' + (done['ev-' + e.id] ? ' isdone' : '') + '" id="ev-' + e.id + '" style="--z: var(--gold)"><header class="ch"><div><h3>' + esc(e.t) + (e.alt && e.alt !== '*' ? ' <span class="pill pref">Alternativa elegida</span>' : '') + '</h3><p class="meta"><span class="pill"><span class="mi" aria-hidden="true">' + h[1] + '</span>' + h[0] + '</span> <b>' + esc(e.p) + '</b></p></div>' + (e.links.length ? checkH('ev-' + e.id) : '') + '</header><p class="d">' + esc(e.w) + '</p><p class="note">' + esc(e.tip) + '</p>' + (e.links.length ? '<div class="lks">' + e.links.map(function (b, i) { return linkA(i === 0 ? L(b.n, b.u, 1) : b, 'btn mini' + (i === 0 ? ' primary' : '')); }).join('') + '</div>' : '') + '</article>';
        }).join('') + '</section>';
      }).join('') : '<p class="msg">No hay nada en esta vista.</p>';
      hashScroll();
    };
    var plan0 = {};
    $('app').innerHTML = '<div class="best"><span class="mi" aria-hidden="true">verified</span><div><b>Mejor sitio para comprar</b><p>Cuando existe, la <b>web oficial</b> (sin comisión). Para excursiones con recogida, GetYourGuide, Viator o Klook: cancelación gratuita y reseñas. Las entradas de monumentos baratos se compran en la taquilla.</p></div></div><div class="seg" role="group" aria-label="Filtrar"><button type="button" data-f="all" aria-pressed="true">Todo</button><button type="button" data-f="buy" aria-pressed="false">Por reservar</button><button type="button" data-f="door" aria-pressed="false">En la entrada</button></div><div id="list"></div>';
    $('app').querySelector('.seg').addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (!b) return; f = b.dataset.f; this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); draw(); });
    load().then(function (p) { Object.keys(p).forEach(function (k) { plan0[k] = p[k].place; }); }).catch(function () {}).then(function () { draw(); });
    summary(); bind($('app'));
  };


  /* ================= COMIDA ================= */
  var FOOD_OK = {
    hcm: function () { return true; }, hoian: function () { return true; }, hue: function () { return true; }, hanoi: function () { return true; }, ninh: function () { return true; },
    mekong: function () { var w = swapFor('dom7'); return !w || w.id === 'mekong-full' || w.id === 'dom7-privado'; },
    halong: function () { return !swapFor('mar16'); },
    sapa: function () { return has('sapa'); }, hagiang: function () { return has('hagiang'); }, maichau: function () { return has('maichau'); },
    catba: function () { return has('catba'); }, dalat: function () { return has('dalat'); }
  };
  var NOMAP = /^(Puestos|Cena |Comida en|Tortita|Marisco del|Lẩu)/;
  var pageFood = function () {
    chrome('comida', 'Comida', 'Dónde comer en cada zona de vuestro itinerario, en tres tramos de precio: callejero, medio y especial. Los lugares salen de guías públicas (Michelin, Fodor’s, Time Out y prensa vietnamita) y los precios son orientativos por persona. Si cambiáis las alternativas, las zonas cambian con ellas.');
    var F = VNFOOD, zs = F.ZONES.filter(function (z) { return FOOD_OK[z.id](); }), flt = 0;
    var mapA = function (sp, z) { return NOMAP.test(sp.n) ? '' : '<a class="btn mini" href="https://www.google.com/maps/search/?api=1&query=' + enc(sp.n + ' ' + z.city) + '" target="_blank" rel="noopener noreferrer"><span class="mi" aria-hidden="true">map</span>Ver en Google Maps<span class="mi" aria-hidden="true">open_in_new</span></a>'; };
    var spotH = function (sp, z) {
      return '<li class="spot"><div class="sh"><b>' + esc(sp.n) + '</b></div><p class="pillrow"><span class="pill">' + esc(sp.k) + '</span>' + (sp.tag ? '<span class="pill ok"><span class="mi" aria-hidden="true">verified</span>' + esc(sp.tag) + '</span>' : '') + '</p><p class="d">' + esc(sp.d) + '</p><p class="sm"><span><span class="mi" aria-hidden="true">payments</span>' + esc(sp.p) + ' p. p.</span>' + (sp.a ? '<span><span class="mi" aria-hidden="true">place</span>' + esc(sp.a) + '</span>' : '') + '</p>' + mapA(sp, z) + '</li>';
    };
    var zoneH = function (z) {
      var lanes = F.TIERS.map(function (t) {
        var ss = z.spots.filter(function (x) { return x.t === t.t; });
        return '<div class="lane" data-t="' + t.t + '" style="--tz: var(' + t.z + ')"><h3><span class="kb">' + t.k + '</span>' + t.n + '</h3>' + (ss.length ? '<ul class="spots">' + ss.map(function (x) { return spotH(x, z); }).join('') + '</ul>' : '<p class="note">Nada destacado en este tramo de precio.</p>') + '</div>';
      }).join('');
      return '<section class="zone" id="food-' + z.id + '" style="--z: var(' + z.c + ')"><header class="zh"><span class="zi" aria-hidden="true"><span class="mi">' + z.ic + '</span></span><div><h2>' + esc(z.n) + '</h2><p class="meta"><span class="mi" aria-hidden="true">calendar_month</span>' + esc(z.when) + (z.alt ? ' <span class="pill pref"><span class="mi" aria-hidden="true">star</span>Alternativa elegida</span>' : '') + (z.tet ? ' <span class="pill tet"><span class="mi" aria-hidden="true">celebration</span>Tết: comprobad que abre</span>' : '') + '</p></div></header>' +
        '<p class="dishes"><span class="dl"><span class="mi" aria-hidden="true">restaurant_menu</span>Qué probar</span>' + z.dishes.map(function (d) { return '<span class="dish">' + esc(d) + '</span>'; }).join('') + '</p><p class="note">' + esc(z.tip) + '</p><div class="lanes">' + lanes + '</div></section>';
    };
    var apply = function () {
      var app = $('app');
      app.querySelectorAll('.lane').forEach(function (l) { l.hidden = !!flt && +l.dataset.t !== flt; });
      app.querySelectorAll('.tierleg button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.f === flt)); });
      app.classList.toggle('one', !!flt);
    };
    $('app').innerHTML = '<div class="best"><span class="mi" aria-hidden="true">verified</span><div><b>Cómo usar esta página</b><p>Elegid el tramo de precio y bajad a la zona donde estéis cada día. En cada ficha, «Ver en Google Maps» abre la búsqueda del sitio para ver reseñas recientes, fotos y el horario de hoy.</p></div></div>' +
      '<p class="warn"><span class="mi" aria-hidden="true">celebration</span><span><b>Tết (5–10 de febrero):</b> muchos locales de barrio cierran entre 3 y 7 días porque sus dueños viajan a sus pueblos. Los puestos del centro, los sitios turísticos y los hoteles suelen seguir abiertos, pero comprobad siempre el horario antes de ir y tened un plan B (el restaurante del hotel o un supermercado).</span></p>' +
      '<div class="tierleg" role="group" aria-label="Filtrar por precio"><button type="button" data-f="0" aria-pressed="true" style="--tz: var(--red)"><span class="kb">Todo</span><b>Los tres tramos</b><small>Ver todo junto</small></button>' + F.TIERS.map(function (t) { return '<button type="button" data-f="' + t.t + '" aria-pressed="false" style="--tz: var(' + t.z + ')"><span class="kb">' + t.k + '</span><b>' + t.n + '</b><small>' + t.d + '</small></button>'; }).join('') + '</div>' +
      '<nav class="zchips" aria-label="Ir a una zona">' + zs.map(function (z) { return '<a href="#food-' + z.id + '" style="--z: var(' + z.c + ')"><span class="mi" aria-hidden="true">' + z.ic + '</span>' + esc(z.n) + '</a>'; }).join('') + '</nav>' +
      zs.map(zoneH).join('') + '<p class="note">Los precios son estimaciones para una comida por persona (1 € ≈ 30.000 ₫) y las direcciones se indican solo cuando constan en una fuente. Las menciones de Michelin son de las guías de 2023–2025: comprobad la edición vigente. Los locales abren, cierran y cambian: confirmad antes de ir.</p>';
    $('app').querySelector('.tierleg').addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (!b) return; flt = +b.dataset.f; apply(); });
    $('sum').innerHTML = '<span><b>' + zs.length + '</b> zonas según vuestro itinerario</span><span>' + (chosen().length ? '<b>' + chosen().length + '</b> alternativas elegidas' : 'Plan base') + ' · <a href="index.html#alternativas">cambiar</a></span>';
    window.addEventListener('storage', function (e) { if (e.key === SK) location.reload(); });
    hashScroll();
  };

  var boot = function (page) { ({ stay: pageStay, transport: pageTransport, events: pageEvents, food: pageFood })[page](); };
  return { boot: boot, counts: counts, foodZone: function (id) { return FOOD_OK[id](); }, dayHtml: dayHtml, mountDownload: mountDownload, download: download, bind: function (root) { root.addEventListener('change', function (e) { var i = e.target.closest('[data-done]'); if (i) toggle(i.dataset.done, i.checked); }); }, setMode: function (m) { mode = m; }, reload: loadSel, esc: esc };
})();
