import uuid
from datetime import datetime, timedelta
from database import db_instance
from auth import get_password_hash

async def seed_demo_data():
    # Check if demo user already exists
    existing = await db_instance.find_user_by_email_or_phone("demo@focussystem.com")
    if existing:
        return

    demo_user_id = str(uuid.uuid4())
    demo_user = {
        "id": demo_user_id,
        "full_name": "Rajesh Kumar",
        "email": "demo@focussystem.com",
        "phone_number": "+91 98765 43210",
        "password_hash": get_password_hash("password123"),
        "address": "42 Cyber Hub, DLF Phase 2",
        "city": "Bengaluru",
        "postal_code": "560100",
        "created_at": datetime.now().isoformat()
    }
    await db_instance.create_user(demo_user)

    today = datetime.now().date()

    # Pre-populate sample warranties with diverse statuses
    warranties = [
        {
            "id": "WRN-" + str(uuid.uuid4())[:8].upper(),
            "user_id": demo_user_id,
            "customer_name": "Rajesh Kumar",
            "customer_email": "demo@focussystem.com",
            "customer_phone": "+91 98765 43210",
            "product_name": "500 VR Voltage stabilizer( Refrigerator)",
            "product_category": "Refrigerator",
            "serial_number": "FS-VS-500VR-9821",
            "purchase_date": (today - timedelta(days=200)).strftime("%Y-%m-%d"),
            "warranty_start_date": (today - timedelta(days=200)).strftime("%Y-%m-%d"),
            "original_warranty_expiry": (today + timedelta(days=165)).strftime("%Y-%m-%d"),
            "warranty_expiry_date": (today + timedelta(days=165)).strftime("%Y-%m-%d"),
            "status": "Active",
            "days_left": 165,
            "last_extended_period": "Initial OEM Warranty",
            "extension_history": [
                {
                    "extension_id": "EXT-001",
                    "extended_on": (today - timedelta(days=200)).strftime("%Y-%m-%d"),
                    "period": "1 Year OEM",
                    "previous_expiry": "N/A",
                    "new_expiry": (today + timedelta(days=165)).strftime("%Y-%m-%d"),
                    "amount_paid": 0.0,
                    "payment_id": "OEM-REG-001"
                }
            ],
            "certificate_id": "CERT-VS500VR-9821-FS",
            "created_at": (today - timedelta(days=200)).isoformat(),
            "updated_at": (today - timedelta(days=200)).isoformat()
        },
        {
            "id": "WRN-" + str(uuid.uuid4())[:8].upper(),
            "user_id": demo_user_id,
            "customer_name": "Rajesh Kumar",
            "customer_email": "demo@focussystem.com",
            "customer_phone": "+91 98765 43210",
            "product_name": "55 inches voltage stabilizer(TV)",
            "product_category": "TV",
            "serial_number": "FS-VS-55TV-7734",
            "purchase_date": (today - timedelta(days=347)).strftime("%Y-%m-%d"),
            "warranty_start_date": (today - timedelta(days=347)).strftime("%Y-%m-%d"),
            "original_warranty_expiry": (today + timedelta(days=18)).strftime("%Y-%m-%d"),
            "warranty_expiry_date": (today + timedelta(days=18)).strftime("%Y-%m-%d"),
            "status": "Expiring Soon",
            "days_left": 18,
            "last_extended_period": "Initial 1 Year",
            "extension_history": [
                {
                    "extension_id": "EXT-002",
                    "extended_on": (today - timedelta(days=347)).strftime("%Y-%m-%d"),
                    "period": "1 Year Standard",
                    "previous_expiry": "N/A",
                    "new_expiry": (today + timedelta(days=18)).strftime("%Y-%m-%d"),
                    "amount_paid": 0.0,
                    "payment_id": "TV-STAB-INIT"
                }
            ],
            "certificate_id": "CERT-VS55TV-7734-FS",
            "created_at": (today - timedelta(days=347)).isoformat(),
            "updated_at": (today - timedelta(days=347)).isoformat()
        },
        {
            "id": "WRN-" + str(uuid.uuid4())[:8].upper(),
            "user_id": demo_user_id,
            "customer_name": "Rajesh Kumar",
            "customer_email": "demo@focussystem.com",
            "customer_phone": "+91 98765 43210",
            "product_name": "65 inches voltage stabilizer(TV)",
            "product_category": "TV",
            "serial_number": "FS-VS-65TV-4491",
            "purchase_date": (today - timedelta(days=500)).strftime("%Y-%m-%d"),
            "warranty_start_date": (today - timedelta(days=500)).strftime("%Y-%m-%d"),
            "original_warranty_expiry": (today - timedelta(days=135)).strftime("%Y-%m-%d"),
            "warranty_expiry_date": (today + timedelta(days=230)).strftime("%Y-%m-%d"),
            "status": "Active",
            "days_left": 230,
            "last_extended_period": "1 Year",
            "extension_history": [
                {
                    "extension_id": "EXT-003",
                    "extended_on": (today - timedelta(days=135)).strftime("%Y-%m-%d"),
                    "period": "1 Year",
                    "previous_expiry": (today - timedelta(days=135)).strftime("%Y-%m-%d"),
                    "new_expiry": (today + timedelta(days=230)).strftime("%Y-%m-%d"),
                    "amount_paid": 899.0,
                    "payment_id": "pay_StabExt_88219"
                }
            ],
            "certificate_id": "CERT-VS65TV-4491-FS",
            "created_at": (today - timedelta(days=500)).isoformat(),
            "updated_at": (today - timedelta(days=135)).isoformat()
        },
        {
            "id": "WRN-" + str(uuid.uuid4())[:8].upper(),
            "user_id": demo_user_id,
            "customer_name": "Rajesh Kumar",
            "customer_email": "demo@focussystem.com",
            "customer_phone": "+91 98765 43210",
            "product_name": "43 inches voltage stabilizer(TV)",
            "product_category": "TV",
            "serial_number": "FS-VS-43TV-1109",
            "purchase_date": (today - timedelta(days=400)).strftime("%Y-%m-%d"),
            "warranty_start_date": (today - timedelta(days=400)).strftime("%Y-%m-%d"),
            "original_warranty_expiry": (today - timedelta(days=35)).strftime("%Y-%m-%d"),
            "warranty_expiry_date": (today - timedelta(days=35)).strftime("%Y-%m-%d"),
            "status": "Expired",
            "days_left": -35,
            "last_extended_period": "Initial 1 Year",
            "extension_history": [],
            "certificate_id": "CERT-VS43TV-1109-FS",
            "created_at": (today - timedelta(days=400)).isoformat(),
            "updated_at": (today - timedelta(days=35)).isoformat()
        }
    ]

    for w in warranties:
        await db_instance.create_warranty(w)
