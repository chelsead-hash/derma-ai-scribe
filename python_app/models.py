from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class User(BaseModel):
    id: int
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    password: str


class ScrapeRequest(BaseModel):
    url: str = Field(..., description="URL to scrape")


class PaperExtractionRequest(BaseModel):
    doi: str = Field(..., description="DOI of the paper to extract")


class GitHubExtractionRequest(BaseModel):
    repoUrl: str = Field(..., description="GitHub repository URL")


class ExtractedData(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None
    datasetInfo: Optional[Dict[str, Any]] = None
    technicalSpecs: Optional[Dict[str, Any]] = None
    sourceUrl: str
    sourceType: str = "website"
    extractedAt: datetime = Field(default_factory=datetime.now)


class PaperData(BaseModel):
    title: str
    authors: List[str]
    journal: str
    year: str
    doi: str
    abstract: str
    metrics: Optional[Dict[str, Any]] = None
    datasetInfo: Optional[Dict[str, Any]] = None
    sourceType: str = "peer-reviewed-paper"
    extractedAt: datetime = Field(default_factory=datetime.now)


class GitHubData(BaseModel):
    name: str
    description: Optional[str] = None
    stars: int
    language: Optional[str] = None
    readme: str
    metrics: Optional[Dict[str, Any]] = None
    technicalSpecs: Optional[Dict[str, Any]] = None
    requirements: Optional[List[str]] = None
    sourceType: str = "github-repository"
    sourceUrl: str
    extractedAt: datetime = Field(default_factory=datetime.now)