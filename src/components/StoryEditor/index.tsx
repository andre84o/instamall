"use client";

import { useState, useRef, useCallback } from "react";

const TEAL = "#3D8A8F";
const TEALD = "#2C6E73";
const WHITE = "#FFFFFF";
const BG = "#F6FAFA";
const DARK = "#1A2626";
const MUTED = "#7A9696";
const PH_C = "#5A9EA3";
const SF = "Georgia,'Times New Roman',serif";
const SS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

// ── Icons ────────────────────────────────────────────────────────────────────

function BedIcon() {
  return <img src="/bed-icon.svg" width={26} height={18} style={{ objectFit: "contain" }} alt="" />;
}

function BathIcon() {
  return <img src="/shower-icon.svg" width={20} height={20} style={{ objectFit: "contain" }} alt="" />;
}

function AreaIcon() {
  return <img src="/size-icon.svg" width={20} height={20} style={{ objectFit: "contain" }} alt="" />;
}

function CamIcon() {
  return (
    <svg
      width="32"
      height="29"
      viewBox="0 0 40 36"
      fill="none"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="8" width="36" height="26" rx="3" />
      <circle cx="20" cy="21" r="7" />
      <path d="M14 8l2.5-5h7L26 8" />
      <circle
        cx="33"
        cy="13"
        r="1.8"
        fill="rgba(255,255,255,0.85)"
        stroke="none"
      />
    </svg>
  );
}

// ── Editable field ────────────────────────────────────────────────────────────

interface EditableProps {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
  center?: boolean;
}

function Editable({ value, onChange, style, center }: EditableProps) {
  const [on, setOn] = useState(false);
  const [v, setV] = useState(value);

  const commit = () => {
    onChange(v);
    setOn(false);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    setV((prev) => prev + text);
  };

  if (on) {
    return (
      <input
        autoFocus
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setV(value);
            setOn(false);
          }
        }}
        onPaste={handlePaste}
        style={{
          ...style,
          textAlign: center ? "center" : "left",
          background: "rgba(255,255,255,0.18)",
          border: "1.5px solid rgba(61,138,143,0.5)",
          borderRadius: 3,
          outline: "none",
          padding: "1px 4px",
          margin: "-1px -4px",
          minWidth: 20,
          width: `${Math.max((v || "").length + 1, 3)}ch`,
          fontFamily: "inherit",
          fontSize: "inherit",
          color: "inherit",
          fontWeight: "inherit",
          letterSpacing: "inherit",
          fontStyle: "inherit",
          lineHeight: "inherit",
          boxSizing: "content-box",
        }}
      />
    );
  }

  return (
    <span
      onClick={() => {
        setV(value);
        setOn(true);
      }}
      title="Klicka för att redigera"
      style={{
        ...style,
        cursor: "pointer",
        textAlign: center ? "center" : "left",
        display: center ? "block" : "inline",
        borderRadius: 2,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.outline = "2px dashed rgba(61,138,143,0.4)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.outline = "none")}
    >
      {value}
    </span>
  );
}

// ── Photo zone ────────────────────────────────────────────────────────────────

interface PhotoProps {
  src: string | null;
  onLoad: (src: string) => void;
  style?: React.CSSProperties;
  label: string;
  sub?: string;
}

function Photo({ src, onLoad, style, label, sub }: PhotoProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      if (ev.target?.result) onLoad(ev.target.result as string);
    };
    r.readAsDataURL(f);
    e.target.value = "";
  };

  return (
    <div
      onClick={() => ref.current?.click()}
      style={{
        overflow: "hidden",
        cursor: "pointer",
        background: src ? `url(${src}) center/cover no-repeat` : PH_C,
        position: "relative",
        ...style,
      }}
    >
      {!src && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <CamIcon />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: SS,
                fontSize: 8,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              {label}
            </div>
            {sub && (
              <div
                style={{
                  fontFamily: SS,
                  fontSize: 6,
                  color: "rgba(255,255,255,0.65)",
                  letterSpacing: 1,
                }}
              >
                {sub}
              </div>
            )}
          </div>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}

// ── Canvas helpers ────────────────────────────────────────────────────────────

function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

interface DesignData {
  badge: string;
  ref: string;
  location: string;
  title: string;
  price: string;
  beds: string;
  baths: string;
  area: string;
  tagline: string;
}

async function buildCanvas(
  d: DesignData,
  p1src: string | null,
  p2src: string | null,
): Promise<HTMLCanvasElement> {
  const W = 1080,
    H = 1920;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;

  const loadImg = (src: string | null): Promise<HTMLImageElement | null> =>
    new Promise((res) => {
      if (!src) return res(null);
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = src;
    });

  const [i1, i2] = await Promise.all([loadImg(p1src), loadImg(p2src)]);

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Hero
  const HERO = 830;
  if (i1) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, HERO);
    ctx.clip();
    const s = Math.max(W / i1.width, HERO / i1.height);
    ctx.drawImage(
      i1,
      (W - i1.width * s) / 2,
      (HERO - i1.height * s) / 2,
      i1.width * s,
      i1.height * s,
    );
    const g = ctx.createLinearGradient(0, 0, 0, HERO);
    g.addColorStop(0, "rgba(26,38,38,0.55)");
    g.addColorStop(0.3, "rgba(26,38,38,0.02)");
    g.addColorStop(0.65, "rgba(26,38,38,0.00)");
    g.addColorStop(1, "rgba(26,38,38,0.88)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, HERO);
    ctx.restore();
  } else {
    ctx.fillStyle = PH_C;
    ctx.fillRect(0, 0, W, HERO);
  }

  // Badge
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.strokeStyle = "rgba(255,255,255,0.40)";
  ctx.lineWidth = 1.5;
  rr(ctx, 52, 52, 310, 62, 31);
  ctx.fill();
  ctx.stroke();
  ctx.font = `600 23px ${SS}`;
  ctx.fillStyle = WHITE;
  ctx.textAlign = "center";
  ctx.fillText(d.badge.toUpperCase(), 52 + 155, 92);

  // REF background
  ctx.font = `300 23px ${SS}`;
  const refW = ctx.measureText(d.ref).width + 40;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  rr(ctx, W - 52 - refW, 52, refW, 62, 31);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.80)";
  ctx.textAlign = "center";
  ctx.fillText(d.ref, W - 52 - refW / 2, 92);

  // Location
  ctx.beginPath();
  ctx.arc(62, HERO - 208, 8, 0, Math.PI * 2);
  ctx.fillStyle = TEAL;
  ctx.fill();
  ctx.font = `300 29px ${SS}`;
  ctx.fillStyle = "rgba(255,255,255,0.80)";
  ctx.textAlign = "left";
  ctx.fillText(d.location, 82, HERO - 198);

  // Title
  const words = d.title.split(" ");
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 28;
  ctx.font = `300 105px ${SF}`;
  ctx.fillStyle = WHITE;
  ctx.textAlign = "left";
  ctx.fillText(words[0] || "", 52, HERO - 95);
  if (words.length > 1) {
    const w0 = ctx.measureText((words[0] || "") + " ").width;
    ctx.font = `bold 105px ${SF}`;
    ctx.fillStyle = "#D4EDEF";
    ctx.fillText(words.slice(1).join(" "), 52 + w0, HERO - 95);
  }
  ctx.shadowBlur = 0;

  // Teal strip
  ctx.fillStyle = TEAL;
  ctx.fillRect(0, HERO, W, 5);
  const IY = HERO + 5;

  // Price label
  ctx.font = `300 25px ${SS}`;
  ctx.fillStyle = MUTED;
  ctx.textAlign = "left";
  ctx.fillText("PRICE", 60, IY + 66);

  // Price
  ctx.font = `bold 108px ${SF}`;
  ctx.fillStyle = DARK;
  ctx.textAlign = "left";
  ctx.fillText(d.price, 54, IY + 178);

  // Stats card
  const SY = IY + 214,
    SW = W - 104,
    SH = 162;
  ctx.fillStyle = WHITE;
  ctx.shadowColor = "rgba(61,138,143,0.10)";
  ctx.shadowBlur = 24;
  rr(ctx, 52, SY, SW, SH, 16);
  ctx.fill();
  ctx.shadowBlur = 0;
  const CW = SW / 3;
  (
    [
      [d.beds, "BEDS"],
      [d.baths, "BATHS"],
      [d.area, "AREA"],
    ] as [string, string][]
  ).forEach(([v, l], i) => {
    const cx = 52 + i * CW + CW / 2;
    ctx.font = `bold 68px ${SF}`;
    ctx.fillStyle = TEAL;
    ctx.textAlign = "center";
    ctx.fillText(v, cx, SY + 100);
    ctx.font = `300 22px ${SS}`;
    ctx.fillStyle = MUTED;
    ctx.fillText(l, cx, SY + 134);
    if (i < 2) {
      ctx.fillStyle = "rgba(61,138,143,0.14)";
      ctx.fillRect(52 + (i + 1) * CW - 1, SY + 28, 2, SH - 56);
    }
  });

  // Photo 2
  const P2Y = SY + SH + 32,
    P2W = W - 104,
    P2H = H - P2Y - 72;
  if (i2) {
    ctx.save();
    rr(ctx, 52, P2Y, P2W, P2H, 20);
    ctx.clip();
    const s2 = Math.max(P2W / i2.width, P2H / i2.height);
    ctx.drawImage(
      i2,
      52 + (P2W - i2.width * s2) / 2,
      P2Y + (P2H - i2.height * s2) / 2,
      i2.width * s2,
      i2.height * s2,
    );
    ctx.restore();
  } else {
    ctx.fillStyle = PH_C;
    rr(ctx, 52, P2Y, P2W, P2H, 20);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(61,138,143,0.18)";
  ctx.lineWidth = 2;
  rr(ctx, 52, P2Y, P2W, P2H, 20);
  ctx.stroke();

  // Footer
  ctx.font = `300 22px ${SS}`;
  ctx.fillStyle = MUTED;
  ctx.textAlign = "center";
  ctx.fillText(d.tagline, W / 2, H - 26);

  return cv;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StoryEditor() {
  const [d, setD] = useState<DesignData>({
    badge: "New Listing",
    ref: "REF 58272",
    location: "Punta Prima, Spain",
    title: "Modern Bungalow",
    price: "229.500 €",
    beds: "2",
    baths: "2",
    area: "67 m²",
    tagline: "One agent · Several options",
  });
  const [p1, setP1] = useState<string | null>(null);
  const [p2, setP2] = useState<string | null>(null);
  const [st, setSt] = useState<"idle" | "loading" | "done" | "error">("idle");

  const set = (k: keyof DesignData) => (v: string) =>
    setD((x) => ({ ...x, [k]: v }));

  const dl = useCallback(async () => {
    setSt("loading");
    try {
      const cv = await buildCanvas(d, p1, p2);
      cv.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "story.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSt("done");
        setTimeout(() => setSt("idle"), 3000);
      }, "image/png");
    } catch {
      setSt("error");
      setTimeout(() => setSt("idle"), 3000);
    }
  }, [d, p1, p2]);

  const PW = 300;
  const PH = Math.round((300 * 1920) / 1080);
  const HPX = Math.round((PH * 830) / 1920);

  const heroGradient = p1
    ? "linear-gradient(to bottom,rgba(26,38,38,0.52) 0%,rgba(26,38,38,0.02) 30%,rgba(26,38,38,0.00) 62%,rgba(26,38,38,0.85) 100%)"
    : "rgba(0,0,0,0.25)";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#091212",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px 64px",
        fontFamily: SS,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            color: TEAL,
            fontSize: 10,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 5,
          }}
        >
          CollectedHomes · Story Editor
        </div>
        <div
          style={{
            color: "#2A4040",
            fontSize: 9,
            letterSpacing: 1,
            lineHeight: 1.8,
          }}
        >
          ✏️ Klicka på text för att redigera
          <br />
          📷 Klicka på bildrutorna för att ladda upp foto
        </div>
      </div>

      {/* Story card */}
      <div
        style={{
          width: PW,
          height: PH,
          borderRadius: 16,
          overflow: "hidden",
          background: BG,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          boxShadow:
            "0 0 0 1px rgba(61,138,143,0.35), 0 40px 80px rgba(0,0,0,0.85)",
        }}
      >
        {/* Hero */}
        <div style={{ height: HPX, position: "relative", flexShrink: 0 }}>
          <Photo
            src={p1}
            onLoad={setP1}
            label="Klicka för foto 1"
            sub="Fastighetens exteriör"
            style={{ position: "absolute", inset: 0, zIndex: 0 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              background: heroGradient,
            }}
          />

          {/* Badge + REF */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              right: 10,
              zIndex: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.40)",
                borderRadius: 20,
                padding: "3px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "auto",
              }}
            >
              <Editable
                value={d.badge}
                onChange={set("badge")}
                center
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  color: WHITE,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: SS,
                }}
              />
            </div>
            <div
              style={{
                pointerEvents: "auto",
                background: "rgba(0,0,0,0.35)",
                borderRadius: 10,
                padding: "3px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Editable
                value={d.ref}
                onChange={set("ref")}
                center
                style={{
                  fontSize: 7,
                  color: "rgba(255,255,255,0.80)",
                  letterSpacing: 2,
                  fontFamily: SS,
                  textAlign: "center",
                }}
              />
            </div>
          </div>

          {/* Location + Title */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 11,
              right: 11,
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 2,
                pointerEvents: "auto",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: TEAL,
                  flexShrink: 0,
                }}
              />
              <Editable
                value={d.location}
                onChange={set("location")}
                style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.78)",
                  letterSpacing: 1,
                  fontFamily: SS,
                  fontWeight: 300,
                }}
              />
            </div>
            <div style={{ pointerEvents: "auto" }}>
              <Editable
                value={d.title}
                onChange={set("title")}
                style={{
                  fontFamily: SF,
                  fontSize: 22,
                  fontWeight: 300,
                  color: WHITE,
                  lineHeight: 1.05,
                }}
              />
            </div>
          </div>
        </div>

        {/* Teal strip */}
        <div style={{ height: 3, background: TEAL, flexShrink: 0 }} />

        {/* Info */}
        <div
          style={{
            flex: 1,
            background: BG,
            padding: "7px 11px 4px",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            overflow: "hidden",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 6,
                color: MUTED,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 1,
                fontFamily: SS,
              }}
            >
              Price
            </div>
            <Editable
              value={d.price}
              onChange={set("price")}
              style={{
                fontFamily: SF,
                fontSize: 25,
                fontWeight: "bold",
                color: DARK,
              }}
            />
          </div>

          {/* Stats */}
          <div
            style={{
              background: WHITE,
              borderRadius: 9,
              padding: "5px 0",
              display: "grid",
              gridTemplateColumns: "1fr 1.5px 1fr 1.5px 1fr",
              boxShadow: "0 2px 14px rgba(61,138,143,0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                padding: "3px 0",
              }}
            >
              <BedIcon />
              <Editable
                value={d.beds}
                onChange={set("beds")}
                center
                style={{
                  fontFamily: SF,
                  fontSize: 15,
                  fontWeight: "bold",
                  color: DARK,
                  textAlign: "center",
                }}
              />
              <div
                style={{
                  fontSize: 5,
                  color: MUTED,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: SS,
                }}
              >
                Beds
              </div>
            </div>
            <div style={{ background: "rgba(61,138,143,0.13)" }} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                padding: "3px 0",
              }}
            >
              <BathIcon />
              <Editable
                value={d.baths}
                onChange={set("baths")}
                center
                style={{
                  fontFamily: SF,
                  fontSize: 15,
                  fontWeight: "bold",
                  color: DARK,
                  textAlign: "center",
                }}
              />
              <div
                style={{
                  fontSize: 5,
                  color: MUTED,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: SS,
                }}
              >
                Baths
              </div>
            </div>
            <div style={{ background: "rgba(61,138,143,0.13)" }} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                padding: "3px 0",
              }}
            >
              <AreaIcon />
              <Editable
                value={d.area}
                onChange={set("area")}
                center
                style={{
                  fontFamily: SF,
                  fontSize: 15,
                  fontWeight: "bold",
                  color: DARK,
                  textAlign: "center",
                }}
              />
              <div
                style={{
                  fontSize: 5,
                  color: MUTED,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: SS,
                }}
              >
                Area
              </div>
            </div>
          </div>

          {/* Photo 2 */}
          <Photo
            src={p2}
            onLoad={setP2}
            label="Klicka för foto 2"
            sub="Pool / trädgård / interiör"
            style={{
              flex: 1,
              minHeight: 55,
              borderRadius: 7,
              border: "1.5px solid rgba(61,138,143,0.20)",
            }}
          />

          {/* Footer */}
          <div style={{ textAlign: "center", paddingBottom: 2 }}>
            <Editable
              value={d.tagline}
              onChange={set("tagline")}
              center
              style={{
                fontSize: 6,
                color: MUTED,
                letterSpacing: 2,
                fontFamily: SS,
              }}
            />
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={dl}
        disabled={st === "loading"}
        style={{
          marginTop: 24,
          background:
            st === "loading"
              ? "#1A3030"
              : `linear-gradient(135deg,${TEAL},${TEALD})`,
          color: WHITE,
          border: "none",
          borderRadius: 8,
          padding: "15px 48px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          cursor: st === "loading" ? "not-allowed" : "pointer",
          boxShadow:
            st === "loading" ? "none" : "0 8px 32px rgba(61,138,143,0.42)",
          fontFamily: SS,
          transition: "all 0.2s",
        }}
      >
        {st === "loading" ? "Genererar…" : "⬇  Ladda ner  1080 × 1920 px"}
      </button>

      {st === "done" && (
        <div
          style={{
            marginTop: 10,
            color: TEAL,
            fontSize: 11,
            letterSpacing: 2,
            fontFamily: SS,
          }}
        >
          ✓ Sparad!
        </div>
      )}
      {st === "error" && (
        <div
          style={{
            marginTop: 10,
            color: "#e55",
            fontSize: 11,
            letterSpacing: 2,
            fontFamily: SS,
          }}
        >
          ✗ Något gick fel
        </div>
      )}
      <div
        style={{
          marginTop: 8,
          color: "#162020",
          fontSize: 9,
          letterSpacing: 2,
          fontFamily: SS,
        }}
      >
        PNG · 1080 × 1920 px
      </div>
    </div>
  );
}
