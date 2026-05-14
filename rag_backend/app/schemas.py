from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1)
    top_k: int = Field(default=3, ge=1, le=10)


class QueryResponse(BaseModel):
    answer: str
    sources: list[str]
    num_contexts: int


class IngestTextRequest(BaseModel):
    title: str = Field(..., min_length=1)
    text: str = Field(..., min_length=1)


class IngestResponse(BaseModel):
    message: str
    indexed_count: int
    collection_name: str


class StatusResponse(BaseModel):
    collection_name: str
    data_files: list[str]


class ContactMessageRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1)
