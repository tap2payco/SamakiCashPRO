# SamakiCash PRO — Design System Specification

> Source Artifact: `https://claude.ai/artifact/QUHqSc6A7hFMRGLNa3pCBs`  
> Ecosystem: Lake Victoria Blue Economy (Fisheries, IoT Aquaculture & Fintech ERP)

---

## 1. Core Philosophy & Design Principles

1. **Say the answer, then the number:** Screens open with what is true, then show the figure.  
   *Example: "Dissolved oxygen is low near Cage B2: 3.8 mg/L"*
2. **Sentence case everywhere:** Headings, buttons, labels, and tabs use sentence case.  
   *Example: "Record reading", not "Record Reading"*
3. **Plain second person, present tense, no exclamation marks, no emoji:**  
   *Example: "Pause feeding until oxygen recovers above 5.0 mg/L"*
4. **Units are always explicit:** mg/L, °C, kg, km/h. Money is formatted as `TZS 8,300/kg`.
5. **Fixed status words:** `OK`, `Watch`, `Critical`, `No reading`. A status not recognized renders as `No reading`.
6. **Never render an unknown as zero:** A sensor that has not reported shows `No reading` with a dash `—`, never `0 mg/L`.
7. **Say where a number came from (Data Provenance):** Every critical data point carries a `SourceTag`:
   - `Manual` (Hand icon)
   - `Sensor` (Signal wave icon)
   - `Satellite` (Satellite icon)
   - `Demo data` (Dashed pill border)
8. **Bilingual-First (English & Kiswahili):** Swahili runs 15% to 20% longer than English. Never build sentences by string concatenation.
9. **Sun Mode & Outdoor Readability:** A high-contrast outdoor mode with solid `#ffffff` surfaces, 2px `#000000`/`#6b6b6b` borders, disabled drop shadows, and high-contrast ink (`#000000`, 18.4:1 contrast ratio) engineered for Lake Victoria fishermen and cage farmers in glaring equatorial sunlight.

---

## 2. Color Tokens

Reach for colours in this order: ground and ink, then `primary`, then state colours, then provenance.

| Token | Light | Night (Dark) | Sun (High Contrast) | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`surface-page`** | `#f7f9f8` | `#0b100e` | `#ffffff` | Page background ground |
| **`surface-card`** | `#ffffff` | `#151c19` | `#ffffff` | Card & sheet background |
| **`surface-sunken`** | `#edf2ef` | `#0f1512` | `#f0f0f0` | Wells, inputs, subtle tracks |
| **`ink`** | `#0b1410` | `#f1f6f3` | `#000000` | Primary text (16.5:1 / 18.4:1) |
| **`ink-muted`** | `#43504a` | `#a9b7b0` | `#1f1f1f` | Secondary labels, units (7.4:1 / 14.4:1) |
| **`border`** | `#dce5e0` | `#26332d` | `#6b6b6b` | Standard container outlines |
| **`border-strong`** | `#728279` | `#5f7268` | `#000000` | Active borders, focus rings |
| **`primary`** | `#05583a` | `#5fd09b` | `#033724` | Lake Green (Brand & Primary Action) |
| **`primary-wash`**| `#e2f1ea` | `#12261d` | `#f0f0f0` | Highlight background |
| **`tint`** | `#54aad1` | `#54aad1` | `#54aad1` | Lake Blue (decorative art & empty states) |
| **`ok`** | `#0f612c` | `#5fd08a` | `#093c1b` | Normal status text / icon |
| **`ok-fill`** | `#25984d` | `#25984d` | `#25984d` | Status badge border / fill |
| **`ok-wash`** | `#e3f4e9` | `#0f2a1a` | `#f0f0f0` | Status badge background |
| **`watch`** | `#724400` | `#f2b84b` | `#472a00` | Warning / advisory text |
| **`watch-fill`** | `#e99b2a` | `#e99b2a` | `#e99b2a` | Warning badge border |
| **`watch-wash`** | `#fdf0d8` | `#33260a` | `#f0f0f0` | Warning badge background |
| **`critical`** | `#a6000d` | `#ff8a8f` | `#670008` | Critical alarm text |
| **`critical-fill`**| `#e40014` | `#e40014` | `#e40014` | Critical alarm border |
| **`critical-wash`**| `#fde4e6` | `#3a1215` | `#f0f0f0` | Critical alarm background |
| **`note`** | `#00558a` | `#6cc3f0` | `#003556` | Informational text |
| **`note-fill`** | `#0089cb` | `#0089cb` | `#0089cb` | Informational border |
| **`note-wash`** | `#e1f1fa` | `#0f2532` | `#f0f0f0` | Informational background |
| **`offline-bg`** | `#edf2ef` | `#1b2420` | `#f0f0f0` | Offline banner background |
| **`offline-ink`** | `#0b1410` | `#f1f6f3` | `#000000` | Offline banner text |
| **`focus-ring`** | `#05583a` | `#5fd09b` | `#033724` | 3px accessibility ring |

---

## 3. Typography Hierarchy

| Style | Size / Line Height | Weight | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`display`** | 32 / 36px | Bold (700) | -0.02em | Hero headers, main views |
| **`title`** | 24 / 30px | Bold (700) | -0.01em | Screen headers, key titles |
| **`heading`** | 20 / 26px | Semibold (600) | 0 | Section headings, card headers |
| **`subhead`** | 16 / 22px | Semibold (600) | 0 | Group subheads, action text |
| **`body`** | 16 / 24px | Regular (400) | 0 | Standard description & content |
| **`body-strong`**| 16 / 24px | Semibold (600) | 0 | Emphasized text |
| **`label`** | 14 / 20px | Semibold (600) | 0 | Field labels, button labels |
| **`caption`** | 12 / 16px | Medium (500) | +0.01em | Metadata, timestamps, units |
| **`figure-hero`** | 36 / 40px | Bold (700) | -0.02em | Main KPI figures, DO readings |
| **`figure`** | 24 / 30px | Bold (700) | -0.01em | Financial balances, biomass |
| **`figure-sm`** | 16 / 22px | Semibold (600) | 0 | Secondary numeric values |
| **`mono`** | 13 / 18px | Medium (500) | 0 | Sensor node IDs, batch codes |

---

## 4. Spacing, Corner Radii & Sizing Tokens

### Spacing (4px grid)
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px

### Corner Radii
- `radius-sm`: 6px
- `radius-md`: 8px
- `radius-lg`: 12px
- `radius-xl`: 16px
- `radius-pill`: 999px

### Touch & Component Sizing
- `touch-min`: 48px (minimum accessible touch target)
- `touch-primary`: 56px (primary action buttons)
- `tab-bar-height`: 64px (bottom navigation bar)
- `icon-sm`: 20px
- `icon-md`: 24px
- `icon-lg`: 32px
- `stroke-control`: 1.5px
- `stroke-focus`: 3px
- `stroke-sun`: 2px

---

## 5. UI Components Catalog (22 Components)

1. **`SourceTag`**: Provenance badges (`Manual`, `Sensor`, `Satellite`, `Demo data`) with optional timestamps.
2. **`StatusBadge`**: Condition pills (`OK/Salama`, `Watch/Angalia`, `Critical/Hatari`, `Note/Kumbuka`, `No reading/Hakuna kipimo`).
3. **`SyncBar`**: Live synchronization state (`Synced`, `Waiting to send [3]`, `Sending 2 of 3`, `Offline [5 saved]`, `Could not send [3]`).
4. **`OfflineBanner`**: Top-level offline connectivity alerts and back-online auto-recovery notifications.
5. **`ThemeToggle`**: Header quick-toggle for Sun mode and 3-theme segmented control (`Light`, `Night`, `Sun`).
6. **`PageHeader`**: Standard screen header with titles, location chips (`Mwanza Gulf`), category badges, and notification bell.
7. **`MetricCard` / `StatCard`**: Financial & telemetry KPI cards with figures, units, status badge, trend arrows, and SourceTag.
8. **`NumberStepper`**: 48px touch-stepper (`[-]` and `[+]`) for direct field entry of DO and feed logs.
9. **`AlertItem`**: Operational incident card for Critical/Watch/Note conditions with Acknowledge workflow.
10. **`EmptyState`**: Dashed placeholder with iconography, explanations, and primary call-to-action.
11. **`ListRow`**: Compact list item with status pills, chevron navigation, or market pricing.
12. **`DataTable`**: Tabular dataset view for fish auction benchmarks, sites, prices, and demo data disclosure.
13. **`TrendChart`**: 24-hour SVG sensor telemetry graph with critical limit lines and "No reading" gap detection.
14. **`MapPanel`**: Geolocation cage and vessel mapping with offline position caching indicator.
15. **`Button`**: Primary (56px), secondary (48px), destructive, and ghost buttons with loading spinners.
16. **`GlassCard`**: Frosted glassmorphism surface adapting to Light, Night, and Sun mode.
17. **`Input`**: Clean form input with focus ring, helper text, and validation error messages.
18. **`Switch`**: Toggle switches for settings with bilingual on/off labels.
19. **`SegmentedControl`**: Pill toggle group for filtering views.
20. **`TabBar`**: Bottom navigation bar (`Home/Mwanzo`, `Lake/Ziwa`, `Cages/Vizimba`, `Alerts/Tahadhari`, `More/Zaidi`).
