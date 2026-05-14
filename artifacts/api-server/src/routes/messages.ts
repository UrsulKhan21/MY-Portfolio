import { Router } from "express";
import { z } from "zod";

const router = Router();

const messages: Array<{ name: string; email: string; message: string }> = [];

const messageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

router.post("/messages", (req, res) => {
  const result = messageSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Missing or invalid data" });
    return;
  }
  const newMessage = result.data;
  messages.push(newMessage);
  res.status(201).json(newMessage);
});


export default router;
