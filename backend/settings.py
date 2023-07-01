import os

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")
REDIS_HOST = REDIS_URL.split(":")[1].replace("/", "")
REDIS_PORT = REDIS_URL.split(":")[2]
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ORIGIN_REGEX = r"http://(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}):5173"
