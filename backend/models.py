from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class WarrantyStatus(str, Enum):
    ACTIVE = "Active"
    EXPIRING_SOON = "Expiring Soon"
    EXPIRED = "Expired"

class ExtensionPeriod(str, Enum):
    SIX_MONTHS = "6 Months"
    ONE_YEAR = "1 Year"
    TWO_YEARS = "2 Years"
    THREE_YEARS = "3 Years"

class ProductCategory(str, Enum):
    REFRIGERATOR = "Refrigerator"
    TV = "TV"

class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2)
    phone_number: str = Field(..., min_length=7, max_length=15)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLoginRequest(BaseModel):
    identifier: str  # Email or Phone Number
    password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: str
    full_name: str
    phone_number: str
    email: str
    address: Optional[str] = ""
    city: Optional[str] = ""
    postal_code: Optional[str] = ""
    created_at: str

class PriceCalculationRequest(BaseModel):
    product_name: str
    product_category: ProductCategory
    purchase_price: Optional[float] = 49999.0
    extension_period: ExtensionPeriod
    current_warranty_expiry: str

class PriceCalculationResponse(BaseModel):
    base_price: float
    tax_amount: float
    discount_amount: float
    total_amount: float
    currency: str = "INR"
    period: ExtensionPeriod
    new_expiry_date: str
    coverage_features: List[str]

class ExtensionHistoryItem(BaseModel):
    extension_id: str
    extended_on: str
    period: str
    previous_expiry: str
    new_expiry: str
    amount_paid: float
    payment_id: str

class WarrantyCreateRequest(BaseModel):
    product_name: str
    product_category: ProductCategory
    serial_number: str
    purchase_date: str
    current_warranty_expiry: str
    extension_period: ExtensionPeriod
    payment_id: Optional[str] = None
    payment_method: Optional[str] = "Razorpay"
    amount_paid: float

class WarrantyResponse(BaseModel):
    id: str
    user_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    product_name: str
    product_category: str
    serial_number: str
    purchase_date: str
    warranty_start_date: str
    original_warranty_expiry: str
    warranty_expiry_date: str
    status: WarrantyStatus
    days_left: int
    last_extended_period: Optional[str] = None
    extension_history: List[ExtensionHistoryItem] = []
    created_at: str
    updated_at: str
    certificate_id: str

class PaymentOrderRequest(BaseModel):
    warranty_data: WarrantyCreateRequest
    amount: float
    currency: str = "INR"

class PaymentVerificationRequest(BaseModel):
    razorpay_order_id: Optional[str] = "mock_order_123"
    razorpay_payment_id: str
    razorpay_signature: Optional[str] = "mock_sig_123"
    warranty_data: WarrantyCreateRequest
