const catsDisplay = document.querySelector("#cats");
const rateDisplay = document.querySelector("#rate");
const shopItemsElement = document.querySelector("#shop-items");
const gatherButton = document.querySelector("#gather-button");

const items = window.shopItems;
const itemDisplays = [];
let cats = 0;

// Total production is the rate for each item multiplied by how many are owned.
function getCatsPerSecond() {
  return items.reduce((total, item) => total + item.production * item.owned, 0);
}

function render() {
  // Avoid displaying one less after small floating-point production ticks.
  catsDisplay.textContent = Math.floor(cats + Number.EPSILON);
  rateDisplay.textContent = getCatsPerSecond();

  for (const display of itemDisplays) {
    display.button.disabled = cats < display.item.cost;
    display.button.textContent = `${display.item.name}: ${display.item.cost} cats`;
    display.owned.textContent = ` (owned: ${display.item.owned})`;
  }
}

function buyItem(item) {
  if (cats < item.cost) return;

  cats -= item.cost;
  item.owned += 1;
  item.cost = Math.ceil(item.cost * 1.5);
}

// Make one shop row for every item in items.js.
for (const item of items) {
  const row = document.createElement("p");
  const button = document.createElement("button");
  const owned = document.createElement("span");

  button.type = "button";
  button.addEventListener("click", () => {
    buyItem(item);
    render();
  });

  row.append(button, owned);
  shopItemsElement.append(row);
  itemDisplays.push({ item, button, owned });
}

gatherButton.addEventListener("click", () => {
  cats += 1;
  render();
});

// Add a small amount each tick based on the time passed.
const tickMilliseconds = 100;
setInterval(() => {
  cats += getCatsPerSecond() * (tickMilliseconds / 1000);
  render();
}, tickMilliseconds);

render();// Connect player input and the idle timer to the game rules and display.
