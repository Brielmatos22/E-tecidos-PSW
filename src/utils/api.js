const API_BASE = "/api";
const CACHE_PREFIX = "e-tecidos:cache:v2:";

export function getCached(collection) {
  if (typeof window === "undefined") return null;

  try {
    const cached = window.localStorage.getItem(`${CACHE_PREFIX}${collection}`);
    return cached === null ? null : JSON.parse(cached);
  } catch {
    return null;
  }
}

function setCached(collection, records) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(`${CACHE_PREFIX}${collection}`, JSON.stringify(records));
  } catch {
    return;
  }
}

function updateCached(collection, update) {
  const records = getCached(collection);
  if (Array.isArray(records)) setCached(collection, update(records));
}

async function request(collection, { id, method = "GET", data } = {}) {
  const resource = id === undefined ? collection : `${collection}/${encodeURIComponent(id)}`;
  const response = await fetch(`${API_BASE}/${resource}`, {
    method,
    headers: data === undefined ? undefined : { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const responseBody = await response.text();
  const result = responseBody ? JSON.parse(responseBody) : null;

  if (!response.ok) {
    throw new Error(result?.message ?? `Falha ao acessar ${collection} (${response.status}).`);
  }

  return result;
}

export const api = {
  async list(collection) {
    const records = await request(collection);
    setCached(collection, records);
    return records;
  },
  async create(collection, data) {
    const created = await request(collection, { method: "POST", data });
    updateCached(collection, (records) => [created, ...records.filter((record) => record.id !== created.id)]);
    return created;
  },
  async update(collection, id, data) {
    const updated = await request(collection, { id, method: "PUT", data });
    updateCached(collection, (records) => records.map((record) => (record.id === id ? updated : record)));
    return updated;
  },
  async patch(collection, id, data) {
    const updated = await request(collection, { id, method: "PATCH", data });
    updateCached(collection, (records) => records.map((record) => (record.id === id ? updated : record)));
    return updated;
  },
  async remove(collection, id) {
    const removed = await request(collection, { id, method: "DELETE" });
    updateCached(collection, (records) => records.filter((record) => record.id !== id));
    return removed;
  },
};