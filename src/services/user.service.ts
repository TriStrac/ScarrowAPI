import { db } from "../utils";
import { CreateUserDTO } from "../dto";
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

  // Get user by email (exclude soft-deleted)
  static async getUserByEmail(email: string) {
    const snapshot = await db.collection("users").where("email", "==", email).where("isDeleted", "==", false).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { userId: doc.id, ...doc.data() };
  }

  // Update user by ID
  static async updateUserByID(userId: string, updateData: Partial<Omit<CreateUserDTO, 'address' | 'profile'>>) {
    const userRef = db.collection("users").doc(userId);
    await userRef.update(updateData);
    const updatedDoc = await userRef.get();
    return { userId: updatedDoc.id, ...updatedDoc.data() };
  }

  // Login user (email and password, exclude soft-deleted)
  static async loginUser(email: string, password: string) {
    const snapshot = await db.collection("users").where("email", "==", email).where("isDeleted", "==", false).get();
    if (snapshot.empty) return null;
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) return null;
    return { userId: userDoc.id, ...userData };
  }

  // Change password by email (exclude soft-deleted)
  static async changePassword(email: string, newPassword: string) {
    const snapshot = await db.collection("users").where("email", "==", email).where("isDeleted", "==", false).get();
    if (snapshot.empty) return null;
    const userDoc = snapshot.docs[0];
    const userRef = db.collection("users").doc(userDoc.id);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRef.update({ password: hashedPassword });
    return { userId: userDoc.id };
  }

  // Soft delete user by ID
  static async softDeleteUserByID(userId: string) {
    const userRef = db.collection("users").doc(userId);
    // Get the user data before updating
    const userDoc = await userRef.get();
    if (!userDoc.exists) return { userId };
    const userData = userDoc.data();
    // Prepare deleted user data
    const deletedUserData = { ...userData, isDeleted: true, deletedAt: new Date().toISOString() };
    // Move to deletedUsers collection
    const deletedUserRef = db.collection("deletedUsers").doc(userId);
    await deletedUserRef.set(deletedUserData);
    // Delete from users collection
    await userRef.delete();
    return { userId };
  }

  // Get all deleted users
  static async getAllDeletedUsers() {
    const snapshot = await db.collection("deletedUsers").get();
    return snapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }));
  }
}