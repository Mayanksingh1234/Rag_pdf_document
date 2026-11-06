def get_retriever(vector_store, k: int = 4, search_type: str = "similarity", document_id:str=None):
    """
    Wraps the Chroma vector store as a LangChain retriever.

    Args:
        vector_store: A Chroma VectorStore instance (from vector_store.py).
        k: Number of chunks to retrieve per query.
        search_type: "similarity", "mmr", or "similarity_score_threshold".

    Returns:
        A LangChain VectorStoreRetriever.
    """

    search_kwargs={"k":k}
    if document_id:
        search_kwargs["filter"]={"document_id":document_id}

    retriever = vector_store.as_retriever(

        search_type=search_type,
        search_kwargs=search_kwargs
    )
    return retriever