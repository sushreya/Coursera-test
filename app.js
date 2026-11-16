/* Brand data.
   Ramps are the primary scales from the system's Primitives collection (light -> dark).
   `p` = index of the brand's primary step, `ink` = index used for dark text on tinted surfaces,
   `accent` = a secondary brand colour from the same collection / client style guide. */
const BRANDS = [
  { id: "unravel",  name: "Unravel",  mode: "01. Unravel",  p: 5, ink: 8, accent: "#FF7139",
    ramp: ["#ECEFFF","#DDE2FF","#98A7FF","#8185F8","#6767EB","#5239ED","#3D1EB8","#36118E","#200B41","#0C021C"] },
  { id: "dib",      name: "DIB",      mode: "02. DIB",      p: 5, ink: 8, accent: "#792027",
    ramp: ["#E8ECEB","#D0D8D7","#A1B2AE","#738B86","#44655D","#153E35","#11322A","#0D2520","#081915","#040C0B"] },
  { id: "tawuniya", name: "Tawuniya", mode: "03. Tawuniya", p: 4, ink: 6, accent: "#FDAC2B",
    ramp: ["#D6D1ED","#C4B5FB","#A691F9","#896CF7","#6B47F5","#5639C4","#34295E","#000000"] },
  { id: "amex",     name: "Amex",     mode: "04. Amex",     p: 5, ink: 8, accent: "#66A9E2",
    ramp: ["#E5F1FA","#CCE2F5","#99C5EC","#66A9E2","#338CD9","#006FCF","#0059A6","#00437C","#002C53","#001629"] },
  { id: "enbdx",    name: "ENBDX",    mode: "05. ENBDX",    p: 5, ink: 8, accent: "#2E83EA",
    ramp: ["#E5EDFF","#CCDBFF","#B2C8FF","#6692FF","#2765FF","#0049FF","#003BCC","#002FA3","#002580"] },
  { id: "etihad",   name: "Etihad",   mode: "06. Etihad",   p: 5, ink: 9, accent: "#00A1B2",
    ramp: ["#FEF9EE","#EDE2D0","#DEC39B","#C8AA7F","#B8935A","#B08747","#99753D","#826332","#6C5128","#56411F"] },
  { id: "smiles",   name: "Smiles",   mode: "07. Smiles",   p: 5, ink: 7, accent: "#CB91E3",
    ramp: ["#FDF2FD","#EED6F7","#DDB6EE","#CB91E3","#B66BD6","#8C42C6","#7432A7","#5E2689"] },
];

const CLIENTS = ["Etisalat","Tawuniya","Tawuniya Drive","Dubai Islamic Bank","UOB","Etihad Airways","ENBD X","More from ENBD","Emirates NBD","Amex","Barclays","Mastercard","SCB","KPN","Qatar National Bank","Magenta Moments","Scoot","Jumeirah","Capital One","ING"];

const COMPONENTS = {
  "Actions": ["Button","Radio & Checkbox","Controls & Selectors"],
  "Inputs": ["Text field","Dropdown","Date picker","Counter","Search"],
  "Navigation": ["System nav","Header","Tabs","Messages","Gallery pagination"],
  "Content": ["Cards","Modal","Badge","Tags","Avatar","Divider","Star rating"],
  "Feedback": ["Loaders","Skeleton"],
  "Utility": ["Overlay","Icons","Brand logos","Illustrations","Gradients"],
};

/* ---------- colour helpers ---------- */
const lum = hex => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

/* ---------- state ---------- */
let current = BRANDS[0];
try { const s = localStorage.getItem("brand"); if (s) current = BRANDS.find(b => b.id === s) || current; } catch (e) {}

const $ = id => document.getElementById(id);

function apply(brand) {
  current = brand;
  const r = brand.ramp, primary = r[brand.p], ink = r[brand.ink];
  // semantic rule: text on the action colour is white unless that fails WCAG AA (4.5:1)
  const onBrand = contrast("#FFFFFF", primary) >= 4.5 ? "#FFFFFF" : ink;
  const root = document.documentElement.style;
  root.setProperty("--brand", primary);
  root.setProperty("--brand-hover", r[brand.p + 1]);
  root.setProperty("--brand-soft", r[0]);
  root.setProperty("--brand-accent", brand.accent);
  root.setProperty("--brand-ink", ink);
  root.setProperty("--on-brand", onBrand);
  try { localStorage.setItem("brand", brand.id); } catch (e) {}

  document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.id === brand.id)));
  renderExplorer(brand, primary, onBrand);
}

/* ---------- switcher ---------- */
function buildSwitcher() {
  const wrap = $("brandButtons");
  BRANDS.forEach(b => {
    const el = document.createElement("button");
    el.className = "chip"; el.dataset.id = b.id; el.type = "button";
    el.setAttribute("aria-pressed", "false");
    el.style.setProperty("--c", b.ramp[b.p]);
    el.innerHTML = `<i></i>${b.name}`;
    el.addEventListener("click", () => apply(b));
    wrap.appendChild(el);
  });
}

/* ---------- token explorer ---------- */
function renderExplorer(b, primary, onBrand) {
  const r = b.ramp;
  $("exBrand").textContent = b.name;
  $("exMode").textContent = "Mode: " + b.mode;
  $("exRamp").innerHTML = r.map((h, i) => `<div class="${i === b.p ? "is-primary" : ""}" style="background:${h}" title="${h}"></div>`).join("");
  const step = i => (i === 0 ? "50" : String(i * 100));
  const rows = [
    ["action/primary", `brand/primary/${step(b.p)}`, primary, "Buttons, toggles, active tabs"],
    ["action/primary-hover", `brand/primary/${step(b.p + 1)}`, r[b.p + 1], "Pressed and hover states"],
    ["surface/brand-subtle", `brand/primary/${step(0)}`, r[0], "Tinted backgrounds"],
    ["text/brand", `brand/primary/${step(b.ink)}`, r[b.ink], "Brand text on tinted surfaces"],
    ["text/on-action", onBrand === "#FFFFFF" ? "neutral/white" : `brand/primary/${step(b.ink)}`, onBrand,
      onBrand === "#FFFFFF" ? "White passes contrast on this brand" : "Flips to dark: white would fail contrast on this brand"],
  ];
  $("exRows").innerHTML = rows.map(([t, p, h, why]) =>
    `<tr><td>${t}<span class="why">${why}</span></td><td class="mono">${p}</td><td><span class="sw-c" style="background:${h}"></span><span class="mono">${h.toUpperCase()}</span></td></tr>`).join("");
}

/* ---------- static content ---------- */
function buildWall() {
  $("clientWall").innerHTML = CLIENTS.map(n =>
    `<div class="doc"><b>${n}</b><i></i><i></i><i></i><i></i><div><span></span><span></span><span></span><span></span></div></div>`).join("");
}
function buildInventory() {
  $("inventory").innerHTML = Object.entries(COMPONENTS).map(([g, items]) =>
    `<div class="grp">${g}</div>` + items.map(i => `<span class="pill">${i}</span>`).join("")).join("");
}

/* ---------- demo interactions ---------- */
function wireDemo() {
  document.querySelectorAll("#tagRow .tagc").forEach(t => t.addEventListener("click", () => {
    const on = !t.classList.contains("is-on");
    t.classList.toggle("is-on", on); t.setAttribute("aria-pressed", String(on));
  }));
  document.querySelectorAll(".tabs [role=tab]").forEach(t => t.addEventListener("click", () => {
    document.querySelectorAll(".tabs [role=tab]").forEach(x => x.setAttribute("aria-selected", String(x === t)));
  }));
  let n = 2; const out = $("count");
  $("plus").addEventListener("click", () => { n = Math.min(9, n + 1); out.textContent = n; });
  $("minus").addEventListener("click", () => { n = Math.max(0, n - 1); out.textContent = n; });
}

buildSwitcher(); buildWall(); buildInventory(); wireDemo(); apply(current);
