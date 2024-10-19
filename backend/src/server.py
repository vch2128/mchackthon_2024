from contextlib import asynccontextmanager
from datetime import datetime, timedelta

import os
import sys

from bson import ObjectId
from fastapi import FastAPI, status, HTTPException, status, Depends, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from dal_funcs import TechPostDAL, EmployeeDAL, TechCommentDAL, EmoMsgDAL, EmoReplyDAL, GPTDataDAL, GPTEmployeeDataDAL, CampaignDataDAL
from dal_tables import TechPost, Employee, TechComment, EmoMsg, EmoReply, GPTData, GPTEmployeeData, CampaignData
from authentication import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, pwd_context
from gpt import gpt_separate_paragraph, get_embedding, find_most_similar, gpt_pre_answer_tech_post, gpt_get_rcvr_id_mostmatched, gpt_get_rcvr_id_mostunmatched


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
    emoreply_collection = db.get_collection("emoreply")
    gptdata_collection = db.get_collection("gptdata")
    gptemployeedata_collection = db.get_collection("gptemployeedata")
    campaigndata_collection = db.get_collection("campaigndata")
    
    # Store in app.state:
    app.state.db_client = client
    app.state.db = db
    app.state.employee_collection = employee_collection
    app.state.techpost_collection = techpost_collection
    app.state.techcomment_collection = techcomment_collection
    app.state.emomsg_collection = emomsg_collection
    app.state.emoreply_collection = emoreply_collection
    app.state.gptdata_collection = gptdata_collection
    app.state.gptemployeedata_collection = gptemployeedata_collection
    app.state.campaigndata_collection = campaigndata_collection
    
    app.techpost_dal    = TechPostDAL(techpost_collection)
    app.employee_dal    = EmployeeDAL(employee_collection)
    app.techcomment_dal = TechCommentDAL(techcomment_collection)
    app.emomsg_dal = EmoMsgDAL(emomsg_collection)
    app.emoreply_dal = EmoReplyDAL(emoreply_collection)
    app.gptdata_dal = GPTDataDAL(gptdata_collection)
    app.gptemployeedata_dal = GPTEmployeeDataDAL(gptemployeedata_collection)
    app.campaigndata_dal = CampaignDataDAL(campaigndata_collection)
    # Yield back to FastAPI Application:
    yield

    # Shutdown:
    client.close()


app = FastAPI(lifespan=lifespan, debug=DEBUG)

@app.get("/api/employees/{employee_id}")
async def get_employee(employee_id: str) -> Employee:
    return await app.employee_dal.get_employee(employee_id)

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

@app.get("/api/techposts/search/all/{search_query}")
async def search_techposts(search_query: str) -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts_by_search(search_query)]

@app.get("/api/techposts/search/my/{search_query}/{sender_id}")
async def search_techposts_ids(search_query: str, sender_id: str) -> list[TechPost]:
    return [i async for i in app.techpost_dal.list_tech_posts_by_search_my(search_query, sender_id)]

@app.get("/api/emomsg/{emomsg_id}")
async def get_an_emomsg(emomsg_id: str) -> EmoMsg:
    return await app.emomsg_dal.get_emo_msg(emomsg_id)

@app.get("/api/emomsg/sender/{sender_id}")
async def get_emomsg_by_sender(sender_id: str) -> list[EmoMsg]:
    return [i async for i in app.emomsg_dal.list_emo_msgs_by_sender(sender_id)]

@app.get("/api/emomsg/rcvr/{rcvr_id}")
async def get_emomsg_by_rcvr(rcvr_id: str) -> list[EmoMsg]:
    return [i async for i in app.emomsg_dal.list_emo_msgs_by_rcvr(rcvr_id)]

@app.get("/api/emoreply/emomsg/{emomsg_id}")
async def get_emoreply_by_emomsg(emomsg_id: str) -> list[EmoReply]:
    return [i async for i in app.emoreply_dal.list_emo_replies_by_emo_msg(emomsg_id)]

@app.get("/api/emoreply/sender/{sender_id}")
async def get_emoreply_by_sender(sender_id: str) -> list[EmoReply]:
    return [i async for i in app.emoreply_dal.list_emo_reply_by_sender(sender_id)]


@app.get("/api/employee/embeddings")
async def get_employee_embeddings() -> list[GPTEmployeeData]:
    return [i async for i in app.gptemployeedata_dal.list_gpt_employee_data()]

@app.get("/api/employee/gptdata/{employee_id}") # return techpost with id = techpost_id
async def get_employee_embedding_by_id(employee_id: str) -> GPTEmployeeData:
    employee_data = await app.gptemployeedata_dal.get_an_embedding(employee_id)
    if employee_data is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee_data

# get a campaign
@app.get("/api/campaign/{campaign_id}")
async def get_a_campaign(campaign_id: str) -> CampaignData:
    campaign = await app.campaigndata_dal.get_a_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@app.get("/api/campaigns")
async def get_all_campaigns() -> List[CampaignData]:
    return [i async for i in app.campaigndata_dal.list_all_campaigns()]

# get wallet
@app.get("/api/employee/get_wallet/{employee_id}")
async def get_wallet(employee_id: str) -> int:
    employee_wallet = await app.employee_dal.check_wallet(employee_id)
    return employee_wallet

# Update wallet
class UpdateWalletRequest(BaseModel):
    value: int
    employee_id: str
    
@app.put("/api/employee/update_wallet") 
async def update_employee_wallet( request: UpdateWalletRequest) -> int:
    updated_wallet = await app.employee_dal.update_wallet(request.employee_id, request.value)
    return updated_wallet


class EmployeeCreate(BaseModel):
    name: str
    account: str
    password: str
    department: str
    age : int
    position: str
    seniority: int
    region: str
    

class NewEmployeeResponse(BaseModel):
    id: str
    name: str
    account: str
    password: str  # Note: Returning passwords is not recommended
    department: str
    age : int
    position: str
    seniority: int
    region: str

    
@app.post("/api/employee", status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate) -> NewEmployeeResponse:
    # use bcrypt
    hashed_password = pwd_context.hash(employee.password)
    new_id = await app.employee_dal.create_employee(
        name=employee.name,
        account=employee.account,
        password=hashed_password,
        department=employee.department,
        age=employee.age,
        position=employee.position,
        seniority=employee.seniority,
        region=employee.region,
    )
    info = "Employee info: department =" + str(employee.department) + "; age = " + str(employee.age) + "; company position = " + str(employee.position) + "; seniority = " + str(employee.seniority) + "years; workplace region = " + str(employee.region)
    new_embedding = await get_embedding(info)
    eid = await app.gptemployeedata_dal.create_gpt_employee_data(employee_id=new_id, employee_embedding=new_embedding)
    return NewEmployeeResponse(
        id=new_id, 
        name=employee.name,
        account=employee.account,
        password=hashed_password,
        department=employee.department,
        age=employee.age,
        position=employee.position,
        seniority=employee.seniority,
        region=employee.region
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
        sender_id=tech_post.sender_id,
        answered=False,
    )
    
    embed = await get_embedding(tech_post.content)
    await app.gptdata_dal.create_gpt_data(
        tech_post_id=new_id,
        tech_post_embedding=embed
    )
    
    return NewTechPostResponse(
        id=new_id, 
        content=tech_post.content,
    )

@app.patch("/api/techpost/bestcomment/{techpost_id}/{best_comment_id}/{setBest}")
async def update_best_comment(techpost_id: str, best_comment_id: str, setBest: bool):
    await app.techpost_dal.update_best_comment(techpost_id, best_comment_id, setBest)
    await app.techcomment_dal.set_as_best_comment(best_comment_id, techpost_id, setBest)

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

class NewEmoMsgResponse(BaseModel):
    id: str
    sender_id: str
    content: str
    rcvr_id : list[str]

class EmoMsgCreate(BaseModel):
    sender_id: str
    content: str

# create a emo msg
@app.post("/api/emomsg", status_code=status.HTTP_201_CREATED)
async def create_emomsg(emomsg: EmoMsgCreate) -> NewEmoMsgResponse:
    similar_employee = await app.employee_dal.find_similar_employee(sender_id=emomsg.sender_id)
    similar_employee_ids = [employee["_id"] for employee in similar_employee]
    new_id = await app.emomsg_dal.create_emo_msg(
        sender_id=emomsg.sender_id,
        content=emomsg.content,
        rcvr_id=similar_employee_ids
    )
    return NewEmoMsgResponse(
        id=new_id, 
        sender_id=emomsg.sender_id,
        content=emomsg.content,
        rcvr_id=similar_employee_ids
    )
    
@app.post("/api/emomsg_to", status_code=status.HTTP_201_CREATED)
async def create_emomsg(emomsg: EmoMsgCreate) -> NewEmoMsgResponse:
    new_id = await app.emomsg_dal.create_emo_msg(
        sender_id=emomsg.sender_id,
        content=emomsg.content,
        rcvr_id=emomsg.rcvr_id
    )
    return NewEmoMsgResponse(
        id=new_id, 
        sender_id=emomsg.sender_id,
        content=emomsg.content,
        rcvr_id=emomsg.rcvr_id
    )

class NewEmoReplyResponse(BaseModel):
    id: str
    emo_msg_id: str
    content: str
    state: str

class EmoReplyCreate(BaseModel):
    emo_msg_id: str
    sender_id: str
    content: str

# create a emo reply
@app.post("/api/emoreply", status_code=status.HTTP_201_CREATED)
async def create_emoreply(emoreply: EmoReplyCreate) -> NewEmoReplyResponse:
    isAnswered = await app.emomsg_dal.get_emo_msg(id=emoreply.emo_msg_id)
    if isAnswered.answered:
        return NewEmoReplyResponse(
            id="",
            emo_msg_id=emoreply.emo_msg_id,
            content="",
            state="The emo msg is answered"
        )
        
    new_id = await app.emoreply_dal.create_emo_reply(
        emo_msg_id=emoreply.emo_msg_id,
        sender_id=emoreply.sender_id,
        content=emoreply.content
    )
    
    # set corresponding emomsg answered=True
    if new_id:
        await app.emomsg_dal.update_answered(
            emo_msg_id=emoreply.emo_msg_id,
            answer=True,
        )
        
    return NewEmoReplyResponse(
        id=new_id,
        emo_msg_id=emoreply.emo_msg_id,
        content=emoreply.content,
        state="successfully updated"
    )

class NewParagraphSubmit(BaseModel):
    tech_prob: str
    emo_prob: str

class ParagraphResponseCreate(BaseModel):
    msg: str
    
class NewSingleResponse(BaseModel):
    msg:str

@app.post("/api/submit-paragraph", status_code=status.HTTP_201_CREATED)
async def gpt_devide_problem(paragraph: ParagraphResponseCreate) -> NewParagraphSubmit:
    response = await gpt_separate_paragraph(paragraph.msg)
    return NewParagraphSubmit(
        tech_prob=response["tech_prob"],
        emo_prob=response["emo_prob"]
    )
    

@app.post("/api/search/similar", status_code=status.HTTP_201_CREATED)
async def gpt_get_similar_techpost_id(paragraph: ParagraphResponseCreate) -> NewSingleResponse:
    prob_embed = await get_embedding(paragraph.msg)
    gpt_data_list = await app.gptdata_dal.list_gpt_data()
    gpt_data = await find_most_similar(gpt_data_list, prob_embed)
    return NewSingleResponse(
        msg=gpt_data.tech_post_id
    )

class NewEmployeeSearchResponseCreate(BaseModel):
    employee_info_list: List[GPTEmployeeData]
    msg: str

class NewEmployeeSearchResponse(BaseModel):
    msg: str

@app.post("/api/search/matchrcvr", status_code=status.HTTP_201_CREATED)
async def get_matched_receiver_id(
        input_data: NewEmployeeSearchResponseCreate
    ) -> NewEmployeeSearchResponse:
    try:
        embedding_record = await app.gptemployeedata_dal.get_an_embedding(id=input_data.msg)
        if not embedding_record:
            raise HTTPException(status_code=404, detail="Embedding not found for the provided ID.")
        
        employee_embedding = embedding_record.employee_embedding
        matched_employee_id = await gpt_get_rcvr_id_mostmatched(
            new_embedding=employee_embedding,
            gpt_employee_data_list=input_data.employee_info_list
        )

        return NewEmployeeSearchResponse(msg=matched_employee_id)
    
    except Exception as e:
        # Log the exception as needed
        raise HTTPException(status_code=500, detail=str(e))
class NewEmployeeSearchResponseCreate2(BaseModel):
    employee_info_list: List[GPTEmployeeData]
    msg: str

class NewEmployeeSearchResponse2(BaseModel):
    msg: str
    
@app.post("/api/search/unmatchrcvr", status_code=status.HTTP_201_CREATED)
async def get_unmatched_receiver_id(
        input_data: NewEmployeeSearchResponseCreate2
    ) -> NewEmployeeSearchResponse2:
    try:
        embedding_record = await app.gptemployeedata_dal.get_an_embedding(id=input_data.msg)
        if not embedding_record:
            raise HTTPException(status_code=404, detail="Embedding not found for the provided ID.")
        
        employee_embedding = embedding_record.employee_embedding
        matched_employee_id = await gpt_get_rcvr_id_mostunmatched(
            new_embedding=employee_embedding,
            gpt_employee_data_list=input_data.employee_info_list
        )

        return NewEmployeeSearchResponse2(msg=matched_employee_id)
    
    except Exception as e:
        # Log the exception as needed
        raise HTTPException(status_code=500, detail=str(e))
    
class NewSearchResponseCreate(BaseModel):
    history_answer_list: List[str]
    msg: str

class NewSearchResponse(BaseModel):
    msg: str
    
@app.post("/api/search/techpost", status_code=status.HTTP_201_CREATED)
async def gpt_get_presearched_answer(
        inputData: NewSearchResponseCreate
    ) -> NewSearchResponse:
    print("ytytyt", inputData.msg)
    print("ytytyt", inputData.history_answer_list)
    answer = await gpt_pre_answer_tech_post(inputData.msg, inputData.history_answer_list)
    return NewSearchResponse(
        msg=answer
    )

# Pydantic model for Campaign Creation
class CampaignCreate(BaseModel):
    name: str
    description: str
    price: int
    image_path: str
    quantity: int
    lasting_hours: int
    attenders_id: Optional[List[str]] = []

# Pydantic model for Campaign Update
class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    image_path: Optional[str] = ""
    quantity: Optional[int] = None
    lasting_hours: Optional[int] = None
    attenders_id: Optional[List[str]] = []

# create campaign
@app.post("/api/campaign", status_code=status.HTTP_201_CREATED)
async def create_campaign(campaign: CampaignCreate) -> CampaignData:
    campaign_id = await app.campaigndata_dal.create_campaign(
        name=campaign.name,
        description=campaign.description,
        price=campaign.price,
        image_path=campaign.image_path,
        quantity=campaign.quantity,
        lasting_hours=campaign.lasting_hours,
        attenders_id=campaign.attenders_id
    )
    created_campaign = await app.campaigndata_dal.get_a_campaign(campaign_id)
    if not created_campaign:
        raise HTTPException(status_code=500, detail="Failed to create campaign")
    return created_campaign

#update the campaign
@app.put("/api/campaign/{campaign_id}", status_code=status.HTTP_200_OK)
async def update_campaign(campaign_id: str, campaign_update: CampaignUpdate):
    # Attempt to update the campaign using the provided fields
    updated = await app.campaigndata_dal.update_campaign(
        id=campaign_id,
        name=campaign_update.name,
        description=campaign_update.description,
        price=campaign_update.price,
        image_path=campaign_update.image_path,
        quantity=campaign_update.quantity,
        lasting_hours=campaign_update.lasting_hours,
        attenders_id=campaign_update.attenders_id
    )
    
    if not updated:
        raise HTTPException(status_code=404, detail="Campaign not found or no changes made")

    # Fetch the updated campaign details to return
    updated_campaign = await app.campaigndata_dal.get_a_campaign(campaign_id)
    if not updated_campaign:
        raise HTTPException(status_code=500, detail="Failed to update campaign")

    return updated_campaign

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
        "age": user.age,
        "position": user.position,
        "seniority": user.seniority,
        "region": user.region,
        "wallet": user.wallet,
        "score": user.score
    }
    
    return {"access_token": access_token, "token_type": "bearer", "user": employee}

def main(argv=sys.argv[1:]):
    try:
        uvicorn.run("server:app", host="0.0.0.0", port=3001, reload=DEBUG)
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()