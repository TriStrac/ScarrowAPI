import { Router } from "express";
import { GroupController } from "../controllers";
import { authenticateJWT, userActivityLogger } from "../middlewares";

const router = Router();

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group and turns the creator into Group Owner
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroupDto'
 *     responses:
 *       201:
 *         description: Group created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateJWT, userActivityLogger('Groups', 'Created a Group'), GroupController.createGroup);

/**
 * @swagger
 * /api/groups/{groupId}:
 *   patch:
 *     summary: Update a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGroupDto'
 *     responses:
 *       200:
 *         description: Group updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.patch('/:groupId', authenticateJWT, userActivityLogger('Groups', 'Updated a Group'), GroupController.updateGroup);

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: List of groups
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateJWT, userActivityLogger("Groups", "Retrieved All Groups"),GroupController.getAllGroups);

/**
 * @swagger
 * /api/groups/owner:
 *   get:
 *     summary: Get groups by owner
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of groups for owner
 *       400:
 *         description: Owner ID required
 *       500:
 *         description: Internal server error
 */
router.get('/owner', authenticateJWT, userActivityLogger("Groups", "Retrieved Group by Owner"), GroupController.getGroupsByOwner);

/**
 * @swagger
 * /api/groups/name:
 *   get:
 *     summary: Get group info by name
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: groupName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group info
 *       400:
 *         description: Group name required
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.get('/name', authenticateJWT, userActivityLogger("Groups", "Retrieved Group Info by Name"), GroupController.getGroupInfoByName);

/**
 * @swagger
 * /api/groups/{groupId}:
 *   get:
 *     summary: Get group info by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group info
 *       400:
 *         description: Group ID required
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.get('/:groupId', authenticateJWT, userActivityLogger("Groups", "Retrieved Group Info by ID"), GroupController.getGroupInfoById);

/**
 * @swagger
 * /api/groups/{groupId}/softDelete:
 *   patch:
 *     summary: Soft delete a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group soft-deleted
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:groupId/softDelete', authenticateJWT, userActivityLogger("Groups", "Soft Deleted a Group"), GroupController.softDeleteGroup);

/**
 * @swagger
 * /api/groups/member:
 *   post:
 *     summary: Add a member to a group by email
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: string
 *               userEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member added
 *       400:
 *         description: Group ID and User Email required
 *       404:
 *         description: Group or User not found
 *       500:
 *         description: Internal server error
 */
router.post('/member', authenticateJWT, userActivityLogger("Groups", "Added a Member"), GroupController.addGroupMember);

/**
 * @swagger
 * /api/groups/member:
 *   delete:
 *     summary: Remove a member from a group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member removed
 *       400:
 *         description: Group ID and User ID required
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.delete('/member', authenticateJWT, userActivityLogger("Groups", "Removed a Member"), GroupController.removeGroupMember);

/**
 * @swagger
 * /api/groups/{groupId}/members:
 *   get:
 *     summary: Get members of a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of group members
 *       400:
 *         description: Group ID required
 *       500:
 *         description: Internal server error
 */
router.get('/:groupId/members', authenticateJWT, userActivityLogger("Groups", "Retrieved Group Members"),GroupController.getGroupMembers);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateGroupDto:
 *       type: object
 *       properties:
 *         GroupOwnerID:
 *           type: string
 *         GroupName:
 *           type: string
 *         GroupDescription:
 *           type: string
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         DateCreated:
 *           type: string
 *           format: date-time
 *     UpdateGroupDto:
 *       type: object
 *       properties:
 *         GroupName:
 *           type: string
 *         GroupDescription:
 *           type: string
 */


