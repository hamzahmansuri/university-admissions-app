from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.schools import router as schools_router

app = FastAPI(title="University Admissions Explorer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schools_router)


@app.get("/health")
def health():
    return {"status": "ok"}
