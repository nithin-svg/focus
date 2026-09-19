import os
import uuid
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware

from models import (
    UserRegisterRequest, UserLoginRequest, UserResponse, UserProfileUpdate,
    PasswordChangeRequest, PriceCalculationRequest, PriceCalculationResponse,
    WarrantyCreateRequest, WarrantyResponse, WarrantyStatus, PaymentOrderRequest,
    PaymentVerificationRequest, ExtensionHistoryItem
)
from database import db_instance
from auth import (
    get_password_hash, verify_password, create_access_token, get_current_user
)
from pricing import calculate_warranty_price, calculate_new_expiry
from seed import seed_demo_data

app = FastAPI(
    title="Focus System - Warranty Management & Extension API",
    version="1.0.0",
    description="Enterprise REST API for Warranty Extension, Product Registration, Calculation, and Payments."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def compute_warranty_status(expiry_str: str):
    try:
        expiry_date = datetime.strptime(expiry_str, "%Y-%m-%d").date()
    except Exception:
        return WarrantyStatus.ACTIVE, 365
    today = datetime.now().date()
    days_left = (expiry_date - today).days

    if days_left < 0:
        return WarrantyStatus.EXPIRED, days_left
    elif days_left <= 30:
        return WarrantyStatus.EXPIRING_SOON, days_left
    else:
        return WarrantyStatus.ACTIVE, days_left

@app.on_event("startup")
async def on_startup():
    await db_instance.connect()
    await seed_demo_data()

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Focus System Warranty API", "timestamp": datetime.now().isoformat()}

# ----------------- AUTHENTICATION ROUTES -----------------

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
async def register_user(req: UserRegisterRequest):
    # Check existing user
    existing_email = await db_instance.find_user_by_email_or_phone(req.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Account with this email already exists.")
    
    existing_phone = await db_instance.find_user_by_email_or_phone(req.phone_number)
    if existing_phone:
        raise HTTPException(status_code=400, detail="Account with this phone number already exists.")
    
    user_id = str(uuid.uuid4())
    new_user = {
        "id": user_id,
        "full_name": req.full_name.strip(),
        "phone_number": req.phone_number.strip(),
        "email": req.email.strip().lower(),
        "password_hash": get_password_hash(req.password),
        "address": "",
        "city": "",
        "postal_code": "",
        "created_at": datetime.now().isoformat()
    }
    await db_instance.create_user(new_user)

    token = create_access_token({"sub": user_id, "email": new_user["email"]})
    return {
        "message": "Registration successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "full_name": new_user["full_name"],
            "phone_number": new_user["phone_number"],
            "email": new_user["email"],
            "address": new_user["address"],
            "city": new_user["city"],
            "postal_code": new_user["postal_code"],
            "created_at": new_user["created_at"]
        }
    }

@app.post("/api/auth/login")
async def login_user(req: UserLoginRequest):
    user = await db_instance.find_user_by_email_or_phone(req.identifier)
    if not user or not verify_password(req.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/phone number or password."
        )
    
    token = create_access_token({"sub": user["id"], "email": user["email"]})
    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "full_name": user["full_name"],
            "phone_number": user["phone_number"],
            "email": user["email"],
            "address": user.get("address", ""),
            "city": user.get("city", ""),
            "postal_code": user.get("postal_code", ""),
            "created_at": user.get("created_at", "")
        }
    }

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "full_name": current_user["full_name"],
        "phone_number": current_user["phone_number"],
        "email": current_user["email"],
        "address": current_user.get("address", ""),
        "city": current_user.get("city", ""),
        "postal_code": current_user.get("postal_code", ""),
        "created_at": current_user.get("created_at", "")
    }

@app.put("/api/auth/profile")
async def update_profile(req: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {}
    if req.full_name is not None:
        update_data["full_name"] = req.full_name.strip()
    if req.phone_number is not None:
        update_data["phone_number"] = req.phone_number.strip()
    if req.email is not None:
        update_data["email"] = req.email.strip().lower()
    if req.address is not None:
        update_data["address"] = req.address.strip()
    if req.city is not None:
        update_data["city"] = req.city.strip()
    if req.postal_code is not None:
        update_data["postal_code"] = req.postal_code.strip()

    updated = await db_instance.update_user(current_user["id"], update_data)
    return {
        "message": "Profile updated successfully",
        "user": {
            "id": updated["id"],
            "full_name": updated["full_name"],
            "phone_number": updated["phone_number"],
            "email": updated["email"],
            "address": updated.get("address", ""),
            "city": updated.get("city", ""),
            "postal_code": updated.get("postal_code", ""),
            "created_at": updated.get("created_at", "")
        }
    }

@app.post("/api/auth/change-password")
async def change_password(req: PasswordChangeRequest, current_user: dict = Depends(get_current_user)):
    if not verify_password(req.current_password, current_user.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    
    await db_instance.update_user(current_user["id"], {
        "password_hash": get_password_hash(req.new_password)
    })
    return {"message": "Password changed successfully."}

# ----------------- PRICING & CALCULATION -----------------

@app.post("/api/warranties/calculate-price", response_model=PriceCalculationResponse)
async def calculate_price(req: PriceCalculationRequest):
    price_info = calculate_warranty_price(
        category=req.product_category,
        purchase_price=req.purchase_price or 49999.0,
        period=req.extension_period,
        current_expiry_str=req.current_warranty_expiry
    )
    return price_info

# ----------------- WARRANTY MANAGEMENT -----------------

@app.get("/api/warranties", response_model=List[WarrantyResponse])
async def list_user_warranties(current_user: dict = Depends(get_current_user)):
    raw_warranties = await db_instance.get_user_warranties(current_user["id"])
    results = []
    for w in raw_warranties:
        status, days_left = compute_warranty_status(w.get("warranty_expiry_date", ""))
        w["status"] = status
        w["days_left"] = days_left
        results.append(w)
    return results

@app.get("/api/warranties/{warranty_id}", response_model=WarrantyResponse)
async def get_warranty(warranty_id: str, current_user: dict = Depends(get_current_user)):
    warranty = await db_instance.find_warranty_by_id(warranty_id)
    if not warranty or warranty.get("user_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Warranty record not found.")
    
    status, days_left = compute_warranty_status(warranty.get("warranty_expiry_date", ""))
    warranty["status"] = status
    warranty["days_left"] = days_left
    return warranty

@app.get("/api/warranties/by-serial/{serial_number}")
async def lookup_by_serial(serial_number: str, current_user: dict = Depends(get_current_user)):
    warranty = await db_instance.find_warranty_by_serial(serial_number)
    if not warranty:
        # Generate simulated verified product based on serial
        return {
            "found": False,
            "message": "New device registration. Enter details to register warranty.",
            "serial_number": serial_number.upper()
        }
    return {
        "found": True,
        "warranty": warranty
    }

# ----------------- PAYMENT & EXTENSION EXECUTION -----------------

@app.post("/api/payment/create-order")
async def create_payment_order(req: PaymentOrderRequest, current_user: dict = Depends(get_current_user)):
    # Generate Razorpay-ready Order ID
    mock_order_id = f"order_fs_{uuid.uuid4().hex[:12]}"
    return {
        "order_id": mock_order_id,
        "amount": int(req.amount * 100), # paise for razorpay
        "currency": req.currency,
        "key_id": "rzp_test_FocusSystemDemoKey123",
        "customer": {
            "name": current_user["full_name"],
            "email": current_user["email"],
            "contact": current_user["phone_number"]
        }
    }

@app.post("/api/payment/verify")
async def verify_payment_and_extend(req: PaymentVerificationRequest, current_user: dict = Depends(get_current_user)):
    w_data = req.warranty_data
    payment_id = req.razorpay_payment_id or f"pay_fs_{uuid.uuid4().hex[:10]}"
    
    # Check if this warranty serial is already registered by this or any user
    existing_warranty = await db_instance.find_warranty_by_serial(w_data.serial_number)
    
    new_expiry = calculate_new_expiry(w_data.current_warranty_expiry, w_data.extension_period)
    
    extension_entry = {
        "extension_id": f"EXT-{uuid.uuid4().hex[:6].upper()}",
        "extended_on": datetime.now().strftime("%Y-%m-%d"),
        "period": w_data.extension_period.value,
        "previous_expiry": w_data.current_warranty_expiry,
        "new_expiry": new_expiry,
        "amount_paid": w_data.amount_paid,
        "payment_id": payment_id
    }

    if existing_warranty and existing_warranty.get("user_id") == current_user["id"]:
        # Extend existing warranty
        hist = existing_warranty.get("extension_history", [])
        hist.append(extension_entry)
        
        status, days_left = compute_warranty_status(new_expiry)
        
        update_fields = {
            "warranty_expiry_date": new_expiry,
            "status": status,
            "days_left": days_left,
            "last_extended_period": w_data.extension_period.value,
            "extension_history": hist,
            "updated_at": datetime.now().isoformat()
        }
        updated_warranty = await db_instance.update_warranty(existing_warranty["id"], update_fields)
        warranty_result = updated_warranty
    else:
        # Create brand new warranty record
        cert_id = f"CERT-{w_data.serial_number.replace(' ', '').upper()}-{uuid.uuid4().hex[:4].upper()}"
        status, days_left = compute_warranty_status(new_expiry)
        
        new_warranty_record = {
            "id": f"WRN-{uuid.uuid4().hex[:8].upper()}",
            "user_id": current_user["id"],
            "customer_name": current_user["full_name"],
            "customer_email": current_user["email"],
            "customer_phone": current_user["phone_number"],
            "product_name": w_data.product_name,
            "product_category": w_data.product_category.value,
            "serial_number": w_data.serial_number.upper(),
            "purchase_date": w_data.purchase_date,
            "warranty_start_date": w_data.purchase_date,
            "original_warranty_expiry": w_data.current_warranty_expiry,
            "warranty_expiry_date": new_expiry,
            "status": status,
            "days_left": days_left,
            "last_extended_period": w_data.extension_period.value,
            "extension_history": [extension_entry],
            "certificate_id": cert_id,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        await db_instance.create_warranty(new_warranty_record)
        warranty_result = new_warranty_record

    # Log Payment Record
    payment_record = {
        "payment_id": payment_id,
        "user_id": current_user["id"],
        "warranty_id": warranty_result["id"],
        "amount": w_data.amount_paid,
        "currency": "INR",
        "method": w_data.payment_method or "Razorpay Gateway",
        "status": "Success",
        "created_at": datetime.now().isoformat()
    }
    await db_instance.create_payment_record(payment_record)

    return {
        "success": True,
        "message": "Warranty extension confirmed successfully!",
        "payment_id": payment_id,
        "warranty": warranty_result,
        "certificate_id": warranty_result["certificate_id"],
        "new_expiry": new_expiry
    }

# ----------------- CERTIFICATE VERIFICATION -----------------

@app.get("/api/warranties/{warranty_id}/certificate")
async def get_warranty_certificate(warranty_id: str, current_user: dict = Depends(get_current_user)):
    warranty = await db_instance.find_warranty_by_id(warranty_id)
    if not warranty:
        raise HTTPException(status_code=404, detail="Certificate not found for this warranty.")
    
    return {
        "certificate_id": warranty.get("certificate_id"),
        "issuer": "Focus System Assurance Global",
        "customer_name": warranty.get("customer_name"),
        "product_name": warranty.get("product_name"),
        "serial_number": warranty.get("serial_number"),
        "category": warranty.get("product_category"),
        "warranty_expiry_date": warranty.get("warranty_expiry_date"),
        "status": warranty.get("status"),
        "issued_at": warranty.get("updated_at") or warranty.get("created_at")
    }

# ----------------- STATIC FILES & SPA SERVING (Render / Unified Deployment) -----------------
try:
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
    if os.path.exists(frontend_dist):
        assets_dir = os.path.join(frontend_dist, "assets")
        if os.path.exists(assets_dir):
            app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

        @app.get("/{full_path:path}")
        async def serve_spa_frontend(full_path: str):
            if full_path.startswith("api/") or full_path in ("docs", "openapi.json", "redoc"):
                raise HTTPException(status_code=404, detail="Not Found")
            file_path = os.path.join(frontend_dist, full_path)
            if os.path.isfile(file_path):
                return FileResponse(file_path)
            index_path = os.path.join(frontend_dist, "index.html")
            if os.path.isfile(index_path):
                return FileResponse(index_path)
            raise HTTPException(status_code=404, detail="Page not found")
except Exception as e:
    pass

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
