// در حلقه‌ی rows قبل از ذخیره:
for (const r of rows) {
  if (!r.serial || !String(r.serial).trim()) {
    return res.status(400).json({ error: "serial is required" });
  }
  if (!r.expireAt) {
    return res.status(400).json({ error: "expireAt is required" });
  }
}