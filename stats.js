async function loadStats() {
  const res = await fetch("/stats");
  const data = await res.json();

  document.getElementById("total").textContent =
    data.totalChecks.toLocaleString();

  const list = document.getElementById("domainList");

  data.topDomains.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="rank">#${index + 1}</span>
      <span class="domain">${item.domain}</span>
      <span class="count">${item.count.toLocaleString()}</span>
    `;
    list.appendChild(li);
  });
}

loadStats();
