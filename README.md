# Echker

A web application built with React + Tailwind CSS frontend and FastAPI + SQLAlchemy + PostgreSQL backend.

## Project Structure

```
/
├── frontend/            # React frontend
│   ├── src/             # Source code
│   ├── package.json     # Dependencies
│   └── vite.config.ts   # Vite configuration
│
├── backend/              # Python FastAPI backend
│   ├── app/              # Application code
│   │   ├── api/          # API endpoints
│   │   ├── db/           # Database configuration
│   │   └── models/       # SQLAlchemy models
│   ├── requirements.txt  # Production dependencies
│   └── requirements-dev.txt # Development dependencies
│
└── docker-compose.yml    # Docker setup
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local frontend development)
- Python 3.9+ and uv (for local backend development)

### Running with Docker

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8000
- Frontend on port 5173

### Local Development

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
# Create and activate a virtual environment
uv venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv pip install -r requirements-dev.txt

# Run the application
uvicorn app.main:app --reload
```

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for Swagger documentation.