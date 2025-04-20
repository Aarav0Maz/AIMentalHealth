# AI Mental Health Support Application

A web application that provides AI-powered mental health support through chat interactions and assessments.

## Features

- **AI Chat Support**: Talk to an AI assistant about your feelings, thoughts, and concerns
- **Mental Health Assessment**: Take a comprehensive assessment to understand your mental wellbeing
- **Personalized Recommendations**: Get tailored recommendations based on your assessment results

## Project Structure

```
AI-Mental-Health/
├── experimental/ai-mental-health/
│   ├── backend/              # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/          # API endpoints
│   │   │   ├── core/         # Core configurations
│   │   │   ├── db/           # Database models
│   │   │   ├── models/       # Data models
│   │   │   ├── schemas/      # Pydantic schemas
│   │   │   └── main.py       # Main application entry point
│   ├── frontend/             # React frontend
│   │   ├── public/           # Static files
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── styles/       # CSS styles
│   │   │   └── App.tsx       # Main application component
├── tests/                    # Playwright tests
│   ├── frontend.spec.ts      # Frontend tests
│   ├── backend.spec.ts       # Backend tests
│   ├── e2e.spec.ts           # End-to-end tests
│   └── api-service.spec.ts   # API service tests
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- npm or yarn

### Installation

#### Backend Setup

```bash
# Navigate to the backend directory
cd experimental/ai-mental-health/backend

# Install required Python packages
pip install fastapi uvicorn sqlalchemy pydantic-settings httpx python-jose[cryptography] passlib
```

#### Frontend Setup

```bash
# Navigate to the frontend directory
cd experimental/ai-mental-health/frontend

# Install required Node.js packages
npm install
```

### Running the Application

#### Option 1: Using the Start Script (Recommended)

You can use the provided script to start both the frontend and backend servers with a single command:

```bash
# Make the script executable (if not already)
chmod +x start-app.sh

# Run the script
./start-app.sh
```

This script will:
- Check for required dependencies
- Install missing packages if needed
- Start the backend server on http://localhost:8000
- Start the frontend server on http://localhost:3000
- Provide a clean way to stop both servers with Ctrl+C

#### Option 2: Starting Servers Manually

##### Start the Backend Server

```bash
# Navigate to the backend directory
cd experimental/ai-mental-health/backend

# Start the backend server
python -m uvicorn app.main:app --reload
```

The backend server will start on http://localhost:8000

##### Start the Frontend Server

```bash
# Navigate to the frontend directory
cd experimental/ai-mental-health/frontend

# Start the frontend development server
npm start
```

The frontend server will start on http://localhost:3000

### Using the Application

1. Open http://localhost:3000 in your browser
2. Navigate to the Chat page to start a conversation with the AI assistant
3. Navigate to the Assessment page to take a mental health assessment

## Testing

This project uses Playwright for testing. See the [tests/README.md](tests/README.md) file for detailed testing instructions.

### Running Tests

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run end-to-end tests only
npm run test:e2e

# Run API service tests only
npm run test:api
```

## API Documentation

When the backend server is running, you can access the API documentation at http://localhost:8000/docs

## Key Features Implementation

### Chat Functionality

The chat feature uses a simple AI model to provide supportive responses to user messages. The backend analyzes the sentiment of user messages to detect potential crisis situations.

### Assessment Functionality

The assessment feature analyzes user responses to a set of questions to evaluate:
- Stress level
- Anxiety level
- Depression risk
- Overall wellbeing

Based on this analysis, the system provides personalized recommendations.

## License

This project is licensed under the ISC License.
