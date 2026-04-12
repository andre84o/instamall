"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Download, Camera } from "lucide-react";

const SS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

// Navy + cream palette
const NAVY       = "#0A1F3D";
const NAVY_DEEP  = "#050F24";
const CREAM      = "#F7F3EA";
const CREAM_DIM  = "#C8C1B0";
const ACCENT     = "#E8B84F";

type StoryData = {
  title: string;
  location: string;
  price: string;
  beds: string;
  baths: string;
  area: string;
  ref: string;
  brand: string;
};

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
        className={`bg-white/10 border border-white/60 outline-none rounded px-1 text-inherit font-inherit ${center ? "text-center" : ""}`}
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
      className={`cursor-pointer hover:bg-white/10 rounded px-1 transition-all ${className ?? ""}`}
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
      className={`relative cursor-pointer overflow-hidden group bg-slate-800 ${className ?? ""}`}
    >
      {src ? (
        <>
          <img src={src} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 border border-white/60">
              <Camera size={12} className="text-white" />
              <span className="text-[9px] font-semibold text-white uppercase tracking-wider">
                Change image
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-white/80">
          <div className="flex items-center justify-center p-2 rounded-full bg-black/50 border border-white/70">
            <Camera size={16} />
          </div>
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

// ── Canvas helpers ──────────────────────────────────────────────────
function loadImage(src: string | null): Promise<HTMLImageElement | null> {
  return new Promise((res) => {
    if (!src) { res(null); return; }
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

async function loadGoogleFont(family: string, weight: string) {
  const id = `${weight} 16px '${family}'`;
  if (document.fonts.check(id)) return;
  try {
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
  } catch (e) {
    console.warn(`${family} ${weight} font load failed:`, e);
  }
}

// ── Main Component ──────────────────────────────────────────
export default function Architectural() {
  const [data, setData] = useState<StoryData>({
    title: "FOR SALE",
    location: "Punta Prima",
    price: "229.500€",
    beds: "2",
    baths: "2",
    area: "67m²",
    ref: "Ref: 58272",
    brand: "COLLECTEDHOMES",
  });
  const [p1, setP1] = useState<string | null>(null);
  const [p2, setP2] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const set = (k: keyof StoryData) => (v: string) =>
    setData((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display:wght@400&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return () => { if (link.parentNode) link.parentNode.removeChild(link); };
  }, []);

  const renderCanvas = useCallback(async (): Promise<string | null> => {
    try {
      await Promise.all([
        loadGoogleFont("DM Serif Display", "400"),
        loadGoogleFont("Inter", "300"),
        loadGoogleFont("Inter", "500"),
        loadGoogleFont("Inter", "600"),
      ]);
      await document.fonts.ready;

      const W = 1080, H = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      const [img1, img2] = await Promise.all([loadImage(p1), loadImage(p2)]);

      ctx.fillStyle = NAVY_DEEP;
      ctx.fillRect(0, 0, W, H);

      const splitX1 = 0, splitY1 = H * 0.58;
      const splitX2 = W, splitY2 = H * 0.32;

      // P1 clipped to top polygon
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(W, 0);
      ctx.lineTo(splitX2, splitY2);
      ctx.lineTo(splitX1, splitY1);
      ctx.closePath();
      ctx.clip();
      if (img1) {
        const targetW = W, targetH = H * 0.6;
        const s = Math.max(targetW / img1.width, targetH / img1.height);
        ctx.drawImage(img1, (W - img1.width * s) / 2, (targetH - img1.height * s) / 2, img1.width * s, img1.height * s);
      } else {
        ctx.fillStyle = "#1a2a44";
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();

      // P2 clipped to bottom polygon
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(splitX1, splitY1);
      ctx.lineTo(splitX2, splitY2);
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.clip();
      if (img2) {
        const targetH2 = H * 0.55;
        const s2 = Math.max(W / img2.width, targetH2 / img2.height);
        ctx.drawImage(img2, (W - img2.width * s2) / 2, H - targetH2 + (targetH2 - img2.height * s2) / 2, img2.width * s2, img2.height * s2);
      } else {
        ctx.fillStyle = NAVY;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();

      // Diagonal accent line
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(splitX1, splitY1);
      ctx.lineTo(splitX2, splitY2);
      ctx.stroke();

      // Very light overlay
      const overlay = ctx.createLinearGradient(0, 0, 0, H);
      overlay.addColorStop(0, "rgba(10, 31, 61, 0.18)");
      overlay.addColorStop(0.12, "rgba(0, 0, 0, 0)");
      overlay.addColorStop(0.88, "rgba(0, 0, 0, 0)");
      overlay.addColorStop(1, "rgba(5, 15, 36, 0.28)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, W, H);

      // Brand top
      ctx.fillStyle = CREAM;
      ctx.font = `500 26px 'Inter', ${SS}`;
      ctx.textAlign = "left";
      ctx.fillText(data.brand, 80, 110);

      // Ref top-right
      ctx.textAlign = "right";
      ctx.font = `400 22px 'Inter', ${SS}`;
      ctx.fillStyle = CREAM_DIM;
      ctx.fillText(data.ref, W - 80, 110);

      // Oversized location
      ctx.textAlign = "left";
      ctx.fillStyle = CREAM;
      ctx.font = `400 180px 'DM Serif Display', serif`;
      const locText = data.location.toUpperCase();
      const maxTextW = W - 160;
      const locY = 820;
      if (ctx.measureText(locText).width <= maxTextW) {
        ctx.fillText(locText, 80, locY);
      } else {
        const words = locText.split(" ");
        const lines: string[] = [];
        let current = "";
        for (const w of words) {
          const test = current ? `${current} ${w}` : w;
          if (ctx.measureText(test).width > maxTextW && current) {
            lines.push(current);
            current = w;
          } else {
            current = test;
          }
        }
        if (current) lines.push(current);
        lines.forEach((line, i) => {
          ctx.fillText(line, 80, locY + i * 180);
        });
      }

      // Rule under location
      ctx.strokeStyle = CREAM;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, locY + 60);
      ctx.lineTo(W - 80, locY + 60);
      ctx.stroke();

      // Title under location
      ctx.font = `500 24px 'Inter', ${SS}`;
      ctx.fillStyle = CREAM_DIM;
      ctx.fillText(data.title.toUpperCase(), 80, locY + 110);

      // Price + specs bottom
      const bottomY = H - 250;
      ctx.fillStyle = CREAM;
      ctx.font = `400 110px 'DM Serif Display', serif`;
      ctx.textAlign = "left";
      ctx.fillText(data.price, 80, bottomY);

      ctx.font = `500 28px 'Inter', ${SS}`;
      ctx.fillStyle = CREAM_DIM;
      ctx.textAlign = "right";
      ctx.fillText(`${data.beds} BEDS · ${data.baths} BATHS · ${data.area}`, W - 80, bottomY);

      // Bottom accent line
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, H - 100);
      ctx.lineTo(240, H - 100);
      ctx.stroke();

      return canvas.toDataURL("image/png");
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [data, p1, p2]);

  const downloadStory = useCallback(async () => {
    setDownloading(true);
    try {
      const imageData = await renderCanvas();
      if (!imageData) { setDownloading(false); return; }
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, filename: `architectural_${data.ref.replace(/\s/g, "_")}.png` }),
      });
      if (!res.ok) { setDownloading(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `architectural_${data.ref.replace(/\s/g, "_")}.png`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      console.error(err);
      setDownloading(false);
    }
  }, [renderCanvas, data.ref]);

  return (
    <div className="flex flex-col items-center py-10 px-4 font-sans text-white w-full">
      <div className="text-center mb-8">
        <h2 className="text-sky-400 font-bold tracking-[0.3em] text-[10px] uppercase">
          Architectural
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Click any text or image to edit
        </p>
      </div>

      <div
        className="relative w-[360px] h-[640px] rounded-xl shadow-2xl overflow-hidden border-[6px] border-slate-800"
        style={{ background: NAVY_DEEP }}
      >
        {/* P1 top area */}
        <div className="absolute inset-x-0 top-0 z-0" style={{ height: "58%" }}>
          <Photo src={p1} onLoad={setP1} label="Main image" className="w-full h-full" />
        </div>

        {/* P2 bottom area */}
        <div className="absolute inset-x-0 bottom-0 z-0" style={{ height: "44%" }}>
          <Photo src={p2} onLoad={setP2} label="Background" className="w-full h-full" />
        </div>

        {/* Diagonal accent line */}
        <div className="absolute inset-x-0 z-10" style={{ top: "56%", height: 1.5, background: ACCENT }} />

        {/* Light gradient overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(10,31,61,0.18) 0%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 88%, rgba(5,15,36,0.28) 100%)",
          }}
        />

        {/* Brand top-left */}
        <div className="absolute z-20" style={{ top: 20, left: 20, fontFamily: `'Inter', ${SS}`, fontWeight: 500, fontSize: 10, letterSpacing: "0.12em", color: CREAM }}>
          <Editable value={data.brand} onChange={set("brand")} />
        </div>
        <div className="absolute z-20" style={{ top: 20, right: 20, fontFamily: `'Inter', ${SS}`, fontWeight: 400, fontSize: 9, color: CREAM_DIM }}>
          <Editable value={data.ref} onChange={set("ref")} />
        </div>

        {/* Oversized location */}
        <div className="absolute z-20" style={{ top: 255, left: 20, right: 20, fontFamily: `'DM Serif Display', serif`, fontWeight: 400, fontSize: 56, lineHeight: 0.95, color: CREAM }}>
          <Editable value={data.location.toUpperCase()} onChange={set("location")} />
        </div>
        <div className="absolute z-20" style={{ top: 336, left: 20, right: 20, height: 0.5, background: CREAM }} />
        <div className="absolute z-20" style={{ top: 344, left: 20, fontFamily: `'Inter', ${SS}`, fontWeight: 500, fontSize: 10, letterSpacing: "0.1em", color: CREAM_DIM }}>
          <Editable value={data.title.toUpperCase()} onChange={set("title")} />
        </div>

        {/* Price + specs bottom */}
        <div className="absolute z-20" style={{ bottom: 50, left: 20, fontFamily: `'DM Serif Display', serif`, fontWeight: 400, fontSize: 32, lineHeight: 1, color: CREAM }}>
          <Editable value={data.price} onChange={set("price")} />
        </div>
        <div className="absolute z-20" style={{ bottom: 60, right: 20, fontFamily: `'Inter', ${SS}`, fontWeight: 500, fontSize: 10, color: CREAM_DIM }}>
          <Editable value={data.beds} onChange={set("beds")} /> BEDS
          <span className="mx-1">·</span>
          <Editable value={data.baths} onChange={set("baths")} /> BATHS
          <span className="mx-1">·</span>
          <Editable value={data.area} onChange={set("area")} />
        </div>

        {/* Bottom accent */}
        <div className="absolute z-20" style={{ bottom: 20, left: 20, width: 60, height: 1.5, background: ACCENT }} />
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
        <Download size={18} /> {downloading ? "Generating..." : "Download (architectural)"}
      </button>
    </div>
  );
}
