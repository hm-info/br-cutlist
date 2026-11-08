/* TT405 / MS300 label simulator: builds the EPL2 command stream the machine
   sends to the label printer and draws an approximate preview. */
(function () {
  "use strict";

  var root = document.getElementById("label-tool");
  if (!root) return;
  var EN = root.getAttribute("data-lang") === "en";
  var T = function (tr, en) { return EN ? en : tr; };

  /* ---------- Factory default layouts ("Load SW format") ---------- */
  function L(p1, p2, p3, p4, p5, p6, p7) { return { p1: p1, p2: p2, p3: p3, p4: p4, p5: p5, p6: p6, p7: p7 }; }
  var LAYOUTS = {
    tt405_103x25: {
      label: { Q1: 160, Q2: 24, q: 840, R1: 5, R2: 1, S: 3, D: 15, Z: 1 },
      text: { 0: L(45, 40, 1, 1, 1, 1, 1), 1: L(60, 30, 0, 2, 1, 1, 0), 2: L(225, 30, 0, 2, 1, 1, 0), 3: L(60, 50, 0, 2, 1, 1, 0),
        4: L(400, 50, 0, 2, 1, 1, 0), 5: L(225, 50, 0, 2, 1, 1, 0), 6: L(650, 5, 0, 2, 1, 2, 0), 7: L(60, 70, 0, 2, 1, 1, 0),
        8: L(315, 70, 0, 2, 1, 1, 0), 9: L(60, 90, 0, 2, 1, 1, 0), 10: L(315, 90, 0, 2, 1, 1, 0), 11: L(600, 90, 0, 2, 1, 1, 0),
        14: L(0, 0, 0, 0, 0, 0, 0) },
      bc: { p1: 60, p2: 110, p3: 0, p4: 6, p5: 2, p6: 2, p7: 60, p8: 0 },
      bcid: { p1: 30, p2: 0, p3: 0, p4: 6, p5: 2, p6: 2, p7: 40, p8: 0 }
    },
    tt405_103x20: {
      label: { Q1: 160, Q2: 24, q: 840, R1: 5, R2: 1, S: 3, D: 15, Z: 1 },
      text: { 0: L(20, 10, 1, 1, 1, 1, 1), 1: L(30, 50, 0, 2, 1, 1, 0), 2: L(215, 50, 0, 2, 1, 1, 0), 3: L(660, 70, 0, 2, 1, 1, 0),
        4: L(575, 70, 0, 2, 1, 1, 0), 5: L(375, 50, 0, 2, 1, 1, 0), 6: L(650, 5, 0, 2, 1, 2, 0), 7: L(30, 70, 0, 2, 1, 1, 0),
        8: L(285, 70, 0, 2, 1, 1, 0), 9: L(30, 90, 0, 2, 1, 1, 0), 10: L(285, 90, 0, 2, 1, 1, 0), 11: L(550, 90, 0, 2, 1, 1, 0),
        14: L(0, 0, 0, 0, 0, 0, 0) },
      bc: { p1: 30, p2: 110, p3: 0, p4: 6, p5: 2, p6: 2, p7: 40, p8: 0 },
      bcid: { p1: 30, p2: 0, p3: 0, p4: 6, p5: 2, p6: 2, p7: 40, p8: 0 }
    },
    /* Barcode design 2 overrides (applied on top of the selected label size) */
    tt405_design2: {
      text: { 1: L(30, 5, 0, 3, 1, 1, 0), 2: L(30, 86, 0, 2, 1, 1, 0), 5: L(30, 26, 0, 2, 1, 1, 0), 6: L(575, 26, 0, 2, 1, 1, 0),
        11: L(575, 66, 0, 2, 1, 1, 0), 14: L(285, 26, 0, 2, 1, 1, 0) },
      bc: { p1: 250, p2: 84, p3: 0, p4: 6, p5: 2, p6: 2, p7: 40, p8: 1 }
    },
    ms300: {
      label: { Q1: 160, Q2: 24, q: 840, R1: 5, R2: 1, S: 3, D: 10, Z: 1 },
      text: { 0: L(10, 5, 1, 1, 1, 1, 1), 1: L(45, 10, 0, 2, 1, 1, 0), 2: L(205, 10, 0, 2, 1, 1, 0), 3: L(45, 26, 0, 2, 1, 1, 0),
        4: L(205, 26, 0, 2, 1, 1, 0), 5: L(345, 26, 0, 2, 1, 1, 0), 6: L(500, 10, 0, 2, 1, 2, 0), 7: L(45, 46, 0, 2, 1, 1, 0),
        8: L(260, 46, 0, 2, 1, 1, 0), 9: L(45, 66, 0, 2, 1, 1, 0), 10: L(195, 66, 0, 2, 1, 1, 0), 11: L(345, 66, 0, 2, 1, 1, 0) },
      bc: { p1: 30, p2: 90, p3: 0, p4: 6, p5: 2, p6: 2, p7: 40, p8: 0 }
    }
  };
  var BC_TYPES = ["3", "3C", "9", "0", "1", "1A", "1B", "1C", "1D", "K", "E80", "E82", "E85", "E30", "E32", "E35",
    "2G", "2", "1E", "UA0", "UA2", "UA5", "UE0", "UE2", "UE5", "2U", "L", "M"];

  var SAMPLES = [
    "1;806;XXXXXXX12PEN;45;45;1;60;X10MUSTERI;1;1;1;1;906;11;0;XXXXXXXXXX16BAYI",
    "2;906;XXXXXXX12PEN;45;45;1;60;X10MUSTERI;1;2;1;2;806;11;1;XXXXXXXXXX16BAYI",
    "9;1506;XXXXXXX12PEN;90;90;1;60;X10MUSTERI;200;1;2;10;1806;1;8;XXXXXXXXXX16BAYI",
    "10;1806;XXXXXXX12PEN;90;45;1;60;X10MUSTERI;200;2;2;20;1506;2;9;XXXXXXXXXX16BAYI",
    "13;1200;XXXXXXX12PEN;90;45;1;60;X10MUSTERI;60;1;5;100;1000;1;12;XXXXXXXXXX16BAYI"
  ];

  var ISLEM_TR = ["iSLEM YOK", "SU TAHLiYE", "KOL YERi", "MENTESE", "C.ACILIM", "T. A. SOL", "T. A. SAG", "C. A. SOL",
    "C. A. SAG", "V. A. SOL", "SAG A.KAPI", "SOL A.KAPI", "VASISTAS"];
  var ISLEM_EN = ["NO OPERAT.", "WATER SLOT", "HANDLE", "HINGE", "D.OPENING", "S. O. LEFT", "S. O. RIGHT", "D. O. LEFT",
    "D. O. RIGHT", "V. O. LEFT", "RIGHT O.DOOR", "LEFT O.DOOR", "VASISTAS"];
  var LOC_TR = ["()", "UST(Y)", "SAG(X)", "ALT(Y)", "SOL(X)"];
  var LOC_EN = ["()", "UP(Y)", "RGT(X)", "BOT(Y)", "LFT(X)"];

  /* ---------- PLC string helpers ---------- */
  function num(v) { var n = parseFloat(String(v).replace(",", ".")); return isNaN(n) ? 0 : n; }
  function r2s(x) { return String(Number(Number(x).toPrecision(6))); }      // REAL_TO_STRING (approx.)
  function left(s, n) { return String(s).substring(0, n); }
  function right(s, n) { s = String(s); return s.length > n ? s.substring(s.length - n) : s; }
  function padL(s, n, c) { s = String(s); while (s.length < n) s = c + s; return s; }
  function padR(s, n, c) { s = String(s); while (s.length < n) s = s + c; return s; }
  function dig(x) {                                                            // ExtractNumber6dig
    var f = function (v) { return Math.floor(v); };
    var i = f(x);
    return { 7: f((i % 100000) / 10000), 6: f((i % 10000) / 1000), 5: f((i % 1000) / 100), 4: f((i % 100) / 10),
      3: i % 10, 2: f(x * 10) % 10, 1: f(x * 100) % 10 };
  }
  function digits(x, list) { var d = dig(x); return list.map(function (k) { return d[k]; }).join(""); }
  var D6 = [6, 5, 4, 3, 2, 1];

  function parseRow(line) {
    var c = String(line).trim().split(";");
    while (c.length < 16) c.push("");
    return { prog: Math.round(num(c[0])), len: num(c[1]), profile: c[2], angL: num(c[3]), angR: num(c[4]),
      amount: num(c[5]), height: Math.round(num(c[6])), customer: c[7], pos: Math.round(num(c[8])), frame: Math.round(num(c[9])),
      cart: Math.round(num(c[10])), loc: num(c[11]), other: num(c[12]), color: Math.round(num(c[13])), islem: Math.round(num(c[14])),
      dealer: c[15] };
  }

  /* ---------- Label content ---------- */
  function buildTT405(r, o) {
    var tr = o.lang === "tr", d = o.design, tol = o.tol;
    var g = {
      prog: left(String(r.prog), 4), cart: right(String(r.cart), 1), pos: String(r.pos),
      x: left(r2s(r.len - tol), 7), y: left(r2s(r.other - tol), 7), lenS: r2s(r.len), otherS: r2s(r.other),
      loc: right(String(Math.round(r.loc)), 3), profile: left(r.profile, 12), customer: left(r.customer, 10),
      dealer: left(r.dealer, d === 3 ? 20 : 16), width: ""
    };
    if (d === 2) { g.width = left(r2s(r.height), 3); g.loc = right(g.loc, 2); }
    var islem = (tr ? ISLEM_TR : ISLEM_EN)[r.islem] || "";
    var loc = (tr ? LOC_TR : LOC_EN)[r.frame] || "";
    var t = {};
    t[0] = "LOGO";
    t[1] = (d === 2 ? (tr ? "SIPARIS NO:" : "ORDER NO:") : "PROG NO:") + g.prog;
    t[2] = (tr ? "ARABA NO:" : "CAR NO:") + g.cart;
    t[3] = islem;
    t[4] = loc;
    if (d === 2) t[5] = (tr ? "KALIP FARKI:" : "MOLD DIFFERENCE:") + g.loc + "mm";
    else if (d === 3) t[5] = (tr ? "YER NO:" : "BIN NO:") + g.loc;
    else t[5] = (tr ? "YER NO:" : "LOC NO:") + g.loc;
    t[6] = (d === 2 ? (tr ? "MODUL NO:" : "MODULE NO:") : "POZ NO:") + g.pos;
    t[7] = (tr ? "UZUNLUK:" : "VALUE:") + g.lenS + "mm";
    t[8] = d === 2 ? (tr ? "DIGER UZUNLUK:" : "OTHER VALUE:") + g.otherS + "mm"
      : (tr ? "CERCEVE:(" : "FRAME:(") + g.x + "x" + g.y + ")";
    t[9] = "PROFIL:" + g.profile;
    t[10] = (tr ? "BAYI:" : "VENDOR:") + g.dealer;
    t[11] = (tr ? "MUSTERI:" : "CLIENT:") + g.customer;
    t[14] = d === 2 ? (tr ? "PROFIL KALINLIGI:" : "PROFILE WIDTH:") + g.width + "mm" : (tr ? "YUKSEKLIK:" : "HEIGHT:") + "mm";

    var bc, parts;
    if (d === 1) {
      parts = [["K", T("Sabit", "Fixed")], [padL(g.prog, 4, "0"), T("Kesim no (4)", "Cut no (4)")],
        [padL(right(g.pos, 2), 2, "0"), T("Poz no (2)", "Pos no (2)")], [g.cart, T("Araba no (1)", "Cart no (1)")],
        [padL(right(g.loc, 2), 2, "0"), T("Yer no (2)", "Location no (2)")], ["00", T("Renk alanı (her zaman 00)", "Colour field (always 00)")],
        [padL(right(g.customer, 5), 5, "0"), T("Sipariş no son 5", "Order no last 5")]];
    } else if (d === 2) {
      parts = [[digits(r.len, [6, 5, 4, 3]), T("Uzunluk (4, tam mm)", "Length (4, whole mm)")],
        [digits(r.other, [6, 5, 4, 3]), T("Diğer eksen (4, tam mm)", "Other axis (4, whole mm)")],
        [digits(r.loc, [4, 3]), T("Yer no (2)", "Location no (2)")], [padL(g.width, 3, "0"), T("Yükseklik (3)", "Height (3)")]];
    } else if (d === 3) {
      parts = [[g.dealer, T("Bayi adı (en fazla 20)", "Dealer (max. 20)")]];
    } else if (d === 4) {
      parts = [[left(r.profile, 10), T("Profil kodu ilk 10", "Profile code first 10")],
        [digits(r.len, [6, 5, 4, 3, 2]), T("Uzunluk (5, 0,1 mm)", "Length (5, 0.1 mm)")],
        [digits(r.other, [6, 5, 4, 3, 2]), T("Diğer eksen (5, 0,1 mm)", "Other axis (5, 0.1 mm)")]];
    } else {
      parts = [["K", T("Sabit", "Fixed")], [g.cart, T("Araba no (1)", "Cart no (1)")],
        [padL(g.loc, 3, "0"), T("Yer no (3)", "Location no (3)")], [padR(g.profile, 12, " "), T("Profil kodu (12, sağa boşluk)", "Profile code (12, space padded)")],
        [digits(r.color, [4, 3]), T("Renk/conta (2)", "Colour/gasket (2)")],
        [digits(r.len - tol, D6), T("Uzunluk − kaynak payı (6, 0,01 mm)", "Length − weld allowance (6, 0.01 mm)")],
        [digits(r.other - tol, D6), T("Diğer eksen − kaynak payı (6, 0,01 mm)", "Other axis − weld allowance (6, 0.01 mm)")]];
    }
    bc = parts.map(function (p) { return p[0]; }).join("");

    var size = LAYOUTS[o.size], lay = JSON.parse(JSON.stringify(size));
    var enabled = {};
    for (var i = 0; i <= 11; i++) enabled[i] = true;
    if (d === 2) {
      var ov = LAYOUTS.tt405_design2;
      Object.keys(ov.text).forEach(function (k) { lay.text[k] = ov.text[k]; });
      lay.bc = ov.bc; enabled[14] = true;
    }
    var lines = ["", "N", "Y38,N,8,1", "Q" + lay.label.Q1 + "," + lay.label.Q2 + ",", "q" + lay.label.q,
      "R" + lay.label.R1 + "," + lay.label.R2, "S" + lay.label.S, "OD", "D" + lay.label.D];
    var texts = [];
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14].forEach(function (k) {
      if (!enabled[k]) return;
      texts.push({ idx: k, f: lay.text[k], s: t[k] });
      lines.push(aCmd(lay.text[k], t[k]));
    });
    var barcodes = [{ b: lay.bc, data: bc }];
    lines.push(bCmd(lay.bc) + '"' + bc + '"');
    if (o.second) {
      var id = padL(g.prog, 4, "0");
      lines.push(bCmd(lay.bcid) + '"' + id + '"');
      barcodes.push({ b: lay.bcid, data: id });
    }
    lines.push("Z" + (lay.label.Z ? "B" : "T"), "P1");
    return { lines: lines, texts: texts, barcodes: barcodes, parts: parts, label: lay.label, allText: t };
  }

  function buildMS300(r, o) {
    var tol = o.tol;
    var g = {
      prog: left(String(r.prog), 4), cart: left(String(r.cart), 9), pos: String(r.pos),
      x: left(r2s(r.len - tol), 7), y: left(r2s(r.other - tol), 7), lenS: r2s(r.len),
      loc: String(Math.round(r.loc)), profile: left(r.profile, 12), customer: left(r.customer, 10), dealer: left(r.dealer, 12)
    };
    var t = {};
    t[0] = "LOGO";
    t[1] = "PROG NO:" + g.prog;
    t[2] = "ARABA NO:" + g.cart;
    t[3] = ISLEM_TR[r.islem] || "";
    t[4] = LOC_TR[r.frame] || "";
    if (o.angle && (r.angL > 0 || r.angR > 0)) t[4] += " ACI:" + Math.round(r.angL) + "/" + Math.round(r.angR);
    t[5] = "YER:" + g.loc;
    t[6] = "POZ NO:" + g.pos;
    t[7] = "LENGTH:" + g.lenS + "mm";
    t[8] = "CERCEVE:(" + g.x + "x" + g.y + ")";
    t[9] = "PROFIL:" + g.profile;
    t[10] = "BAYI:" + g.dealer;
    t[11] = "MUSTER:" + g.customer;
    var parts = [["K1111", T("Sabit", "Fixed")], [g.profile, T("Profil kodu (en fazla 12, dolgu yok)", "Profile code (max. 12, no padding)")],
      [digits(r.color, [4, 3]), T("Renk/conta (2)", "Colour/gasket (2)")],
      [digits(r.len - tol, D6), T("Uzunluk − kaynak payı (6, 0,01 mm)", "Length − weld allowance (6, 0.01 mm)")],
      [digits(r.height - tol, D6), T("Yükseklik − kaynak payı (6, 0,01 mm)", "Height − weld allowance (6, 0.01 mm)")]];
    var bc = parts.map(function (p) { return p[0]; }).join("");
    var lay = LAYOUTS.ms300;
    var lines = ["N", "Y38,N,8,1", "Q" + lay.label.Q1 + "," + lay.label.Q2 + ",", "q" + lay.label.q,
      "R" + lay.label.R1 + "," + lay.label.R2, "S" + lay.label.S, "OD", "S" + lay.label.D];
    var texts = [];
    for (var k = 0; k <= 11; k++) { texts.push({ idx: k, f: lay.text[k], s: t[k] }); lines.push(aCmd(lay.text[k], t[k])); }
    lines.push(bCmd(lay.bc) + '"' + bc + '"', "P1");
    return { lines: lines, texts: texts, barcodes: [{ b: lay.bc, data: bc }], parts: parts, label: lay.label, allText: t };
  }

  function aCmd(f, s) { return "A" + [f.p1, f.p2, f.p3, f.p4, f.p5, f.p6, f.p7 ? "R" : "N"].join(",") + ',"' + s + '"'; }
  function bCmd(b) { return "B" + [b.p1, b.p2, b.p3, BC_TYPES[b.p4], b.p5, b.p6, b.p7, b.p8 ? "B" : "N"].join(",") + ","; }

  /* ---------- Code 128 (subset B) for the preview ---------- */
  var C128 = ["212222","222122","222221","121223","121322","131222","122213","122312","132212","221213","221312","231212",
    "112232","122132","122231","113222","123122","123221","223211","221132","221231","213212","223112","312131","311222",
    "321122","321221","312212","322112","322211","212123","212321","232121","111323","131123","131321","112313","132113",
    "132311","211313","231113","231311","112133","112331","132131","113123","113321","133121","313121","211331","231131",
    "213113","213311","213131","311123","311321","331121","312113","312311","332111","314111","221411","431111","111224",
    "111422","121124","121421","141122","141221","112214","112412","122114","122411","142112","142211","241211","221114",
    "413111","241112","134111","111242","121142","121241","114212","124112","124211","411212","421112","421211","212141",
    "214121","412121","111143","111341","131141","114113","114311","411113","411311","113141","114131","311141","411131",
    "211412","211214","211232","2331112"];
  function code128B(s) {
    var codes = [104], sum = 104;
    for (var i = 0; i < s.length; i++) {
      var v = s.charCodeAt(i) - 32;
      if (v < 0 || v > 94) v = 0;
      codes.push(v); sum += v * (i + 1);
    }
    codes.push(sum % 103, 106);
    return codes.map(function (c) { return C128[c]; }).join("");
  }

  /* ---------- Preview (SVG) ---------- */
  var FONTS = { 1: [10, 12], 2: [12, 16], 3: [14, 20], 4: [16, 24], 5: [36, 48] };   // pitch, height (dots, 203 dpi)
  var NS = "http://www.w3.org/2000/svg";
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }
  function draw(svg, res) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var lab = res.label, ox = lab.R1, oy = lab.R2, W = lab.q, H = lab.Q1, maxY = 0;
    var g = el("g", {}, null);
    res.texts.forEach(function (t) {
      var f = t.f, fs = FONTS[f.p4] || FONTS[2], pitch = fs[0] * f.p5, h = fs[1] * f.p6, len = Math.max(1, t.s.length);
      var w = pitch * len, x = f.p1 + ox, y = f.p2 + oy, rot = (f.p3 || 0) * 90;
      var grp = el("g", { transform: "translate(" + x + " " + y + ") rotate(" + rot + ")" }, g);
      if (f.p7) el("rect", { x: 0, y: 0, width: w, height: h, "class": "lt-rev" }, grp);
      var txt = el("text", { x: 0, y: h * 0.82, "font-size": h * 0.95, textLength: w, lengthAdjust: "spacingAndGlyphs",
        "class": f.p7 ? "lt-txt lt-txt--rev" : "lt-txt" }, grp);
      txt.textContent = t.s;
      var tip = el("title", {}, grp); tip.textContent = T("Satır ", "Line ") + t.idx + ": " + t.s;
      var bottom = rot === 90 || rot === 270 ? y + w : y + h;
      if (bottom > maxY) maxY = bottom;
    });
    res.barcodes.forEach(function (b) {
      var p = b.b, x = p.p1 + ox, y = p.p2 + oy, mod = p.p5, h = p.p7, pattern = code128B(b.data), cx = x, bar = true;
      for (var i = 0; i < pattern.length; i++) {
        var wdt = parseInt(pattern[i], 10) * mod;
        if (bar) el("rect", { x: cx, y: y, width: wdt, height: h, "class": "lt-bar" }, g);
        cx += wdt; bar = !bar;
      }
      var bottom = y + h;
      if (p.p8) {
        var hr = el("text", { x: x, y: y + h + 14, "font-size": 14, textLength: cx - x, lengthAdjust: "spacingAndGlyphs", "class": "lt-txt" }, g);
        hr.textContent = b.data; bottom += 18;
      }
      if (bottom > maxY) maxY = bottom;
      if (cx > W) W = cx + 10;
    });
    var vbH = maxY > H ? maxY + 6 : H;
    svg.setAttribute("viewBox", "-4 -4 " + (W + 8) + " " + (vbH + 8));
    el("rect", { x: 0, y: 0, width: lab.q, height: H, "class": "lt-label" }, svg);
    if (vbH > H) el("rect", { x: 0, y: H, width: lab.q, height: vbH - H, "class": "lt-overflow" }, svg);
    svg.appendChild(g);
  }

  /* ---------- UI ---------- */
  function field(label, control) {
    var w = document.createElement("label"); w.className = "lt-field";
    var s = document.createElement("span"); s.textContent = label; w.appendChild(s); w.appendChild(control); return w;
  }
  function select(opts, value) {
    var s = document.createElement("select");
    opts.forEach(function (o) { var e = document.createElement("option"); e.value = o[0]; e.textContent = o[1]; s.appendChild(e); });
    s.value = value; return s;
  }
  function input(type, value) { var i = document.createElement("input"); i.type = type; i.value = value; return i; }

  var machine = select([["tt405", "TT405"], ["ms300", "MS300"]], "tt405");
  var design = select([["0", T("0 - Standart barkod", "0 - Standard barcode")], ["1", T("1 - Barkod 1", "1 - Barcode 1")],
    ["2", T("2 - Barkod 2", "2 - Barcode 2")], ["3", T("3 - Barkod 3", "3 - Barcode 3")], ["4", T("4 - Barkod 4", "4 - Barcode 4")]], "0");
  var size = select([["tt405_103x20", "103x20"], ["tt405_103x25", "103x25"]], "tt405_103x20");
  var lang = select([["tr", T("Türkçe", "Turkish")], ["en", T("İngilizce", "English")]], EN ? "en" : "tr");
  var second = select([["0", T("Pasif", "Passive")], ["1", T("Aktif", "Active")]], "0");
  var angle = select([["0", T("Yok", "Off")], ["1", T("Var (yeni sürüm)", "On (new version)")]], "0");
  var tol = input("number", "0"); tol.step = "0.1";
  var sample = select(SAMPLES.map(function (s, i) { return [String(i), T("Örnek ", "Sample ") + s.split(";")[0]]; }), "0");
  var row = input("text", SAMPLES[0]); row.className = "lt-row"; row.spellcheck = false;

  var form = document.createElement("div"); form.className = "lt-form";
  var fDesign = field(T("Barkod tasarım no", "Barcode design no"), design);
  var fSize = field(T("Etiket boyutu", "Label size"), size);
  var fLang = field(T("Dil", "Language"), lang);
  var fSecond = field(T("2. barkod", "2nd barcode"), second);
  var fAngle = field(T("Açı eki (konum satırı)", "Angle suffix (location line)"), angle);
  [field(T("Makine", "Machine"), machine), fDesign, fSize, fLang, fSecond, fAngle,
    field(T("Kaynak payı (mm)", "Weld allowance (mm)"), tol), field(T("Örnek satır", "Sample row"), sample)].forEach(function (f) { form.appendChild(f); });
  var fRow = field(T("Kesim listesi satırı (16 alan, ; ile)", "Cut list row (16 fields, ; separated)"), row); fRow.classList.add("lt-field--wide");
  form.appendChild(fRow);

  var svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "lt-svg"); svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", T("Etiket önizlemesi", "Label preview"));
  var prevBox = document.createElement("figure"); prevBox.className = "lt-preview"; prevBox.appendChild(svg);
  var cap = document.createElement("figcaption");
  cap.textContent = T("Yaklaşık önizleme (203 dpi, 1 nokta = 0,125 mm). Kırmızı alan etiket boyunu aşan kısımdır.",
    "Approximate preview (203 dpi, 1 dot = 0.125 mm). The red area is outside the label length.");
  prevBox.appendChild(cap);

  var bcTable = document.createElement("table"); bcTable.className = "lt-table";
  var pre = document.createElement("pre"); pre.className = "lt-epl";
  var copy = document.createElement("button"); copy.type = "button"; copy.className = "lt-copy"; copy.textContent = T("Komutları kopyala", "Copy commands");

  function h3(text) { var h = document.createElement("h3"); h.textContent = text; return h; }
  root.appendChild(form);
  root.appendChild(h3(T("Önizleme", "Preview")));
  root.appendChild(prevBox);
  root.appendChild(h3(T("Barkod içeriği", "Barcode content")));
  root.appendChild(bcTable);
  root.appendChild(h3(T("Yazıcıya giden komutlar", "Commands sent to the printer")));
  root.appendChild(copy);
  root.appendChild(pre);

  var last = "";
  function update() {
    var tt = machine.value === "tt405";
    [fDesign, fSize, fLang, fSecond].forEach(function (f) { f.hidden = !tt; });
    fAngle.hidden = tt;
    var r = parseRow(row.value);
    var o = { design: parseInt(design.value, 10), size: size.value, lang: lang.value, second: second.value === "1",
      angle: angle.value === "1", tol: num(tol.value) };
    var res = tt ? buildTT405(r, o) : buildMS300(r, o);
    draw(svg, res);
    bcTable.innerHTML = "";
    var head = bcTable.createTHead().insertRow();
    [T("Sıra", "Order"), T("Değer", "Value"), T("Kaynak", "Source")].forEach(function (x) { var th = document.createElement("th"); th.textContent = x; head.appendChild(th); });
    var body = bcTable.createTBody();
    res.parts.forEach(function (p, i) {
      var tr = body.insertRow();
      tr.insertCell().textContent = i + 1;
      var c = tr.insertCell(); var code = document.createElement("code"); code.textContent = p[0].replace(/ /g, "␣"); c.appendChild(code);
      tr.insertCell().textContent = p[1];
    });
    var all = body.insertRow(); all.className = "lt-total";
    all.insertCell().textContent = "=";
    var c2 = all.insertCell(); c2.colSpan = 2; var code2 = document.createElement("code");
    code2.textContent = res.parts.map(function (p) { return p[0]; }).join("").replace(/ /g, "␣"); c2.appendChild(code2);
    last = (res.lines[0] === "" ? "\n" + res.lines.slice(1).join("\r\n") : res.lines.join("\r\n")) + "\r\n";
    pre.textContent = res.lines.map(function (l) { return l === "" ? "␊ " + T("(boş satır: yalnız LF)", "(empty line: LF only)") : l; }).join("\n");
  }
  [machine, design, size, lang, second, angle, tol, row].forEach(function (c) { c.addEventListener("input", update); c.addEventListener("change", update); });
  sample.addEventListener("change", function () { row.value = SAMPLES[parseInt(sample.value, 10)]; update(); });
  copy.addEventListener("click", function () {
    var done = function () { copy.textContent = T("Kopyalandı", "Copied"); setTimeout(function () { copy.textContent = T("Komutları kopyala", "Copy commands"); }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(last).then(done, function () {});
  });
  update();
})();
