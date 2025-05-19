FROM python:3.9-slim

WORKDIR /app

# Copy the prompt_save script
COPY prompt_save.py .
COPY __init__.py .

# Install dependencies
RUN pip install --no-cache-dir \
    confluent-kafka \
    sqlalchemy \
    psycopg2-binary

# Set environment variable to identify Docker environment
ENV MLCHECKER_ENV_TYPE=docker

# Run the prompt_save script
CMD ["python", "prompt_save.py"]