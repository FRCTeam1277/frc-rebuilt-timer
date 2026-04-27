# FRC Rebuilt Timer

Stay ahead of the game with this timer!

This timer accurately tracks the ALLIANCE HUB statuses so you don't have to. 

Refer to the [2026 Game Manual](https://firstfrc.blob.core.windows.net/frc2026/Manual/2026GameManual.pdf) for details. 

<img width="919" height="551" alt="image" src="https://github.com/user-attachments/assets/afa8798b-2d46-457a-8397-b1aa5b03c1ba" />

## Features:  
- [x] Automatic tracking of Match Timeframes (including post-auto delay)
- [x] Flash alert  
- [x] Vibration alert  
  - Note: Available only on supported operating systems, see: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
- [x] Audio alert  
  - Note: While audio is legal, remember to display Gracious Professionalism and be mindful of other spectators and the volume.  

## Competition Legality
The timer app is fully legal and compliant with Rule G302. Drive Team is allowed to use this during matches if they would like. 

## Build & Run

No build step required — this is a static web app (HTML + CSS + vanilla JS).

**Quick start (local):**
```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js (npx, no install needed)
npx serve .

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```
Then open `http://localhost:8000` (or whatever port is shown).

**Deploy:**
Push to GitHub Pages, Netlify, or any static host. No build/bundling needed — just serve the repo root as-is.

**PWA / Offline:**
The service worker (`sw.js`) caches all assets for offline use. After the first visit, the app works without a network connection.

[Full match Demo Video](https://rbgk.github.io/frc-rebuilt-timer/Rebuilt_Timer_demo.mp4)
