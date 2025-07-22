import { Request, Response, NextFunction } from 'express';
import { UserActivityLogService } from '../services';

export class UserActivityLogController {
  static async getAllUserActivityLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await UserActivityLogService.getAllUserActivityLogs();
      res.json(logs);
    } catch (error) {
      next(error);
    }
  }

  static async getUserActivityLogsByUserID(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const logs = await UserActivityLogService.getUserActivityLogsByUserID(userId);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  }

  static async getUserActivityLogsByDeviceID(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;
      const logs = await UserActivityLogService.getUserActivityLogsByDeviceID(deviceId);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  }
} 