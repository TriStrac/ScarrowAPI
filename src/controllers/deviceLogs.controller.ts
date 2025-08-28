import { Request, Response } from "express";
import { DeviceLogsSchema } from "../dto";
import { IDeviceLogs } from "../interfaces";
import { DeviceLogsService } from "../services";

export class DeviceLogsController {
    static async createDeviceLog(req: Request, res: Response){
        try {
            const parsed = DeviceLogsSchema.parse(req.body);
            const result = await DeviceLogsService.createDeviceLog(parsed as IDeviceLogs);
            res.status(201).json({success: true, message: "Device log created successfully", data: result});
        } catch (err: any) {
            if (err.name === "ZodError"){
                return res.status(400).json({ success: false, error: err.errors});
            }
            if (err.message === "DEVICE_NOT_FOUND") {
                return res.status(404).json({ success: false, error: "Device not found" });
            }
            res.status(400).json({ success: false, error: "Internal server error" });
        }
    }

    static async getAllDeviceLogs(req: Request, res: Response) {
        try {
            const logs = await DeviceLogsService.getAllDeviceLogs();
            res.status(200).json({ success: true, data: logs });
        } catch (err: any) {
            res.status(400).json({ success: false, error: "Internal server error" });
        }
    }

    static async getDeviceLogsByDeviceId(req: Request, res: Response) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) return res.status(400).json({ success: false, error: "Device ID is required" });
            const logs = await DeviceLogsService.getDeviceLogsByDeviceId(deviceId);
            res.status(200).json({ success: true, data: logs });
        } catch (err: any) {
            res.status(400).json({ success: false, error: "Internal server error" });
        }
    }

    static async getDeviceLogById(req: Request, res: Response) {
        try {
            const { logId } = req.params;
            if (!logId) return res.status(400).json({ success: false, error: "Log ID is required" });
            const log = await DeviceLogsService.getDeviceLogById(logId);
            res.status(200).json({ success: true, data: log });
        } catch (err: any) {
            res.status(400).json({ success: false, error: "Internal server error" });
        }
    }

    static async deleteAllDeviceLogByDeviceId(req: Request, res: Response) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) return res.status(400).json({ success: false, error: "Device ID is required" });
            await DeviceLogsService.deleteAllDeviceLogByDeviceId(deviceId);
            res.status(204).json({ success: true, message: "Device logs deleted successfully" });
        } catch (err: any) {
            res.status(400).json({ success: false, error: "Internal server error" });
        }
    }
}