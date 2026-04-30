from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    firma: str
    stelle: str
    status: str
    notizen: Optional[str] = None

engine = create_engine("sqlite:///jobs.db")
SQLModel.metadata.create_all(engine)

@app.get("/")
def root():
    return {"message": "Job Tracker API läuft!"}

@app.get("/jobs")
def get_jobs():
    with Session(engine) as session:
        jobs = session.exec(select(Job)).all()
        return jobs

@app.post("/jobs")
def create_job(job: Job):
    with Session(engine) as session:
        session.add(job)
        session.commit()
        session.refresh(job)
        return job

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int):
    with Session(engine) as session:
        job = session.get(Job, job_id)
        session.delete(job)
        session.commit()
        return {"message": "Job gelöscht"}

@app.patch("/jobs/{job_id}")
def update_job(job_id: int, updated: dict):
    with Session(engine) as session:
        job = session.get(Job, job_id)
        for key, value in updated.items():
            setattr(job, key, value)
        session.commit()
        session.refresh(job)
        return job