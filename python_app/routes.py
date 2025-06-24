from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from models import ScrapeRequest, PaperExtractionRequest, GitHubExtractionRequest
from services.extraction_service import ExtractionService
from storage import storage

router = APIRouter()


@router.post("/scrape")
async def scrape_website(request: ScrapeRequest) -> Dict[str, Any]:
    """Scrape and extract data from a website"""
    try:
        extracted_data = await ExtractionService.scrape_website(request.url)
        return extracted_data.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scrape website: {str(e)}")


@router.post("/extract-paper")
async def extract_paper(request: PaperExtractionRequest) -> Dict[str, Any]:
    """Extract data from academic paper using DOI"""
    try:
        paper_data = await ExtractionService.extract_from_paper(request.doi)
        return paper_data.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract from paper: {str(e)}")


@router.post("/github-extract")
async def extract_github(request: GitHubExtractionRequest) -> Dict[str, Any]:
    """Extract data from GitHub repository"""
    try:
        github_data = await ExtractionService.extract_from_github(request.repoUrl)
        return github_data.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract from GitHub: {str(e)}")


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy", "service": "Dermatology AI Model Card Generator"}


@router.get("/")
async def root() -> Dict[str, str]:
    """Root endpoint"""
    return {
        "message": "Dermatology AI Model Card Generator API",
        "version": "1.0.0",
        "endpoints": [
            "/api/scrape",
            "/api/extract-paper", 
            "/api/github-extract",
            "/api/health"
        ]
    }