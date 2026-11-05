const API_BASE = "/api";
const CACHE_PREFIX = "e-tecidos:cache:v2:";
const SESSION_KEY = "e-tecidos:session:v1";
const SESSION_REFRESHED_EVENT = "e-tecidos:session-refreshed";
const SESSION_EXPIRED_EVENT = "e-tecidos:session-expired";

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

function saveRefreshedToken(session, token) {
  if (!session?.token || session.token === token) return;

  const updatedSession = { ...session, token };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  window.dispatchEvent(new CustomEvent(SESSION_REFRESHED_EVENT, { detail: updatedSession }));
}

function expireSessionIfCurrent(session) {
  if (!session?.token || session.token !== getSession()?.token) return;

  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

function getAuthHeaders(session) {
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

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
  const session = getSession();
  const response = await fetch(`${API_BASE}/${resource}`, {
    method,
    headers: {
      ...getAuthHeaders(session),
      ...(data === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  if (response.status === 401) expireSessionIfCurrent(session);
  const refreshedToken = response.headers.get("X-Access-Token");
  if (refreshedToken && session?.token === getSession()?.token) {
    saveRefreshedToken(session, refreshedToken);
  }
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