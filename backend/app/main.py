from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.models import models  # noqa: F401  (register models)
from app.routers import (
    admin,
    assets,
    attendance,
    auth,
    dashboard,
    employees,
    leave,
    requests,
    salary,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AVFU HRMS API",
    description="Human Resource Management System — Assam Veterinary & Fisheries University",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for r in (
    auth.router,
    employees.router,
    leave.router,
    attendance.router,
    salary.router,
    requests.router,
    assets.router,
    dashboard.router,
    admin.router,
):
    app.include_router(r)


@app.get("/")
def root():
    return {"app": "AVFU HRMS API", "status": "ok", "docs": "/docs"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}
