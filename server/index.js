import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");

await loadLocalEnv();

const PORT = process.env.PORT || 4000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "dev-only-change-me";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const AUTH_COOKIE_NAME = "movies_auth";

const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

if (!process.env.AUTH_TOKEN_SECRET) {
  console.warn("AUTH_TOKEN_SECRET is not set. Using an unsafe development secret.");
}

async function loadLocalEnv() {
  try {
    const envFile = await fs.readFile(path.join(rootDir, ".env"), "utf8");
    for (const line of envFile.split(/\r?\n/)) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) continue;

      const separatorIndex = trimmedLine.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine.slice(separatorIndex + 1).trim();
      if (key && process.env[key] === undefined) {
        process.env[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // Environment variables can also be supplied by Docker, the shell, or hosting.
  }
}

async function ensureDataStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(usersFile);
  } catch {
    await fs.writeFile(usersFile, "[]\n");
  }
}

async function readUsers() {
  await ensureDataStore();
  const rawUsers = await fs.readFile(usersFile, "utf8");
  return JSON.parse(rawUsers);
}

async function writeUsers(users) {
  await ensureDataStore();
  await fs.writeFile(usersFile, `${JSON.stringify(users, null, 2)}\n`);
}

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(value).digest("base64url");
}

function createToken(user) {
  const payload = base64Url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    })
  );

  return `${payload}.${sign(payload)}`;
}

function parseCookies(req) {
  return (req.headers.cookie || "").split(";").reduce((cookies, cookie) => {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (!name) return cookies;
    cookies[name] = decodeURIComponent(valueParts.join("="));
    return cookies;
  }, {});
}

function setAuthCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${TOKEN_TTL_SECONDS}`
  );
}

function clearAuthCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
  );
}

function verifyToken(token) {
  if (!token || !token.includes(".")) return null;

  const [payload, signature] = token.split(".");
  const expectedSignature = sign(payload);
  if (signature.length !== expectedSignature.length) return null;

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return null;
  }

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null;

  return decoded;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(password, salt, 310000, 32, "sha256")
    .toString("hex");

  return `${salt}:${hash}`;
}

function isPasswordValid(password, storedHash) {
  const [salt, hash] = storedHash.split(":");
  const candidateHash = hashPassword(password, salt).split(":")[1];

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(candidateHash));
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (!origin || origin === CLIENT_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", origin || CLIENT_ORIGIN);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { message });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON body.");
    error.statusCode = 400;
    throw error;
  }
}

async function getCurrentUser(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : parseCookies(req)[AUTH_COOKIE_NAME];
  const payload = verifyToken(token);
  if (!payload) return null;

  const users = await readUsers();
  return users.find((user) => user.id === payload.sub) || null;
}

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username || user.email,
    name: user.name,
    avatar: user.avatar || "",
  };
}

function normalizeUsername(username) {
  return username?.trim().toLowerCase();
}

function validateUsername(username) {
  if (!username || !/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    return "Username must be 3-24 characters and use only letters, numbers, or underscores.";
  }

  return null;
}

function validateCredentials(email, username, password) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address.";
  }

  const usernameError = validateUsername(username);
  if (usernameError) return usernameError;

  if (!password || password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null;
}

async function handleAuth(req, res, pathname) {
  if (req.method === "POST" && pathname === "/api/auth/signup") {
    const { email, password, name, username } = await readBody(req);
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedUsername = normalizeUsername(username || name);
    const validationError = validateCredentials(
      normalizedEmail,
      normalizedUsername,
      password
    );
    if (validationError) return sendError(res, 400, validationError);

    const users = await readUsers();
    if (users.some((user) => user.email === normalizedEmail)) {
      return sendError(res, 409, "An account with this email already exists.");
    }
    if (users.some((user) => user.username === normalizedUsername)) {
      return sendError(res, 409, "This username is already taken.");
    }

    const user = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      username: normalizedUsername,
      name: name?.trim() || normalizedUsername,
      avatar: "",
      passwordHash: hashPassword(password),
      favorites: [],
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    await writeUsers(users);
    setAuthCookie(res, createToken(user));

    return sendJson(res, 201, {
      user: serializeUser(user),
    });
  }

  if (req.method === "POST" && pathname === "/api/auth/signin") {
    const { username, password } = await readBody(req);
    const normalizedUsername = normalizeUsername(username);
    const usernameError = validateUsername(normalizedUsername);
    if (usernameError) return sendError(res, 400, usernameError);
    if (!password || password.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters.");
    }

    const users = await readUsers();
    const user = users.find(
      (candidate) =>
        candidate.username === normalizedUsername ||
        (!candidate.username && candidate.email === normalizedUsername)
    );
    if (!user || !isPasswordValid(password, user.passwordHash)) {
      return sendError(res, 401, "Username or password is incorrect.");
    }

    if (!user.username) user.username = normalizeUsername(user.name || user.email);
    await writeUsers(users);
    setAuthCookie(res, createToken(user));

    return sendJson(res, 200, {
      user: serializeUser(user),
    });
  }

  if (req.method === "POST" && pathname === "/api/auth/logout") {
    clearAuthCookie(res);
    return sendJson(res, 200, { message: "Logged out successfully." });
  }

  if (req.method === "POST" && pathname === "/api/auth/forgot-password") {
    const { email } = await readBody(req);
    const normalizedEmail = email?.trim().toLowerCase();
    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.email === normalizedEmail);

    if (userIndex !== -1) {
      users[userIndex].passwordResetToken = crypto.randomBytes(24).toString("hex");
      users[userIndex].passwordResetExpiresAt = new Date(
        Date.now() + 1000 * 60 * 30
      ).toISOString();
      await writeUsers(users);
      console.log(
        `Password recovery requested for ${normalizedEmail}. Reset token: ${users[userIndex].passwordResetToken}`
      );
    }

    return sendJson(res, 200, {
      message: "If an account exists for this email, recovery instructions were sent.",
    });
  }

  if (req.method === "GET" && pathname === "/api/auth/me") {
    const user = await getCurrentUser(req);
    if (!user) return sendError(res, 401, "Authentication is required.");

    return sendJson(res, 200, { user: serializeUser(user) });
  }

  if (req.method === "PATCH" && pathname === "/api/auth/profile") {
    const currentUser = await getCurrentUser(req);
    if (!currentUser) return sendError(res, 401, "Authentication is required.");

    const { name, avatar } = await readBody(req);
    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.id === currentUser.id);
    if (userIndex === -1) return sendError(res, 401, "Authentication is required.");

    if (name !== undefined) users[userIndex].name = name.trim() || users[userIndex].name;
    if (avatar !== undefined) {
      if (avatar && !avatar.startsWith("data:image/")) {
        return sendError(res, 400, "Profile picture must be an image.");
      }
      if (avatar && avatar.length > 700000) {
        return sendError(res, 400, "Profile picture is too large.");
      }
      users[userIndex].avatar = avatar;
    }

    await writeUsers(users);
    return sendJson(res, 200, { user: serializeUser(users[userIndex]) });
  }

  return false;
}

async function fetchTmdb(pathname, searchParams) {
  if (!TMDB_API_KEY) {
    const error = new Error("TMDB_API_KEY is not configured on the server.");
    error.statusCode = 500;
    throw error;
  }

  const params = new URLSearchParams(searchParams);
  params.set("api_key", TMDB_API_KEY);

  const response = await fetch(`https://api.themoviedb.org/3${pathname}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.status_message || "Movie API request failed.");
    error.statusCode = response.status;
    throw error;
  }

  return data;
}

async function handleMovies(req, res, pathname, searchParams) {
  if (req.method === "GET" && pathname === "/api/movies/popular") {
    const data = await fetchTmdb("/movie/popular", searchParams);
    return sendJson(res, 200, { results: data.results || [] });
  }

  if (req.method === "GET" && pathname === "/api/movies/search") {
    const query = searchParams.get("query")?.trim();
    if (!query) return sendError(res, 400, "Search query is required.");

    const data = await fetchTmdb("/search/movie", searchParams);
    return sendJson(res, 200, { results: data.results || [] });
  }

  return false;
}

async function handleFavorites(req, res, pathname) {
  const user = await getCurrentUser(req);
  if (!user) return sendError(res, 401, "Authentication is required.");

  const users = await readUsers();
  const userIndex = users.findIndex((candidate) => candidate.id === user.id);
  if (userIndex === -1) return sendError(res, 401, "Authentication is required.");

  if (req.method === "GET" && pathname === "/api/favorites") {
    return sendJson(res, 200, { favorites: users[userIndex].favorites || [] });
  }

  if (req.method === "POST" && pathname === "/api/favorites") {
    const movie = await readBody(req);
    if (!movie?.id || !movie?.title) {
      return sendError(res, 400, "A valid movie is required.");
    }

    const favorites = users[userIndex].favorites || [];
    if (!favorites.some((favorite) => favorite.id === movie.id)) {
      users[userIndex].favorites = [...favorites, movie];
      await writeUsers(users);
    }

    return sendJson(res, 200, { favorites: users[userIndex].favorites });
  }

  const favoriteMatch = pathname.match(/^\/api\/favorites\/([^/]+)$/);
  if (req.method === "DELETE" && favoriteMatch) {
    const movieId = Number(favoriteMatch[1]);
    users[userIndex].favorites = (users[userIndex].favorites || []).filter(
      (movie) => movie.id !== movieId
    );
    await writeUsers(users);

    return sendJson(res, 200, { favorites: users[userIndex].favorites });
  }

  return false;
}

async function serveStatic(req, res, pathname) {
  const appPathname = pathname.startsWith("/Movies-app")
    ? pathname.slice("/Movies-app".length) || "/"
    : pathname;
  const requestedPath = appPathname === "/" ? "/index.html" : appPathname;
  const normalizedPath = path.normalize(decodeURIComponent(requestedPath));
  const filePath = path.join(distDir, normalizedPath);

  if (!filePath.startsWith(distDir)) {
    return sendError(res, 400, "Invalid file path.");
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(file);
  } catch {
    const indexFile = await fs.readFile(path.join(distDir, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(indexFile);
  }
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { pathname, searchParams } = url;

    if (pathname.startsWith("/api/auth")) {
      const handled = await handleAuth(req, res, pathname);
      if (handled !== false) return;
    }

    if (pathname.startsWith("/api/movies")) {
      const handled = await handleMovies(req, res, pathname, searchParams);
      if (handled !== false) return;
    }

    if (pathname.startsWith("/api/favorites")) {
      const handled = await handleFavorites(req, res, pathname);
      if (handled !== false) return;
    }

    if (pathname.startsWith("/api")) {
      return sendError(res, 404, "API route not found.");
    }

    return serveStatic(req, res, pathname);
  } catch (error) {
    console.error(error);
    sendError(res, error.statusCode || 500, error.message || "Server error.");
  }
});

server.listen(PORT, () => {
  console.log(`Movies app server is running on port ${PORT}`);
});
