# SNATCH

Surveillance Network for Auto Tag Capture and Hunting

## Overview

SNATCH is a tool for capturing car license plates by manual human input.
It allows to record when a car passes by a certain location.

It only saves the license plate temporarily and in a hashed form.

## Setup

```
docker-compose up --build -d
# visit http://localhost
```

## Development

### Frontend

```
cd frontend
npm i
npm run dev
npm run format  # reformats the code
```

### Backend

```
cd backend
poetry install
poetry shell
uvicorn main:app --reload
```