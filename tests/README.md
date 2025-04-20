# AI Mental Health Application Tests

This directory contains automated tests for the AI Mental Health application using Playwright.

## Test Structure

The tests are organized into the following categories:

1. **Frontend Tests** (`frontend.spec.ts`): Tests for the React frontend components, including navigation, UI elements, and user interactions.
2. **Backend Tests** (`backend.spec.ts`): Tests for the FastAPI backend endpoints, focusing on API functionality and responses.
3. **End-to-End Tests** (`e2e.spec.ts`): Tests that simulate complete user journeys through the application.
4. **API Service Tests** (`api-service.spec.ts`): Tests specifically for the AI service functionality, including sentiment analysis and assessment accuracy.

## Prerequisites

Before running the tests, make sure you have:

1. Node.js installed (v14 or later)
2. Python installed (v3.8 or later)
3. Required dependencies installed:
   - For frontend: React and related packages
   - For backend: FastAPI, Uvicorn, and related packages

## Starting the Application

### Starting the Backend Server

```bash
# Navigate to the backend directory
cd experimental/ai-mental-health/backend

# Install required Python packages (if not already installed)
pip install fastapi uvicorn sqlalchemy pydantic-settings httpx python-jose[cryptography] passlib

# Start the backend server
python -m uvicorn app.main:app --reload
```

The backend server will start on http://localhost:8000

### Starting the Frontend Server

```bash
# Navigate to the frontend directory
cd experimental/ai-mental-health/frontend

# Install required Node.js packages (if not already installed)
npm install

# Start the frontend development server
npm start
```

The frontend server will start on http://localhost:3000

### Verifying the Application is Running

1. Open http://localhost:3000 in your browser to verify the frontend is running
2. Navigate to http://localhost:8000/docs to verify the backend API is running and view the API documentation

## Running the Tests

You can run the tests using the following npm scripts:

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

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

## Test Reports

After running the tests, you can find the test reports in the `playwright-report` directory. Open the HTML report to see detailed test results:

```bash
npx playwright show-report
```

## Continuous Integration

These tests can be integrated into a CI/CD pipeline. The tests are designed to be run in a headless environment, making them suitable for automated testing in CI systems.

## Troubleshooting

If you encounter issues with the tests:

1. Make sure both the frontend and backend servers are running
2. Check that the URLs in the tests match your local setup
3. Try running the tests in debug mode for more detailed information: `npm run test:debug`
4. Check the Playwright documentation for more information: [Playwright Docs](https://playwright.dev/docs/intro)
