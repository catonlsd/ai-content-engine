def build_outline_prompt(topic: str, keywords: list):
    return f"""
You are an SEO expert.

Generate a high-quality SEO blog outline.

Topic: {topic}
Keywords: {', '.join(keywords)}

Requirements:
- Create a catchy, click-worthy SEO title
- Use proper structure: H1, H2, H3
- Include keywords naturally in headings
- Ensure logical flow of topics
- Make it suitable for ranking on Google

Output format strictly:
Title:
H1:
H2:
H2:
H3:
"""


def build_blog_prompt(outline: str, tone: str):
    return f"""
You are an expert SEO blog writer.

Write a detailed, SEO-optimized blog based on the outline below.

Outline:
{outline}

Tone: {tone}

Requirements:
- Start with a strong, engaging introduction
- Expand each heading into detailed paragraphs
- Use keywords naturally
- Avoid keyword stuffing
- Keep paragraphs short and readable
- Use clear headings and spacing
- Add a strong conclusion with a key takeaway

Output format:
Title:
Full Blog:
"""


def build_single_blog_prompt(topic: str, keywords: list, tone: str):
    return f"""
You are an expert SEO blog writer.

Write a complete SEO-optimized blog.

Topic: {topic}
Keywords: {', '.join(keywords)}
Tone: {tone}

Requirements:
- Create an SEO-friendly title
- Include H1, H2, and H3 headings
- Write an engaging introduction
- Use keywords naturally
- Avoid keyword stuffing
- Keep paragraphs readable
- Add a strong conclusion

Output format:
Title:
Blog:
"""
def build_structured_blog_prompt(topic: str, keywords: list, tone: str):
    return f"""
You are an expert SEO blog writer.

Generate an SEO-optimized blog.

Topic: {topic}
Keywords: {', '.join(keywords)}
Tone: {tone}

Return ONLY valid JSON. Do not add markdown. Do not add explanations.
Return ONLY valid JSON with escaped newline characters. Do not use raw line breaks inside JSON string values.

JSON format strictly:
{{
  "title": "string",
  "meta_description": "string",
  "blog": "string with \\n for new lines",
  "seo_score": number,
  "seo_explanation": "why this score was given",
  "improvement_suggestions": ["suggestion1", "suggestion2"],
  "keywords_used": ["string"]
}}

Rules:
- Return ONLY valid JSON
- All keys and string values MUST use double quotes
- Escape all special characters inside strings
- Replace all newlines in the blog with \\n
- Do NOT use unescaped quotes inside the blog
- Do NOT use HTML tags
- Use Markdown headings (#, ##, ###)
- seo_score must be a number between 0 and 100
- Provide a clear explanation for the SEO score
- Give 2-4 actionable improvement suggestions
"""

def build_seo_analysis_prompt(blog: str, keywords: list):
    return f"""
You are an SEO expert.

Analyze the following blog content.

Blog:
{blog}

Target Keywords: {', '.join(keywords)}

Return ONLY valid JSON.

JSON format strictly:
{{
  "seo_score": number,
  "seo_explanation": "why this score was given",
  "improvement_suggestions": ["suggestion1", "suggestion2"]
}}

Rules:
- seo_score must be between 0 and 100
- Give clear reasoning
- Provide 2–4 actionable suggestions
"""

def build_linkedin_post_prompt(topic: str, tone: str):
    return f"""
You are an expert LinkedIn content strategist.

Generate a high-quality LinkedIn post.

Topic: {topic}
Tone: {tone}

Return ONLY valid JSON. Do not add markdown. Do not add explanations.
Use escaped newline characters inside string values.

JSON format strictly:
{{
  "hook": "string",
  "post": "string with \\n for new lines",
  "hashtags": ["string", "string", "string"],
  "engagement_score": 85,
  "improvement_suggestions": ["string", "string"]
}}

Rules:
- Return ONLY valid JSON
- All keys and string values MUST use double quotes
- Escape all special characters inside strings
- Replace newlines in the post with \\n
- Do NOT use unescaped quotes inside the post
- Start with a strong hook
- Keep paragraphs short
- Include a clear takeaway
- Include 3-5 relevant hashtags
- engagement_score must be between 0 and 100
"""