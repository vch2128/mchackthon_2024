from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Employee(BaseModel):
    id: str
    department: str
    wallet: int
    score: int

    @staticmethod
    def from_doc(doc) -> "Employee":
        return Employee(
            id=str(doc["_id"]),
            department=doc["department"],
            wallet=doc["wallet"],
            score=doc["score"],
        )

class TechPost(BaseModel):
    id: str
    createdAt: datetime
    content: str
    sender_id: str
    answered: bool
    best_comment_id: Optional[str]

    @staticmethod
    def from_doc(doc) -> "TechPost":
        return TechPost(
            id=str(doc["_id"]),
            createdAt=doc["createdAt"],
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
    type: str
    score: int
    content: str
    sender_id: str
    answered: bool
    rcvr_id: str

    @staticmethod
    def from_doc(doc) -> "EmoMsg":
        return EmoMsg(
            id=str(doc["_id"]),
            createdAt=doc["createdAt"],
            type=doc["type"],
            score=doc["score"],
            content=doc["content"],
            sender_id=str(doc["sender_id"]),
            answered=doc["answered"],
            rcvr_id=str(doc["rcvr_id"]),
        )
