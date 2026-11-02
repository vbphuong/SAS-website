# SAS — Student Academic Success

A full-stack web application for Swinburne University's Student Academic Success program.

## Project Structure

```
SAS-website/
  backend/          ← FastAPI (Python)
  frontend/         ← Next.js 15 (TypeScript, Tailwind CSS v4)
```

## Development Setup

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on **http://localhost:8000**

API endpoints:
- `GET /api/faculties` — list all faculties
- `GET /api/units/{faculty}` — get units for a faculty (e.g. `computer-science`, `business`, `media`)

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

> **Note:** Start the backend first. The faculty pages fetch data from `http://localhost:8000`.

## Features

- **Homepage** — hero with QR code booking, faculty cards, how-it-works section
- **Faculty pages** — `/computer-science`, `/business`, `/media`
- **Unit cards** — code badge, name, study tips, book-a-session link
- **Responsive** — mobile-first layout down to 320px
- **Design** — Swinburne red (`#E2012D`), Barlow + Be Vietnam Pro + JetBrains Mono fonts

## Faculties & Units

| Faculty | Units |
|---|---|
| Computer Science | COS10009, COS20007, COS30008, COS30049, COS40005, TNE10006 |
| Business | ACC10007, MGT10001, MKT10007, ECO10001, BUS30022, FIN30006 |
| Media | MMD10001, JNL20002, DIG20008, FLM20005, PR30001, ADV30003 |
