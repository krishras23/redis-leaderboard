import redis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

r = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

class Student(BaseModel):
    name: str
    score: float

@app.post("/add_score")
async def add_score(student: Student):
    current_score = r.zscore("academic_leaderboard", student.name) or 0
    new_score = current_score + student.score
    r.zadd("academic_leaderboard", {student.name: new_score})
    return {"message": f"Score updated successfully. New total: {new_score}"}

@app.get("/get_leaderboard")
async def get_leaderboard(limit: int = 10):
    leaderboard = r.zrevrange("academic_leaderboard", 0, limit-1, withscores=True)
    return [{"name": name, "score": score} for name, score in leaderboard]
