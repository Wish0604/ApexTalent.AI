from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db import models
from ..schemas import schemas
from ..core import security

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.UserResponse)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        hashed_password=hashed_password,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize role-specific empty profiles
    if user_data.role == "candidate":
        candidate = models.CandidateProfile(
            user_id=new_user.id,
            full_name=user_data.email.split("@")[0].capitalize(),
            skills_json="[\"Python\", \"SQL\"]",
            projects_json="[]"
        )
        db.add(candidate)
    elif user_data.role == "recruiter":
        recruiter = models.RecruiterProfile(
            user_id=new_user.id,
            company_name="ApexTalent Partner Org",
            department="Talent Acquisition"
        )
        db.add(recruiter)
    elif user_data.role == "organization":
        org = models.OrganizationProfile(
            user_id=new_user.id,
            org_name="ApexTalent Community Hub"
        )
        db.add(org)
        
    db.commit()
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not security.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = security.create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }

@router.get("/oauth/{provider}")
def oauth_mock(provider: str):
    """
    Mock OAuth initiation endpoint. Redirects/returns info for UI flow.
    """
    return {
        "provider": provider,
        "auth_url": f"https://mock-{provider}.com/oauth/authorize?client_id=apextalent&redirect_uri=http://localhost:3000/auth/callback"
    }

@router.post("/oauth/{provider}/callback", response_model=schemas.Token)
def oauth_callback_mock(provider: str, db: Session = Depends(get_db)):
    """
    Mock OAuth callback completion endpoint. Log in/Register standard mock user.
    """
    mock_email = f"oauth_{provider}_user@apextalent.ai"
    user = db.query(models.User).filter(models.User.email == mock_email).first()
    
    if not user:
        # Auto register
        hashed_password = security.get_password_hash("oauthpassword123")
        user = models.User(
            email=mock_email,
            hashed_password=hashed_password,
            role="candidate"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Profile
        candidate = models.CandidateProfile(
            user_id=user.id,
            full_name=f"OAuth {provider.capitalize()} Candidate",
            skills_json="[\"TypeScript\", \"React\", \"Tailwind CSS\"]",
            projects_json="[]"
        )
        db.add(candidate)
        db.commit()

    access_token = security.create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }
