FROM python:3.9

WORKDIR /app

RUN pip install uv

# Copy requirements file
COPY requirements.txt .

# Clean install dependencies with specific pydantic version
RUN uv pip install --system -r requirements.txt

# Copy application code
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]