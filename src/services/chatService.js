import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  or,
  and
} from "firebase/firestore";
import { db } from "../config/firebase";

export const ChatService = {
  /**
   * Send a new message
   */
  sendMessage: async (chatId, senderId, text) => {
    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        senderId,
        text,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  /**
   * Subscribe to messages in a specific chat
   */
  subscribeToMessages: (chatId, callback) => {
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  },

  /**
   * Get or create a chat ID for two users
   */
  getOrCreateChat: async (user1, user2) => {
    // Simple implementation: alphabetical sort of IDs to ensure same ID both ways
    const chatId = [user1, user2].sort().join('_');
    return chatId;
  }
};
