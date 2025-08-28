import { z } from "zod";

export const DeviceLogsSchema = z.object({
	DeviceLogsID: z.string().optional(),
	DeviceID: z.string(),
	Timestamp: z.coerce.date(),
	ActiveDuration: z.number().optional(),
	PestType: z.string(),
	FendType: z.string(),
});

export type DeviceLogsDTO = z.infer<typeof DeviceLogsSchema>;
