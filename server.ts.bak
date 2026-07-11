import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");
const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

const defaultSettings = {
  storeName: "بيتك ديكور • HOME DECOR",
  storeLogo: "/uploads/uploaded_1783728842800_snufn.jpg",
  productName: "طاولة ميني MDF الأنيقة",
  price: 199,
  originalPrice: 299,
  whatsappNumber: "212600000000",
  image_natural: "/src/assets/images/table_colors_1783722948300.jpg",
  image_dark: "/src/assets/images/hero_table_1783722935630.jpg",
  image_white: "/src/assets/images/table_utility_1783722963162.jpg",
  image_hero: "/src/assets/images/regenerated_image_1783728041366.png",
  image_features: "/src/assets/images/regenerated_image_1783728417810.png",
  image_dimensions: "/src/assets/images/table_dimensions_1783724171797.jpg"
};

// Ensure data folder and file exists
let memorySettings: any = null;
let memoryLeads: any[] = [];
let leadsLoaded = false;

const ensureLeadsFile = () => {
  try {
    const dir = path.dirname(LEADS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), "utf8");
    }
  } catch (err) {
    console.warn("Could not ensure leads file (this is expected on serverless like Vercel):", err);
  }
};

const ensureSettingsFile = () => {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), "utf8");
    }
  } catch (err) {
    console.warn("Could not ensure settings file (this is expected on serverless like Vercel):", err);
  }
};

const getSettingsData = () => {
  if (memorySettings) return memorySettings;
  try {
    ensureSettingsFile();
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf8");
      memorySettings = JSON.parse(data);
      return memorySettings;
    }
  } catch (err) {
    console.warn("Using default settings as fallback:", err);
  }
  memorySettings = { ...defaultSettings };
  return memorySettings;
};

const saveSettingsData = (settings: any) => {
  memorySettings = settings;
  try {
    ensureSettingsFile();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not save settings to file system (normal on Vercel):", err);
  }
};

const getLeadsData = (): any[] => {
  if (leadsLoaded) return memoryLeads;
  try {
    ensureLeadsFile();
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, "utf8");
      memoryLeads = JSON.parse(data);
      leadsLoaded = true;
      return memoryLeads;
    }
  } catch (err) {
    console.warn("Could not read leads from file system:", err);
  }
  leadsLoaded = true;
  return memoryLeads;
};

const saveLeadsData = (leads: any[]) => {
  memoryLeads = leads;
  try {
    ensureLeadsFile();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not save leads to file system (normal on Vercel):", err);
  }
};

app.use(express.json({ limit: "15mb" }));

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
// Ensure uploads directory exists
const ensureUploadsDir = () => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not ensure uploads directory (normal on Vercel):", err);
  }
};
ensureUploadsDir();

app.use("/uploads", express.static(UPLOADS_DIR));

// API route to handle base64 image uploads from the Merchant Dashboard
app.post("/api/upload", (req: express.Request, res: express.Response) => {
  try {
    ensureUploadsDir();
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "لا توجد صورة مرفوعة" });
    }

    // Match base64 regex pattern
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "صيغة الصورة غير صالحة. يرجى اختيار ملف صورة حقيقي." });
    }

    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    // Get appropriate extension
    let ext = 'jpg';
    if (type.includes('png')) ext = 'png';
    else if (type.includes('webp')) ext = 'webp';
    else if (type.includes('gif')) ext = 'gif';

    const filename = `uploaded_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    try {
      fs.writeFileSync(filePath, buffer);
    } catch (writeErr) {
      console.error("Write error (expected on read-only serverless):", writeErr);
    }

    res.json({
      success: true,
      url: `/uploads/${filename}`
    });
  } catch (err: any) {
    console.error("Error handling file upload:", err);
    res.status(500).json({ error: "فشل حفظ الملف على السيرفر" });
  }
});

// API route to get product settings
app.get("/api/settings", (req: express.Request, res: express.Response) => {
  try {
    res.json(getSettingsData());
  } catch (err) {
    res.status(500).json({ error: "فشل تحميل إعدادات المنتج" });
  }
});

// API route to save/update product settings
app.post("/api/settings", (req: express.Request, res: express.Response) => {
  try {
    const currentSettings = getSettingsData();
    const updatedSettings = {
      ...currentSettings,
      ...req.body
    };
    
    // Ensure numbers are stored as numbers
    if (updatedSettings.price !== undefined) updatedSettings.price = Number(updatedSettings.price);
    if (updatedSettings.originalPrice !== undefined) updatedSettings.originalPrice = Number(updatedSettings.originalPrice);

    saveSettingsData(updatedSettings);
    res.json({ success: true, settings: updatedSettings });
  } catch (err) {
    res.status(500).json({ error: "فشل حفظ إعدادات المنتج" });
  }
});

// API route to submit a lead
app.post("/api/leads", (req: express.Request, res: express.Response) => {
  try {
    const { name, phone, city, address, quantity, tableType, notes } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "الاسم ورقم الهاتف مطلوبين" });
    }

    const leads = getLeadsData();

    const newLead = {
      id: Date.now().toString(),
      name,
      phone,
      city: city || "غير محدد",
      address: address || "",
      quantity: Number(quantity) || 1,
      tableType: tableType || "طاولة MDF صغيرة",
      notes: notes || "",
      status: "جديد", // "جديد" (new), "تم الاتصال" (contacted), "مؤكد" (confirmed), "ملغي" (cancelled)
      createdAt: new Date().toISOString(),
    };

    leads.push(newLead);
    saveLeadsData(leads);

    res.status(201).json({ success: true, lead: newLead });
  } catch (err: any) {
    console.error("Error saving lead:", err);
    res.status(500).json({ error: "فشل حفظ المعلومات. حاول مرة أخرى." });
  }
});

// API route to get leads (for admin panel)
app.get("/api/leads", (req: express.Request, res: express.Response) => {
  try {
    const leads = getLeadsData();
    // Sort by newest first
    const sortedLeads = [...leads].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(sortedLeads);
  } catch (err) {
    res.status(500).json({ error: "فشل تحميل البيانات" });
  }
});

// API route to update lead status
app.patch("/api/leads/:id", (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leads = getLeadsData();

    const index = leads.findIndex((l: any) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Lead not found" });
    }

    leads[index].status = status;
    saveLeadsData(leads);

    res.json({ success: true, lead: leads[index] });
  } catch (err) {
    res.status(500).json({ error: "Error updating lead" });
  }
});

// API route to delete lead
app.delete("/api/leads/:id", (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const leads = getLeadsData();
    const filtered = leads.filter((l: any) => l.id !== id);
    saveLeadsData(filtered);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error deleting lead" });
  }
});

// Setup Vite or static serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
}

start();

export default app;
