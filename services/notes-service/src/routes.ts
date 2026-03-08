import { Router } from "express";
import * as noteController from "./noteController";
import { authenticateToken, validateRequest } from "../../../shared/middleware";
import { createNoteSchema, getNotesByUserSchema } from "./validation";

const router = Router();

router.use(authenticateToken);

router.post("/", validateRequest(createNoteSchema), noteController.createNote);
router.get("/", validateRequest(getNotesByUserSchema), noteController.getNotes);
router.get("/:noteId", noteController.getNoteById);

export default router;
