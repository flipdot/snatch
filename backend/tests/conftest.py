import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def api_client():
    return TestClient(app)
