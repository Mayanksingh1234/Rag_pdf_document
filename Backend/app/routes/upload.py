import os
import uuid
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends

from app.rag.loader import load_pdf
from app.rag.splitter import split_document
from app.rag.vector_store import add_document_chunks
from app.supabase_client import supabase

from app.auth.auth import get_current_user
router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    # 1. Validate PDF
    if (
        not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF files are allowed."
        )

    # 2. Create document ID
    document_id = str(uuid.uuid4())

    # TODO: replace with actual authenticated user ID
    # For now, this is temporary.
    # user_id = "YOUR_USER_ID"
    user_id = str(current_user.id)

    # 3. Read file
    file_content = await file.read()

    # 4. Supabase Storage path
    storage_path = f"{user_id}/{document_id}/{file.filename}"

    try:
        print("FILE SIZE:", len(file_content), "bytes")
        print("STORAGE PATH:", storage_path)
        print("STEP 1: Uploading PDF to Storage")

        supabase.storage.from_("Pdfs").upload(
            storage_path,
            file_content,
            {
                "content-type": "application/pdf"
            }
        )

        print("STEP 2: PDF uploaded")

        document_data = {
            "id": document_id,
            "user_id": user_id,
            "file_name": file.filename,
            "storage_path": storage_path,
            "file_size": len(file_content),
            "mime_type": "application/pdf",
            "status": "processing",
        }

        print("STEP 3: Inserting document")

        supabase.table("documents").insert(document_data).execute()

        print("STEP 4: Document inserted")

        temp_path = os.path.join(
        tempfile.gettempdir(),
        f"{document_id}.pdf"
        )

        with open(temp_path, "wb") as temp_file:
            temp_file.write(file_content)

        print("STEP 5: Loading PDF")

        pdf_documents = load_pdf(temp_path)

        print(f"STEP 6: PDF loaded - {len(pdf_documents)} pages")

        chunks = split_document(pdf_documents)

        print(f"STEP 7: Chunks created - {len(chunks)}")

        add_document_chunks(
            chunks,
            document_id
        )

        print("STEP 8: Embeddings/chunks inserted")

        supabase.table("documents").update({
            "page_count": len(pdf_documents),
            "chunk_count": len(chunks),
            "status": "ready"
        }).eq(
            "id",
            document_id
        ).execute()

        print("STEP 9: Document marked ready")
        os.remove(temp_path)

        return {
            "document_id": document_id,
            "filename": file.filename,
            "pages": len(pdf_documents),
            "chunk_count": len(chunks),
            "message": "File uploaded successfully"
        }
    except Exception as e:

        # Mark document as failed
        try:
            supabase.table("documents").update({
                "status": "failed"
            }).eq(
                "id",
                document_id
            ).execute()
        except Exception:
            pass

        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )