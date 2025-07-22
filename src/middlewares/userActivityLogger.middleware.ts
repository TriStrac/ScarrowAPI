import { UserActivityLogService } from '../services';
import { Request, Response, NextFunction } from 'express';

export function userActivityLogger(activityClass: string, activityType: string) {

  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    const sanitizedBody = { ...req.body };
    if ('password' in sanitizedBody) {
      sanitizedBody.password = '[HIDDEN]';
    }

    res.on('finish', () => {

      if (res.statusCode < 400 && (req as any).user) {
        const duration = Date.now() - start;

        const logPayload = {
          activityClass,
          activityType,
          userId: (req as any).user.id,
          deviceId: req.body?.deviceId || null,
          activityInfo: {
            method: req.method,
            route: req.originalUrl,
            status: res.statusCode,
            durationMs: duration,
            params: req.params,
            query: req.query,
            body: sanitizedBody,
          }
        };
        setImmediate(async () => {
          try {
            await UserActivityLogService.logUserActivity(logPayload);
          } catch (err) {
          }
        });
      }
    });

    next();
  };
}
