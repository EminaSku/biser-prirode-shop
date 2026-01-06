const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function safeFileName(originalName) {
  const ext = (originalName.split(".").pop() || "png").toLowerCase();
  const base = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
  return `${base}-${Date.now()}.${ext}`;
}

// POST /admin/upload  (form-data: file)
router.post("/upload", requireAuth, requireAdmin, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = safeFileName(req.file.originalname);
    const path = `products/${fileName}`;

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(path, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) return res.status(500).json({ message: "Upload failed", error: error.message });

    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(path);

    return res.status(201).json({ url: data.publicUrl, path });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
