# TT405 / MS300 Manual

Cut list (job file) guide for TT405 and MS300 machines with B&R PLC. Both machines use the same 16-column, `;`-separated cut list.

B&R PLC'li TT405 ve MS300 makinelerinin kesim listesi (iş dosyası) rehberi. İki makine aynı 16 sütunlu, `;` ayırıcılı kesim listesini kullanır.

## 📖 Documentation

<https://hm-info.github.io/br-cutlist/>

- [Türkçe — Kesim listesi](https://hm-info.github.io/br-cutlist/cut_list_tr.html)
- [English — Cut list](https://hm-info.github.io/br-cutlist/cut_list_en.html)

Each guide includes a PDF download, generated from the same Markdown during each build and not committed to the source branch. The example CSV uses fictitious customer and order information.

Cut lists can be checked with the [CSV File Checker](https://hm-info.github.io/csv_file_checker_haffner/) (TT405-B&R option).

Documentation check: `pip install -r requirements.txt` then `mkdocs build --strict`. PDF generation requires Pango, HarfBuzz Subset and DejaVu fonts; the Ubuntu packages are listed in the publishing workflow. Updates to `main` are published automatically to GitHub Pages.
