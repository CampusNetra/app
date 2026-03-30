const chatService = require('../../services/chat.service');

const getChannels = async (req, res) => {
  try {
    const { id: user_id, dept_id, section_id } = req.user;
    const channels = await chatService.getStudentChannels(user_id, dept_id, section_id);
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChannelMessages = async (req, res) => {
  try {
    const { id: channel_id } = req.params;
    const { limit = 50 } = req.query;
    const messages = await chatService.getChannelMessages(channel_id, limit);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChannelDetails = async (req, res) => {
  try {
    const { id: channel_id } = req.params;
    const details = await chatService.getChannelDetails(channel_id);
    if (!details) return res.status(404).json({ error: 'Channel not found' });
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessageReplies = async (req, res) => {
  try {
    const { id: message_id } = req.params;
    const { limit = 100 } = req.query;
    const replies = await chatService.getMessageReplies(message_id, limit);
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id: channel_id } = req.params;
    const { id: sender_id, role } = req.user;
    const { content, type = 'text', parent_id = null } = req.body;

    const trimmedContent = `${content || ''}`.trim();
    if (!trimmedContent) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const channelPolicy = await chatService.getChannelPostingPolicy(channel_id);
    if (!channelPolicy) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    if (parent_id) {
      const parentMessage = await chatService.getMessageById(parent_id);
      if (!parentMessage || Number(parentMessage.channel_id) !== Number(channel_id) || parentMessage.parent_id) {
        return res.status(400).json({ error: 'Invalid thread parent' });
      }
    }

    if (
      role === 'student' &&
      !parent_id &&
      channelPolicy.student_posting_mode === 'thread_only'
    ) {
      return res.status(403).json({
        error: 'Students can only reply in threads in this group'
      });
    }

    const message = await chatService.sendMessage({
      channel_id,
      sender_id,
      content: trimmedContent,
      type,
      parent_id
    });

    const io = req.app.get('io');
    if (io && message) {
       io.to(`chat:channel:${Number(channel_id)}`).emit('chat:new-message', message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const { id: message_id } = req.params;
    const { id: sender_id } = req.user;
    const { content } = req.body;

    const trimmed = `${content || ''}`.trim();
    if (!trimmed) return res.status(400).json({ error: 'Content required' });

    const success = await chatService.editMessage(message_id, sender_id, trimmed);
    if (!success) return res.status(403).json({ error: 'Unauthorized or message not found' });

    const message = await chatService.getMessageById(message_id);
    const io = req.app.get('io');
    if (io && message) {
       io.to(`chat:channel:${Number(message.channel_id)}`).emit('chat:message-edited', message);
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id: message_id } = req.params;
    const { id: sender_id } = req.user;

    const message = await chatService.getMessageById(message_id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    const success = await chatService.deleteMessage(message_id, sender_id);
    if (!success) return res.status(403).json({ error: 'Unauthorized' });

    const io = req.app.get('io');
    if (io) {
       io.to(`chat:channel:${Number(message.channel_id)}`).emit('chat:message-deleted', { id: message_id, channel_id: message.channel_id });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChannels,
  getChannelMessages,
  getChannelDetails,
  getMessageReplies,
  sendMessage,
  editMessage,
  deleteMessage
};
