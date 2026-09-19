from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from models import ExtensionPeriod, ProductCategory, PriceCalculationResponse
from typing import Tuple, List

CATEGORY_RATES = {
    ProductCategory.REFRIGERATOR: {"base": 799.0, "rate": 0.035},
    ProductCategory.TV: {"base": 699.0, "rate": 0.03},
}

PERIOD_MULTIPLIERS = {
    ExtensionPeriod.SIX_MONTHS: {"multiplier": 0.65, "months": 6, "discount": 0.05},
    ExtensionPeriod.ONE_YEAR: {"multiplier": 1.00, "months": 12, "discount": 0.15},
    ExtensionPeriod.TWO_YEARS: {"multiplier": 1.80, "months": 24, "discount": 0.25},
    ExtensionPeriod.THREE_YEARS: {"multiplier": 2.50, "months": 36, "discount": 0.35},
}

def calculate_new_expiry(current_expiry_str: str, period: ExtensionPeriod) -> str:
    try:
        current_date = datetime.strptime(current_expiry_str, "%Y-%m-%d").date()
    except Exception:
        current_date = datetime.now().date()
    
    # If currently expired, extension starts from today
    today = datetime.now().date()
    effective_start = current_date if current_date > today else today

    months_to_add = PERIOD_MULTIPLIERS.get(period, {}).get("months", 12)
    new_date = effective_start + relativedelta(months=months_to_add)
    return new_date.strftime("%Y-%m-%d")

def calculate_warranty_price(
    category: ProductCategory,
    purchase_price: float,
    period: ExtensionPeriod,
    current_expiry_str: str
) -> PriceCalculationResponse:
    rate_info = CATEGORY_RATES.get(category, {"base": 1499.0, "rate": 0.04})
    period_info = PERIOD_MULTIPLIERS.get(period, {"multiplier": 1.0, "months": 12, "discount": 0.15})

    raw_base = rate_info["base"] + (purchase_price * rate_info["rate"])
    scaled_base = raw_base * period_info["multiplier"]
    
    # Discount
    discount_rate = period_info["discount"]
    discount_amount = round(scaled_base * discount_rate, 2)
    taxable_amount = round(scaled_base - discount_amount, 2)
    
    # GST / Tax 18%
    tax_amount = round(taxable_amount * 0.18, 2)
    total_amount = round(taxable_amount + tax_amount, 2)

    new_expiry = calculate_new_expiry(current_expiry_str, period)

    features = [
        "100% Genuine OEM Parts Guarantee",
        "Free Doorstep Pickup & Drop",
        "Dedicated VIP Claim Concierge",
        "Unlimited Repair Requests Coverage"
    ]
    if period in [ExtensionPeriod.TWO_YEARS, ExtensionPeriod.THREE_YEARS]:
        features.append("Complimentary Liquid & Screen Damage Cover")
        features.append("Free Annual Preventative Maintenance")

    return PriceCalculationResponse(
        base_price=round(scaled_base, 2),
        tax_amount=tax_amount,
        discount_amount=discount_amount,
        total_amount=total_amount,
        currency="INR",
        period=period,
        new_expiry_date=new_expiry,
        coverage_features=features
    )
