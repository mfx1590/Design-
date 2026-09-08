#!/usr/bin/env bash
# Turns a transformation video into a scroll-scrub frame sequence (PLAN.md §7).
#
# Usage:
#   scripts/process-sequence.sh <input.mp4> <project-slug> [options]
# Options:
#   --crop W:H:X:Y          ffmpeg crop applied to the desktop set (e.g. 1920:1080:0:130)
#   --mobile <file.mp4>     separate portrait source for the 900px mobile set
#   --mobile-crop W:H:X:Y   crop for the mobile set (applies to --mobile, or to the main input if no --mobile)
#   --fps N                 frames per second to extract (default 24)
#   --max-kb N              largest allowed frame size in KB; quality steps down until it fits (default 120)
#
# Output: public/sequences/<slug>/{1600,900}/frame-NNN.webp, poster.jpg, end.jpg, scene.mp4, scene.webm, manifest.json
set -euo pipefail

IN="${1:?input video}"; SLUG="${2:?project slug}"; shift 2
CROP=""; MOBILE=""; MCROP=""; FPS=24; MAXKB=120
while [ $# -gt 0 ]; do
  case "$1" in
    --crop) CROP="$2"; shift 2 ;;
    --mobile) MOBILE="$2"; shift 2 ;;
    --mobile-crop) MCROP="$2"; shift 2 ;;
    --fps) FPS="$2"; shift 2 ;;
    --max-kb) MAXKB="$2"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
done

OUT="public/sequences/$SLUG"
rm -rf "$OUT"; mkdir -p "$OUT/1600" "$OUT/900"

vf_chain() { # $1 crop, $2 width
  local vf="fps=$FPS"
  [ -n "$1" ] && vf="$vf,crop=$1"
  echo "$vf,scale=$2:-2"
}

encode_set() { # $1 input, $2 crop, $3 width, $4 outdir
  local q=80 max kb
  while :; do
    rm -f "$4"/frame-*.webp
    ffmpeg -v error -y -i "$1" -vf "$(vf_chain "$2" "$3")" -c:v libwebp -quality "$q" -compression_level 6 "$4/frame-%03d.webp"
    max=$(find "$4" -name 'frame-*.webp' -printf '%s\n' | sort -n | tail -1)
    kb=$(( max / 1024 ))
    echo "  $4: $(ls "$4" | wc -l) frames, quality $q, largest ${kb} KB"
    if [ "$kb" -le "$MAXKB" ] || [ "$q" -le 56 ]; then break; fi
    q=$(( q - 8 ))
  done
}

echo "Desktop set (1600w)"
encode_set "$IN" "$CROP" 1600 "$OUT/1600"

if [ -n "$MOBILE" ]; then
  echo "Mobile set (900w) from $MOBILE"
  encode_set "$MOBILE" "$MCROP" 900 "$OUT/900"
else
  echo "Mobile set (900w) derived from the main input"
  encode_set "$IN" "${MCROP:-$CROP}" 900 "$OUT/900"
fi

echo "Posters"
ffmpeg -v error -y -i "$OUT/1600/frame-001.webp" -q:v 3 "$OUT/poster.jpg"
LAST=$(ls "$OUT/1600" | sort | tail -1)
ffmpeg -v error -y -i "$OUT/1600/$LAST" -q:v 3 "$OUT/end.jpg"

echo "Scrub-video fallback (1080p h264 + vp9)"
VF_VIDEO="scale=1920:-2"; [ -n "$CROP" ] && VF_VIDEO="crop=$CROP,scale=1920:-2"
ffmpeg -v error -y -i "$IN" -vf "$VF_VIDEO" -an -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart "$OUT/scene.mp4"
ffmpeg -v error -y -i "$IN" -vf "$VF_VIDEO" -an -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -pix_fmt yuv420p "$OUT/scene.webm"

echo "Manifest"
dims() { ffprobe -v error -show_entries stream=width,height -of csv=p=0 "$1"; }
D=$(dims "$OUT/1600/frame-001.webp"); M=$(dims "$OUT/900/frame-001.webp")
ND=$(ls "$OUT/1600" | wc -l | tr -d ' '); NM=$(ls "$OUT/900" | wc -l | tr -d ' ')
OUT="$OUT" node -e '
const [slug, fps, D, M, ND, NM] = process.argv.slice(1);
const [dw, dh] = D.split(",").map(Number); const [mw, mh] = M.split(",").map(Number);
const base = "/sequences/" + slug;
const manifest = {
  project: slug, fps: Number(fps), generatedAt: new Date().toISOString(),
  sets: {
    desktop: { basePath: base, width: dw, height: dh, frameCount: Number(ND), pad: 3 },
    mobile: { basePath: base, width: mw, height: mh, frameCount: Number(NM), pad: 3 },
  },
  poster: base + "/poster.jpg", end: base + "/end.jpg",
  video: { mp4: base + "/scene.mp4", webm: base + "/scene.webm" },
};
require("fs").writeFileSync(process.env.OUT + "/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify(manifest.sets));
' "$SLUG" "$FPS" "$D" "$M" "$ND" "$NM"
du -sh "$OUT"/1600 "$OUT"/900 "$OUT"/scene.mp4 "$OUT"/scene.webm
