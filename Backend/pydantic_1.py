from pydantic import BaseModel, Field
from typing import List,Annotated
class Patient(BaseModel):
    name: str=Field(min_length=2,max_length=30)
    age: int=Field(gt=0,lt=100)
    weight:Annotated[float,Field(gt=0, strict=True)]
    married:Annotated[bool, Field(default=False, description="the patient is married or not")]
    allergies:List[str]=[]

def insert_patient_details(patient:Patient):
    print(patient.name)
    print(patient.age)
    print(patient.weight)
    print(patient.married)
    print(patient.allergies)
    print("inserted patient details successfully")
sample={"name":"mayank singh","age":10,"weight":70.9,"married":True,"allergies":["dust"]}
patient1=Patient(**sample)
# print(patient1)
if(patient1):
    insert_patient_details(patient1)
else:
    raise ValueError("Patient details are not valid")