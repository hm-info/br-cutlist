"""Build downloadable PDFs from the same Markdown as the information pages."""

from html import escape
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit, urlunsplit

import markdown
from mkdocs.utils.meta import get_data
from weasyprint import CSS, HTML


def on_pre_build(config, **kwargs):
    docs_dir = Path(config["docs_dir"])
    output_dir = docs_dir / "downloads"
    output_dir.mkdir(exist_ok=True)
    stylesheet = CSS(filename=str(Path(__file__).with_name("pdf.css")))

    for source in sorted(docs_dir.glob("*.md")):
        content, meta = get_data(source.read_text(encoding="utf-8"))
        filename = meta.get("pdf")
        if not filename:
            continue
        if Path(filename).name != filename or not filename.endswith(".pdf"):
            raise ValueError(f"Invalid PDF filename for {source.name}")

        # Download and language controls belong to the website, not the PDF.
        content = re.sub(
            r'<div class="document-tools"[^>]*>.*?</div>', "", content, flags=re.S
        )
        # Interactive tools only work on the website.
        content = re.sub(
            r"<!-- web-only -->.*?<!-- /web-only -->", "", content, flags=re.S
        )
        article = markdown.markdown(
            content, extensions=["tables", "fenced_code", "md_in_html", "toc", "attr_list"]
        )
        page_url = urljoin(config["site_url"], source.with_suffix(".html").name)

        def public_link(match):
            target = match.group(1)
            if target.startswith("#"):
                return match.group(0)
            parts = urlsplit(target)
            if not parts.scheme and not parts.netloc:
                path = parts.path
                if path.endswith(".md"):
                    path = path[:-3] + ".html"
                target = urljoin(page_url, urlunsplit(parts._replace(path=path)))
            return f'href="{escape(target, quote=True)}"'

        article = re.sub(r'href="([^"]*)"', public_link, article)
        title = escape(meta.get("title", config["site_name"]))
        language = escape(meta.get("lang", "en"), quote=True)
        html = (
            f'<!doctype html><html lang="{language}"><head>'
            f'<meta charset="utf-8"><title>{title}</title></head><body>'
            f'<main>{article}</main></body></html>'
        )
        HTML(string=html, base_url=str(source.parent) + "/").write_pdf(
            str(output_dir / filename), stylesheets=[stylesheet]
        )
