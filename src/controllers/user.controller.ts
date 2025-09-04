import { Request, Response } from "express";
import { CreateUserSchema, UpdateUserInfoSchema } from "../dto";
import { UserService } from "../services";
import jwt from "jsonwebtoken";

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const parsed = CreateUserSchema.parse(req.body);
      const result = await UserService.createUser(parsed);
      res.status(201).json({ message: "User created", userId: result.userId, profileId: result.profileId, addressId: result.addressId });
    } catch (err: any) {
      if (err.message === "DUPLICATE_EMAIL") {
        return res.status(409).json({ error: "Existing email" });
      }
      if (err.name === "ZodError") {
        return res.status(400).json({ error: err.errors });
      }
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const user = await UserService.getUserById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateUserByID(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ error: "userId param is required" });
      
      const result = UpdateUserInfoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
      }

      const updatedUser = await UserService.updateUserByID(userId, result.data);
      if (!updatedUser) return res.status(404).json({ error: "User not found" });
      
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password are required" });
      }
      const user = await UserService.loginUser(email, password);
      if (!user) return res.status(401).json({ success: false });

      (req as any).user = { id: user.userId };
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.userId,
          email: user.email,
          loginTime: Date.now()
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "30m" }
      );
      res.status(200).json({ success: true, token, userId: user.userId });
    } catch (err) {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ success: false, error: "userId, oldPassword, and newPassword are required" });
      }
      const result = await UserService.changePassword(userId, oldPassword, newPassword);
      if (result === null) return res.status(404).json({ success: false, error: "User not found" });
      if (result === false) return res.status(401).json({ success: false, error: "Old password is incorrect" });
      res.status(200).json({ success: true, userId: result.userId });
    } catch (err) {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  static async softDeleteUserByID(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ error: "userId param is required" });
      const result = await UserService.softDeleteUserByID(userId);
      res.status(200).json({ success: true, userId: result.userId });
    } catch (err) {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  static async getAllDeletedUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllDeletedUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async checkEmailExists(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email is required in request body" });
      }
      const exists = await UserService.doesEmailExist(email);
      res.status(200).json({ exists });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
