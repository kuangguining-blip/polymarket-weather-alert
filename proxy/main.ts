// Polymarket Gamma API CORS Proxy
// Deno Deploy - 免费、永久在线、无需服务器

const TARGET = "https://gamma-api.polymarket.com";

Deno.serve(async (req: Request): Promise<Response> => {
  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  // 拼接目标 URL
  const url = new URL(req.url);
  const targetUrl = TARGET + url.pathname + url.search;

  // 转发请求
  const resp = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Accept": "application/json",
      "User-Agent": "Polymarket-Proxy/1.0",
    },
  });

  // 返回带 CORS 头的响应
  const respHeaders = new Headers(resp.headers);
  respHeaders.set("Access-Control-Allow-Origin", "*");
  respHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  respHeaders.set("Access-Control-Allow-Headers", "*");
  respHeaders.set("Access-Control-Max-Age", "86400");

  return new Response(resp.body, {
    status: resp.status,
    headers: respHeaders,
  });
});

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400",
  };
}
