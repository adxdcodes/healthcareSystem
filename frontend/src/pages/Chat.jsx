import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

// Menu Items
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
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [chInput, setChInput] = useState("");
  const [chMsg, setChMsg] = useState([
    { sender: "bot", text: "Hello! How are you feeling today?!" },
  ]);
  const [loading, setLoading] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = ({ key }) => {
    if (key === "7") {
      const hide = message.loading("Logging out...", 1.5);
      setTimeout(() => {
        hide();
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        message.success("Logged out successfully!", 1);
        navigate("/login");
      }, 1500);
    } else if (key === "1") {
      navigate("/dashboard");
    } else if (key === "4") {
      navigate("/chat");
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

  const sendMessage = async () => {
    if (!chInput.trim() || loading) return;

    const userMsg = { sender: "user", text: chInput };
    setChMsg((prev) => [...prev, userMsg]);
    setChInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/routes/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: chInput }),
      });

      const data = await response.json();
      const botMsg = { sender: "bot", text: data.reply };
      setChMsg((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error:", error);
      setChMsg((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 noselect">
      <Header />
      <div className="flex transition-all">
        <div
          className={`h-screen flex flex-col ${
            collapsed ? "w-16" : "w-64"
          } transition-all`}
        >
          <div className="p-4">
            <Button type="primary" onClick={toggleCollapsed}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
          <div className="flex-grow">
            <Menu
              defaultSelectedKeys={["4"]}
              mode="inline"
              theme="dark"
              inlineCollapsed={collapsed}
              items={items}
              onClick={handleMenuClick}
              className="h-full"
            />
          </div>
        </div>
        <div className="w-full h-full">
          <div className="p-8 min-h-screen">
            <h2 className="text-3xl font-bold text-white mb-6">AI guide!</h2>
            <div className="max-w mx-auto p-10 border rounded shadow bg-white h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {chMsg.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-blue-100 text-right ml-auto"
                        : "bg-white"
                    }`}
                  >
                    <pre className="yesselect text-xl whitespace-pre-wrap font-sans">
                      {msg.text}
                    </pre>
                    {/* Hor line */}
                    {msg.sender === "bot" && index < chMsg.length && (
                      <hr className="my-2 border-gray-300" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-1 px-10">
                <input
                  type="text"
                  className="flex-1 border rounded px-5 py-2 mx-2"
                  placeholder="Type your message..."
                  value={chInput}
                  onChange={(e) => setChInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={loading}
                />
                <button
                  className={`bg-blue-500 cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center justify-center ${
                    loading ? "cursor-not-allowed opacity-100" : ""
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
    </div>
  );
};

export default App;
