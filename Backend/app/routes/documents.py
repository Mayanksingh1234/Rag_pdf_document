from fastapi import APIRouter, HTTPException, Depends

from app.supabase_client import supabase
from app.auth.auth import get_current_user

router = APIRouter()
@router.get("/documents")
async def get_documents(
    current_user=Depends(get_current_user)
):
    user_id = str(current_user.id)

    response = (
        supabase
        .table("documents")
        .select(
            "id, file_name, file_size, mime_type, page_count, chunk_count, status, created_at"
        )
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data

@router.delete("/document/{document_id}")
async def delete_document(
    document_id: str,
    current_user=Depends(get_current_user)
):
    user_id = str(current_user.id)

    # Check that the document belongs to the current user
    document_response = (
        supabase
        .table("documents")
        .select("id, storage_path, file_name")
        .eq("id", document_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )

    document = document_response.data

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Delete PDF from Supabase Storage
    try:
        supabase.storage.from_("Pdfs").remove([
            document["storage_path"]
        ])
    except Exception:
        pass

    # Delete all chunks belonging to the document
    (
        supabase
        .table("document_chunks")
        .delete()
        .eq("document_id", document_id)
        .execute()
    )

    # Delete the document record
    (
        supabase
        .table("documents")
        .delete()
        .eq("id", document_id)
        .eq("user_id", user_id)
        .execute()
    )

    return {
        "document_id": document_id,
        "file_name": document["file_name"],
        "message": "Document deleted successfully."
    }