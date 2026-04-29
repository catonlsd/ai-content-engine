from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import json
import re

from llm_service import generate_text
from prompt_builder import (
    build_outline_prompt,
    build_structured_blog_prompt,
    build_seo_analysis_prompt,
    build_linkedin_post_prompt  
)

app = FastAPI(title="AI SEO Blog Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------
# Request Schema
# -------------------------------
class BlogRequest(BaseModel):
    topic: str
    keywords: List[str]
    tone: str = "professional"

class AnalyzeRequest(BaseModel):
    blog: str
    keywords: List[str]

class LinkedInRequest(BaseModel):
    topic: str
    tone: str = "professional"

# -------------------------------
# Helper: Extract JSON safely
# -------------------------------
def extract_json(text: str):
    try:
        return json.loads(text)
    except:
        pass

    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        json_text = match.group()
    else:
        json_text = "{" + text.strip().strip(",") + "}"

    # Fix common issues
    json_text = json_text.replace("\n", "\\n")
    json_text = json_text.replace("\r", "\\r")
    json_text = json_text.replace("\t", "\\t")

    return json.loads(json_text)


# -------------------------------
# Routes
# -------------------------------

@app.get("/")
def home():
    return {
        "message": "AI SEO Blog Generator API is running",
        "docs": "Go to /docs to test the API"
    }


@app.get("/test-ai")
def test_ai():
    prompt = "Write a short blog introduction about learning AI."
    result = generate_text(prompt)
    return {"response": result}


@app.post("/generate-outline")
def generate_outline(request: BlogRequest):
    prompt = build_outline_prompt(request.topic, request.keywords)
    outline = generate_text(prompt)

    return {
        "outline": outline
    }


@app.post("/generate-blog")
def generate_blog(request: BlogRequest):
    prompt = build_structured_blog_prompt(
        request.topic,
        request.keywords,
        request.tone
    )

    max_retries = 3

    for attempt in range(max_retries):
        raw_result = generate_text(prompt)

        try:
            parsed_result = extract_json(raw_result)

            return {
                "title": parsed_result.get("title"),
                "meta_description": parsed_result.get("meta_description"),
                "blog": parsed_result.get("blog"),
                "seo_score": parsed_result.get("seo_score"),
                "seo_explanation": parsed_result.get("seo_explanation"),
                "improvement_suggestions": parsed_result.get("improvement_suggestions"),
                "keywords_used": parsed_result.get("keywords_used")
            }

        except Exception:
            continue

    return {
        "error": "Failed after retries",
        "message": "LLM output could not be parsed"
    }

@app.post("/analyze-seo")
def analyze_seo(request: AnalyzeRequest):
    prompt = build_seo_analysis_prompt(
        request.blog,
        request.keywords
    )

    raw_result = generate_text(prompt)

    try:
        parsed_result = extract_json(raw_result)

        return {
            "seo_score": parsed_result.get("seo_score"),
            "seo_explanation": parsed_result.get("seo_explanation"),
            "improvement_suggestions": parsed_result.get("improvement_suggestions")
        }

    except Exception as e:
        return {
            "error": "Failed to analyze SEO",
            "details": str(e),
            "raw_output": raw_result
        }

@app.post("/generate-linkedin")
def generate_linkedin(request: LinkedInRequest):
    prompt = build_linkedin_post_prompt(request.topic, request.tone)

    raw_result = generate_text(prompt)

    try:
        parsed_result = extract_json(raw_result)

        return {
            "hook": parsed_result.get("hook"),
            "post": parsed_result.get("post"),
            "hashtags": parsed_result.get("hashtags"),
            "engagement_score": parsed_result.get("engagement_score"),
            "improvement_suggestions": parsed_result.get("improvement_suggestions")
        }

    except Exception as e:
        return {
            "error": "LinkedIn post output could not be parsed",
            "details": str(e),
            "raw_output": raw_result
        }