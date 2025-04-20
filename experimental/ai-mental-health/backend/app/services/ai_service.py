import httpx
import json
from typing import Dict, List, Optional
from app.core.ai_config import ai_settings

class AIService:
    def __init__(self):
        self.base_url = ai_settings.OLLAMA_BASE_URL
        self.model = ai_settings.MODEL_NAME
        self.client = httpx.AsyncClient(timeout=30.0)

    async def _generate_completion(self, prompt: str, system_prompt: str) -> str:
        try:
            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "system": system_prompt,
                    "stream": False,
                    "temperature": ai_settings.TEMPERATURE,
                }
            )
            response.raise_for_status()
            return response.json()["response"]
        except Exception as e:
            raise Exception(f"Error generating AI response: {str(e)}")

    async def analyze_emotion(self, text: str) -> Dict:
        """Analyze the emotional content of user's message and provide supportive feedback."""
        prompt = f"Please help me understand and express these feelings: {text}"
        response = await self._generate_completion(prompt, ai_settings.EMOTION_PROMPT)
        
        # Parse the response to extract key emotional insights
        return {
            "analysis": response,
            "crisis_detected": "crisis" in response.lower() or "emergency" in response.lower()
        }

    async def draft_message(self, context: Dict) -> Dict:
        """Help user draft a message to their support network."""
        prompt = (
            f"Please help me write a message to my {context['recipient_type']}. "
            f"I'm feeling {context['emotion']} and want to express that "
            f"I {context['need']}. Situation context: {context.get('situation', '')}"
        )
        
        response = await self._generate_completion(prompt, ai_settings.MESSAGE_PROMPT)
        
        return {
            "draft": response,
            "suggestions": [
                "Be specific about what kind of support you need",
                "Express your feelings using 'I' statements",
                "Thank them for their time and support"
            ]
        }

    async def refine_message(self, original_draft: str, feedback: str) -> str:
        """Refine the message based on user feedback."""
        prompt = f"Please help me improve this message: {original_draft}\nFeedback: {feedback}"
        return await self._generate_completion(prompt, ai_settings.MESSAGE_PROMPT)

    async def close(self):
        """Close the HTTP client session."""
        await self.client.aclose()

# Create a singleton instance
ai_service = AIService() 