from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.ai_communication import router as ai_communication_router
from app.api.auth import router as auth_router

app = FastAPI(
    title="AI Mental Health Support System",
    description="Backend API for AI-powered mental health support system",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(ai_communication_router, prefix="/api/ai", tags=["AI Communication"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Mental Health Support System API"}