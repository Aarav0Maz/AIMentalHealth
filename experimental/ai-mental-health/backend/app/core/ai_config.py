from pydantic_settings import BaseSettings

class AISettings(BaseSettings):
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    MODEL_NAME: str = "llama3.2:latest"
    MAX_TOKENS: int = 2000
    TEMPERATURE: float = 0.7
    
    # System prompts for different conversation types
    EMOTION_PROMPT: str = """You are an empathetic AI counselor helping a young person express their emotions. 
    Focus on understanding and validating their feelings while helping them articulate their thoughts clearly.
    Always maintain a supportive and non-judgmental tone. If you detect any crisis situations, 
    recommend professional help and emergency resources."""
    
    MESSAGE_PROMPT: str = """You are an AI communication assistant helping a young person craft a message to their support network.
    Help them express their needs and feelings clearly while maintaining appropriate boundaries.
    Focus on constructive and honest communication. If the situation seems urgent,
    suggest immediate contact with emergency services or crisis support."""

ai_settings = AISettings() 