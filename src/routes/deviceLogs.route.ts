import { Router } from "express";
import { DeviceLogsController } from "../controllers";
import { authenticateJWT, userActivityLogger} from "../middlewares";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DeviceLogInput:
 *       type: object
 *       properties:
 *         DeviceID:
 *           type: string
 *         Timestamp:
 *           type: string
 *           format: date-time
 *         ActiveDuration:
 *           type: number
 *         PestType:
 *           type: string
 *         FendType:
 *           type: string
 *     DeviceLog:
 *       allOf:
 *         - $ref: '#/components/schemas/DeviceLogInput'
 *         - type: object
 *           properties:
 *             DeviceLogsID:
 *               type: string
 */

/**
 * @swagger
 * /api/deviceLogs:
 *   post:
 *     summary: Create a new device log
 *     tags: [DeviceLogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeviceLog'
 *     responses:
 *       201:
 *         description: Device log created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DeviceLog'
 *       400:
 *         description: Invalid input
 */
router.post("/", DeviceLogsController.createDeviceLog);

/**
 * @swagger
 * /api/deviceLogs:
 *   get:
 *     summary: Get all device logs
 *     tags: [DeviceLogs]
 *     responses:
 *       200:
 *         description: List of device logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeviceLog'
 */
router.get("/", authenticateJWT, userActivityLogger("DeviceLogs", "Retrieved all Device Logs"), DeviceLogsController.getAllDeviceLogs);

/**
 * @swagger
 * /api/deviceLogs/device/{deviceId}:
 *   get:
 *     summary: Get device logs by device ID
 *     tags: [DeviceLogs]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device logs found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeviceLog'
 *       400:
 *         description: Device ID is required
 */
router.get("/device/:deviceId", authenticateJWT, userActivityLogger("DeviceLogs", "Retrieved Logs of a Device"), DeviceLogsController.getDeviceLogsByDeviceId);

/**
 * @swagger
 * /api/deviceLogs/{logId}:
 *   get:
 *     summary: Get device log by log ID
 *     tags: [DeviceLogs]
 *     parameters:
 *       - in: path
 *         name: logId
 *         schema:
 *           type: string
 *         required: true
 *         description: Log ID
 *     responses:
 *       200:
 *         description: Device log found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DeviceLog'
 *       400:
 *         description: Log ID is required
 */
router.get("/:logId", authenticateJWT, userActivityLogger("DeviceLogs", "Retrieved Single Log Details"), DeviceLogsController.getDeviceLogById);

/**
 * @swagger
 * /api/deviceLogs/device/{deviceId}:
 *   delete:
 *     summary: Delete all device logs by device ID
 *     tags: [DeviceLogs]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       204:
 *         description: Device logs deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Device ID is required
 */
router.delete("/device/:deviceId", authenticateJWT, userActivityLogger("DeviceLogs", "Deleted all logs of a Device"), DeviceLogsController.deleteAllDeviceLogByDeviceId);

export default router;
