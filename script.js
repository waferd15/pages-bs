console.log("Hi :D");

const API_URL = "https://cmc-bazaar-api.vercel.app/api/bazaar?item=";

/* ----------------
   ITEM STRUCTURE
-------------------*/
const DATA = {
  farming: {
    label: "Farming",
    sections: {
      crops: {
        label: "Crops",
        bundles: {
          Melon: ["melon_slice", "melon_block", "enchanted_melon", "enchanted_melon_block"],
          Pumpkin: ["pumpkin", "enchanted_pumpkin", "enchanted_pumpkin_block", "polished_pumpkin"],
          Carrot: ["carrot", "enchanted_carrot", "enchanted_golden_carrot"],
          Potato: ["potato", "enchanted_potato"],
          Wheat: ["wheat", "enchanted_wheat"],
          SugarCane: ["sugar_cane", "enchanted_sugar_cane"],
          Cactus: ["cactus", "enchanted_cactus"],
        }
      }
    }
  },

  mining: {
    label: "Mining",
    sections: {
      coal: {
        label: "Coal",
        bundles: {
          Coal: ["coal", "enchanted_coal", "enchanted_coal_block"]
        }
      }
    }
  },

  oddities: {
    label: "Oddities",
    sections: {
      minion_upgrades: {
        label: "Minion Upgrades",
        bundles: {
          Upgrades: [
            "diamond_spreading",
            "auto_smelter",
            "super_compactor_3000",
            "budget_hopper",
            "enchanted_hopper",
            "hamster_wheel"
          ]
        }
      },

      enchanting: {
        label: "Enchanting",
        bundles: {
          XP: [
            "experience_bottle",
            "grand_experience_bottle",
            "colossal_experience_bottle",
            "titanic_experience_bottle"
          ]
        }
      },

      pet_candy: {
        label: "Pet Candy",
        bundles: {
          Candy: [
            "simple_beetroot_candy",
            "great_beetroot_candy",
            "superb_beetroot_candy",
            "ultimate_beetroot_candy"
          ]
        }
      }
    }
  }
};

/* ----------
   UI STATE
-------------*/
const state = {
  category: "farming",
  section: "crops",
  search: ""
};

const elBoard = document.getElementById("board");
const elCat = document.getElementById("category-tabs");
const elSub = document.getElementById("subcategory-tabs");
const elSearch = document.getElementById("search");

/* ---------------------------
   NAME FORMATTER
----------------------------*/
function nice(id) {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

/* ---------------------------
   PREDICTION LOGIC
----------------------------*/
function predict(sell, avg, buyVol, sellVol) {
  if (sell < avg && sellVol <= buyVol) return "Price might rise";
  if (sellVol > buyVol) return "Price might dip";
  return "Stable";
}

/* ---------------------------
   FETCH ITEM DATA
----------------------------*/
function loadItem(item, priceEl, predEl) {
  fetch(API_URL + item)
    .then(r => r.json())
    .then(data => {
      const sell = data.sellTopEntries?.[0]?.price ?? 0;
      const avg = data.weeklyAveragePrice ?? 0;
      const buy = data.buyVolume ?? 0;
      const sellV = data.sellVolume ?? 0;

      const p = predict(sell, avg, buy, sellV);

      priceEl.innerText = `Sell: ${sell} | Avg: ${avg}`;
      predEl.innerText = p;

      predEl.className = "prediction " + (
        p.includes("rise") ? "up" :
        p.includes("dip") ? "down" : "stable"
      );
    })
    .catch(() => {
      predEl.innerText = "Error loading";
    });
}

/* -------
   RENDER
----------*/
function render() {
  const section = DATA[state.category].sections[state.section];

  elBoard.innerHTML = "";

  Object.entries(section.bundles).forEach(([bundleName, items]) => {

    const group = document.createElement("details");
    group.className = "group";
    group.open = true;

    const summary = document.createElement("summary");
    summary.innerText = bundleName;

    const inner = document.createElement("div");
    inner.className = "inner";

    items.forEach(id => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="title">${nice(id)}</div>
        <div class="price" id="${id}-price">Loading...</div>
        <div class="prediction" id="${id}-pred">Loading...</div>
      `;

      inner.appendChild(card);

      const priceEl = card.querySelector(`#${id}-price`);
      const predEl = card.querySelector(`#${id}-pred`);

      loadItem(id, priceEl, predEl);
    });

    group.appendChild(summary);
    group.appendChild(inner);
    elBoard.appendChild(group);
  });
}

render();
