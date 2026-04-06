import React, { useState, useEffect } from "react";
import { Search, Bell, Users, Shield, Megaphone } from "lucide-react";
import api from "../../../api";
import StudentDock from "../StudentDock";
import { io } from "socket.io-client";

const resolveSocketUrl = () => {
  const configuredSocket = import.meta.env.VITE_SOCKET_URL;
  if (configuredSocket && /^https?:\/\//.test(configuredSocket)) {
    return configuredSocket.replace(/\/$/, "");
  }

  const configuredApi = import.meta.env.VITE_API_URL;
  if (configuredApi && /^https?:\/\//.test(configuredApi)) {
    return configuredApi.replace(/\/api\/?$/, "");
  }

  // Use current origin so local Vite proxy handles /socket.io.
  return window.location.origin;
};

const ChatList = ({
  onSelectChannel,
  channelsEndpoint = "/student/chat/channels",
  tokenKeys = ["student_token", "token"],
  BottomNavComponent = StudentDock,
  bottomNavActive = "chat",
  transformChannels,
  currentUserId,
}) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const tokenKeysSignature = Array.isArray(tokenKeys)
    ? tokenKeys.join("|")
    : "student_token|token";

  const getActivityTs = (channel) => {
    const value =
      channel?.last_message_time || channel?.updated_at || channel?.created_at;
    const ts = value ? new Date(value).getTime() : 0;
    return Number.isFinite(ts) ? ts : 0;
  };

  const sortChannels = (list) =>
    [...(Array.isArray(list) ? list : [])].sort((a, b) => {
      const aUnread = Number(a?.unread_count || 0);
      const bUnread = Number(b?.unread_count || 0);

      const aHasUnread = aUnread > 0 ? 1 : 0;
      const bHasUnread = bUnread > 0 ? 1 : 0;
      if (aHasUnread !== bHasUnread) return bHasUnread - aHasUnread;

      if (aUnread !== bUnread) return bUnread - aUnread;

      const byTime = getActivityTs(b) - getActivityTs(a);
      if (byTime !== 0) return byTime;

      return String(a?.name || "").localeCompare(String(b?.name || ""));
    });

  const safeParseUser = (raw) => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const inferUserIdFromStorage = () => {
    const keys = Array.isArray(tokenKeys) ? tokenKeys : [];
    if (keys.includes("faculty_token")) {
      return safeParseUser(localStorage.getItem("faculty_user"))?.id || null;
    }
    if (keys.includes("student_token")) {
      return safeParseUser(localStorage.getItem("student_user"))?.id || null;
    }

    return (
      safeParseUser(localStorage.getItem("student_user"))?.id ||
      safeParseUser(localStorage.getItem("faculty_user"))?.id ||
      null
    );
  };

  const resolvedCurrentUserId = currentUserId || inferUserIdFromStorage();

  const readEndpointForChannel = (channelId) =>
    `${channelsEndpoint}/${channelId}/read`;

  const handleOpenChannel = async (channel) => {
    if (!channel?.id) {
      onSelectChannel(channel);
      return;
    }

    // Optimistically clear unread badge for immediate UI response.
    setChannels((prev) =>
      sortChannels(
        prev.map((c) =>
          Number(c.id) === Number(channel.id) ? { ...c, unread_count: 0 } : c,
        ),
      ),
    );

    try {
      await api.post(readEndpointForChannel(channel.id));
    } catch (err) {
      console.error("Failed to mark channel as read:", err);
    }

    onSelectChannel(channel);
  };

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await api.get(channelsEndpoint);
        const nextChannels = Array.isArray(response?.data) ? response.data : [];
        const transformed = transformChannels
          ? transformChannels(nextChannels)
          : nextChannels;
        setChannels(sortChannels(transformed));
      } catch (err) {
        console.error("Failed to load channels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();

    // Set up real-time updates for the list
    const token = (Array.isArray(tokenKeys) ? tokenKeys : ["student_token", "token"])
      .map((key) => localStorage.getItem(key))
      .find(Boolean);
    if (token) {
      const socket = io(resolveSocketUrl(), {
        auth: { token },
        transports: ["polling", "websocket"],
      });

      socket.on("chat:new-message", (incomingMessage) => {
        if (Number(incomingMessage?.sender_id) === Number(resolvedCurrentUserId)) {
          return;
        }

        setChannels((prev) =>
          sortChannels(
            prev.map((c) => {
              if (Number(c.id) === Number(incomingMessage.channel_id)) {
                return {
                  ...c,
                  last_message: incomingMessage.content,
                  last_message_time: incomingMessage.created_at,
                  last_sender: incomingMessage.sender_name,
                  unread_count: Number(c.unread_count || 0) + 1,
                };
              }
              return c;
            }),
          ),
        );
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [channelsEndpoint, tokenKeysSignature, transformChannels, resolvedCurrentUserId]);

  const isDepartmentGeneral = (channel) =>
    channel?.type === "general" && channel?.visibility === "department";

  const filteredChannels = channels.filter((channel) => {
    const haystack =
      `${channel.name} ${channel.last_message || ""} ${channel.last_sender || ""}`.toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  const categorized = {
    announcements: filteredChannels.filter(
      (c) => c.section_id === null || c.type === "branch" || isDepartmentGeneral(c),
    ),
    sections: filteredChannels.filter((c) => c.type === "section"),
    subjects: filteredChannels.filter((c) => c.type === "subject"),
  };

  const usedChannelIds = new Set([
    ...categorized.announcements.map((c) => Number(c.id)),
    ...categorized.sections.map((c) => Number(c.id)),
    ...categorized.subjects.map((c) => Number(c.id)),
  ]);

  const uncategorized = filteredChannels.filter(
    (c) => !usedChannelIds.has(Number(c.id)),
  );

  const getPreview = (channel) => {
    if (!channel.last_message) return "No messages yet";
    return channel.last_sender
      ? `${channel.last_sender.split(" ")[0]}: ${channel.last_message}`
      : channel.last_message;
  };

  const getChannelAccent = (channel) => {
    if (
      channel.section_id === null ||
      channel.type === "branch" ||
      channel.type === "general"
    )
      return "broadcast";
    if (channel.type === "section") return "section";
    if (channel.type === "subject") return "subject";
    return "branch";
  };

  const formatRelative = (value) => {
    if (!value) return "";
    const diff = Math.max(0, Date.now() - new Date(value).getTime());
    const minutes = Math.round(diff / 60000);
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return new Date(value).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const renderSection = (title, items) => {
    if (items.length === 0) return null;
    return (
      <div className="st-chat-sec-wrap">
        <div className="st-chat-section-label">{title}</div>
        {items.map((channel) => {
          const accent = getChannelAccent(channel);
          const hasUnread = Number(channel.unread_count || 0) > 0;

          return (
            <div
              key={channel.id}
              className="st-chat-item animate-fade"
              onClick={() => handleOpenChannel(channel)}
            >
              <div className={`st-chat-avatar ${accent}`}>
                {channel.type === "branch" ||
                channel.is_department_broadcast ||
                isDepartmentGeneral(channel) ? (
                  <Megaphone size={26} />
                ) : channel.type === "section" ? (
                  <Shield size={26} />
                ) : (
                  <Users size={26} />
                )}
              </div>

              <div className="st-chat-info">
                <h3>{channel.name}</h3>
                <div className="st-chat-preview">
                  <p>{getPreview(channel)}</p>
                </div>
              </div>

              <div className="st-chat-meta">
                <span className="st-chat-time">
                  {channel.last_message_time
                    ? formatRelative(channel.last_message_time)
                    : ""}
                </span>
                {hasUnread && (
                  <div className="st-chat-unread">{channel.unread_count}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="st-chat-shell">
      <header className="st-chat-header-v2">
        <div className="st-header-content">
          <div className="st-profile-meta">
            <h2>Messages</h2>
            <p>Connect with your campus groups</p>
          </div>
          <div className="st-header-actions">
            <button className="st-action-circle">
              <Bell size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="st-chat-search-v2">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search groups or messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <>
            {renderSection("ANNOUNCEMENTS", categorized.announcements)}
            {renderSection("SECTION GROUPS", categorized.sections)}
            {renderSection("SUBJECT GROUPS", categorized.subjects)}
            {renderSection("OTHER GROUPS", uncategorized)}

            {!loading && filteredChannels.length === 0 && (
              <div className="p-20 text-center text-slate-400 opacity-60">
                <p className="font-bold text-sm">No groups found</p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNavComponent active={bottomNavActive} />
    </div>
  );
};

export default ChatList;
