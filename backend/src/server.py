from contextlib import asynccontextmanager
from datetime import datetime
import os
import sys

from bson import ObjectId
from fastapi import FastAPI, status
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn

from dal_funcs import TechPostDAL
from dal_tables import TechPost

MONGODB_URI = os.environ["MONGODB_URI"]
DEBUG = os.environ.get("DEBUG", "").strip().lower() in {"1", "true", "on", "yes"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup:
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.get_default_database()

    # Ensure the database is available:
    pong = await db.command("ping")
    if int(pong["ok"]) != 1:
        raise Exception("Cluster connection is not okay!")

    employee_collection = db.get_collection('employee')
    techpost_collection = db.get_collection('techpost')
    techcomment_collection = db.get_collection('techcomment')
    emomsg_collection = db.get_collection('emomsg')

    app.techpost_dal = TechPostDAL(techpost_collection)
    

    
    # Yield back to FastAPI Application:
    yield

    # Shutdown:
    client.close()


app = FastAPI(lifespan=lifespan, debug=DEBUG)
@app.get("/api/techposts") # return all techposts
async def get_all_techposts() -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts()]

@app.get("/api/techposts/{techpost_id}") # return techpost with id = techpost_id
async def get_a_techpost(techpost_id: str) -> TechPost:
    return await app.techpost_dal.get_a_techpost(techpost_id)
    
@app.get("/api/techposts/sender/{sender_id}") # return techposts with same sender_id
async def get_sender_techposts(sender_id: str) -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts_by_employee(sender_id)]

@app.get("/api/techposts/sender/{sender_id}/others") #return techposts with different sender_id
async def get_others_techposts(sender_id: str) -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts_without_employee(sender_id)]
    
