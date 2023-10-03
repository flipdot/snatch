FROM python:3.12-slim

ENV POETRY_HOME="/opt/poetry"
ENV POETRY_VERSION=1.4.2
RUN pip install poetry==$POETRY_VERSION
ENV PATH="$POETRY_HOME/bin:$PATH"

WORKDIR /app

COPY pyproject.toml .
COPY poetry.lock .
RUN poetry install --only main

COPY . .

ENTRYPOINT ["poetry", "run"]

CMD ["uvicorn", "--host", "0.0.0.0", "--root-path", "/api", "main:app"]
EXPOSE 8000
