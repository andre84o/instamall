"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Sparkles,
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

      const [img1, img2, houseImg, bedImg, showerImg, positionImg, sizeImg, palmImg] = await Promise.all([
        loadImg(p1), loadImg(p2),
        loadImg('/house-icon.svg'), loadImg('/bed-icon.svg'), loadImg('/shower-icon.svg'),
        loadImg('/position-icon.svg'), loadImg('/size-icon.svg'),
        loadImg('/palm-overlay.png'),
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

      // Stats rows with SVG icons
      const svgIconMap: Record<string, HTMLImageElement | null> = {
        pin: positionImg, bed: bedImg, bath: showerImg, square: sizeImg,
      };
      function drawIcon(cx: number, cy: number, type: string) {
        const img = svgIconMap[type];
        if (img) {
          const sz = 44;
          ctx.drawImage(img, cx - sz / 2, cy - sz / 2, sz, sz);
          return;
        }
        // home
        if (type === "home" && houseImg) {
          const s = 22;
          const iw = s * 2.4, ih = iw * (433 / 600);
          ctx.drawImage(houseImg, cx - iw / 2, cy - ih / 2, iw, ih);
        }
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

      // Palm overlay (top-left + bottom-right mirrored)
      if (palmImg) {
        const palmW = Math.round(W * 0.65);
        const palmH = Math.round(palmW * (palmImg.height / palmImg.width));
        // Top-left
        ctx.drawImage(palmImg, 0, 0, palmW, palmH);
        // Bottom-right (mirrored 180deg)
        ctx.save();
        ctx.translate(W, H);
        ctx.rotate(Math.PI);
        ctx.drawImage(palmImg, 0, 0, palmW, palmH);
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

        {/* Palm overlay top-left */}
        <img
          src="/palm-overlay.png"
          className="absolute top-0 left-0 w-[65%] pointer-events-none z-20"
          alt=""
        />
        {/* Palm overlay bottom-right (rotated 180deg) */}
        <img
          src="/palm-overlay.png"
          className="absolute bottom-0 right-0 w-[65%] pointer-events-none z-20 rotate-180"
          alt=""
        />

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
                  { src: "/position-icon.svg", val: d.location, k: "location" as const },
                  { src: "/bed-icon.svg", val: d.beds, k: "beds" as const },
                  { src: "/shower-icon.svg", val: d.baths, k: "baths" as const },
                  { src: "/size-icon.svg", val: d.area, k: "area" as const },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <img src={item.src} width={18} height={18} style={{ objectFit: "contain" }} alt="" className="shrink-0" />
                    <div className="text-xs font-semibold text-slate-700 tracking-tight">
                      <Editable value={item.val} onChange={set(item.k)} />
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2.5">
                  <HouseIcon size={18} className="text-black shrink-0" />
                  <div className="text-xs font-semibold text-slate-700 tracking-tight">
                    <Editable value={d.type} onChange={set("type")} />
                  </div>
                </div>
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
