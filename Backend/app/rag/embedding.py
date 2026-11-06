from langchain_huggingface import HuggingFaceEmbeddings

def get_embedding_model(model:str="BAAI/bge-small-en-v1.5"):
    
    embedding=HuggingFaceEmbeddings(
        model_name=model,
        model_kwargs={
            "device":"cpu"
            # "device":"cuda"       this is for the GPU oriented models
        },
        encode_kwargs={
            "normalize_embeddings":True
        }
    )
    return embedding

# print(get_embedding_model())

