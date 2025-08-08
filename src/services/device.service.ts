import  {db} from "../utils";
import { CreateDeviceDTO } from "../dto";
import { IDeviceStatus, IDeviceOwner } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

export class DeviceService {
    static async createDevice(data: CreateDeviceDTO) {
        const existingDeviceSnapshot = await db.collection("devices").where("DeviceName", "==", data.DeviceName).get();
        if (!existingDeviceSnapshot.empty) {
            throw new Error("DEVICE_NAME_ALREADY_EXISTS");
        }

        const deviceId = uuidv4();
        const deviceRef = db.collection("devices").doc(deviceId);

        await deviceRef.set({
            ...data,
            DeviceID: deviceId,
            DateCreated: new Date(),
        });

        const defaultStatus: IDeviceStatus = {
            DeviceID: deviceId,
            BatteryState: "In Use",
            BatteryLevel: 0,
            LastUpdate: new Date(),
            IsOnline: false,
        };
        await db.collection("deviceStatuses").doc(deviceId).set(defaultStatus);

        return { deviceId };
    }

    static async getAllDevices() {
        const snapshot = await db.collection("devices").get();
        return snapshot.docs.map(doc => ({ deviceId: doc.id, ...doc.data() }));
    }

    static async getDeviceById(deviceId: string) {
        const deviceRef = db.collection("devices").doc(deviceId);
        const deviceSnapshot = await deviceRef.get();

        if (!deviceSnapshot.exists) {
            throw new Error("DEVICE_NOT_FOUND");
        }

        return { deviceId: deviceSnapshot.id, ...deviceSnapshot.data() };
    }

    static async updateDeviceInfo(deviceId: string, DeviceName: string, DeviceLocation: string) {
        // Check for duplicate device name if newName is provided
        if (DeviceName) {
            const existingDeviceSnapshot = await db.collection("devices").where("DeviceName", "==", DeviceName).get();
            if (!existingDeviceSnapshot.empty) {
                throw new Error("DEVICE_NAME_ALREADY_EXISTS");
            }
        }

        const deviceRef = db.collection("devices").doc(deviceId);
        const deviceSnapshot = await deviceRef.get();

        if (!deviceSnapshot.exists) {
            throw new Error("DEVICE_NOT_FOUND");
        }

        const updateData: any = { DateUpdated: new Date() };
        if (DeviceName) updateData.DeviceName = DeviceName;
        if (DeviceLocation) updateData.DeviceLocation = DeviceLocation;

        await deviceRef.update(updateData);

        return { deviceId };
    }

    static async createDeviceStatus(data: IDeviceStatus) {
        const deviceRef = db.collection("devices").doc(data.DeviceID);
        const deviceSnapshot = await deviceRef.get();

        if (!deviceSnapshot.exists) {
            throw new Error("DEVICE_NOT_FOUND");
        }

        const deviceStatusRef = db.collection("deviceStatuses").doc(data.DeviceID);
        await deviceStatusRef.set({
            ...data,
            DateCreated: new Date(),
        });

        return { deviceId: data.DeviceID };
    }

    static async getDeviceStatus(deviceId: string) {
        const deviceStatusRef = db.collection("deviceStatuses").doc(deviceId);
        const deviceStatusSnapshot = await deviceStatusRef.get();

        if (!deviceStatusSnapshot.exists) {
            throw new Error("DEVICE_STATUS_NOT_FOUND");
        }

        return { deviceId: deviceStatusSnapshot.id, ...deviceStatusSnapshot.data() };
    }

    static async getDeviceStatusByOwnerUserId(userId: string) {
        const deviceOwnersSnapshot = await db.collection("deviceOwners").where("UserID", "==", userId).get();

        if (deviceOwnersSnapshot.empty) {
            throw new Error("NO_DEVICE_OWNERS_FOUND");
        }

        const deviceIds = deviceOwnersSnapshot.docs.map(doc => doc.id);
        const deviceStatuses = await Promise.all(deviceIds.map(id => this.getDeviceStatus(id)));

        return deviceStatuses;
    }

    static async getDeviceStatusByOwnerGroupId(groupId: string) {
        const deviceOwnersSnapshot = await db.collection("deviceOwners").where("GroupID", "==", groupId).get();
        
        if (deviceOwnersSnapshot.empty) {
            throw new Error("NO_DEVICE_OWNERS_FOUND");
        }
        
        const deviceIds = deviceOwnersSnapshot.docs.map(doc => doc.id);
        const deviceStatuses = await Promise.all(deviceIds.map(id => this.getDeviceStatus(id)));
        
        return deviceStatuses;
    }

    static async updateDeviceStatus(deviceId:string, data: IDeviceStatus) {
        const deviceStatusRef = db.collection("deviceStatuses").doc(deviceId);
        const deviceStatusSnapshot = await deviceStatusRef.get();

        if (!deviceStatusSnapshot.exists) {
            throw new Error("DEVICE_STATUS_NOT_FOUND");
        }

        await deviceStatusRef.update({
            ...data,
            DateUpdated: new Date(),
        });

        return { deviceId: data.DeviceID };
    }

    static async createDeviceOwner(data: IDeviceOwner) {
        const deviceRef = db.collection("devices").doc(data.DeviceID);
        const deviceSnapshot = await deviceRef.get();

        if (!deviceSnapshot.exists) {
            throw new Error("DEVICE_NOT_FOUND");
        }

        if (!data.UserID && !data.GroupID) {
            throw new Error("USER_OR_GROUP_ID_REQUIRED");
        }

        const deviceOwnerRef = db.collection("deviceOwners").doc(data.DeviceID);
        await deviceOwnerRef.set({
            DeviceID: data.DeviceID,
            UserID: data.UserID || null,
            GroupID: data.GroupID || null,
            DateAdded: new Date(),
        });

        return { deviceId: data.DeviceID, userId: data.UserID, groupId: data.GroupID };
    }

    static async updateDeviceOwner(data: IDeviceOwner) {
        const deviceOwnerRef = db.collection("deviceOwners").doc(data.DeviceID);
        const deviceOwnerSnapshot = await deviceOwnerRef.get();

        if (!deviceOwnerSnapshot.exists) {
            throw new Error("DEVICE_OWNER_NOT_FOUND");
        }

        if (!data.UserID && !data.GroupID) {
            throw new Error("USER_OR_GROUP_ID_REQUIRED");
        }

        await deviceOwnerRef.update({
            UserID: data.UserID || null,
            GroupID: data.GroupID || null,
            DateUpdated: new Date(),
        });

        return { deviceId: data.DeviceID, userId: data.UserID, groupId: data.GroupID };
    }

    static async getDeviceOwners(deviceId: string) {
        const deviceOwnerRef = db.collection("deviceOwners").doc(deviceId);
        const deviceOwnerSnapshot = await deviceOwnerRef.get();

        if (!deviceOwnerSnapshot.exists) {
            throw new Error("DEVICE_OWNER_NOT_FOUND");
        }

        return { ...deviceOwnerSnapshot.data() };
    }

    static async getDevicesByUserId(userId: string) {
        const deviceOwnersSnapshot = await db.collection("deviceOwners").where("UserID", "==", userId).get();

        if (deviceOwnersSnapshot.empty) {
            throw new Error("NO_DEVICES_FOUND");
        }

        const deviceIds = deviceOwnersSnapshot.docs.map(doc => doc.id);
        const devices = await Promise.all(deviceIds.map(id => this.getDeviceById(id)));

        return devices;
    }

    static async getDevicesByGroupId(groupId: string) {
        const deviceOwnersSnapshot = await db.collection("deviceOwners").where("GroupID", "==", groupId).get();

        if (deviceOwnersSnapshot.empty) {
            throw new Error("NO_DEVICES_FOUND");
        }

        const deviceIds = deviceOwnersSnapshot.docs.map(doc => doc.id);
        const devices = await Promise.all(deviceIds.map(id => this.getDeviceById(id)));

        return devices;
    }

    static async softDeleteDevice(deviceId: string) {
        const deviceRef = db.collection("devices").doc(deviceId);
        const deviceSnapshot = await deviceRef.get();

        if (!deviceSnapshot.exists) {
            throw new Error("DEVICE_NOT_FOUND");
        }

        await deviceRef.update({
            isDeleted: true,
            DateUpdated: new Date(),
        });

        return { deviceId };
    } 


}