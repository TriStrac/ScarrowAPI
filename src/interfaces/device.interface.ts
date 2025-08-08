export interface IDevice{
    DeviceID: string;
    DeviceName: string;
    DeviceType: string;
    DateCreated: Date;
    DeviceLocation: string;
    isDeleted?: boolean; // Optional field to indicate if the device is deleted
}

export interface IDeviceStatus {
    DeviceID: string;
    BatteryState: string;
    BatteryLevel: number; // Percentage from 0 to 100
    LastUpdate: Date;
    IsOnline: boolean; // Indicates if the device is currently online
}

export interface IDeviceOwner {
    DeviceID: string; // Primary key and foreign key to IDevice
    UserID: string;
    GroupID: string;
}
