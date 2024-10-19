# dal_func.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ReturnDocument
from datetime import datetime, timedelta
from uuid import uuid4
from typing import Optional, AsyncGenerator, List, Union
from gpt import gpt_get_topic
from dal_tables import Employee, TechPost, TechComment, EmoMsg, EmoReply, GPTData, GPTEmployeeData, CampaignData

class EmployeeDAL:
    def __init__(self, employee_collection: AsyncIOMotorCollection):
        self._employee_collection = employee_collection

    async def create_employee(
        self, 
        name: str,
        account: str,
        password: str,
        department: str, 
        age: int,
        seniority: int,
        region: str,
        position: str,
        wallet: Optional[int] = 30, 
        score: Optional[int] = 0,
        session=None
    ) -> str:
        response = await self._employee_collection.insert_one(
            {
                "_id": uuid4().hex,
                "name": name,
                "account": account,
                "password": password,
                "department": department,
                "age": age,
                "seniority": seniority,
                "region": region,
                "position": position,
                "wallet": wallet,
                "score": score,
            },
            session=session,
        )
        return str(response.inserted_id)

    async def get_employee(
        self, id: str | ObjectId, session=None
    ) -> Optional[Employee]:
        doc = await self._employee_collection.find_one(
            {"_id": str(id)},
            session=session,
        )
        if doc:
            return Employee.from_doc(doc)
        return None

        
    
    async def list_employees(self, session=None):
        async for doc in self._employee_collection.find({}, session=session):
            yield Employee.from_doc(doc)

    async def get_user_by_username(self, username: str, session=None)-> Optional[Employee]:
        doc = await self._employee_collection.find_one(
            {"name": username},
            session=session,
        )
        if doc:
            return Employee.from_doc(doc)
        return None
    
    async def update_wallet(self, employee_id: str, value: int, session=None) -> int:
        employee = await self._employee_collection.find_one(
            {"_id": employee_id},
            session=session,
        )
        if not employee:
            raise ValueError("Employee not found")
        if employee["wallet"] + value < 0:
            raise ValueError("Insufficient funds")
        new_wallet = employee["wallet"] + value
        await self._employee_collection.update_one(
            {"_id": employee_id},
            {"$set": {"wallet": new_wallet}},
            session=session,
        )
        return new_wallet
    
    async def check_wallet(self, employee_id: str, session=None) -> int:
        employee = await self._employee_collection.find_one(
            {"_id": employee_id},
            session=session,
        )
        if not employee:
            raise ValueError("Employee not found")
        return employee["wallet"]
    
    async def find_similar_employee(self, sender_id: str, session=None) -> Optional[Employee]:
        sender = await self._employee_collection.find_one(
            {"_id": sender_id}, {"_id": 0, "department": 1, "age": 1, "seniority" : 1, "region" : 1}, session=session
        )
        if not sender:
            raise ValueError("Sender not found")
    
        department = sender["department"]
        age = sender["age"]
        seniority = sender["seniority"]
        region = sender["region"]

        
        # Find up to 3 users with similar background (same department and similar age)
        similar_employee = await self._employee_collection.find(
            {
                "$or": [
                    {"department": department},
                    {"age": {"$gte": (age - 5), "$lte": (age + 5)}},
                    {"seniority": {"$gte": (seniority - 5), "$lte": (seniority + 5)}}
                ],
                "region": {"$ne": region},  # Ensure employees come from a different region
                "_id": {"$ne": sender_id},  # Exclude the sender themselves
            },
            session=session
        ).limit(3).to_list(length=3)
    
        return similar_employee
         

    async def get_wallet_and_score(
        self, id: str | ObjectId, session=None
    ) -> Optional[dict[str, int]]:
        """
        Get wallet and score of an employee by their ID.
        Returns a dictionary containing 'wallet' and 'score'.
        """
        # Fetch only the wallet and score fields
        doc = await self._employee_collection.find_one(
            {"_id": str(id)},
            {"wallet": 1, "score": 1, "_id": 0},  # Project only wallet and score
            session=session,
        )
        if doc:
            return {"wallet": doc.get("wallet", 0), "score": doc.get("score", 0)}
        return None



class TechPostDAL:
    def __init__(self, tech_post_collection: AsyncIOMotorCollection):
        self._tech_post_collection = tech_post_collection

    async def create_tech_post(
        self,
        content: str,
        sender_id: str,
        topic: Optional[str] = "No Topic",
        answered: bool = False,
        best_comment_id: Optional[str] = None,
        session=None,
    ) -> str:
        gpt_topic = await gpt_get_topic(content)
        
        response = await self._tech_post_collection.insert_one(
            {
                "_id": uuid4().hex,
                "createdAt": datetime.utcnow(),
                "topic": gpt_topic,
                "content": content,
                "sender_id": sender_id,
                "answered": answered,
                "best_comment_id": best_comment_id,
            },
            session=session,
        )
        return str(response.inserted_id)

    async def get_tech_post(
        self, id: str | ObjectId, session=None
    ) -> Optional[TechPost]:
        doc = await self._tech_post_collection.find_one(
            {"_id": str(id)},
            session=session,
        )
        if doc:
            return TechPost.from_doc(doc)
        return None

    async def list_tech_posts(self, session=None):
        async for doc in self._tech_post_collection.find({}, session=session):
            yield TechPost.from_doc(doc)
    
    # Add this method to filter tech posts by employee ID
    async def list_tech_posts_by_employee(
        self, employee_id: str, session=None
    ) :
        async for doc in self._tech_post_collection.find(
            {"sender_id": employee_id},
            sort=[("answered", 1),("createdAt", -1)],
            session=session,
        ):
            yield TechPost.from_doc(doc)

    async def list_tech_posts_without_employee(
        self, employee_id: str, session=None
    ):
        async for doc in self._tech_post_collection.find(
            {"sender_id": { "$ne": employee_id} },
            sort=[("answered", 1),("createdAt", -1),],
            session=session,
        ):
            yield TechPost.from_doc(doc)
            
            
class TechCommentDAL:
    def __init__(self, tech_comment_collection: AsyncIOMotorCollection):
        self._tech_comment_collection = tech_comment_collection

    async def create_tech_comment(
        self,
        content: str,
        sender_id: str,
        tech_post_id: str,
        session=None,
    ) -> str:
        response = await self._tech_comment_collection.insert_one(
            {
                "_id": uuid4().hex,
                "createdAt": datetime.utcnow(),
                "content": content,
                "sender_id": sender_id,
                "tech_post_id": tech_post_id,
            },
            session=session,
        )
        return str(response.inserted_id)

    async def get_tech_comment(
        self, id: str | ObjectId, session=None
    ) -> Optional[TechComment]:
        doc = await self._tech_comment_collection.find_one(
            {"_id": str(id)},
            session=session,
        )
        if doc:
            return TechComment.from_doc(doc)
        return None

    async def list_tech_comments(self, tech_post_id: str, session=None):
        async for doc in self._tech_comment_collection.find(
            {"tech_post_id": tech_post_id}, session=session
        ):
            yield TechComment.from_doc(doc)
    
    async def list_tech_comments_inlist(self, tech_post_id: str, session=None) -> List[TechComment]:
        return [comment async for comment in self._tech_comment_collection.find(
            {"tech_post_id": tech_post_id}, session=session
        ).to_list(length=None)]

class EmoMsgDAL:
    def __init__(self, emo_msg_collection: AsyncIOMotorCollection):
        self._emo_msg_collection = emo_msg_collection

    async def create_emo_msg(
        self,
        sender_id: str,
        content: str,
        rcvr_id: List[str],
        topic: Optional[str] = "No Topic",
        answered: Optional[bool] = False,
        session=None,
    ) -> str:
        gpt_topic = await gpt_get_topic(content)
        response = await self._emo_msg_collection.insert_one(
            {
                "_id": uuid4().hex,
                "createdAt": datetime.utcnow(),
                "sender_id": sender_id,
                "topic": gpt_topic,
                "content": content,
                "rcvr_id": rcvr_id,
                "answered": answered,
            },
            session=session,
        )
        return str(response.inserted_id)

    async def get_emo_msg(
        self, id: str | ObjectId, session=None
    ) -> Optional[EmoMsg]:
        doc = await self._emo_msg_collection.find_one(
            {"_id": str(id)},
            session=session,
        )
        if doc:
            return EmoMsg.from_doc(doc)
        return None

    async def list_emo_msgs_by_sender(self, sender_id: Optional[str] = None, session=None):
        query = {"sender_id": sender_id} if sender_id else {}
        async for doc in self._emo_msg_collection.find(
            query, 
            sort=[("answered", 1),("createdAt", -1),],
            session=session):
            yield EmoMsg.from_doc(doc)
            
    async def list_emo_msgs_by_rcvr(self, rcvr_id: Optional[str] = None, session=None):
        query = {"rcvr_id": rcvr_id} if rcvr_id else {}
        async for doc in self._emo_msg_collection.find(
            query, 
            sort=[("answered", 1),("createdAt", -1),],
            session=session):
            yield EmoMsg.from_doc(doc)
            
    async def update_answered(self, emo_msg_id: Optional[str] = None, answer: Optional[bool] = True, session=None):
        result = await self._emo_msg_collection.update_one(
            {"_id": emo_msg_id},
            {"$set": {"answered": answer}},
            session=session
        )
        return result.modified_count > 0
    
class EmoReplyDAL:
    def __init__(self, emo_reply_collection: AsyncIOMotorCollection):
        self._emo_reply_collection = emo_reply_collection
        
    async def create_emo_reply(
        self,
        emo_msg_id: str,
        sender_id: str,
        content: str,
        score: Optional[int] = 0,
        session=None,
    ) -> str:
        response = await self._emo_reply_collection.insert_one(
            {
                "_id": uuid4().hex,
                "createdAt": datetime.utcnow(),
                "emo_msg_id": emo_msg_id,
                "sender_id": sender_id,
                "content": content,
                "score": score,
            },
            session=session,
        )
        return str(response.inserted_id)

    async def get_emo_reply(
        self, id: str | ObjectId, session=None
    ) -> Optional[EmoReply]:
        doc = await self._emo_reply_collection.find_one(
            {"_id": str(id)},
            session=session,
        )
        if doc:
            return EmoReply.from_doc(doc)
        return None

    async def list_emo_replies_by_emo_msg(self, emo_msg_id: Optional[str] = None, session=None):
        query = {"emo_msg_id": emo_msg_id} if emo_msg_id else {}
        async for doc in self._emo_reply_collection.find(
            query, 
            session=session):
            yield EmoReply.from_doc(doc)
            
    async def list_emo_reply_by_sender(self, sender_id: Optional[str] = None, session=None):
        query = {"sender_id": sender_id} if sender_id else {}
        async for doc in self._emo_reply_collection.find(
            query, 
            sort=[("createdAt", -1)],
            session=session):
            yield EmoReply.from_doc(doc)
            
            
class GPTDataDAL:
    def __init__(self, gpt_data_collection: AsyncIOMotorCollection):
        self._gpt_data_collection = gpt_data_collection

    async def create_gpt_data(
        self,
        tech_post_id: str,
        tech_post_embedding: List[float],
        session=None,
    ) -> str:
        response = await self._gpt_data_collection.insert_one(
            {
                "_id": uuid4().hex,
                "tech_post_id": tech_post_id,
                "tech_post_embedding": tech_post_embedding
            },
            session=session,
        )
        return str(response.inserted_id)
    
    async def list_gpt_data(self, session=None):
        async for doc in self._gpt_data_collection.find({}, session=session):
            yield GPTData.from_doc(doc)
            
            
class GPTEmployeeDataDAL:
    def __init__(self, gpt_employee_data_collection: AsyncIOMotorCollection):
        self._gpt_employee_data_collection = gpt_employee_data_collection

    async def create_gpt_employee_data(
        self,
        employee_id: str,
        employee_embedding: List[float],
        session=None,
    ) -> str:
        response = await self._gpt_employee_data_collection.insert_one(
            {
                "_id": uuid4().hex,
                "employee_id": employee_id,
                "employee_embedding": employee_embedding
            },
            session=session,  # Ensure session is properly handled if provided
        )
        return str(response.inserted_id)
    
    async def get_an_embedding(
        self, id: str | ObjectId, session=None
    ) -> Optional[GPTEmployeeData]:
        doc = await self._gpt_employee_data_collection.find_one(
            {"employee_id": str(id)},
            session=session,
        )
        if doc:
            return GPTEmployeeData.from_doc(doc)
        return None
 
    async def list_gpt_employee_data(self, session=None):
        async for doc in self._gpt_employee_data_collection.find({}, session=session):
            yield GPTEmployeeData.from_doc(doc) 
    
class CampaignDataDAL:
    def __init__(self, campaign_data_collection: AsyncIOMotorCollection):
        self._campaign_data_collection = campaign_data_collection

    async def create_campaign(
        self,
        name: str,
        description: str,
        price: int,
        image_path: str,
        quantity: int,
        lasting_hours: int,
        attenders_id: Optional[List[str]] = None,
        session=None,
    ) -> str:
        response = await self._campaign_data_collection.insert_one(
            {
                "_id": uuid4().hex,
                "name": name,
                "description": description,
                "price": price,
                "image_path": image_path,
                "quantity": quantity,
                "expire": datetime.utcnow() + timedelta(hours=lasting_hours),
                "attenders_id": attenders_id if attenders_id else []
            },
            session=session,
        )
        return str(response.inserted_id)

    async def get_a_campaign(
        self, id: str | ObjectId, session=None
    ) -> Optional[CampaignData]:
        doc = await self._campaign_data_collection.find_one(
            {"_id": str(id)},
            session=session,
        )
        if doc:
            return CampaignData.from_doc(doc)
        return None

    async def list_all_campaigns(self, session=None):
        async for doc in self._campaign_data_collection.find(
            {}, session=session
        ):
            yield CampaignData.from_doc(doc)
            
    async def update_campaign(
        self,
        id: Union[str, ObjectId],
        name: Optional[str] = None,
        description:Optional[str] = None,
        price: Optional[int] = None,
        image_path: Optional[str] = None,
        quantity: Optional[int] = None,
        lasting_hours: Optional[int] = None,
        attenders_id: Optional[List[str]] = None,
        session=None,
    ) -> bool:
        update_data = {}
        if name:
            update_data["name"] = name
        if description:
            update_data["description"] = description
        if price:
            update_data["price"] = price
        if image_path:
            update_data["image_path"] = image_path
        if quantity:
            update_data["quantity"] = quantity
        if lasting_hours:
            update_data["expire"] = datetime.utcnow() + timedelta(hours=lasting_hours)
        if attenders_id is not None:
            update_data["attenders_id"] = attenders_id
        
        if not update_data:
            return False  # No updates to apply

        result = await self._campaign_data_collection.update_one(
            {"_id": str(id)},
            {"$set": update_data},
            session=session,
        )
        return result.modified_count > 0