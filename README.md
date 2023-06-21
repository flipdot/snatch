# SNATCH

Surveillance Network for Auto Tag Capture and Hunting

## Overview

SNATCH is a tool for capturing car license plates by manual human input.
It allows to record when a car passes by a certain location.

It only saves the license plate temporarily and in a hashed form.

## Usage

No need to check out the repository. You only need to copy the `compose.yaml` file and run:

```
docker compose up -d
```

Visit https://localhost / https://localhost/api/docs


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