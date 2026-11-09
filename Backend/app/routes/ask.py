from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from app.rag.chain import get_rag_chain
from app.auth.auth import get_current_user

router = APIRouter()


class AskRequest(BaseModel):
    query: str = Field(..., min_length=1)
    k: int = Field(default=6, ge=1, le=20)
    document_id: str | None = None


@router.post("/ask")
async def ask_question(
    payload: AskRequest,
    current_user=Depends(get_current_user)
):
    try:
        user_id = str(current_user.id)

        chain = get_rag_chain(
            k=payload.k,
            document_id=payload.document_id,
            user_id=user_id
        )

        answer = chain.invoke(payload.query)

    except EnvironmentError as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to answer question: {e}"
        )

    return {
        "query": payload.query,
        "answer": answer
    }