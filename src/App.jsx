
import React, { useRef } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Reusable scrollable content component
const ScrollableContent = ({ title, date }) => (
  <div className="scrollable-toast-content">
    <h4>{title}</h4>
    <p><small>{date}</small></p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit.</p>
    <p>Excepteur sint occaecat cupidatat non proident.</p>
    <p>End of content.</p>
  </div>
);

const PopupContent = ({ closeToast, data }) => (
  <>
    <div className="popup-overlay" onClick={closeToast}></div>
    <div className="popup-content">
      <h3>Popup Notification {data}</h3>
      <p>This mimics a modal with a backdrop.</p>
      <p>Background interactions should be blocked.</p>
      <button className="control-btn" onClick={closeToast} style={{ marginTop: '10px' }}>
        Dismiss
      </button>
    </div>
  </>
);

function App() {
  // Store toast IDs to handle "Clear All" for specific groups
  const leftToastIds = useRef(new Set());
  const bottomToastIds = useRef(new Set());

  // Helper to remove ID from set when toast is closed strictly
  const handleClose = (id, setRef) => {
    setRef.current.delete(id);
  };

  // Scenario 1: Top-Left, stacking top down (standard)
  const notifyLeft = () => {
    const id = toast.info(
      <ScrollableContent title="Left Toast" date={new Date().toLocaleTimeString()} />,
      {
        containerId: 'left',
        position: "top-left",
        autoClose: false, // User requested no auto-close
        onClose: () => handleClose(id, leftToastIds) // Cleanup ID on close
      }
    );
    leftToastIds.current.add(id);
  };

  const clearLeft = () => {
    leftToastIds.current.forEach(id => toast.dismiss(id));
    leftToastIds.current.clear();
  };

  // Scenario 2: Bottom, Left-to-Right
  const notifyBottom = () => {
    const id = toast.success(
      <ScrollableContent title="Bottom Toast" date={new Date().toLocaleTimeString()} />,
      {
        containerId: 'bottom',
        position: "bottom-center",
        autoClose: false, // User requested no auto-close
        transition: Slide,
        onClose: () => handleClose(id, bottomToastIds)
      }
    );
    bottomToastIds.current.add(id);
  };

  const clearBottom = () => {
    bottomToastIds.current.forEach(id => toast.dismiss(id));
    bottomToastIds.current.clear();
  };

  // Scenario 3: Popup with Backdrop
  const notifyPopup = () => {
    toast(<PopupContent data={new Date().toLocaleTimeString()} />, {
      containerId: 'popup',
      position: "center",
      className: 'popup-toast-wrapper',
      bodyClassName: "popup-toast-body",
      closeButton: false,
      closeOnClick: false,
      draggable: false,
      autoClose: false,
      icon: false
    });
  };

  // Generate a grid of background buttons
  const bgButtons = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="app-container">
      {/* Mock background to test interactions */}
      <div className="mock-grid">
        {bgButtons.map(i => (
          <button
            key={i}
            className="mock-btn"
            onClick={() => console.log(`Clicked Bg Button ${i}`)}
          >
            Bg Btn {i}
          </button>
        ))}
      </div>

      {/* Controllers */}
      <div className="controls">
        <h3>Toast Controls</h3>

        {/* Left Controls */}
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="control-btn" onClick={notifyLeft}>
            1. Left (Add)
          </button>
          <button className="control-btn secondary" onClick={clearLeft}>
            Clear
          </button>
        </div>

        {/* Bottom Controls */}
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="control-btn" onClick={notifyBottom}>
            2. Bottom (Add)
          </button>
          <button className="control-btn secondary" onClick={clearBottom}>
            Clear
          </button>
        </div>

        {/* Popup Control */}
        <button className="control-btn" onClick={notifyPopup}>
          3. Popup (Modal)
        </button>
      </div>

      {/* Containers */}

      {/* 1. Left Side */}
      <ToastContainer
        containerId="left"
        enableMultiContainer
        position="top-left"
        style={{ width: "320px" }} // Slightly wider to accommodate content
      />

      {/* 2. Bottom Side (Horizontal) */}
      <ToastContainer
        containerId="bottom"
        enableMultiContainer
        position="bottom-center"
        className="toast-container-bottom"
        newestOnTop={false}
      />

      {/* 3. Popup (Modal) */}
      <ToastContainer
        containerId="popup"
        enableMultiContainer
        position="center"
        className="toast-container-popup"
        limit={3}
      />
    </div>
  );
}

export default App;
