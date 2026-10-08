// ~/seven — portfolio behaviour. No libraries.

// ---------------------------------------------------------------
// Minecraft plugins — edit this list. `yt` is the YouTube video id
// (the part after watch?v=). Leave it "" until the video is up.
// ---------------------------------------------------------------
const PLUGINS = [
  {
    name: "Nature7 Engine",
    kind: "plugin",
    short: "Modular Minigame Engine for Paper 26.2/26.3",
    summary: "A modular minigame engine for Paper 26.2/26.3.",
    stack: ["java", "paper"],
    yt: "FOdC2XujEIE",
    links: [{ label: "Nature7 repo", href: "https://github.com/glocation87/Nature7" }],
  },
  {
    name: "Plugin two", // TODO(ryan)
    kind: "plugin",
    short: "One line on what it does.",
    summary: "One sentence on what it does for players or server owners.",
    stack: ["java", "paper"],
    yt: "",
    links: [],
  },
  {
    name: "Plugin three", // TODO(ryan)
    kind: "plugin",
    short: "One line on what it does.",
    summary: "One sentence on what it does for players or server owners.",
    stack: ["java", "paper"],
    yt: "",
    links: [],
  },
];

// ---------- YouTube facade: poster first, player only on click ----------
function mountVideo(el, id, title) {
  el.innerHTML = "";
  el.classList.remove("is-playing");
  el.removeAttribute("data-pending");
  if (!id) {
    el.setAttribute("data-pending", "");
    el.innerHTML = '<span class="video__ph">video coming soon</span>';
    el.removeAttribute("role"); el.removeAttribute("tabindex"); el.removeAttribute("aria-label");
    el.onclick = el.onkeydown = null;
    return;
  }
  const img = document.createElement("img");
  img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  img.alt = "";
  img.loading = "lazy";
  img.onerror = () => img.remove(); // no thumbnail → plain poster, not a broken-image icon
  const play = document.createElement("span");
  play.className = "video__play";
  play.textContent = "play";
  el.append(img, play);
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", `Play video: ${title}`);
  const start = () => {
    if (el.classList.contains("is-playing")) return;
    el.classList.add("is-playing");
    el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    el.removeAttribute("role"); el.removeAttribute("tabindex");
  };
  el.onclick = start;
  el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); start(); } };
}

document.querySelectorAll(".video[data-yt]").forEach((el) => mountVideo(el, el.dataset.yt, el.dataset.title || "video"));

// ---------- Minecraft showcase ----------
(function () {
  const list = document.getElementById("mc-list");
  if (!list) return;
  const player = document.createElement("div");
  player.className = "video";
  document.getElementById("mc-player").append(player);

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function select(i) {
    const p = PLUGINS[i];
    list.querySelectorAll(".show__item").forEach((b, j) => b.setAttribute("aria-selected", String(i === j)));
    mountVideo(player, p.yt, p.name);
    document.getElementById("mc-title").textContent = p.name;
    document.getElementById("mc-sum").textContent = p.summary;
    document.getElementById("mc-tags").innerHTML =
      `<span class="tag tag--mc"><span class="tag__key">[mc]</span> ${esc(p.kind)}</span>` +
      p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join("");
    const links = p.links.map((l, k) =>
      `<a class="btn ${k === 0 ? "btn--primary" : "btn--ghost"} btn--sm" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} <span class="btn__glyph">↗</span></a>`);
    if (p.yt) links.push(`<a class="btn btn--ghost btn--sm" href="https://www.youtube.com/watch?v=${esc(p.yt)}" target="_blank" rel="noopener">watch on youtube <span class="btn__glyph">↗</span></a>`);
    document.getElementById("mc-links").innerHTML = links.join("");
  }

  list.innerHTML = PLUGINS.map((p, i) => `
    <li><button class="show__item" type="button" role="tab" aria-selected="false" data-i="${i}">
      <span class="show__num">${String(i + 1).padStart(2, "0")}</span>
      <span><span class="show__name">${esc(p.name)}</span><span class="show__sum">${esc(p.short)}</span></span>
    </button></li>`).join("");
  list.addEventListener("click", (e) => {
    const b = e.target.closest(".show__item");
    if (b) select(+b.dataset.i);
  });
  select(0);
})();

// ---------- Project filters ----------
document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    document.querySelectorAll("#project-grid .card").forEach((c) => {
      c.hidden = f !== "all" && c.dataset.domain !== f;
    });
  });
});

// ---------- Active nav link while scrolling ----------
(function () {
  const links = [...document.querySelectorAll(".nav__link")];
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      const a = byId.get(en.target.id);
      if (a) a.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
})();

// ---------- Mobile menu ----------
(function () {
  const btn = document.querySelector(".nav__menu");
  const nav = document.getElementById("nav-links");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) { nav.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }
  });
})();

// ---------- Theme toggle (remembers choice; default follows the system) ----------
document.querySelector(".nav__theme")?.addEventListener("click", () => {
  const root = document.documentElement;
  const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});
