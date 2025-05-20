// src/pages/Homepage1.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useReactMediaRecorder } from "react-media-recorder";

import {
  FaBold, FaItalic, FaStrikethrough, FaLink, FaListUl, FaCode, FaExternalLinkAlt,
  FaPlus, FaFont, FaSmile, FaAt, FaCamera, FaMicrophone, FaPencilAlt, FaPaperPlane, FaTrash,
  FaVideo, FaPause, FaPlay, FaUpload, FaTimes, FaQuestionCircle, FaExclamationTriangle, FaMagic, FaCog,
  FaVideoSlash, FaMicrophoneSlash
} from "react-icons/fa";

export default function Homepage1() {
  // ————— STATE —————
  const [companyName, setCompanyName] = useState("Loading...");
  const [projectName, setProjectName] = useState("Loading...");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({ name: "User", email: "" });

  // camera/modal/recording
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);

  // after pressing Done
  const [messageVideo, setMessageVideo] = useState(null);

  // refs for live preview
  const streamRef = useRef(null);
  const videoRef = useRef(null);

  // hooks
  const {
    status: audioStatus,
    startRecording: startAudio,
    stopRecording: stopAudio,
    mediaBlobUrl: audioUrl,
    clearBlobUrl: clearAudioBlob,
  } = useReactMediaRecorder({ audio: true });

  const {
    status: videoStatus,
    startRecording: startVideo,
    stopRecording: stopVideo,
    mediaBlobUrl: videoUrl,
    clearBlobUrl: clearVideoBlob,
  } = useReactMediaRecorder({ video: true });

  const navigate = useNavigate();
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long"
  });

  const navButtons = [
    { icon: "💬", label: "Messages", to: "/homepage1" },
    { icon: "📖", label: "Company handbook", to: "/companyhandbook" },
    { icon: "", label: "+", to: "#" }
  ];

  // ————— LIFECYCLE —————
  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // auto-start/stop camera when modal opens/closes
  useEffect(() => {
    if (showCameraModal) startCamera();
    else stopCamera();
  }, [showCameraModal]);

  // ————— FETCH/MESSAGING —————
  async function fetchInitialData() {
    try {
      const [uRes, mRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/get-current-user", { credentials: "include" }),
        fetch("http://127.0.0.1:5000/get-messages")
      ]);
      if (uRes.ok) {
        const ud = await uRes.json();
        setUser({ name: ud.name, email: ud.email });
        setCompanyName(ud.company_name || "Unknown");
        setProjectName(ud.project_type || "Unknown");
      }
      if (mRes.ok) {
        const msgs = (await mRes.json()).reverse();
        setMessages(msgs);
      }
    } catch (e) { console.error(e); }
  }
  async function fetchMessages() {
    try {
      const r = await fetch("http://127.0.0.1:5000/get-messages");
      if (r.ok) setMessages((await r.json()).reverse());
    } catch (e) { console.error(e); }
  }

  async function handleSend() {
    if (!message.trim()) return;
    const newMsg = { name: user.name, message, timestamp: new Date().toLocaleString() };
    try {
      await fetch("http://127.0.0.1:5000/send-message", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, message })
      });
      setMessages((m) => [newMsg, ...m]);
      setMessage("");
      fetchMessages();
      // if video preview exists, send it too:
      if (messageVideo) {
        await sendMediaMessage(messageVideo, "video");
        setMessageVideo(null);
      }
    } catch (e) { console.error(e); }
  }

  async function handleDelete(ts) {
    try {
      await fetch("http://127.0.0.1:5000/delete-message", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: ts })
      });
      fetchMessages();
    } catch (e) { console.error(e); }
  }

  async function sendMediaMessage(url, type) {
    try {
      const blob = await fetch(url).then(r => r.blob());
      const form = new FormData();
      form.append("file", blob, `${type}_${Date.now()}.${type === "audio" ? "webm" : "mp4"}`);
      form.append("type", type);
      form.append("username", user.name);

      await fetch("http://127.0.0.1:5000/upload-media", {
        method: "POST",
        credentials: "include",
        body: form
      });
      fetchMessages();
      if (type === "audio") clearAudioBlob();
      else clearVideoBlob();
    } catch (e) { console.error(e); }
  }

  // ————— CAMERA CONTROL —————
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (e) {
      console.error("Camera access error", e);
    }
  }
  function stopCamera() {
    const s = videoRef.current?.srcObject;
    if (s) {
      s.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }

  useEffect(() => {
    // when modal opens, start the camera
    if (showCameraModal) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsCameraOn(true);
        })
        .catch(err => {
          console.error("Could not start camera preview:", err);
        });
    }
  
    // cleanup when modal closes (or component unmounts)
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
      }
    };
  }, [showCameraModal]);

  // ————— RECORDING CONTROL —————
  function handleStartRecording() {
    setIsRecording(true);
    setIsPaused(false);
    startVideo();
  }
  function handlePauseRecording() {
    setIsPaused(true);
    stopVideo();
  }
  function handleResumeRecording() {
    setIsPaused(false);
    startVideo();
  }
  function handleDoneRecording() {
    setIsRecording(false);
    setIsPaused(false);
    stopVideo();
    setShowDoneButton(true);
  }
  function handleStartOver() {
    clearVideoBlob();
    setShowDoneButton(false);
    setIsRecording(false);
    setIsPaused(false);
    startVideo();
    setIsRecording(true);
  }
  function handleUploadVideo() {
    if (videoUrl) {
      setMessageVideo(videoUrl);
      setShowCameraModal(false);
      stopCamera();
      clearVideoBlob();
    }
  }

  // ————— CAMERA MODAL —————
  const CameraModal = () => (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.75)",
      display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "#1a1d21",
        padding: 20,
        borderRadius: 8,
        width: "90%",
        maxWidth: 800,
        maxHeight: "90vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "white", margin: 0 }}>Record video clip</h3>
          <div style={{ display: "flex", gap: 15 }}>
            <FaQuestionCircle size={20} color="white" />
            <button onClick={() => { setShowCameraModal(false); stopCamera(); setShowDoneButton(false); }} style={{ background: "none", border: "none", color: "white" }}>
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Live feed OR “Camera off” */}
        <div style={{
          position: "relative",
          backgroundColor: "black",
          width: "100%", aspectRatio: "16/9",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 15
        }}>
          {isCameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
            />
          ) : (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              color: "white", textAlign: "center"
            }}>
              Camera is off.
            </div>
          )}
          {/* REC badge */}
          {isRecording && !isPaused && (
            <div style={{
              position: "absolute", top: 10, left: 10,
              backgroundColor: "red", color: "white",
              padding: "4px 8px", borderRadius: 4,
              fontSize: 12, fontWeight: "bold"
            }}>
              ● REC
            </div>
          )}
        </div>

        {/* Preview the finished clip */}
        {showDoneButton && videoUrl && (
          <div style={{ marginBottom: 15 }}>
            <video
              src={videoUrl}
              controls
              style={{ width: "100%", borderRadius: 8 }}
            />
          </div>
        )}

        {/* Controls bar */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "0 8px"
        }}>
          {isRecording && (
            <button onClick={handleStartOver} style={btnStyleGray}>Start Over</button>
          )}
          {isRecording && !showDoneButton && (
            <button onClick={handleDoneRecording} style={btnStyleGreen}>Done</button>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            {/* Toggle cam */}
            <button onClick={() => isCameraOn ? stopCamera() : startCamera()} style={iconBtnStyle}>
              {isCameraOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
            </button>
            {/* Pause/Resume/Record */}
            <button onClick={() => {
              if (!isRecording) handleStartRecording();
              else if (isRecording && !isPaused) handlePauseRecording();
              else handleResumeRecording();
            }} style={{
              ...iconBtnStyle,
              backgroundColor: isRecording ? (isPaused ? "#FFA726" : "#ff4444") : "#4FC3F7"
            }}>
              {isRecording
                ? (isPaused ? <FaPlay size={20} /> : <FaPause size={20} />)
                : <FaVideo size={20} />}
            </button>
            {/* Upload (only after Done) */}
            {showDoneButton && (
              <button onClick={handleUploadVideo} style={iconBtnStyle}>
                <FaUpload size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#1a1d21", height: "100%" }}>

        {/* Header */}
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#1a1d21" }}>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#e6e6e6", marginBottom: "12px" }}>
            # all-{companyName}
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            {navButtons.map((btn, i) => (
              <button key={i} onClick={() => btn.to !== "#" && navigate(btn.to)} style={{
                background: "transparent", border: "none", color: "#9ea3a8",
                fontSize: btn.label === "+" ? "20px" : "14px", cursor: "pointer"
              }}>
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Welcome Banner */}
        <div style={{ background: "linear-gradient(180deg, #4a154b 0%, #1a1d21 100%)", padding: "32px 16px", color: "white" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px" }}>
            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>
              Everyone's all here in # all-{companyName}
            </h2>
            <p style={{ margin: 0, color: "#9ea3a8", fontSize: "15px" }}>
              Share announcements and updates about company news, upcoming events or teammates who deserve some kudos. ⭐
            </p>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#9ea3a8", fontSize: "12px", textAlign: "center", marginBottom: "16px" }}>
            {formattedDate}
          </div>

          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "4px",
                backgroundColor: "#4a154b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "500"
              }}>
                {msg.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                  <strong style={{ color: "#e6e6e6" }}>{msg.name}</strong>
                  <span style={{ color: "#666", fontSize: "11px" }}>{msg.timestamp}</span>
                </div>
                {msg.message && <div style={{ color: "#d0d0d0", fontSize: "14px", marginTop: "2px" }}>{msg.message}</div>}
                {msg.video_url && (
                  <div style={{ marginTop: "8px" }}>
                    <video src={msg.video_url} controls style={{ maxWidth: "300px", borderRadius: '4px' }} />
                  </div>
                )}
              </div>
              <button onClick={() => handleDelete(msg.timestamp)} style={{
                background: "transparent",
                border: "none",
                color: "#ff6666",
                fontSize: "16px",
                cursor: "pointer"
              }}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <div style={{ backgroundColor: "transparent", padding: "0 16px 16px 16px", marginTop: "auto" }}>
          <div style={{
            border: "1px solid #424242",
            borderRadius: "4px",
            backgroundColor: "#222529",
            padding: "12px"
          }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              {[FaBold, FaItalic, FaStrikethrough, FaLink, FaListUl, FaCode, FaExternalLinkAlt].map((Icon, i) => (
                <button key={i} style={{ background: "transparent", border: "none", color: "#9ea3a8", fontSize: "15px" }}>
                  <Icon />
                </button>
              ))}
            </div>

            {messageVideo && (
              <div style={{ 
                position: 'relative',
                width: '200px',
                marginBottom: '12px',
                marginTop: '12px'
              }}>
                <button
                  onClick={() => setMessageVideo(null)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ff4444',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    zIndex: 1
                  }}
                >
                  <FaTimes size={12} />
                </button>
                <video 
                  src={messageVideo} 
                  controls
                  style={{ 
                    width: '100%',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: messageVideo ? '0' : '12px' }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {[FaPlus, FaFont, FaSmile, FaAt].map((Icon, i) => (
                  <button key={i} style={{ background: "transparent", border: "none", color: "#9ea3a8", fontSize: "16px" }}>
                    <Icon />
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  messageVideo ? "Add a comment to your video..." : `Message #all-${companyName}`
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                style={{
                  flexGrow: 1,
                  backgroundColor: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "15px",
                  outline: "none",
                  padding: "8px 12px",
                }}
              />

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setShowCameraModal(true)}
                  style={{ background: "transparent", border: "none", color: "#9ea3a8", fontSize: "16px" }}
                >
                  <FaCamera />
                </button>
                <button
                  onClick={() => {
                    if (audioStatus === "recording") stopAudio();
                    else startAudio();
                  }}
                  style={{ background: "transparent", border: "none", color: "#9ea3a8", fontSize: "16px" }}
                >
                  <FaMicrophone />
                </button>
                <button style={{ background: "transparent", border: "none", color: "#9ea3a8", fontSize: "16px" }}>
                  <FaPencilAlt />
                </button>
                <button onClick={handleSend} style={{ background: "transparent", border: "none", color: "#4FC3F7", fontSize: "16px" }}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showCameraModal && <CameraModal />}
      </div>
    </MainLayout>
  );
}

// ————— STYLES —————
const iconBtnStyle = {
  background: "none",
  border: "none",
  color: "#9ea3a8",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "50%",
};
const btnStyleGray = {
  padding: "8px 12px",
  backgroundColor: "#616161",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
const btnStyleGreen = {
  padding: "8px 12px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
