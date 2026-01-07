const form = document.getElementById("dnsForm");
const resultDiv = document.getElementById("result");
const counterEl = document.getElementById("counter");
const detailsPre = document.getElementById("details");

function normalizeDomain(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
}

async function trackDomain(domain) {
  const res = await fetch("/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain })
  });
  return res.json();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  resultDiv.classList.add("hidden");
  detailsPre.classList.add("hidden");
  counterEl.classList.add("hidden");

  const raw = document.getElementById("domain").value;
  const domain = normalizeDomain(raw);

  resultDiv.textContent = "Checking DNS…";
  resultDiv.classList.remove("hidden");

  try {
    // Track the check (backend)
    const tracking = await trackDomain(domain);

    // DNS lookup
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`,
      { headers: { accept: "application/dns-json" } }
    );

    const data = await response.json();

    if (data.Answer && data.Answer.length > 0) {
      resultDiv.textContent =
        "❌ No. Surprisingly, it’s not DNS.\n\n" +
        `This domain has been checked ${tracking.domainCount.toLocaleString()} times.`;
    } else {
      resultDiv.textContent =
        "✅ Yes. It’s DNS.\n\n" +
        `This domain has been checked ${tracking.domainCount.toLocaleString()} times.`;
    }

    counterEl.textContent =
      `Total DNS mistakes confirmed: ${tracking.totalChecks.toLocaleString()}`;
    counterEl.classList.remove("hidden");

    detailsPre.textContent = JSON.stringify(data, null, 2);
    detailsPre.classList.remove("hidden");

  } catch (err) {
    resultDiv.textContent =
      "🔥 Yes. It’s DNS.\n\n(And something else is on fire.)";
    detailsPre.textContent = err.toString();
    detailsPre.classList.remove("hidden");
  }
});
