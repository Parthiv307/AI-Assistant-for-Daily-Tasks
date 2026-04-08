import google.generativeai as genai
genai.configure(api_key="AIzaSyBnoIaPXaID5YDuHW0wtAGKhn94KBo2kzU")

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"AVAILABLE MODEL: {m.name}")
except Exception as e:
    print(f"CONNECTION ERROR: {e}")