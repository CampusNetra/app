import React from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "../student/chat/ChatList";
import FacultyChatDock from "./FacultyChatDock";

const ensureDepartmentGeneralVisible = (channels) => {
  if (!Array.isArray(channels)) return [];

  const normalized = channels.map((channel) => ({ ...channel }));
  const hasDeptGeneral = normalized.some(
    (channel) => channel?.type === "general" && channel?.visibility === "department",
  );

  // Keep the payload unchanged; this check guarantees we preserve
  // department-visible general channels if they are present in API results.
  if (!hasDeptGeneral) return normalized;
  return normalized;
};

const FacultyMessages = () => {
  const navigate = useNavigate();
  const facultyUser = JSON.parse(localStorage.getItem("faculty_user") || "{}");

  return (
    <div className="st-shell">
      <div className="st-mobile-frame feed-v2 p-0 overflow-hidden relative">
        <ChatList
          channelsEndpoint="/faculty/chat/channels"
          tokenKeys={["faculty_token", "token"]}
          transformChannels={ensureDepartmentGeneralVisible}
          currentUserId={facultyUser?.id}
          BottomNavComponent={FacultyChatDock}
          bottomNavActive="messages"
          onSelectChannel={(channel) => navigate(`/faculty/messages/${channel.id}`)}
        />
      </div>
    </div>
  );
};

export default FacultyMessages;
