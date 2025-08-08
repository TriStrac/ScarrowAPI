import { Router } from "express";
import { DeviceController } from "../controllers";
import { authenticateJWT, userActivityLogger } from "../middlewares";

const router = Router();

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Create a new device
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       201:
 *         description: Device created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deviceId:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateJWT, userActivityLogger("Devices", "Created a Device"), DeviceController.createDevice);

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: List of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 devices:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Device'
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateJWT, userActivityLogger("Devices", "Retrieved All Devices"), DeviceController.getAllDevices);

/**
 * @swagger
 * /api/devices/{deviceId}:
 *   get:
 *     summary: Get device by ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 device:
 *                   $ref: '#/components/schemas/Device'
 *       400:
 *         description: Device ID is required
 *       404:
 *         description: Device not found
 *       500:
 *         description: Internal server error
 */
router.get("/:deviceId", authenticateJWT, userActivityLogger("Devices", "Retrieved a Device"), DeviceController.getDeviceById);

/**
 * @swagger
 * /api/devices/{deviceId}/name:
 *   patch:
 *     summary: Update device
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DeviceName:
 *                 type: string
 *               DeviceLocation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device info updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deviceId:
 *                   type: string
 *       400:
 *         description: Device ID and new name are required
 *       500:
 *         description: Internal server error
 */
router.patch("/:deviceId/name", authenticateJWT, userActivityLogger("Devices", "Updated a Device"), DeviceController.updateDeviceInfo);

/**
 * @swagger
 * /api/devices/{deviceId}/status:
 *   post:
 *     summary: Create device status
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeviceStatus'
 *     responses:
 *       201:
 *         description: Device status created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deviceId:
 *                   type: string
 *       400:
 *         description: Device ID is required
 *       500:
 *         description: Internal server error
 */
router.post("/:deviceId/status", authenticateJWT, userActivityLogger("Devices", "Created a Device Status"), DeviceController.createDeviceStatus);

/**
 * @swagger
 * /api/devices/{deviceId}/status:
 *   get:
 *     summary: Get device status
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device status found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   $ref: '#/components/schemas/DeviceStatus'
 *       400:
 *         description: Device ID is required
 *       404:
 *         description: Device status not found
 *       500:
 *         description: Internal server error
 */
router.get("/:deviceId/status", authenticateJWT, userActivityLogger("Devices", "Retrieved a Device Status"), DeviceController.getDeviceStatus);

/**
 * @swagger
 * /api/devices/status/user/{userId}:
 *   get:
 *     summary: Get device statuses by owner user ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Device statuses found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statuses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeviceStatus'
 *       400:
 *         description: User ID is required
 *       404:
 *         description: No device owners found
 *       500:
 *         description: Internal server error
 */
router.get("/status/user/:userId", authenticateJWT, userActivityLogger("Devices", "Retrieved Device Status by User"), DeviceController.getDeviceStatusByOwnerUserId);

/**
 * @swagger
 * /api/devices/status/group/{groupId}:
 *   get:
 *     summary: Get device statuses by owner group ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Device statuses found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statuses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeviceStatus'
 *       400:
 *         description: Group ID is required
 *       404:
 *         description: No device owners found
 *       500:
 *         description: Internal server error
 */
router.get("/status/group/:groupId", authenticateJWT, userActivityLogger("Devices", "Retrieved Device Status by Group"), DeviceController.getDeviceStatusByOwnerGroupId);

/**
 * @swagger
 * /api/devices/{deviceId}/status:
 *   patch:
 *     summary: Update device status
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeviceStatus'
 *     responses:
 *       200:
 *         description: Device status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deviceId:
 *                   type: string
 *       400:
 *         description: Device ID is required
 *       500:
 *         description: Internal server error
 */
router.patch("/:deviceId/status", authenticateJWT, userActivityLogger("Devices", "Updated a Device Status"), DeviceController.updateDeviceStatus);

/**
 * @swagger
 * /api/devices/owner:
 *   post:
 *     summary: Create device owner
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeviceOwner'
 *     responses:
 *       201:
 *         description: Device owner created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deviceId:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/owner", authenticateJWT, userActivityLogger("Devices", "Created a Device Owner"), DeviceController.createDeviceOwner);

/**
 * @swagger
 * /api/devices/owner:
 *   patch:
 *     summary: Update device owner
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeviceOwner'
 *     responses:
 *       200:
 *         description: Device owner updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deviceId:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.patch("/owner", authenticateJWT, userActivityLogger("Devices", "Updated a Device Owner"), DeviceController.updateDeviceOwner);

/**
 * @swagger
 * /api/devices/{deviceId}/owners:
 *   get:
 *     summary: Get device owners
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device owners found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 owner:
 *                   $ref: '#/components/schemas/DeviceOwner'
 *       400:
 *         description: Device ID is required
 *       404:
 *         description: Device owner not found
 *       500:
 *         description: Internal server error
 */
router.get("/:deviceId/owners", authenticateJWT, userActivityLogger("Devices", "Retrieved Device Owners"), DeviceController.getDeviceOwners);

/**
 * @swagger
 * /api/devices/user/{userId}:
 *   get:
 *     summary: Get devices by user ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Devices found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 devices:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Device'
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Internal server error
 */
router.get("/user/:userId", authenticateJWT, userActivityLogger("Devices", "Retrieved Devices by User"), DeviceController.getDevicesByUserId);

/**
 * @swagger
 * /api/devices/group/{groupId}:
 *   get:
 *     summary: Get devices by group ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Devices found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 devices:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Device'
 *       400:
 *         description: Group ID is required
 *       500:
 *         description: Internal server error
 */
router.get("/group/:groupId", authenticateJWT, userActivityLogger("Devices", "Retrieved Devices by Group"), DeviceController.getDevicesByGroupId);

/**
 * @swagger
 * /api/devices/{deviceId}/softDelete:
 *   patch:
 *     summary: Soft delete device by ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device soft deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deviceId:
 *                   type: string
 *       400:
 *         description: Device ID is required
 *       500:
 *         description: Internal server error
 */
router.patch("/:deviceId/softDelete", authenticateJWT, userActivityLogger("Devices", "Deleted a Device"), DeviceController.softDeleteDevice);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         DeviceName:
 *           type: string
 *         DeviceType:
 *           type: string
 *         DeviceLocation:
 *           type: string
 *     DeviceStatus:
 *       type: object
 *       properties:
 *         BatteryState:
 *           type: string
 *         BatteryLevel:
 *           type: number
 *         IsOnline:
 *           type: boolean
 *     DeviceOwner:
 *       type: object
 *       properties:
 *         DeviceID:
 *           type: string
 *         UserID:
 *           type: string
 *         GroupID:
 *           type: string
 */
