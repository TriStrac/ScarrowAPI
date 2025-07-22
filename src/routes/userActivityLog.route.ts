import { Router } from 'express';
import { UserActivityLogController } from '../controllers';
import { authenticateJWT } from '../middlewares';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: UserActivityLogs
 *   description: User activity log management
 */

/**
 * @swagger
 * /api/userActivityLogs:
 *   get:
 *     summary: Get all user activity logs
 *     tags: [UserActivityLogs]
 *     responses:
 *       200:
 *         description: List of all user activity logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserActivityLog'
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateJWT, UserActivityLogController.getAllUserActivityLogs);

/**
 * @swagger
 * /api/userActivityLogs/user/{userId}:
 *   get:
 *     summary: Get activity logs by user ID
 *     tags: [UserActivityLogs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to filter logs
 *     responses:
 *       200:
 *         description: List of activity logs for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserActivityLog'
 *       404:
 *         description: No logs found for the user
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', authenticateJWT, UserActivityLogController.getUserActivityLogsByUserID);

/**
 * @swagger
 * /api/userActivityLogs/device/{deviceId}:
 *   get:
 *     summary: Get activity logs by device ID
 *     tags: [UserActivityLogs]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID to filter logs
 *     responses:
 *       200:
 *         description: List of activity logs for the specified device
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserActivityLog'
 *       404:
 *         description: No logs found for the device
 *       500:
 *         description: Internal server error
 */
router.get('/device/:deviceId', authenticateJWT, UserActivityLogController.getUserActivityLogsByDeviceID);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     UserActivityLog:
 *       type: object
 *       properties:
 *         UserActivityLogID:
 *           type: string
 *           description: Unique identifier for the activity log
 *         UserID:
 *           type: string
 *           description: ID of the user who performed the activity
 *         DeviceID:
 *           type: string
 *           nullable: true
 *           description: ID of the device (if applicable)
 *         ActivityDateTime:
 *           type: string
 *           format: date-time
 *           description: Date and time of the activity
 *         ActivityClass:
 *           type: string
 *           description: Class/category of the activity (e.g., Device, Accounts)
 *         ActivityType:
 *           type: string
 *           description: Type of activity (e.g., Created, Edited)
 *         ActivityInfo:
 *           type: object
 *           additionalProperties: true
 *           description: Additional information about the activity
 */ 