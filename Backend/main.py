from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from dotenv import load_dotenv
# from app.rag.loader import load_pdf
from fastapi import FastAPI
load_dotenv()
from app.routes.home import router as home_router
from app.routes.upload import router as upload_router
from app.routes.ask import router as ask_router
from app.routes.documents import router as documents_router
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine, Base
from app.models.userModel import User
from app.models.documentModel import Document
Base.metadata.create_all(bind=engine)

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"]
)


app.include_router(home_router)
app.include_router(upload_router)
app.include_router(ask_router)
app.include_router(documents_router)

Base.metadata.create_all(bind=engine)


@app.get("/test_db")
def test_db():
    with engine.connect() as connection:
        result=connection.execute(text("SELECT 1"))
        return{"result":result.scalar()}









