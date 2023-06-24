import os

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")
REDIS_HOST = REDIS_URL.split(":")[1].replace("/", "")
REDIS_PORT = REDIS_URL.split(":")[2]
