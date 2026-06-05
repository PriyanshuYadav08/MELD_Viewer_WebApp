import uuid
import os
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
# # from backend.database import SCANS_DB
# from backend.auth import create_access_token, get_current_user, verify_password
# from backend.processing import run_meld_pipeline

from database import SCANS_DB
from auth import create_access_token, get_current_user, verify_password
from processing import run_meld_pipeline

app = FastAPI(title="NeuroImage MELD Pipeline Gateway")

# Enable Cross-Origin Resource Sharing for your local React application dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your exact frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Quick static authentication check
    if form_data.username != "doctor@hospital.com" or not verify_password(form_data.password, ""):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/scans/upload")
async def upload_scan(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...), 
    current_user: str = Depends(get_current_user)
):
    scan_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ".dcm"
    
    if file.filename and file.filename.endswith(".nii.gz"): # to composite extensions like .nii.gz safely
        file_extension = ".nii.gz"

    saved_file_name = f"{scan_id}{file_extension}"
    file_path = os.path.join("uploads", saved_file_name)
    
    with open(file_path, "wb") as buffer: # saving incoming payload stream to disk surface
        buffer.write(await file.read())

    SCANS_DB[scan_id] = { # initializing tracking data block
        "id": scan_id,
        "filename": file.filename,
        "extension": file_extension,
        "status": "Queued",
        "uploaded_by": current_user,
        "output_views": None
    }

    background_tasks.add_task(run_meld_pipeline, scan_id, file_path) # offloading execution tracking to background threads safely
    
    return SCANS_DB[scan_id]

@app.get("/scans")
async def list_scans(current_user: str = Depends(get_current_user)):
    return list(SCANS_DB.values())

@app.get("/scans/{scan_id}")
async def get_scan_details(scan_id: str, current_user: str = Depends(get_current_user)):
    if scan_id not in SCANS_DB:
        raise HTTPException(status_code=404, detail="Requested MRI scan record not found")
    return SCANS_DB[scan_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)