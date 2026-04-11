Bakgrund (glass / overlay card)
Primär: rgba(255, 255, 255, 0.15)
Blur / glass effect: backdrop-blur + låg opacity
Gradient overlay (svagt):
Top: rgba(30, 60, 100, 0.35)
Bottom: rgba(0, 0, 0, 0.25)

👉 Ja, det finns overlay/filter → ger “frosted glass” känsla.

🟡 Border (gold)
Primär gold: #D4AF37
Highlight: #F1D27A
Shadow tone: #A8892A

👉 Troligen gradient:

border: 2px solid;
border-image: linear-gradient(145deg, #F1D27A, #D4AF37, #A8892A) 1;
✨ Pris (599.000€)
Gold text: #E5C76B
Shadow: rgba(0,0,0,0.3)
🔤 FOR SALE (headline)
Vit: #FFFFFF
Opacity: ~90%
Shadow: rgba(0,0,0,0.4)
🔤 Ref + info text
Light gray: #D1D5DB
🟡 Ikoner (bed, bath, etc)
Gold: #D4AF37
Lite ljusare highlight:
#E6C86E
⚫ Bottom text (SWIPE UP)
White: #FFFFFF
Opacity: ~80%
🧠 Viktigt du missar
Det är inte bara färger → hela designen bygger på:
backdrop-blur
semi-transparent layers
subtle gradients
inner glow + shadows

Om du bara kopierar färger → det kommer se platt ut.

🧊 Glass effect (card)
background: rgba(255, 255, 255, 0.12);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
🌫 Overlay gradient (viktig för djup)
background: linear-gradient(
  180deg,
  rgba(30, 60, 100, 0.35) 0%,
  rgba(0, 0, 0, 0.25) 100%
);
🟡 Border (gold gradient)
border: 1.5px solid transparent;
border-radius: 20px;
background-clip: padding-box;
position: relative;

&::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1.5px;
  background: linear-gradient(145deg, #F1D27A, #D4AF37, #A8892A);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
}
✨ Inner glow (det du missar mest)
box-shadow:
  inset 0 0 40px rgba(255, 215, 130, 0.25),
  0 10px 30px rgba(0, 0, 0, 0.3);
🔤 Text shadow (FOR SALE + pris)
text-shadow: 0 2px 10px rgba(0,0,0,0.4);
🧠 Kritisk poäng (du måste fatta detta)

Om du skippar:

blur
inner glow
gradient overlay

→ då kommer det se billigt ut direkt, även om färgerna är rätt.

🎯 Text färg exakt (inte bara “vit”)
color: rgba(255, 255, 255, 0.92); /* headline */
color: rgba(255, 255, 255, 0.75); /* secondary text */
🟡 Gold (exakt balans, inte bara 1 färg)

Du behöver gradient även på text/ikoner, inte bara border:

background: linear-gradient(145deg, #F1D27A, #D4AF37);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

👉 Annars ser det platt ut direkt.

🧊 Glass highlight (top shine)

Den här är lätt att missa:

background: linear-gradient(
  180deg,
  rgba(255,255,255,0.25) 0%,
  rgba(255,255,255,0.05) 40%,
  rgba(255,255,255,0) 100%
);

👉 Ger den där “premium UI” känslan.

📦 Card kant (subtil ljus kant utöver gold)
outline: 1px solid rgba(255,255,255,0.15);
🌑 Depth shadow (under kortet)
box-shadow: 0 20px 60px rgba(0,0,0,0.35);

