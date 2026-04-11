"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Download, Camera } from "lucide-react";

// ── Luxury palette (mirrors Lyxery.md spec) ─────────────────────────
const GOLD_LIGHT = "#F1D27A";
const GOLD       = "#D4AF37";
const GOLD_DARK  = "#A8892A";
const GOLD_TEXT  = "#E5C76B";

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
  label,
  className,
  placeholderAlign = "center",
}: {
  src: string | null;
  onLoad: (src: string) => void;
  label: string;
  className?: string;
  /** where the "add image" placeholder sits inside the container */
  placeholderAlign?: "start" | "center" | "end";
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

  const alignClass =
    placeholderAlign === "start"
      ? "items-start pt-3"
      : placeholderAlign === "end"
      ? "items-end pb-3"
      : "items-center";

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
                Byt bild
              </span>
            </div>
          </div>
        </>
      ) : (
        <div
          className={`absolute inset-0 flex flex-col ${alignClass} justify-center gap-1.5 bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-yellow-200`}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-yellow-300/70 animate-pulse">
            <Camera size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {label}
            </span>
          </div>
          <span className="text-[8px] text-yellow-200/70 uppercase tracking-wider">
            Klicka för att ladda upp
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
export default function Lyxery() {
  const [d, setD] = useState({
    brand: "LUXURY_ESTATES_SPAIN",
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
  // TEMP PREVIEW — remove when done editing
  const [preview, setPreview] = useState<string | null>(null);

  // Load Cormorant Garamond + Montserrat fonts for UI preview
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;500&display=swap";
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
        ]);
        await document.fonts.load("700 99px 'Cormorant Garamond'");
        await document.fonts.load("300 48px 'Montserrat'");
        await document.fonts.load("400 48px 'Montserrat'");
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
        loadImg("/house-icon.svg"), loadImg("/bed-icon.svg"), loadImg("/shower-icon.svg"),
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
      const cardW = 880;
      const cardH = 840;
      const cardX = (W - cardW) / 2;  // 100
      const cardY = (H - cardH) / 2;  // 540

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
      // Canvas has no native backdrop-filter, so we snapshot everything drawn
      // so far (P1/P2 + gradients + brand), blur it, and paint it inside the
      // card area. Then we layer a white tint + top shine on top.
      {
        const snapshot = document.createElement("canvas");
        snapshot.width = W;
        snapshot.height = H;
        snapshot.getContext("2d")!.drawImage(canvas, 0, 0);

        ctx.save();
        roundRect(cardX, cardY, cardW, cardH, 30);
        ctx.clip();

        // 1. Blurred background — just the blur, no colour tint
        ctx.filter = "blur(10px)";
        ctx.drawImage(snapshot, 0, 0);
        ctx.filter = "none";

        // 4. Top glass shine
        const shineGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
        shineGrad.addColorStop(0, "rgba(255,255,255,0.22)");
        shineGrad.addColorStop(0.22, "rgba(255,255,255,0.08)");
        shineGrad.addColorStop(0.5, "rgba(255,255,255,0.03)");
        shineGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = shineGrad;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // 5. Very subtle inner glow
        ctx.shadowColor = "rgba(255, 240, 210, 0.18)";
        ctx.shadowBlur = 30;
        ctx.fillStyle = "rgba(255,255,255,0.02)";
        ctx.fillRect(cardX, cardY, cardW, cardH);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        // 6. White outer outline
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.lineWidth = 2;
        roundRect(cardX, cardY, cardW, cardH, 30);
        ctx.stroke();

        ctx.restore();
      }

      // ── Inner content border (gold gradient, matches the price) ──
      const innerInset = 50;
      ctx.save();
      const innerBorderGrad = ctx.createLinearGradient(
        cardX + innerInset,
        cardY + innerInset,
        cardX + cardW - innerInset,
        cardY + cardH - innerInset
      );
      innerBorderGrad.addColorStop(0, GOLD_LIGHT);
      innerBorderGrad.addColorStop(0.5, GOLD_TEXT);
      innerBorderGrad.addColorStop(1, GOLD_DARK);
      ctx.strokeStyle = innerBorderGrad;
      ctx.lineWidth = 6;
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
      const titleText = d.title.toUpperCase();
      const titleY = cardY + 250;
      ctx.font = `700 118px ${TITLE_FONT}`;
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;
      ctx.fillText(titleText, W / 2, titleY);
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      // ── Ref ──
      ctx.font = `400 32px ${SS}`;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(d.ref, W / 2, titleY + 48);

      // ── Price – gold gradient text ──
      const priceText = d.price;
      ctx.save();
      ctx.translate(W / 2, titleY + 170);
      ctx.font = `700 118px ${TITLE_FONT}`;
      const priceMetrics = ctx.measureText(priceText);
      const priceW = priceMetrics.width;
      const priceGrad = ctx.createLinearGradient(-priceW / 2, 0, priceW / 2, 0);
      priceGrad.addColorStop(0, GOLD_LIGHT);
      priceGrad.addColorStop(0.5, GOLD_TEXT);
      priceGrad.addColorStop(1, GOLD_DARK);
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = priceGrad;
      ctx.fillText(priceText, 0, 0);
      ctx.restore();

      // ── Stats 2x2 grid ──
      const dividerY = titleY + 220; // anchor Y for the stats rows (divider removed)
      const svgIconMap: Record<string, HTMLImageElement | null> = {
        bed: bedImg, bath: showerImg, home: houseImg, pin: positionImg,
      };
      const ICON_SIZE = 72;

      function drawIcon(cx: number, cy: number, type: string) {
        const img = svgIconMap[type];
        if (!img || !img.naturalWidth) return;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const iconH = ICON_SIZE;
        const iconW = iconH * aspectRatio;

        const pad = 4;
        const off = document.createElement("canvas");
        off.width  = Math.ceil(iconW + pad * 2);
        off.height = Math.ceil(iconH + pad * 2);
        const octx = off.getContext("2d")!;
        octx.drawImage(img, pad, pad, iconW, iconH);
        octx.globalCompositeOperation = "source-in";
        octx.fillStyle = GOLD;
        octx.fillRect(0, 0, off.width, off.height);
        ctx.drawImage(off, cx - off.width / 2, cy - off.height / 2);
      }

      // Balanced 2x2 grid: split card usable area into two even columns
      const gridPad   = 120;                       // horizontal padding inside card
      const gridLeftX  = cardX + gridPad;          // left column icon X (icon center)
      const gridRightX = cardX + cardW / 2 + 70;   // right column icon X
      const row1Y      = dividerY + 100;
      const row2Y      = dividerY + 200;
      const labelGap   = 55;                        // distance from icon center to text start

      ctx.font = `400 52px ${SS}`;
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

  // TEMP PREVIEW — debounced live re-render of the real canvas
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const url = await renderCanvas();
      if (!cancelled && url) setPreview(url);
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [renderCanvas]);

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

  // Gold gradient text for CSS preview
  const goldGradientText: React.CSSProperties = {
    background: `linear-gradient(145deg, ${GOLD_LIGHT}, ${GOLD_TEXT}, ${GOLD_DARK})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <div className="min-h-screen bg-[#0b1220] flex flex-col items-center py-10 px-4 font-sans text-white">
      <div className="text-center mb-8">
        <h2 className="text-yellow-400 font-bold tracking-[0.3em] text-[10px] uppercase">
          Lyxery
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Klicka på text eller bildrutor för att ändra
        </p>
      </div>

      {/* TEMP PREVIEW — side-by-side container, remove when done */}
      <div className="flex gap-6 items-start">

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
            label="+ Lägg till bild 1"
            className="w-full h-full"
            placeholderAlign="start"
          />
        </div>

        {/* P2 — bottom half background */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-0">
          <Photo
            src={p2}
            onLoad={setP2}
            label="+ Lägg till bild 2"
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

        {/* Info card – centered, overlapping midpoint */}
        <div
          className="absolute left-[16px] right-[16px] top-[125px] bottom-[125px] z-10 rounded-[20px] overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.25)",
          }}
        >
          {/* Top shine highlight */}
          <div
            className="absolute inset-x-0 top-0 h-[40%] rounded-t-[20px] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0) 100%)",
            }}
          />

          {/* Inner content border — gold gradient via mask trick */}
          <div
            className="absolute rounded-[14px] pointer-events-none"
            style={{
              top: 14,
              left: 14,
              right: 14,
              bottom: 14,
              padding: 3,
              background: `linear-gradient(145deg, ${GOLD_LIGHT}, ${GOLD_TEXT}, ${GOLD_DARK})`,
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <div className="relative h-full flex flex-col items-center justify-center px-6 py-5 text-center">
            {/* FOR SALE */}
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: "40px",
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
              className="mt-1"
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <Editable value={d.ref} onChange={set("ref")} />
            </div>

            {/* Price – gold gradient */}
            <div
              className="mt-3"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: "40px",
                lineHeight: 1,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                ...goldGradientText,
              }}
            >
              <Editable value={d.price} onChange={set("price")} />
            </div>

            {/* Stats 2x2 grid */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-2 mt-1">
              {[
                { src: "/bed-icon.svg",      val: d.beds,     k: "beds" as const },
                { src: "/shower-icon.svg",   val: d.baths,    k: "baths" as const },
                { src: "/house-icon.svg",    val: d.type,     k: "type" as const },
                { src: "/position-icon.svg", val: d.location, k: "location" as const },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <img
                    src={item.src}
                    width={22}
                    height={22}
                    alt=""
                    className="shrink-0"
                    style={{
                      objectFit: "contain",
                      // Gold tint via CSS filter chain
                      filter:
                        "brightness(0) saturate(100%) invert(76%) sepia(41%) saturate(545%) hue-rotate(2deg) brightness(92%) contrast(88%)",
                    }}
                  />
                  <div
                    className="font-semibold"
                    style={{ fontSize: 15, color: "#ffffff" }}
                  >
                    <Editable value={item.val} onChange={set(item.k)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* TEMP PREVIEW — live canvas render */}
      <div className="flex flex-col items-center">
        <div className="text-yellow-400 font-bold tracking-[0.3em] text-[9px] uppercase mb-2">
          Live canvas (exact export)
        </div>
        {preview ? (
          <img
            src={preview}
            alt="live canvas preview"
            className="w-[360px] h-[640px] rounded-xl shadow-2xl border-[6px] border-yellow-700 object-contain bg-black"
          />
        ) : (
          <div className="w-[360px] h-[640px] rounded-xl border-[6px] border-yellow-700 bg-black/50 flex items-center justify-center text-slate-500 text-xs">
            Genererar…
          </div>
        )}
      </div>

      </div>
      {/* /TEMP PREVIEW container */}

      <button
        onClick={downloadStory}
        disabled={downloading}
        style={{
          marginTop: 24,
          background: downloading
            ? "#2a1f00"
            : `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`,
          color: "#1a1205",
          border: "none",
          borderRadius: 8,
          padding: "15px 48px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase" as const,
          cursor: downloading ? "not-allowed" : "pointer",
          boxShadow: downloading ? "none" : "0 8px 32px rgba(212,175,55,0.4)",
          fontFamily: SS,
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Download size={18} /> {downloading ? "Genererar..." : "Ladda ner (lyxery)"}
      </button>
    </div>
  );
}
