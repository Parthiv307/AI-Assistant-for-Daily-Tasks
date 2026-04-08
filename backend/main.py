from google import genai
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import pypdf
import io
import uvicorn

# 1. SETUP GOOGLE GEMINI
# Fixed SDK & 404 Error: Swapped to google.genai and gemini-2.5-flash
client = genai.Client(api_key="AIzaSyC1d4iq0u5ewMcsdpnJkClOP1FQpvo4tpA")
MODEL_ID = 'gemini-2.5-flash'

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Phoenix Backend is ONLINE"}

@app.post("/chat")
async def chat_handler(
    prompt: str = Form(...), 
    file: Optional[UploadFile] = File(None)
):
    try:
        context_text = ""
        
        # If PDF is uploaded, read it
        if file and file.content_type == "application/pdf":
            content = await file.read()
            pdf_reader = pypdf.PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                context_text += page.extract_text()
            
            combined_prompt = f"Resume Content:\n{context_text}\n\nQuestion: {prompt}"
        else:
            combined_prompt = prompt

        # 2. CALL GOOGLE AI
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=combined_prompt
        )
        
        return {"reply": response.text}

    except Exception as e:
        return {"reply": f"AI Link Error: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)