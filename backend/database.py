# In-memory database to simulate database persistence
USERS_DB = {
    "doctor@hospital.com": {
        "username": "doctor@hospital.com",
        "hashed_password": "$6$rounds=656000$xyz...$hashedpasswordhere" # password is 'password123'
    }
}

SCANS_DB = {}