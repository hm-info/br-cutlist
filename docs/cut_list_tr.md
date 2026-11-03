---
title: TT405 / MS300 — Kesim Listesi Rehberi
lang: tr
pdf: tt405-ms300-cut-list-tr.pdf
---

# TT405 / MS300 — Kesim Listesi Rehberi

<div class="document-tools" markdown="1">
[English](cut_list_en.md) · **[PDF indir](downloads/tt405-ms300-cut-list-tr.pdf)**
</div>

Bu rehber, **B&R PLC'li TT405 ve MS300** makinelerinin kesim listesini (iş dosyasını) açıklar. İki makine aynı dosya biçimini kullanır. Her satır bir kesilecek parçayı tanımlar.

## Dosyanın biçimi

- Her satırda **16 alan** bulunur; alanlar `;` ile ayrılır.
- Dosyada **başlık satırı yoktur**; ilk satır ilk parçadır.
- Bir dosyada en fazla **2000 satır** (kesim) bulunabilir.
- Bir alan boşsa yerini koruyun (`;;`); sonraki alanları sola kaydırmayın.

```text
1;806;XXXXXXX12PEN;45;45;1;60;X10MUSTERI;1;1;1;1;906;11;0;XXXXXXXXXX16BAYI
```

## Alanlar

**Gerekli** olarak işaretlenen alanlar makinenin kesim işlemi için kullanılır ve boş bırakılamaz. Diğer alanlar etikette yazılmak üzere kullanılır.

| No | Alan | Gerekli | En fazla | Tip | Açıklama |
|---:|---|:---:|---|---|---|
| 1 | Kesim Numarası | ✔ | 4 hane | Tam sayı | Satırdan satıra artan kesim numarası. |
| 2 | Kesilecek Uzunluk | ✔ | 5 hane | Ondalık | Parça boyu, mm. `1200` veya `1200.0` şeklinde yazılabilir; ondalık ayırıcı noktadır. |
| 3 | Profil Kodu | | 12 karakter | Metin | Profil kodu. |
| 4 | Sol Açı | ✔ | 2 hane | Tam sayı | Sol kesim açısı; örneğin `45` veya `90`. |
| 5 | Sağ Açı | ✔ | 2 hane | Tam sayı | Sağ kesim açısı; örneğin `45` veya `90`. |
| 6 | Adet | ✔ | 1 hane | Tam sayı | `1` veya `2`. |
| 7 | Yükseklik | | 3 hane | Tam sayı | Etikette yazılan yükseklik bilgisi. |
| 8 | Sipariş No | | 10 karakter | Metin | Sipariş numarası. |
| 9 | Poz No | | 3 hane | Tam sayı | Pencere / pozisyon numarası. |
| 10 | Montaj | | 1 hane | Tam sayı | Parçanın çerçevedeki yeri; [Montaj kodları](#montaj-kodlari). |
| 11 | Araba No | | 1 hane | Tam sayı | Parçanın konulacağı araba numarası. |
| 12 | Yer No | | 3 hane | Tam sayı | Araba içindeki yer numarası. |
| 13 | Diğer Eksen | | 5 hane | Ondalık | Çerçevenin diğer eksen uzunluğu, mm. `1200` veya `1200.0` şeklinde yazılabilir. |
| 14 | Renk/Conta | | 2 hane | Tam sayı | [Renk / conta kodları](#renk-conta-kodlari). |
| 15 | İşlem | | 2 hane | Tam sayı | [İşlem kodları](#islem-kodlari). |
| 16 | Bayi Adı | | 16 karakter | Metin | Bayi / müşteri adı. |

Açılar tek sayı olarak yazılır. TT425 / TT426 dosyalarındaki `90|45` (tilt | pivot) biçimi bu makinelerde kullanılmaz.

## Montaj kodları { #montaj-kodlari }

| Kod | Konum |
|---:|---|
| 1 | Üst (Y) |
| 2 | Sağ (X) |
| 3 | Alt (Y) |
| 4 | Sol (X) |

## Renk / conta kodları { #renk-conta-kodlari }

| Kod | Conta | Profil rengi |
|---:|---|---|
| 01 | Contasız | Beyaz |
| 02 | Contasız | Alt yüzü renkli |
| 03 | Contasız | Üst yüzü renkli |
| 04 | Contasız | Tamamı renkli |
| 11 | Contalı | Beyaz |
| 12 | Contalı | Alt yüzü renkli |
| 13 | Contalı | Üst yüzü renkli |
| 14 | Contalı | Tamamı renkli |

`01` ile `1` aynı kodu gösterir.

## İşlem kodları { #islem-kodlari }

| Kod | İşlem |
|---:|---|
| 0 | İşlem yok |
| 1 | Su tahliye kanalı |
| 2 | Kol |
| 3 | Menteşe |
| 4 | Çift açılım |
| 5 | Tek açılım, sol |
| 6 | Tek açılım, sağ |
| 7 | Çift açılım, sol |
| 8 | Çift açılım, sağ |
| 9 | V. açılım, sol |
| 10 | Sağa açılan kapı |
| 11 | Sola açılan kapı |
| 12 | Vasistas (üst pencere) |

## Örnek

| No | Uzunluk | Profil | Sol | Sağ | Adet | Yük. | Sipariş | Poz | Montaj | Araba | Yer | Diğer eksen | Renk/Conta | İşlem | Bayi |
|---:|---:|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 806 | XXXXXXX12PEN | 45 | 45 | 1 | 60 | X10MUSTERI | 1 | 1 | 1 | 1 | 906 | 11 | 0 | XXXXXXXXXX16BAYI |
| 2 | 906 | XXXXXXX12PEN | 45 | 45 | 1 | 60 | X10MUSTERI | 1 | 2 | 1 | 2 | 806 | 11 | 1 | XXXXXXXXXX16BAYI |
| 9 | 1506 | XXXXXXX12PEN | 90 | 90 | 1 | 60 | X10MUSTERI | 200 | 1 | 2 | 10 | 1806 | 1 | 8 | XXXXXXXXXX16BAYI |

İlk satır: 806 mm, iki ucu 45° kesilen, contalı beyaz profil; 1 numaralı pozisyonun üst parçası (montaj 1), çerçevenin diğer kenarı 906 mm, işlem yok, 1 numaralı arabanın 1 numaralı yerine konur.

[Örnek kesim listesini indir](downloads/TT405_MS300_Cut_List_Example.csv)

Örnekteki profil, sipariş ve bayi değerleri temsilidir.

## Aktarımdan önce kontrol

1. Her satırda 16 alan olduğunu ve ayırıcının `;` olduğunu kontrol edin.
2. Gerekli alanların (kesim numarası, uzunluk, sol / sağ açı, adet) dolu olduğunu kontrol edin.
3. Uzunluk ve diğer eksen değerlerinde ondalık ayırıcının nokta olduğunu kontrol edin.
4. Montaj, renk / conta ve işlem kodlarının yukarıdaki tablolarda olduğunu kontrol edin.
5. Dosyanın 2000 satırı geçmediğini kontrol edin.
6. Dosyayı [CSV File Checker](https://hm-info.github.io/csv_file_checker_haffner/) uygulamasında **TT405-B&R** seçeneğiyle kontrol edin.

[Ana sayfa](index.md)
