import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    filename = Column(String, nullable=False)
    stored_path = Column(String, nullable=False)
    pages = Column(Integer)
    chunk_count = Column(Integer)
    status = Column(String, default="processing")   # processing / ready / failed
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", backref="documents")