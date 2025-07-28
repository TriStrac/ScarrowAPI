import { z } from "zod";

export const CreateGroupSchema = z.object({
  GroupOwnerID: z.string(),
  GroupName: z.string().min(1, { message: "Group name cannot be empty." }),
  GroupDescription: z.string().min(1, { message: "Group description cannot be empty." }),
  isDeleted: z.boolean().default(false),
  DateCreated: z.date().optional(),
  DateUpdated: z.date().optional(),
});

export type CreateGroupDTO = z.infer<typeof CreateGroupSchema>;

export const UpdateGroupSchema = CreateGroupSchema.omit({ GroupOwnerID: true }).partial();

export type UpdateGroupDTO = z.infer<typeof UpdateGroupSchema>;


export const GroupMemberSchema = z.object({
  GroupID: z.string(),
  UserID: z.string(),
  DateJoined: z.date(),
  DateLeft: z.date().optional(),
});

export type GroupMemberDTO = z.infer<typeof GroupMemberSchema>;