import { db } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { IUserActivityLog } from '../interfaces';

const COLLECTION_NAME = 'UserActivityLogs';

export class UserActivityLogService {
    static async createUserActivityLog(log: Omit<IUserActivityLog, 'UserActivityLogID'>): Promise<void> {
        const id = uuidv4();
        const newLog: IUserActivityLog = {
            UserActivityLogID: id,
            ...log,
        };

        await db.collection(COLLECTION_NAME).doc(id).set(newLog);
    }

    static async logUserActivity(params: {
        userId: string;
        deviceId?: string | null;
        activityClass: string;
        activityType: string;
        activityInfo?: Record<string, any>;
        }): Promise<void> {
        await this.createUserActivityLog({
            UserID: params.userId,
            DeviceID: params.deviceId || null,
            ActivityClass: params.activityClass,
            ActivityType: params.activityType,
            ActivityDateTime: new Date(),
            ActivityInfo: params.activityInfo || {},
        });
    }

    static async getAllUserActivityLogs(): Promise<IUserActivityLog[]> {
        const snapshot = await db.collection(COLLECTION_NAME).orderBy('ActivityDateTime', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as IUserActivityLog);
    }

    static async getUserActivityLogsByUserID(userId: string): Promise<IUserActivityLog[]> {
        const snapshot = await db.collection(COLLECTION_NAME)
            .where('UserID', '==', userId)
            .orderBy('ActivityDateTime', 'desc')
            .get();

    return snapshot.docs.map(doc => doc.data() as IUserActivityLog);
    }

    static async getUserActivityLogsByDeviceID(deviceId: string): Promise<IUserActivityLog[]> {
        const snapshot = await db.collection(COLLECTION_NAME)
            .where('DeviceID', '==', deviceId)
            .orderBy('ActivityDateTime', 'desc')
            .get();

    return snapshot.docs.map(doc => doc.data() as IUserActivityLog);
    }
}
