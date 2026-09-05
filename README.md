# SONAR AI — Autonomous Marine Debris & Anomaly Detection System

An AI-powered underwater marine debris and anomaly detection web application using Side-Scan Sonar (SSS) imagery. Built as a cold, robotic, autonomous machine interface operating inside an AUV/ROV marine research command center with a **strict black-and-white monochrome visual identity**.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies (already completed)
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

The Vite dev server will start at `http://localhost:3000`.

---

## 🚀 Key Features

1. **Strict Monochrome Aesthetic**: Zero prohibited colors. Pure black `#000000`, deep grays, light grays, pure white `#FFFFFF`, and subtle white/gray glows.
2. **Rotating Micro-Radar Search Bar**: Embedded live 22px rotating radar inside the search input trigger, with `Cmd+K` command-center search overlay.
3. **Cinematic Hero Sonar Radar**: Continuous 360° circular radar with concentric range rings, azimuth degrees, sweep beam, and pulsing anomaly blips.
4. **Cinematic Boot Sequence**: Clicking `INITIALIZE SONAR` runs a 5-step hardware & neural calibration sequence before entering the command center.
5. **Main Dashboard**: Animated counting statistics (1,284 scans, 347 anomalies, 281 high confidence, 428 km², 91.7% confidence), AUV telemetry HUD, and live feed.
6. **Side-Scan Sonar Analysis Workspace**:
   - Procedural acoustic canvas with Port/Starboard channels, nadir blind zone, speckle noise, sand ripples, and acoustic shadows.
   - Interactive bounding boxes and crosshairs (`GHOST NET // 96.4% // AN-104`).
   - 8-Step machine analysis simulator with vertical scanning laser line.
   - Detection sidebar with zoom/highlight and segmented monochrome confidence bars.
7. **Geospatial Detection Map**: Dark bathymetric cartography canvas with isobath contours, coastline hatching, survey transect lines, pulsing markers, and telemetry inspector.
8. **Reports & Exports**:
   - Anomaly table with real-time filtering and sorting.
   - **EXPORT CSV**: Instant client-side download of RFC 4180 CSV file.
   - **EXPORT JSON**: Formatted JSON catalog download.
   - **GENERATE REPORT**: Official AUV Survey Mission Dossier modal with print/PDF capability.
9. **Sonar File Ingestion**: Drag-and-drop modal with simulated acoustic decompression and ASCII progress bar (`82%`).
10. **Live Sonar Waterfall Feed**: Continuous downward-scrolling spectrogram with rolling telemetry HUD.
11. **System Diagnostics**: 7/7 subsystem health telemetry and streaming machine log terminal.
