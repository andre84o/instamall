"use client";

import React, { useState, useRef } from "react";
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

  const set = (k: keyof typeof d) => (v: string) =>
    setD((prev) => ({ ...prev, [k]: v }));

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
              className="w-full h-full object-cover blur-md scale-110 opacity-40"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-sky-100 to-white" />
          )}
          <div className="absolute top-4 right-6 text-green-700/20 text-4xl">
            🌿
          </div>
          <div className="absolute bottom-4 left-6 text-green-700/20 text-4xl rotate-180">
            🌿
          </div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="pt-10 pb-4 text-center">
            <h1 className="flex items-center justify-center gap-2 text-2xl font-serif tracking-[0.15em] text-slate-700 drop-shadow-sm">
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
              className="w-full aspect-[1.6/1] rounded-lg shadow-lg border-[4px] border-white"
            />
          </div>

          {/* Info Card – nedflyttad, semi-transparent, tunn border */}
          <div className="px-5 mt-4 flex-1 pb-10">
            <div className="bg-white/65 backdrop-blur-sm rounded-lg p-5 shadow-lg h-fit relative border border-slate-200/50">
              <div className="text-center mb-3">
                <div className="text-slate-400 text-[9px] font-medium mb-1 tracking-tight">
                  <Editable value={d.ref} onChange={set("ref")} />
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  Price: <Editable value={d.price} onChange={set("price")} />
                </div>
                <div className="h-[1px] w-full bg-slate-200/60 my-3" />
              </div>

              {/* Stats */}
              <div className="space-y-2 pb-3">
                {[
                  { icon: MapPin, val: d.location, k: "location" as const },
                  { icon: Bed, val: d.beds, k: "beds" as const },
                  { icon: Bath, val: d.baths, k: "baths" as const },
                  { icon: Square, val: d.area, k: "area" as const },
                  { icon: Home, val: d.type, k: "type" as const },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <item.icon size={14} strokeWidth={1.5} className="text-sky-700 shrink-0" />
                    <div className="text-xs font-semibold text-slate-700 tracking-tight">
                      <Editable value={item.val} onChange={set(item.k)} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Polaroid (P2) – raka kanter, smalare border, större bild */}
              <div className="absolute -right-2 top-[45%] -translate-y-1/2 mt-[45px] w-32 bg-white p-[3px] pb-5 shadow-2xl transform rotate-[6deg] border-[3px] border-white z-30">
                <Photo
                  src={p2}
                  onLoad={setP2}
                  label="Poolbild"
                  className="w-full h-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        style={{
          marginTop: 24,
          background: 'linear-gradient(135deg,#3D8A8F,#2C6E73)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '15px 48px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: 'uppercase' as const,
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(61,138,143,0.42)',
          fontFamily: SS,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Download size={18} /> Ladda ner 1080 × 1920 px
      </button>
    </div>
  );
}
