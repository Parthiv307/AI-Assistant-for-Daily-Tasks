import google.generativeai as genai

# Make sure there are no spaces after the " or before the "
API_KEY = "AIzaSy..." 
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel('gemini-1.5-flash')

try:
    print("Testing connection...")
    response = model.generate_content("Say 'Connected!'")
    print(response.text)
except Exception as e:
    print(f"Still having trouble: {e}")