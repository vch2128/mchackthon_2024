from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Employee(BaseModel):
    id: str
    name: str
    account: str
    password: str
    department: str
    wallet: int
    score: int

    @staticmethod
    def from_doc(doc) -> "Employee":
        return Employee(
            id=str(doc["_id"]),
            name=doc["name"],
            account=doc["account"],
            password=doc["password"],
            department=doc["department"],
            wallet=doc["wallet"],
            score=doc["score"],
        )

class TechPost(BaseModel):
    id: str
    createdAt: datetime
    topic: str
    content: str
    sender_id: str
    answered: bool
    best_comment_id: Optional[str]

    @staticmethod
    def from_doc(doc) -> "TechPost":
        return TechPost(
            id=str(doc["_id"]),
            createdAt=doc["createdAt"],
            topic=doc["topic"],
            content=doc["content"],
            sender_id=str(doc["sender_id"]),
            answered=doc["answered"],
            best_comment_id=str(doc["best_comment_id"]) if "best_comment_id" in doc else None,
        )

class TechComment(BaseModel):
    id: str
    createdAt: datetime
    content: str
    sender_id: str
    tech_post_id: str

    @staticmethod
    def from_doc(doc) -> "TechComment":
        return TechComment(
            id=str(doc["_id"]),
            createdAt=doc["createdAt"],
            content=doc["content"],
            sender_id=str(doc["sender_id"]),
            tech_post_id=str(doc["tech_post_id"]),
        )

class EmoMsg(BaseModel):
    id: str
    createdAt: datetime
    sender_id: str
    topic: str
    content: str
    rcvr_id: str
    answered: bool

    @staticmethod
    def from_doc(doc) -> "EmoMsg":
        return EmoMsg(
            id=str(doc["_id"]),
            createdAt=doc["createdAt"],
            sender_id=doc["sender_id"],
            topic=doc["topic"],
            content=doc["content"],
            rcvr_id=str(doc["rcvr_id"]),
            answered=doc["answered"]
        )

class EmoReply(BaseModel):
    id: str
    createdAt: datetime
    emo_msg_id: str
    sender_id: str
    content: str
    score: int
    
    @staticmethod
    def from_doc(doc) -> "EmoMsg":
        return EmoMsg(
            id=str(doc["_id"]),
            createdAt=doc["createdAt"],
            emo_msg_id=doc["emo_msg_id"],
            sender_id=doc["sender_id"],
            content=doc["content"],
            score=doc["score"]
        )