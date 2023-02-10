import express from "express"
// import createHttpError from "http-errors"
import AccomodationsModel from "./model.js"
import UsersModel from "../users/model.js"

const accomodationsRouter = express.Router()


accomodationsRouter.get("/", async (req, res, next) => {
    try {
      const allAccomodations = await AccomodationsModel.find({})
      res.status(200).send(allAccomodations)
    } catch (error) {
      next(error)
    }
  })
  
  accomodationsRouter.get("/:id", async (req, res, next) => {
    try {
      const accomodation = await AccomodationsModel.findById(req.params.id)
      if (!accomodation) {
        res.status(404).send("Accommodation not found")
      } else {
        res.status(200).send(accomodation)
      }
    } catch (error) {
        res.status(404).send({ success: false, message: "Accommodation not found" })
      }
  })
  
  accomodationsRouter.post("/", async (req, res, next) => {
    try {
      const newAccomodation = new AccomodationsModel(req.body)
      const { _id } = await newAccomodation.save()
      res.status(201).send({ _id })
    } catch (error) {
      next(error)
    }
  })
  
  accomodationsRouter.get("/users/:id", async (req, res, next) => {
    try {
      const userId = req.params.id;
      const accommodations = await AccomodationsModel.find({ user: userId });
      res.status(200).send(accommodations);
    } catch (error) {
      next(error);
    }
  });
  

  
  accomodationsRouter.put("/:id", async (req, res, next) => {
    try {
      const accomodation = await AccomodationsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!accomodation) {
        res.status(404).send("Accommodation not found")
      } else {
        res.status(200).send(accomodation)
      }
    } catch (error) {
      next(error)
    }
  })
  
  accomodationsRouter.delete("/:id", async (req, res, next) => {
    try {
      const accomodation = await AccomodationsModel.findByIdAndDelete(req.params.id)
      if (!accomodation) {
        res.status(404).send("Accommodation not found")
      } else {
        res.status(204).send()
      }
    } catch (error) {
      next(error)
    }
  })
  


export default accomodationsRouter
