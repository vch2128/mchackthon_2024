from contextlib import asynccontextmanager
from datetime import datetime, timedelta


import os
import sys

from bson import ObjectId
from fastapi import FastAPI, status, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn

from dal_funcs import TechPostDAL, EmployeeDAL, TechCommentDAL
from dal_tables import TechPost, Employee, TechComment
from authentication import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, pwd_context


import openai

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
    
    app.techpost_dal    = TechPostDAL(techpost_collection)
    app.employee_dal    = EmployeeDAL(employee_collection)
    app.techcomment_dal = TechCommentDAL(techcomment_collection)
    
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
    return await app.techpost_dal.get_tech_post(techpost_id)

@app.get("/api/techposts/sender/{sender_id}") # return techposts with same sender_id
async def get_sender_techposts(sender_id: str) -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts_by_employee(sender_id)]

@app.get("/api/techposts/others/{sender_id}")
async def get_others_techposts(sender_id: str) -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts_without_employee(sender_id)]

@app.get("/api/techposts/techcomments/{techpost_id}")
async def get_tech_comments_by_techpost(techpost_id: str) -> list[TechComment]:
    return [i async for i in app.techcomment_dal.list_tech_comments(techpost_id)]

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

class NewTechCommentResponse(BaseModel):
    id: str
    content: str

class TechCommentCreate(BaseModel):
    content: str
    sender_id: str
    techpost_id: str

# create a tech comment
@app.post("/api/techcomment", status_code=status.HTTP_201_CREATED)
async def create_techcomment(tech_comment: TechCommentCreate) -> NewTechCommentResponse:
    new_id = await app.techcomment_dal.create_tech_comment(
        content=tech_comment.content,
        sender_id=tech_comment.sender_id,
        tech_post_id=tech_comment.techpost_id
    )
    return NewTechCommentResponse(
        id=new_id, 
        content=tech_comment.content,
    )
    
@app.post("/api/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password, app.employee_dal)
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
    employee = {
        "id": user.id,
        "name": user.name,
        "department": user.department,  # Corrected spelling from 'departement' to 'department'
        "wallet": user.wallet,
        "score": user.score
    }
    
    return {"access_token": access_token, "token_type": "bearer", "user": employee}

def main(argv=sys.argv[1:]):
    try:
        uvicorn.run("server:app", host="0.0.0.0", port=3001, reload=DEBUG)
    except KeyboardInterrupt:
        pass






class ParagraphSubmit(BaseModel):
    paragraph: str

class ParagraphResponse(BaseModel):
    message: str

@app.post("/api/submit-paragraph", response_model=ParagraphResponse)
async def submit_paragraph(paragraph_data: ParagraphSubmit):
    paragraph = paragraph_data.paragraph
    api_key = "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"

    if not api_key:
        return {"message": "API key not set"}

    openai.api_key = api_key
    system_content = "You will help me separate the paragraph into two parts. "\
                     "The first part contains the mood. "\
                     "The second part contains the tech problem."

    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": paragraph}
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=100,
            temperature=0.7
        )

        result = response['choices'][0]['message']['content'].strip()

        print(f"Response from OpenAI: {result}")
        print(f"Received paragraph: {paragraph}")

        return {"message": "Paragraph received and processed successfully"}

    except Exception as e:
        print(f"Error occurred: {e}")
        return {"message": "Error processing the paragraph"}






if __name__ == "__main__":
    main()