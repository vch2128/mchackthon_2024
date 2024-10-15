# dal_func.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ReturnDocument
from uuid import uuid4
from typing import Optional, AsyncGenerator

from dal_tables import Employee, TechPost, TechComment, EmoMsg

class EmployeeDAL:
    def __init__(self, employee_collection: AsyncIOMotorCollection):
        self._employee_collection = employee_collection

    async def create_employee(
        self, department: str, wallet: int, score: int, session=None
    ) -> str:
        response = await self._employee_collection.insert_one(
            {
                "_id": uuid4().hex,
                "department": department,
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


class TechPostDAL:
    def __init__(self, tech_post_collection: AsyncIOMotorCollection):
        self._tech_post_collection = tech_post_collection

    async def create_tech_post(
        self,
        content: str,
        sender_id: str,
        answered: bool = False,
        best_comment_id: Optional[str] = None,
        session=None,
    ) -> str:
        response = await self._tech_post_collection.insert_one(
            {
                "_id": uuid4().hex,
                "createdAt": datetime.utcnow(),
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
    ) -> AsyncGenerator[TechPost, None]:
        async for doc in self._tech_post_collection.find(
            {"sender_id": employee_id},
            projection={"content": 1, "sender_id": 1, "answered": 1, "best_comment_id": 1},
            sort=[("answered", 1),("createdAt", -1),],
            session=session,
        ):
            yield TechPost.from_doc(doc)

    async def list_tech_posts_without_employee(
        self, employee_id: str, session=None
    ) -> AsyncGenerator[TechPost, None]:
        async for doc in self._tech_post_collection.find(
            {"sender_id": { "$ne": employee_id} },
            projection={"content": 1, "sender_id": 1, "answered": 1, "best_comment_id": 1},
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


class EmoMsgDAL:
    def __init__(self, emo_msg_collection: AsyncIOMotorCollection):
        self._emo_msg_collection = emo_msg_collection

    async def create_emo_msg(
        self,
        type: str,
        score: int,
        content: str,
        sender_id: str,
        rcvr_id: str,
        answered: bool = False,
        session=None,
    ) -> str:
        response = await self._emo_msg_collection.insert_one(
            {
                "_id": uuid4().hex,
                "createdAt": datetime.utcnow(),
                "type": type,
                "score": score,
                "content": content,
                "sender_id": sender_id,
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

    async def list_emo_msgs(self, sender_id: Optional[str] = None, session=None):
        query = {"sender_id": sender_id} if sender_id else {}
        async for doc in self._emo_msg_collection.find(query, session=session):
            yield EmoMsg.from_doc(doc)

    