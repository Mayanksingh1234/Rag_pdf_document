from app.supabase_client import supabase
from app.rag.embedding import get_embeddings


def get_embedding_model():
    return get_embeddings()


def add_document_chunks(chunks, document_id):
    print("STEP 8A: Preparing texts")

    texts = [chunk.page_content for chunk in chunks]

    print(f"STEP 8B: Generating embeddings for {len(texts)} chunks")

    embeddings = get_embedding_model()
    vectors = embeddings.embed_documents(texts)

    print(f"STEP 8C: Embeddings generated - {len(vectors)}")

    rows = []

    for i, (chunk, vector) in enumerate(zip(chunks, vectors)):
        rows.append({
            "document_id": document_id,
            "content": chunk.page_content,
            "chunk_index": i,
            "page_number": chunk.metadata.get("page", 0) + 1,
            "token_count": len(chunk.page_content.split()),
            "embedding": vector,
        })

    response = (
        supabase
        .table("document_chunks")
        .insert(rows)
        .execute()
    )

    return response.data


def search_document_chunks(
    query,
    document_id=None,
    user_id=None,
    k=5
):
    embeddings = get_embedding_model()

    query_embedding = embeddings.embed_query(query)

    response = (
        supabase
        .rpc(
            "match_document_chunks",
            {
                "query_embedding": query_embedding,
                "match_count": k,
                "filter_document_id": document_id,
                "filter_user_id": user_id,
            }
        )
        .execute()
    )

    return response.data