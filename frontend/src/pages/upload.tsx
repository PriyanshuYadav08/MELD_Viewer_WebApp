import "./Upload.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const navigate = useNavigate();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    alert(`Selected File: ${selectedFile.name}`);

    navigate("/viewer");
  };

  return (
    <div className="upload-page">
      <h1>Upload MRI Scan</h1>

      <div className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <div className="file-info">
          <h3>Selected File</h3>

          <p>{selectedFile.name}</p>
        </div>
      )}

      <button
        className="submit-btn"
        onClick={handleUpload}
      >
        Upload Scan
      </button>
    </div>
  );
};

export default Upload;