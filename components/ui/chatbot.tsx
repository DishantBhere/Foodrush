"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "👋 Hi! I'm your canteen assistant. Ask me about the menu, prices, or your orders!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#fff7d3",
          color: "#9f242f",
          border: "1px solid rgba(255,247,211,0.3)",
          cursor: "pointer",
          fontSize: "22px",
          boxShadow: "0 4px 24px rgba(159,36,47,0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        title="Chat with Canteen Assistant"
      >
        {isOpen ? "✕" : "🍽️"}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "24px",
            width: "340px",
            height: "440px",
            borderRadius: "24px",
            boxShadow: "0 8px 48px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9998,
            overflow: "hidden",
            fontFamily: "sans-serif",
            background: "rgba(30, 2, 5, 0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,247,211,0.12)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderBottom: "1px solid rgba(255,247,211,0.1)",
              background: "rgba(255,247,211,0.05)",
            }}
          >
            <div style={{ fontSize: "22px" }}>🍽️</div>
            <div>
              <div style={{ color: "#fff7d3", fontWeight: "700", fontSize: "15px" }}>
                Canteen Assistant
              </div>
              <div style={{ color: "rgba(255,247,211,0.5)", fontSize: "11px" }}>
                Ask me anything about food & orders
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              scrollbarWidth: "none",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    background:
                      msg.role === "user"
                        ? "#fff7d3"
                        : "rgba(255,247,211,0.1)",
                    color: msg.role === "user" ? "#9f242f" : "#fff7d3",
                    fontSize: "13.5px",
                    lineHeight: "1.6",
                    border: msg.role === "user"
                      ? "none"
                      : "1px solid rgba(255,247,211,0.15)",
                    fontWeight: msg.role === "user" ? "600" : "400",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background: "rgba(255,247,211,0.1)",
                    border: "1px solid rgba(255,247,211,0.15)",
                    padding: "10px 16px",
                    borderRadius: "18px 18px 18px 4px",
                    fontSize: "16px",
                    letterSpacing: "3px",
                    color: "rgba(255,247,211,0.6)",
                  }}
                >
                  <span style={{ animation: "blink 1.4s infinite" }}>●</span>
                  <span style={{ animation: "blink 1.4s infinite 0.2s" }}>●</span>
                  <span style={{ animation: "blink 1.4s infinite 0.4s" }}>●</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,247,211,0.1)",
              display: "flex",
              gap: "8px",
              alignItems: "center",
              background: "rgba(255,247,211,0.04)",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about menu, prices..."
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "24px",
                border: "1px solid rgba(255,247,211,0.2)",
                fontSize: "13px",
                outline: "none",
                background: "rgba(255,247,211,0.08)",
                color: "#fff7d3",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: input.trim() ? "#fff7d3" : "rgba(255,247,211,0.15)",
                color: input.trim() ? "#9f242f" : "rgba(255,247,211,0.3)",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
                fontWeight: "bold",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        input::placeholder {
          color: rgba(255, 247, 211, 0.35);
        }
      `}</style>
    </>
  );
}