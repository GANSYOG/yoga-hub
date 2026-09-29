/* YOGA HUB APP — router + rendering + interactions (no build step) */
(function () {
  "use strict";
  var C = window.YH_CONFIG, D = window.YH_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- apply centralized config ---- */
  function applyConfig() {
    $$("[data-wa]").forEach(function (a) { a.href = window.YH_WHATSAPP(a.getAttribute("data-wa")); a.target = "_blank"; a.rel = "noopener"; });
    $$('a[href^="tel:"]').forEach(function (a) { a.href = "tel:" + C.contact.phoneHref; });
    var dir = $("#dirBtn"); if (dir) dir.href = C.location.mapsLink;
    var mp = $("#mapsHome"); if (mp) mp.src = C.location.mapsEmbed;
  }

  /* ---- home renderers ---- */
  function card(ic, t, p, more) {
    return '<article class="card"><div class="ic">' + ic + '</div><h3>' + t + '</h3><p>' + p + '</p>' + (more ? '<a class="more" href="' + more + '">Learn More →</a>' : '') + '</article>';
  }
  function renderHome() {
    $("#problems").innerHTML = D.problems.map(function (p) { return card(p.icon, p.title, p.text); }).join("");
    $("#solutions").innerHTML = D.solutions.map(function (s) { return card("✦", s.title, '<span class="prog-ideal">' + s.tag + '</span><br>' + s.text, s.href); }).join("");
    var why = [["🎓", "Experienced Trainers", "Guided correction in every batch — beginners never feel lost."], ["🤝", "Personalized Attention", "Small batches so the trainer actually watches your form."], ["👥", "Small Batches", "Space to move, breathe and ask questions."], ["🧘", "Practical Yoga", "No jargon — postures, breath and routine you can repeat at home."], ["💛", "Affordable Fees", "Honest local pricing. Trial is free, always."], ["📈", "Results-Oriented", "Strength, mobility and habit goals tracked batch to batch."]];
    $("#why").innerHTML = why.map(function (w) { return card(w[0], w[1], w[2]); }).join("");
    $("#programs").innerHTML = D.programs.map(function (p) {
      return '<article class="card"><div class="ic">🕉</div><h3>' + p.name.toUpperCase() + '</h3><p>' + p.desc + '</p><span class="prog-ideal">' + p.ideal + '</span><p style="font-size:13px">✓ ' + p.benefits + '</p><a class="more" href="' + p.href + '">VIEW PROGRAM →</a></article>';
    }).join("");
    $("#specials").innerHTML = D.specials.map(function (s) {
      return '<article class="card special ' + s.accent + '"><span class="tag">' + s.meta + '</span><h3 style="margin-top:10px">' + s.name.toUpperCase() + '</h3><p style="color:inherit;opacity:.9">' + s.text + '</p><a class="more" style="color:inherit" href="' + s.href + '">Start →</a></article>';
    }).join("");
    $("#ttc-home").innerHTML = ["t200", "t300"].map(function (k) {
      var t = D.ttc[k];
      return '<div class="card"><span class="tag">TTC ' + t.hours + '</span><h3 style="margin-top:10px">' + t.hours + ' Certification</h3><p>' + t.duration + ' · ' + t.for + '</p><p style="font-size:13.5px">✓ ' + t.modules.slice(0, 3).join("<br>✓ ") + '</p><a class="more" href="#/' + (k === "t200" ? "ttc-200-hours" : "ttc-300-hours") + '">View curriculum →</a></div>';
    }).join("");
    $("#pricing").innerHTML = C.pricing.map(function (p) {
      return '<div class="card">' + (p.tag ? '<span class="tag">' + p.tag + '</span>' : '') + '<h3 style="margin-top:8px">' + p.plan + '</h3><div class="price">' + p.price + '</div><p>' + p.duration + '</p><p style="font-size:13.5px">✓ ' + p.features.join("<br>✓ ") + '</p><a class="btn btn-dark" style="width:100%" href="' + p.href + '">' + p.cta + '</a></div>';
    }).join("");
    $("#schedule").innerHTML = C.classSchedule.map(function (s) {
      return '<div class="card"><h3>' + s.slot + '</h3><p style="font-size:22px;font-weight:800;color:var(--navy)">' + s.time + '</p><span class="prog-ideal">' + s.days + ' · ' + s.level + '</span></div>';
    }).join("");
    renderGallery($("#galleryHome"), "All", 6);
    var gf = $("#galFilters");
    gf.innerHTML = D.galleryCats.map(function (c, i) { return '<button data-cat="' + c + '" class="' + (i === 0 ? "on" : "") + '">' + c + "</button>"; }).join("");
    $$("button", gf).forEach(function (b) { b.onclick = function () { $$("button", gf).forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); renderGallery($("#galleryHome"), b.dataset.cat, 6); }; });
    $("#faqHome").innerHTML = D.faqs.slice(0, 5).map(function (f) { return "<details class='faq'><summary>" + f.q + "</summary><p>" + f.a + "</p></details>"; }).join("");
  }

  /* ---- gallery with auto photo-load + graceful placeholder ---- */
  function tileHTML(g) {
    return '<div class="tile" data-title="' + g.title + '" data-file="' + g.file + '" tabindex="0" role="button" aria-label="Open ' + g.title + '"><img loading="lazy" alt="' + g.title + ' — Yoga Hub Malad East" src="' + g.file + '" onerror="this.closest(\'.tile\').remove()"><span>' + g.cat.toUpperCase() + " · " + g.title + "</span></div>";
  }
  function renderGallery(el, cat, limit) {
    var list = D.gallery.filter(function (g) { return cat === "All" || g.cat === cat; });
    if (limit) list = list.slice(0, limit);
    el.innerHTML = list.map(tileHTML).join("") + '<div class="tile" style="grid-column:1/-1;min-height:120px"><span>＋ ADD REAL PHOTOS — drop JPGs into assets/ using the names above</span></div>';
    bindTiles(el);
  }
  function bindTiles(root) {
    $$(".tile", root).forEach(function (t) {
      function open() { $("#lbTitle").textContent = t.dataset.title || "Yoga Hub"; $("#lbBody").textContent = "File: " + (t.dataset.file || "—") + " · Replace with your real studio photo to show it here and in the hero/about frames."; $("#lbBody").style.color = "#e9d6bc"; $("#lightbox").classList.add("on"); }
      t.onclick = open; t.onkeydown = function (e) { if (e.key === "Enter") open(); };
    });
  }

  /* ---- sub-routes ---- */
  var ROUTES = {
    "/about": ["About Yoga Hub", "10 Years of Trusted Results in Malad East", "<p>Since 2016, Yoga Hub has helped people across Malad East improve strength, mobility, flexibility, posture and overall wellbeing through structured yoga practices.</p><ul class='checks'><li>Experienced Trainers</li><li>Personalized Attention</li><li>Small Batch Training</li><li>Practical Yoga</li><li>Beginner Friendly</li><li>Therapy-Oriented Programs</li></ul><div class='cta-row'><a class='btn btn-gold' href='#/free-trial'>BOOK FREE TRIAL</a><a class='btn btn-dark' href='#/contact'>VISIT STUDIO</a></div>"],
    "/classes": ["Programs", "Yoga That Fits Your Real Life", "<div class='grid g3' style='margin-top:18px'>" + null + "</div>"],
    "/yoga-classes": ["Yoga Classes in Malad East", "Hatha · Power · Mobility — beginner friendly batches Mon–Sat.", "<p>Morning 6:30 / 7:30 AM and evening 5 PM batches. Mats available, small groups, step-by-step instruction. First session free.</p><div class='cta-row'><a class='btn btn-gold' href='#/free-trial'>BOOK FREE TRIAL</a></div>"],
    "/yoga-classes-malad-east": ["__alias__", "", "/yoga-classes"],
    "/therapy": ["Yoga Therapy", "Therapy-oriented practice that supports mobility, strength and better movement.", "<p>Wellness support — not medical treatment. Share your health note on the trial form so the trainer can adapt the session. Please consult your doctor for medical conditions.</p><div class='cta-row'><a class='btn btn-gold' href='#/free-trial'>BOOK CONSULTATION</a></div>"],
    "/yoga-therapy-malad": ["__alias__", "", "/therapy"],
    "/weight-management": ["Weight Management", "Power yoga + core + habit guidance for steady, sustainable change.", "<p>Batch training plus food-rhythm and activity habits. Start with the 14-Day Belly Reset.</p><div class='cta-row'><a class='btn btn-gold' href='#/belly-reset'>START 14-DAY RESET</a></div>"],
    "/weight-management-yoga-malad": ["__alias__", "", "/weight-management"],
    "/personal": ["Personal Yoga", "1-on-1 coaching at studio, home or online.", "<p>Fully personalised plan, flexible timings, faster correction.</p><div class='cta-row'><a class='btn btn-gold' href='#/contact'>BOOK CONSULTATION</a></div>"],
    "/personal-yoga-malad": ["__alias__", "", "/personal"],
    "/corporate": ["Corporate Stress Relief", "Practical yoga programs designed for modern workplaces.", "<ul class='checks'><li>Workplace stress relief</li><li>Desk-posture awareness</li><li>Focus + breathing</li><li>Team wellness formats</li></ul><div class='cta-row'><a class='btn btn-gold' href='#' data-wa='corporate'>BOOK CORPORATE SESSION</a></div>"],
    "/corporate-yoga-mumbai": ["__alias__", "", "/corporate"],
    "/senior": ["Move Better. Stay Independent.", "Joint-friendly senior batches: balance, mobility, gentle strength, breathing.", "<div class='cta-row'><a class='btn btn-gold' href='#/free-trial'>EXPLORE SENIOR PROGRAM</a></div>"],
    "/senior-citizen-yoga-malad": ["__alias__", "", "/senior"],
    "/women": ["Women's Wellness Program", "Weight, mobility, strength, stress and breathing routines for real life.", "<div class='cta-row'><a class='btn btn-gold' href='#/free-trial'>JOIN WOMEN'S BATCH</a></div>"],
    "/back-pain-yoga-malad": ["Back Pain Recovery Program", "Posture awareness, spinal mobility, core support, gentle yoga.", "<p>Designed to support mobility, strength and better movement. Not a medical cure — train alongside your doctor's advice.</p><div class='cta-row'><a class='btn btn-gold' href='#/free-trial'>BOOK CONSULTATION</a></div>"],
    "/back-pain": ["__alias__", "", "/back-pain-yoga-malad"],
    "/belly-reset": ["14-Day Belly Reset", "Reduce inches. Improve energy. Build better habits.", "<p><b>Days 1–4</b> foundation · <b>5–9</b> build · <b>10–14</b> lock in. Core flows + mobility + breathing + habit tracker. No crash diets; no medical claims.</p><div class='cta-row'><a class='btn btn-gold' href='#/free-trial'>START 14-DAY RESET</a></div>"],
    "/ttc": ["Become a Certified Yoga Teacher", "Build knowledge. Build confidence. Build your teaching career.", "<div class='compare' id='ttcRoute'></div><p style='margin-top:14px'>Certification details are shared in the official course document — we display only affiliations confirmed by the studio.</p><div class='cta-row'><a class='btn btn-gold' href='#/ttc-200-hours'>TTC 200</a><a class='btn btn-dark' href='#/ttc-300-hours'>TTC 300</a><a class='btn btn-green' href='#' data-wa='ttc'>ASK ON WHATSAPP</a></div>"],
    "/yoga-teacher-training-mumbai": ["__alias__", "", "/ttc"],
    "/ttc-200-hours": ["TTC 200 Hours", "Foundation certification: technique, breath, anatomy, philosophy, teaching.", "<div class='card' id='t200Route'></div><div class='cta-row'><a class='btn btn-gold' href='#/free-trial'>ENQUIRE FOR TTC 200</a></div>"],
    "/ttc-200": ["__alias__", "", "/ttc-200-hours"],
    "/ttc-300-hours": ["TTC 300 Hours", "Advanced depth after a 200-hr foundation: sequencing, mentoring, practice.", "<div class='card' id='t300Route'></div><div class='cta-row'><a class='btn btn-gold' href='#/free-trial'>ENQUIRE FOR TTC 300</a></div>"],
    "/ttc-300": ["__alias__", "", "/ttc-300-hours"],
    "/testimonials": ["Member Stories", "Real experiences only — no fabricated reviews.", "<div class='card'><h3>Real member experiences coming soon.</h3><p>We publish only genuine, permission-based stories. Train with us and yours could be first.</p></div>"],
    "/gallery": ["Gallery", "Classes · Trainer · Students · Workshops · TTC · Studio", "<div class='gal-filters' id='galF2'></div><div class='masonry' id='galFull'></div>"],
    "/contact": ["Contact Yoga Hub", "Kurar Village, Malad East — call, WhatsApp or drop in.", "<p><b>Address:</b> Shop No. 1, Mithailal Compound, Kurar Village, Opp. Jyoti Hotel (Opp. Axis Bank ATM), Malad East, Mumbai 400097<br><b>Landmark:</b> Opp. Jyoti Hotel · Borivli station ≈ 4 km<br><b>Founder:</b> Ganesh Sharma · <b>Rating:</b> ★ 5.0<br><b>Hours:</b> Mon–Sun 6:00–11:00 AM · Evening/online on enquiry<br><b>Phone/WhatsApp:</b> <a href='tel:+919920233085'>+91 99202 33085</a><br><b>Email:</b> <a href='mailto:hello@yogahub.in'>hello@yogahub.in</a></p><div class='cta-row'><a class='btn btn-gold' target='_blank' rel='noopener' href='https://www.google.com/maps/search/?api=1&query=Yoga%20Hub%20Mithailal%20Compound%20Kurar%20Village%20Malad%20East%20Mumbai%20400097'>GET DIRECTIONS</a><a class='btn btn-green' href='#' data-wa='trial'>WHATSAPP US</a></div><iframe title='map' loading='lazy' style='width:100%;height:320px;border:0;border-radius:16px' src='https://www.google.com/maps?q=Yoga%20Hub%20Mithailal%20Compound%20Kurar%20Village%20Malad%20East%20Mumbai%20400097&output=embed'></iframe>"],
    "/free-trial": ["Book Your FREE Trial", "Your first step starts here. 30 seconds to book.", "<p>Fill the form on the <a href='#/'>home page trial section</a> or message us below.</p><div class='cta-row'><a class='btn btn-gold' href='#/' id='goTrial'>OPEN TRIAL FORM</a><a class='btn btn-green' href='#' data-wa='trial'>BOOK ON WHATSAPP</a></div>"],
    "/faq": ["FAQ", "Good questions, honest answers.", "<div id='faqFull'></div>"],
    "/privacy": ["Privacy Policy", "How we handle your details.", "<p>We collect name, phone, email and program interest only to arrange your trial/class. We never sell data. Message us to access or delete your details. Tracking (Analytics/Pixel) stays off until configured.</p>"],
    "/terms": ["Terms & Conditions", "Simple, fair terms.", "<p>Trial sessions are subject to batch availability. Fees, timings and batches may change with notice. Therapy-oriented batches are wellness practices, not medical treatment. Refund queries are handled case-by-case at the studio.</p>"]
  };

  function renderRoute(path) {
    var home = $("#pg-home"), shell = $("#pg-route"), body = $("#routeBody");
    var r = ROUTES[path];
    if (!r) { home.classList.add("on"); shell.classList.remove("on"); setActive("/"); return; }
    if (r[0] === "__alias__") { location.hash = "#" + r[2]; return; }
    home.classList.remove("on"); shell.classList.add("on");
    body.innerHTML = "<a href='#/' style='font-weight:800;text-decoration:none'>← Back to Home</a><p></p><span class='kicker'>" + C.brandName.toUpperCase() + " · " + C.location.area.toUpperCase() + "</span><h1 class='h2'>" + r[0] + "</h1><p class='lead'>" + r[1] + "</p><div style='margin-top:20px'>" + r[2] + "</div>";
    document.title = r[0] + " | Yoga Hub Malad East";
    if (path === "/classes") body.querySelector(".grid").innerHTML = D.programs.map(function (p) { return card("🕉", p.name.toUpperCase(), p.desc + "<br><span class='prog-ideal'>" + p.ideal + "</span>", p.href); }).join("");
    if (path === "/gallery") {
      var f = $("#galF2"); f.innerHTML = D.galleryCats.map(function (c, i) { return '<button data-cat="' + c + '" class="' + (i === 0 ? "on" : "") + '">' + c + "</button>"; }).join("");
      var full = $("#galFull"); renderGallery(full, "All");
      $$("button", f).forEach(function (b) { b.onclick = function () { $$("button", f).forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); renderGallery(full, b.dataset.cat); }; });
    }
    if (path === "/faq") $("#faqFull").innerHTML = D.faqs.map(function (x) { return "<details class='faq'><summary>" + x.q + "</summary><p>" + x.a + "</p></details>"; }).join("");
    if (path === "/ttc") {
      var el = $("#ttcRoute"); el.innerHTML = ["t200", "t300"].map(function (k) { var t = D.ttc[k]; return "<div class='card'><span class='tag'>TTC " + t.hours + "</span><h3>" + t.hours + "</h3><p>" + t.duration + " · " + t.for + "</p><p style='font-size:14px'>✓ " + t.modules.join("<br>✓ ") + "</p></div>"; }).join("");
    }
    var t2 = $("#t200Route"); if (t2) t2.innerHTML = "<h3>TTC 200 Hours</h3><p>" + D.ttc.t200.duration + " · " + D.ttc.t200.for + "</p><p>✓ " + D.ttc.t200.modules.join("<br>✓ ") + "</p>";
    var t3 = $("#t300Route"); if (t3) t3.innerHTML = "<h3>TTC 300 Hours</h3><p>" + D.ttc.t300.duration + " · " + D.ttc.t300.for + "</p><p>✓ " + D.ttc.t300.modules.join("<br>✓ ") + "</p>";
    var go = $("#goTrial"); if (go) go.onclick = function () { setTimeout(function () { var f2 = $("#trialFormHome"); if (f2) f2.scrollIntoView({ behavior: "smooth", block: "center" }); }, 80); };
    applyConfig(); setActive(path); window.scrollTo({ top: 0 });
  }
  function setActive(path) { $$("nav.links a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + path || (path === "/" && a.getAttribute("href") === "#/")); }); }
  function route() { var h = location.hash.replace(/^#/, "") || "/"; renderRoute(h.split("?")[0]); }

  /* ---- interactions ---- */
  function initChrome() {
    var hdr = $("#header");
    addEventListener("scroll", function () { hdr.classList.toggle("scrolled", scrollY > 24); }, { passive: true });
    hdr.classList.add("scrolled");
    var b = $("#burger"), m = $("#mnav");
    b.onclick = function () { var open = m.style.display !== "flex"; m.style.display = open ? "flex" : "none"; b.setAttribute("aria-expanded", open); };
    m.addEventListener("click", function () { if (innerWidth < 992) m.style.display = "none"; });
    var yb = $("#yhBurger");
    if (yb) yb.onclick = function () { var open = m.style.display !== "flex"; m.style.display = open ? "flex" : "none"; yb.setAttribute("aria-expanded", open); };
    // landing schedule card (reads centralized classSchedule)
    var ys = $("#yhSched");
    if (ys) ys.innerHTML = C.classSchedule.slice(0, 4).map(function (s) {
      return "<div class='yh-srow'><b>" + s.slot.toUpperCase() + "<small>" + s.days.toUpperCase() + "</small></b><span>" + s.time + "<small>" + s.level.toUpperCase() + "</small></span></div>";
    }).join("");
    // landing program slider (reads centralized programs)
    var yi = 0, yc = $("#yhCards");
    function yhCard(p, n) {
      return "<a class='yh-card' href='" + p.href + "'><small>PROGRAM " + n + "</small><h3>" + p.name + "</h3><p>" + p.benefits + "</p><span class='yh-play'>▶</span></a>";
    }
    function yhRender() {
      if (!yc) return;
      var a = D.programs[yi % D.programs.length], b = D.programs[(yi + 1) % D.programs.length];
      yc.innerHTML = yhCard(a, String(yi % D.programs.length + 1).padStart(2, "0")) + yhCard(b, String((yi + 1) % D.programs.length + 1).padStart(2, "0"));
    }
    var yp = $("#yhPrev"), yn = $("#yhNext");
    if (yp) yp.onclick = function () { yi = (yi - 1 + D.programs.length) % D.programs.length; yhRender(); };
    if (yn) yn.onclick = function () { yi = (yi + 1) % D.programs.length; yhRender(); };
    yhRender();
    $("#lbClose").onclick = function () { $("#lightbox").classList.remove("on"); };
    $("#lightbox").onclick = function (e) { if (e.target.id === "lightbox") $("#lightbox").classList.remove("on"); };
    addEventListener("keydown", function (e) { if (e.key === "Escape") $("#lightbox").classList.remove("on"); });

    // scroll reveal
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });

    // animated counters
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var n = +e.target.dataset.n, t0 = performance.now();
        (function tick(t) { var p = Math.min(1, (t - t0) / 1200); e.target.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
      });
    }, { threshold: 0.5 });
    $$(".count").forEach(function (el) { cio.observe(el); });

    // auto-load real photo into the about frame if present in assets/
    (function () {
      var src = "assets/class-01.jpg";
      var img = new Image();
      img.onload = function () {
        var f = $(".photo-frame > div");
        if (f) f.innerHTML = "<img src='" + src + "' alt='Yoga Hub real studio photo' style='position:absolute;inset:0;width:100%;height:100%;object-fit:cover'>";
      };
      img.src = src;
    })();

    // lead form
    var form = $("#trialFormHome");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#h-name"), phone = $("#h-phone"), prog = $("#h-prog");
      var ok = true;
      function setErr(input, msg) { var d = input.parentElement.querySelector(".err"); d.textContent = msg || ""; if (msg) ok = false; }
      setErr(name, name.value.trim().length < 2 ? "Please enter your name." : "");
      setErr(phone, /^[6-9]\d{9}$/.test(phone.value.replace(/\D/g, "").slice(-10)) ? "" : "Enter a valid 10-digit mobile number.");
      setErr(prog, prog.value ? "" : "Please choose a program.");
      if (!ok) return;
      var lead = { id: "lead_" + Date.now(), name: name.value.trim(), phone: phone.value.trim(), program: prog.value, time: $("#h-time").value, message: $("#h-msg").value.trim(), source: "website-trial", status: "NEW", created_at: new Date().toISOString() };
      try {
        var k = "yh_leads"; var arr = JSON.parse(localStorage.getItem(k) || "[]"); arr.push(lead); localStorage.setItem(k, JSON.stringify(arr));
        fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) }).catch(function () { });
      } catch (err) { }
      form.querySelector(".ok").style.display = "block";
      form.querySelector("button").textContent = "REQUEST RECEIVED ✓";
      track("form_submit", { program: lead.program });
    });
  }
  function track(ev, data) {
    if (C.analytics.gaId && window.gtag) try { gtag("event", ev, data || {}); } catch (e) { }
    $$("[data-ev]").forEach(function () { });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-ev],[data-wa],a[href^='tel:']");
    if (!t) return;
    if (t.hasAttribute("data-wa")) track("whatsapp_click", {});
    if (t.href && t.href.indexOf("tel:") === 0) track("call_click", {});
    if (t.dataset.ev === "free_trial_click") track("free_trial_click", {});
  });

  applyConfig(); renderHome(); initChrome(); route();
  addEventListener("hashchange", route);
})();
