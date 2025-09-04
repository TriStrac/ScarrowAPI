
import { Router } from "express";
import { UserController } from "../controllers";
import { authenticateJWT, userActivityLogger } from "../middlewares";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - isUserInGroup
 *               - isUserHead
 *               - address
 *               - profile
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               isUserInGroup:
 *                 type: boolean
 *               isUserHead:
 *                 type: boolean
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *               profile:
 *                 $ref: '#/components/schemas/Profile'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 profileId:
 *                   type: string
 *                 addressId:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Existing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Existing email
 *       500:
 *         description: Internal server error
 */
router.post("/", UserController.createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateJWT, userActivityLogger("Accounts", "Retrieved All Accounts"), UserController.getAllUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     address:
 *                       $ref: '#/components/schemas/Address'
 *                     profile:
 *                       $ref: '#/components/schemas/Profile'
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", authenticateJWT, userActivityLogger("Accounts", "Retrieved by ID"), UserController.getUserById);

/**
 * @swagger
 * /api/users/{userId}:
 *   patch:
 *     summary: Update user information by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               isUserInGroup:
 *                 type: boolean
 *               isUserHead:
 *                 type: boolean
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *               profile:
 *                 $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     address:
 *                       $ref: '#/components/schemas/Address'
 *                     profile:
 *                       $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid input or userId param is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:userId", authenticateJWT, userActivityLogger("Accounts", "Retrieved by UserId"), UserController.updateUserByID);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                   description: JWT bearer token
 *                 userId:
 *                   type: string
 *                   description: ID of the logged in user
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", userActivityLogger("Accounts", "Logged In"), UserController.loginUser);

/**
 * @swagger
 * /api/users/changePassword:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               userId:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 userId:
 *                   type: string
 *       400:
 *         description: userId, oldPassword, and newPassword are required
 *       401:
 *         description: Old password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/changePassword", authenticateJWT, userActivityLogger("Accounts", "Password Changed"), UserController.changePassword);

/**
 * @swagger
 * /api/users/{userId}/softDelete:
 *   patch:
 *     summary: Soft delete user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User soft deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 userId:
 *                   type: string
 *       400:
 *         description: userId param is required
 *       500:
 *         description: Internal server error
 */
router.patch("/:userId/softDelete", authenticateJWT, userActivityLogger("Accounts", "Deleted an Account"), UserController.softDeleteUserByID);

/**
 * @swagger
 * /api/users/deleted:
 *   get:
 *     summary: Get all deleted users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/deleted",authenticateJWT, userActivityLogger("Accounts", "Retrieved Deleted Users"), UserController.getAllDeletedUsers);

/**
 * @swagger
 * /api/users/emailExists:
 *   post:
 *     summary: Check if email exists (not deleted)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email existence result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *       400:
 *         description: Email is required in request body
 *       500:
 *         description: Internal server error
 */
router.post("/emailExists", authenticateJWT, UserController.checkEmailExists);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         addressId:
 *           type: string
 *         profileId:
 *           type: string
 *         isUserInGroup:
 *           type: boolean
 *         isUserHead:
 *           type: boolean
 *         email:
 *           type: string
 *     Address:
 *       type: object
 *       properties:
 *         streetName:
 *           type: string
 *         baranggay:
 *           type: string
 *         town:
 *           type: string
 *         province:
 *           type: string
 *         zipCode:
 *           type: string
 *     Profile:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         middleName:
 *           type: string
 *         lastName:
 *           type: string
 *         birthDate:
 *           type: string
 *         phoneNumber:
 *           type: string
 */
