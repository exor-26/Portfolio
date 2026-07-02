const fs = require("fs");
const http = require("http");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.resolve(__dirname, "..");
const FUNCTIONS_DIR = path.join(ROOT, "functions");
const PORT = Number(process.env.PORT || 8888);

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function lowerHeaders(headers) {
  return Object.entries(headers || {}).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] = Array.isArray(value) ? value.join(", ") : value;
    return acc;
  }, {});
}

function queryParams(searchParams) {
  const result = {};
  for (const [key, value] of searchParams.entries()) {
    result[key] = value;
  }
  return result;
}

function clearFunctionCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(FUNCTIONS_DIR) && !key.includes(`${path.sep}node_modules${path.sep}`)) {
      delete require.cache[key];
    }
  }
}

async function handleApi(req, res, url) {
  const functionName = url.pathname.replace(/^\/api\/?/, "").split("/")[0];
  const functionPath = path.join(FUNCTIONS_DIR, `${functionName}.js`);

  if (!functionName || !fs.existsSync(functionPath)) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: false, reason: "function_not_found" }));
    return;
  }

  const body = await readBody(req);
  clearFunctionCache();
  const mod = require(functionPath);
  const handler = mod.handler || mod.default;

  const event = {
    path: url.pathname,
    rawUrl: url.toString(),
    httpMethod: req.method,
    headers: lowerHeaders(req.headers),
    queryStringParameters: queryParams(url.searchParams),
    body: body || null,
    isBase64Encoded: false,
    requestContext: {
      identity: {
        sourceIp: req.socket.remoteAddress || "127.0.0.1"
      }
    }
  };

  const response = await handler(event, {});
  const headers = response.headers || {};
  res.writeHead(response.statusCode || 200, headers);
  res.end(response.body || "");
}

async function main() {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    root: ROOT,
    appType: "custom",
    server: {
      middlewareMode: true
    }
  });

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host || `localhost:${PORT}`}`);

      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url);
        return;
      }

      const shouldServeIndex =
        req.method === "GET" &&
        !url.pathname.startsWith("/src/") &&
        !url.pathname.startsWith("/@") &&
        !url.pathname.includes(".");

      if (shouldServeIndex) {
        const template = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
        const html = await vite.transformIndexHtml(url.pathname, template);
        res.writeHead(200, { "content-type": "text/html" });
        res.end(html);
        return;
      }

      vite.middlewares(req, res, () => {
        if (!res.writableEnded) {
          res.writeHead(404);
          res.end("Not found");
        }
      });
    } catch (error) {
      vite.ssrFixStacktrace?.(error);
      console.error(error);
      if (!res.writableEnded) {
        res.writeHead(500, { "content-type": "text/plain" });
        res.end(error.stack || error.message);
      }
    }
  });

  server.listen(PORT, () => {
    console.log(`Portfolio + course dev server: http://localhost:${PORT}`);
    console.log("Open the portfolio first, then click the Protected Course card.");
  });

  const shutdown = async () => {
    server.close();
    await vite.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
