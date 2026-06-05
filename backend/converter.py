import os
import subprocess
from pathlib import Path

"""
Directly converts a folder of DICOMs to NIfTI (.nii.gz) using dcm2niix. This is the fastest method if you just need the image files.
"""
def convert_dicom_to_nifti_direct(dicom_dir: str, output_dir: str):
    print(f"Starting direct conversion for: {dicom_dir}")
    
    os.makedirs(output_dir, exist_ok=True) # to see if the directory exists, if not create it
    
    command = [
        "dcm2niix",
        "-z", "y",
        "-o", output_dir,
        "-f", "%p_%s",
        dicom_dir
    ]
    
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print("Conversion successful!")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print("Error during conversion!")
        print(e.stderr)

"""
Uses BIDScoin to convert DICOMs and organize them into BIDS format. BIDScoin requires a mapping step (bidsmapper) before coining (bidscoiner).
"""
def convert_using_bidscoin(dicom_dir: str, bids_output_dir: str):

    print(f"Starting BIDScoin pipeline for: {dicom_dir}")
    
    map_command = ["bidsmapper", dicom_dir, bids_output_dir] # bidsmapper to create a template (requires user input in GUI usually, force it for automation if possible)
    
    coin_command = ["bidscoiner", dicom_dir, bids_output_dir] #bidscoiner to execute the dcm2niix2bids plugin
    
    try:
        print("Running bidsmapper (Template generation)...")
        subprocess.run(map_command, check=True)
        
        print("Running bidscoiner (Executing dcm2niix2bids)...")
        subprocess.run(coin_command, check=True)
        print("BIDScoin conversion complete!")
    except subprocess.CalledProcessError as e:
        print("Error during BIDScoin pipeline!")
        print(e)

if __name__ == "__main__":
    INPUT_DICOM_FOLDER = "uploads"
    OUTPUT_NIFTI_FOLDER = "uploads/nifti_outputs"
    
    Path(INPUT_DICOM_FOLDER).mkdir(parents=True, exist_ok=True)
    Path(OUTPUT_NIFTI_FOLDER).mkdir(parents=True, exist_ok=True)
    
    print("--- MRI Conversion Utility ---")
    
    convert_dicom_to_nifti_direct(INPUT_DICOM_FOLDER, OUTPUT_NIFTI_FOLDER)