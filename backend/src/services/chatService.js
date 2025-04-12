const redis = require("../config/redis");
const Message = require("../models/Message");

const getCachedMessages = async (proposalId) => {
  const cachedMessages = await redis.get(`messages:${proposalId}`);
  return cachedMessages ? JSON.parse(cachedMessages) : null;
};

const saveMessagesToCache = async (proposalId, messages) => {
  await redis.set(`messages:${proposalId}`, JSON.stringify(messages), "EX", 3600); 
};

const getMessages = async (proposalId) => {
  const cachedMessages = await getCachedMessages(proposalId);
  if (cachedMessages) return cachedMessages;

  const messages = await Message.find({ proposal: proposalId });
  await saveMessagesToCache(proposalId, messages);
  return messages;
};

module.exports = { getMessages };
