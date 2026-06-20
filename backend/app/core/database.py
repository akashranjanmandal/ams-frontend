"""Compatibility wrapper: re-export eFMS async DB module under app.core.database

This allows code that expects `app.core.database` (sync-style projects) to import
DB symbols from the same path across projects while the eFMS implementation
continues to use the async `app.db.base` module.
"""
from app.db.base import engine, AsyncSessionLocal, Base, get_db  # noqa: F401

__all__ = ["engine", "AsyncSessionLocal", "Base", "get_db"]
