from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

import settings
from routers import locations, records, evaluation
import sentry_sdk
from db import db

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    enable_tracing=False,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(locations.router)
app.include_router(records.router)
app.include_router(evaluation.router)


@app.get("/error")
def error():
    raise Exception("Test error")


@app.get("/health")
def health():
    db.set("health", "ok")
    if db.get("health") != "ok":
        raise Exception("Redis not working")
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
