export async function onRequestPost({ request, env }) {
  const body = await request.json();
  let domain = body.domain;

  if (!domain || typeof domain !== "string") {
    return new Response("Invalid domain", { status: 400 });
  }

  domain = domain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

  const totalKey = "total_checks";
  const domainKey = `domain:${domain}`;

  const [totalRaw, domainRaw] = await Promise.all([
    env.DATA.get(totalKey),
    env.DATA.get(domainKey)
  ]);

  const totalChecks = parseInt(totalRaw || "0", 10) + 1;
  const domainCount = parseInt(domainRaw || "0", 10) + 1;

  await Promise.all([
    env.DATA.put(totalKey, totalChecks.toString()),
    env.DATA.put(domainKey, domainCount.toString())
  ]);

  return new Response(
    JSON.stringify({
      domain,
      domainCount,
      totalChecks
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );
}
