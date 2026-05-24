import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register(client: AsyncClient):
    resp = await client.post("/api/v1/auth/register", json={
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "password": "Password1",
    })
    assert resp.status_code == 201
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {"first_name": "A", "last_name": "B", "email": "dup@example.com", "password": "Password1"}
    await client.post("/api/v1/auth/register", json=payload)
    resp = await client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_login_unverified(client: AsyncClient):
    await client.post("/api/v1/auth/register", json={
        "first_name": "X", "last_name": "Y", "email": "unverified@example.com", "password": "Password1"
    })
    resp = await client.post("/api/v1/auth/login", json={"email": "unverified@example.com", "password": "Password1"})
    assert resp.status_code == 401
