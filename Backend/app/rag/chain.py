import os

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI

from app.rag.retriever import get_retriever





def format_docs(rows):
    """Format Supabase search results into RAG context."""
    formatted = []

    for row in rows:
        page = row.get("page_number", "unknown")
        content = row.get("content", "")

        formatted.append(
            f"[page {page}] {content}"
        )

    return "\n\n".join(formatted)


def get_llm(
    model: str = "gemini-2.5-flash",
    temperature: float = 0,
):
    token = os.environ.get("GEMINI_API_KEY")

    if not token:
        raise EnvironmentError(
            "GEMINI_API_KEY is not set."
        )

    return ChatGoogleGenerativeAI(
        model=model,
        temperature=temperature,
    )


PROMPT_TEMPLATE = """You are a highly accurate document question-answering assistant.

Your task is to answer the user's question using ONLY the information provided in the retrieved context from the uploaded documents.

IMPORTANT RULES:

1. Read the user's question carefully and identify exactly what information is being requested.

2. Use the retrieved context to find the most relevant information.
   - Prefer chunks that directly answer the question.
   - Combine information from multiple chunks when necessary.
   - Ignore irrelevant or unrelated chunks.

3. Do NOT use outside knowledge, assumptions, or information that is not present in the retrieved context.

4. If the retrieved context contains enough information to answer the question:
   - Give a clear and accurate answer.
   - Explain the answer briefly when necessary.
   - Preserve important numbers, dates, names, conditions, and definitions exactly as supported by the documents.

5. If the answer requires information from multiple sections of the document, combine those sections logically instead of answering from only one chunk.

6. If the retrieved context does NOT contain enough information to answer the question, say:
   "I couldn't find enough information in the provided documents to answer this question."

   Do NOT guess or fabricate an answer.

7. If the question is ambiguous, explain what is unclear and answer only the part that can be supported by the documents.

8. If the user asks for a summary, comparison, explanation, list, or specific value, format the answer appropriately.

9. Keep the answer concise and directly relevant to the user's question. Do not unnecessarily repeat the context.

10. When possible, mention the document or section from which the answer was obtained.

Context:
{context}

Question:
{question}

Answer:"""


def get_rag_chain(
    k: int = 4,
    document_id: str = None,
    user_id: str = None,
    **llm_kwargs
):
    retriever = get_retriever(
        k=k,
        document_id=document_id,
        user_id=user_id
    )

    llm = get_llm(**llm_kwargs)

    prompt = ChatPromptTemplate.from_template(
        PROMPT_TEMPLATE
    )

    def retrieve_context(question: str) -> str:
        rows = retriever(question)

        return format_docs(rows)

    rag_chain = (
        {
            "context": RunnableLambda(retrieve_context),
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain