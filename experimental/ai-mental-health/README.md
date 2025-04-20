# AI Mental Health Support System

An AI-powered platform designed to help teenagers and young adults in Ontario communicate more effectively during mental health challenges.

## Project Structure

```
ai-mental-health/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configurations
│   │   ├── db/           # Database models and setup
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── tests/        # Backend tests
│   └── pyproject.toml    # Python dependencies
└── frontend/             # React frontend
    ├── src/
    │   ├── components/   # React components
    │   ├── styles/       # CSS styles
    │   └── tests/        # Frontend tests
    └── package.json      # Node.js dependencies
```

## Features

- Age-appropriate user interface
- Multi-language support (English/French)
- AI-assisted communication
- Support network management
- Emergency protocols
- Privacy-focused design

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using Poetry:
   ```bash
   poetry install
   ```

3. Run the development server:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Testing

### Backend Tests
```bash
cd backend
poetry run pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 