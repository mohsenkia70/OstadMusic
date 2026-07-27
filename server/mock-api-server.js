/**
 * Mock of the real /api/v1/auth/login endpoint, matching the exact request/response
 * shape provided by the user, used ONLY to verify lib/api/client.ts + auth-store.ts
 * talk to a server with this contract correctly. Not the user's real backend.
 */
const http = require("http");

const VALID_EMAIL = "mohsenkia70@gmail.com";
const VALID_PASSWORD = "Adm@in123";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/v1/auth/login") {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Invalid request body" }));
        return;
      }

      if (body.emailOrPhone === VALID_EMAIL && body.password === VALID_PASSWORD) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            userId: "a6957e27-58bd-4cc3-8717-1b2d973c79ac",
            firstName: "محسن",
            lastName: "ابراهیمی کیا",
            role: "Teacher",
            accessToken: "mock.jwt.token",
            expiresAtUtc: new Date(Date.now() + 3600_000).toISOString(),
          })
        );
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Unauthorized", message: "Invalid credentials" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Not found" }));
});

const PORT = process.env.MOCK_API_PORT ? Number(process.env.MOCK_API_PORT) : 4002;
server.listen(PORT, () => console.log(`[mock-api] listening on http://localhost:${PORT}`));
