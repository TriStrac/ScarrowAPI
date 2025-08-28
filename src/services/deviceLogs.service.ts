import {db} from "../utils";
import { DeviceLogsDTO } from "../dto";
import { IDeviceLogs } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

export class DeviceLogsService {
    static async createDeviceLog(data: DeviceLogsDTO) {
        // Check if DeviceID exists
        try {
            await import("./device.service").then(mod => mod.DeviceService.getDeviceById(data.DeviceID));
        } catch (err: any) {
            throw new Error("DEVICE_NOT_FOUND");
        }

        const deviceLogId = uuidv4();
        const deviceLogRef = db.collection("deviceLogs").doc(deviceLogId);

        await deviceLogRef.set({
            DeviceLogsID: deviceLogId,
            ...data
        });

        return { deviceLogId };
    }

    static async getAllDeviceLogs() {
        const snapshot = await db.collection("deviceLogs").get();
        return snapshot.docs.map(doc => ({...doc.data() }));
    }

    static async getDeviceLogsByDeviceId(deviceId: string) {
        const snapshot = await db.collection("deviceLogs").where("DeviceID", "==", deviceId).get();
        return snapshot.docs.map(doc => ({ ...doc.data() }));
    }

    static async getDeviceLogById(deviceLogId: string) {
        const deviceLogRef = db.collection("deviceLogs").doc(deviceLogId);
        const doc = await deviceLogRef.get();
        if (!doc.exists) {
            throw new Error("Device log not found");
        }
        return { ...doc.data() };
    }

    static async deleteAllDeviceLogByDeviceId(deviceId: string) {
        const snapshot = await db.collection("deviceLogs").where("DeviceID", "==", deviceId).get();
        const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
    }
}