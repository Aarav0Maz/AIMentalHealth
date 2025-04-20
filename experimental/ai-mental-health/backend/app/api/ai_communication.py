from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Optional, List
from pydantic import BaseModel
from app.db.base import get_db
from app.api.deps import get_current_user
from app.services.ai_service import ai_service
from app.models.user import User
from datetime import datetime
import httpx
from app.core.ai_config import AISettings

router = APIRouter()
ai_settings = AISettings()

class EmotionRequest(BaseModel):
    text: str

class MessageContext(BaseModel):
    recipient_type: str
    emotion: str
    need: str
    situation: Optional[str] = None

class MessageDraft(BaseModel):
    draft: str
    feedback: Optional[str] = None

class Message(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    messages: List[Message]
    user_id: str

class ChatResponse(BaseModel):
    response: str
    sentiment: Optional[dict] = None

class AssessmentRequest(BaseModel):
    user_responses: List[dict]
    user_id: str

class AssessmentResponse(BaseModel):
    assessment: dict
    recommendations: List[str]

async def call_ollama(messages: List[dict]) -> str:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{ai_settings.OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": ai_settings.MODEL_NAME,
                    "messages": messages,
                    "stream": False
                },
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()["message"]["content"]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error calling Ollama: {str(e)}"
            )

@router.post("/analyze-emotion")
async def analyze_emotion(
    request: EmotionRequest,
    current_user: User = Depends(get_current_user)
) -> Dict:
    """Analyze the emotional content of user's message."""
    try:
        result = await ai_service.analyze_emotion(request.text)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/draft-message")
async def create_message_draft(
    context: MessageContext,
    current_user: User = Depends(get_current_user)
) -> Dict:
    """Generate a draft message based on user's context."""
    try:
        return await ai_service.draft_message(context.dict())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/refine-message")
async def refine_message(
    draft: MessageDraft,
    current_user: User = Depends(get_current_user)
) -> Dict:
    """Refine a message draft based on user feedback."""
    try:
        refined_message = await ai_service.refine_message(
            draft.draft,
            draft.feedback or "Make it more concise and clear"
        )
        return {"refined_draft": refined_message}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest
):
    try:
        # Format messages for Ollama
        formatted_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in request.messages
        ]

        # Add system message for mental health context
        formatted_messages.insert(0, {
            "role": "system",
            "content": ai_settings.EMOTION_PROMPT
        })

        # Get response from Ollama
        response = await call_ollama(formatted_messages)

        # Analyze sentiment of the last user message
        sentiment_analysis = await ai_service.analyze_emotion(request.messages[-1].content)

        # Extract sentiment score and label
        sentiment = None
        if sentiment_analysis:
            # Check if there's a crisis detected
            crisis_detected = sentiment_analysis.get('crisis_detected', False)

            # Create a sentiment object with score and label
            sentiment = {
                'score': -0.7 if crisis_detected else -0.3,  # Negative score if crisis detected
                'label': 'negative' if crisis_detected else 'neutral'
            }

        return ChatResponse(
            response=response,
            sentiment=sentiment
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assess", response_model=AssessmentResponse)
async def mental_health_assessment(
    request: AssessmentRequest
):
    try:
        # Simple assessment logic without calling Ollama
        # Count keywords in responses to determine levels
        stress_words = ['stress', 'overwhelm', 'pressure', 'tense', 'strain']
        anxiety_words = ['anxious', 'worry', 'nervous', 'fear', 'panic']
        depression_words = ['sad', 'depressed', 'hopeless', 'tired', 'exhausted']
        positive_words = ['good', 'happy', 'calm', 'relax', 'peace', 'joy', 'content']

        # Initialize counters
        stress_count = 0
        anxiety_count = 0
        depression_count = 0
        positive_count = 0

        # Analyze responses
        all_text = ''
        for response in request.user_responses:
            answer = response.get('answer', '').lower()
            all_text += answer + ' '

            # Count occurrences of keywords
            for word in stress_words:
                if word in answer:
                    stress_count += 1

            for word in anxiety_words:
                if word in answer:
                    anxiety_count += 1

            for word in depression_words:
                if word in answer:
                    depression_count += 1

            for word in positive_words:
                if word in answer:
                    positive_count += 1

        # Determine levels based on counts
        stress_level = "low"
        if stress_count >= 2:
            stress_level = "moderate"
        if stress_count >= 4:
            stress_level = "high"

        anxiety_level = "low"
        if anxiety_count >= 2:
            anxiety_level = "moderate"
        if anxiety_count >= 4:
            anxiety_level = "high"

        depression_risk = "low"
        if depression_count >= 2:
            depression_risk = "moderate"
        if depression_count >= 4:
            depression_risk = "high"

        # Determine overall wellbeing
        overall_score = positive_count - (stress_count + anxiety_count + depression_count) / 3

        if overall_score < -2:
            overall_wellbeing = "poor"
        elif overall_score < 0:
            overall_wellbeing = "fair"
        elif overall_score < 2:
            overall_wellbeing = "good"
        else:
            overall_wellbeing = "excellent"

        # Create assessment dictionary
        assessment = {
            "stress_level": stress_level,
            "anxiety_level": anxiety_level,
            "depression_risk": depression_risk,
            "overall_wellbeing": overall_wellbeing
        }

        # Generate recommendations based on assessment
        recommendations = []

        if stress_level in ["moderate", "high"]:
            recommendations.append("Practice deep breathing exercises or meditation to reduce stress")

        if anxiety_level in ["moderate", "high"]:
            recommendations.append("Consider mindfulness techniques to manage anxiety")

        if depression_risk in ["moderate", "high"]:
            recommendations.append("Reach out to a mental health professional for support")

        if overall_wellbeing in ["poor", "fair"]:
            recommendations.append("Establish a regular sleep schedule and prioritize self-care")

        # Add general recommendations
        recommendations.extend([
            "Engage in regular physical activity",
            "Connect with friends and family regularly",
            "Maintain a balanced diet and stay hydrated"
        ])

        # Limit to 5 recommendations
        recommendations = recommendations[:5]

        return AssessmentResponse(
            assessment=assessment,
            recommendations=recommendations
        )
    except Exception as e:
        print(f"Assessment error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))