/* TT405 / MS300 label simulator.
   A web copy of the machine's Printer Settings page: the settings start with the
   PLC preset ("Load SW format") and every edit rebuilds the EPL2 command stream
   with the same rules as the PLC label code. */
(function () {
  "use strict";

  var root = document.getElementById("label-tool");
  if (!root) return;
  var EN = root.getAttribute("data-lang") === "en";
  var T = function (tr, en) { return EN ? en : tr; };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  /* ---------- PLC presets (only the values the PLC actually assigns) ---------- */
  var DEF = {"tt405_103x25":{"text":{"0":{"p1":45,"p2":40,"p3":1,"p4":1,"p5":1,"p6":1,"p7":1},"1":{"p1":60,"p2":30,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"2":{"p1":225,"p2":30,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"5":{"p1":225,"p2":50,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"6":{"p1":650,"p2":5,"p6":2,"p4":2,"p5":1,"p7":0},"7":{"p1":60,"p2":70,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"8":{"p1":315,"p2":70,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"4":{"p1":400,"p2":50,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"3":{"p1":60,"p2":50,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"9":{"p1":60,"p2":90,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"10":{"p1":315,"p2":90,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"11":{"p1":600,"p2":90,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"12":{"p1":45,"p2":90,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"13":{"p1":20,"p2":10,"p3":1,"p4":1,"p5":1,"p6":1,"p7":1},"14":{"enable":0,"p1":0,"p2":0,"p3":0,"p4":0,"p5":0,"p6":0,"p7":0}},"bc":{"p1":60,"p2":110,"p3":0,"p4":6,"p5":2,"p6":2,"p7":60,"p8":0},"bcid":{"p1":30,"p2":0,"p3":0,"p4":6,"p5":2,"p6":2,"p7":40,"p8":0},"label":{"Dp1":15,"Qp1":160,"qp1":840,"Qp2":24,"Rp1":5,"Rp2":1,"Sp1":3,"Zp1":1}},"tt405_103x20":{"text":{"0":{"p1":20,"p2":10,"p3":1,"p4":1,"p5":1,"p6":1,"p7":1},"1":{"p1":30,"p2":50,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"2":{"p1":215,"p2":50,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"5":{"p1":375,"p2":50,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"6":{"p1":650,"p2":5,"p6":2,"p4":2,"p5":1,"p7":0},"7":{"p1":30,"p2":70,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"8":{"p1":285,"p2":70,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"4":{"p1":575,"p2":70,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"3":{"p1":660,"p2":70,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"9":{"p1":30,"p2":90,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"10":{"p1":285,"p2":90,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"11":{"p1":550,"p2":90,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"12":{"p1":45,"p2":90,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"13":{"p1":20,"p2":10,"p3":1,"p4":1,"p5":1,"p6":1,"p7":1},"14":{"enable":0,"p1":0,"p2":0,"p3":0,"p4":0,"p5":0,"p6":0,"p7":0}},"bc":{"p1":30,"p2":110,"p3":0,"p4":6,"p5":2,"p6":2,"p7":40,"p8":0},"bcid":{"p1":30,"p2":0,"p3":0,"p4":6,"p5":2,"p6":2,"p7":40,"p8":0},"label":{"Dp1":15,"Qp1":160,"qp1":840,"Qp2":24,"Rp1":5,"Rp2":1,"Sp1":3,"Zp1":1}},"tt405_d2":{"text":{"6":{"p1":575,"p2":26,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"1":{"p1":30,"p2":5,"p3":0,"p4":3,"p5":1,"p6":1,"p7":0},"5":{"p1":30,"p2":26,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"14":{"p1":285,"p2":26,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"2":{"p1":30,"p2":86,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"11":{"p1":575,"p2":66,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0}},"bc":{"p1":250,"p2":84,"p3":0,"p4":6,"p5":2,"p6":2,"p7":40,"p8":1}},"ms300":{"text":{"0":{"p1":10,"p2":5,"p3":1,"p4":1,"p5":1,"p6":1,"p7":1},"1":{"p1":45,"p2":10,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"2":{"p1":205,"p2":10,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"3":{"p1":45,"p2":26,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"4":{"p1":205,"p2":26,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"5":{"p1":345,"p2":26,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"6":{"p1":500,"p2":10,"p6":2,"p4":2,"p5":1,"p7":0},"7":{"p1":45,"p2":46,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"8":{"p1":260,"p2":46,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"9":{"p1":45,"p2":66,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"10":{"p1":195,"p2":66,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"11":{"p1":345,"p2":66,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"12":{"p1":45,"p2":66,"p3":0,"p4":2,"p5":1,"p6":1,"p7":0},"13":{"p1":5,"p2":15,"p3":1,"p4":1,"p5":1,"p6":1,"p7":1}},"bc":{"p1":30,"p2":90,"p3":0,"p4":6,"p5":2,"p6":2,"p7":40,"p8":0},"label":{"Dp1":10,"Qp1":160,"qp1":840,"Qp2":24,"Rp1":5,"Rp2":1,"Sp1":3,"Zp1":1}}};

  var BC_TYPES = ["3", "3C", "9", "0", "1", "1A", "1B", "1C", "1D", "K", "E80", "E82", "E85", "E30", "E32", "E35",
    "2G", "2", "1E", "UA0", "UA2", "UA5", "UE0", "UE2", "UE5", "2U", "L", "M"];
  var BC_NAMES = ["Code 39 std.", "Code 39 with check digit", "Code 93", "Code 128 UCC", "Code 128 auto A, B, C",
    "Code 128 mode A", "Code 128 mode B", "Code 128 mode C", "Code 128 with Deu.Post", "Codabar", "EAN8",
    "EAN8 2 digit add-on", "EAN8 5 digit add-on", "EAN13", "EAN13 2 digit add-on", "EAN13 5 digit add-on",
    "German Post Code", "Interleaved 2 of 5", "UCC/EAN 128", "UPC A", "UPC A 2 digit add-on", "UPC A 5 digit add-on",
    "UPC E", "UPC E 2 digit add-on", "UPC E 5 digit add-on", "UPC Interleaved 2 of 5", "Plessey (MSI-1)",
    "MSI-3 with mod. 10 check digit"];
  var LINE_NAMES = T(
    ["Logo", "Prog No", "Araba No", "İşlem", "Çerçevedeki Yer", "Yer", "Poz No", "Uzunluk", "Çerçeve", "Profil", "Bayi",
      "Müşteri", "Logo Manuel", "Uzunluk Manuel", "Yükseklik"],
    ["Logo", "Prog No", "Car No", "Operation", "Loc. on frame", "Location", "Poz No", "Length", "Frame", "Profile",
      "Dealer", "Customer", "Manual Logo", "Manual Length", "Height"]);

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

  /* ---------- Settings state (one per machine, like the PLC's retained values) ---------- */
  function emptyMachine(n) {
    var t = {};
    for (var i = 0; i < n; i++) t[i] = { enable: 0, p1: 0, p2: 0, p3: 0, p4: 1, p5: 1, p6: 1, p7: 0 };
    return { text: t, bc: { p1: 0, p2: 0, p3: 0, p4: 6, p5: 2, p6: 2, p7: 40, p8: 0 },
      bcid: { p1: 0, p2: 0, p3: 0, p4: 6, p5: 2, p6: 2, p7: 40, p8: 0 },
      label: { Dp1: 10, Qp1: 160, qp1: 840, Qp2: 24, Rp1: 0, Rp2: 0, Sp1: 3, Zp1: 0 },
      design: 0, second: 0, size25: 0 };
  }
  function assign(dst, src) { Object.keys(src).forEach(function (k) { dst[k] = src[k]; }); }
  /* DefaultDataFromSW: TT405 */
  function loadTT405(st) {
    var src = DEF[st.size25 ? "tt405_103x25" : "tt405_103x20"];
    Object.keys(src.text).forEach(function (k) { assign(st.text[k], src.text[k]); });
    assign(st.bc, src.bc); assign(st.bcid, src.bcid); assign(st.label, src.label);
    for (var i = 0; i <= 13; i++) st.text[i].enable = 1;
    if (st.design === 2) {
      Object.keys(DEF.tt405_d2.text).forEach(function (k) { assign(st.text[k], DEF.tt405_d2.text[k]); });
      assign(st.bc, DEF.tt405_d2.bc);
      for (var j = 0; j <= 14; j++) st.text[j].enable = 1;
    }
  }
  /* DefaultDataFromSW: MS300 */
  function loadMS300(st) {
    Object.keys(DEF.ms300.text).forEach(function (k) { assign(st.text[k], DEF.ms300.text[k]); });
    assign(st.bc, DEF.ms300.bc); assign(st.label, DEF.ms300.label);
    for (var i = 0; i <= 13; i++) st.text[i].enable = 1;
  }
  function freshState() {
    var s = { machine: "ms300", tab: 0, line: 0, lang: EN ? "en" : "tr", tol: 0, angle: 1, row: SAMPLES[0],
      tt405: emptyMachine(15), ms300: emptyMachine(14) };
    loadTT405(s.tt405); loadMS300(s.ms300);
    return s;
  }
  var KEY = "br-cutlist-label-v2";
  var state;
  try { state = JSON.parse(window.localStorage.getItem(KEY)); } catch (e) { state = null; }
  if (!state || !state.tt405 || !state.ms300) state = freshState();
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } }

  /* ---------- PLC string helpers ---------- */
  function num(v) { var n = parseFloat(String(v).replace(",", ".")); return isNaN(n) ? 0 : n; }
  function r2s(x) { return String(Number(Number(x).toPrecision(6))); }      // REAL_TO_STRING (approx.)
  function left(s, n) { return String(s).substring(0, n); }
  function right(s, n) { s = String(s); return s.length > n ? s.substring(s.length - n) : s; }
  function padL(s, n, c) { s = String(s); while (s.length < n) s = c + s; return s; }
  function padR(s, n, c) { s = String(s); while (s.length < n) s = s + c; return s; }
  function dig(x) {                                                            // ExtractNumber6dig
    var f = Math.floor, i = f(x);
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

  function aCmd(f, s) { return "A" + [f.p1, f.p2, f.p3, f.p4, f.p5, f.p6, f.p7 ? "R" : "N"].join(",") + ',"' + s + '"'; }
  function bCmd(b) { return "B" + [b.p1, b.p2, b.p3, BC_TYPES[b.p4] || "", b.p5, b.p6, b.p7, b.p8 ? "B" : "N"].join(",") + ","; }
  function header(st, tt) {
    var l = st.label, out = tt ? [""] : [];
    out.push("N", "Y38,N,8,1", "Q" + l.Qp1 + "," + l.Qp2 + ",", "q" + l.qp1, "R" + l.Rp1 + "," + l.Rp2, "S" + l.Sp1, "OD",
      (tt ? "D" : "S") + l.Dp1);
    return out;
  }

  /* ---------- PrepareDataPrint: TT405 ---------- */
  function buildTT405(r, o, st) {
    var tr = o.lang === "tr", d = st.design, tol = o.tol;
    var g = {
      prog: left(String(r.prog), 4), cart: right(String(r.cart), 1), pos: String(r.pos),
      x: left(r2s(r.len - tol), 7), y: left(r2s(r.other - tol), 7), lenS: r2s(r.len), otherS: r2s(r.other),
      loc: right(String(Math.round(r.loc)), 3), profile: left(r.profile, 12), customer: left(r.customer, 10),
      dealer: left(r.dealer, d === 3 ? 20 : 16), width: ""
    };
    if (d === 2) { g.width = left(r2s(r.height), 3); g.loc = right(g.loc, 2); }
    var t = {};
    t[0] = "LOGO";
    t[1] = (d === 2 ? (tr ? "SIPARIS NO:" : "ORDER NO:") : "PROG NO:") + g.prog;
    t[2] = (tr ? "ARABA NO:" : "CAR NO:") + g.cart;
    t[3] = (tr ? ISLEM_TR : ISLEM_EN)[r.islem] || "";
    t[4] = (tr ? LOC_TR : LOC_EN)[r.frame] || "";
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

    var parts;
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
    var bc = parts.map(function (p) { return p[0]; }).join("");
    var lines = header(st, true), texts = [];
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14].forEach(function (k) {
      if (!st.text[k].enable) return;
      texts.push({ idx: k, f: st.text[k], s: t[k] });
      lines.push(aCmd(st.text[k], t[k]));
    });
    lines.push(bCmd(st.bc) + '"' + bc + '"');
    var barcodes = [{ b: st.bc, data: bc, idx: "bc" }];
    if (st.second) {
      var id = padL(g.prog, 4, "0"), b2 = { p1: st.bcid.p1, p2: st.bcid.p2, p3: st.bc.p3, p4: st.bc.p4, p5: st.bc.p5,
        p6: st.bc.p6, p7: st.bcid.p7, p8: st.bc.p8 };
      lines.push(bCmd(b2) + '"' + id + '"');
      barcodes.push({ b: b2, data: id, idx: "bc2" });
    }
    lines.push("Z" + (st.label.Zp1 ? "B" : "T"), "P1");
    return { lines: lines, texts: texts, barcodes: barcodes, parts: parts };
  }

  /* ---------- PrepareDataPrint: MS300 ---------- */
  function buildMS300(r, o, st) {
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
    var lines = header(st, false), texts = [];
    for (var k = 0; k <= 11; k++) {
      if (!st.text[k].enable) continue;
      texts.push({ idx: k, f: st.text[k], s: t[k] });
      lines.push(aCmd(st.text[k], t[k]));
    }
    lines.push(bCmd(st.bc) + '"' + bc + '"', "P1");
    return { lines: lines, texts: texts, barcodes: [{ b: st.bc, data: bc, idx: "bc" }], parts: parts };
  }

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
  function box(x, y, w, h, rot) {                    // bounding box after rotation about (x, y)
    var c = [[0, 0], [w, 0], [0, h], [w, h]], a = rot * Math.PI / 180, xs = [], ys = [];
    c.forEach(function (p) { xs.push(x + p[0] * Math.cos(a) - p[1] * Math.sin(a)); ys.push(y + p[0] * Math.sin(a) + p[1] * Math.cos(a)); });
    return { x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs), y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys) };
  }
  function draw(svg, res, st, onPick) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var lab = st.label, ox = lab.Rp1, oy = lab.Rp2, W = Math.max(lab.qp1, 10), H = Math.max(lab.Qp1, 10);
    var minX = 0, minY = 0, maxX = W, maxY = H;
    var g = el("g", {}, null), sel = null;
    function grow(b) { minX = Math.min(minX, b.x0); minY = Math.min(minY, b.y0); maxX = Math.max(maxX, b.x1); maxY = Math.max(maxY, b.y1); }
    res.texts.forEach(function (t) {
      var f = t.f, fs = FONTS[f.p4] || FONTS[2], pitch = fs[0] * Math.max(1, f.p5), h = fs[1] * Math.max(1, f.p6);
      var w = pitch * Math.max(1, t.s.length), x = f.p1 + ox, y = f.p2 + oy, rot = (f.p3 % 4) * 90;
      var grp = el("g", { transform: "translate(" + x + " " + y + ") rotate(" + rot + ")", "class": "lt-item", "data-idx": t.idx }, g);
      el("rect", { x: 0, y: 0, width: w, height: h, "class": f.p7 ? "lt-rev" : "lt-hit" }, grp);
      var txt = el("text", { x: 0, y: h * 0.82, "font-size": h * 0.95, textLength: w, lengthAdjust: "spacingAndGlyphs",
        "class": f.p7 ? "lt-txt lt-txt--rev" : "lt-txt" }, grp);
      txt.textContent = t.s;
      el("title", {}, grp).textContent = LINE_NAMES[t.idx] + ": " + t.s;
      if (state.tab === 0 && t.idx === state.line) sel = { x: x, y: y, w: w, h: h, rot: rot };
      grp.addEventListener("click", function () { onPick(0, t.idx); });
      grow(box(x, y, w, h, rot));
    });
    res.barcodes.forEach(function (b) {
      var p = b.b, x = p.p1 + ox, y = p.p2 + oy, mod = Math.max(1, p.p5), h = Math.max(1, p.p7), rot = (p.p3 % 4) * 90;
      var grp = el("g", { transform: "translate(" + x + " " + y + ") rotate(" + rot + ")", "class": "lt-item" }, g);
      var pattern = code128B(b.data), cx = 0, bar = true;
      for (var i = 0; i < pattern.length; i++) {
        var wdt = parseInt(pattern[i], 10) * mod;
        if (bar) el("rect", { x: cx, y: 0, width: wdt, height: h, "class": "lt-bar" }, grp);
        cx += wdt; bar = !bar;
      }
      var hh = h;
      if (p.p8) {
        el("text", { x: 0, y: h + 14, "font-size": 14, textLength: cx, lengthAdjust: "spacingAndGlyphs", "class": "lt-txt" }, grp).textContent = b.data;
        hh += 18;
      }
      el("rect", { x: 0, y: 0, width: cx, height: hh, "class": "lt-hit" }, grp);
      el("title", {}, grp).textContent = T("Barkod: ", "Barcode: ") + b.data;
      if (state.tab === 1 && b.idx === "bc") sel = { x: x, y: y, w: cx, h: hh, rot: rot };
      grp.addEventListener("click", function () { onPick(1); });
      grow(box(x, y, cx, hh, rot));
    });
    var pad = 6, vx = Math.floor(minX) - pad, vy = Math.floor(minY) - pad, vw = Math.ceil(maxX - minX) + 2 * pad, vh = Math.ceil(maxY - minY) + 2 * pad;
    svg.setAttribute("viewBox", vx + " " + vy + " " + vw + " " + vh);
    el("rect", { x: vx, y: vy, width: vw, height: vh, "class": "lt-overflow" }, svg);
    el("rect", { x: 0, y: 0, width: W, height: H, "class": "lt-label" }, svg);
    svg.appendChild(g);
    if (sel) el("rect", { x: -3, y: -3, width: sel.w + 6, height: sel.h + 6, "class": "lt-sel",
      transform: "translate(" + sel.x + " " + sel.y + ") rotate(" + sel.rot + ")" }, svg);
    return maxX > W || maxY > H || minX < 0 || minY < 0;
  }

  /* ---------- UI helpers ---------- */
  function mk(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function field(label, control, note) {
    var w = mk("label", "lt-field"); w.appendChild(mk("span", null, label)); w.appendChild(control);
    if (note) w.appendChild(mk("small", "lt-note", note));
    return w;
  }
  function select(opts, value) {
    var s = document.createElement("select");
    opts.forEach(function (o) { var e = document.createElement("option"); e.value = o[0]; e.textContent = o[1]; s.appendChild(e); });
    s.value = String(value); return s;
  }
  function numInput(value, min, max) {
    var i = document.createElement("input"); i.type = "number"; i.inputMode = "numeric"; i.step = "1";
    i.min = min; i.max = max; i.value = value; return i;
  }
  function clampInt(v, min, max) { var n = Math.round(num(v)); return Math.min(max, Math.max(min, n)); }
  var NOYES = [["0", T("Hayır", "No")], ["1", T("Evet", "Yes")]];
  var ROT = [["0", "Normal"], ["1", "90"], ["2", "180"], ["3", "270"]];
  var FONT_OPTS = [["1", "4pts"], ["2", "6pts"], ["3", "8pts"], ["4", "10pts"], ["5", "21pts"]];
  var SPEED = [["1", "37 mm/s"], ["2", "50 mm/s"], ["3", "63 mm/s"], ["4", "83 mm/s"]];

  /* ---------- Layout ---------- */
  var data = mk("div", "lt-form");
  var hmi = mk("div", "lt-hmi");
  var tabs = mk("div", "lt-tabs");
  tabs.setAttribute("role", "tablist");
  var panel = mk("div", "lt-panel");
  hmi.appendChild(mk("div", "lt-hmi__title", T("Yazıcı Ayarı sayfası", "Printer Settings page")));
  hmi.appendChild(tabs); hmi.appendChild(panel);

  var svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "lt-svg"); svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", T("Etiket önizlemesi", "Label preview"));
  var prevBox = mk("figure", "lt-preview"); prevBox.appendChild(svg);
  var cap = mk("figcaption"); prevBox.appendChild(cap);
  var bcTable = mk("table", "lt-table");
  var bcWrap = mk("div", "lt-scroll"); bcWrap.appendChild(bcTable);
  var pre = mk("pre", "lt-epl");
  var copy = mk("button", "lt-btn", T("Komutları kopyala", "Copy commands")); copy.type = "button";

  root.appendChild(mk("h3", null, T("Kesim verisi", "Cut data")));
  root.appendChild(data);
  root.appendChild(mk("h3", null, T("Ayarlar", "Settings")));
  root.appendChild(hmi);
  root.appendChild(mk("h3", null, T("Önizleme", "Preview")));
  root.appendChild(prevBox);
  root.appendChild(mk("h3", null, T("Barkod içeriği", "Barcode content")));
  root.appendChild(bcWrap);
  root.appendChild(mk("h3", null, T("Yazıcıya giden komutlar", "Commands sent to the printer")));
  root.appendChild(copy);
  root.appendChild(pre);

  function st() { return state[state.machine]; }

  function buildData() {
    data.innerHTML = "";
    var tt = state.machine === "tt405";
    var machine = select([["ms300", "MS300"], ["tt405", "TT405"]], state.machine);
    machine.addEventListener("change", function () { state.machine = machine.value; if (state.line > 11 && state.machine === "ms300") state.line = 0; refresh(true); });
    data.appendChild(field(T("Makine", "Machine"), machine));
    if (tt) {
      var lang = select([["tr", T("Türkçe", "Turkish")], ["en", T("İngilizce", "English")]], state.lang);
      lang.addEventListener("change", function () { state.lang = lang.value; refresh(); });
      data.appendChild(field(T("Makine dili", "Machine language"), lang));
    } else {
      var angle = select([["1", T("Var (yeni sürüm)", "On (new version)")], ["0", T("Yok (eski sürüm)", "Off (old version)")]], state.angle);
      angle.addEventListener("change", function () { state.angle = parseInt(angle.value, 10); refresh(); });
      data.appendChild(field(T("Açı eki", "Angle suffix"), angle));
    }
    var tol = numInput(state.tol, -99, 99); tol.step = "0.1";
    tol.addEventListener("input", function () { state.tol = num(tol.value); refresh(); });
    data.appendChild(field(T("Kaynak payı (mm)", "Weld allowance (mm)"), tol));
    var sample = select([["", "—"]].concat(SAMPLES.map(function (s, i) { return [String(i), T("Örnek ", "Sample ") + s.split(";")[0]]; })),
      SAMPLES.indexOf(state.row) >= 0 ? SAMPLES.indexOf(state.row) : "");
    data.appendChild(field(T("Örnek satır", "Sample row"), sample));
    var row = document.createElement("input"); row.type = "text"; row.className = "lt-row"; row.spellcheck = false; row.value = state.row;
    row.addEventListener("input", function () { state.row = row.value; sample.value = SAMPLES.indexOf(row.value) >= 0 ? String(SAMPLES.indexOf(row.value)) : ""; refresh(); });
    sample.addEventListener("change", function () { if (sample.value === "") return; row.value = state.row = SAMPLES[parseInt(sample.value, 10)]; refresh(); });
    var wide = field(T("Kesim listesi satırı (16 alan, ; ile)", "Cut list row (16 fields, ; separated)"), row);
    wide.classList.add("lt-field--wide");
    data.appendChild(wide);
  }

  function bindNum(obj, key, min, max, label, note) {
    var i = numInput(obj[key], min, max);
    i.addEventListener("input", function () { if (i.value === "" || i.value === "-") return; obj[key] = clampInt(i.value, min, max); refresh(); });
    i.addEventListener("change", function () { obj[key] = clampInt(i.value, min, max); i.value = obj[key]; refresh(); });
    return field(label, i, note);
  }
  function bindSel(obj, key, opts, label, note, after) {
    var s = select(opts, obj[key]);
    s.addEventListener("change", function () { obj[key] = parseInt(s.value, 10); if (after) after(); refresh(after ? true : false); });
    return field(label, s, note);
  }

  function buildTabs() {
    tabs.innerHTML = "";
    [T("Yazı", "Text"), T("Barkod", "Barcode"), T("Etiket", "Label"), T("Yazıcı Ayarı", "Printer")].forEach(function (name, i) {
      var b = mk("button", "lt-tab" + (state.tab === i ? " is-active" : ""), name); b.type = "button";
      b.setAttribute("role", "tab"); b.setAttribute("aria-selected", state.tab === i ? "true" : "false");
      b.addEventListener("click", function () { state.tab = i; refresh(true); });
      tabs.appendChild(b);
    });
  }

  function buildPanel() {
    panel.innerHTML = "";
    var s = st(), tt = state.machine === "tt405", grid = mk("div", "lt-grid");
    if (state.tab === 0) {
      var max = tt ? 14 : 13, opts = [];
      for (var i = 0; i <= max; i++) opts.push([String(i), LINE_NAMES[i] + (i === 12 || i === 13 ? T(" (manuel baskı)", " (manual print)") : "")]);
      var lineSel = select(opts, state.line);
      lineSel.addEventListener("change", function () { state.line = parseInt(lineSel.value, 10); refresh(true); });
      grid.appendChild(field(T("Yazı", "Text"), lineSel));
      var f = s.text[state.line];
      grid.appendChild(bindSel(f, "enable", NOYES, T("Aktif", "Enable")));
      grid.appendChild(mk("span", "lt-gap"));
      grid.appendChild(bindNum(f, "p1", -32768, 32767, T("Yatay Başl.", "Horiz. start")));
      grid.appendChild(bindNum(f, "p2", -32768, 32767, T("Dikey Başl.", "Vert. start")));
      grid.appendChild(bindSel(f, "p4", FONT_OPTS, "Font"));
      grid.appendChild(bindNum(f, "p5", 1, 255, T("Yatay Çarpan", "Horiz. multiplier")));
      grid.appendChild(bindNum(f, "p6", 1, 255, T("Dikey Çarpan", "Vert. multiplier")));
      grid.appendChild(bindSel(f, "p7", NOYES, T("Ters", "Reverse")));
      grid.appendChild(bindSel(f, "p3", ROT, T("Yön", "Rotation")));
      if (state.line === 12 || state.line === 13) panel.appendChild(mk("p", "lt-hint", T("Bu satır yalnız manuel barkod sayfasından basılan etikette kullanılır; iş dosyası etiketinde yoktur.",
        "This line is only used on labels printed from the manual barcode page, not on job file labels.")));
      if (!tt && state.line > 11) { /* nothing more */ }
    } else if (state.tab === 1) {
      var swapped = !tt ? T("Panelde \"Çizgi Genişliği\" yazar", "Labelled \"Narrow bar width\" on the panel") : null;
      var swapped2 = !tt ? T("Panelde \"Dikey Başl.\" yazar", "Labelled \"Vert. start\" on the panel") : null;
      grid.appendChild(bindNum(s.bc, "p1", -32768, 32767, T("Yatay Başl.", "Horiz. start")));
      grid.appendChild(bindNum(s.bc, "p2", -32768, 32767, T("Dikey Başl.", "Vert. start"), swapped));
      grid.appendChild(bindSel(s.bc, "p8", NOYES, T("Okunabilir Kod", "Human code")));
      grid.appendChild(bindNum(s.bc, "p6", 0, 255, T("Barkod Genişliği", "Wide bar width")));
      grid.appendChild(bindNum(s.bc, "p5", 1, 255, T("Çizgi Genişliği", "Narrow bar width"), swapped2));
      grid.appendChild(bindSel(s.bc, "p3", ROT, T("Yön", "Rotation")));
      grid.appendChild(bindNum(s.bc, "p7", 1, 999, T("Yükseklik", "Height")));
      var types = BC_NAMES.map(function (n, i) { return [String(i), n]; });
      var tf = bindSel(s.bc, "p4", types, T("Tip", "Type")); tf.classList.add("lt-field--span2");
      grid.appendChild(tf);
      if (tt) {
        grid.appendChild(bindSel(s, "design", [["0", T("0 - Standart barkod", "0 - Standard barcode")], ["1", T("1 - Barkod 1", "1 - Barcode 1")],
          ["2", T("2 - Barkod 2", "2 - Barcode 2")], ["3", T("3 - Barkod 3", "3 - Barcode 3")], ["4", T("4 - Barkod 4", "4 - Barcode 4")]],
          T("Barkod tasarım no", "Barcode design no"), T("Konumlar için ön ayarları yeniden yükleyin", "Reload the preset for its positions")));
        grid.appendChild(bindSel(s, "second", [["0", T("Pasif", "Passive")], ["1", T("Aktif", "Active")]], T("2. barkod", "2nd barcode")));
      }
      if (s.bc.p4 !== 6) panel.appendChild(mk("p", "lt-hint", T("Önizleme barkodu her tipte Code 128 B olarak çizer; komut seçilen tiple gider.",
        "The preview always draws Code 128 B; the command uses the selected type.")));
    } else if (state.tab === 2) {
      grid.appendChild(bindNum(s.label, "Qp1", 1, 65535, T("Etiket Boyu", "Label length")));
      grid.appendChild(bindNum(s.label, "qp1", 1, 65535, T("Etiket Genişliği", "Label width")));
      grid.appendChild(bindNum(s.label, "Qp2", 0, 65535, T("Boşluk Boyu", "Gap length")));
      grid.appendChild(bindNum(s.label, "Rp1", -32768, 32767, T("Yatay Başl.", "Horiz. margin")));
      grid.appendChild(bindNum(s.label, "Rp2", -32768, 32767, T("Dikey Başl.", "Vert. margin")));
      grid.appendChild(bindNum(s.label, "Dp1", 0, 255, T("Koyuluk", "Density")));
      grid.appendChild(bindSel(s.label, "Sp1", SPEED, T("Hız", "Speed")));
      grid.appendChild(bindSel(s.label, "Zp1", [["0", "T"], ["1", "B"]], T("Yön", "Direction"), tt ? null : T("MS300 bu değeri göndermez", "MS300 does not send this value")));
      if (tt) grid.appendChild(bindSel(s, "size25", [["0", "103x20"], ["1", "103x25"]], T("Etiket Boyutu", "Label size"),
        T("Ön ayar yüklemesinde kullanılır", "Used when loading the preset")));
    } else {
      var load = mk("button", "lt-btn lt-btn--big", tt ? T("Ön Ayarlı Parametreleri Yükle", "Load SW Format") : T("Default Barkod Ayarlarını Yükle", "Load SW Format"));
      load.type = "button";
      load.addEventListener("click", function () {
        if (tt) loadTT405(s); else loadMS300(s);
        state.line = 0; refresh(true);
        load.textContent = T("Yüklendi", "Loaded");
      });
      panel.appendChild(load);
      panel.appendChild(mk("p", "lt-hint", tt
        ? T("PLC'nin ön ayarlarını, seçili etiket boyutu ve barkod tasarım numarasına göre yükler. Panelde olduğu gibi Poz No satırının yönü değişmez.",
          "Loads the PLC preset for the selected label size and barcode design number. As on the panel, the rotation of the Poz No line is not changed.")
        : T("PLC'nin ön ayarlarını yükler. Panelde olduğu gibi Poz No satırının yönü değişmez.",
          "Loads the PLC preset. As on the panel, the rotation of the Poz No line is not changed.")));
      var reset = mk("button", "lt-btn", T("Sayfayı ilk haline getir", "Reset this page")); reset.type = "button";
      reset.addEventListener("click", function () { state = freshState(); refresh(true); });
      panel.appendChild(reset);
      panel.appendChild(mk("p", "lt-hint", T("Değişiklikler bu tarayıcıda saklanır.", "Changes are kept in this browser.")));
      return;
    }
    panel.appendChild(grid);
  }

  function pick(tab, line) {
    state.tab = tab;
    if (tab === 0) state.line = line;
    refresh(true);
    hmi.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  var last = "";
  function render() {
    var s = st(), tt = state.machine === "tt405";
    var r = parseRow(state.row), o = { lang: state.lang, tol: state.tol, angle: state.angle };
    var res = tt ? buildTT405(r, o, s) : buildMS300(r, o, s);
    var over = draw(svg, res, s, pick);
    cap.textContent = T("Yaklaşık önizleme (203 dpi, 1 nokta = 0,125 mm). Bir yazıya veya barkoda tıklayınca ayarı açılır.",
      "Approximate preview (203 dpi, 1 dot = 0.125 mm). Click a text or the barcode to open its settings.") +
      (over ? T(" Kırmızı alan etiketin dışında kalan kısımdır.", " The red area is outside the label.") : "");
    bcTable.innerHTML = "";
    var head = bcTable.createTHead().insertRow();
    [T("Sıra", "Order"), T("Değer", "Value"), T("Kaynak", "Source")].forEach(function (x) { var th = document.createElement("th"); th.textContent = x; head.appendChild(th); });
    var body = bcTable.createTBody();
    res.parts.forEach(function (p, i) {
      var tr = body.insertRow();
      tr.insertCell().textContent = i + 1;
      tr.insertCell().appendChild(mk("code", null, p[0].replace(/ /g, "␣")));
      tr.insertCell().textContent = p[1];
    });
    var all = body.insertRow(); all.className = "lt-total";
    all.insertCell().textContent = "=";
    var c2 = all.insertCell(); c2.colSpan = 2;
    c2.appendChild(mk("code", null, res.parts.map(function (p) { return p[0]; }).join("").replace(/ /g, "␣")));
    last = (res.lines[0] === "" ? "\n" + res.lines.slice(1).join("\r\n") : res.lines.join("\r\n")) + "\r\n";
    pre.textContent = res.lines.map(function (l) { return l === "" ? "␊ " + T("(boş satır: yalnız LF)", "(empty line: LF only)") : l; }).join("\n");
  }

  function refresh(rebuild) {
    if (rebuild) { buildData(); buildTabs(); buildPanel(); }
    render(); save();
  }
  copy.addEventListener("click", function () {
    var done = function () { copy.textContent = T("Kopyalandı", "Copied"); setTimeout(function () { copy.textContent = T("Komutları kopyala", "Copy commands"); }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(last).then(done, function () {});
  });
  refresh(true);

  /* test hook */
  root.__lt = { state: function () { return state; }, loadTT405: loadTT405, loadMS300: loadMS300, buildTT405: buildTT405,
    buildMS300: buildMS300, parseRow: parseRow, refresh: refresh };
})();
