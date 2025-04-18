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
│   │   ├── core/         # Core application code
│   │   ├── db/           # Database configuration
│   │   ├── models/       # SQLAlchemy models
│   │   └── schemas/      # Pydantic schemas
│   └── requirements.txt  # Python dependencies
│
├── docker-compose.yml          # Production Docker setup
└── docker-compose.dev.yml      # Development Docker setup with test user
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.9+ and uv (for local backend development)
- Node.js and npm (for local frontend development)

### Running with Docker (Development)

```bash
# For development with test user
docker compose -f docker-compose.dev.yml up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8000
- Frontend on port 5173
- Creates a test user:
  - Username: testusername
  - Email: test@testemail.com
  - Password: testpassword

### Running with Docker (Production)

```bash
# For production
docker compose up -d
```

### Local Development

#### Frontend

```bash
cd frontend
# The frontend has been simplified to use a basic HTTP server
# If you need a more complex setup, you can install dependencies:
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

## Features

- **Authentication**: User registration and login
- **Dashboard**: Overview of system status
- **Tracking**: Track performance metrics
- **Anomaly Detection**: Identify unusual patterns
- **Settings**: Configure application preferences
- **API Access**: Generate tokens for programmatic access

## Authentication

The application includes a complete authentication system:
- User registration with email, username, and password
- Login with username/email and password
- JWT token-based authentication
- Protected routes requiring authentication
- User profile and settings
- API token generation for programmatic access

The development setup includes a pre-configured test user for ease of testing.

## API Usage

Echker provides a simple API that can be accessed programmatically. Users can generate API tokens from the Settings page.

### Python Example

```python
import requests

# API configuration
API_TOKEN = "your_token_here"
API_URL = "http://backend:8000/api/v1"

# Set up authorization header
headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

# Get your username
response = requests.get(
    f"{API_URL}/api/whoami", 
    headers=headers
)

if response.status_code == 200:
    data = response.json()
    print(f"Authenticated as: {data['username']}")
else:
    print(f"Error: {response.status_code} - {response.text}")

# Send a chat message
chat_data = {
    "content": "Hello, chatbot!",
    "response": "Optional response from the system",
    "is_prompt_injection": False  # Flag as prompt injection if applicable
}

response = requests.post(
    f"{API_URL}/chat/messages",
    json=chat_data,
    headers=headers
)

if response.status_code == 200:
    message = response.json()
    print(f"Message created with ID: {message['id']}")
else:
    print(f"Error creating message: {response.status_code} - {response.text}")

# List your chat messages
response = requests.get(
    f"{API_URL}/chat/messages",
    headers=headers
)

if response.status_code == 200:
    messages = response.json()["messages"]
    print(f"Found {len(messages)} messages")
    for msg in messages:
        print(f"Message {msg['id']}: {msg['content']}")
else:
    print(f"Error getting messages: {response.status_code} - {response.text}")
```

### Available Endpoints

#### API & Authentication
- `GET /api/v1/api/whoami`: Returns the username of the authenticated user
- `GET /api/v1/api/status`: Check the API status (no authentication required)
- `POST /api/v1/auth/generate-api-token`: Generate a new API token (requires authentication)

#### Chat Messages
- `POST /api/v1/chat/messages`: Create a new chat message
- `GET /api/v1/chat/messages`: List all chat messages for the authenticated user
- `GET /api/v1/chat/messages/{message_id}`: Get a specific chat message by ID
- `PATCH /api/v1/chat/messages/{message_id}`: Update a chat message's prompt injection status
- `DELETE /api/v1/chat/messages/{message_id}`: Delete a chat message

#### Chat Message Schema
```json
{
  "content": "User message text",
  "response": "Optional response from the chatbot",
  "is_prompt_injection": false
}
```

The `is_prompt_injection` field is used to flag messages that contain potential prompt injection attacks. This flag can be set when creating a message or updated later through the API or the Tracking interface.