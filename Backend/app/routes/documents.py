import os
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.rag.vector_store import get_vector_store

router=APIRouter()
UPLOAD_DIR="/app/uploads"
@router.delete("/document/{document_id}")
async def delete_document(document_id:str):
    store=get_vector_store()
    existing=store._collection.get(where={"document_id": document_id})
    if not existing["ids"]:
        raise HTTPException(status_code=404, detail="Document not found")   
    # print(existing)
    filenames={
        meta.get("document_name")
        for meta in existing["metadatas"]
        if meta and meta.get("document_name")
    }
    store._collection.delete(where={"document_id": document_id})
    removed_files=[]
    for filename in filenames:
        filepath=os.path.join(UPLOAD_DIR,filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            removed_files.append(filename)
    return {
        "document_id": document_id,
        "chunks_deleted": len(existing["ids"]),
        "files_removed": removed_files,
        "message": "Document deleted successfully."
        }
    