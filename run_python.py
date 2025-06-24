#!/usr/bin/env python3
"""
Entry point for the Python version of the Dermatology AI Model Card Generator
"""
import sys
import os

# Add the python_app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python_app'))

from main import app
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("NODE_ENV") == "development" else False
    )