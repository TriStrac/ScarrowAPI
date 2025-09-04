import { db } from "../utils";
import { CreateUserDTO, UpdateUserInfoDTO } from "../dto";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export class UserService {
  static async createUser(data: CreateUserDTO) {
    // Check for existing email (not soft-deleted)
    const existingUserSnapshot = await db.collection("users").where("email", "==", data.email).where("isDeleted", "==", false).get();
    if (!existingUserSnapshot.empty) {
      // Indicate duplicate email
      throw new Error("DUPLICATE_EMAIL");
    }
    const userId = uuidv4();
    const addressId = uuidv4();
    const profileId = uuidv4();

    const addressRef = db.collection("addresses").doc(addressId);
    const profileRef = db.collection("profiles").doc(profileId);
    const userRef = db.collection("users").doc(userId);

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Batch write to keep consistency
    const batch = db.batch();

    batch.set(addressRef, {
      ...data.address,
    });

    batch.set(profileRef, {
      ...data.profile,
    });

    batch.set(userRef, {
      email: data.email,
      password: hashedPassword,
      isUserInGroup: data.isUserInGroup,
      isUserHead: data.isUserHead,
      addressId,
      profileId,
      isDeleted: false,
    });

    await batch.commit();

    return { userId, profileId, addressId };
  }

  // Get all users (exclude soft-deleted)
  static async getAllUsers() {
    const snapshot = await db.collection("users").where("isDeleted", "==", false).get();
    return snapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }));
  }

  // Get user by ID (exclude soft-deleted) with address and profile
  static async getUserById(userId: string) {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) return null;
    const userData = userDoc.data();
    if (!userData || userData.isDeleted) return null;
    
    // Fetch address data
    const addressDoc = await db.collection("addresses").doc(userData.addressId).get();
    const addressData = addressDoc.exists ? addressDoc.data() : null;
    
    // Fetch profile data
    const profileDoc = await db.collection("profiles").doc(userData.profileId).get();
    const profileData = profileDoc.exists ? profileDoc.data() : null;
    
    return {
      userId: userDoc.id,
      ...userData,
      address: addressData,
      profile: profileData
    };
  }

  // Update user by ID
  static async updateUserByID(userId: string, updateData: Partial<UpdateUserInfoDTO>) {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) return null;
    const userData = userDoc.data();
    if (!userData || userData.isDeleted) return null;

    const batch = db.batch();
    
    // Update user base info
    const userUpdate: any = {};
    if (updateData.email) userUpdate.email = updateData.email;
    if (typeof updateData.isUserInGroup !== 'undefined') userUpdate.isUserInGroup = updateData.isUserInGroup;
    if (typeof updateData.isUserHead !== 'undefined') userUpdate.isUserHead = updateData.isUserHead;
    
    if (Object.keys(userUpdate).length > 0) {
      batch.update(userRef, userUpdate);
    }

    // Update address if provided
    if (updateData.address) {
      const addressRef = db.collection("addresses").doc(userData.addressId);
      batch.update(addressRef, updateData.address);
    }

    // Update profile if provided
    if (updateData.profile) {
      const profileRef = db.collection("profiles").doc(userData.profileId);
      batch.update(profileRef, updateData.profile);
    }

    await batch.commit();

    // Fetch updated user data with address and profile
    const updatedUserDoc = await userRef.get();
    const updatedUserData = updatedUserDoc.data();
    
    // Fetch updated address data
    const addressDoc = await db.collection("addresses").doc(userData.addressId).get();
    const addressData = addressDoc.exists ? addressDoc.data() : null;
    
    // Fetch updated profile data
    const profileDoc = await db.collection("profiles").doc(userData.profileId).get();
    const profileData = profileDoc.exists ? profileDoc.data() : null;

    return {
      userId: updatedUserDoc.id,
      ...updatedUserData,
      address: addressData,
      profile: profileData
    };
  }

  // Login user (email and password, exclude soft-deleted)
  static async loginUser(email: string, password: string) {
    const snapshot = await db.collection("users").where("email", "==", email).where("isDeleted", "==", false).get();
    if (snapshot.empty) return null;
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) return null;
    return { userId: userDoc.id, email: userData.email, ...userData };
  }

  // Change password by email (exclude soft-deleted)
  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return null;
    const userData = userDoc.data();
    if (!userData || userData.isDeleted) return null;
    const isMatch = await bcrypt.compare(oldPassword, userData.password);
    if (!isMatch) return false;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRef.update({ password: hashedPassword });
    return { userId };
}

  // Soft delete user by ID
  static async softDeleteUserByID(userId: string) {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return { userId };
    await userRef.update({
      isDeleted: true,
      deletedAt: new Date().toISOString()
    });
    return { userId };
  }

  // Get all deleted users
  static async getAllDeletedUsers() {
    const snapshot = await db.collection("users").where("isDeleted", "==", true).get();
    return snapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }));
  }

  // Check if email exists (exclude soft-deleted)
  static async doesEmailExist(email: string): Promise<boolean> {
    const snapshot = await db.collection("users")
      .where("email", "==", email)
      .where("isDeleted", "in", [false, null])
      .get();
    return !snapshot.empty;
  }
}