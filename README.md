# Echker

A FastAPI/React application with Kafka-based prompt checking.

## Quick Start

```bash
# Start Kafka and prompt-save service
docker compose -f docker-compose.kafka.yml up -d

# Start application
docker compose up -d

# Run prompt checking service
cd runner
KAFKA_HOST=localhost KAFKA_PORT=9092 python main.py
```

The prompt-save service is now containerized and will start automatically with the Kafka services.

## Environment Variables

### Prompt Checking Services
- `KAFKA_HOST`: Kafka address (default: localhost)
- `KAFKA_PORT`: Kafka port (default: 9092)
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USER`: PostgreSQL user (default: postgres)
- `DB_PASSWORD`: PostgreSQL password (default: postgres)
- `DB_NAME`: PostgreSQL database (default: mlechker)

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
uv venv .venv
source .venv/bin/activate
uv pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

