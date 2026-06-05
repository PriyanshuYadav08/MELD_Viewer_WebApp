import os
import time
import shutil
from database import SCANS_DB
from converter import convert_dicom_to_nifti_direct

"""
This function runs automatically in the background when an image is uploaded.
"""
def run_meld_pipeline(scan_id: str, file_path: str):
    try:
        SCANS_DB[scan_id]["status"] = "Processing (Converting .dcm to .nii.gz...)"
        
        input_dir = f"uploads/{scan_id}" # dedicated isolated folders for this specific scan
        output_dir = f"uploads/nifti_outputs/{scan_id}"
        os.makedirs(input_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)
        
        file_name = os.path.basename(file_path) # file into the patient's dedicated input folder
        new_file_path = os.path.join(input_dir, file_name)
        shutil.move(file_path, new_file_path)
        
        convert_dicom_to_nifti_direct(input_dir, output_dir) # file type conversion happening

        SCANS_DB[scan_id]["status"] = "Processing (Running MELD Model...)"
        time.sleep(4) # some delay to simulate the MELD model processing time

        SCANS_DB[scan_id]["status"] = "Processing (Generating 2D/3D Views...)"
        time.sleep(3)

        SCANS_DB[scan_id]["status"] = "Completed"
        SCANS_DB[scan_id]["output_views"] = {
            "view_2d": "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
            "view_3d": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
            "view_4d": "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80"
        }
    except Exception as e:
        SCANS_DB[scan_id]["status"] = f"Failed: {str(e)}"