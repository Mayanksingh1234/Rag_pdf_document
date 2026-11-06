import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.rag.loader import load_pdf
from app.rag.splitter import split_document
from app.rag.vector_store import vector_store
from app.database import get_db
from app.models.documentModel import Document

router = APIRouter()
UPLOAD_DIR = "/app/uploads"


@router.post("/upload")
def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith(".pdf") or file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    document_id = str(uuid.uuid4())

    # saved under the UUID so same-named files never overwrite each other
    filepath = os.path.join(UPLOAD_DIR, f"{document_id}.pdf")
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    doc = Document(
        id=document_id,
        # user_id=current_user.id,   # add once login/auth is wired in
        filename=file.filename,
        stored_path=filepath,
        status="processing",
    )
    db.add(doc)
    db.commit()

    try:
        pdf_file = load_pdf(filepath)
        chunks = split_document(pdf_file)

        for chunk in chunks:
            chunk.metadata["document_id"] = document_id
            chunk.metadata["document_name"] = file.filename
            # chunk.metadata["user_id"] = current_user.id

        vector_store(chunks)

        doc.pages = len(pdf_file)
        doc.chunk_count = len(chunks)
        doc.status = "ready"
        db.commit()
    except Exception as e:
        doc.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Processing failed: {e}")

    return {
        "document_id": document_id,
        "filename": file.filename,
        "pages": doc.pages,
        "message": "File uploaded successfully",
    }