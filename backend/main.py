from fastapi import FastAPI
from routers import locations, records, evaluation

app = FastAPI()

app.include_router(locations.router)
app.include_router(records.router)
app.include_router(evaluation.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
