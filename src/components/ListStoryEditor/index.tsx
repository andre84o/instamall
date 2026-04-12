"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Download,
  Camera,
} from "lucide-react";

function HouseIcon({ size = 18, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 433"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="none"
      className={className}
    >
      <g transform="translate(0,433) scale(0.05,-0.05)">
        <path d="M5070 6978 c-2715 -1997 -2523 -1851 -2571 -1949 -159 -330 199 -665 526 -492 l115 61 0 -1689 0 -1689 -146 0 c-206 0 -302 -89 -203 -189 42 -41 6384 -48 6425 -7 97 97 -8 196 -210 196 l-146 0 0 1690 c0 930 5 1690 10 1690 6 0 44 -22 85 -49 392 -255 813 293 461 601 -37 32 -262 201 -501 376 l-435 318 0 664 c0 618 -3 666 -37 697 -55 50 -984 50 -1026 0 -18 -23 -30 -114 -37 -289 l-10 -256 -450 331 c-774 569 -884 647 -917 647 -18 0 -438 -298 -933 -662z m1215 205 c259 -192 842 -620 2235 -1642 380 -278 715 -529 745 -557 87 -81 73 -203 -28 -256 -96 -49 -57 -73 -1017 632 -470 346 -1384 1016 -1847 1354 -186 135 -353 246 -372 246 -19 0 -141 -80 -272 -177 -867 -645 -2815 -2062 -2848 -2073 -55 -17 -143 29 -180 94 -59 105 -30 133 609 603 330 243 1068 786 1640 1207 572 421 1047 765 1055 765 8 1 134 -87 280 -196z m1975 -664 c0 -471 -2 -499 -35 -480 -19 11 -161 113 -315 226 l-280 207 -6 274 -5 274 320 0 321 0 0 -501z m-1895 -74 c190 -141 779 -574 1310 -963 l965 -707 0 -1778 0 -1777 -1480 0 -1480 0 0 1409 c0 1373 -1 1410 -39 1430 -25 14 -331 21 -859 21 l-820 0 -31 -44 c-27 -40 -31 -209 -31 -1430 l0 -1386 -270 0 -270 0 0 1775 0 1775 1315 965 c723 530 1322 964 1330 965 8 0 170 -115 360 -255z m-905 -3905 l0 -1320 -670 0 -670 0 0 1307 c0 718 6 1312 13 1320 8 7 309 13 670 13 l657 0 0 -1320z"/>
        <path d="M5860 5881 c-647 -197 -523 -1131 150 -1131 650 0 786 935 163 1120 -107 32 -231 36 -313 11z m266 -230 c100 -36 151 -83 196 -181 157 -341 -255 -658 -542 -417 -297 250 -20 729 346 598z"/>
        <path d="M6231 4049 c-27 -28 -31 -110 -31 -599 0 -555 -1 -568 -41 -580 -129 -41 -107 -457 32 -591 l71 -69 894 -5 c998 -6 985 -8 1079 133 71 107 68 461 -5 518 l-50 40 0 547 c0 464 -5 555 -31 593 l-31 44 -928 0 c-816 0 -931 -4 -959 -31z m849 -679 l0 -490 -330 0 -330 0 0 490 0 490 330 0 330 0 0 -490z m875 -5 l6 -485 -331 0 -330 0 0 490 0 491 325 -6 325 -5 5 -485z m105 -801 c0 -152 46 -144 -869 -144 -909 1 -862 -6 -877 123 -15 126 -85 117 879 117 l867 0 0 -96z"/>
        <path d="M5041 2621 c-117 -117 27 -309 175 -233 132 68 89 255 -62 268 -51 5 -83 -5 -113 -35z"/>
      </g>
    </svg>
  );
}

// Palm overlay: transparent PNG with leaves in top-left + bottom-right corners.
// One single image covers the full story frame — no SVG needed.
function PalmOverlay() {
  return (
    <img
      src="/palm-overlay.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover z-[5] pointer-events-none"
      style={{ opacity: 0.65 }}
    />
  );
}

const SS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SF = "Georgia,'Times New Roman',serif";

// ── Editable Field ─────────────────────────────────────────────────
function Editable({
  value,
  onChange,
  className,
  center,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  center?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const commit = () => {
    onChange(temp);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setTemp(value);
            setEditing(false);
          }
        }}
        className={`bg-sky-100/50 border border-sky-400 outline-none rounded px-1 text-inherit font-inherit ${center ? "text-center" : ""}`}
        style={{ width: `${Math.max(temp.length + 1, 2)}ch` }}
      />
    );
  }
  return (
    <span
      onClick={() => {
        setTemp(value);
        setEditing(true);
      }}
      className={`cursor-pointer hover:bg-sky-50/20 rounded px-1 transition-all ${className}`}
    >
      {value}
    </span>
  );
}

// ── Photo Zone ──────────────────────────────────────────────────────
function Photo({
  src,
  onLoad,
  label,
  className,
}: {
  src: string | null;
  onLoad: (src: string) => void;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      if (ev.target?.result) onLoad(ev.target.result as string);
    };
    r.readAsDataURL(f);
  };
  return (
    <div
      onClick={() => ref.current?.click()}
      className={`relative cursor-pointer overflow-hidden group bg-slate-200 ${className}`}
    >
      {src ? (
        <img src={src} className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400">
          <Camera size={20} />
          <span className="text-[8px] font-bold uppercase tracking-tighter">
            {label}
          </span>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handle}
      />
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
export default function ListStoryEditor() {
  const [d, setD] = useState({
    title: "NEW LISTING!",
    ref: "Ref: 58272",
    price: "229.500€",
    location: "Punta Prima",
    beds: "2",
    baths: "2",
    area: "67m²",
    type: "Bungalow",
  });
  const [p1, setP1] = useState<string | null>(null);
  const [p2, setP2] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Load Cormorant Garamond font for UI preview
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap";
    document.head.appendChild(link);
    return () => { if (link.parentNode) link.parentNode.removeChild(link); };
  }, []);

  const set = (k: keyof typeof d) => (v: string) =>
    setD((prev) => ({ ...prev, [k]: v }));

  const renderCanvas = useCallback(async (): Promise<string | null> => {
    try {
      // Load Cormorant Garamond 700 explicitly. On Vercel the <link> stylesheet
      // may not be parsed yet when canvas renders, so we fetch the Google Fonts
      // CSS directly, extract the woff2 URL, and register it via FontFace.
      try {
        if (!document.fonts.check("700 99px 'Cormorant Garamond'")) {
          const cssRes = await fetch(
            "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&display=swap",
            { headers: { "User-Agent": "Mozilla/5.0" } }
          );
          const css = await cssRes.text();
          const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
          if (match) {
            const font = new FontFace(
              "Cormorant Garamond",
              `url(${match[1]}) format('woff2')`,
              { weight: "700", style: "normal" }
            );
            const loaded = await font.load();
            document.fonts.add(loaded);
          }
        }
        await document.fonts.load("700 99px 'Cormorant Garamond'");
        await document.fonts.ready;
      } catch (e) {
        console.warn("Cormorant Garamond load failed, using serif fallback:", e);
      }

      const W = 1080, H = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      ctx.beginPath();
      ctx.roundRect(0, 0, W, H, 30);
      ctx.clip();

      const loadImg = (src: string | null): Promise<HTMLImageElement | null> =>
        new Promise((res) => {
          if (!src) { res(null); return; }
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = () => res(null);
          img.src = src;
        });

      const [img1, img2, palmImg, houseImg, bedImg, showerImg, positionImg, sizeImg, starImg] = await Promise.all([
        loadImg(p1), loadImg(p2),
        loadImg("/palm-overlay.png"),
        loadImg("/house-icon.svg"), loadImg("/bed-icon.svg"), loadImg("/shower-icon.svg"),
        loadImg("/position-icon.svg"), loadImg("/size-icon.svg"),
        loadImg("/image/star.png"),
      ]);

      function roundRect(x: number, y: number, w: number, h: number, r: number) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      // ── Background ──
      ctx.fillStyle = "#ddeaeb";
      ctx.fillRect(0, 0, W, H);
      if (img2) {
        const bgScale = Math.max(W / img2.width, H / img2.height) * 1.15;
        const bgW = img2.width * bgScale, bgH = img2.height * bgScale;
        ctx.filter = "blur(4px)";
        ctx.globalAlpha = 0.8;
        ctx.drawImage(img2, (W - bgW) / 2, (H - bgH) / 2, bgW, bgH);
        ctx.filter = "none";
        ctx.globalAlpha = 1;
      }

      // ── Palm overlay (transparent PNG, scaled to full canvas) ──
      if (palmImg) {
        ctx.globalAlpha = 0.95;
        ctx.drawImage(palmImg, 0, 0, W, H);
        ctx.globalAlpha = 1;
      }

      // ── Title "NEW LISTING!" with Cormorant Garamond ──
      const titleText = d.title.toUpperCase();
      const titleY = 140;
      const TITLE_FONT = `'Cormorant Garamond', ${SF}`;

      ctx.textAlign = "center";
      ctx.font = `600 120px ${TITLE_FONT}`;
      const titleMetricsW = ctx.measureText(titleText).width;
      const titleCenterX = W / 2; // title perfectly centered

      // Drop shadow
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;

      // Fill: off-white
      ctx.fillStyle = "#F2F2EE";
      ctx.fillText(titleText, titleCenterX, titleY);

      // Stroke: thin gray outline (no shadow on stroke)
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 1;
      ctx.strokeStyle = "#d6d6d6";
      ctx.lineWidth = 1.5;
      ctx.strokeText(titleText, titleCenterX, titleY);

      // Star PNG — placed just to the right of the centered title
      ctx.shadowBlur = 10; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 2;
      if (starImg && starImg.naturalWidth) {
        const STAR_SIZE = 150;                    // height in px
        const STAR_GAP  = -5
        ;                     // gap between title right edge and star
        const starAspect = starImg.naturalWidth / starImg.naturalHeight;
        const starW = STAR_SIZE * starAspect;
        const starH = STAR_SIZE;
        const starX = titleCenterX + titleMetricsW / 2 + STAR_GAP;
        const starY = titleY - starH * 0.72;
        ctx.drawImage(starImg, starX, starY, starW, starH);
      }

      // ── Hero image geometry (image is drawn later, above the card border) ──
      const heroX = 50, heroY = 230, heroW = W - 100, heroH = Math.round(heroW / 1.6);

      // ── Info card: white semi-transparent, rounded 20px ──
      const cardX = 125, cardW = W - 250;
      const cardY = heroY + heroH + 70;
      const cardH = 790;

      ctx.shadowColor = "rgba(0,0,0,0.14)";
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      roundRect(cardX, cardY, cardW, cardH, 20);
      ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      // Border around info card with inset gap
      const BORDER_GAP     = 26;         // space between card and border (sides + bottom)
      const BORDER_TOP_GAP = 140;         // extra space on top — pushes border up toward hero
      const BORDER_WIDTH   = 5;          // stroke thickness
      const BORDER_COLOR   = "#ffffff96";  // border color
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth   = BORDER_WIDTH;
      roundRect(
        cardX - BORDER_GAP,
        cardY - BORDER_TOP_GAP,
        cardW + BORDER_GAP * 2,
        cardH + BORDER_TOP_GAP + BORDER_GAP,
        20 + BORDER_GAP
      );
      ctx.stroke();

      // ── Hero image (drawn after the border so it overlaps on top) ──
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.10)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = "#000";
      roundRect(heroX, heroY, heroW, heroH, 24);
      ctx.fill();
      ctx.restore();

      if (img1) {
        ctx.save();
        roundRect(heroX, heroY, heroW, heroH, 24);
        ctx.clip();
        const s = Math.max(heroW / img1.width, heroH / img1.height);
        ctx.drawImage(img1,
          heroX + (heroW - img1.width * s) / 2,
          heroY + (heroH - img1.height * s) / 2,
          img1.width * s, img1.height * s
        );
        ctx.restore();
      } else {
        ctx.fillStyle = "#b0cccc";
        roundRect(heroX, heroY, heroW, heroH, 24); ctx.fill();
      }

      // ── Ref – light gray, small, discrete ──
      ctx.font = `400 34px ${SS}`;
      ctx.fillStyle = " #222222";
      ctx.textAlign = "center";
      ctx.fillText(d.ref, cardX + cardW / 2, cardY + 62);

      // ── Price – black, serif, underlined ──
      const priceText = "Price: " + d.price;
      ctx.fillStyle = "#1A1A1A";
      ctx.textAlign = "center";
      ctx.letterSpacing = "-3px";          // tighter letter spacing
      const PRICE_Y_SCALE = 0.92;          // vertical squish (1 = normal, lower = shorter)
      ctx.save();
      ctx.translate(cardX + cardW / 2, cardY + 150);
      ctx.scale(1, PRICE_Y_SCALE);
      ctx.font = `700 74px ${SS}`;
      ctx.fillText(priceText, 0, 0);
      ctx.restore();
      ctx.letterSpacing = "0px";           // reset so it doesn't leak to next text

      // ── Divider ──
      ctx.fillStyle = "rgba(180,180,180,0.60)";
      ctx.fillRect(cardX + 30, cardY + 185, cardW - 60, 1.5);

      // ── Stats rows: larger icons, bigger text, more line height ──
      const svgIconMap: Record<string, HTMLImageElement | null> = {
        pin: positionImg, bed: bedImg, bath: showerImg, square: sizeImg, home: houseImg,
      };

      // Icon styling — tweak freely
      const ICON_COLOR = "#222222"; // any CSS color
      const ICON_SIZE  = 98;        // height in px (width auto from aspect ratio)
      const ICON_BOLD  = 0;         // 0 = normal, 1–3 = progressively thicker (dilation)

      function drawIcon(cx: number, cy: number, type: string) {
        const img = svgIconMap[type];
        if (!img || !img.naturalWidth) return;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const iconH = ICON_SIZE;
        const iconW = iconH * aspectRatio;

        // Render icon to an offscreen canvas, mask it with the desired color,
        // then draw the tinted result onto the main canvas.
        const pad = ICON_BOLD * 2 + 2;
        const off = document.createElement("canvas");
        off.width  = Math.ceil(iconW + pad * 2);
        off.height = Math.ceil(iconH + pad * 2);
        const octx = off.getContext("2d")!;

        // Draw the SVG (optionally multiple times with offsets for a "bold" dilation)
        if (ICON_BOLD > 0) {
          for (let dx = -ICON_BOLD; dx <= ICON_BOLD; dx++) {
            for (let dy = -ICON_BOLD; dy <= ICON_BOLD; dy++) {
              octx.drawImage(img, pad + dx, pad + dy, iconW, iconH);
            }
          }
        } else {
          octx.drawImage(img, pad, pad, iconW, iconH);
        }

        // Tint: replace all opaque pixels with ICON_COLOR
        octx.globalCompositeOperation = "source-in";
        octx.fillStyle = ICON_COLOR;
        octx.fillRect(0, 0, off.width, off.height);

        // Place on main canvas, centered on (cx, cy)
        ctx.drawImage(off, cx - off.width / 2, cy - off.height / 2);
      }

      const statsData = [
        { label: d.location, iconType: "pin" },
        { label: d.beds,     iconType: "bed" },
        { label: d.baths,    iconType: "bath" },
        { label: d.area,     iconType: "square" },
        { label: d.type,     iconType: "home" },
      ];

      ctx.textAlign = "left";
      let sy = cardY + 268;
      statsData.forEach(({ label, iconType }) => {
        drawIcon(cardX + 79, sy - 8, iconType);
        ctx.font = `400 54px ${SS}`;
        ctx.fillStyle = "#222222";
        ctx.fillText(label, cardX + 150, sy + 9);
        sy += 110; // 90-100px between rows
      });

      // ── Polaroid (photo 2) – wider proportions, clear white border ──
      {
        ctx.save();
        const frameW = 420, frameH = 510, pad = 22, bottomPad = 104;
        const polX = cardX + cardW - 330, polY = cardY + 200;
        ctx.translate(polX, polY);
        ctx.rotate(8 * Math.PI / 180);

        // Shadow behind polaroid
        ctx.shadowColor = "rgba(0,0,0,0.32)";
        ctx.shadowBlur = 32;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 12;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, frameW, frameH);
        ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

        // Photo clipped inside the polaroid frame
        const pw = frameW - pad * 2, ph = frameH - pad - bottomPad;
        ctx.save();
        ctx.beginPath();
        ctx.rect(pad, pad, pw, ph);
        ctx.clip();
        if (img2) {
          const ps = Math.max(pw / img2.width, ph / img2.height);
          ctx.drawImage(
            img2,
            pad + (pw - img2.width * ps) / 2,
            pad + (ph - img2.height * ps) / 2,
            img2.width * ps,
            img2.height * ps
          );
        } else {
          // Placeholder when photo 2 not uploaded
          ctx.fillStyle = "#cbd5e1";
          ctx.fillRect(pad, pad, pw, ph);
          ctx.fillStyle = "#64748b";
          ctx.font = `700 28px ${SS}`;
          ctx.textAlign = "center";
          ctx.fillText("POOLBILD", pad + pw / 2, pad + ph / 2 + 10);
        }
        ctx.restore();
        ctx.restore();
      }

      return canvas.toDataURL("image/png");
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [d, p1, p2]);

  const downloadStory = useCallback(async () => {
    setDownloading(true);
    try {
      const imageData = await renderCanvas();
      if (!imageData) { setDownloading(false); return; }
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, filename: `list_story_${d.ref.replace(/\s/g, "_")}.png` }),
      });
      if (!res.ok) { setDownloading(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `list_story_${d.ref.replace(/\s/g, "_")}.png`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      console.error(err);
      setDownloading(false);
    }
  }, [renderCanvas, d.ref]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center py-10 px-4 font-sans text-white">
      <div className="text-center mb-8">
        <h2 className="text-sky-400 font-bold tracking-[0.3em] text-[10px] uppercase">
          ListStoryEditor
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Klicka på text eller bildrutor för att ändra
        </p>
      </div>

      {/* ── Story Canvas (1080x1920 ratio) ── */}
      <div
        id="story-canvas"
        className="relative w-[360px] h-[640px] bg-white rounded-xl shadow-2xl overflow-hidden border-[6px] border-slate-800"
      >
        {/* Palm overlay (transparent PNG, leaves in top-left + bottom-right) */}
        <PalmOverlay />

        {/* Background: blurred photo 2 */}
        <div className="absolute inset-0 z-0">
          {p2 ? (
            <img
              src={p2}
              className="w-full h-full object-cover blur-[2px] scale-110 opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-sky-100 to-white" />
          )}
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header – Cormorant Garamond, off-white, letter-spaced */}
          <div className="pt-9 pb-3 text-center">
            <h1
              className="flex items-center justify-center gap-1.5 drop-shadow-md"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: "19px",
                letterSpacing: "0.12em",
                color: "#F2F2EE",
                WebkitTextStroke: "0.4px #7A7A7A",
                textTransform: "uppercase",
              }}
            >
              <Editable value={d.title} onChange={set("title")} center />
              <img src="/image/star.png" alt="" className="h-7 w-7 shrink-0 object-contain" />
            </h1>
          </div>

          {/* Huvudbild (P1) */}
          <div className="px-4">
            <Photo
              src={p1}
              onLoad={setP1}
              label="Huvudbild"
              className="w-full aspect-[1.6/1] rounded-lg shadow-lg"
            />
          </div>

          {/* Info Card – white semi-transparent, rounded-2xl */}
          <div className="px-10 mt-5 flex-1 pb-8">
            <div
              className="backdrop-blur-sm rounded-[20px] p-3 pt-[10px] pb-5 h-fit relative"
              style={{
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.13)",
              }}
            >
              <div className="text-center mb-2 -mt-1">
                {/* Ref – small, light gray */}
                <div
                  className="text-[10px] mb-1 tracking-tight"
                  style={{ color: "rgb(88, 88, 88)" }}
                >
                  <Editable value={d.ref} onChange={set("ref")} />
                </div>
                {/* Price – black, serif, underline */}
                <div
                  className="font-bold"
                  style={{
                    fontFamily: SF,
                    fontSize: "22px",
                    color: "#1A1A1A",
                    textDecoration: "none",
                    textUnderlineOffset: "3px",
                    letterSpacing: "-1px",
                    transform: "scaleY(0.82)",
                    transformOrigin: "center",
                    display: "inline-block",
                  }}
                >
                  Price: <Editable value={d.price} onChange={set("price")} />
                </div>
                <div className="h-[0.8px] w-full bg-gray-300/70 my-1.5" />
              </div>

              {/* Stats – larger icons, more spacing */}
              <div className="space-y-[10px] pb-2">
                {[
                  { src: "/position-icon.svg", val: d.location, k: "location" as const },
                  { src: "/bed-icon.svg",      val: d.beds,     k: "beds" as const },
                  { src: "/shower-icon.svg",   val: d.baths,    k: "baths" as const },
                  { src: "/size-icon.svg",     val: d.area,     k: "area" as const },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <img
                      src={item.src}
                      width={28}
                      height={28}
                      style={{ objectFit: "contain", filter: "brightness(0) saturate(100%) invert(16%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(25%)" }}
                      alt=""
                      className="shrink-0"
                    />
                    <div
                      className="font-semibold tracking-tight"
                      style={{ fontSize: "13px", color: "#1A1A1A" }}
                    >
                      <Editable value={item.val} onChange={set(item.k)} />
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span style={{ color: "#3A3A3A" }} className="shrink-0 flex"><HouseIcon size={28} /></span>
                  <div
                    className="font-semibold tracking-tight"
                    style={{ fontSize: "13px", color: "#1A1A1A" }}
                  >
                    <Editable value={d.type} onChange={set("type")} />
                  </div>
                </div>
              </div>

              {/* Polaroid (P2) – wider, clearer border */}
              <div
                className="absolute bg-white shadow-2xl transform rotate-[8deg] z-30"
                style={{
                  right: "-10px",
                  top: "57%",
                  transform: "translateY(-50%) rotate(8deg)",
                  padding: "5px",
                  paddingBottom: "26px",
                  width: "140px",
                  boxShadow: "2px 6px 20px rgba(0,0,0,0.32)",
                  border: "2.5px solid #fff",
                }}
              >
                <Photo
                  src={p2}
                  onLoad={setP2}
                  label="Poolbild"
                  className="w-full h-[112px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={downloadStory}
        disabled={downloading}
        style={{
          marginTop: 24,
          background: downloading ? "#1A3030" : "linear-gradient(135deg,#3D8A8F,#2C6E73)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "15px 48px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase" as const,
          cursor: downloading ? "not-allowed" : "pointer",
          boxShadow: downloading ? "none" : "0 8px 32px rgba(61,138,143,0.42)",
          fontFamily: SS,
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Download size={18} /> {downloading ? "Genererar..." : "Ladda ner (story)"}
      </button>
    </div>
  );
}
