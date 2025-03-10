import { Router } from "express";
import { deleteFabric, getAllFabric, getFabric, postFabric, putFabric } from "../controllers/fabric.controller.js";
import multer from 'multer'
import { objectify } from "../middlewares/objectify.js";

const upload = multer({dest: 'temp-uploads'});
const router = Router();

router.get('/', getAllFabric);
router.get('/:id', getFabric);
router.post('/', upload.array("files", 5), objectify, postFabric);
router.put('/:id', upload.array("files", 5), objectify, putFabric);
router.delete('/:id', deleteFabric);

export default router;