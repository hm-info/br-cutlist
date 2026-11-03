---
title: TT405 / MS300 — Cut List Guide
lang: en
pdf: tt405-ms300-cut-list-en.pdf
---

# TT405 / MS300 — Cut List Guide

<div class="document-tools" markdown="1">
[Türkçe](cut_list_tr.md) · **[Download PDF](downloads/tt405-ms300-cut-list-en.pdf)**
</div>

This guide describes the cut list (job file) of **TT405 and MS300 machines with B&R PLC**. Both machines use the same file format. Each line defines one part to be cut.

## File format

- Each line has **16 fields**, separated by `;`.
- The file has **no header line**; the first line is the first part.
- A file can contain at most **2000 lines** (cuts).
- If a field is empty, keep its position (`;;`); do not shift the following fields to the left.

```text
1;806;XXXXXXX12PEN;45;45;1;60;X10MUSTERI;1;1;1;1;906;11;0;XXXXXXXXXX16BAYI
```

## Fields

Fields marked **Required** are used by the machine for cutting and must not be empty. The other fields are printed on the label.

| No | Field | Required | Max. | Type | Description |
|---:|---|:---:|---|---|---|
| 1 | Cut Number | ✔ | 4 digits | Integer | Cut number, increasing from line to line. |
| 2 | Cut Length | ✔ | 5 digits | Decimal | Part length in mm. Can be written as `1200` or `1200.0`; the decimal separator is a point. |
| 3 | Profile Code | | 12 characters | Text | Profile code. |
| 4 | Left Angle | ✔ | 2 digits | Integer | Left cutting angle, for example `45` or `90`. |
| 5 | Right Angle | ✔ | 2 digits | Integer | Right cutting angle, for example `45` or `90`. |
| 6 | Quantity | ✔ | 1 digit | Integer | `1` or `2`. |
| 7 | Height | | 3 digits | Integer | Height information printed on the label. |
| 8 | Order No | | 10 characters | Text | Order number. |
| 9 | Position No | | 3 digits | Integer | Window / position number. |
| 10 | Assembly | | 1 digit | Integer | Side of the part in the frame; see [Assembly codes](#assembly-codes). |
| 11 | Trolley No | | 1 digit | Integer | Trolley the part is placed on. |
| 12 | Slot No | | 3 digits | Integer | Slot number in the trolley. |
| 13 | Other Axis | | 5 digits | Decimal | Length of the other frame axis in mm. Can be written as `1200` or `1200.0`. |
| 14 | Color/Gasket | | 2 digits | Integer | See [Color / gasket codes](#color-gasket-codes). |
| 15 | Operation | | 2 digits | Integer | See [Operation codes](#operation-codes). |
| 16 | Dealer Name | | 16 characters | Text | Dealer / customer name. |

Angles are written as a single number. The `90|45` (tilt | pivot) format of TT425 / TT426 files is not used on these machines.

## Assembly codes { #assembly-codes }

| Code | Side |
|---:|---|
| 1 | Top (Y) |
| 2 | Right (X) |
| 3 | Bottom (Y) |
| 4 | Left (X) |

## Color / gasket codes { #color-gasket-codes }

| Code | Gasket | Profile color |
|---:|---|---|
| 01 | No gasket | White |
| 02 | No gasket | Bottom colored |
| 03 | No gasket | Top colored |
| 04 | No gasket | Full colored |
| 11 | With gasket | White |
| 12 | With gasket | Bottom colored |
| 13 | With gasket | Top colored |
| 14 | With gasket | Full colored |

`01` and `1` are the same code.

## Operation codes { #operation-codes }

| Code | Operation |
|---:|---|
| 0 | No operation |
| 1 | Water slot |
| 2 | Handle |
| 3 | Hinge |
| 4 | Double opening |
| 5 | Single opening, left |
| 6 | Single opening, right |
| 7 | Double opening, left |
| 8 | Double opening, right |
| 9 | V. opening, left |
| 10 | Right opening door |
| 11 | Left opening door |
| 12 | Transom window |

## Example

| No | Length | Profile | Left | Right | Qty | Height | Order | Pos. | Assembly | Trolley | Slot | Other axis | Color/Gasket | Operation | Dealer |
|---:|---:|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 806 | XXXXXXX12PEN | 45 | 45 | 1 | 60 | X10MUSTERI | 1 | 1 | 1 | 1 | 906 | 11 | 0 | XXXXXXXXXX16BAYI |
| 2 | 906 | XXXXXXX12PEN | 45 | 45 | 1 | 60 | X10MUSTERI | 1 | 2 | 1 | 2 | 806 | 11 | 1 | XXXXXXXXXX16BAYI |
| 9 | 1506 | XXXXXXX12PEN | 90 | 90 | 1 | 60 | X10MUSTERI | 200 | 1 | 2 | 10 | 1806 | 1 | 8 | XXXXXXXXXX16BAYI |

First line: an 806 mm white profile with gasket, cut at 45° on both ends; the top part (assembly 1) of position 1, the other frame side is 906 mm, no operation, placed in slot 1 of trolley 1.

[Download the example cut list](downloads/TT405_MS300_Cut_List_Example.csv)

Profile, order and dealer values in the example are fictitious.

## Before importing

1. Check that every line has 16 fields and the separator is `;`.
2. Check that the required fields (cut number, length, left / right angle, quantity) are filled.
3. Check that length and other axis values use a point as the decimal separator.
4. Check that assembly, color / gasket and operation codes are in the tables above.
5. Check that the file does not exceed 2000 lines.
6. Check the file in the [CSV File Checker](https://hm-info.github.io/csv_file_checker_haffner/) with the **TT405-B&R** option.

[Home page](home-en.md)
