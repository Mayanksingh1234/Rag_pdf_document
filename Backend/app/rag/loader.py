from langchain_community.document_loaders import PyPDFLoader
from pathlib import Path
def load_pdf(file_path):
    loader=PyPDFLoader(file_path)
    documents=loader.load()
    return documents



# try:
#     pdf_path=Path("./uploads/resume.pdf")
#     documents=load_pdf(pdf_path)
#     print("Documents loaded successfully.")
# except Exception as e:
#     print("Error occurred while loading PDF:", e)