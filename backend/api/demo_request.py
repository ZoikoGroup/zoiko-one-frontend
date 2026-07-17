import os
import uuid
import resend
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from pathlib import Path

_dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_dotenv_path)

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import String, Text, DateTime, select, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine


# ---------------------------------------------------------------------------
# Database config
# ---------------------------------------------------------------------------
DATABASE_URL = os.environ.get("NEON_DATABASE_URL", "")
# Strip ?ssl=require from URL if present (asyncpg uses connect_args)
if DATABASE_URL.endswith("?ssl=require"):
    DATABASE_URL = DATABASE_URL[:-len("?ssl=require")]
print(f"DEBUG: DATABASE_URL loaded = {DATABASE_URL[:40]}...")
engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True, pool_recycle=300, connect_args={"ssl": "require"})
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    pass


class DemoRequest(Base):
    __tablename__ = "demo_requests"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(String(255), index=True)
    company: Mapped[str] = mapped_column(String(255))
    first_name: Mapped[str] = mapped_column(String(128))
    last_name: Mapped[str] = mapped_column(String(128))
    job_title: Mapped[str] = mapped_column(String(255))
    company_size: Mapped[str] = mapped_column(String(64))
    business_type: Mapped[str] = mapped_column(String(128))
    country: Mapped[str] = mapped_column(String(128))
    demo_focus: Mapped[str] = mapped_column(String(64), default="Platform overview")
    challenge: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


async def get_db():
    async with async_session() as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ---------------------------------------------------------------------------
# Resend setup
# ---------------------------------------------------------------------------
resend.api_key = os.environ.get("RESEND_API_KEY", "")
RESEND_FROM = os.environ.get("RESEND_FROM", "demo@zoikoone.com")


# ---------------------------------------------------------------------------
# FastAPI app with lifespan (init DB tables on cold start)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(application: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Zoiko Demo API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://zoikoone.com",
        "https://www.zoikoone.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request schema
# ---------------------------------------------------------------------------
class DemoRequestIn(BaseModel):
    email: EmailStr
    company: str
    first_name: str
    last_name: str
    job_title: str
    company_size: str
    business_type: str
    country: str
    demo_focus: str = "Platform overview"
    challenge: str = ""


# ---------------------------------------------------------------------------
# Email template
# ---------------------------------------------------------------------------
def build_email_html(data: DemoRequestIn) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;font-family:'Inter',system-ui,sans-serif;background:#f7f8fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(20,30,60,0.06);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#1E2A4A,#16213D);padding:36px 40px;">
                <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;">
                  Your Zoiko One Demo
                </h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">
                  Next steps for <strong>{data.first_name}</strong> at <strong>{data.company}</strong>
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
                <p style="margin:0 0 16px;font-size:15px;color:#1B2436;">
                  Hi {data.first_name},
                </p>
                <p style="margin:0 0 20px;font-size:15px;color:#5B6373;line-height:1.6;">
                  Thank you for requesting a demo of Zoiko One. We've received your
                  request and our team is already reviewing it.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8FA;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                  <tr>
                    <td>
                      <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#9298A4;text-transform:uppercase;letter-spacing:0.06em;">Your Request</p>
                      <p style="margin:0;font-size:14px;color:#1B2436;">
                        <strong>Focus:</strong> {data.demo_focus}<br>
                        <strong>Challenge:</strong> {data.challenge or "Not specified"}<br>
                        <strong>Company size:</strong> {data.company_size}<br>
                        <strong>Country:</strong> {data.country}
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#1E2A4A;">
                  What happens next:
                </p>

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="36" valign="top" style="padding-bottom:14px;">
                      <div style="width:28px;height:28px;border-radius:50%;background:#E8850A;color:#fff;font-size:13px;font-weight:800;text-align:center;line-height:28px;">1</div>
                    </td>
                    <td style="padding-bottom:14px;padding-left:12px;font-size:14px;color:#5B6373;line-height:1.5;">
                      Our team reviews your request and matches you with the right specialist.
                    </td>
                  </tr>
                  <tr>
                    <td width="36" valign="top" style="padding-bottom:14px;">
                      <div style="width:28px;height:28px;border-radius:50%;background:#E8850A;color:#fff;font-size:13px;font-weight:800;text-align:center;line-height:28px;">2</div>
                    </td>
                    <td style="padding-bottom:14px;padding-left:12px;font-size:14px;color:#5B6373;line-height:1.5;">
                      Within <strong>24 hours</strong> you'll receive a calendar link to pick a time that works for you.
                    </td>
                  </tr>
                  <tr>
                    <td width="36" valign="top" style="padding-bottom:14px;">
                      <div style="width:28px;height:28px;border-radius:50%;background:#E8850A;color:#fff;font-size:13px;font-weight:800;text-align:center;line-height:28px;">3</div>
                    </td>
                    <td style="padding-bottom:14px;padding-left:12px;font-size:14px;color:#5B6373;line-height:1.5;">
                      Your demo will be tailored to <strong>{data.demo_focus.lower()}</strong> and focused on solving: <em>{data.challenge or "your key business challenge"}</em>.
                    </td>
                  </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                  <tr>
                    <td align="center" style="padding:8px 0 4px;">
                      <a href="https://zoikoone.com/get-demo" style="display:inline-block;background:linear-gradient(135deg,#E8850A,#D8760A);color:#fff;text-decoration:none;padding:12px 32px;border-radius:999px;font-size:14px;font-weight:700;">
                        View Your Request
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px;border-top:1px solid #E6E8EC;">
                <p style="margin:0 0 6px;font-size:12px;color:#9298A4;">
                  Questions? Reply to this email or visit
                  <a href="https://zoikoone.com/contact" style="color:#2F4DC4;text-decoration:none;">zoikoone.com/contact</a>
                </p>
                <p style="margin:0;font-size:11px;color:#C0C4CC;">
                  Zoiko One &mdash; Business operations, connected.
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------
@app.post("/api/demo-request")
async def create_demo_request(payload: DemoRequestIn, db: AsyncSession = Depends(get_db)):
    # Duplicate check: same email within 24h
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    result = await db.execute(
        select(DemoRequest).where(
            DemoRequest.email == payload.email.lower().strip(),
            DemoRequest.created_at >= cutoff,
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        return {"success": True, "message": "Request already submitted. Check your inbox!"}

    # Save to DB
    record = DemoRequest(
        email=payload.email.lower().strip(),
        company=payload.company,
        first_name=payload.first_name,
        last_name=payload.last_name,
        job_title=payload.job_title,
        company_size=payload.company_size,
        business_type=payload.business_type,
        country=payload.country,
        demo_focus=payload.demo_focus,
        challenge=payload.challenge,
    )
    db.add(record)
    await db.commit()

    # Send invitation email
    try:
        resend.Emails.send({
            "from": RESEND_FROM,
            "to": [payload.email.lower().strip()],
            "subject": f"Your Zoiko One Demo — Next Steps, {payload.first_name}",
            "html": build_email_html(payload),
        })
    except Exception as e:
        print(f"Resend error: {e}")
        # Still return success — DB saved, email is best-effort

    return {"success": True, "message": "Demo request submitted. Check your inbox!"}


@app.get("/api/demo-request")
async def health_check():
    return {"status": "ok"}


@app.get("/auth/me")
async def auth_me():
    from fastapi import HTTPException
    raise HTTPException(status_code=401, detail="Not authenticated")


# ---------------------------------------------------------------------------
# Vercel serverless entry point
# ---------------------------------------------------------------------------
handler = app
