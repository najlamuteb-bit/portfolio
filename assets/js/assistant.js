/* Ask about Najla. An isolated, accessible conversation; all inference is server-side. */
(() => {
  "use strict";
  const config = window.NAJLA_ASSISTANT;
  if (!config?.enabled || !config.endpoint) return;
  const endpoint = new URL(config.endpoint, location.href);
  if (endpoint.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(endpoint.hostname)) return;
  const host = document.createElement("div");
  host.id = "najla-assistant";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
    <style>
      :host{--ink:#14213d;--navy:#0e1a33;--gold:#c5a066;--line:#e7e2d8;font-family:'Plex LAT',system-ui,sans-serif;font-size:14px;color:var(--ink);position:relative;z-index:65}
      *,*:before,*:after{box-sizing:border-box}button,textarea{font:inherit}button{cursor:pointer}button:disabled{cursor:wait;opacity:.6}[hidden]{display:none!important}
      button:focus-visible,a:focus-visible,textarea:focus-visible{outline:3px solid var(--gold);outline-offset:3px}
      .launcher{position:fixed;right:24px;bottom:24px;display:flex;align-items:center;gap:10px;padding:15px 19px;background:var(--navy);color:white;border:1px solid #ffffff55;border-radius:6px;box-shadow:0 5px 18px #0e1a3320;min-height:50px;font-weight:500}
      svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.5;flex:none}
      .panel{position:fixed;right:24px;bottom:90px;width:410px;max-width:calc(100% - 32px);height:620px;max-height:calc(100dvh - 116px);display:flex;flex-direction:column;overflow:hidden;background:#f7f5f0;border:1px solid var(--line);border-radius:10px;box-shadow:0 14px 50px #0e1a3326;text-align:left;line-height:1.65}
      header{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;background:white;border-bottom:1px solid var(--line);gap:12px}
      h2{margin:0;font-size:18px;font-weight:600;color:var(--navy)}.subtitle{margin:2px 0 0;color:#5e6880;font-size:12px}.actions{display:flex;gap:4px}
      .icon-button{background:none;border:0;display:grid;place-items:center;width:36px;height:36px;border-radius:4px;color:var(--ink)}.icon-button:hover{background:#f0eee9}
      .scroll{padding:20px;overflow:auto;overscroll-behavior:contain;flex:1;background:white;margin:8px 8px 0;border:1px solid var(--line);border-bottom:0;border-radius:6px 6px 0 0;scroll-behavior:smooth}
      .intro{margin:0 0 18px;font-size:15px;line-height:1.7}.intro strong{display:block;font-size:19px;font-weight:500;margin:0 0 8px}
      .suggestions{display:flex;flex-direction:column;gap:8px;margin:14px 0 20px}.suggestions button{text-align:left;background:white;border:1px solid #d7d9de;border-radius:4px;padding:10px 12px;color:var(--ink);min-height:44px}.suggestions button:hover{border-color:#9e7a42;background:#fbfaf7}
      .message{margin:0 0 22px;overflow-wrap:anywhere}.label{display:block;font-size:12px;color:#606a7b;margin-bottom:6px;font-weight:500}.body{white-space:pre-wrap;font-size:14px;line-height:1.8}.user .body{background:#f2f3f6;border-radius:5px;padding:12px 14px}.sources{display:flex;gap:8px 13px;flex-wrap:wrap;margin-top:10px}.sources a{color:#735321;text-underline-offset:3px;font-size:12px}
      .status{margin:0 0 16px;font-size:13px;color:#606a7b}.error{color:#893c32}.retry{border:0;background:none;padding:6px 0;color:#735321;text-decoration:underline;min-height:36px}
      form{margin:0 8px 8px;padding:12px;background:white;border:1px solid var(--line);border-top:0;border-radius:0 0 6px 6px}.input-row{display:flex;align-items:flex-end;gap:8px;padding-top:10px;border-top:1px solid var(--line)}textarea{display:block;resize:none;min-width:0;flex:1;border:0;background:white;padding:7px 4px;color:var(--ink);min-height:44px;max-height:110px;line-height:1.6;font-size:16px}textarea::placeholder{color:#727b8a}.send{width:44px;height:44px;flex:none;border:0;border-radius:4px;background:var(--navy);color:white;display:grid;place-items:center}.privacy{font-size:11px;color:#606a7b;line-height:1.55;margin:9px 0 0}.privacy a{color:inherit}.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      @media(max-width:520px){.launcher{right:16px;bottom:max(16px,env(safe-area-inset-bottom));padding:13px 16px}.panel{right:8px;bottom:82px;width:calc(100% - 16px);max-width:none;height:620px;max-height:calc(100dvh - 98px)}header{padding:14px 16px}.scroll{padding:17px}h2{font-size:17px}}
      @media(prefers-reduced-motion:reduce){.scroll{scroll-behavior:auto}}
    </style>
    <button class="launcher" type="button" aria-expanded="false" aria-controls="chat-panel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z"/><path d="M7 9h8M7 13h5"/></svg>Ask about Najla</button>
    <section class="panel" id="chat-panel" role="dialog" aria-label="Ask about Najla" hidden>
      <header><div><h2>Ask about Najla</h2><p class="subtitle">AI portfolio assistant</p></div><div class="actions"><button class="icon-button reset" type="button" aria-label="Start a new conversation" title="New conversation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9a8 8 0 1 1 0 6M4 3v6h6"/></svg></button><button class="icon-button close" type="button" aria-label="Close assistant"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div></header>
      <div class="scroll"><div class="intro"><strong>A closer look at Najla’s work.</strong>I’m Najla’s AI portfolio assistant. Ask about her experience, skills or projects, and I’ll point you to the relevant work.</div><div class="suggestions"><button type="button">What is Najla’s executive support experience?</button><button type="button">Show me her digital projects.</button><button type="button">What are her qualifications?</button></div><div class="messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions"></div><p class="status" role="status" hidden></p></div>
      <form><label class="sr" for="question">Your question about Najla</label><div class="input-row"><textarea id="question" rows="1" maxlength="1200" placeholder="Ask about her experience…" required></textarea><button class="send" type="submit" aria-label="Send question"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 19 0-14M6 11l6-6 6 6"/></svg></button></div><p class="privacy">AI answers use her published portfolio and may be inaccurate. Messages are sent to OpenAI. Don’t share confidential information. <a href="#contact">Contact Najla</a></p></form>
    </section>`;
  document.body.append(host);
  const $ = selector => root.querySelector(selector);
  const launcher = $(".launcher"), panel = $(".panel"), input = $("textarea"), messages = $(".messages"), status = $(".status"), scroller = $(".scroll");
  let history = [], controller = null, pending = false, retryMessage = null;
  const sources = {
    profile: ["Profile", "#about"], experience: ["Experience", "#experience"], achievements: ["Achievements", "#wins"],
    skills: ["Skills", "#skills"], credentials: ["Credentials", "#credentials"], contact: ["Contact", "#contact"], cv: ["Download CV", "assets/cv/Najla-AlOtaibi-CV.pdf"],
    committees: ["Committee system", "#p-committees"], delegations: ["Delegation system", "#p-delegations"], actions: ["Actions tracker", "work/actions-tracker.html"],
    dashboards: ["Executive dashboards", "work/dashboards.html"], monthly: ["Excel demo", "work/Monthly-Task-Tracker-DEMO.xlsx"]
  };
  function open() { panel.hidden = false; launcher.setAttribute("aria-expanded", "true"); input.focus(); }
  function close() { panel.hidden = true; launcher.setAttribute("aria-expanded", "false"); launcher.focus(); }
  launcher.onclick = () => panel.hidden ? open() : close(); $(".close").onclick = close;
  root.addEventListener("keydown", event => { if (event.key === "Escape" && !panel.hidden) { event.stopPropagation(); close(); } });
  input.addEventListener("keydown", event => { if (event.key === "Enter" && !event.shiftKey && !event.isComposing) { event.preventDefault(); $("form").requestSubmit(); } });
  function add(role, text, refs = []) {
    const item = document.createElement("div"); item.className = `message ${role}`;
    const label = document.createElement("span"); label.className = "label"; label.textContent = role === "user" ? "You" : "Najla’s assistant";
    const body = document.createElement("p"); body.className = "body"; body.textContent = text;
    item.append(label, body);
    const valid = [...new Set(refs)].filter(id => Object.hasOwn(sources, id)).slice(0, 4);
    if (valid.length) { const links = document.createElement("div"); links.className = "sources";
      for (const id of valid) { const a = document.createElement("a"); [a.textContent, a.href] = sources[id]; if (id === "cv" || id === "monthly") a.download = ""; a.onclick = () => { if (a.getAttribute("href").startsWith("#")) close(); }; links.append(a); } item.append(links);
    }
    messages.append(item); scroller.scrollTop = scroller.scrollHeight;
  }
  function busy(value) { pending = value; $(".send").disabled = value; input.readOnly = value; root.querySelectorAll(".suggestions button").forEach(b => b.disabled = value); messages.setAttribute("aria-busy", String(value)); }
  function clear() { controller?.abort(); controller = null; history = []; retryMessage = null; messages.replaceChildren(); status.hidden = true; $(".suggestions").hidden = false; busy(false); input.value = ""; input.focus(); }
  $(".reset").onclick = clear;
  async function send(question, retry = false) {
    if (pending || !question.trim()) return;
    question = question.trim(); if (question.length > 1200) return;
    if (!retry) { add("user", question); input.value = ""; }
    retryMessage = question; $(".suggestions").hidden = true; busy(true); status.replaceChildren(); status.textContent = "Checking Najla’s portfolio…"; status.className = "status"; status.hidden = false;
    const active = new AbortController(); controller = active; const timeout = setTimeout(() => active.abort(), 35000);
    try {
      const response = await fetch(endpoint.href, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "omit", body: JSON.stringify({ message: question, history: history.slice(-8) }), signal: active.signal });
      const result = await response.json();
      if (!response.ok) throw Object.assign(new Error("request_failed"), { code: result.code });
      if (typeof result.answer !== "string" || !Array.isArray(result.sources)) throw new Error("invalid_answer");
      if (controller !== active) return;
      add("assistant", result.answer, result.sources); history.push({ role: "user", content: question }, { role: "assistant", content: result.answer.slice(0, 1200) }); history = history.slice(-8); retryMessage = null; status.hidden = true;
    } catch (error) {
      if (controller !== active) return;
      status.className = "status error";
      status.textContent = error.code === "rate_limited" ? "The assistant has reached its request limit. Please try later or contact Najla directly." : "The assistant is temporarily unavailable. You can still browse the portfolio or contact Najla directly.";
      const retryButton = document.createElement("button"); retryButton.type = "button"; retryButton.className = "retry"; retryButton.textContent = "Try again"; retryButton.onclick = () => send(retryMessage, true); status.append(document.createElement("br"), retryButton);
    } finally { clearTimeout(timeout); if (controller === active) { controller = null; busy(false); if (!panel.hidden) input.focus(); } }
  }
  $("form").onsubmit = event => { event.preventDefault(); send(input.value); };
  root.querySelectorAll(".suggestions button").forEach(button => button.onclick = () => send(button.textContent));
})();
