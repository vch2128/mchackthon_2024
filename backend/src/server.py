from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
import os
import sys

from bson import ObjectId
from fastapi import FastAPI, status, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn

from dal_funcs import TechPostDAL, EmployeeDAL
from dal_tables import TechPost, Employee
from authentication import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

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

    employee_collection = db.get_collection("employee")
    techpost_collection = db.get_collection("techpost")
    techcomment_collection = db.get_collection("techcomment")
    emomsg_collection = db.get_collection("emomsg")

    # Store in app.state:
    app.state.db_client = client
    app.state.db = db
    app.state.employee_collection = employee_collection
    app.state.techpost_collection = techpost_collection
    app.state.techcomment_collection = techcomment_collection
    app.state.emomsg_collection = emomsg_collection
    
    app.techpost_dal = TechPostDAL(techpost_collection)
    app.employee_dal = EmployeeDAL(employee_collection)
    
    # Yield back to FastAPI Application:
    yield

    # Shutdown:
    client.close()


app = FastAPI(lifespan=lifespan, debug=DEBUG)

@app.get("/api/techposts") # return all techposts
async def get_all_techposts() -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts()]

# @app.get("/api/techposts/{techpost_id}") # return techpost with id = techpost_id
# async def get_a_techpost(techpost_id: str) -> TechPost:
#     return await app.techpost_dal.get_a_techpost(techpost_id)

@app.get("/api/techposts/sender/{sender_id}") # return techposts with same sender_id
async def get_sender_techposts(sender_id: str) -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts_by_employee(sender_id)]

@app.get("/api/techposts/others/{sender_id}")
async def get_others_techposts(sender_id: str) -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts_without_employee(sender_id)]

class EmployeeCreate(BaseModel):
    name: str
    account: str
    password: str
    department: str

class NewEmployeeResponse(BaseModel):
    id: str
    name: str
    account: str
    password: str  # Note: Returning passwords is not recommended
    
    
@app.post("/api/employee", status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate) -> NewEmployeeResponse:
    # use bcrypt
    hashed_password = pwd_context.hash(employee.password)
    new_id = await app.employee_dal.create_employee(
        name=employee.name,
        account=employee.account,
        password=hashed_password,
        department=employee.department
    )
    return NewEmployeeResponse(
        id=new_id, 
        name=employee.name,
        account=employee.account,
        password=hashed_password,
    )

# Assuming NewTechPostResponse is already defined
class NewTechPostResponse(BaseModel):
    id: str
    content: str

class TechPostCreate(BaseModel):
    content: str
    sender_id: str
    

# create a techpost with sender_id and content
@app.post("/api/techpost", status_code=status.HTTP_201_CREATED)
async def create_techpost(tech_post: TechPostCreate) -> NewTechPostResponse:
    new_id = await app.techpost_dal.create_tech_post(
        content=tech_post.content,
        sender_id=tech_post.sender_id
    )
    return NewTechPostResponse(
        id=new_id, 
        content=tech_post.content,
    )
    
@app.post("api/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid account or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.account}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

def main(argv=sys.argv[1:]):
    try:
        uvicorn.run("server:app", host="0.0.0.0", port=3001, reload=DEBUG)
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()