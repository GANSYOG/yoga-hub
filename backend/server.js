/* Yoga Hub Lead API — admin-ready Express stub.
   Run: npm i express cors helmet express-rate-limit zod dotenv
        node backend/server.js
   Frontend POSTs here; falls back to localStorage when offline. */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");
const path = require("path");

const app = express();
app.use(helmet({ contentSecurityPolicy: false })); app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));

app.use(express.json({ limit: "32kb" }));
app.use("/api/", rateLimit({ windowMs: 60_000, max: 30 }));

const Lead = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(10).max(15),
  email: z.string().email().optional().or(z.literal("")),
  program: z.string().min(2).max(60),
  time: z.string().max(40).optional(),
  message: z.string().max(1000).optional(),
  source: z.string().max(40).optional()
});
const leads = []; // swap for Prisma: prisma.lead.create({data})

app.post("/api/leads", (req, res) => {
  const p = Lead.safeParse(req.body);
  if (!p.success) return res.status(400).json({ ok: false, errors: p.error.flatten() });
  const lead = { id: "lead_" + Date.now(), status: "NEW", created_at: new Date().toISOString(), ...p.data };
  leads.push(lead);
  console.log("[lead]", lead.id, lead.name, lead.phone, lead.program);
  res.json({ ok: true, id: lead.id, message: "Thank you! Our Yoga Hub team will contact you shortly." });
});
app.get("/api/leads", (req, res) => {
  if (!process.env.ADMIN_KEY || req.headers["x-admin-key"] !== process.env.ADMIN_KEY) return res.status(401).json({ ok: false });
  res.json({ ok: true, leads });
});
app.get("/api/health", (_, res) => res.json({ ok: true }));
const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Yoga Hub API on :" + port));
