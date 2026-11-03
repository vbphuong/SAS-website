from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import os

app = FastAPI(title="SAS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",   # Vercel preview URLs
        # thêm custom domain của bạn ở đây nếu có
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

@app.get("/api/units/{faculty}")
def get_units(faculty: str):
    path = os.path.join(DATA_DIR, f"{faculty}.json")
    if not os.path.exists(path):
        return {"error": "Not found", "units": []}
    with open(path) as f:
        return json.load(f)

@app.get("/api/faculties")
def get_faculties():
    return {"faculties": ["computer-science", "business", "media", "design"]}
