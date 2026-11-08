---
title: TT405 / MS300 — Etiket ve Barkod Rehberi
lang: tr
pdf: tt405-ms300-label-tr.pdf
---

# TT405 / MS300 — Etiket ve Barkod Rehberi

<div class="document-tools" markdown="1">
[English](label_en.md) · **[PDF indir](downloads/tt405-ms300-label-tr.pdf)**
</div>

TT405 ve MS300, kesilen parçanın etiketini **EPL2** komut diliyle doğrudan etiket yazıcısına gönderir (seri port veya USB). İki makine aynı komut altyapısını kullanır; yazı satırları ve barkod içeriği makineye göre değişir. Bu sayfa, kesim listesindeki bir satırdan yazıcıya giden komutları ve barkodun hangi alanlardan oluştuğunu gösterir.

<!-- web-only -->
## Etiket simülatörü

Simülatör, makinenin **Yazıcı Ayarı** sayfasının bir kopyasıdır (Yazı, Barkod, Etiket ve Yazıcı Ayarı sekmeleri). İlk açılışta PLC'nin ön ayarları yüklüdür. Kesim listesinden bir satır yapıştırın ve ayarları makinedeki gibi değiştirin; etiket önizlemesi, barkod içeriği ve yazıcıya giden komutlar PLC'deki kurallarla yeniden oluşur. Önizlemede bir yazıya veya barkoda tıklayınca ayarı açılır. Değişiklikler yalnız bu tarayıcıda saklanır; **Yazıcı Ayarı → ön ayarları yükle** düğmesi PLC'deki aynı işi yapar.

<div id="label-tool" class="label-tool" data-lang="tr"></div>
<!-- /web-only -->

## Komut sırası

Her etiket için komutlar aşağıdaki sırayla gönderilir. Her satır CR LF ile biter. Örnek değerler varsayılan ayarlardır.

| Komut | Örnek | Anlamı | Makinedeki ayar (Yazıcı Ayarı) |
|---|---|---|---|
| (LF) | | Yalnız TT405: tek satır başı karakteri | — |
| `N` | `N` | Yazıcı belleğini temizler | — |
| `Y` | `Y38,N,8,1` | Seri port: 38400 baud, eşliksiz, 8 bit, 1 stop | Sabit |
| `Q` | `Q160,24,` | Etiket uzunluğu ve etiketler arası boşluk (nokta) | Etiket → Etiket Uzunluğu, Aralık |
| `q` | `q840` | Etiket genişliği (nokta) | Etiket → Etiket Genişliği |
| `R` | `R5,1` | Başlangıç noktası kaydırması (yatay, dikey) | Etiket → Yatay / Dikey Başl. |
| `S` | `S3` | Baskı hızı | Etiket → Hız |
| `OD` | `OD` | Direkt termal baskı | Sabit |
| `D` | `D15` | Koyuluk. MS300 V26.1.11.8 ve önceki sürümlerde bu değer `D` yerine ikinci bir `S` satırıyla gider (`S10`). | Etiket → Koyuluk |
| `A` | `A30,50,0,2,1,1,N,"PROG NO:1"` | Yazı satırı (her etkin satır için bir tane) | Yazı sekmesi |
| `B` | `B30,110,0,1B,2,2,40,N,"…"` | Barkod | Barkod sekmesi |
| `B` | `B30,0,0,1B,2,2,40,N,"0001"` | Yalnız TT405, **2. barkod aktifse**: kesim numarası | 2. Barkod Aktif |
| `Z` | `ZB` | Yalnız TT405: baskı yönü (`T` / `B`) | Etiket → Yön |
| `P` | `P1` | Bir etiket bas | — |

1 nokta = 0,125 mm (203 dpi). `q840` yaklaşık 105 mm, `Q160` yaklaşık 20 mm eder.

### Yazı satırı (`A`) parametreleri

`A` yatay, dikey, rotasyon, font, yatay çarpan, dikey çarpan, normal/ters, `"metin"`

| Sıra | Parametre | Değerler |
|---:|---|---|
| 1 | Yatay başlangıç | nokta |
| 2 | Dikey başlangıç | nokta |
| 3 | Rotasyon | 0 normal · 1 = 90° · 2 = 180° · 3 = 270° |
| 4 | Font | 1 (en küçük) … 5 (en büyük) |
| 5–6 | Yatay / dikey çarpan | 1, 2, … |
| 7 | Görünüm | `N` normal · `R` ters (siyah zemin üzerine beyaz) |

### Barkod (`B`) parametreleri

`B` yatay, dikey, rotasyon, tip, çizgi genişliği, barkod genişliği, yükseklik, okunabilir kod, `"veri"`

Varsayılan tip `1B` (Code 128 B). Okunabilir kod `B` ise barkod verisi barkodun altına da yazılır, `N` ise yazılmaz.

## Yazı satırları

Etiket metninde Türkçe karakter kullanılmaz. Satır numaraları makinedeki Yazıcı Ayarı → Yazı sekmesindeki sırayla aynıdır.

| No | Ayar sayfasındaki adı | TT405 (Türkçe) | TT405 (İngilizce) | MS300 | Kaynak alan |
|---:|---|---|---|---|---|
| 0 | Logo | firma adı | firma adı | firma adı | Sabit |
| 1 | Prog No | `PROG NO:` | `PROG NO:` | `PROG NO:` | 1 Kesim Numarası |
| 2 | Araba No | `ARABA NO:` | `CAR NO:` | `ARABA NO:` | 11 Araba No (TT405: son hane) |
| 3 | İşlem | işlem adı | işlem adı | işlem adı | 15 İşlem |
| 4 | Çerçevedeki Yer | `UST(Y)` … | `UP(Y)` … | `UST(Y)` … | 10 Montaj |
| 5 | Yer | `YER NO:` | `LOC NO:` | `YER:` | 12 Yer No (TT405: son 3 hane) |
| 6 | Poz No | `POZ NO:` | `POZ NO:` | `POZ NO:` | 9 Poz No |
| 7 | Uzunluk | `UZUNLUK:` …`mm` | `VALUE:` …`mm` | `LENGTH:` …`mm` | 2 Kesilecek Uzunluk |
| 8 | Çerçeve | `CERCEVE:(X x Y)` | `FRAME:(X x Y)` | `CERCEVE:(X x Y)` | 2 ve 13, kaynak payı düşülmüş |
| 9 | Profil | `PROFIL:` | `PROFIL:` | `PROFIL:` | 3 Profil Kodu (en fazla 12) |
| 10 | Bayi | `BAYI:` | `VENDOR:` | `BAYI:` | 16 Bayi Adı (TT405: 16, MS300: 12 karakter) |
| 11 | Müşteri | `MUSTERI:` | `CLIENT:` | `MUSTER:` | 8 Sipariş No (10 karakter) |
| 14 | TT405: Yükseklik · MS300: Açı | `YUKSEKLIK:` | `HEIGHT:` | `ACI:45/90` | TT405: yalnız barkod tasarımı 2'de basılır · MS300 (V26.1 ve sonrası): 4 Sol Açı / 5 Sağ Açı |

Çerçeve satırındaki X ve Y, uzunluk ve diğer eksen değerinden **kaynak payı** (Ayarlar sayfası) çıkarılarak yazılır.

**MS300 açı satırı (PLC yazılımı V26.1 ve sonrası):** Kesim listesindeki sol / sağ açı ayrı bir yazı satırı olarak basılır: `ACI:45/90`. Satır, Yazıcı Ayarı → Yazı listesinde **Açı** (14) olarak seçilir; konumu, fontu, yönü ve aktif / pasif durumu diğer satırlar gibi ayarlanır. Açıların ikisi de 0 ise satır basılmaz. Açılar barkod verisine girmez. V26.1 öncesi yazılımlarda bu satır yoktur; simülatörde PLC yazılımı → V26.1 öncesi seçilirse açı satırı gösterilmez.

### TT405 barkod tasarımı 2'de değişen satırlar

| No | Türkçe | İngilizce | Değer |
|---:|---|---|---|
| 1 | `SIPARIS NO:` | `ORDER NO:` | Kesim Numarası |
| 5 | `KALIP FARKI:` …`mm` | `MOLD DIFFERENCE:` …`mm` | Yer No, son 2 hane |
| 6 | `MODUL NO:` | `MODULE NO:` | Poz No |
| 8 | `DIGER UZUNLUK:` …`mm` | `OTHER VALUE:` …`mm` | Diğer Eksen |
| 14 | `PROFIL KALINLIGI:` …`mm` | `PROFILE WIDTH:` …`mm` | Yükseklik (en fazla 3 hane) |

Barkod tasarımı 3'te 5. satır İngilizcede `BIN NO:` olur.

## Barkod içeriği

Barkod verisi alanların arka arkaya eklenmesiyle oluşur; alanlar arasında ayırıcı yoktur. Sayısal alanlarda eksik haneler soldan `0` ile tamamlanır. Örnekler kesim listesi rehberindeki 1. örnek satırla (`1;806;XXXXXXX12PEN;45;45;1;60;X10MUSTERI;1;1;1;1;906;11;0;…`), kaynak payı 0 için verilmiştir.

### TT405 — Barkod tasarım no 0 (Standart barkod)

| Sıra | Hane | İçerik |
|---:|---:|---|
| 1 | 1 | `K` (sabit) |
| 2 | 1 | Araba No, son hane |
| 3 | 3 | Yer No |
| 4 | 12 | Profil Kodu, sağı boşlukla 12 karaktere tamamlanır |
| 5 | 2 | Renk / Conta |
| 6 | 6 | Uzunluk − kaynak payı; 4 tam + 2 ondalık hane (0,01 mm) |
| 7 | 6 | Diğer Eksen − kaynak payı; 4 tam + 2 ondalık hane |

Örnek: `K1001XXXXXXX12PEN11080600090600` (31 karakter)

### TT405 — Barkod tasarım no 1

| Sıra | Hane | İçerik |
|---:|---:|---|
| 1 | 1 | `K` (sabit) |
| 2 | 4 | Kesim Numarası |
| 3 | 2 | Poz No, son 2 hane |
| 4 | 1 | Araba No, son hane |
| 5 | 2 | Yer No, son 2 hane |
| 6 | 2 | `00` — renk alanı; mevcut yazılımda her zaman `00` |
| 7 | 5 | Sipariş No, son 5 karakter |

Örnek: `K00010110100STERI`

### TT405 — Barkod tasarım no 2

| Sıra | Hane | İçerik |
|---:|---:|---|
| 1 | 4 | Uzunluk, tam mm (kaynak payı düşülmez) |
| 2 | 4 | Diğer Eksen, tam mm |
| 3 | 2 | Yer No, son 2 hane |
| 4 | 3 | Yükseklik |

Örnek: `08060906` + `01` + `060` = `0806090601060`

### TT405 — Barkod tasarım no 3

Barkodda yalnız **Bayi Adı** bulunur (en fazla 20 karakter).

### TT405 — Barkod tasarım no 4

| Sıra | Hane | İçerik |
|---:|---:|---|
| 1 | 10 | Profil Kodu, ilk 10 karakter |
| 2 | 5 | Uzunluk; 4 tam + 1 ondalık hane (0,1 mm) |
| 3 | 5 | Diğer Eksen; 4 tam + 1 ondalık hane |

Örnek: `XXXXXXX12P0806009060`

### TT405 — 2. barkod

Yazıcı Ayarı'nda **2. Barkod Aktif** seçiliyse ana barkoddan sonra ikinci bir barkod basılır. İçeriği 4 haneli kesim numarasıdır (örnek `0001`). Konumu ayrı tutulur; varsayılanı sol üst köşedir.

### MS300

| Sıra | Hane | İçerik |
|---:|---:|---|
| 1 | 5 | `K1111` (sabit) |
| 2 | ≤ 12 | Profil Kodu (boşlukla tamamlanmaz) |
| 3 | 2 | Renk / Conta |
| 4 | 6 | Uzunluk − kaynak payı; 4 tam + 2 ondalık hane |
| 5 | 6 | **Yükseklik** − kaynak payı; 4 tam + 2 ondalık hane |

Örnek: `K1111XXXXXXX12PEN11080600006000`

MS300 barkodunun son alanı TT405'teki gibi diğer eksen değil, kesim listesinin 7. alanı olan **Yükseklik**'tir.

## Varsayılan konumlar

Yazıcı Ayarı sayfasındaki **Ön Ayarlı Parametreleri Yükle** düğmesi aşağıdaki konumları yükler. Değerler nokta cinsinden yatay, dikey başlangıçtır; hepsi font 2, çarpan 1 × 1, rotasyon 0'dır (aksi belirtilmedikçe). Sahada değiştirilen konumlar makinede saklanır.

| No | Satır | TT405 103x20 | TT405 103x25 | MS300 |
|---:|---|---|---|---|
| 0 | Logo (font 1, 90°, ters) | 20, 10 | 45, 40 | 10, 5 |
| 1 | Prog No | 30, 50 | 60, 30 | 45, 10 |
| 2 | Araba No | 215, 50 | 225, 30 | 205, 10 |
| 3 | İşlem | 660, 70 | 60, 50 | 45, 26 |
| 4 | Çerçevedeki Yer | 575, 70 | 400, 50 | 205, 26 |
| 5 | Yer | 375, 50 | 225, 50 | 380, 10 |
| 6 | Poz No (dikey çarpan 2) | 650, 5 | 650, 5 | 650, 10 |
| 7 | Uzunluk | 30, 70 | 60, 70 | 45, 46 |
| 8 | Çerçeve | 285, 70 | 315, 70 | 300, 46 |
| 9 | Profil | 30, 90 | 60, 90 | 45, 66 |
| 10 | Bayi | 285, 90 | 315, 90 | 300, 66 |
| 11 | Müşteri | 550, 90 | 600, 90 | 550, 66 |
| 14 | Açı (yalnız MS300, V26.1 ve sonrası) | — | — | 550, 46 |
| — | Barkod (yükseklik) | 30, 110 (40) | 60, 110 (60) | 30, 90 (40) |
| — | 2. barkod | 30, 0 (40) | 30, 0 (40) | — |

Etiket ayarları (tümü): uzunluk 160, aralık 24, genişlik 840, başlangıç 5 / 1, hız 3, yön B. Koyuluk TT405'te 15, MS300'de 10.

TT405 barkod tasarımı 2 seçiliyken ön ayar yüklenirse şu konumlar değişir: Prog No 30, 5 (font 3) · Araba No 30, 86 · Yer 30, 26 · Poz No 575, 26 · Müşteri 575, 66 · Yükseklik 285, 26 · barkod 250, 84 (okunabilir kod açık).

## Bilinen durumlar

- **MS300 koyuluk (V26.1.11.8 ve öncesi):** koyuluk değeri `D` komutu yerine ikinci bir `S` (hız) komutuyla gönderilir; yazıcı bu değeri hız olarak yorumlayabilir. Sonraki sürümlerde `D` ile gider; simülatör `D` gösterir.
- **TT405 barkod tasarımı 1:** renk alanı her zaman `00` yazılıyor; kesim listesindeki renk kodu bu tasarımda barkoda girmiyor.
- **Poz No satırı:** ön ayar yüklemesi bu satırın rotasyonunu değiştirmiyor; önceki değer kalır.
- **MS300 C70 paneli, Barkod sekmesi:** dikey başlangıç kutusunun üstünde "Çizgi Genişliği", çizgi genişliği kutusunun üstünde "Dikey Başl." yazıyor (yazılar yer değiştirmiş). Simülatör doğru adları kullanır ve panelde yazanı not olarak gösterir.
- **Etiket boyu:** 103x25 düzeninde barkodun altı 160 noktalık etiket boyunu aşar; etiket uzunluğu ayarı buna göre girilmelidir.
