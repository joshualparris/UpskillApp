import type { VercelRequest, VercelResponse } from "@vercel/node";

const blobPath = (householdId: string) => `upskillapp/${householdId}.json`;

const syncAvailable = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

const householdIdFromQuery = (req: VercelRequest) => {
  const raw = req.query.householdId;
  if (typeof raw !== "string" || !raw.trim()) return "parris-dubbo";
  return raw.trim().slice(0, 64);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const householdId = householdIdFromQuery(req);

  if (req.method === "GET") {
    if (!syncAvailable()) {
      return res.status(200).json({ sync: false, householdId, state: null });
    }

    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: blobPath(householdId), limit: 1 });
      if (!blobs.length) {
        return res.status(200).json({ sync: true, householdId, state: null });
      }
      const response = await fetch(blobs[0].url);
      if (!response.ok) {
        return res.status(200).json({ sync: true, householdId, state: null });
      }
      const state = await response.json();
      return res.status(200).json({ sync: true, householdId, state });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load state";
      return res.status(500).json({ sync: false, error: message });
    }
  }

  if (req.method === "PUT" || req.method === "POST") {
    if (!syncAvailable()) {
      return res.status(503).json({
        error: "Cloud sync is not configured. Data is saved in this browser only.",
        sync: false,
      });
    }

    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || typeof body !== "object") {
        return res.status(400).json({ error: "Invalid state payload" });
      }

      const { put } = await import("@vercel/blob");
      await put(blobPath(householdId), JSON.stringify(body), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
      });

      return res.status(200).json({ sync: true, householdId, savedAt: new Date().toISOString() });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save state";
      return res.status(500).json({ sync: false, error: message });
    }
  }

  res.setHeader("Allow", "GET, PUT, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
