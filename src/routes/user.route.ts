
import { Router } from "express";
import { UserController } from "../controllers";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
router.get("/", UserController.getAllUsers);

/**
 * @swagger
 * /api/users/by-email:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: User email
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/by-email", UserController.getUserByEmail);

/**
 * @swagger
 * /api/users/{userId}:
 *   patch:
 *     summary: Update user by ID
 *     tags: [Users]
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
 *               isUserInGroup:
 *                 type: boolean
 *               isUserHead:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: userId param is required
 *       500:
 *         description: Internal server error
 */
router.patch("/:userId", UserController.updateUserByID);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
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
 *                 userId:
 *                   type: string
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", UserController.loginUser);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
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
 *         description: Email and newPassword are required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/change-password", UserController.changePassword);

/**
 * @swagger
 * /api/users/{userId}/soft-delete:
 *   patch:
 *     summary: Soft delete user by ID
 *     tags: [Users]
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
router.patch("/:userId/soft-delete", UserController.softDeleteUserByID);

/**
 * @swagger
 * /api/users/deleted:
 *   get:
 *     summary: Get all deleted users
 *     tags: [Users]
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
router.get("/deleted", UserController.getAllDeletedUsers);

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
