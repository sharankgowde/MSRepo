import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 8080);
const baseDir = "dist";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function safePath(urlPath) {
  const cleaned = urlPath.split("?")[0].split("#")[0];
  const normalized = normalize(cleaned).replace(/^([.][.][/\\])+/, "");
  return normalized === "/" ? "/index.html" : normalized;
}

const server = createServer(async (req, res) => {
  try {
    const requestPath = safePath(req.url || "/");
    const candidate = join(baseDir, requestPath);

    let filePath = candidate;
    try {
      await readFile(filePath);
    } catch {
      filePath = join(baseDir, "index.html");
    }

    const content = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable"
    });
    res.end(content);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  }
});

server.listen(port, () => {
  console.log(`Static server listening on ${port}`);
});
