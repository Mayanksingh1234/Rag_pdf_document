import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings


def get_embeddings():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise EnvironmentError("GEMINI_API_KEY is not set.")

    return GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
        google_api_key=api_key,
        task_type="RETRIEVAL_DOCUMENT",
        output_dimensionality=768,
    )