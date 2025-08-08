import { z } from "zod";

export const CreateDeviceSchema = z.object({
  DeviceName: z.string(),
  DeviceType: z.string(),
  DeviceLocation: z.string(),
  isDeleted: z.boolean().default(false),
});

export type CreateDeviceDTO = z.infer<typeof CreateDeviceSchema>;