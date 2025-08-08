import { Request, Response } from "express";
import { CreateGroupSchema, UpdateGroupSchema } from "../dto/group.dto";
import { GroupService } from "../services";

export class GroupController {
    static async createGroup(req: Request, res: Response) {
        try {
            const parsed = CreateGroupSchema.parse(req.body);
            const result = await GroupService.createGroup(parsed);
            res.status(201).json({ message: "Group created", groupId: result.groupId });
        } catch (err: any) {
            if (err.name === "ZodError") {
                return res.status(400).json({ error: err.errors });
            }
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async updateGroup(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            if (!groupId) return res.status(400).json({ error: "Group ID is required" });
            const parsed = UpdateGroupSchema.parse(req.body);
            const result = await GroupService.updateGroup(groupId, parsed);
            res.status(200).json({ message: "Group updated", groupId: result.groupId });
        } catch (err: any) {
            if (err.name === "ZodError") {
                return res.status(400).json({ error: err.errors });
            }
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getAllGroups(req: Request, res: Response) {
        try {
            const groups = await GroupService.getAllGroups();
            res.status(200).json(groups);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getGroupsByOwner(req: Request, res: Response) {
        try {
            const { ownerId } = req.query;
            if (!ownerId || typeof ownerId !== "string") {
                return res.status(400).json({ error: "Owner ID is required" });
            }
            const groups = await GroupService.getGroupsByOwner(ownerId);
            res.status(200).json(groups);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }   

    static async getGroupInfoByName(req: Request, res: Response) {
        try {
            const { groupName } = req.query;
            if (!groupName || typeof groupName !== "string") {
                return res.status(400).json({ error: "Group name is required" });
            }
            const groupInfo = await GroupService.getGroupInfoByName(groupName);
            if (!groupInfo) return res.status(404).json({ error: "Group not found" });
            res.status(200).json(groupInfo);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }   

    static async getGroupInfoById(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            if (!groupId) return res.status(400).json({ error: "Group ID is required" });
            const groupInfo = await GroupService.getGroupInfoById(groupId);
            if (!groupInfo) return res.status(404).json({ error: "Group not found" });
            res.status(200).json(groupInfo);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }   

    static async softDeleteGroup(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            if (!groupId) return res.status(400).json({ error: "Group ID is required" });
            await GroupService.softDeleteGroup(groupId);
            res.status(200).json({ message: "Group soft-deleted" });
        } catch (err: any) {
            if (err.message === "GROUP_NOT_FOUND") {
                return res.status(404).json({ error: "Group not found" });
            }
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    }   

    static async addGroupMember(req: Request, res: Response) {
        try {
            const { groupId, userEmail } = req.body;
            if (!groupId || !userEmail) {
                return res.status(400).json({ error: "Group ID and User Email are required" });
            }
            const result = await GroupService.addGroupMember(groupId, userEmail);
            res.status(200).json({ message: "Member added to group", result });
        } catch (err: any) {
            if (err.message === "GROUP_NOT_FOUND") {
                return res.status(404).json({ error: "Group not found" });
            }
            if (err.message === "USER_NOT_FOUND") {
                return res.status(404).json({ error: "User not found" });
            }
            if (err.message === "USER_ALREADY_IN_GROUP") {
                return res.status(400).json({ error: "User already in group" });
            }
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async removeGroupMember(req: Request, res: Response) {
        try {
            const { groupId, userId } = req.body;
            if (!groupId || !userId) {
                return res.status(400).json({ error: "Group ID and User ID are required" });
            }
            const result = await GroupService.removeGroupMember(groupId, userId);
            res.status(200).json({ message: "Member removed from group", result });
        } catch (err: any) {
            if (err.message === "GROUP_NOT_FOUND") {
                return res.status(404).json({ error: "Group not found" });
            }
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getGroupMembers(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            if (!groupId) return res.status(400).json({ error: "Group ID is required" });
            const members = await GroupService.getGroupMembers(groupId);
            res.status(200).json(members);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

}
    