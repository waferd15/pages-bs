console.log("Hi :D");

const API_KEY = "5fceb806-bc20-4fa1-807e-0570fad6062f";

const ITEMS = [
  { id: "enchanted_melon_block", name: "Enchanted Melon Block" },
  { id: "enchanted_pumpkin_block", name: "Enchanted Pumpkin Block" },
  { id: "polished_pumpkin", name: "Polished Pumpkin" }
];

function getPrediction(sellPrice, weeklyAvg, buyVol, sellVol) {
  if (sellPrice < weeklyAvg && sellVol <= buyVol) {
    return "Price might rise";
  }

  if (sellVol > buyVol) {
    return "Price might dip";
  }

  return "Stable";
}

const container = document.getElementById("container");

function loadData() {

  ITEMS.forEach(item => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="title">${item.name}</div>
      <div class="price" id="${item.id}-price">Loading...</div>
      <div class="prediction" id="${item.id}-pred">Loading...</div>
    `;

    container.appendChild(card);

  fetch(`https://cmc-bazaar-api.vercel.app/api/bazaar?item=${item.id}`), {
      headers: {
        "X-API-Key": API_KEY,
        "Accept": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {

      const sellPrice = data.sellTopEntries?.[0]?.price ?? 0;
      const weeklyAvg = data.weeklyAveragePrice ?? 0;
      const buyVol = data.buyVolume ?? 0;
      const sellVol = data.sellVolume ?? 0;

      const prediction = getPrediction(sellPrice, weeklyAvg, buyVol, sellVol);

      const priceEl = document.getElementById(`${item.id}-price`);
      const predEl = document.getElementById(`${item.id}-pred`);

      priceEl.innerText = `Sell: ${sellPrice} | Weekly Avg: ${weeklyAvg}`;
      predEl.innerText = prediction;

      predEl.className = "prediction";

      if (prediction.includes("up")) predEl.classList.add("up");
      else if (prediction.includes("down")) predEl.classList.add("down");
      else predEl.classList.add("stable");

    })
    .catch(err => {
      console.error(item.id, err);

      document.getElementById(`${item.id}-pred`).innerText =
        "Error loading data";
    });

  });
}

loadData();
