import bcrypt from 'bcrypt';
import express, { Response } from 'express';
import { userAuth } from '../middlewares/auth.js';
import { AuthenticatedRequest } from '../types/express';
import { validateEditProfileData } from '../utils/validation.js';

export const profileRouter = express.Router();

//Profile Api with user from middleware
profileRouter.get('/profile/view', userAuth, async (req: AuthenticatedRequest, res) => {
  try {
    res.send(req.user);
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).send("Error fetching profile: " + errorMessage);
  }
});

//Edit profile Api
profileRouter.patch('/profile/edit', userAuth, async(req: AuthenticatedRequest, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new Error("User not found in request");
    }
    
    Object.keys(req.body).forEach((key) => {
      if (loggedInUser && key in loggedInUser) {
        loggedInUser.set(key, req.body[key]);
      }
    });
    await loggedInUser.save();

     res.json({
      message: `${loggedInUser?.get('firstName') || 'User'}, your profile updated successfully`,
      data: loggedInUser,
    });
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).send("ERROR : " + errorMessage);
  }
});

// Edit Profile API for Changing Password (Reset password)
profileRouter.patch('/profile/changepassword', userAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current and new passwords are required' });
      return;
    }

    const loggedInUser = req.user;

    if (!loggedInUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, loggedInUser.get('password'));
    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    loggedInUser.set('password', await bcrypt.hash(newPassword, 10));
    await loggedInUser.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: String(error) });
  }
});