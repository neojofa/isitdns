export async function onRequestGet({ env }) {
  const list = await env.DATA.list({ prefix: "domain:" });

  const domains = [];

  for (const key of list.keys) {
    const count = await env.DATA.get(key.name);
    domains.push({
      domain: key.name.replace("domain:", ""),
      count: parseInt(count || "0", 10)
    });
  }

  domains.sort((a, b) => b.count - a.count);

  const totalRaw = await env.DATA.get("total_checks");

  return new Response(
    JSON.stringify({
      totalChecks: parseInt(totalRaw || "0", 10),
      topDomains: domains.slice(0, 10)
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );
}
