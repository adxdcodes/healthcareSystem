import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNotesMedical,
  faCalendarCheck,
  faCapsules,
  faGear,
  faRightFromBracket,
  faMicrochip,
} from "@fortawesome/free-solid-svg-icons";
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Menu, Spin, message } from "antd";
import Header from "../components/Header";

const items = [
  {
    key: "1",
    icon: <FontAwesomeIcon icon={faNotesMedical} />,
    label: "My Health Records",
  },
  {
    key: "2",
    icon: <FontAwesomeIcon icon={faCalendarCheck} />,
    label: "Appointments",
  },
  {
    key: "3",
    icon: <FontAwesomeIcon icon={faCapsules} />,
    label: "Prescriptions",
  },
  {
    key: "4",
    label: "AI Health Predictions",
    icon: <FontAwesomeIcon icon={faMicrochip} />,
  },
  {
    key: "5",
    label: "Emergency Contacts",
    icon: <AppstoreOutlined />,
  },
  {
    key: "6",
    icon: <FontAwesomeIcon icon={faGear} />,
    label: "Settings & Profile",
  },
  {
    key: "7",
    icon: <FontAwesomeIcon icon={faRightFromBracket} />,
    label: "Logout",
  },
];

const App = () => {
  // PatientId fetching and setting
  // PatientId fetching and setting
  const [patientId, setPatientId] = useState(
    sessionStorage.getItem("patientId")
  );

  useEffect(() => {
    const storedId = sessionStorage.getItem("patientId");
    setPatientId(storedId);
  }, [location.pathname]);

  // PatientId fetching and setting
  // PatientId fetching and setting

  const [collapsed, setCollapsed] = useState(false);
  const [chInput, setChInput] = useState("");
  const [chMsg, setChMsg] = useState([
    { sender: "ai", text: "How are you feeling today?!" },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleMenuClick = ({ key }) => {
    if (key === "7") {
      const hide = message.loading("Logging out...", 1.5);
      setTimeout(() => {
        hide();
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("patientId");
        message.success("Logged out successfully!", 1);
        navigate("/login");
      }, 1500);
    } else if (key === "1") {
      navigate("/dashboard");
    } else if (key === "4") {
      navigate("/chat");
    } else if (key === "6") {
      navigate("/complete-profile");
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      fetch("http://localhost:5000/routes/verifyToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (!patientId) return;
    const fetchLastFourChats = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/routes/chat/${patientId}/last4`
        );
        const data = await res.json();
        console.log(data.message);
        const formattedMsgs = data.message.map((msg) => ({
          sender: msg.role === "user" ? "user" : "ai",
          text: msg.content,
        }));

        setChMsg(formattedMsgs.length > 0 ? formattedMsgs : chMsg);
      } catch (err) {
        console.error("Error fetching last 4 chats:", err);
      }
    };
    fetchLastFourChats();
  }, [patientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chMsg]);

  const sendMessage = async () => {
    if (!chInput.trim() || loading) return;

    const userMsg = { sender: "user", text: chInput };
    setChMsg((prev) => [...prev, userMsg]);
    const tempInput = chInput;
    setChInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/routes/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: tempInput, patientId }),
      });

      const data = await response.json();
      const botMsg = { sender: "ai", text: data.reply };
      setChMsg((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error:", error);
      setChMsg((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`h-full flex flex-col ${
            collapsed ? "w-20" : "w-64"
          } transition-all`}
        >
          <div className="p-4">
            <Button type="primary" onClick={toggleCollapsed}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
          <div className="flex-1">
            <Menu
              defaultSelectedKeys={["4"]}
              mode="inline"
              theme="dark"
              inlineCollapsed={collapsed}
              items={items}
              onClick={handleMenuClick}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-full h-full flex flex-col p-8 overflow-hidden">
          <h2 className="text-3xl font-bold text-white mb-6">AI Guide!</h2>
          <div className="flex-1 p-6 border rounded shadow bg-white flex flex-col overflow-hidden">
            {/* Chat messages */}

            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
              <p className="bg-gray-100 text-left p-3 rounded-lg max-w-[80%] whitespace-pre-wrap">
                Hello! This is MedGuardian.
              </p>
              {chMsg.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-right ml-auto"
                      : "bg-gray-100 text-left"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded px-5 py-2"
                placeholder="Type your message..."
                value={chInput}
                onChange={(e) => setChInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <button
                className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={sendMessage}
                disabled={loading}
              >
                {loading ? <Spin size="small" /> : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
