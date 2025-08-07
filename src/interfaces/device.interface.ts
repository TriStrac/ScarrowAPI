export interface IDevice{
    DeviceID: string;
    DeviceName: string;
    DeviceType: string;
    DeviceLocation: string;
}

export interface IDeviceStatus {
    DeviceID: string;
    BatteryState: string;
    BatteryLevel: number; // Percentage from 0 to 100
    LastUpdate: Date;
    IsOnline: boolean; // Indicates if the device is currently online
}