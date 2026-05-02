import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, messagesTable, insertMessageSchema } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

router.post("/messages", async (req, res) => {
  try {
    const parsed = insertMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input: " + parsed.error.message });
      return;
    }

    await db.insert(messagesTable).values(parsed.data);

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    req.log.error({ err }, "Failed to save message");
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await db
      .select()
      .from(messagesTable)
      .orderBy(desc(messagesTable.createdAt));

    res.json({ messages });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch messages");
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.patch("/messages/:id/read", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid message id" });
      return;
    }

    const result = await db
      .update(messagesTable)
      .set({ read: true })
      .where(eq(messagesTable.id, id))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    req.log.error({ err }, "Failed to mark message as read");
    res.status(500).json({ error: "Failed to update message" });
  }
});

router.delete("/messages/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid message id" });
      return;
    }

    const result = await db
      .delete(messagesTable)
      .where(eq(messagesTable.id, id))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete message");
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
