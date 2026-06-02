import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.types import UUID
from app.db.base import Base


class AuditLog(Base):
    __tablename__ = "ams_audit_logs"
    id: Mapped[uuid.UUID]         = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("ams_users.id", ondelete="SET NULL"))
    action: Mapped[str]           = mapped_column(String(100), nullable=False, index=True)
    entity_type: Mapped[str | None] = mapped_column(String(100), index=True)
    entity_id: Mapped[str | None]   = mapped_column(String(100), index=True)
    old_value: Mapped[dict | None]  = mapped_column(JSON)
    new_value: Mapped[dict | None]  = mapped_column(JSON)
    metadata_: Mapped[dict | None]  = mapped_column("metadata", JSON)
    ip_address: Mapped[str | None]  = mapped_column(String(50))
    user_agent: Mapped[str | None]  = mapped_column(Text)
    role_context: Mapped[str | None] = mapped_column(String(50))
    created_at: Mapped[datetime]    = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    user: Mapped["User | None"] = relationship("User", foreign_keys=[user_id])


class Notification(Base):
    __tablename__ = "ams_notifications"
    id: Mapped[uuid.UUID]         = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID]    = mapped_column(UUID(as_uuid=True), ForeignKey("ams_users.id", ondelete="CASCADE"))
    type: Mapped[str]             = mapped_column(String(50))  # enrollment / result / workflow / system
    title: Mapped[str]            = mapped_column(String(300))
    message: Mapped[str | None]   = mapped_column(Text)
    is_read: Mapped[bool]         = mapped_column(default=False)
    entity_type: Mapped[str | None] = mapped_column(String(50))
    entity_id: Mapped[str | None]   = mapped_column(String(100))
    created_at: Mapped[datetime]  = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])


from app.models.user import User  # noqa: E402
