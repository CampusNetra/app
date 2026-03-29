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
    const { id: sender_id } = req.user;
    const { content, type = 'text', parent_id = null } = req.body;

    const message = await chatService.sendMessage({
      channel_id,
      sender_id,
      content,
      type,
      parent_id
    });

    const io = req.app.get('io');
    if (io && message) {
      if (parent_id) {
         io.to(`chat:channel:${Number(channel_id)}`).emit('chat:new-reply', message);
      } else {
         io.to(`chat:channel:${Number(channel_id)}`).emit('chat:new-message', message);
      }
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChannels,
  getChannelMessages,
  getChannelDetails,
  getMessageReplies,
  sendMessage
};
