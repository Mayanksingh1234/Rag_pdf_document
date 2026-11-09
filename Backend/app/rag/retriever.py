from app.rag.vector_store import search_document_chunks


def get_retriever(
    k: int = 4,
    document_id: str = None,
    user_id: str = None
):
    def retrieve(query: str):
        return search_document_chunks(
            query=query,
            document_id=document_id,
            user_id=user_id,
            k=k
        )

    return retrieve