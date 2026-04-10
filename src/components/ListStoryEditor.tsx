"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Sparkles,
  MapPin,
  Bed,
  Bath,
  Square,
  Home,
  Download,
  Camera,
} from "lucide-react";

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
      className={`cursor-pointer hover:bg-sky-50 rounded px-1 transition-all ${className}`}
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

  const set = (k: keyof typeof d) => (v: string) =>
    setD((prev) => ({ ...prev, [k]: v }));

  const downloadStory = useCallback(async () => {
    setDownloading(true);
    try {
      const W = 1080, H = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      const loadImg = (src: string | null): Promise<HTMLImageElement | null> =>
        new Promise((res) => {
          if (!src) { res(null); return; }
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = () => res(null);
          img.src = src;
        });

      const [img1, img2] = await Promise.all([loadImg(p1), loadImg(p2)]);

      function roundRect(x: number, y: number, w: number, h: number, r: number) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      // Background: light base + blurred p2
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


      // Header: NEW LISTING! ✨
      ctx.font = `italic 90px ${SF}`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 12;
      ctx.fillText(d.title, W / 2 - 30, 200);
      ctx.shadowBlur = 0;
      ctx.font = "60px serif";
      ctx.fillStyle = "#f59e0b";
      const titleW = ctx.measureText(d.title).width;
      ctx.fillText("✨", W / 2 + titleW / 2 + 10, 190);

      // Hero image (aspect 1.6:1, no border, rounded)
      const heroX = 70, heroY = 270, heroW = W - 140, heroH = Math.round(heroW / 1.6);
      if (img1) {
        ctx.save();
        roundRect(heroX, heroY, heroW, heroH, 24);
        ctx.clip();
        const s = Math.max(heroW / img1.width, heroH / img1.height);
        ctx.drawImage(img1, heroX + (heroW - img1.width * s) / 2, heroY + (heroH - img1.height * s) / 2, img1.width * s, img1.height * s);
        ctx.restore();
      } else {
        ctx.fillStyle = "#b0cccc";
        roundRect(heroX, heroY, heroW, heroH, 24); ctx.fill();
      }

      // Info card (matches bg-gray-200/75, border-black/20)
      const cardX = 130, cardW = W - 260;
      const cardY = heroY + heroH + 80;
      const cardH = 740;
      ctx.fillStyle = "rgba(210,215,215,0.75)";
      roundRect(cardX, cardY, cardW, cardH, 18); ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.20)"; ctx.lineWidth = 2;
      roundRect(cardX, cardY, cardW, cardH, 18); ctx.stroke();

      // Ref
      ctx.font = `400 30px ${SS}`;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.textAlign = "center";
      ctx.fillText(d.ref, cardX + cardW / 2, cardY + 55);

      // Price
      ctx.font = `900 76px ${SS}`;
      ctx.fillStyle = "#0f172a";
      ctx.fillText("Price: " + d.price, cardX + cardW / 2, cardY + 145);

      // Divider
      ctx.fillStyle = "rgba(120,120,120,0.45)";
      ctx.fillRect(cardX + 30, cardY + 170, cardW - 60, 1.5);

      // Stats rows with drawn icons
      function drawIcon(cx: number, cy: number, type: string) {
        ctx.save();
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "none";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const s = 22; // icon half-size
        if (type === "pin") {
          // MapPin
          ctx.beginPath();
          ctx.arc(cx, cy - 4, s * 0.55, Math.PI, 0);
          ctx.lineTo(cx, cy + s * 0.8);
          ctx.closePath(); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy - 4, 4, 0, Math.PI * 2); ctx.stroke();
        } else if (type === "bed") {
          // Bed
          ctx.beginPath();
          ctx.moveTo(cx - s, cy - 2); ctx.lineTo(cx - s, cy + s * 0.6);
          ctx.moveTo(cx + s, cy - 2); ctx.lineTo(cx + s, cy + s * 0.6);
          ctx.moveTo(cx - s, cy + 2); ctx.lineTo(cx + s, cy + 2);
          ctx.moveTo(cx - s, cy - 6); ctx.bezierCurveTo(cx - s * 0.3, cy - s, cx + s * 0.3, cy - s, cx + s, cy - 6);
          ctx.stroke();
        } else if (type === "bath") {
          // Bath/shower
          ctx.beginPath();
          ctx.moveTo(cx - s, cy); ctx.lineTo(cx + s, cy);
          ctx.moveTo(cx - s, cy); ctx.lineTo(cx - s, cy - s * 0.8);
          ctx.arc(cx - s * 0.5, cy - s * 0.8, s * 0.5, Math.PI, 0);
          ctx.moveTo(cx - s * 0.7, cy); ctx.lineTo(cx - s * 0.9, cy + s * 0.7);
          ctx.moveTo(cx + s * 0.7, cy); ctx.lineTo(cx + s * 0.9, cy + s * 0.7);
          ctx.stroke();
        } else if (type === "square") {
          // Square/area
          ctx.beginPath();
          ctx.rect(cx - s * 0.7, cy - s * 0.7, s * 1.4, s * 1.4);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.7, cy); ctx.lineTo(cx + s * 0.7, cy);
          ctx.moveTo(cx, cy - s * 0.7); ctx.lineTo(cx, cy + s * 0.7);
          ctx.stroke();
        } else if (type === "home") {
          // Home
          ctx.beginPath();
          ctx.moveTo(cx, cy - s * 0.8);
          ctx.lineTo(cx + s * 0.8, cy - 1);
          ctx.lineTo(cx + s * 0.8, cy + s * 0.7);
          ctx.lineTo(cx - s * 0.8, cy + s * 0.7);
          ctx.lineTo(cx - s * 0.8, cy - 1);
          ctx.closePath(); ctx.stroke();
        }
        ctx.restore();
      }

      const statsData = [
        { label: d.location, iconType: "pin" },
        { label: d.beds, iconType: "bed" },
        { label: d.baths, iconType: "bath" },
        { label: d.area, iconType: "square" },
        { label: d.type, iconType: "home" },
      ];
      ctx.textAlign = "left";
      let sy = cardY + 240;
      statsData.forEach(({ label, iconType }) => {
        drawIcon(cardX + 50, sy - 6, iconType);
        ctx.font = `600 40px ${SS}`;
        ctx.fillStyle = "#334155";
        ctx.fillText(label, cardX + 90, sy);
        sy += 75;
      });

      // Polaroid (photo 2) – straight edges, rotated 8deg
      if (img2) {
        ctx.save();
        const polX = cardX + cardW - 240, polY = cardY + 200;
        ctx.translate(polX, polY);
        ctx.rotate(8 * Math.PI / 180);
        // White frame
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 25; ctx.shadowOffsetY = 8;
        const frameW = 300, frameH = 380, pad = 8, bottomPad = 70;
        ctx.fillRect(0, 0, frameW, frameH);
        ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        // Photo inside
        const pw = frameW - pad * 2, ph = frameH - pad - bottomPad;
        ctx.beginPath(); ctx.rect(pad, pad, pw, ph); ctx.clip();
        const ps = Math.max(pw / img2.width, ph / img2.height);
        ctx.drawImage(img2, pad + (pw - img2.width * ps) / 2, pad + (ph - img2.height * ps) / 2, img2.width * ps, img2.height * ps);
        ctx.restore();
      }

      // Download
      const imageData = canvas.toDataURL("image/png");
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
  }, [d, p1, p2]);

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
        {/* BAKGRUND: Använder Foto 2 som suddig bakgrund om den finns */}
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
          {/* Header */}
          <div className="pt-10 pb-4 text-center">
            <h1 className="flex items-center justify-center gap-2 text-2xl font-serif tracking-[0.15em] text-white drop-shadow-md">
              <Editable value={d.title} onChange={set("title")} center />
              <Sparkles className="text-amber-400 h-5 w-5" />
            </h1>
          </div>

          {/* Huvudbild (P1) – bred, lite mer höjd */}
          <div className="px-4">
            <Photo
              src={p1}
              onLoad={setP1}
              label="Huvudbild"
              className="w-full aspect-[1.6/1] rounded-lg shadow-lg"
            />
          </div>

          {/* Info Card – nedflyttad, semi-transparent, tunn border */}
          <div className="px-11 mt-6 flex-1 pb-10">
            <div className="bg-gray-200/75 backdrop-blur-sm rounded-lg p-3 pt-[12px] pb-6 h-fit relative border border-black/20">
              <div className="text-center mb-3 -mt-2">
                <div className="text-black/70 text-[12px] mb-1 tracking-tight">
                  <Editable value={d.ref} onChange={set("ref")} />
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  Price: <Editable value={d.price} onChange={set("price")} />
                </div>
                <div className="h-[0.8px] w-[full] bg-gray-400/65 my-1" />
              </div>

              {/* Stats */}
              <div className="space-y-3 pb-3">
                {[
                  { icon: MapPin, val: d.location, k: "location" as const },
                  { icon: Bed, val: d.beds, k: "beds" as const },
                  { icon: Bath, val: d.baths, k: "baths" as const },
                  { icon: Square, val: d.area, k: "area" as const },
                  { icon: Home, val: d.type, k: "type" as const },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <item.icon size={18} strokeWidth={1.5} className="text-black shrink-0" />
                    <div className="text-xs font-semibold text-slate-700 tracking-tight">
                      <Editable value={item.val} onChange={set(item.k)} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Polaroid (P2) – raka kanter, smalare border, större bild */}
              <div className="absolute -right-6 top-[45%] -translate-y-1/2 mt-[40px] w-33 bg-white p-[5px] pb-7 shadow-2xl transform rotate-[8deg] border-[2.5px] border-white z-30">
                <Photo
                  src={p2}
                  onLoad={setP2}
                  label="Poolbild"
                  className="w-full h-29"
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
          background: downloading ? '#1A3030' : 'linear-gradient(135deg,#3D8A8F,#2C6E73)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '15px 48px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: 'uppercase' as const,
          cursor: downloading ? 'not-allowed' : 'pointer',
          boxShadow: downloading ? 'none' : '0 8px 32px rgba(61,138,143,0.42)',
          fontFamily: SS,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Download size={18} /> {downloading ? 'Genererar...' : 'Ladda ner 1080 × 1920 px'}
      </button>
    </div>
  );
}
