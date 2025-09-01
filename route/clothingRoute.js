import { Router } from "express";
import { addClothing, deleteClothing, getClothing, getClothings, updateClothing } from "../controller/clothingController.js";
import { protect } from "../middleware/protectedRouter.js";
import { restrict } from "../middleware/ristricted.js";


const router = Router();

router.post('/', addClothing)

router.get('/', protect, restrict('admin'), getClothings)

router.get('/:id', getClothing)

router.put('/:id', updateClothing)

router.delete('/:id', deleteClothing)

export default router