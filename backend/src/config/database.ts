import fs from 'fs';
import path from 'path';
import { DatabaseSchema } from '../types.js';

const BACKEND_ROOT = fs.existsSync(path.resolve(process.cwd(), 'data')) || fs.existsSync(path.resolve(process.cwd(), 'src'))
  ? process.cwd()
  : path.resolve(process.cwd(), 'backend');
const DATA_DIR = path.resolve(BACKEND_ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const defaultDbState: DatabaseSchema = {
  users: [],
  products: [],
  orders: [],
  customCakes: [],
  offers: []
};

// In-memory cache for speed with disk sync
let cachedDb: DatabaseSchema | null = null;

export function initStorage(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDbState, null, 2), 'utf-8');
    cachedDb = { ...defaultDbState };
  } else {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDb = JSON.parse(raw) as DatabaseSchema;
      // Guarantee all collections exist
      cachedDb.users = cachedDb.users || [];
      cachedDb.products = cachedDb.products || [];
      cachedDb.orders = cachedDb.orders || [];
      cachedDb.customCakes = cachedDb.customCakes || [];
      cachedDb.offers = cachedDb.offers || [];
    } catch (err) {
      console.error('Error reading database file, resetting to defaults:', err);
      cachedDb = { ...defaultDbState };
      fs.writeFileSync(DB_FILE, JSON.stringify(cachedDb, null, 2), 'utf-8');
    }
  }

  return cachedDb;
}

export function getDb(): DatabaseSchema {
  if (!cachedDb) {
    return initStorage();
  }
  return cachedDb;
}

export function saveDb(data: DatabaseSchema): void {
  cachedDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Atomic write to prevent file corruption
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database:', err);
  }
}
