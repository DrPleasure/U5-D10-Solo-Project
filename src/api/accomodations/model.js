import mongoose from "mongoose"

const { Schema, model } = mongoose

const AccomodationsSchema = new Schema(
    {
      name: { type: String, required: true },
      host: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      description: { type: String, required: true },
      maxGuests: { type: String, required: true },
      city: { type: String, required: true },
    },
    { timestamps: true }
  )



export default model("Accomodation", AccomodationsSchema)