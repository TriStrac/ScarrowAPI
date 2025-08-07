import { z } from "zod";

export const CreateDeviceSchema = z.object({
  DeviceID: z.string(),
  DeviceName: z.string(),
  DeviceType: z.string(),
  DeviceLocation: z.string(),
});

export type CreateDeviceDTO = z.infer<typeof CreateDeviceSchema>;