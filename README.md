# TRUSTVERIFY AI

### Fake News Detection • Face Verification • Credibility Scoring Platform
> **Tagline:** *"Verify Before You Trust."*

---

## 1. Executive Summary

**TRUSTVERIFY AI** is an academic- and cybersecurity-grade verification platform designed to combat digital misinformation and authenticate identity claims. Rather than providing opaque, binary ("True/False") pronouncements, the system employs an **Explainable Multi-Factor Verification Architecture** combining:

1. **Fake News & Misinformation Detection**: Claim extraction, linguistic deception markers, and domain reputation verification.
2. **1-to-1 Facial Verification**: Spatial-frequency biometric embedding extraction, image quality audits, and cosine similarity comparison against configurable security thresholds.
3. **Credibility Scoring Engine**: A transparent 6-factor mathematical weighting model distinguishing **AI Credibility Assessment** from **Model Confidence**.

---

## 2. System Architecture

```
                                  TRUSTVERIFY AI
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
  [ Fake News Engine ]          [ Face Verification ]         [ Credibility Engine ]
        │                                │                                │
  ┌─────┴──────────────┐          ┌──────┴──────────────┐         ┌───────┴─────────────┐
  │ - Text / URL / PDF │          │ - Dual Image / Cam  │         │ - 6 Config Factors  │
  │ - Claim Extraction │          │ - Quality & Lighting│         │ - Source Signals 20%│
  │ - Lexical Markers  │          │ - Biometric Vectors │         │ - Evidence 25%      │
  │ - Domain Registry  │          │ - Cosine Similarity │         │ - Claim Match 20%   │
  └─────┬──────────────┘          └──────┬──────────────┘         └───────┬─────────────┘
        │                                │                                │
        └────────────────────────────────┼────────────────────────────────┘
                                         ▼
                           [ Security Operations Center ]
                     Dashboard • Audit Reports • Analytics • History
```

### AI Provider Layer Abstraction
- **Primary AI Engine**: Google Gemini API (`@google/generative-ai`) returning structured JSON against a strict schema.
- **Deterministic Local NLP Provider**: High-precision heuristic NLP engine with lexical clickbait markers, domain registry cross-referencing, and deterministic score computation. Used automatically when `GEMINI_API_KEY` is not present or when offline.
- **Biometric Face Provider**: In-memory spatial gradient feature extractor computing cosine similarity ($0.00 - 1.00$) against a configurable threshold (default: $0.82$).

---

## 3. Credibility Scoring Formula

The overall credibility score $C \in [0, 100]$ is computed using a normalized multi-factor weighted sum:

$$C = \frac{\sum_{i=1}^{6} (S_i \times W_i)}{\sum_{i=1}^{6} W_i}$$

| Component | Default Weight | Description |
| :--- | :---: | :--- |
| **Evidence Support** | 25% | Ratio of corroborated claims against verified peer-reviewed or wire sources. |
| **Source Signals** | 20% | Domain reputation registry, SSL/TLS certificates, and editorial disclosures. |
| **Claim Consistency** | 20% | Internal factual coherence and absence of internal contradictions. |
| **Content Quality** | 15% | Linguistic objectivity, lexical balance, absence of sensationalist clickbait. |
| **Context & Date Relevance** | 10% | Temporal validity and contextual alignment with historical facts. |
| **Cross-Source Agreement** | 10% | Consistency across multiple external reporting organizations. |

### Credibility Tiers:
- **85 – 100**: *Very High Credibility* (Emerald)
- **70 – 84**: *High Credibility* (Cyan)
- **50 – 69**: *Moderate Credibility* (Amber)
- **30 – 49**: *Low Credibility* (Orange)
- **0 – 29**: *Very Low Credibility* (Rose)

### Confidence vs. Credibility Distinction
- **Credibility Assessment**: Represents the algorithmic evaluation of the *available evidence*.
- **AI Confidence**: Represents how *certain* the model is in its assessment based on text length, citation count, claim density, and signal variance.

---

## 4. Biometric Privacy & Security Governance

TRUSTVERIFY AI implements strict zero-retention biometric data policies:
- **Ephemeral RAM Processing**: Uploaded probe and reference portraits are converted to in-memory buffers, analyzed, and discarded immediately.
- **No Raw Biometrics in Database**: Neither the raw images nor the 64-dimensional biometric vectors are persisted to the database.
- **No Open-Ended Surveillance**: Biometric matching is strictly 1-to-1 comparison against a supplied reference; no open-ended database face searching is performed.
- **Purge Capability**: The "Delete Analysis Data" feature allows complete permanent purging of audit history.

---

## 5. REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/news/analyze` | Executes 6-stage news credibility verification pipeline |
| `POST` | `/api/news/claims` | Extracts testable factual claims with confidence scores |
| `POST` | `/api/face/verify` | Runs 1-to-1 biometric facial similarity verification |
| `GET` | `/api/analytics` | Computes live dynamic KPIs and distribution histograms |
| `GET` | `/api/history` | Retrieves paginated and filtered verification audit logs |
| `DELETE`| `/api/history` | Permanently purges all analysis records |
| `GET` | `/api/history/:id` | Retrieves a single analysis record by ID |
| `DELETE`| `/api/history/:id` | Deletes a single audit record |
| `GET` | `/api/reports` | Lists all generated audit reports |
| `POST` | `/api/reports` | Generates a printable audit report for news or face verification |
| `GET` | `/api/settings` | Reads active scoring weights and threshold configuration |
| `POST` | `/api/settings` | Updates active scoring weights and threshold configuration |

---

## 6. How to Run & Test

### Installation
```bash
npm install
```

### Configure Environment (Optional)
Create `.env.local` to enable Gemini AI (if omitted, the system seamlessly operates on the local NLP fallback engine):
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build Production Application
```bash
npm run build
npm start
```

---

## 7. Testing Each Feature

1. **News Verification**:
   - Navigate to `/news`.
   - Click "Load Credible Sample" or "Load Disinformation Sample" for instant demonstration text.
   - Click **Analyze News** to watch the 6-stage verification stepper.
   - Inspect the radial credibility gauge, "Why This Result?" breakdown cards, expandable claim items, and evidence citations.
2. **Face Verification**:
   - Navigate to `/face`.
   - Click **Load Sample Test Faces** or upload reference and probe images, or use **Live Camera** to capture a snapshot.
   - Click **Verify Identity** to inspect the similarity score, sharpness index, lighting checks, and biometric privacy notice.
3. **Audit Reports**:
   - Navigate to `/reports`.
   - Click "View & Print Report" on any audit record.
   - Click **Print / Save as PDF** to generate an official print-optimized security report.
4. **Settings & Policy Management**:
   - Navigate to `/settings`.
   - Adjust the Cosine Similarity Threshold slider or the 6 Scoring Factor weights.
   - Save changes and observe dynamic updates across the platform.
#   v e r i f i  
 