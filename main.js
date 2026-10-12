/* =============================================================
   Site engine — no need to edit this when updating content.
   All text lives in assets/js/content.js
   ============================================================= */
(function () {
  "use strict";
  var C = CONTENT;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }
  function each(sel, fn, root) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }

  /* ---------------- Line icons ---------------- */
  var I = {
    people: '<path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19"/><circle cx="10" cy="7.5" r="3.2"/><path d="M20 19v-1.4a3.3 3.3 0 0 0-2.4-3.2M15.6 4.5a3.2 3.2 0 0 1 0 6.1"/>',
    check: '<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M9 3.5h6v2.5H9z"/><path d="m8.5 13 2.2 2.2 4.8-4.7"/>',
    chart: '<path d="M4 20h16"/><path d="M6.5 20v-6M11 20V9M15.5 20v-4M20 20V5"/>',
    link: '<circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="m8.3 10.8 7.4-3.6M8.3 13.2l7.4 3.6"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.1 7.5 9.5 4.3-1.4 7.5-4.9 7.5-9.5V6z"/><path d="M9 12h6M9 15h4M9 9h6"/>',
    cycle: '<path d="M20 11a8 8 0 0 0-14.6-4.4M4 4.5v3.6h3.6"/><path d="M4 13a8 8 0 0 0 14.6 4.4M20 19.5v-3.6h-3.6"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="m9 13.9-1.6 6.6 4.6-2.3 4.6 2.3-1.6-6.6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
    phone: '<path d="M6.6 3.5h2.6l1.4 4-1.9 1.3a11 11 0 0 0 6.5 6.5l1.3-1.9 4 1.4v2.6A2.1 2.1 0 0 1 18.4 20 15.4 15.4 0 0 1 4 5.6a2.1 2.1 0 0 1 2.6-2.1z"/>',
    linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8 10.5V17M8 7.5v.01M11.5 17v-6.5M11.5 13.2c0-1.6 1.1-2.7 2.5-2.7s2.5 1 2.5 2.7V17"/>',
    file: '<path d="M14 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3.5V8h4.5M12 11v6M9.5 14.5 12 17l2.5-2.5"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    zoom: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5M10.5 8v5M8 10.5h5"/>'
  };
  function icon(name, cls) {
    return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + I[name] + "</svg>";
  }
  var FOCUS_ICONS = ["people", "check", "chart", "link", "shield", "cycle"];

  /* ---------------- Top bar ---------------- */
  function renderBar() {
    var i = C.identity;
    $("brand-name").textContent = i.name;
    document.querySelector(".brand").setAttribute("aria-label", i.name);
    $("nav").innerHTML = C.nav.map(function (n) {
      return '<a href="#' + n.id + '" data-nav="' + n.id + '">' + esc(n.label) + "</a>";
    }).join("");
    $("menu-btn").setAttribute("aria-label", C.ui.menu);
    $("skip").textContent = C.ui.skip;
  }

  /* ---------------- Hero ---------------- */
  function renderHero() {
    var i = C.identity, H = C.hero;
    $("hero-kicker").textContent = H.kicker;
    $("hero-name").textContent = i.name;
    $("hero-role").textContent = i.role;
    $("hero-head").innerHTML = H.headline;
    $("hero-lede").textContent = H.lede;
    $("cta1").innerHTML = "<span>" + esc(H.cta1) + "</span>" + icon("arrow");
    $("cta2").innerHTML = icon("file") + "<span>" + esc(H.cta2) + "</span>";
    $("cta2").href = i.cvFile;
    $("stats").innerHTML = C.stats.map(function (s) {
      return '<div class="stat"><b>' + esc(s.n) + "</b><span>" + esc(s.label) + "</span></div>";
    }).join("");
  }

  function head(el, title, sub) {
    var h = "<h2>" + esc(title) + "</h2>";
    if (sub) h += '<p class="sub">' + esc(sub) + "</p>";
    $(el).innerHTML = h;
  }

  /* ---------------- Focus strip + profile ---------------- */
  function renderAbout() {
    var A = C.about;
    $("focus-title").textContent = A.focusTitle;
    $("focus-list").innerHTML = A.focus.map(function (f, k) {
      return '<div class="pillar reveal">' + icon(FOCUS_ICONS[k % FOCUS_ICONS.length]) + "<p>" + esc(f) + "</p></div>";
    }).join("");
    head("about-head", A.title);
    $("about-text").innerHTML = A.paras.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  }

  /* ---------------- Work ---------------- */
  function renderProjects() {
    var P = C.projects, LB = P.labels;
    head("proj-head", P.title, P.sub);
    $("proj-list").innerHTML = P.items.map(function (p, k) {
      var cover = p.shots[0];
      return '<article class="pcard reveal" id="p-' + p.id + '">' +
        '<button type="button" class="pcover" data-proj="' + k + '" data-shot="0" aria-label="' + esc(LB.zoom) + " — " + esc(p.title) + '">' +
          '<img src="' + esc(cover.src) + '" alt="' + esc(p.title) + " — " + esc(cover.cap) + '" loading="lazy" decoding="async">' +
          '<span class="zoom-hint">' + icon("zoom") + "</span>" +
          (p.shots.length > 1 ? '<span class="count">' + p.shots.length + " images</span>" : "") +
        "</button>" +
        '<div class="pbody">' +
          '<span class="badge">' + esc(p.badge) + "</span>" +
          "<h3>" + esc(p.title) + "</h3>" +
          '<p class="psum">' + esc(p.sum) + "</p>" +
          '<button type="button" class="more" data-open="' + k + '"><span>' + esc(LB.view) + "</span>" + icon("arrow") + "</button>" +
        "</div></article>";
    }).join("");
  }

  function list(arr) {
    return "<ul>" + arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
  }

  var current = null;   // index of the project open in the dialog
  function openProject(k, opener) {
    var P = C.projects, LB = P.labels, p = P.items[k];
    current = k;
    $("m-badge").textContent = p.badge;
    $("m-title").textContent = p.title;
    $("m-close").setAttribute("aria-label", LB.close);
    var shots = p.shots.map(function (s, n) {
      return '<figure class="mshot"><button type="button" data-proj="' + k + '" data-shot="' + n + '" aria-label="' + esc(LB.zoom) + '">' +
        '<img src="' + esc(s.src) + '" alt="' + esc(p.title) + " — " + esc(s.cap) + '" decoding="async">' +
        '<span class="zoom-hint">' + icon("zoom") + "</span></button>" +
        "<figcaption>" + esc(s.cap) + "</figcaption></figure>";
    }).join("");
    var outcome = "";
    if (p.proven) outcome += '<div class="obox proven"><span>' + esc(LB.proven) + "</span><p>" + esc(p.proven) + "</p></div>";
    if (p.expected) outcome += '<div class="obox expected"><span>' + esc(LB.expected) + "</span><p>" + esc(p.expected) + "</p></div>";
    var links = p.links.map(function (l) {
      return '<a class="btn ' + (l.solid ? "navy" : "line") + '" href="' + esc(l.href) + '"' +
        (l.download ? " download" : ' target="_blank" rel="noopener"') + ">" + esc(l.label) + "</a>";
    }).join("");
    $("m-body").innerHTML =
      '<p class="msum">' + esc(p.sum) + "</p>" +
      '<div class="mshots' + (p.shots.length === 1 ? " one" : "") + '">' + shots + "</div>" +
      '<div class="mgrid">' +
        "<div><h4>" + esc(LB.goal) + "</h4><p>" + esc(p.goal) + "</p></div>" +
        "<div><h4>" + esc(LB.role) + "</h4>" + list(p.role) + "</div>" +
        "<div><h4>" + esc(LB.feats) + "</h4>" + list(p.feats) + "</div>" +
      "</div>" +
      (outcome ? '<div class="outcome">' + outcome + "</div>" : "") +
      '<p class="note">' + esc(P.note) + "</p>" +
      (links ? '<div class="mlinks">' + links + "</div>" : "");
    var m = $("modal");
    m.hidden = false;
    if (opener) m._opener = opener;
    document.body.classList.add("locked");
    watchImages($("m-body"));
    requestAnimationFrame(function () { m.classList.add("open"); $("modal-panel").scrollTop = 0; $("m-close").focus(); });
  }
  function closeProject() {
    var m = $("modal");
    if (m.hidden) return;
    m.classList.remove("open");
    m.hidden = true;
    current = null;
    document.body.classList.remove("locked");
    if (m._opener && document.body.contains(m._opener)) { try { m._opener.focus(); } catch (e) {} }
    m._opener = null;
  }

  /* ---------------- Lightbox ---------------- */
  var lbState = { k: 0, n: 0, opener: null };
  function showShot() {
    var p = C.projects.items[lbState.k], s = p.shots[lbState.n];
    var img = $("lb-img");
    img.src = s.src;
    img.alt = p.title + " — " + s.cap;
    $("lb-cap").textContent = s.cap;
    var multi = p.shots.length > 1;
    $("lb-count").textContent = multi ? (lbState.n + 1) + " / " + p.shots.length : "";
    $("lb-prev").hidden = !multi;
    $("lb-next").hidden = !multi;
  }
  function openLightbox(k, n, opener) {
    lbState = { k: +k, n: +n, opener: opener || null };
    var LB = C.projects.labels;
    $("lb-close").setAttribute("aria-label", LB.close);
    $("lb-prev").setAttribute("aria-label", LB.prev);
    $("lb-next").setAttribute("aria-label", LB.next);
    showShot();
    var lb = $("lb");
    lb.hidden = false;
    document.body.classList.add("locked");
    requestAnimationFrame(function () { lb.classList.add("open"); $("lb-close").focus(); });
  }
  function closeLightbox() {
    var lb = $("lb");
    if (lb.hidden) return;
    lb.classList.remove("open");
    lb.hidden = true;
    if ($("modal").hidden) document.body.classList.remove("locked");
    if (lbState.opener && document.body.contains(lbState.opener)) { try { lbState.opener.focus(); } catch (e) {} }
  }
  function step(d) {
    var total = C.projects.items[lbState.k].shots.length;
    lbState.n = (lbState.n + d + total) % total;
    showShot();
  }

  /* ---------------- Experience ---------------- */
  function renderExperience() {
    head("exp-head", C.experience.title);
    $("exp-list").innerHTML = C.experience.jobs.map(function (j) {
      return '<article class="job reveal">' +
        '<div class="job-side"><span class="yrs">' + esc(j.yrs) + "</span></div>" +
        '<div class="job-main"><h3>' + esc(j.title) + '</h3><div class="org">' + esc(j.org) + "</div>" +
        (j.pts.length ? "<ul>" + j.pts.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "") +
        "</div></article>";
    }).join("");
  }

  /* ---------------- Achievements ---------------- */
  function renderWins() {
    head("wins-head", C.wins.title, C.wins.sub);
    $("wins-grid").innerHTML = C.wins.items.map(function (w) {
      return '<div class="win reveal">' + icon("award") + "<h3>" + esc(w.t) + "</h3><p>" + esc(w.p) + "</p></div>";
    }).join("");
  }

  /* ---------------- Skills ---------------- */
  function renderSkills() {
    head("skills-head", C.skills.title);
    var html = C.skills.groups.map(function (g) {
      return '<div class="card reveal"><h3>' + esc(g.t) + '</h3><div class="tags">' +
        g.items.map(function (i) { return '<span class="tag">' + esc(i) + "</span>"; }).join("") +
        "</div></div>";
    }).join("");
    html += '<div class="card reveal"><h3>' + esc(C.skills.langsTitle) + '</h3><ul class="plain">' +
      C.skills.langs.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>";
    $("skills-grid").innerHTML = html;
  }

  /* ---------------- Credentials ---------------- */
  function renderCredentials() {
    head("cred-head", C.credentials.title, C.credentials.sub);
    $("cred-grid").innerHTML = C.credentials.groups.map(function (g) {
      return '<div class="card reveal"><h3>' + esc(g.t) + '</h3><ul class="plain">' +
        g.items.map(function (i) {
          return "<li>" + esc(i.label) + (i.sub ? '<span class="sub2">' + esc(i.sub) + "</span>" : "") + "</li>";
        }).join("") + "</ul></div>";
    }).join("");
  }

  /* ---------------- Contact ---------------- */
  function renderContact() {
    var i = C.identity, lb = C.contact.labels;
    head("contact-head", C.contact.title, C.contact.sub);
    var items = [
      ["mail", lb.email, '<a href="mailto:' + esc(i.email) + '">' + esc(i.email) + "</a>"],
      ["phone", lb.phone, '<a href="tel:' + esc(i.phone) + '">' + esc(i.phoneDisplay) + "</a>"],
      ["linkedin", lb.linkedin, '<a href="' + esc(i.linkedin) + '" target="_blank" rel="noopener">' + esc(i.linkedinDisplay) + "</a>"],
      ["file", lb.cv, '<a href="' + esc(i.cvFile) + '" download>' + esc(lb.cvValue) + "</a>"],
      ["pin", lb.location, '<p class="loc">' + esc(i.location) + "</p>"]
    ];
    $("contact-grid").innerHTML = items.map(function (b) {
      return '<div class="citem reveal">' + icon(b[0]) + "<div><span>" + esc(b[1]) + "</span>" + b[2] + "</div></div>";
    }).join("");
    $("footer").innerHTML = C.footer.map(function (f) { return "<p>" + esc(f) + "</p>"; }).join("");
  }

  /* ---------------- Images: warn in the console if a file is missing ---------------- */
  function watchImages(root) {
    each("img", function (img) {
      if (img._watched) return;
      img._watched = true;
      img.addEventListener("error", function () {
        var f = img.closest(".pcover, .mshot");
        if (f) f.classList.add("img-missing");
        if (window.console) console.warn("[portfolio] image not found:", img.getAttribute("src"));
      });
    }, root);
  }

  /* ---------------- Motion and navigation ---------------- */
  var io;
  function observe() {
    if (!("IntersectionObserver" in window)) { each(".reveal", function (n) { n.classList.add("in"); }); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: "0px 0px 8% 0px" });
    each(".reveal", function (n) { io.observe(n); });
    // safety net: reveal everything after two seconds whatever happens
    setTimeout(function () { each(".reveal", function (n) { n.classList.add("in"); }); }, 2000);
  }

  var spy;
  function scrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    if (spy) spy.disconnect();
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        each("[data-nav]", function (a) { a.classList.toggle("on", a.getAttribute("data-nav") === e.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    C.nav.forEach(function (n) { var el = $(n.id); if (el) spy.observe(el); });
    var home = $("home"); if (home) spy.observe(home);
  }

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    $("menu-btn").setAttribute("aria-expanded", open ? "true" : "false");
  }

  /* ---------------- Events ---------------- */
  $("menu-btn").addEventListener("click", function () {
    setMenu(!document.body.classList.contains("menu-open"));
  });
  $("nav").addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });

  document.addEventListener("click", function (e) {
    var shot = e.target.closest("[data-shot]");
    if (shot) { openLightbox(shot.getAttribute("data-proj"), shot.getAttribute("data-shot"), shot); return; }
    var op = e.target.closest("[data-open]");
    if (op) { openProject(+op.getAttribute("data-open"), op); }
  });

  $("m-close").addEventListener("click", closeProject);
  $("modal").addEventListener("click", function (e) { if (e.target === this) closeProject(); });
  $("lb-close").addEventListener("click", closeLightbox);
  $("lb-prev").addEventListener("click", function () { step(-1); });
  $("lb-next").addEventListener("click", function () { step(1); });
  $("lb").addEventListener("click", function (e) { if (e.target === this) closeLightbox(); });

  document.addEventListener("keydown", function (e) {
    if (!$("lb").hidden) {
      if (e.key === "Escape") { closeLightbox(); return; }
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
      return;
    }
    if (!$("modal").hidden && e.key === "Escape") { closeProject(); return; }
    if (e.key === "Escape") setMenu(false);
  });

  // subtle shadow on the top bar when scrolled
  var bar = $("topbar");
  function onScroll() { bar.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Render ---------------- */
  renderBar(); renderHero(); renderAbout(); renderProjects(); renderExperience();
  renderWins(); renderSkills(); renderCredentials(); renderContact();
  watchImages(document);
  observe(); scrollSpy();
})();
