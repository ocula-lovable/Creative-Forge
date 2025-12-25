# Creative-Forge Backend

FastAPI backend for the Creative-Forge application.

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── config/              # Configuration modules
├── api/                 # API route handlers
│   └── v1/             # API v1 endpoints
├── models/              # Data models and schemas
├── services/            # Business logic services
├── utils/               # Utility functions
├── middleware/          # Custom middleware
├── requirements.txt     # Python dependencies
└── README.md           # Backend documentation
```

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update as needed:

```bash
cp .env.example .env
```

### 3. Run Development Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## Features

- FastAPI framework for building APIs
- CORS middleware for cross-origin requests
- Pydantic for data validation
- Environment configuration
- Health check endpoints
- Structured project layout
