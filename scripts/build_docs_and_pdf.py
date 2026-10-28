import os
import re
import html
import subprocess
from datetime import datetime

def parse_markdown_to_html(md_text: str) -> str:
    """
    Converts Markdown text into structured, clean HTML without third-party dependencies.
    Supports headers, tables, code blocks, lists, blockquotes, bold/italic, inline code, and math.
    """
    lines = md_text.splitlines()
    html_output = []
    in_code_block = False
    code_lang = ""
    code_lines = []
    in_table = False
    table_rows = []
    in_list = False
    list_type = "ul"

    def flush_table():
        nonlocal in_table, table_rows
        if not table_rows:
            in_table = False
            return ""
        out = ["<div class='table-container'><table>"]
        # Determine if second row is divider
        has_header = False
        if len(table_rows) >= 2 and all(c in "-:| " for c in table_rows[1].strip()):
            has_header = True

        if has_header:
            out.append("<thead><tr>")
            header_cols = [c.strip() for c in table_rows[0].strip("|").split("|")]
            for col in header_cols:
                out.append(f"<th>{inline_formatting(col)}</th>")
            out.append("</tr></thead><tbody>")
            body_rows = table_rows[2:]
        else:
            out.append("<tbody>")
            body_rows = table_rows

        for row in body_rows:
            if not row.strip() or all(c in "-:| " for c in row.strip()):
                continue
            out.append("<tr>")
            cols = [c.strip() for c in row.strip("|").split("|")]
            for col in cols:
                out.append(f"<td>{inline_formatting(col)}</td>")
            out.append("</tr>")

        out.append("</tbody></table></div>")
        table_rows = []
        in_table = False
        return "\n".join(out)

    def inline_formatting(text: str) -> str:
        # Math blocks
        text = re.sub(r"\$\$(.*?)\$\$", r"<div class='math-block'>\1</div>", text)
        text = re.sub(r"\$(.*?)\$", r"<span class='math-inline'>\1</span>", text)
        # Inline code
        text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
        # Bold and Italic
        text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
        text = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", text)
        # Links
        text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"<a href='\2' target='_blank'>\1</a>", text)
        return text

    i = 0
    while i < len(lines):
        line = lines[i]

        # Code fences
        if line.strip().startswith("```"):
            if not in_code_block:
                in_code_block = True
                code_lang = line.strip()[3:].strip()
                code_lines = []
            else:
                in_code_block = False
                escaped_code = html.escape("\n".join(code_lines))
                html_output.append(
                    f"<div class='code-card'><div class='code-header'>{code_lang or 'text'}</div>"
                    f"<pre><code>{escaped_code}</code></pre></div>"
                )
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Tables
        if "|" in line and (line.strip().startswith("|") or line.strip().endswith("|")):
            in_table = True
            table_rows.append(line)
            i += 1
            continue
        elif in_table:
            html_output.append(flush_table())

        # Close lists if blank line or non-list item
        is_list_item = line.strip().startswith("- ") or line.strip().startswith("* ") or re.match(r"^\d+\.\s", line.strip())
        if in_list and (not line.strip() or not is_list_item):
            html_output.append(f"</{list_type}>")
            in_list = False

        # Blank line
        if not line.strip():
            i += 1
            continue

        # Horizontal Rule
        if line.strip() in ["---", "***", "___"]:
            html_output.append("<hr/>")
            i += 1
            continue

        # Headers
        if line.startswith("# "):
            html_output.append(f"<h1>{inline_formatting(line[2:].strip())}</h1>")
            i += 1
            continue
        elif line.startswith("## "):
            html_output.append(f"<h2>{inline_formatting(line[3:].strip())}</h2>")
            i += 1
            continue
        elif line.startswith("### "):
            html_output.append(f"<h3>{inline_formatting(line[4:].strip())}</h3>")
            i += 1
            continue
        elif line.startswith("#### "):
            html_output.append(f"<h4>{inline_formatting(line[5:].strip())}</h4>")
            i += 1
            continue

        # Blockquote / Alert
        if line.startswith("> "):
            bq_content = inline_formatting(line[2:].strip())
            alert_class = "blockquote"
            if "[!NOTE]" in bq_content:
                alert_class = "alert alert-note"
                bq_content = bq_content.replace("[!NOTE]", "<strong>NOTA:</strong> ")
            elif "[!WARNING]" in bq_content:
                alert_class = "alert alert-warning"
                bq_content = bq_content.replace("[!WARNING]", "<strong>ATENÇÃO:</strong> ")
            elif "[!IMPORTANT]" in bq_content:
                alert_class = "alert alert-important"
                bq_content = bq_content.replace("[!IMPORTANT]", "<strong>IMPORTANTE:</strong> ")
            html_output.append(f"<div class='{alert_class}'>{bq_content}</div>")
            i += 1
            continue

        # Lists
        if line.strip().startswith("- ") or line.strip().startswith("* "):
            if not in_list:
                in_list = True
                list_type = "ul"
                html_output.append("<ul>")
            item_text = line.strip()[2:].strip()
            html_output.append(f"<li>{inline_formatting(item_text)}</li>")
            i += 1
            continue
        elif re.match(r"^\d+\.\s", line.strip()):
            if not in_list:
                in_list = True
                list_type = "ol"
                html_output.append("<ol>")
            item_text = re.sub(r"^\d+\.\s", "", line.strip())
            html_output.append(f"<li>{inline_formatting(item_text)}</li>")
            i += 1
            continue

        # Paragraph
        html_output.append(f"<p>{inline_formatting(line.strip())}</p>")
        i += 1

    if in_table:
        html_output.append(flush_table())
    if in_list:
        html_output.append(f"</{list_type}>")

    return "\n".join(html_output)

def create_full_html_document(title: str, subtitle: str, body_html: str, show_cover: bool = True) -> str:
    """Wraps body HTML in a print-ready A4 academic layout with CSS."""
    now_str = datetime.now().strftime("%d/%m/%Y")
    cover_html = ""
    if show_cover:
        cover_html = f"""
        <div class="cover-page">
            <div class="cover-institution">FECAP &mdash; FUNDAÇÃO ESCOLA DE COMÉRCIO ÁLVARES PENTEADO</div>
            <div class="cover-discipline">BACHARELADO EM CIÊNCIA DA COMPUTAÇÃO &bull; ENGENHARIA DE SOFTWARE</div>
            <div class="cover-center">
                <div class="cover-badge">Q.I. TECH MATCHMAKER ENGINE</div>
                <h1 class="cover-title">{title}</h1>
                <div class="cover-subtitle">{subtitle}</div>
            </div>
            <div class="cover-footer">
                <div class="cover-meta-item">
                    <strong>Autores:</strong><br/>
                    Flavio José dos Santos &mdash; R.A: <strong>23025666</strong><br/>
                    Maria Eduarda de Freitas Lopes &mdash; R.A: <strong>23025447</strong>
                </div>
                <div class="cover-meta-item">
                    <strong>Orientador:</strong><br/>
                    Prof. Luis Pires (FECAP)
                </div>
                <div class="cover-meta-item">
                    <strong>Projeto:</strong><br/>
                    TCC &bull; Startup MVP Matchmaker Engine
                </div>
                <div class="cover-meta-item">
                    <strong>Emissão:</strong> {now_str}<br/>
                    <strong>Status:</strong> Homologado &bull; 100% Testado
                </div>
            </div>
        </div>
        <div class="page-break"></div>
        """

    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        @page {{
            size: A4 portrait;
            margin: 20mm 15mm 20mm 15mm;
            @bottom-right {{
                content: "Página " counter(page);
                font-family: 'Inter', sans-serif;
                font-size: 8pt;
                color: #64748b;
            }}
            @bottom-left {{
                content: "FECAP &bull; Flavio Santos (23025666) & Maria Eduarda Lopes (23025447)";
                font-family: 'Inter', sans-serif;
                font-size: 8pt;
                color: #64748b;
            }}
        }}

        * {{
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }}

        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 10.5pt;
            line-height: 1.6;
            color: #1e293b;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }}

        .page-break {{
            page-break-before: always;
            break-before: page;
        }}

        /* Cover Page */
        .cover-page {{
            min-height: 250mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 30mm 15mm 20mm 15mm;
            text-align: center;
        }}

        .cover-institution {{
            font-size: 13pt;
            font-weight: 700;
            letter-spacing: 2px;
            color: #0f172a;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 8px;
            display: inline-block;
        }}

        .cover-discipline {{
            font-size: 10pt;
            font-weight: 600;
            color: #64748b;
            margin-top: 6px;
            letter-spacing: 1px;
        }}

        .cover-center {{
            margin: 40mm 0;
        }}

        .cover-badge {{
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            font-size: 9pt;
            font-weight: 700;
            padding: 4px 14px;
            border-radius: 9999px;
            letter-spacing: 1px;
            margin-bottom: 16px;
        }}

        .cover-title {{
            font-size: 26pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
            margin: 0 0 16px 0;
        }}

        .cover-subtitle {{
            font-size: 13pt;
            color: #475569;
            max-width: 650px;
            margin: 0 auto;
            line-height: 1.5;
        }}

        .cover-footer {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            text-align: left;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 9.5pt;
        }}

        /* Document Body */
        .content-container {{
            max-width: 800px;
            margin: 0 auto;
            padding: 10px;
        }}

        h1, h2, h3, h4 {{
            color: #0f172a;
            font-weight: 700;
            page-break-after: avoid;
        }}

        h1 {{
            font-size: 19pt;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
            margin-top: 24pt;
            margin-bottom: 14pt;
        }}

        h2 {{
            font-size: 14pt;
            border-left: 4px solid #0284c7;
            padding-left: 10px;
            margin-top: 18pt;
            margin-bottom: 10pt;
        }}

        h3 {{
            font-size: 11.5pt;
            color: #334155;
            margin-top: 14pt;
            margin-bottom: 6pt;
        }}

        p {{
            margin: 0 0 10pt 0;
            text-align: justify;
        }}

        /* Tables */
        .table-container {{
            margin: 14pt 0;
            overflow-x: auto;
            page-break-inside: avoid;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin: 0;
        }}

        th, td {{
            border: 1px solid #cbd5e1;
            padding: 7px 10px;
            text-align: left;
        }}

        th {{
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: 600;
        }}

        tr:nth-child(even) {{
            background-color: #f8fafc;
        }}

        /* Code Blocks */
        .code-card {{
            margin: 12pt 0;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            overflow: hidden;
            background: #0f172a;
            page-break-inside: avoid;
        }}

        .code-header {{
            background: #1e293b;
            color: #94a3b8;
            font-family: 'JetBrains Mono', monospace;
            font-size: 7.5pt;
            padding: 4px 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #334155;
        }}

        pre {{
            margin: 0;
            padding: 10px 14px;
            overflow-x: auto;
        }}

        code {{
            font-family: 'JetBrains Mono', Consolas, monospace;
            font-size: 8.5pt;
            color: #38bdf8;
            background: #f1f5f9;
            padding: 2px 5px;
            border-radius: 4px;
        }}

        pre code {{
            background: transparent;
            color: #f8fafc;
            padding: 0;
        }}

        /* Alerts */
        .alert, .blockquote {{
            border-left: 4px solid #64748b;
            background: #f8fafc;
            padding: 10px 14px;
            margin: 12pt 0;
            border-radius: 0 6px 6px 0;
            font-size: 9.5pt;
        }}

        .alert-note {{
            border-left-color: #0284c7;
            background: #f0f9ff;
        }}

        .alert-warning {{
            border-left-color: #f59e0b;
            background: #fffbeb;
        }}

        .alert-important {{
            border-left-color: #ef4444;
            background: #fef2f2;
        }}

        /* Lists */
        ul, ol {{
            margin: 0 0 10pt 0;
            padding-left: 20px;
        }}

        li {{
            margin-bottom: 4pt;
        }}

        /* Math */
        .math-block {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 8px;
            border-radius: 6px;
            text-align: center;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
            color: #0369a1;
            margin: 10pt 0;
        }}

        .math-inline {{
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
            color: #0369a1;
            background: #f0f9ff;
            padding: 1px 4px;
            border-radius: 3px;
        }}

        hr {{
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 20pt 0;
        }}
    </style>
</head>
<body>
    {cover_html}
    <div class="content-container">
        {body_html}
    </div>
</body>
</html>
"""

def generate_pdf_from_html(html_path: str, pdf_path: str) -> bool:
    """Uses Microsoft Edge or Chrome in headless mode to render HTML to PDF."""
    browser_candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    ]
    browser_path = None
    for b in browser_candidates:
        if os.path.exists(b):
            browser_path = b
            break

    if not browser_path:
        print(f"Browser not found for PDF generation.")
        return False

    abs_html = os.path.abspath(html_path)
    abs_pdf = os.path.abspath(pdf_path)

    cmd = [
        browser_path,
        "--headless",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={abs_pdf}",
        f"file:///{abs_html.replace(os.sep, '/')}"
    ]

    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=45)
        if os.path.exists(abs_pdf) and os.path.getsize(abs_pdf) > 0:
            print(f"PDF successfully generated: {abs_pdf} ({os.path.getsize(abs_pdf):,} bytes)")
            return True
        else:
            print(f"Failed to generate PDF. Exit code: {res.returncode}")
            return False
    except Exception as e:
        print(f"Error during PDF generation: {e}")
        return False

def build_all_documents():
    workspace = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    docs_dir = os.path.join(workspace, "docs")
    os.makedirs(docs_dir, exist_ok=True)

    xp_md_path = os.path.join(workspace, "XP_DIARIO_DE_BORDO.md")
    model_md_path = os.path.join(workspace, "MODEL_EVALUATION.md")
    readme_md_path = os.path.join(workspace, "README.md")

    # 1. Generate Individual XP Diário de Bordo PDF
    if os.path.exists(xp_md_path):
        with open(xp_md_path, "r", encoding="utf-8") as f:
            xp_content = f.read()
        xp_html_body = parse_markdown_to_html(xp_content)
        xp_doc_html = create_full_html_document(
            title="Diário de Bordo — Extreme Programming",
            subtitle="Relatório de Práticas XP: TDD, Refatoração, Programação em Par e Design Simples no Q.I. Tech Matchmaker Engine",
            body_html=xp_html_body,
            show_cover=True
        )
        xp_html_file = os.path.join(docs_dir, "XP_DIARIO_DE_BORDO.html")
        xp_pdf_file = os.path.join(workspace, "XP_DIARIO_DE_BORDO.pdf")
        with open(xp_html_file, "w", encoding="utf-8") as f:
            f.write(xp_doc_html)
        generate_pdf_from_html(xp_html_file, xp_pdf_file)

    # 2. Generate Individual Model Evaluation PDF
    if os.path.exists(model_md_path):
        with open(model_md_path, "r", encoding="utf-8") as f:
            model_content = f.read()
        model_html_body = parse_markdown_to_html(model_content)
        model_doc_html = create_full_html_document(
            title="Avaliação Metodológica dos Modelos de IA",
            subtitle="faster-whisper, multilingual-e5-small e qwen3:4b — Métricas WER, F1, Explicabilidade e Diretrizes Éticas",
            body_html=model_html_body,
            show_cover=True
        )
        model_html_file = os.path.join(docs_dir, "MODEL_EVALUATION.html")
        model_pdf_file = os.path.join(workspace, "MODEL_EVALUATION.pdf")
        with open(model_html_file, "w", encoding="utf-8") as f:
            f.write(model_doc_html)
        generate_pdf_from_html(model_html_file, model_pdf_file)

    # 3. Generate CONSOLIDATED "Tudo Incluso" PDF
    consolidated_parts = []
    if os.path.exists(xp_md_path):
        with open(xp_md_path, "r", encoding="utf-8") as f:
            consolidated_parts.append(
                "<div class='page-break'></div>"
                "<div class='cover-center' style='margin: 15mm 0;'><div class='cover-badge'>PARTE I</div><h1>Extreme Programming — Diário de Bordo & Refatoração</h1></div>"
                + parse_markdown_to_html(f.read())
            )
    if os.path.exists(model_md_path):
        with open(model_md_path, "r", encoding="utf-8") as f:
            consolidated_parts.append(
                "<div class='page-break'></div>"
                "<div class='cover-center' style='margin: 15mm 0;'><div class='cover-badge'>PARTE II</div><h1>Avaliação de Modelos de Inteligência Artificial</h1></div>"
                + parse_markdown_to_html(f.read())
            )
    if os.path.exists(readme_md_path):
        with open(readme_md_path, "r", encoding="utf-8") as f:
            consolidated_parts.append(
                "<div class='page-break'></div>"
                "<div class='cover-center' style='margin: 15mm 0;'><div class='cover-badge'>PARTE III</div><h1>Arquitetura do Sistema e Especificação Operacional</h1></div>"
                + parse_markdown_to_html(f.read())
            )

    full_combined_html = create_full_html_document(
        title="Q.I. Tech Matchmaker Engine",
        subtitle="Dossiê Acadêmico e Técnico Completo &bull; Metodologia Ágil (XP), Engenharia de Software, Modelos Locais de IA e Avaliação Empírica",
        body_html="\n".join(consolidated_parts),
        show_cover=True
    )
    all_html_file = os.path.join(docs_dir, "QI_TECH_DOCUMENTACAO_COMPLETA.html")
    all_pdf_file = os.path.join(workspace, "QI_TECH_DOCUMENTACAO_COMPLETA.pdf")

    with open(all_html_file, "w", encoding="utf-8") as f:
        f.write(full_combined_html)
    generate_pdf_from_html(all_html_file, all_pdf_file)

if __name__ == "__main__":
    build_all_documents()
