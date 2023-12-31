import os

REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = os.environ.get("REDIS_PORT", 6379)
SENTRY_DSN = os.environ.get("SENTRY_DSN", None)
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ORIGIN_REGEX = r"http://(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}):5173"

DEFAULT_DB_TTL = 60 * 60 * 24 * 3  # 3 days
