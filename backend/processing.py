import os
import time
import subprocess
# from backend.database import SCANS_DB
from database import SCANS_DB

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def run_meld_pipeline(scan_id: str, file_path: str):
    """
    Simulates executing the shell script pipeline sequence:
    1. Renaming -> 2. Conversion (.dcm to .nii.gz) -> 3. Running MELD -> 4. Slice extraction
    """
    try:
        SCANS_DB[scan_id]["status"] = "Processing (Renaming & Converting...)"
        time.sleep(3) # Simulating bash execution latency
        
        # PRODUCTION CODE FOR NEXT WEEK:
        # subprocess.run(["bash", "convert_dcm_to_nii.sh", file_path], check=True)

        SCANS_DB[scan_id]["status"] = "Processing (Running MELD Model...)"
        time.sleep(4) 
        
        # PRODUCTION CODE FOR NEXT WEEK:
        # subprocess.run(["bash", "run_meld.sh", scan_id], check=True)

        SCANS_DB[scan_id]["status"] = "Processing (Generating 2D/3D Views...)"
        time.sleep(3)

        # Update database with mock output assets paths once completed
        SCANS_DB[scan_id]["status"] = "Completed"
        SCANS_DB[scan_id]["output_views"] = {
            "view_2d": "https://in.pinterest.com/pin/949274427724722769/", # sample 1
            "view_3d": "https://in.pinterest.com/pin/949274427724722841/", # sample 2
            "view_4d": "https://in.pinterest.com/pin/949274427724722864/"  # sample 3
        }
    except Exception as e:
        SCANS_DB[scan_id]["status"] = f"Failed: {str(e)}"