from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.rag.vector_store import get_vector_store
from app.rag.chain import get_rag_chain

router = APIRouter()


class AskRequest(BaseModel):
    query: str = Field(..., min_length=1)
    k: int = Field(default=6, ge=1, le=20)
    document_id: str | None = None  # optional: scope the answer to one uploaded file


@router.post("/ask")
async def ask_question(payload: AskRequest):
    try:
        store = get_vector_store()
        chain = get_rag_chain(store, k=payload.k, document_id=payload.document_id)
        answer = chain.invoke(payload.query)
    except EnvironmentError as e:
        # e.g. HUGGINGFACEHUB_API_TOKEN missing
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {e}")

    return {
        "query": payload.query,
        "answer": answer
    }