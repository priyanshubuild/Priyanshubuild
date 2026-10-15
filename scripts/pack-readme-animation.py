"""Pack the SVG-rendered frames into a small, self-contained README GIF."""
import json
import tempfile
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
frames_dir = Path(tempfile.gettempdir()) / "priyanshu-readme-frames"
manifest = json.loads((frames_dir / "manifest.json").read_text())
images = []
palette = Image.open(frames_dir / "000.png").convert("RGB").quantize(colors=128)
for i in range(manifest["frames"]):
    frame = Image.open(frames_dir / f"{i:03}.png").convert("RGB")
    images.append(frame.quantize(palette=palette, dither=Image.Dither.NONE))
output = root / "assets/readme/header.gif"
images[0].save(output, save_all=True, append_images=images[1:],
               duration=manifest["delay"], loop=0, optimize=True, disposal=1)
print(f"Created {output.name}: {output.stat().st_size:,} bytes.")
