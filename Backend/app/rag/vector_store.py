from langchain_chroma import Chroma 
from app.rag.embedding import get_embedding_model


def vector_store(chunks):
    embeddings=get_embedding_model()
    vector_store=Chroma(
        collection_name="pdf_documents",
        embedding_function=embeddings,
        persist_directory="./chroma_db"
    )
    vector_store.add_documents(chunks)
    return vector_store

def get_vector_store():
    embeddings=get_embedding_model()
    vector_store=Chroma(
        collection_name="pdf_documents",
        embedding_function=embeddings,
        persist_directory="./chroma_db"
    )
    return vector_store