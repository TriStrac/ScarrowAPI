import { z } from "zod";

export const UpdateUserInfoSchema = z.object({
  email: z.string().email().optional(),
  isUserInGroup: z.boolean().optional(),
  isUserHead: z.boolean().optional(),
  address: z.object({
    streetName: z.string(),
    baranggay: z.string(),
    town: z.string(),
    province: z.string(),
    zipCode: z.string(),
  }).optional(),
  profile: z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    birthDate: z.string(),
    phoneNumber: z.string(),
  }).optional(),
});

// Export the inferred TS type
export type UpdateUserInfoDTO = z.infer<typeof UpdateUserInfoSchema>;
