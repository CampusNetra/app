import React from "react";
import GlobalChatWindow from "../../common/chat/GlobalChatWindow";

const ChatWindow = ({ channel, user, onBack }) => {
  return (
    <GlobalChatWindow
      initialChannel={channel}
      initialUser={user}
      onBack={onBack}
      apiBasePath="/student/chat"
      tokenKeys={["student_token", "token"]}
      canPostTopLevel={(activeChannel) => !!activeChannel?.can_student_post_top_level}
      canReplyInThreads={(activeChannel) => activeChannel?.can_student_reply_in_threads !== false}
      enableOwnMessageActions
    />
  );
};

export default ChatWindow;
