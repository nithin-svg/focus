import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, date

logger = logging.getLogger("focus_system.database")

# Try importing pymongo / motor
HAS_MONGO = False
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    HAS_MONGO = True
except ImportError:
    pass

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "focus_system_warranty")

class Database:
    def __init__(self):
        self.use_mongo = False
        self.mongo_client = None
        self.db = None
        self.fallback_file = os.path.join(os.path.dirname(__file__), "data_store.json")
        self.memory_store: Dict[str, List[Dict[str, Any]]] = {
            "users": [],
            "warranties": [],
            "payments": []
        }

    async def connect(self):
        if HAS_MONGO:
            try:
                self.mongo_client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=2000)
                # Verify connection
                await self.mongo_client.admin.command('ping')
                self.db = self.mongo_client[DB_NAME]
                self.use_mongo = True
                logger.info("Connected to MongoDB successfully.")
                return
            except Exception as e:
                logger.warning(f"MongoDB connection failed: {e}. Falling back to persistent local storage engine.")
        
        self.use_mongo = False
        self._load_fallback_file()
        logger.info("Using local persistent storage engine.")

    def _load_fallback_file(self):
        if os.path.exists(self.fallback_file):
            try:
                with open(self.fallback_file, "r", encoding="utf-8") as f:
                    self.memory_store = json.load(f)
            except Exception as e:
                logger.error(f"Error loading fallback data: {e}")
        else:
            self._save_fallback_file()

    def _save_fallback_file(self):
        try:
            with open(self.fallback_file, "w", encoding="utf-8") as f:
                json.dump(self.memory_store, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving fallback data: {e}")

    # --- User operations ---
    async def find_user_by_email_or_phone(self, identifier: str) -> Optional[Dict[str, Any]]:
        clean_id = identifier.strip().lower()
        if self.use_mongo:
            return await self.db.users.find_one({
                "$or": [
                    {"email": clean_id},
                    {"phone_number": identifier.strip()}
                ]
            })
        for u in self.memory_store.get("users", []):
            if u.get("email", "").lower() == clean_id or u.get("phone_number", "") == identifier.strip():
                return dict(u)
        return None

    async def find_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        if self.use_mongo:
            return await self.db.users.find_one({"id": user_id})
        for u in self.memory_store.get("users", []):
            if u.get("id") == user_id:
                return dict(u)
        return None

    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.use_mongo:
            await self.db.users.insert_one(user_data)
            return user_data
        self.memory_store.setdefault("users", []).append(user_data)
        self._save_fallback_file()
        return user_data

    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.use_mongo:
            await self.db.users.update_one({"id": user_id}, {"$set": update_data})
            return await self.find_user_by_id(user_id)
        for i, u in enumerate(self.memory_store.get("users", [])):
            if u.get("id") == user_id:
                self.memory_store["users"][i].update(update_data)
                self._save_fallback_file()
                return dict(self.memory_store["users"][i])
        return None

    # --- Warranty operations ---
    async def get_user_warranties(self, user_id: str) -> List[Dict[str, Any]]:
        if self.use_mongo:
            cursor = self.db.warranties.find({"user_id": user_id}).sort("updated_at", -1)
            return [doc async for doc in cursor]
        results = [w for w in self.memory_store.get("warranties", []) if w.get("user_id") == user_id]
        results.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
        return results

    async def find_warranty_by_id(self, warranty_id: str) -> Optional[Dict[str, Any]]:
        if self.use_mongo:
            return await self.db.warranties.find_one({"id": warranty_id})
        for w in self.memory_store.get("warranties", []):
            if w.get("id") == warranty_id:
                return dict(w)
        return None

    async def find_warranty_by_serial(self, serial_number: str) -> Optional[Dict[str, Any]]:
        clean_sn = serial_number.strip().upper()
        if self.use_mongo:
            return await self.db.warranties.find_one({"serial_number": clean_sn})
        for w in self.memory_store.get("warranties", []):
            if w.get("serial_number", "").upper() == clean_sn:
                return dict(w)
        return None

    async def create_warranty(self, warranty_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.use_mongo:
            await self.db.warranties.insert_one(warranty_data)
            return warranty_data
        self.memory_store.setdefault("warranties", []).append(warranty_data)
        self._save_fallback_file()
        return warranty_data

    async def update_warranty(self, warranty_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.use_mongo:
            await self.db.warranties.update_one({"id": warranty_id}, {"$set": update_data})
            return await self.find_warranty_by_id(warranty_id)
        for i, w in enumerate(self.memory_store.get("warranties", [])):
            if w.get("id") == warranty_id:
                self.memory_store["warranties"][i].update(update_data)
                self._save_fallback_file()
                return dict(self.memory_store["warranties"][i])
        return None

    # --- Payment operations ---
    async def create_payment_record(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.use_mongo:
            await self.db.payments.insert_one(payment_data)
            return payment_data
        self.memory_store.setdefault("payments", []).append(payment_data)
        self._save_fallback_file()
        return payment_data

db_instance = Database()
