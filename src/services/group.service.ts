import  {db} from "../utils";
import { CreateGroupDTO, UpdateGroupDTO } from "../dto";
import { v4 as uuidv4 } from "uuid";

export class GroupService {
    static async createGroup(data: CreateGroupDTO) {

        const existingGroupSnapshot = await db.collection("groups").where("GroupName", "==", data.GroupName).get();
        if (!existingGroupSnapshot.empty) {
            throw new Error("GROUP_NAME_ALREADY_EXISTS");
        }

        const groupId = uuidv4();
        const groupRef = db.collection("groups").doc(groupId);

        await groupRef.set({
            ...data,
            GroupID: groupId,
            DateCreated: new Date(),
            DateUpdated: new Date(),
        });

        // Update the group owner's isUserHead to true
        if (data.GroupOwnerID) {
            const userRef = db.collection("users").doc(data.GroupOwnerID);
            await userRef.update({ isUserHead: true });
        }

        return { groupId };
    }

    static async updateGroup(groupId: string, data: UpdateGroupDTO) {
        const groupRef = db.collection("groups").doc(groupId);
        const groupSnapshot = await groupRef.get();

        if (!groupSnapshot.exists) {
        throw new Error("GROUP_NOT_FOUND");
        }

        await groupRef.update({
        ...data,
        DateUpdated: new Date(),
        });

        return { groupId };
    }

    static async getAllGroups() {
        const snapshot = await db.collection("groups").get();
        return snapshot.docs.map(doc => ({ groupId: doc.id, ...doc.data() }));
    }

    static async getGroupsByOwner(ownerId: string) {
        const snapshot = await db.collection("groups").where("GroupOwnerID", "==", ownerId).get();
        return snapshot.docs.map(doc => ({ groupId: doc.id, ...doc.data() }));
    }

    static async getGroupInfoByName(groupName: string) {
        const snapshot = await db.collection("groups").where("GroupName", "==", groupName).get();

        if (snapshot.empty) {
        return null;
        }

        return snapshot.docs.map(doc => ({ groupId: doc.id, ...doc.data() }))[0];
    }

    static async getGroupInfoById(groupId: string) {
        const groupRef = db.collection("groups").doc(groupId);
        const groupSnapshot = await groupRef.get();

        if (!groupSnapshot.exists) {
        return null;
        }

        return { groupId: groupSnapshot.id, ...groupSnapshot.data() };
    }

    static async softDeleteGroup(groupId: string) {
        const groupRef = db.collection("groups").doc(groupId);
        const groupSnapshot = await groupRef.get();

        if (!groupSnapshot.exists) {
            throw new Error("GROUP_NOT_FOUND");
        }

        await groupRef.update({
            isDeleted: true,
            DateUpdated: new Date().toISOString()
        });

        return { groupId, message: "Group soft deleted successfully." };
    }

    static async addGroupMember(groupId: string, userEmail: string) {
        const groupRef = db.collection("groups").doc(groupId);
        const groupSnapshot = await groupRef.get();

        if (!groupSnapshot.exists) {
            throw new Error("GROUP_NOT_FOUND");
        }

        // Find user by email
        const userSnapshot = await db.collection("users").where("email", "==", userEmail).get();
        if (userSnapshot.empty) {
            throw new Error("USER_NOT_FOUND");
        }
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;
        const userRef = db.collection("users").doc(userId);

        const existingMemberSnapshot = await db.collection("groupMembers")
            .where("GroupID", "==", groupId)
            .where("UserID", "==", userId)
            .get();

        if (!existingMemberSnapshot.empty) {
            throw new Error("USER_ALREADY_IN_GROUP");
        }

        const groupMemberData = {
            GroupID: groupId,
            UserID: userId,
            DateJoined: new Date(),
        };

        await db.collection("groupMembers").add(groupMemberData);

        // Update the user's isUserInGroup to true
        await userRef.update({ isUserInGroup: true });

        return { groupId, userId, message: "User added to group successfully." };
    }

    static async removeGroupMember(groupId: string, userId: string) {
        const groupMemberSnapshot = await db.collection("groupMembers")
        .where("GroupID", "==", groupId)
        .where("UserID", "==", userId)
        .get();

        if (groupMemberSnapshot.empty) {
        throw new Error("MEMBER_NOT_FOUND_IN_GROUP");
        }

        const memberDoc = groupMemberSnapshot.docs[0];
        await memberDoc.ref.delete();

        return { groupId, userId, message: "User removed from group successfully." };
    }

    static async getGroupMembers(groupId: string) {
        const groupMemberSnapshot = await db.collection("groupMembers")
        .where("GroupID", "==", groupId)
        .get();

        if (groupMemberSnapshot.empty) {
        return [];
        }

        const members = await Promise.all(groupMemberSnapshot.docs.map(async (doc) => {
            const memberData = doc.data();
            const userRef = db.collection("users").doc(memberData.UserID);
            const userSnapshot = await userRef.get();
            if (!userSnapshot.exists) return null;
            const userData = userSnapshot.data();
            let userName = undefined;
            if (userData?.profileId) {
                const profileRef = db.collection("profiles").doc(userData.profileId);
                const profileSnapshot = await profileRef.get();
                if (profileSnapshot.exists) {
                    const profileData = profileSnapshot.data();
                    userName = `${profileData?.firstName ?? ""} ${profileData?.lastName ?? ""}`.trim();
                }
            }
            return { ...memberData, UserName: userName };
        }));

        return members.filter(member => member !== null);
    }
}