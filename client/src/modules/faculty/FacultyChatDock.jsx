import React from "react";
import { Home, BookOpen, MessageSquare, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FacultyChatDock = ({ active = "messages" }) => {
  const navigate = useNavigate();

  const items = [
    { key: "home", label: "HOME", icon: Home, path: "/faculty/dashboard" },
    { key: "subjects", label: "SUBJECTS", icon: BookOpen, path: "/faculty/subjects" },
    { key: "messages", label: "MESSAGES", icon: MessageSquare, path: "/faculty/messages" },
    { key: "profile", label: "PROFILE", icon: UserCircle2, path: "/faculty/profile" },
  ];

  return (
    <nav className="st-bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;

        return (
          <button
            key={item.key}
            type="button"
            className={`st-nav-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <Icon size={22} style={{ margin: "0 auto 4px" }} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};

export default FacultyChatDock;
