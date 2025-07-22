import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  isUserInGroup: z.boolean(),
  isUserHead: z.boolean(),
  isDeleted: z.boolean().default(false),
  address: z.object({
    streetName: z.string(),
    baranggay: z.string(),
    town: z.string(),
    province: z.string(),
    zipCode: z.string(),
  }),
  profile: z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    birthDate: z.string(), // or z.date() if already parsed
    phoneNumber: z.string(),
  }),
});

// Export the inferred TS type
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;