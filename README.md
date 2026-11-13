# CrewReady: Beyond Us

> **CrewReady is a free browser game where kids aged 7–12 command a Mars mission across six levels, and every choice trades power, air and water, food, or radiation protection — driven by real NASA data.**

Built for the **NASA Space Apps Challenge 2026**  
Challenge: **Build a Junior Astronaut Mission Trainer**  
Team: **CrewReady**, Bangladesh

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional, defaults to DEMO_KEY)
cp .env.example .env

# 3. Start development server
npm run dev

# 4. Open in browser (landscape recommended: 844 × 390 or full screen)
# http://localhost:5173
```

### Run Tests and Production Build
```bash
# Run test suite (120+ tests)
npm test -- --run

# Production type-check and build
npm run build

# Preview production build
npm run preview
```

### Refresh Offline NASA Data Cache
```bash
# Fetches live snapshot from NASA and NOAA endpoints and caches to public/data/*.json
npm run nasa:snapshot
```

---

## Real NASA & NOAA Datasets Used

Every fact, storm alert, and planetary reading in the simulation maps directly to open scientific datasets:

1. **NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information)**  
   *Used for:* CME, SEP, and Geomagnetic storm telemetry in Levels 2 & 6, and the Fly runner.  
   *Source & Link:* [NASA DONKI](https://kauai.ccmc.gsfc.nasa.gov/DONKI/)

2. **NOAA SWPC Planetary K-Index**  
   *Used for:* Today's planetary geomagnetic activity, which sets the starting speed tier in Fly.  
   *Source & Link:* [NOAA Space Weather Prediction Center](https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json)

3. **NASA NeoWs (Near-Earth Object Web Service)**  
   *Used for:* Real tracked orbital asteroid data on Story Card 1.  
   *Source & Link:* [NASA NeoWs API](https://api.nasa.gov/)

4. **NASA EPIC (Earth Polychromatic Imaging Camera)**  
   *Used for:* Sunlit whole-Earth photography from the DSCOVR satellite at Lagrange Point 1 (Level 1 departure).  
   *Source & Link:* [NASA EPIC](https://epic.gsfc.nasa.gov/)

5. **NASA InSight Mars Weather Service**  
   *Used for:* Daily atmospheric pressure, ambient temperature, and wind data recorded on Elysium Planitia, Mars (Level 3).  
   *Source & Link:* [NASA InSight Mission](https://mars.nasa.gov/insight/)

6. **NASA OSDR (Open Science Data Repository)**  
   *Used for:* Space biology gene expression and Veggie plant cultivation studies on the ISS (Level 5).  
   *Source & Link:* [NASA OSDR](https://osdr.nasa.gov/)

7. **NASA Image and Video Library**  
   *Used for:* Curated imagery of the Jezero crater delta, Mars dust storms, MOXIE oxygen generator, and the ISS life support system.  
   *Source & Link:* [NASA Image and Video Library](https://images.nasa.gov/)

8. **NASA APOD (Astronomy Picture of the Day)**  
   *Used for:* High-resolution astronomy imagery on the Mission Success screen.  
   *Source & Link:* [NASA APOD](https://apod.nasa.gov/apod/)

9. **NASA Technical Reports Server (NTRS)**  
   *Used for:* Engineering baseline values for human life support, regolith shielding mass calculations, and CO2 scrubbing chemistry.  
   *Source & Link:* [NASA NTRS](https://ntrs.nasa.gov/)

---

## Architectural Highlights

- **Pure Landscape Stage:** Single unified 16:9 stage that adapts seamlessly across phone, tablet, and desktop viewports, with a gentle orientation prompt for upright screens.
- **Offline PWA Support:** Service worker precaching application assets and NASA data caches, enabling classroom play without reliable internet.
- **No Compromise Science:** Every metric follows real mass and power budgets. There is no unlimited resource mode in space.
- **Ethical & Safe for Kids:** No personal data collected, no ads, no trackers, sound off by default, and accessible focus outlines.

---

## License

This project is open source under the [Apache License 2.0](LICENSE).
