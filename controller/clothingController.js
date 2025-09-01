import Clothing from './../models/clothing.js';



export const addClothing = async (req, res) => {
    const { name, brand, price } = req.body;

    if (!name || !brand || !price) {
        return res.status(400).json({ msg: 'all fields are required' })
    }

    try {

        
        const clothing = new Clothing(req.body);
        await clothing.save();

        res.status(201).json(clothing)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

export const getClothings = async (req, res) => {
    try {
        const clothings = await Clothing.find();

        res.status(200).json(clothings)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

export const getClothing = async (req, res) => {
    const { id } = req.params
    try {
        const clothing = await Clothing.findById(id).select("-__v");

        if (!clothing) {
            return res.status(400).json({ msg: 'cloth not found' })
        }

        res.status(200).json(clothing)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

export const updateClothing = async (req, res) => {
    const { id } = req.params;
    try {
        const clothing = await Clothing.findByIdAndUpdate(id, req.body, { new: true })

        if (!clothing) {
            return res.status(400).json({ msg: 'cloth not updated' })
        }

        res.status(200).json(clothing)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

export const deleteClothing = async (req, res) => {
    const {id} = req.params
    const clothing = await Clothing.findOneAndDelete(id)
    res.status(200).json(clothing)

}