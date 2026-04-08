import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import pypdf
import io

# 1. THE SYSTEM BRAIN
genai.configure(api_key="AIzaSyBnoIaPXaID5YDuHW0wtAGKhn94KBo2kzU")

# This is what makes it "Multifunctional" again
system_instruction = """
You are PHOENIX, a high-end, multifunctional AI assistant for next-gen engineers.
Your core capabilities:
- Hardware Debugging: Helping with Arduino, sensors, and robotics.
- Career Scaling: Analyzing resumes (PDFs) and providing elite industry feedback.
- Advanced Coding: Writing and optimizing C, Python, and React code.
- Personal Development: Creating fitness and discipline roadmaps.
Tone: Professional, concise, futuristic, and highly capable.
"""

model = genai.GenerativeModel(
    model_name='gemini-1.5-flash',
    system_instruction=system_instruction
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat_handler(
    prompt: str = Form(...), 
    file: Optional[UploadFile] = File(None)
):
    try:
        content_parts = [prompt]
        
        # Handle PDF Context
        if file and file.content_type == "application/pdf":
            pdf_bytes = await file.read()
            pdf_reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            pdf_text = "".join([page.extract_text() for page in pdf_reader.pages])
            content_parts.append(f"\n[ATTACHED DOCUMENT CONTEXT]:\n{pdf_text}")
        
        # Handle Image Context (Gemini can "see" images)
        elif file and "image" in file.content_type:
            image_data = await file.read()
            content_parts.append({"mime_type": file.content_type, "data": image_data})

        # Generate response as a Chatbot
        response = model.generate_content(content_parts)
        return {"reply": response.text}

    except Exception as e:
        return {"reply": f"Phoenix Core Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)