import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const UserService = {
  /**
   * Create user profile in Firestore
   */
  createUserProfile: async (user, extraData) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: extraData.name,
        phone: extraData.phone || null,
        profileImage: extraData.profileImage || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  /**
   * Fetch user profile from Firestore
   */
  getUserProfile: async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Update existing user profile
   */
  updateUserProfile: async (uid, data) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
};
