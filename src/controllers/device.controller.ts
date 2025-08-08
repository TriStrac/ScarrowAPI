import { Request, Response } from "express";
import { CreateDeviceSchema } from "../dto";
import { IDevice, IDeviceOwner, IDeviceStatus } from "../interfaces"
import { DeviceService } from "../services";

export class DeviceController {
    
    static async createDevice(req: Request, res: Response) {
        try {
            const parsed = CreateDeviceSchema.parse(req.body);
            const result = await DeviceService.createDevice(parsed);
            res.status(201).json({ success: true, message: "Device created", deviceId: result.deviceId });
        } catch (err: any) {
            if (err.name === "ZodError") {
                return res.status(400).json({ success: false, error: err.errors });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async getAllDevices(req: Request, res: Response) {
        try {
            const devices = await DeviceService.getAllDevices();
            res.status(200).json({ success: true, devices });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async getDeviceById(req: Request, res: Response) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) return res.status(400).json({ success: false, error: "Device ID is required" });
            const device = await DeviceService.getDeviceById(deviceId);
            res.status(200).json({ success: true, device });
        } catch (err: any) {
            if (err.message === "DEVICE_NOT_FOUND") {
                return res.status(404).json({ success: false, error: err.message });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async updateDeviceInfo(req: Request, res: Response) {
        try {
            const { deviceId } = req.params;
            const { DeviceName, DeviceLocation } = req.body;
            if (!deviceId) return res.status(400).json({ success: false, error: "Device ID is required" });
            if (!DeviceName && !DeviceLocation) return res.status(400).json({ success: false, error: "At least one of newName or location is required" });
            const result = await DeviceService.updateDeviceInfo(deviceId, DeviceName, DeviceLocation);
            res.status(200).json({ success: true, message: "Device info updated", deviceId: result.deviceId });
        } catch (err: any) {
            if (err.name === "ZodError") {
                return res.status(400).json({ success: false, error: err.errors });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async createDeviceStatus(req: Request, res: Response) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) return res.status(400).json({ success: false, error: "Device ID is required" });
            const parsed: IDeviceStatus = req.body;
            const result = await DeviceService.createDeviceStatus(parsed);
            res.status(201).json({ success: true, message: "Device status created", deviceId: result.deviceId });
        } catch (err: any) {
            if (err.name === "ZodError") {
                return res.status(400).json({ success: false, error: err.errors });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async getDeviceStatus(req: Request, res: Response) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) return res.status(400).json({ success: false, error: "Device ID is required" });
            const status = await DeviceService.getDeviceStatus(deviceId);
            res.status(200).json({ success: true, status });
        } catch (err: any) {
            if (err.message === "DEVICE_STATUS_NOT_FOUND") {
                return res.status(404).json({ success: false, error: err.message });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async getDeviceStatusByOwnerUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            if (!userId) return res.status(400).json({ success: false, error: "User ID is required" });
            const statuses = await DeviceService.getDeviceStatusByOwnerUserId(userId);
            res.status(200).json({ success: true, statuses });
        } catch (err: any) {
            if (err.message === "NO_DEVICE_OWNERS_FOUND") {
                return res.status(404).json({ success: false, error: err.message });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async getDeviceStatusByOwnerGroupId(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            if (!groupId) return res.status(400).json({ success: false, error: "Group ID is required" });
            const statuses = await DeviceService.getDeviceStatusByOwnerGroupId(groupId);
            res.status(200).json({ success: true, statuses });
        } catch (err: any) {
            if (err.message === "NO_DEVICE_OWNERS_FOUND") {
                return res.status(404).json({ success: false, error: err.message });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async updateDeviceStatus(req: Request, res: Response) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) return res.status(400).json({ success: false, error: "Device ID is required" });
            const statusData: IDeviceStatus = req.body;
            const result = await DeviceService.updateDeviceStatus(deviceId,statusData);
            res.status(200).json({ success: true, message: "Device status updated", deviceId: result.deviceId });
        } catch (err: any) {
            if (err.name === "ZodError") {
                return res.status(400).json({ success: false, error: err.errors });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async createDeviceOwner(req: Request, res: Response) {
        try {
            const parsed: IDeviceOwner = req.body;
            const result = await DeviceService.createDeviceOwner(parsed);
            res.status(201).json({ success: true, message: "Device owner created", deviceId: result.deviceId });
        } catch (err: any) {
            if (err.name === "ZodError") {
                return res.status(400).json({ success: false, error: err.errors });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async updateDeviceOwner(req: Request, res: Response) {
        try {
            const parsed: IDeviceOwner = req.body;
            const result = await DeviceService.updateDeviceOwner(parsed);
            res.status(200).json({ success: true, message: "Device owner updated", deviceId: result.deviceId });
        } catch (err: any) {
            if (err.name === "ZodError") {
                return res.status(400).json({ success: false, error: err.errors });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async getDeviceOwners(req: Request, res: Response) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) return res.status(400).json({ success: false, error: "Device ID is required" });
            const owner = await DeviceService.getDeviceOwners(deviceId);
            res.status(200).json({ success: true, owner });
        } catch (err: any) {
            if (err.message === "DEVICE_OWNER_NOT_FOUND") {
                return res.status(404).json({ success: false, error: err.message });
            }
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async getDevicesByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            if (!userId) return res.status(400).json({ success: false, error: "User ID is required" });
            const devices = await DeviceService.getDevicesByUserId(userId);
            res.status(200).json({ success: true, devices });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async getDevicesByGroupId(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            if (!groupId) return res.status(400).json({ success: false, error: "Group ID is required" });
            const devices = await DeviceService.getDevicesByGroupId(groupId);
            res.status(200).json({ success: true, devices });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static async softDeleteDevice(req: Request, res: Response) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) return res.status(400).json({ success: false, error: "Device ID is required" });
            const result = await DeviceService.softDeleteDevice(deviceId);
            res.status(200).json({ success: true, message: "Device soft deleted", deviceId: result.deviceId });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

}