import { Router } from "express";
import * as noteController from "./noteController";
import { authenticateToken } from "../../../shared/middleware";

const router = Router();

router.use(authenticateToken);

router.get("/:noteId", noteController.getNoteById);

export default router;
