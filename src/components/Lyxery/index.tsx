"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Download, Camera } from "lucide-react";
import { GiHouse } from "react-icons/gi";
import { LuBath } from "react-icons/lu";

// Serialize a react-icons component to a data URL so it can be used both as
// a DOM <img> source and drawn on a Canvas via drawImage. react-icons does
// not emit an xmlns attribute by default, so we inject one.
function iconToDataUrl(node: React.ReactElement): string {
  let svg = renderToStaticMarkup(node);
  if (!svg.includes("xmlns=")) {
    svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const HOUSE_ICON_URL = iconToDataUrl(
  <GiHouse size={256} color="#ffffff" />
);

const BATH_ICON_URL = iconToDataUrl(
  <LuBath size={256} color="#ffffff" />
);

// ── Luxury palette — champagne gold (warmer, lighter) ──────────────
const GOLD_LIGHT = "#F0D48A";
const GOLD       = "#D9B968";
const GOLD_DARK  = "#B9913F";
const GOLD_TEXT  = "#D6B15C";

// Dedicated shades for the price text (vertical gradient: top → bottom)
const PRICE_GOLD_TOP    = "#F3D98F";
const PRICE_GOLD_MID    = "#D9B968";
const PRICE_GOLD_BOTTOM = "#B78735";

// Dedicated shades for the inner border (softer, less orange than main gold)
const BORDER_GOLD_LIGHT = "#E8CB7A";
const BORDER_GOLD       = "#D5B15A";
const BORDER_GOLD_DARK  = "#AF8738";

const SS = "'Montserrat','Helvetica Neue',Helvetica,Arial,sans-serif";
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
        className={`bg-yellow-100/10 border border-yellow-400 outline-none rounded px-1 text-inherit font-inherit ${center ? "text-center" : ""}`}
        style={{ width: `${Math.max(temp.length + 1, 2)}ch` }}
      />
    );
  }
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setTemp(value);
        setEditing(true);
      }}
      className={`cursor-pointer hover:bg-yellow-100/10 rounded px-1 transition-all ${className}`}
    >
      {value}
    </span>
  );
}

// ── Photo Zone ──────────────────────────────────────────────────────
function Photo({
  src,
  onLoad,
  onLoadSecondary,
  label,
  className,
  placeholderAlign = "center",
}: {
  src: string | null;
  onLoad: (src: string) => void;
  /** Optional — if provided, the file input allows multi-select and the
   *  second chosen file is routed here (used to pick P1 + P2 in one tap). */
  onLoadSecondary?: (src: string) => void;
  label: string;
  className?: string;
  /** where the "add image" placeholder sits inside the container */
  placeholderAlign?: "start" | "center" | "end";
}) {
  const ref = useRef<HTMLInputElement>(null);

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = (ev) => {
        if (ev.target?.result) resolve(ev.target.result as string);
        else reject(new Error("empty result"));
      };
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const [first, second] = [files[0], files[1]];
      if (first) onLoad(await readAsDataUrl(first));
      if (second && onLoadSecondary) {
        onLoadSecondary(await readAsDataUrl(second));
      }
    } catch (err) {
      console.warn("Photo upload failed:", err);
    } finally {
      // Reset so selecting the same file again still triggers onChange
      if (ref.current) ref.current.value = "";
    }
  };

  // In a flex-col container, justify-* controls VERTICAL alignment and
  // items-* controls HORIZONTAL. We want the upload badge centred horizontally
  // and pushed to the top (for P1) or bottom (for P2) so it never hides behind
  // the info card that covers the middle of the canvas.
  const alignClass =
    placeholderAlign === "start"
      ? "justify-start pt-[90px]"
      : placeholderAlign === "end"
      ? "justify-end pb-[90px]"
      : "justify-center";

  return (
    <div
      onClick={() => ref.current?.click()}
      className={`relative cursor-pointer overflow-hidden group bg-slate-800 ${className}`}
    >
      {src ? (
        <>
          <img src={src} className="w-full h-full object-cover" />
          {/* hover overlay to indicate image can be replaced */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 border border-yellow-300/60">
              <Camera size={12} className="text-yellow-200" />
              <span className="text-[9px] font-semibold text-yellow-200 uppercase tracking-wider">
                Change image
              </span>
            </div>
          </div>
        </>
      ) : (
        <div
          className={`absolute inset-0 flex flex-col items-center ${alignClass} gap-1.5 bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-yellow-200`}
        >
          <div className="flex items-center justify-center p-2 rounded-full bg-black/50 border border-yellow-300/70">
            <Camera size={16} />
          </div>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple={!!onLoadSecondary}
        className="hidden"
        onChange={handle}
      />
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
export default function Lyxery() {
  const [d, setD] = useState({
    brand: "CollectedHomes",
    title: "FOR SALE",
    ref: "Ref: 58272",
    price: "599.000€",
    beds: "4",
    baths: "4",
    type: "Villa",
    location: "Cabo Roig",
  });
  const [p1, setP1] = useState<string | null>(null);
  const [p2, setP2] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Load Cormorant Garamond + Montserrat + Raleway fonts for UI preview
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;500&family=Raleway:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => { if (link.parentNode) link.parentNode.removeChild(link); };
  }, []);

  const set = (k: keyof typeof d) => (v: string) =>
    setD((prev) => ({ ...prev, [k]: v }));

  const renderCanvas = useCallback(async (): Promise<string | null> => {
    try {
      // Robust font load — Cormorant Garamond 700 + Montserrat 300/400
      async function loadGoogleFont(family: string, weight: string) {
        const id = `${weight} 16px '${family}'`;
        if (document.fonts.check(id)) return;
        const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&display=swap`;
        const cssRes = await fetch(url);
        const css = await cssRes.text();
        const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
        if (match) {
          const font = new FontFace(family, `url(${match[1]}) format('woff2')`, {
            weight,
            style: "normal",
          });
          const loaded = await font.load();
          document.fonts.add(loaded);
        }
      }

      try {
        await Promise.all([
          loadGoogleFont("Cormorant Garamond", "700"),
          loadGoogleFont("Montserrat", "300"),
          loadGoogleFont("Montserrat", "400"),
          loadGoogleFont("Raleway", "500"),
          loadGoogleFont("Raleway", "600"),
          loadGoogleFont("Inter", "700"),
          loadGoogleFont("Inter", "800"),
        ]);
        await document.fonts.load("700 99px 'Cormorant Garamond'");
        await document.fonts.load("300 48px 'Montserrat'");
        await document.fonts.load("400 48px 'Montserrat'");
        await document.fonts.load("500 120px 'Raleway'");
        await document.fonts.load("600 120px 'Raleway'");
        await document.fonts.load("700 120px 'Inter'");
        await document.fonts.load("800 120px 'Inter'");
        await document.fonts.ready;
      } catch (e) {
        console.warn("Font load failed, using serif fallback:", e);
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

      const [img1, img2, houseImg, bedImg, showerImg, positionImg] = await Promise.all([
        loadImg(p1), loadImg(p2),
        loadImg(HOUSE_ICON_URL), loadImg("/bed-icon.svg"), loadImg(BATH_ICON_URL),
        loadImg("/position-icon.svg"),
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

      // ── Backgrounds: P1 top half, P2 bottom half ──
      ctx.fillStyle = "#0b1220";
      ctx.fillRect(0, 0, W, H);

      const halfH = H / 2;

      // P1 — top half
      if (img1) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, halfH);
        ctx.clip();
        const s1 = Math.max(W / img1.width, halfH / img1.height);
        ctx.drawImage(
          img1,
          (W - img1.width * s1) / 2,
          (halfH - img1.height * s1) / 2,
          img1.width * s1,
          img1.height * s1
        );
        ctx.restore();
      } else {
        ctx.fillStyle = "#1a2332";
        ctx.fillRect(0, 0, W, halfH);
      }

      // P2 — bottom half
      if (img2) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, halfH, W, halfH);
        ctx.clip();
        const s2 = Math.max(W / img2.width, halfH / img2.height);
        ctx.drawImage(
          img2,
          (W - img2.width * s2) / 2,
          halfH + (halfH - img2.height * s2) / 2,
          img2.width * s2,
          img2.height * s2
        );
        ctx.restore();
      } else {
        ctx.fillStyle = "#0f1823";
        ctx.fillRect(0, halfH, W, halfH);
      }

      // ── Clean snapshot taken BEFORE warm filter.
      // Used later by the card's frosted glass so the blurred background
      // INSIDE the card has no warm tint — only the outer P1/P2 areas do. ──
      const cleanSnapshot = document.createElement("canvas");
      cleanSnapshot.width = W;
      cleanSnapshot.height = H;
      cleanSnapshot.getContext("2d")!.drawImage(canvas, 0, 0);

      // ── Warm tone overlay — thin warm filter across both images ──
      // Uses "multiply" so it tints highlights + shadows naturally instead of
      // flattening them like a plain alpha fill would.
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(255, 205, 145, 0.18)";
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Subtle top darkening for brand text legibility
      const topGrad = ctx.createLinearGradient(0, 0, 0, 160);
      topGrad.addColorStop(0, "rgba(0,0,0,0.45)");
      topGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, 160);

      // ── Brand text top-left ──
      ctx.font = `600 32px ${SS}`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 8;
      ctx.fillText(d.brand, 55, 85);
      ctx.shadowBlur = 0;

      // ── Info card (glass, gold border) centered on midpoint ──
      const cardW = 820;
      const cardH = 750;
      const cardX = (W - cardW) / 2;  // 122
      const cardY = (H - cardH) / 2;  // 564

      // Outer depth shadow — filled with a transparent rect that only casts shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 20;
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      roundRect(cardX, cardY, cardW, cardH, 30);
      ctx.fill();
      ctx.restore();

      // ── Frosted glass effect ──
      // We use the CLEAN snapshot (captured before the warm filter) so the
      // blurred background inside the card stays neutral — no warm tint here.
      {
        ctx.save();
        roundRect(cardX, cardY, cardW, cardH, 30);
        ctx.clip();

        // 1. Suddig bakgrund — matchar CSS backdrop-filter: blur(18px)
        ctx.filter = "blur(18px)";
        ctx.drawImage(cleanSnapshot, 0, 0);
        ctx.filter = "none";

        // 2. Bas-slöja ovanpå den blurrade bakgrunden
        ctx.fillStyle = "rgba(103, 103, 103, 0.42)";
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // 3. Top glass shine — ljusare topp som fadar ut mot botten
        const shineGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
        shineGrad.addColorStop(0, "rgba(255,255,255,0.22)");
        shineGrad.addColorStop(0.22, "rgba(255,255,255,0.08)");
        shineGrad.addColorStop(0.5, "rgba(255,255,255,0.03)");
        shineGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = shineGrad;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // 4. Very subtle inner glow
        ctx.shadowColor = "rgba(255, 240, 210, 0.18)";
        ctx.shadowBlur = 30;
        ctx.fillStyle = "rgba(255,255,255,0.02)";
        ctx.fillRect(cardX, cardY, cardW, cardH);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        // 5. White outer outline
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.lineWidth = 2;
        roundRect(cardX, cardY, cardW, cardH, 30);
        ctx.stroke();

        ctx.restore();
      }

      // ── Inner content border (softer gold, less orange than main palette) ──
      const innerInset = 50;
      ctx.save();
      const innerBorderGrad = ctx.createLinearGradient(
        cardX + innerInset,
        cardY + innerInset,
        cardX + cardW - innerInset,
        cardY + cardH - innerInset
      );
      innerBorderGrad.addColorStop(0, BORDER_GOLD_LIGHT);
      innerBorderGrad.addColorStop(0.5, BORDER_GOLD);
      innerBorderGrad.addColorStop(1, BORDER_GOLD_DARK);
      ctx.strokeStyle = innerBorderGrad;
      ctx.lineWidth = 7;
      roundRect(
        cardX + innerInset,
        cardY + innerInset,
        cardW - innerInset * 2,
        cardH - innerInset * 2,
        18
      );
      ctx.stroke();
      ctx.restore();

      // ── FOR SALE title ──
      const TITLE_FONT = `'Cormorant Garamond', ${SF}`;
      const FOR_SALE_FONT = `'Raleway', ${SS}`;
      const PRICE_FONT = `'Inter', ${SS}`;
      const titleText = d.title.toUpperCase();
      const titleY = cardY + 200;
      ctx.font = `400 110px ${FOR_SALE_FONT}`;


      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 1;
      ctx.fillText(titleText, W / 2, titleY);
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      // ── Ref ──
      ctx.font = `400 36px ${SS}`;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(d.ref, W / 2, titleY + 64);

      // ── Price – vertical gold gradient text (top → bottom) ──
      const priceText = d.price;
      ctx.save();
      ctx.translate(W / 2, titleY + 185);
      ctx.font = `700 95px ${PRICE_FONT}`;
      // Vertical gradient across the glyph height (approx -60 to +20 local)
      const priceGrad = ctx.createLinearGradient(10, -100, 0, 10);
      priceGrad.addColorStop(0,    PRICE_GOLD_TOP);
      priceGrad.addColorStop(0.45, PRICE_GOLD_MID);
      priceGrad.addColorStop(1,    PRICE_GOLD_BOTTOM);
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 52;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = priceGrad;
      ctx.fillText(priceText, 0, 0);
      ctx.restore();

      // ── Stats 2x2 grid ──
      const dividerY = titleY + 190; // anchor Y for the stats rows (divider removed)
      const svgIconMap: Record<string, HTMLImageElement | null> = {
        bed: bedImg, bath: showerImg, home: houseImg, pin: positionImg,
      };
      // Base size if a specific icon isn't listed in ICON_SIZES
      const ICON_SIZE_DEFAULT = 72;

      // Per-icon height in px (canvas coords). Width is auto from aspect ratio.
      const ICON_SIZES: Record<string, number> = {
        bed:  110,
        bath: 92,
        home: 82,
        pin:  92,
      };

      // Per-icon bold (dilation) — 0 = normal, 1–3 = progressively thicker.
      // Tweak individually if some SVGs look too thin next to others.
      const ICON_BOLD: Record<string, number> = {
        bed:  0.5,
        bath: 0,
        home: 0,
        pin:  0.5,
      };

      function drawIcon(cx: number, cy: number, type: string) {
        const img = svgIconMap[type];
        if (!img || !img.naturalWidth) return;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const iconH = ICON_SIZES[type] ?? ICON_SIZE_DEFAULT;
        const iconW = iconH * aspectRatio;
        const bold = ICON_BOLD[type] ?? 0;

        const pad = 4 + bold * 2;
        const off = document.createElement("canvas");
        off.width  = Math.ceil(iconW + pad * 2);
        off.height = Math.ceil(iconH + pad * 2);
        const octx = off.getContext("2d")!;

        // Draw the SVG — optionally multiple times with offsets to dilate
        if (bold > 0) {
          for (let dx = -bold; dx <= bold; dx++) {
            for (let dy = -bold; dy <= bold; dy++) {
              octx.drawImage(img, pad + dx, pad + dy, iconW, iconH);
            }
          }
        } else {
          octx.drawImage(img, pad, pad, iconW, iconH);
        }

        octx.globalCompositeOperation = "source-in";

        // Gold gradient fill — exact match to the price text (vertical top → bottom)
        const iconGrad = octx.createLinearGradient(20, -40, 100, off.height);
        iconGrad.addColorStop(0,    PRICE_GOLD_TOP);
        iconGrad.addColorStop(0.45, PRICE_GOLD_MID);
        iconGrad.addColorStop(1,    PRICE_GOLD_BOTTOM);
        octx.fillStyle = iconGrad;
        octx.fillRect(0, 0, off.width, off.height);

        ctx.drawImage(off, cx - off.width / 2, cy - off.height / 2);
      }

      // Balanced 2x2 grid: split card usable area into two even columns
      const gridPad   = 190;                       // horizontal padding inside card
      const gridLeftX  = cardX + gridPad;          // left column icon X (icon center)
      const gridRightX = cardX + cardW / 2 + 50;   // right column icon X
      const row1Y      = dividerY + 100;
      const row2Y      = dividerY + 205;
      const labelGap   = 58;                        // distance from icon center to text start

      ctx.font = `400 38px ${SS}`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";

      drawIcon(gridLeftX, row1Y, "bed");
      ctx.fillText(d.beds, gridLeftX + labelGap, row1Y + 18);

      drawIcon(gridRightX, row1Y, "bath");
      ctx.fillText(d.baths, gridRightX + labelGap, row1Y + 18);

      drawIcon(gridLeftX, row2Y, "home");
      ctx.fillText(d.type, gridLeftX + labelGap, row2Y + 18);

      drawIcon(gridRightX, row2Y, "pin");
      ctx.fillText(d.location, gridRightX + labelGap, row2Y + 18);

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
        body: JSON.stringify({ imageData, filename: `lyxery_${d.ref.replace(/\s/g, "_")}.png` }),
      });
      if (!res.ok) { setDownloading(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `lyxery_${d.ref.replace(/\s/g, "_")}.png`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      console.error(err);
      setDownloading(false);
    }
  }, [renderCanvas, d.ref]);

  // Gold gradient text for CSS preview — vertical (top → bottom) to match
  // the canvas price rendering.
  const goldGradientText: React.CSSProperties = {
    backgroundImage: `linear-gradient(180deg, ${PRICE_GOLD_TOP} 0%, ${PRICE_GOLD_MID} 45%, ${PRICE_GOLD_BOTTOM} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <div className="flex flex-col items-center py-10 px-4 font-sans text-white w-full">
      <div className="text-center mb-8">
        <h2 className="text-sky-400 font-bold tracking-[0.3em] text-[10px] uppercase">
          Lyxery
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Click any text or image to edit
        </p>
      </div>

      {/* ── Story Canvas (1080x1920 ratio → 360x640 preview) ── */}
      <div
        id="story-canvas"
        className="relative w-[360px] h-[640px] bg-[#0b1220] rounded-xl shadow-2xl overflow-hidden border-[6px] border-slate-800"
      >
        {/* P1 — top half background */}
        <div className="absolute inset-x-0 top-0 h-1/2 z-0">
          <Photo
            src={p1}
            onLoad={setP1}
            onLoadSecondary={setP2}
            label="+ Add both images"
            className="w-full h-full"
            placeholderAlign="start"
          />
        </div>

        {/* P2 — bottom half background */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-0">
          <Photo
            src={p2}
            onLoad={setP2}
            label="+ Add bottom image"
            className="w-full h-full"
            placeholderAlign="end"
          />
        </div>

        {/* Top darkening gradient for brand legibility */}
        <div
          className="absolute inset-x-0 top-0 h-14 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* Brand text top-left */}
        <div
          className="absolute left-3 top-3 z-20 font-semibold tracking-wide"
          style={{
            fontSize: 11,
            color: "#ffffff",
            textShadow: "0 1px 4px rgba(0,0,0,0.55)",
          }}
        >
          <Editable value={d.brand} onChange={set("brand")} />
        </div>

        {/* Info card – centered, overlapping midpoint.
            Dimensions scaled from canvas (1080x1920 → 360x640 = 1/3):
            canvas cardW 880 / cardH 840 → CSS 294/280, inset 33/180. */}
        <div
          className="absolute left-[41px] right-[41px] top-[188px] bottom-[188px] z-10 rounded-[10px] overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow:
              "0 3px 10px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.22)",
          }}
        >
          {/* Top shine highlight */}
          <div
            className="absolute inset-x-0 top-0 h-[40%] rounded-t-[10px] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0) 100%)",
            }}
          />

          {/* Inner content border — gold gradient via mask trick.
              Scaled from canvas innerInset 50 / lineWidth 6 → CSS 17 / 2. */}
          <div
            className="absolute rounded-[6px] pointer-events-none"
            style={{
              top: 17,
              left: 17,
              right: 17,
              bottom: 17,
              padding: 2,
              background: `linear-gradient(145deg, ${BORDER_GOLD_LIGHT}, ${BORDER_GOLD}, ${BORDER_GOLD_DARK})`,
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Content uses top-anchored flow (not justify-center) so elements
              land at the same relative positions as the canvas output. */}
          <div className="relative h-full" style={{ paddingTop: 46 }}>
            {/* FOR SALE */}
            <div
              className="text-center"
              style={{
                fontFamily: "'Raleway', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 400,
                fontSize: "38px",
                lineHeight: 1,
                color: "#ffffff",
                textShadow: "0 2px 10px rgba(0,0,0,0.45)",
                letterSpacing: "0.02em",
              }}
            >
              <Editable value={d.title} onChange={set("title")} center />
            </div>

            {/* Ref */}
            <div
              className="text-center"
              style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.85)" }}
            >
              <Editable value={d.ref} onChange={set("ref")} />
            </div>

            {/* Price – vertical gold gradient */}
            <div
              className="text-center"
              style={{
                marginTop: 12,
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 700,
                fontSize: "34px",
                lineHeight: 1,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              <span style={goldGradientText}>
                <Editable value={d.price} onChange={set("price")} />
              </span>
            </div>

            {/* Stats 2x2 — fixed 2-column grid so row 1 icons align exactly
                above row 2 icons (matches canvas gridLeftX / gridRightX).
                Cells are auto-width and items left-justified inside them. */}
            <div
              className="grid gap-y-3"
              style={{
                marginTop: 10,
                gridTemplateColumns: "auto auto",
                columnGap: 24,
                justifyContent: "center",
              }}
            >
              {[
                { src: "/bed-icon.svg",      val: d.beds,     k: "beds" as const },
                { src: BATH_ICON_URL,        val: d.baths,    k: "baths" as const },
                { src: HOUSE_ICON_URL,       val: d.type,     k: "type" as const },
                { src: "/position-icon.svg", val: d.location, k: "location" as const },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 justify-self-start">
                  <div
                    className="shrink-0"
                    style={{
                      width: 24,
                      height: 24,
                      backgroundImage: `linear-gradient(180deg, ${PRICE_GOLD_TOP} 0%, ${PRICE_GOLD_MID} 45%, ${PRICE_GOLD_BOTTOM} 100%)`,
                      WebkitMaskImage: `url(${item.src})`,
                      maskImage: `url(${item.src})`,
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontWeight: 400,
                      fontSize: 12,
                      color: "#ffffff",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Editable value={item.val} onChange={set(item.k)} />
                  </div>
                </div>
              ))}
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
        <Download size={18} /> {downloading ? "Generating..." : "Download (lyxery)"}
      </button>
    </div>
  );
}
