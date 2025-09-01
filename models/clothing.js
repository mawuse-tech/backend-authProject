import { model, Schema } from "mongoose";

const clothingSchema = new Schema({
    name: {
     type: String,
     required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        category: true
    },
    category: {
        type: String,
        default: "General"
    }
}, {timestamps: true}
);

const Clothing = model('clothing', clothingSchema);

export default Clothing