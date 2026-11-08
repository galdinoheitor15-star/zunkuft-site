(() => {
  "use strict";
  const C = window.ZK_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  /* Origem do lead (UTM do anúncio) */
  const params = new URLSearchParams(location.search);
  const origem = store.get("zk_origem") || {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
    if (params.get(k)) origem[k] = params.get(k);
  });
  store.set("zk_origem", origem);

  /* Links do config */
  const waLink = (msg) => (C.whatsapp ? `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}` : "");
  $$("[data-wa]").forEach((a) => {
    const href = waLink(a.dataset.wa);
    if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; } else a.hidden = true;
  });
  $$("[data-ig]").forEach((a) => { a.href = C.instagram || "#"; });
  $$("[data-closer]").forEach((el) => { el.textContent = C.closer || "nosso especialista"; });
  $$("[data-ano]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  const vagas = Math.max(0, Math.min(5, Number(C.vagasFundadores ?? 5)));
  $$("[data-vagas]").forEach((el) => { el.textContent = vagas; });
  $$(".dots").forEach((d) => {
    d.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < vagas ? "on" : ""}"></i>`).join("");
  });

  /* Conversa de demonstração */
  const chat = $("#chat");
  if (chat) {
    const MSGS = [
      { from: "cli", t: "Boa noite! Vocês têm horário para limpeza essa semana?", time: "23:04" },
      { from: "ia", t: "Boa noite! Temos sim. Quinta às 9h ou sexta às 14h. Qual fica melhor para você?", time: "23:04" },
      { from: "cli", t: "Sexta às 14h", time: "23:05" },
      { from: "ia", t: "Pronto, Mariana! Agendei sexta, 14h, com a Dra. Paula. Te mando um lembrete na quinta. Posso ajudar em mais alguma coisa?", time: "23:05" },
      { from: "cli", t: "Só isso, obrigada!", time: "23:05" },
    ];
    const bubble = (m) => {
      const b = document.createElement("div");
      b.className = `bubble ${m.from}`;
      b.textContent = m.t;
      const t = document.createElement("time");
      t.textContent = m.time;
      b.append(t);
      return b;
    };
    const status = () => {
      const s = document.createElement("div");
      s.className = "chat-status";
      s.textContent = "Consulta agendada em 41 segundos";
      return s;
    };
    if (reduce) {
      MSGS.forEach((m) => chat.append(bubble(m)));
      chat.append(status());
    } else {
      let visible = true;
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(chat);
      const waitVisible = async () => { while (!visible) await sleep(400); };
      (async function loop() {
        for (;;) {
          chat.replaceChildren();
          await sleep(700);
          for (const m of MSGS) {
            await waitVisible();
            if (m.from === "ia") {
              const typing = document.createElement("div");
              typing.className = "typing";
              typing.setAttribute("aria-hidden", "true");
              typing.innerHTML = "<i></i><i></i><i></i>";
              chat.append(typing);
              await sleep(1200);
              typing.remove();
            } else {
              await sleep(1000);
            }
            chat.append(bubble(m));
          }
          await sleep(600);
          chat.append(status());
          await sleep(5000);
        }
      })();
    }
  }

  /* Calculadora de custo do trabalho manual */
  const calc = $("#calc");
  let custoMensal = 0;
  if (calc) {
    const p = $("#calc-pessoas"), h = $("#calc-horas"), c = $("#calc-custo");
    const update = () => {
      const pessoas = +p.value, horas = +h.value, custo = +c.value;
      $("#out-pessoas").textContent = pessoas === 1 ? "1 pessoa" : `${pessoas} pessoas`;
      $("#out-horas").textContent = `${horas} h`;
      $("#out-custo").textContent = brl(custo);
      custoMensal = pessoas * horas * 4.33 * custo;
      $("#calc-mes").textContent = brl(custoMensal);
      $("#calc-ano").textContent = brl(custoMensal * 12);
    };
    [p, h, c].forEach((el) => el.addEventListener("input", update));
    update();
  }

  /* Aplicação em etapas: no fim, leva para o WhatsApp com o resumo das respostas */
  const dlg = $("#aplicacao");
  if (!dlg) return;
  const form = $("form", dlg), body = $(".apl-body", dlg), bar = $(".bar i", dlg), count = $(".count", dlg);
  const back = $("[data-back]", dlg), next = $("[data-next]", dlg), foot = $(".apl-foot", dlg);

  const STEPS = [
    { title: "Para começar, como falamos com você?", hint: "Leva 2 minutos. No fim, o WhatsApp abre com o resumo das suas respostas.",
      fields: [
        { name: "nome", label: "Seu nome", type: "text", autocomplete: "name" },
        { name: "whatsapp", label: "WhatsApp com DDD", type: "tel", autocomplete: "tel", inputmode: "tel" },
      ] },
    { title: "Qual é o seu cargo?", name: "cargo", options: ["Dono ou sócio", "Diretor", "Gerente", "Outro"] },
    { title: "Qual é a sua empresa?",
      fields: [
        { name: "empresa", label: "Nome da empresa", type: "text", autocomplete: "organization" },
        { name: "setor", label: "Setor (ex.: clínica, loja, indústria, escritório)", type: "text" },
      ] },
    { title: "Quantas pessoas trabalham na empresa?", name: "colaboradores", options: ["1 a 5", "6 a 20", "21 a 50", "51 a 200", "Mais de 200"] },
    { title: "Do que você mais precisa?", name: "necessidade", options: ["Agente de IA", "Automação de processos", "Sistema de gestão inteligente", "Site ou landing page", "Ainda não sei"] },
    { title: "Qual tarefa mais toma tempo da sua equipe hoje?", hint: "Uma ou duas frases já bastam.",
      fields: [{ name: "dor", label: "Ex.: responder clientes no WhatsApp, montar relatório, lançar pedidos", type: "textarea" }] },
    { title: "Se fizer sentido, quando quer começar?", name: "quando", options: ["Este mês", "Nos próximos 3 meses", "Só estou pesquisando"] },
    { title: "Quanto você pretende investir?", hint: "Isso nos ajuda a indicar o caminho certo para o seu projeto.", name: "investimento", options: ["Até R$ 3 mil", "R$ 3 a 10 mil", "R$ 10 a 25 mil", "Mais de R$ 25 mil"] },
  ];

  let i = 0;
  let a = store.get("zk_aplicacao") || {};
  let parcialEnviado = false;
  const save = () => store.set("zk_aplicacao", a);

  const trilha = (x) => {
    if (x.quando === "Só estou pesquisando") return "pesquisa";
    if (x.investimento === "Até R$ 3 mil") return "pronta";
    if (x.investimento === "R$ 3 a 10 mil") return "expressa";
    return "high";
  };

  const send = (etapa) => {
    if (!C.webhook) return;
    const payload = { ...a, etapa, trilha: etapa === "completa" ? trilha(a) : undefined, origem, pagina: location.href, data: new Date().toISOString() };
    try {
      fetch(C.webhook, { method: "POST", mode: "no-cors", keepalive: true,
        headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    } catch {}
  };

  const maskPhone = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  function render() {
    const s = STEPS[i];
    bar.style.width = `${(i / STEPS.length) * 100}%`;
    count.textContent = `${i + 1} de ${STEPS.length}`;
    foot.hidden = false;
    back.hidden = i === 0;
    next.hidden = !!s.options;
    next.firstChild.textContent = i === STEPS.length - 1 ? "Ir para o WhatsApp " : "Continuar ";

    const wrap = document.createElement("div");
    wrap.className = "step-in";
    wrap.style.display = "grid";
    wrap.style.gap = "18px";
    const h = document.createElement("h2");
    h.id = "apl-title";
    h.textContent = s.title;
    wrap.append(h);
    if (s.hint) { const p = document.createElement("p"); p.className = "hint"; p.textContent = s.hint; wrap.append(p); }

    if (s.options) {
      const list = document.createElement("div");
      list.className = "opts";
      s.options.forEach((o) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.textContent = o;
        b.setAttribute("aria-pressed", a[s.name] === o ? "true" : "false");
        b.addEventListener("click", () => {
          a[s.name] = o; save();
          $$(".opt", list).forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
          setTimeout(goNext, reduce ? 0 : 180);
        });
        list.append(b);
      });
      wrap.append(list);
    } else {
      s.fields.forEach((f) => {
        const label = document.createElement("label");
        label.className = "inp";
        label.textContent = f.label;
        const el = document.createElement(f.type === "textarea" ? "textarea" : "input");
        if (f.type !== "textarea") el.type = f.type;
        el.name = f.name;
        el.id = `apl-${f.name}`;
        if (f.autocomplete) el.autocomplete = f.autocomplete;
        if (f.inputmode) el.inputMode = f.inputmode;
        el.value = a[f.name] || "";
        el.addEventListener("input", () => {
          if (f.name === "whatsapp") el.value = maskPhone(el.value);
          a[f.name] = el.value; save();
        });
        label.append(el);
        wrap.append(label);
      });
    }
    const err = document.createElement("p");
    err.className = "err";
    err.setAttribute("role", "alert");
    wrap.append(err);

    body.replaceChildren(wrap);
    body.scrollTop = 0;
    const first = $("input, textarea, .opt[aria-pressed='true'], .opt", wrap);
    if (first && !matchMedia("(max-width: 560px)").matches) first.focus({ preventScroll: true });
  }

  function validate() {
    const s = STEPS[i];
    const err = $(".err", body);
    if (s.options) return !!a[s.name];
    for (const f of s.fields) {
      const v = (a[f.name] || "").trim();
      if (!v) { err.textContent = "Preencha este campo para continuar."; $(`#apl-${f.name}`).focus(); return false; }
      if (f.name === "whatsapp" && v.replace(/\D/g, "").length < 10) {
        err.textContent = "Confira o WhatsApp: precisa ter DDD e número.";
        $(`#apl-${f.name}`).focus();
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (!validate()) return;
    if (i === 0 && !parcialEnviado) { send("parcial"); parcialEnviado = true; }
    if (i < STEPS.length - 1) { i++; render(); } else finish();
  }

  function finish() {
    a.trilha = trilha(a);
    send("completa");
    bar.style.width = "100%";
    count.textContent = "Pronto";
    foot.hidden = true;

    const nome = (a.nome || "").split(" ")[0];

    // Resumo das 8 respostas, que vai pronto para o WhatsApp da Zunkuft
    const linhas = [
      "Olá! Acabei de responder as perguntas no site da Zunkuft.",
      "",
      `*Nome:* ${a.nome || "-"}`,
      `*Cargo:* ${a.cargo || "-"}`,
      `*Empresa:* ${a.empresa || "-"}${a.setor ? ` (${a.setor})` : ""}`,
      `*Equipe:* ${a.colaboradores || "-"} pessoas`,
      `*Preciso de:* ${a.necessidade || "-"}`,
      `*O que mais toma tempo hoje:* ${a.dor || "-"}`,
      `*Quando quero começar:* ${a.quando || "-"}`,
      `*Investimento previsto:* ${a.investimento || "-"}`,
    ];
    if (a.custo_estimado) linhas.push(`*Custo estimado do trabalho manual:* ${brl(a.custo_estimado)} por mês`);
    const wa = waLink(linhas.join("\n"));

    const box = document.createElement("div");
    box.className = "result step-in";
    box.innerHTML = `<div class="ok" aria-hidden="true">✓</div>`;
    const h = document.createElement("h2"); h.id = "apl-title";
    h.textContent = `Pronto, ${nome}! Agora é só enviar.`;
    const p = document.createElement("p"); p.className = "muted";
    p.textContent = wa
      ? "Vamos abrir o WhatsApp da Zunkuft com o resumo das suas respostas já escrito. Toque em enviar e você é atendido na hora."
      : `Recebemos suas respostas. Vamos te chamar no WhatsApp ${a.whatsapp || ""} em instantes.`;
    box.append(h, p);
    if (wa) {
      const el = document.createElement("a");
      el.className = "btn btn-primary"; el.href = wa; el.textContent = "Abrir o WhatsApp";
      box.append(el);
      setTimeout(() => { location.href = wa; }, reduce ? 300 : 1200);
    }
    body.replaceChildren(box);
    store.del("zk_aplicacao");
    a = {};
    i = 0;
    parcialEnviado = false;
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); goNext(); });
  back.addEventListener("click", () => { if (i > 0) { i--; render(); } });
  $("[data-close]", dlg).addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  const open = (extra) => {
    Object.assign(a, extra || {});
    save();
    i = 0;
    render();
    dlg.showModal();
  };
  $$("[data-aplicar]").forEach((b) => b.addEventListener("click", (e) => {
    e.preventDefault();
    const extra = {};
    if (b.hasAttribute("data-from-calc") && custoMensal) extra.custo_estimado = Math.round(custoMensal);
    if (b.dataset.pacote) extra.necessidade = "Site ou landing page";
    open(extra);
  }));
  if (location.hash === "#aplicar") open();

  /* Pacotes prontos */
  $$("[data-comprar]").forEach((b) => {
    const key = b.dataset.comprar;
    const nomePacote = b.dataset.nome || key;
    const pay = C.pagamentos && C.pagamentos[key];
    const wa = waLink(`Olá! Quero contratar o pacote ${nomePacote} da Zunkuft.`);
    if (pay || wa) {
      b.href = pay || wa; b.target = "_blank"; b.rel = "noopener";
    } else {
      b.addEventListener("click", (e) => { e.preventDefault(); open({ necessidade: "Site ou landing page", investimento: "Até R$ 3 mil" }); });
    }
  });
})();
