---
title: TT405 / MS300 — Label and Barcode Guide
lang: en
pdf: tt405-ms300-label-en.pdf
---

# TT405 / MS300 — Label and Barcode Guide

<div class="document-tools" markdown="1">
[Türkçe](label_tr.md) · **[Download PDF](downloads/tt405-ms300-label-en.pdf)**
</div>

TT405 and MS300 send the label of each cut piece directly to the label printer in the **EPL2** command language (serial port or USB). Both machines use the same command structure; the text lines and the barcode content differ per machine. This page shows the commands sent to the printer for a cut list row and which fields make up the barcode.

<!-- web-only -->
## Label simulator

Select the machine and settings, then paste a row from the cut list. The page generates the commands the machine would send and an approximate label preview. Positions are the machine's **preset (default) layout**; positions changed on the machine's Printer Settings page may differ.

<div id="label-tool" class="label-tool" data-lang="en"></div>
<!-- /web-only -->

## Command sequence

For every label the commands are sent in the following order. Each line ends with CR LF. Example values are the default settings.

| Command | Example | Meaning | Machine setting (Printer Settings) |
|---|---|---|---|
| (LF) | | TT405 only: a single line feed | — |
| `N` | `N` | Clears the printer image buffer | — |
| `Y` | `Y38,N,8,1` | Serial port: 38400 baud, no parity, 8 bits, 1 stop | Fixed |
| `Q` | `Q160,24,` | Label length and gap between labels (dots) | Label → Label Length, Gap Length |
| `q` | `q840` | Label width (dots) | Label → Label Width |
| `R` | `R5,1` | Reference point offset (horizontal, vertical) | Label → Horiz. / Vert. margin |
| `S` | `S3` | Print speed | Label → Speed |
| `OD` | `OD` | Direct thermal printing | Fixed |
| `D` | `D15` | Density. **On MS300 this value is sent as a second `S` line instead of `D`** (`S10`). | Label → Density |
| `A` | `A30,50,0,2,1,1,N,"PROG NO:1"` | Text line (one per enabled line) | Text tab |
| `B` | `B30,110,0,1B,2,2,40,N,"…"` | Barcode | Barcode tab |
| `B` | `B30,0,0,1B,2,2,40,N,"0001"` | TT405 only, **if the 2nd barcode is active**: cut number | 2. Barcode Active |
| `Z` | `ZB` | TT405 only: print direction (`T` / `B`) | Label → Direction |
| `P` | `P1` | Print one label | — |

1 dot = 0.125 mm (203 dpi). `q840` is about 105 mm, `Q160` about 20 mm.

### Text line (`A`) parameters

`A` horizontal, vertical, rotation, font, horizontal multiplier, vertical multiplier, normal/reverse, `"text"`

| Order | Parameter | Values |
|---:|---|---|
| 1 | Horizontal start | dots |
| 2 | Vertical start | dots |
| 3 | Rotation | 0 normal · 1 = 90° · 2 = 180° · 3 = 270° |
| 4 | Font | 1 (smallest) … 5 (largest) |
| 5–6 | Horizontal / vertical multiplier | 1, 2, … |
| 7 | Appearance | `N` normal · `R` reverse (white on black) |

### Barcode (`B`) parameters

`B` horizontal, vertical, rotation, type, narrow bar width, wide bar width, height, human readable, `"data"`

The default type is `1B` (Code 128 B). With human readable `B` the barcode data is also printed below the barcode; with `N` it is not.

## Text lines

Label text contains no Turkish characters. Line numbers match the order on the machine's Printer Settings → Text tab.

| No | Name on settings page | TT405 (Turkish) | TT405 (English) | MS300 | Source field |
|---:|---|---|---|---|---|
| 0 | Logo | company name | company name | company name | Fixed |
| 1 | Prog No | `PROG NO:` | `PROG NO:` | `PROG NO:` | 1 Cut Number |
| 2 | Car No | `ARABA NO:` | `CAR NO:` | `ARABA NO:` | 11 Cart No (TT405: last digit) |
| 3 | Operation | operation name | operation name | operation name | 15 Operation |
| 4 | Loc. on frame | `UST(Y)` … | `UP(Y)` … | `UST(Y)` … | 10 Assembly |
| 5 | Location | `YER NO:` | `LOC NO:` | `YER:` | 12 Location No (TT405: last 3 digits) |
| 6 | Poz No | `POZ NO:` | `POZ NO:` | `POZ NO:` | 9 Position No |
| 7 | Length | `UZUNLUK:` …`mm` | `VALUE:` …`mm` | `LENGTH:` …`mm` | 2 Cut Length |
| 8 | Frame | `CERCEVE:(X x Y)` | `FRAME:(X x Y)` | `CERCEVE:(X x Y)` | 2 and 13, weld allowance subtracted |
| 9 | Profile | `PROFIL:` | `PROFIL:` | `PROFIL:` | 3 Profile Code (max. 12) |
| 10 | Dealer | `BAYI:` | `VENDOR:` | `BAYI:` | 16 Dealer Name (TT405: 16, MS300: 12 characters) |
| 11 | Customer | `MUSTERI:` | `CLIENT:` | `MUSTER:` | 8 Order No (10 characters) |
| 14 | Height | `YUKSEKLIK:` | `HEIGHT:` | — | Printed only with TT405 barcode design 2 |

X and Y on the frame line are the length and other axis values minus the **weld allowance** (Settings page).

**MS300 angle suffix (new version):** in the new MS300 software the left / right angles are appended to the location line: `UST(Y) ACI:45/90`. If both angles are 0 nothing is appended.

### Lines that change with TT405 barcode design 2

| No | Turkish | English | Value |
|---:|---|---|---|
| 1 | `SIPARIS NO:` | `ORDER NO:` | Cut Number |
| 5 | `KALIP FARKI:` …`mm` | `MOLD DIFFERENCE:` …`mm` | Location No, last 2 digits |
| 6 | `MODUL NO:` | `MODULE NO:` | Position No |
| 8 | `DIGER UZUNLUK:` …`mm` | `OTHER VALUE:` …`mm` | Other Axis |
| 14 | `PROFIL KALINLIGI:` …`mm` | `PROFILE WIDTH:` …`mm` | Height (max. 3 digits) |

With barcode design 3, line 5 becomes `BIN NO:` in English.

## Barcode content

The barcode data is the fields joined one after another; there is no separator. Numeric fields are padded with leading `0`. Examples use sample row 1 of the cut list guide (`1;806;XXXXXXX12PEN;45;45;1;60;X10MUSTERI;1;1;1;1;906;11;0;…`) with a weld allowance of 0.

### TT405 — Barcode design no 0 (Standard barcode)

| Order | Digits | Content |
|---:|---:|---|
| 1 | 1 | `K` (fixed) |
| 2 | 1 | Cart No, last digit |
| 3 | 3 | Location No |
| 4 | 12 | Profile Code, padded with spaces on the right to 12 characters |
| 5 | 2 | Colour / Gasket |
| 6 | 6 | Length − weld allowance; 4 whole + 2 decimal digits (0.01 mm) |
| 7 | 6 | Other Axis − weld allowance; 4 whole + 2 decimal digits |

Example: `K1001XXXXXXX12PEN11080600090600` (31 characters)

### TT405 — Barcode design no 1

| Order | Digits | Content |
|---:|---:|---|
| 1 | 1 | `K` (fixed) |
| 2 | 4 | Cut Number |
| 3 | 2 | Position No, last 2 digits |
| 4 | 1 | Cart No, last digit |
| 5 | 2 | Location No, last 2 digits |
| 6 | 2 | `00` — colour field; always `00` in the current software |
| 7 | 5 | Order No, last 5 characters |

Example: `K00010110100STERI`

### TT405 — Barcode design no 2

| Order | Digits | Content |
|---:|---:|---|
| 1 | 4 | Length, whole mm (weld allowance not subtracted) |
| 2 | 4 | Other Axis, whole mm |
| 3 | 2 | Location No, last 2 digits |
| 4 | 3 | Height |

Example: `08060906` + `01` + `060` = `0806090601060`

### TT405 — Barcode design no 3

The barcode contains only the **Dealer Name** (max. 20 characters).

### TT405 — Barcode design no 4

| Order | Digits | Content |
|---:|---:|---|
| 1 | 10 | Profile Code, first 10 characters |
| 2 | 5 | Length; 4 whole + 1 decimal digit (0.1 mm) |
| 3 | 5 | Other Axis; 4 whole + 1 decimal digit |

Example: `XXXXXXX12P0806009060`

### TT405 — 2nd barcode

If **2. Barcode Active** is selected in Printer Settings, a second barcode is printed after the main barcode. It contains the 4-digit cut number (e.g. `0001`). Its position is kept separately; the default is the top left corner.

### MS300

| Order | Digits | Content |
|---:|---:|---|
| 1 | 5 | `K1111` (fixed) |
| 2 | ≤ 12 | Profile Code (not padded) |
| 3 | 2 | Colour / Gasket |
| 4 | 6 | Length − weld allowance; 4 whole + 2 decimal digits |
| 5 | 6 | **Height** − weld allowance; 4 whole + 2 decimal digits |

Example: `K1111XXXXXXX12PEN11080600006000`

The last field of the MS300 barcode is not the other axis as on TT405 but **Height**, field 7 of the cut list.

## Default positions

The **Load SW Format** button on the Printer Settings page loads the positions below. Values are horizontal, vertical start in dots; all use font 2, multiplier 1 × 1, rotation 0 unless stated. Positions changed on site are stored on the machine.

| No | Line | TT405 103x20 | TT405 103x25 | MS300 |
|---:|---|---|---|---|
| 0 | Logo (font 1, 90°, reverse) | 20, 10 | 45, 40 | 10, 5 |
| 1 | Prog No | 30, 50 | 60, 30 | 45, 10 |
| 2 | Car No | 215, 50 | 225, 30 | 205, 10 |
| 3 | Operation | 660, 70 | 60, 50 | 45, 26 |
| 4 | Loc. on frame | 575, 70 | 400, 50 | 205, 26 |
| 5 | Location | 375, 50 | 225, 50 | 345, 26 |
| 6 | Poz No (vertical multiplier 2) | 650, 5 | 650, 5 | 500, 10 |
| 7 | Length | 30, 70 | 60, 70 | 45, 46 |
| 8 | Frame | 285, 70 | 315, 70 | 260, 46 |
| 9 | Profile | 30, 90 | 60, 90 | 45, 66 |
| 10 | Dealer | 285, 90 | 315, 90 | 195, 66 |
| 11 | Customer | 550, 90 | 600, 90 | 345, 66 |
| — | Barcode (height) | 30, 110 (40) | 60, 110 (60) | 30, 90 (40) |
| — | 2nd barcode | 30, 0 (40) | 30, 0 (40) | — |

Label settings (all): length 160, gap 24, width 840, margin 5 / 1, speed 3, direction B. Density is 15 on TT405 and 10 on MS300.

If the preset is loaded while TT405 barcode design 2 is selected, these positions change: Prog No 30, 5 (font 3) · Car No 30, 86 · Location 30, 26 · Poz No 575, 26 · Customer 575, 66 · Height 285, 26 · barcode 250, 84 (human readable on).

## Known behaviour

- **MS300 density:** the density value is sent with a second `S` (speed) command instead of `D`; the printer may interpret it as speed.
- **TT405 barcode design 1:** the colour field is always `00`; the colour code from the cut list is not used in this design.
- **Poz No line:** loading the preset does not change this line's rotation; the previous value is kept.
- **Label length:** in the 103x25 layout the bottom of the barcode exceeds the 160-dot label length; set the label length accordingly.
