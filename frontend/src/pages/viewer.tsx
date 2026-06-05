import "./Viewer.css";

const Viewer = () => {
  return (
    <div className="viewer-page">
      <h1>MRI Viewer</h1>

      <div className="viewer-container">
        <div className="viewer-panel">
          Axial View
        </div>

        <div className="viewer-panel">
          Coronal View
        </div>

        <div className="viewer-panel">
          Sagittal View
        </div>
      </div>
    </div>
  );
};

export default Viewer;