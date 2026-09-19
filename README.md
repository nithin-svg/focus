# Focus System - Commercial Warranty Extension & Asset Management Platform

Focus System is a modern, responsive, full-stack warranty registration and multi-year extension platform for Voltage Stabilizers (Refrigerator & TV) and consumer appliances.

## 🚀 Key Features

- **Authentication & Security**:
  - JWT Bearer Token authorization with Bcrypt password hashing.
  - Form validation for full name, email, and 10-digit phone numbers.
  - Protected customer dashboard and account settings.

- **Interactive Warranty Extension Engine**:
  - Auto-categorizes Voltage Stabilizer models:
    - `500 VR Voltage stabilizer( Refrigerator)` -> **Refrigerator**
    - `55 inches voltage stabilizer(TV)` -> **TV**
    - `43 inches voltage stabilizer(TV)` -> **TV**
    - `32 inches voltage stabilizer(TV)` -> **TV**
    - `65 inches voltage stabilizer(TV)` -> **TV**
  - Multi-year extension tiers (**6 Months**, **1 Year**, **2 Years**, **3 Years**).
  - Dynamic quotation engine calculating base price, promotional discounts, GST (18%), and new policy expiry date.

- **Payment & Checkout**:
  - Razorpay / Stripe gateway integration ready.
  - Multi-payment method support: UPI, QR Scan, Cards, NetBanking, and Wallets.
  - Instant policy activation upon payment clearance.

- **Digital Warranty Certificates**:
  - Instant PDF generation & download using `jsPDF` & `html2canvas`.
  - Cryptographic verification seal and QR code stamps.

- **Customer Warranty Portfolio**:
  - Lifecycle tracking with status badges (*Active*, *Expiring Soon*, *Expired*).
  - Search by serial number or product name.
  - Detailed Extension History ledger with previous expiries and payment IDs.

- **Cross-Device Accessibility**:
  - Fully responsive on Mobile Phones (iOS / Android), Tablets, Laptops, and Desktops.
  - LAN / Wi-Fi multi-device access support.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Axios, jsPDF, html2canvas
- **Backend**: Python FastAPI, Uvicorn, Pydantic v2, Jose JWT, Bcrypt
- **Database**: MongoDB with automatic persistent fallback engine
- **Payment Gateway**: Razorpay REST API ready

---

## 💻 Getting Started Locally

### 1. Prerequisites
- Node.js (v18+)
- Python 3.10+

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Credentials
- **Email**: `demo@focussystem.com`
- **Phone**: `+91 98765 43210`
- **Password**: `password123`

---

## 📄 License
MIT License. Focus System Global Inc. All rights reserved.
