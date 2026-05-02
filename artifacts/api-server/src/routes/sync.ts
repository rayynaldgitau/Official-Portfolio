import { Router, type IRouter } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const router: IRouter = Router();

router.post("/sync/github", async (req, res) => {
  const token = process.env["GITHUB_TOKEN"];
  if (!token) {
    res.status(500).json({ success: false, error: "GITHUB_TOKEN is not configured on this server." });
    return;
  }

  try {
    const repoUrl = `https://${token}@github.com/rayynaldgitau/Official-Portfolio.git`;
    const { stdout, stderr } = await execAsync(
      `git --no-optional-locks push ${repoUrl} HEAD:main 2>&1`,
      { cwd: "/home/runner/workspace", timeout: 60000 }
    );
    const output = (stdout + stderr).trim();
    req.log.info({ output }, "GitHub sync completed");
    res.json({ success: true, message: output || "Pushed successfully to GitHub." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Push failed";
    req.log.error({ err }, "GitHub sync failed");
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
