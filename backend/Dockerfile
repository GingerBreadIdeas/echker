FROM python:3.9

WORKDIR /app

RUN pip install uv

COPY requirements.txt .

# Use --system flag to install without a virtual environment
RUN uv pip install --system -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]