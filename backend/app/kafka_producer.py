#!/usr/bin/env python
import os
from confluent_kafka import Producer

producer: Producer = None  # global singleton

def get_kafka_producer() -> Producer:
    global producer
    return producer

def init_kafka_producer():
    global producer
    # Check if we're running in Docker
    kafka_host = os.environ.get('KAFKA_HOST', 'localhost')
    kafka_port = os.environ.get('KAFKA_PORT', '9092')
    bootstrap_servers = f"{kafka_host}:{kafka_port}"
    
    print(f"Connecting to Kafka at {bootstrap_servers}")
    producer = Producer({
        'bootstrap.servers': bootstrap_servers
    })

def close_kafka_producer():
    global producer
    if producer is not None:
        producer.flush()