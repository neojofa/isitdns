const form = document.getElementById("dnsForm");
const resultDiv = document.getElementById("result");
const detailsPre = document.getElementById("details");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const domain = document.getElementById("domain").value.trim();
  resultDiv.classList.add("hidden");
  detailsPre.classList.add("hidden");

  resultDiv.textContent = "Checking DNS…";
  resultDiv.classList.remove("hidden");

  try {
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`,
      {
        headers: {
          "accept": "application/dns-json"
        }
      }
    );

    const data = await response.json();

    if (data.Answer && data.Answer.length > 0) {
      resultDiv.textContent = "❌ No. Surprisingly, it’s not DNS.";
    } else {
      resultDiv.textContent = "✅ Yes. It’s DNS.";
    }

    detailsPre.textContent = JSON.stringify(data, null, 2);
    detailsPre.classList.remove("hidden");

  } catch (err) {
    resultDiv.textContent = "🔥 Yes. It’s DNS (and something else is on fire).";
    detailsPre.textContent = err.toString();
    detailsPre.classList.remove("hidden");
  }
});
