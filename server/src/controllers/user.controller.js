import { userService } from '../services/user.service.js';

const listUsers = async (req, res) => {
   try {
      const users = await userService.getUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
}

const createUser = async (req, res) => {
  try{

    const userData = req.body; 
    
    const newUser = await userService.createUser(userData);

    return res.status(201).json({
          message: 'User successfully created',
          user: newUser
      });

  }catch(err){
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const userController = {
  listUsers,
  createUser
};