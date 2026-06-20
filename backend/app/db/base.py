from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, declared_attr
from sqlalchemy import Column, DateTime, func
import uuid
# from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String
from sqlalchemy import JSON
from sqlalchemy.types import TypeDecorator, CHAR
from app.core.config import settings

# engine = create_async_engine(
#     settings.DATABASE_URL,
#     pool_size=settings.DATABASE_POOL_SIZE,
#     max_overflow=settings.DATABASE_MAX_OVERFLOW,
#     echo=settings.DEBUG,
#     pool_pre_ping=True,
# )
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DEBUG,
    )
else:
    engine = create_async_engine(
        settings.DATABASE_URL,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        echo=settings.DEBUG,
        pool_pre_ping=True,
    )

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


# class UUIDMixin:
#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
class UUIDMixin:
    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )


# Provide a `UUID` TypeDecorator with the same construction signature
# as `sqlalchemy.dialects.postgresql.UUID(as_uuid=True)` so model
# files that are switched to import `UUID` from `app.db.base` keep
# working on both Postgres and SQLite.
class UUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def __init__(self, as_uuid: bool = True):
        self.as_uuid = as_uuid
        super().__init__()

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            from sqlalchemy.dialects.postgresql import UUID as PGUUID

            return dialect.type_descriptor(PGUUID(as_uuid=self.as_uuid))
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None or (dialect is not None and dialect.name == "postgresql"):
            return value
        if self.as_uuid:
            return str(value if isinstance(value, uuid.UUID) else uuid.UUID(str(value)))
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None or (dialect is not None and dialect.name == "postgresql"):
            return value
        return uuid.UUID(str(value)) if self.as_uuid else str(value)


# JSONB alias for Postgres JSONB; fallback to standard JSON for SQLite
JSONB = JSON


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
