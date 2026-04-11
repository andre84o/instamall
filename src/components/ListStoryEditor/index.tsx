"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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

// ── Palm frond decorations (UI preview) ─────────────────────────────
// Two fronds per component: one angled more downward, one more sideways.
// Left leaflets extend off-canvas and are clipped by the card's overflow:hidden.
function PalmDecorTopLeft() {
  return (
    <svg
      width="130" height="165"
      viewBox="-20 -20 150 185"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0 z-20 pointer-events-none"
      style={{ opacity: 0.93 }}
    >
      {/* Frond 1 – stem going down-right from corner */}
      <path d="M0,0 Q12,75 46,165" stroke="#1B4332" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Right leaflets */}
      <path d="M7,26 Q26,19 43,7 Q24,14 7,26Z" fill="#2D6A4F"/>
      <path d="M12,52 Q32,45 50,33 Q31,40 12,52Z" fill="#40916C"/>
      <path d="M20,82 Q40,76 58,64 Q39,71 20,82Z" fill="#52B788"/>
      <path d="M32,114 Q50,109 67,98 Q49,104 32,114Z" fill="#40916C"/>
      {/* Left leaflets (extend off edge – clipped) */}
      <path d="M6,25 Q-11,18 -24,8 Q-13,17 6,25Z" fill="#1B4332"/>
      <path d="M11,51 Q-7,44 -20,35 Q-9,43 11,51Z" fill="#2D6A4F"/>
      <path d="M19,81 Q3,75 -10,67 Q1,74 19,81Z" fill="#1B4332"/>

      {/* Frond 2 – stem going right from corner */}
      <path d="M0,12 Q52,22 130,70" stroke="#2D6A4F" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Upper leaflets */}
      <path d="M30,16 Q36,2 48,-5 Q38,5 30,16Z" fill="#40916C"/>
      <path d="M60,25 Q66,11 78,4 Q68,14 60,25Z" fill="#52B788"/>
      <path d="M90,38 Q96,24 108,17 Q98,27 90,38Z" fill="#40916C"/>
      {/* Lower leaflets */}
      <path d="M29,17 Q35,30 44,36 Q36,27 29,17Z" fill="#2D6A4F"/>
      <path d="M59,26 Q65,39 74,45 Q66,36 59,26Z" fill="#2D6A4F"/>
      <path d="M89,39 Q95,52 104,58 Q96,49 89,39Z" fill="#1B4332"/>
    </svg>
  );
}

function PalmDecorBottomRight() {
  return (
    <svg
      width="130" height="165"
      viewBox="-20 -20 150 185"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 right-0 z-20 pointer-events-none"
      style={{ opacity: 0.93, transform: "rotate(180deg)" }}
    >
      {/* Same paths as top-left – rotation mirrors into bottom-right corner */}
      <path d="M0,0 Q12,75 46,165" stroke="#1B4332" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M7,26 Q26,19 43,7 Q24,14 7,26Z" fill="#2D6A4F"/>
      <path d="M12,52 Q32,45 50,33 Q31,40 12,52Z" fill="#40916C"/>
      <path d="M20,82 Q40,76 58,64 Q39,71 20,82Z" fill="#52B788"/>
      <path d="M32,114 Q50,109 67,98 Q49,104 32,114Z" fill="#40916C"/>
      <path d="M6,25 Q-11,18 -24,8 Q-13,17 6,25Z" fill="#1B4332"/>
      <path d="M11,51 Q-7,44 -20,35 Q-9,43 11,51Z" fill="#2D6A4F"/>
      <path d="M19,81 Q3,75 -10,67 Q1,74 19,81Z" fill="#1B4332"/>
      <path d="M0,12 Q52,22 130,70" stroke="#2D6A4F" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M30,16 Q36,2 48,-5 Q38,5 30,16Z" fill="#40916C"/>
      <path d="M60,25 Q66,11 78,4 Q68,14 60,25Z" fill="#52B788"/>
      <path d="M90,38 Q96,24 108,17 Q98,27 90,38Z" fill="#40916C"/>
      <path d="M29,17 Q35,30 44,36 Q36,27 29,17Z" fill="#2D6A4F"/>
      <path d="M59,26 Q65,39 74,45 Q66,36 59,26Z" fill="#2D6A4F"/>
      <path d="M89,39 Q95,52 104,58 Q96,49 89,39Z" fill="#1B4332"/>
    </svg>
  );
}

// Include Segoe UI for better Windows rendering consistency with browser UI
const SS = "'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif";
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

  // Load Cinzel font for UI preview
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap";
    document.head.appendChild(link);
    return () => { if (link.parentNode) link.parentNode.removeChild(link); };
  }, []);

  const set = (k: keyof typeof d) => (v: string) =>
    setD((prev) => ({ ...prev, [k]: v }));

  const downloadStory = useCallback(async () => {
    setDownloading(true);
    try {
      // Load Cinzel font for canvas rendering
      try {
        if (!document.fonts.check("bold 12px Cinzel")) {
          const font = new FontFace(
            "Cinzel",
            "url(https://fonts.gstatic.com/s/cinzel/v23/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnTQ.woff2)"
          );
          const loaded = await font.load();
          document.fonts.add(loaded);
          await document.fonts.ready;
        }
      } catch (e) {
        console.warn("Cinzel font load failed:", e);
      }

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

      const [img1, img2, houseImg, bedImg, showerImg, positionImg, sizeImg] = await Promise.all([
        loadImg(p1), loadImg(p2),
        loadImg("/house-icon.svg"), loadImg("/bed-icon.svg"), loadImg("/shower-icon.svg"),
        loadImg("/position-icon.svg"), loadImg("/size-icon.svg"),
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

      // ── Palm leaf helpers ──
      // Draws a single narrow pointed leaflet from base (bx,by) to tip (tx,ty)
      function drawLeaflet(bx: number, by: number, tx: number, ty: number, color: string) {
        const dx = tx - bx, dy = ty - by;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 2) return;
        const nx = -dy / len, ny = dx / len; // left normal
        const halfW = len * 0.09;
        const mx = (bx + tx) / 2, my = (by + ty) / 2;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(mx + nx * halfW, my + ny * halfW, tx, ty);
        ctx.quadraticCurveTo(mx - nx * halfW, my - ny * halfW, bx, by);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }

      // Draws a palm frond: curved stem with paired leaflets along it.
      // Leaflets that extend off canvas are automatically clipped.
      function drawPalmFrond(
        sx: number, sy: number,    // stem start (near corner)
        cpx: number, cpy: number,  // bezier control point
        ex: number, ey: number,    // stem end (into image)
        stemColor: string,
        leftColor: string, rightColor: string,
        stemW: number,
        maxLeafLen: number,
        numPairs: number,
        alpha: number
      ) {
        ctx.save();
        ctx.globalAlpha = alpha;

        // Stem
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(cpx, cpy, ex, ey);
        ctx.strokeStyle = stemColor;
        ctx.lineWidth = stemW;
        ctx.lineCap = "round";
        ctx.stroke();

        // Leaflet pairs at evenly-spaced t values along the bezier
        for (let i = 1; i <= numPairs; i++) {
          const t = i / (numPairs + 1);
          // Point on quadratic bezier
          const bx = (1-t)*(1-t)*sx + 2*(1-t)*t*cpx + t*t*ex;
          const by = (1-t)*(1-t)*sy + 2*(1-t)*t*cpy + t*t*ey;
          // Tangent direction
          const tdx = 2*(1-t)*(cpx-sx) + 2*t*(ex-cpx);
          const tdy = 2*(1-t)*(cpy-sy) + 2*t*(ey-cpy);
          const tlen = Math.sqrt(tdx*tdx + tdy*tdy);
          const nx = -tdy / tlen, ny = tdx / tlen; // left normal
          // Leaf length: sinusoidal peak in the middle of the frond
          const ll = maxLeafLen * (0.15 + 0.85 * Math.sin(t * Math.PI));

          drawLeaflet(bx, by, bx + nx * ll, by + ny * ll, leftColor);
          drawLeaflet(bx, by, bx - nx * ll, by - ny * ll, rightColor);
        }
        ctx.restore();
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

      // ── Palm fronds – top-left corner ──
      // Frond 1: diagonal, going down-right
      drawPalmFrond(0, 0, 80, 350, 210, 720, "#1B4332", "#2D6A4F", "#40916C", 22, 290, 5, 0.90);
      // Frond 2: more horizontal, going right
      drawPalmFrond(0, 50, 260, 130, 660, 290, "#2D6A4F", "#40916C", "#52B788", 18, 250, 5, 0.85);
      // Frond 3: steeper, from top edge
      drawPalmFrond(90, 0, 210, 210, 360, 600, "#40916C", "#52B788", "#74C69D", 15, 210, 4, 0.78);

      // ── Palm fronds – bottom-right corner (mirrored) ──
      drawPalmFrond(W, H, W-80, H-350, W-210, H-720, "#1B4332", "#2D6A4F", "#40916C", 22, 290, 5, 0.90);
      drawPalmFrond(W, H-50, W-260, H-130, W-660, H-290, "#2D6A4F", "#40916C", "#52B788", 18, 250, 5, 0.85);
      drawPalmFrond(W-90, H, W-210, H-210, W-360, H-600, "#40916C", "#52B788", "#74C69D", 15, 210, 4, 0.78);

      // ── Title "NEW LISTING!" with Cinzel ──
      const titleText = d.title.toUpperCase();
      const titleY = 195;
      const CINZEL = `Cinzel, ${SF}`;

      ctx.textAlign = "center";
      ctx.font = `bold 92px ${CINZEL}`;
      const titleMetricsW = ctx.measureText(titleText).width;
      const titleCenterX = W / 2 - 50;

      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = "#F2F2EE";
      ctx.fillText(titleText, titleCenterX, titleY);

      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      ctx.strokeStyle = "#7A7A7A";
      ctx.lineWidth = 1.5;
      ctx.strokeText(titleText, titleCenterX, titleY);

      ctx.font = "68px serif";
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("✨", titleCenterX + titleMetricsW / 2 + 36, titleY - 4);

      // ── Hero image (aspect 1.6:1, rounded) ──
      const heroX = 70, heroY = 275, heroW = W - 140, heroH = Math.round(heroW / 1.6);
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

      // ── Info card: white semi-transparent, rounded 20px ──
      // Position kept exactly as before
      const cardX = 100, cardW = W - 200;
      const cardY = heroY + heroH + 70;
      const cardH = 860;

      ctx.shadowColor = "rgba(0,0,0,0.14)";
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      roundRect(cardX, cardY, cardW, cardH, 20);
      ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      // ── Ref – light gray, small, discrete ──
      ctx.font = `400 34px ${SS}`;
      ctx.fillStyle = "#999999";
      ctx.textAlign = "center";
      ctx.fillText(d.ref, cardX + cardW / 2, cardY + 62);

      // ── Price – black, serif, NO underline ──
      const priceText = "Price: " + d.price;
      ctx.font = `700 74px ${SF}`;
      ctx.fillStyle = "#1A1A1A";
      ctx.textAlign = "center";
      ctx.fillText(priceText, cardX + cardW / 2, cardY + 150);

      // ── Divider ──
      ctx.fillStyle = "rgba(180,180,180,0.60)";
      ctx.fillRect(cardX + 30, cardY + 185, cardW - 60, 1.5);

      // ── Stats rows: icons with natural aspect ratio, text vertically centered ──
      const svgIconMap: Record<string, HTMLImageElement | null> = {
        pin: positionImg, bed: bedImg, bath: showerImg, square: sizeImg, home: houseImg,
      };

      // Draw icon preserving natural aspect ratio at a fixed height
      function drawIcon(cx: number, cy: number, type: string) {
        const img = svgIconMap[type];
        if (!img) return;
        const iconH = 82;
        // Use naturalWidth/naturalHeight to preserve aspect ratio; fall back to 1:1
        const ratio = (img.naturalWidth > 0 && img.naturalHeight > 0)
          ? img.naturalWidth / img.naturalHeight
          : 1;
        const iconW = iconH * ratio;
        ctx.drawImage(img, cx - iconW / 2, cy - iconH / 2, iconW, iconH);
      }

      const statsData = [
        { label: d.location, iconType: "pin" },
        { label: d.beds,     iconType: "bed" },
        { label: d.baths,    iconType: "bath" },
        { label: d.area,     iconType: "square" },
        { label: d.type,     iconType: "home" },
      ];

      // Use textBaseline "middle" so text center aligns with icon center
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      let sy = cardY + 268;
      statsData.forEach(({ label, iconType }) => {
        drawIcon(cardX + 62, sy, iconType);          // icon centered at sy
        ctx.font = `600 50px ${SS}`;
        ctx.fillStyle = "#1A1A1A";
        ctx.fillText(label, cardX + 118, sy);        // text middle at sy
        sy += 100;
      });
      ctx.textBaseline = "alphabetic"; // reset

      // ── Polaroid (photo 2): positioned just below the divider ──
      // polY set so the top of the frame is just below cardY+185 (the divider line)
      if (img2) {
        ctx.save();
        const frameW = 390, frameH = 470, pad = 14, bottomPad = 90;
        const polX = cardX + cardW - 330, polY = cardY + 200;
        ctx.translate(polX, polY);
        ctx.rotate(8 * Math.PI / 180);

        ctx.shadowColor = "rgba(0,0,0,0.32)";
        ctx.shadowBlur = 32;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 12;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, frameW, frameH);
        ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

        const pw = frameW - pad * 2, ph = frameH - pad - bottomPad;
        ctx.save();
        ctx.beginPath();
        ctx.rect(pad, pad, pw, ph);
        ctx.clip();
        const ps = Math.max(pw / img2.width, ph / img2.height);
        ctx.drawImage(
          img2,
          pad + (pw - img2.width * ps) / 2,
          pad + (ph - img2.height * ps) / 2,
          img2.width * ps, img2.height * ps
        );
        ctx.restore();
        ctx.restore();
      }

      // ── Download ──
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

      {/*
        ── Story Canvas ──
        Outer div is 400×711px (wider than before).
        Inner content is 360×640px scaled up via CSS transform to fill the outer shell.
        This preserves all internal pixel values (padding, font sizes, etc.)
        while making the visible preview card wider.
      */}
      <div
        id="story-canvas"
        className="relative rounded-xl shadow-2xl border-[6px] border-slate-800"
        style={{ width: "400px", height: "711px", overflow: "hidden" }}
      >
        {/* Scaled inner shell – 360×640 scaled to 400×711 */}
        <div style={{
          width: "360px",
          height: "640px",
          transformOrigin: "top left",
          transform: `scale(${400 / 360})`,
          position: "absolute",
          top: 0,
          left: 0,
        }}>
          {/* Palm decorations */}
          <PalmDecorTopLeft />
          <PalmDecorBottomRight />

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

          {/* Content layer */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header – Cinzel, off-white, letter-spaced */}
            <div className="pt-9 pb-3 text-center">
              <h1
                className="flex items-center justify-center gap-1.5 drop-shadow-md"
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "19px",
                  letterSpacing: "0.12em",
                  color: "#F2F2EE",
                  WebkitTextStroke: "0.4px #7A7A7A",
                  textTransform: "uppercase",
                }}
              >
                <Editable value={d.title} onChange={set("title")} center />
                <Sparkles className="text-amber-400 h-4 w-4 shrink-0" />
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
            {/* Position kept exactly as before */}
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
                    style={{ color: "#999999" }}
                  >
                    <Editable value={d.ref} onChange={set("ref")} />
                  </div>
                  {/* Price – black, serif, NO underline */}
                  <div
                    className="font-bold tracking-tight"
                    style={{
                      fontFamily: SF,
                      fontSize: "22px",
                      color: "#1A1A1A",
                    }}
                  >
                    Price: <Editable value={d.price} onChange={set("price")} />
                  </div>
                  <div className="h-[0.8px] w-full bg-gray-300/70 my-1.5" />
                </div>

                {/* Stats – icons 28px, text 13px, vertically centered */}
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
                        height={28}
                        style={{ objectFit: "contain", filter: "brightness(0) saturate(100%) invert(16%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(25%)" }}
                        alt=""
                        className="shrink-0"
                      />
                      <div
                        className="font-semibold tracking-tight leading-none"
                        style={{ fontSize: "13px", color: "#1A1A1A" }}
                      >
                        <Editable value={item.val} onChange={set(item.k)} />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#3A3A3A" }} className="shrink-0 flex">
                      <HouseIcon size={28} />
                    </span>
                    <div
                      className="font-semibold tracking-tight leading-none"
                      style={{ fontSize: "13px", color: "#1A1A1A" }}
                    >
                      <Editable value={d.type} onChange={set("type")} />
                    </div>
                  </div>
                </div>

                {/* Polaroid (P2) – positioned below the divider line */}
                <div
                  className="absolute bg-white z-30"
                  style={{
                    right: "-28px",
                    top: "62%",
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
        <Download size={18} /> {downloading ? "Genererar..." : "Ladda ner 1080 × 1920 px"}
      </button>
    </div>
  );
}
