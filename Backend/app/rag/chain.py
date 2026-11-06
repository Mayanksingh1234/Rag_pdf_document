import os

from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from app.rag.retriever import get_retriever

BGE_QUERY_INSTRUCTION = "Represent this sentence for searching relevant passages: "


def format_docs(docs):
    """Join retrieved chunks into a single context string, citing source page numbers."""
    formatted = []
    for doc in docs:
        page = doc.metadata.get("page", "unknown")
        formatted.append(f"[page {page}] {doc.page_content}")
    return "\n\n".join(formatted)


def get_llm(
    # repo_id: str = "deepseek-ai/DeepSeek-V4.1-Flash-1017",
    # max_new_tokens: int = 512,
    # temperature: float = 0.3,
    model: str = "gemini-2.5-flash",
    temperature: float = 0,
):
    """
    Creates a chat-capable LLM backed by the HuggingFace Inference API.

    Requires the HUGGINGFACEHUB_API_TOKEN environment variable to be set
    (or pass huggingfacehub_api_token=... explicitly).
    """
    # token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")
    # if not token:
    #     raise EnvironmentError(
    #         "HUGGINGFACEHUB_API_TOKEN is not set. "
    #         "Get a token from https://huggingface.co/settings/tokens "
    #         "and set it as an environment variable."
    #     )
    token = os.environ.get("GEMINI_API_KEY")
    if not token:
            raise EnvironmentError(
                "GEMINI_API_KEY is not set. "
                "Get a token from https://aistudio.google.com/ "
                "and set it as an environment variable."
            )

    # endpoint = HuggingFaceEndpoint(
    #     repo_id=repo_id,
    #     max_new_tokens=max_new_tokens,
    #     temperature=temperature,
    #     huggingfacehub_api_token=token,
    # )
    # chat_model = ChatHuggingFace(llm=endpoint)
    # return chat_model
    return ChatGoogleGenerativeAI(
        model=model,
        temperature=temperature,
    )



PROMPT_TEMPLATE = """You are a helpful assistant answering questions about a PDF document.
Use only the context below to answer. you can also elaborate on the answer if needed.
If the answer isn't in the context, say you don't know.

Context:
{context}

Question:
{question}

Answer:"""


def get_rag_chain(vector_store, k: int = 4, document_id: str = None, **llm_kwargs):
    """
    Builds an end-to-end RAG chain: retrieve chunks -> format -> prompt -> LLM -> string output.

    The BGE instruction prefix is applied ONLY for embedding/retrieval, never
    sent to the LLM as part of the actual question — otherwise the model tries
    to literally follow it instead of answering.

    Usage:
        chain = get_rag_chain(vector_store)
        answer = chain.invoke("What are the candidate's key skills?")
    """
    retriever = get_retriever(vector_store, k=k, document_id=document_id)
    llm = get_llm(**llm_kwargs)
    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

    def retrieve_context(question: str) -> str:
        prefixed_query = BGE_QUERY_INSTRUCTION + question
        docs = retriever.invoke(prefixed_query)
        return format_docs(docs)

    rag_chain = (
        {"context": RunnableLambda(retrieve_context), "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain