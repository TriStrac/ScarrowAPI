export interface IUserActivityLog {
    UserActivityLogID: string;
    ActivityClass: string;
    ActivityType: string; 
    ActivityDateTime: Date;
    UserID: string;
    DeviceID?: string | null;
    ActivityInfo: Record<string, any>;
}
  