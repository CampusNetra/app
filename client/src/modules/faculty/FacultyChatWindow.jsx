import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import GlobalChatWindow from "../common/chat/GlobalChatWindow";

const FacultyChatWindow = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const loadFacultyUser = useCallback(async () => {
    const response = await api.get("/faculty/dashboard");
    return response?.data?.profile || null;
  }, []);

  return (
    <div className="st-shell">
      <div className="st-mobile-frame feed-v2 p-0 overflow-hidden relative">
        <GlobalChatWindow
          channelId={channelId}
          onBack={() => navigate("/faculty/messages")}
          apiBasePath="/faculty/chat"
          tokenKeys={["faculty_token", "token"]}
          loadUser={loadFacultyUser}
          canPostTopLevel={(activeChannel) => !!activeChannel?.can_student_post_top_level}
          canReplyInThreads={(activeChannel) => activeChannel?.can_student_reply_in_threads !== false}
          enableOwnMessageActions
        />
      </div>
    </div>
  );
};

export default FacultyChatWindow;
