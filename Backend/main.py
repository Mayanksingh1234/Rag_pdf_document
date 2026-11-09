from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes.home import router as home_router
from app.routes.upload import router as upload_router
from app.routes.ask import router as ask_router
from app.routes.documents import router as documents_router

load_dotenv()

app = FastAPI(title="PDF RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(home_router)
app.include_router(upload_router)
app.include_router(ask_router)
app.include_router(documents_router)


@app.get("/")
def root():
    return {"message": "PDF RAG API is running"}