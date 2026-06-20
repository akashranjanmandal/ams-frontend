from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.core.config import settings
from app.core import database as sync_db


def _to_async_url(url: str) -> str:
    # Convert common sync Postgres driver to asyncpg if needed
    if url and "psycopg" in url and "asyncpg" not in url:
        return url.replace("psycopg", "asyncpg")
    return url


# Async engine (compatibility layer) — does not replace the existing sync engine
engine = create_async_engine(_to_async_url(settings.DATABASE_URL), pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# Reuse the existing declarative Base from the sync database module so metadata stays shared
Base = sync_db.Base  # type: ignore


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
