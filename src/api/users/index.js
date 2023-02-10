import express from "express"
// import createHttpError from "http-errors"
// import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js"
// import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js"
// import { createAccessToken } from "../../lib/auth/tools.js"
import UsersModel from "./model.js"
import jwt from "jsonwebtoken"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})


  usersRouter.get("/:id", async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await UsersModel.findById(userId)
  
      if (!user) {
        return res.status(404).send("User not found")
      }
  
  
      res.status(200).send({
        id: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
       
      })
    } catch (error) {
      next(error)
    }
  })

  usersRouter.put("/:id", async (req, res, next) => {
    try {
      const userId = req.params.id
      const updatedUser = await UsersModel.findByIdAndUpdate(userId, req.body, {
        new: true,
      })
      if (!updatedUser) {
        return res.status(404).send("User not found")
      }
      res.status(200).send(updatedUser)
    } catch (error) {
      next(error)
    }
  })
  
  usersRouter.get("/", async (req, res, next) => {
    try {
      const allUsers = await UsersModel.find({})
      res.status(200).send(allUsers)
    } catch (error) {
      next(error)
    }
  })
  
  usersRouter.delete("/:id", async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await UsersModel.findByIdAndDelete(userId)
      if (!user) {
        return res.status(404).send("User not found")
      }
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  })
  
// AUTHENTICATION

const secretKey = process.env.JWT_SECRET

usersRouter.post("/register", async (req, res) => {
    const { email, password, role, firstName, lastName } = req.body;
    
    // Validate email, password, and role
    if (!email || !password || !role|| !firstName|| !lastName) {
      return res.status(400).json({ error: "Email, password, firstName, lastName and role are required." });
    }
    
    try {
        const newUser = new UsersModel(req.body)
        const { _id } = await newUser.save()
    

    const token = jwt.sign({ email, role }, secretKey, { expiresIn: "1h" });
  
    return res.json({ token });
} catch (error) {
  return res.status(500).json({ error: error.message });
}
});
  
  usersRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    // Validate email and password
    // ...
  
    try {
      // Connect to the database
  
      // Find the user in the database
      const user = await UsersModel.findOne({ email });
  
      // Check if the user exists and the password is correct
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Email or password is incorrect." });
      }
  
      // Get the user's role from the database
      let role = user.role;
      if (role !== "Host" && role !== "Guest") {
        role = "Guest";
      }
  
      // Generate JWT token
      const token = jwt.sign({ email, role }, secretKey, { expiresIn: "1h" });
  
    
  
      return res.json({ token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
  
  // Add this middleware to protect resource endpoints
  function authenticateToken(req, res, next) {
    const token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token." });
    }
  }
  
  usersRouter.get("/protected", authenticateToken, (req, res) => {
    return res.json({ message: "Welcome to the protected resource!" });
  });
  

export default usersRouter