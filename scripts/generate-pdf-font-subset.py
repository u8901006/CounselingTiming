from __future__ import annotations

import base64
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CHARS_PATH = ROOT / 'scripts' / 'pdf-font-chars.txt'
OUTPUT_PATH = ROOT / 'src' / 'utils' / 'pdfFont.ts'
SOURCE_FONT = Path(r'C:\Windows\Fonts\kaiu.ttf')
FONT_FAMILY = 'KaiuSubset'
FONT_FILE = 'kaiu-subset.ttf'


def load_text_chars() -> str:
    text = CHARS_PATH.read_text(encoding='utf-8')
    unique_chars = []
    seen: set[str] = set()

    for char in text:
        if char in {'\r'}:
            continue
        if char not in seen:
            seen.add(char)
            unique_chars.append(char)

    return ''.join(unique_chars)


def generate_subset_font(chars: str, output_font_path: Path) -> None:
    command = [
        sys.executable,
        '-m',
        'fontTools.subset',
        str(SOURCE_FONT),
        f'--text={chars}',
        '--flavor=',
        f'--output-file={output_font_path}',
        '--layout-features=*',
        '--glyph-names',
        '--symbol-cmap',
        '--legacy-cmap',
        '--notdef-glyph',
        '--notdef-outline',
        '--recommended-glyphs',
        '--name-IDs=*',
        '--name-legacy',
        '--name-languages=*',
    ]

    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    if completed.returncode != 0:
        raise RuntimeError(
            'Failed to subset font:\n'
            f'STDOUT:\n{completed.stdout}\n\nSTDERR:\n{completed.stderr}'
        )


def write_font_module(font_bytes: bytes) -> None:
    encoded = base64.b64encode(font_bytes).decode('ascii')
    module_text = (
        f"export const PDF_FONT_FAMILY = '{FONT_FAMILY}'\n"
        f"export const PDF_FONT_FILE = '{FONT_FILE}'\n"
        f"export const PDF_FONT_DATA = '{encoded}'\n"
    )
    OUTPUT_PATH.write_text(module_text, encoding='utf-8')


def main() -> None:
    if not CHARS_PATH.exists():
      raise FileNotFoundError(f'Missing character list: {CHARS_PATH}')
    if not SOURCE_FONT.exists():
      raise FileNotFoundError(f'Missing source font: {SOURCE_FONT}')

    chars = load_text_chars()
    if not chars:
      raise ValueError('Character list is empty.')

    with tempfile.TemporaryDirectory() as temp_dir:
        subset_font_path = Path(temp_dir) / FONT_FILE
        generate_subset_font(chars, subset_font_path)
        write_font_module(subset_font_path.read_bytes())

    print(f'Generated subset font module at {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
