import React, { useRef, useState } from 'react';
import { ToastContainer, toast, Slide, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Create a custom transition with 0 duration for instant open/close
const Instant = cssTransition({
  enter: "instant-toast-enter",
  exit: "instant-toast-exit",
  duration: 1, // Use 1ms to avoid edge cases
  appendPosition: false
});

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

const PopupContent = ({ closeToast, data, order, onMount, onUnmount }) => {
  React.useEffect(() => {
    onMount();
    return () => {
      onUnmount();
    };
  }, []);

  return (
    <>
      {/* Overlay removed to use global shared backdrop */}
      <div className="popup-content">
        <h3>Popup Notification {data}</h3>
        <p>This mimics a modal with a backdrop.</p>
        <p>Background interactions should be blocked.</p>
        <button
          className="control-btn"
          onClick={(e) => {
            e.stopPropagation();
            closeToast();
          }}
          style={{ marginTop: '10px' }}
        >
          Dismiss
        </button>
      </div>
    </>
  );
};

function App() {
  // Store toast IDs to handle "Clear All" for specific groups
  const leftToastIds = useRef(new Set());
  const bottomToastIds = useRef(new Set());

  // Counter for popup order (ID generation)
  const popupCount = useRef(0);
  // State for active popup count to manage global backdrop
  const [activePopupCount, setActivePopupCount] = useState(0);

  // Helper to remove ID from set when toast is closed strictly
  // const handleClose = (id, setRef) => {
  //   setRef.current.delete(id);
  // };

  // Scenario 1: Top-Left, stacking top down (standard)
  const notifyLeft = () => {
    const customId = `left-${Date.now()}-${Math.random()}`;
    toast.info(
      <ScrollableContent title="Left Toast" date={new Date().toLocaleTimeString()} />,
      {
        toastId: customId,
        containerId: 'left',
        position: "top-left",
        autoClose: false, // User requested no auto-close
        // onClose: () => handleClose(customId, leftToastIds) // Temporarily disabled to debug
      }
    );
    leftToastIds.current.add(customId);
    console.log('Added Left Toast:', customId, 'Set size:', leftToastIds.current.size);
  };

  const clearLeft = () => {
    console.log('Clearing Left Toasts. Count:', leftToastIds.current.size);
    leftToastIds.current.forEach(id => toast.dismiss(id));
    leftToastIds.current.clear();
  };

  // Scenario 2: Bottom, Left-to-Right
  const notifyBottom = () => {
    const customId = `bottom-${Date.now()}-${Math.random()}`;
    toast.success(
      <ScrollableContent title="Bottom Toast" date={new Date().toLocaleTimeString()} />,
      {
        toastId: customId,
        containerId: 'bottom',
        position: "bottom-center",
        autoClose: false, // User requested no auto-close
        transition: Slide,
        // onClose: () => handleClose(customId, bottomToastIds)
      }
    );
    bottomToastIds.current.add(customId);
    console.log('Added Bottom Toast:', customId, 'Set size:', bottomToastIds.current.size);
  };

  const clearBottom = () => {
    console.log('Clearing Bottom Toasts. Count:', bottomToastIds.current.size);
    bottomToastIds.current.forEach(id => toast.dismiss(id));
    bottomToastIds.current.clear();
  };

  // Scenario 3: Popup with Backdrop
  const notifyPopup = () => {
    popupCount.current += 1;
    const order = popupCount.current;
    const popupId = `popup-${order}`;

    // Remove manual increment here
    // setActivePopupCount(prev => prev + 1);

    toast(
      <PopupContent
        data={`Order #${order} (${new Date().toLocaleTimeString()})`}
        order={order}
        onMount={() => setActivePopupCount(prev => prev + 1)}
        onUnmount={() => setActivePopupCount(prev => Math.max(0, prev - 1))}
      />,
      {
        toastId: popupId,
        containerId: 'popup',
        position: "center",
        className: 'popup-toast-wrapper',
        bodyClassName: "popup-toast-body",
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        autoClose: false,
        icon: false,
        // Using newestOnTop={true} here combined with the container logic to ensure numbering order
      }
    );
  };

  // Generate a grid of background buttons
  const bgButtons = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="app-container">
      {/* Global Shared Backdrop */}
      {activePopupCount > 0 && <div className="global-popup-backdrop" />}

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
        className="toast-container-left"
        style={{ width: "320px" }} // Slightly wider to accommodate content
        draggable={false}
      />

      {/* 2. Bottom Side (Horizontal) */}
      <ToastContainer
        containerId="bottom"
        enableMultiContainer
        position="bottom-center"
        className="toast-container-bottom"
        newestOnTop={false}
        draggable={false}
      />

      {/* 3. Popup (Modal) */}
      <ToastContainer
        containerId="popup"
        enableMultiContainer
        position="center"
        className="toast-container-popup"
        draggable={false}
        newestOnTop={true}
        transition={Instant}
      />
    </div>
  );
}

export default App;
