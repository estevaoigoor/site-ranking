import React, { useState, useRef, useEffect } from "react";

// ================= DESIGN SYSTEM (tema futurista) =================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
.cia-root{ --bg:#05070F; --panel:rgba(13,18,38,.62); --line:rgba(124,92,255,.22); --line2:rgba(34,211,238,.3);
 --txt:#E8ECFF; --mut:#8A93B2; --faint:#697291; --p1:#7C5CFF; --p2:#22D3EE; --p3:#F472B6; --ok:#34D399; --bad:#FB7185;
 font-family:'Space Grotesk',system-ui,sans-serif; color:var(--txt); background:#05070F; }
.cia-aurora{ position:fixed; inset:0; z-index:0; background:#05070F; overflow:hidden; }
.cia-aurora::before,.cia-aurora::after{ content:''; position:absolute; width:62vw; height:62vw; border-radius:50%;
 filter:blur(90px); opacity:.32; }
.cia-aurora::before{ background:radial-gradient(circle,#7C5CFF,transparent 62%); top:-22vw; left:-12vw;
 animation:ciaFloat 18s ease-in-out infinite alternate; }
.cia-aurora::after{ background:radial-gradient(circle,#22D3EE,transparent 62%); bottom:-26vw; right:-16vw;
 animation:ciaFloat 24s ease-in-out infinite alternate-reverse; }
@keyframes ciaFloat{ from{ transform:translate(0,0) scale(1);} to{ transform:translate(6vw,4vw) scale(1.18);} }
@media (prefers-reduced-motion: reduce){ .cia-aurora::before,.cia-aurora::after{ animation:none; } }
.cia-gridbg{ position:fixed; inset:0; z-index:0; pointer-events:none;
 background-image:linear-gradient(rgba(124,92,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,255,.05) 1px,transparent 1px);
 background-size:44px 44px; -webkit-mask-image:radial-gradient(ellipse at 30% 0%,black,transparent 72%);
 mask-image:radial-gradient(ellipse at 30% 0%,black,transparent 72%); }
.cia-card{ background:var(--panel); border:1px solid var(--line); border-radius:18px;
 backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
 transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.cia-card:hover{ border-color:rgba(124,92,255,.5); box-shadow:0 0 0 1px rgba(124,92,255,.22), 0 18px 44px -18px rgba(124,92,255,.5); }
.cia-lift:hover{ transform:translateY(-3px); }
.cia-btn{ font-family:inherit; cursor:pointer; transition:all .2s ease; }
.cia-btn-primary{ background:linear-gradient(135deg,#7C5CFF,#22D3EE); border:none; color:#05070F; font-weight:700;
 padding:11px 22px; border-radius:12px; font-size:14.5px; box-shadow:0 0 22px rgba(124,92,255,.38); }
.cia-btn-primary:hover:not(:disabled){ box-shadow:0 0 34px rgba(34,211,238,.55); transform:translateY(-1px); }
.cia-btn-primary:disabled{ opacity:.45; cursor:not-allowed; }
.cia-btn-ghost{ background:rgba(124,92,255,.08); border:1px solid var(--line); color:var(--txt);
 padding:10px 18px; border-radius:12px; font-weight:600; font-size:14px; }
.cia-btn-ghost:hover{ border-color:var(--line2); }
.cia-input{ width:100%; padding:12px 15px; border-radius:12px; border:1px solid var(--line);
 background:rgba(6,9,22,.75); color:var(--txt); font-size:14.5px; box-sizing:border-box; outline:none;
 font-family:inherit; transition:border-color .2s, box-shadow .2s; }
.cia-input::placeholder{ color:var(--faint); }
.cia-input:focus{ border-color:#22D3EE; box-shadow:0 0 0 3px rgba(34,211,238,.14); }
.cia-mono{ font-family:'JetBrains Mono',monospace; }
.cia-eyebrow{ font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.24em;
 text-transform:uppercase; color:var(--p2); }
.cia-gradtext{ background:linear-gradient(90deg,#7C5CFF,#22D3EE,#F472B6); -webkit-background-clip:text;
 background-clip:text; color:transparent; }
.cia-scroll::-webkit-scrollbar{ width:8px; height:8px; }
.cia-scroll::-webkit-scrollbar-thumb{ background:rgba(124,92,255,.3); border-radius:8px; }
.cia-scroll::-webkit-scrollbar-track{ background:transparent; }
.cia-root button:focus-visible,.cia-root input:focus-visible,.cia-root textarea:focus-visible{
 outline:2px solid #22D3EE; outline-offset:2px; }
`;

// ================= CONSTANTES =================
const TOM_OPCOES = [
  { id: "amigavel", emoji: "😊", nome: "Amigável e acolhedor", desc: "Fala como um amigo próximo, caloroso e simpático.", instr: "Use um tom caloroso, acolhedor e próximo. Trate a pessoa com simpatia, use uma linguagem gentil e demonstre empatia." },
  { id: "profissional", emoji: "💼", nome: "Profissional e formal", desc: "Sério, educado e objetivo — ideal para empresas.", instr: "Use um tom profissional, educado e objetivo. Seja formal, claro e direto, mantendo sempre a cordialidade." },
  { id: "descontraido", emoji: "😎", nome: "Descontraído e divertido", desc: "Leve, com bom humor e linguagem casual.", instr: "Use um tom leve, descontraído e bem-humorado. Pode usar linguagem casual e emojis com moderação." },
  { id: "tecnico", emoji: "🔬", nome: "Técnico e detalhista", desc: "Preciso, explica com riqueza de detalhes.", instr: "Use um tom técnico e preciso. Explique com detalhes, cite passos e seja rigoroso com as informações." },
  { id: "vendedor", emoji: "🚀", nome: "Vendedor e persuasivo", desc: "Entusiasmado, foca em benefícios e conversão.", instr: "Use um tom entusiasmado e persuasivo. Destaque benefícios, crie desejo e conduza a pessoa a tomar uma ação." },
  { id: "professor", emoji: "📚", nome: "Professor e didático", desc: "Explica passo a passo, com paciência e exemplos.", instr: "Use um tom didático e paciente. Explique passo a passo, dê exemplos simples e verifique se a pessoa entendeu." },
];
const EMOJIS = ["🤖","🦉","🐬","🦊","🐧","🦁","🐼","🦄","🌟","💡","🎯","🛟","💬","📞","🛍️","🍕","⚕️","⚖️","🏠","✈️","🎓","💰"];
const CORES = ["#7C5CFF","#22D3EE","#F472B6","#F59E0B","#34D399","#60A5FA","#FB7185","#A78BFA"];
const PASSOS = [
  { n: 1, titulo: "Identidade", sub: "Quem é o seu agente?", icone: "🪪" },
  { n: 2, titulo: "Personalidade", sub: "Como ele deve se comportar?", icone: "🎭" },
  { n: 3, titulo: "Conhecimento", sub: "O que ele precisa saber?", icone: "🧠" },
  { n: 4, titulo: "Teste", sub: "Converse e valide!", icone: "💬" },
];
const uid = () => Math.random().toString(36).slice(2, 10);

// ================= PERSISTÊNCIA LOCAL =================
const LS_AGENTES = "criaia_agentes";
const LS_API_KEY = "criaia_api_key";
function carregarAgentes() {
  try { const raw = localStorage.getItem(LS_AGENTES); return raw ? JSON.parse(raw) : []; }
  catch (e) { return []; }
}
function salvarAgentesLS(agentes) {
  try { localStorage.setItem(LS_AGENTES, JSON.stringify(agentes)); } catch (e) {}
}
function getApiKey() { try { return localStorage.getItem(LS_API_KEY) || ""; } catch (e) { return ""; } }
function setApiKey(k) { try { localStorage.setItem(LS_API_KEY, k); } catch (e) {} }

// ================= PROMPT DE SISTEMA =================
function montarSystemPrompt(a) {
  const tom = TOM_OPCOES.find(t => t.id === a.tomId);
  let p = `Você é ${a.nome}, um assistente de inteligência artificial.\n`;
  if (a.descricao) p += `\nSobre você: ${a.descricao}\n`;
  p += `\n## Sua personalidade e tom de voz\n${tom ? tom.instr : "Seja prestativo e claro."}\n`;
  if (a.instrucoes) p += `\n## Suas instruções e regras\n${a.instrucoes}\n`;
  if (a.publico) p += `\n## Seu público-alvo\nVocê conversa com: ${a.publico}\n`;
  if (a.saudacao) p += `\n## Primeira mensagem sugerida\n"${a.saudacao}"\n`;
  if (a.conhecimento && a.conhecimento.length) {
    p += `\n## Base de conhecimento (use estas informações para responder)\n`;
    p += `Responda SEMPRE com base nas informações abaixo. Se a resposta não estiver aqui e não for de conhecimento geral, diga educadamente que não tem essa informação.\n\n`;
    a.conhecimento.forEach((k, i) => {
      p += `--- Documento ${i + 1}: ${k.titulo} ---\n${k.conteudo}\n\n`;
    });
  }
  p += `\n## Regras gerais\n- Responda sempre em português do Brasil.\n- Seja claro e evite jargão técnico desnecessário.\n- Nunca invente informações que não estejam na sua base de conhecimento.`;
  return p;
}

// ================= CHAMADA À API =================
async function chamarIA(systemPrompt, historico) {
  const key = getApiKey();
  if (!key) {
    throw new Error("Cole sua chave da Anthropic em ⚙️ Configurações antes de testar o agente.");
  }
  const resp = await window.fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: historico.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  if (!resp.ok) {
    let detalhe = "";
    try { const j = await resp.json(); detalhe = j?.error?.message || ""; } catch (e) {}
    if (resp.status === 401) detalhe = "Chave inválida ou expirada. Confira em ⚙️ Configurações.";
    throw new Error(detalhe || `Erro ${resp.status}`);
  }
  const data = await resp.json();
  const txt = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
  return txt || "(sem resposta)";
}

// ================= EXTRAÇÃO DE PDF =================
let pdfjsPromise = null;
function carregarPDFJS() {
  if (pdfjsPromise) return pdfjsPromise;
  pdfjsPromise = new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    s.onerror = () => reject(new Error("Não foi possível carregar o leitor de PDF."));
    document.body.appendChild(s);
  });
  return pdfjsPromise;
}
async function extrairTextoPDF(file) {
  const pdfjs = await carregarPDFJS();
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  let texto = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    texto += content.items.map(it => it.str).join(" ") + "\n";
  }
  return texto.replace(/\s+/g, " ").trim();
}

// ================= UI: TOOLTIP =================
function Ajuda({ texto }) {
  const [aberto, setAberto] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 6 }}>
      <span onMouseEnter={() => setAberto(true)} onMouseLeave={() => setAberto(false)}
        onClick={() => setAberto(v => !v)}
        style={{ cursor: "help", width: 18, height: 18, display: "inline-flex", alignItems: "center",
          justifyContent: "center", borderRadius: "50%", background: "rgba(124,92,255,.18)",
          border: "1px solid rgba(124,92,255,.4)", color: "#C4B5FD", fontSize: 11, fontWeight: 700 }}>?</span>
      {aberto && (
        <span style={{ position: "absolute", bottom: "135%", left: "50%", transform: "translateX(-50%)",
          background: "#10142B", border: "1px solid rgba(124,92,255,.35)", color: "#E8ECFF",
          padding: "9px 12px", borderRadius: 10, fontSize: 12.5, width: 235, lineHeight: 1.45, zIndex: 50,
          boxShadow: "0 12px 30px rgba(0,0,0,.5), 0 0 20px rgba(124,92,255,.15)" }}>{texto}</span>
      )}
    </span>
  );
}

// ================= APP =================
export default function App() {
  const [tela, setTela] = useState("home"); // home | wizard | chat | whatsapp | config
  const [agentes, setAgentes] = useState(carregarAgentes);
  const [editId, setEditId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [onboarding, setOnboarding] = useState(true);
  const [waId, setWaId] = useState(null);
  const [rascunho, setRascunho] = useState(null);
  const [passo, setPasso] = useState(1);

  useEffect(() => { salvarAgentesLS(agentes); }, [agentes]);

  const novoAgente = () => {
    setEditId(null);
    setRascunho({ id: uid(), nome: "", emoji: "🤖", cor: "#7C5CFF", descricao: "",
      tomId: "amigavel", instrucoes: "", publico: "", saudacao: "", conhecimento: [] });
    setPasso(1);
    setTela("wizard");
  };
  const editarAgente = (a) => { setEditId(a.id); setRascunho({ ...a, conhecimento: [...a.conhecimento] }); setPasso(1); setTela("wizard"); };
  const duplicarAgente = (a) => setAgentes(v => [...v, { ...a, id: uid(), nome: a.nome + " (cópia)", whatsapp: null,
    conhecimento: a.conhecimento.map(k => ({ ...k, id: uid() })) }]);
  const excluirAgente = (id) => setAgentes(v => v.filter(x => x.id !== id));
  const abrirChat = (a) => { setChatId(a.id); setTela("chat"); };
  const abrirWhatsApp = (a) => { setWaId(a.id); setTela("whatsapp"); };
  const atualizarAgente = (novo) => setAgentes(v => v.map(x => x.id === novo.id ? novo : x));

  const salvarAgente = (r) => {
    const alvo = r || rascunho;
    setAgentes(v => v.some(x => x.id === alvo.id) ? v.map(x => x.id === alvo.id ? alvo : x) : [...v, alvo]);
  };

  return (
    <div className="cia-root" style={{ minHeight: "100vh", display: "flex", position: "relative" }}>
      <style>{CSS}</style>
      <div className="cia-aurora" />
      <div className="cia-gridbg" />

      {/* SIDEBAR */}
      <aside style={{ width: 250, background: "rgba(7,10,24,.72)", backdropFilter: "blur(18px)",
        borderRight: "1px solid rgba(124,92,255,.18)", padding: "26px 18px", position: "sticky", top: 0,
        height: "100vh", boxSizing: "border-box", flexShrink: 0, zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22, background: "linear-gradient(135deg,#7C5CFF,#22D3EE)",
            boxShadow: "0 0 26px rgba(124,92,255,.55)" }}>✨</div>
          <div>
            <div className="cia-gradtext" style={{ fontWeight: 700, fontSize: 21, letterSpacing: ".02em" }}>CriaIA</div>
            <div className="cia-eyebrow" style={{ marginTop: 2 }}>AI Agent Studio</div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <NavBtn ativo={tela === "home"} onClick={() => setTela("home")} icone="🏠" label="Meus Agentes" />
          <NavBtn ativo={tela === "wizard"} onClick={novoAgente} icone="➕" label="Criar Agente" />
          <NavBtn ativo={tela === "config"} onClick={() => setTela("config")} icone="⚙️" label="Configurações" />
        </nav>
        <div style={{ position: "absolute", bottom: 22, left: 18, right: 18, fontSize: 11.5,
          color: "var(--faint)", lineHeight: 1.6 }}>
          💡 Dica: comece criando um agente e teste na hora, sem precisar publicar nada.
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="cia-scroll" style={{ flex: 1, padding: "36px 42px", overflow: "auto",
        maxHeight: "100vh", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
        {tela === "home" && (
          <Home agentes={agentes} onNovo={novoAgente} onEditar={editarAgente} onExcluir={excluirAgente}
            onDuplicar={duplicarAgente} onTestar={abrirChat} onWhatsApp={abrirWhatsApp}
            onboarding={onboarding} setOnboarding={setOnboarding} />
        )}
        {tela === "wizard" && rascunho && (
          <Wizard rascunho={rascunho} setRascunho={setRascunho} passo={passo} setPasso={setPasso}
            onSalvar={salvarAgente} onConcluir={() => { salvarAgente(); setTela("home"); }} editId={editId} />
        )}
        {tela === "chat" && (
          <ChatPlayground agente={agentes.find(a => a.id === chatId)} onVoltar={() => setTela("home")} />
        )}
        {tela === "whatsapp" && (
          <TelaWhatsApp agente={agentes.find(a => a.id === waId)} onVoltar={() => setTela("home")} onAtualizar={atualizarAgente} />
        )}
        {tela === "config" && <TelaConfig onVoltar={() => setTela("home")} />}
      </main>
    </div>
  );
}

function NavBtn({ ativo, onClick, icone, label }) {
  return (
    <button className="cia-btn" onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 11,
      padding: "12px 15px", borderRadius: 12, textAlign: "left", fontSize: 14.5, fontWeight: 600,
      color: ativo ? "#E8ECFF" : "var(--mut)",
      background: ativo ? "rgba(124,92,255,.16)" : "transparent",
      border: ativo ? "1px solid rgba(124,92,255,.45)" : "1px solid transparent",
      boxShadow: ativo ? "0 0 18px rgba(124,92,255,.25)" : "none" }}>
      <span style={{ fontSize: 17 }}>{icone}</span>{label}
    </button>
  );
}

// ================= CONFIGURAÇÕES =================
function TelaConfig({ onVoltar }) {
  const [key, setKey] = useState(getApiKey());
  const [salvo, setSalvo] = useState(false);

  const salvar = () => {
    setApiKey(key.trim());
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div className="cia-eyebrow" style={{ marginBottom: 8 }}>Configurações</div>
      <h1 style={{ fontSize: 27, margin: "0 0 4px", fontWeight: 700 }}>
        Sua chave da <span className="cia-gradtext">Anthropic</span>
      </h1>
      <p style={{ color: "var(--mut)", marginTop: 4, fontSize: 14.5, lineHeight: 1.65 }}>
        Necessária pra testar seus agentes no chat e usar a entrevista guiada. Crie a sua grátis em{" "}
        <b style={{ color: "#E8ECFF" }}>console.anthropic.com</b>.
      </p>
      <div className="cia-card" style={{ padding: 24, marginTop: 20 }}>
        <Campo label="Chave de API" ajuda="Começa com 'sk-ant-'. Fica salva apenas neste navegador — nunca é enviada a nenhum servidor do CriaIA.">
          <input className="cia-input cia-mono" type="password" value={key} onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-..." />
        </Campo>
        <button className="cia-btn cia-btn-primary" onClick={salvar}>💾 Salvar chave</button>
        {salvo && <span style={{ marginLeft: 12, color: "#34D399", fontSize: 13.5, fontWeight: 600 }}>✅ Salva neste navegador!</span>}
        <p style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 16, marginBottom: 0 }}>
          🔒 Guardada só no seu navegador (localStorage). Se limpar dados do site, precisa colar de novo.
        </p>
      </div>
      <button className="cia-btn cia-btn-ghost" onClick={onVoltar} style={{ marginTop: 20 }}>← Voltar</button>
    </div>
  );
}

// ================= HOME / DASHBOARD =================
function Home({ agentes, onNovo, onEditar, onExcluir, onDuplicar, onTestar, onWhatsApp, onboarding, setOnboarding }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div className="cia-eyebrow" style={{ marginBottom: 8 }}>Painel de controle</div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700 }}>
            Meus <span className="cia-gradtext">Agentes de IA</span>
          </h1>
          <p style={{ margin: "8px 0 0", color: "var(--mut)", fontSize: 14.5 }}>Crie, treine e teste assistentes inteligentes em minutos.</p>
        </div>
        <button className="cia-btn cia-btn-primary" onClick={onNovo}>➕ Criar novo agente</button>
      </div>

      {onboarding && agentes.length === 0 && (
        <div className="cia-card" style={{ padding: 26, marginBottom: 26, position: "relative",
          borderColor: "rgba(34,211,238,.3)" }}>
          <button className="cia-btn" onClick={() => setOnboarding(false)} style={{ position: "absolute", top: 12, right: 14,
            border: "none", background: "transparent", fontSize: 18, color: "var(--faint)" }}>✕</button>
          <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>👋 Bem-vindo(a) ao <span className="cia-gradtext">CriaIA</span>!</h3>
          <p style={{ margin: "0 0 8px", color: "var(--mut)", lineHeight: 1.7, fontSize: 14 }}>
            Aqui você cria seu próprio assistente de inteligência artificial <b style={{ color: "#E8ECFF" }}>sem precisar programar</b>.
            É só responder algumas perguntas simples. Nós cuidamos da parte técnica.
          </p>
          <ol style={{ margin: "8px 0 0", paddingLeft: 20, color: "var(--mut)", lineHeight: 1.9, fontSize: 14 }}>
            <li><b style={{ color: "#E8ECFF" }}>Identidade:</b> dê um nome e um rostinho ao seu agente.</li>
            <li><b style={{ color: "#E8ECFF" }}>Personalidade:</b> escolha como ele conversa.</li>
            <li><b style={{ color: "#E8ECFF" }}>Conhecimento:</b> ensine o que ele precisa saber.</li>
            <li><b style={{ color: "#E8ECFF" }}>Teste:</b> converse com ele na hora para ver se ficou bom!</li>
          </ol>
          <button className="cia-btn cia-btn-primary" onClick={onNovo} style={{ marginTop: 18 }}>Começar agora →</button>
        </div>
      )}

      {agentes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--faint)" }}>
          <div style={{ fontSize: 58, filter: "drop-shadow(0 0 20px rgba(124,92,255,.5))" }}>🤖</div>
          <p style={{ fontSize: 15.5 }}>Você ainda não tem agentes. Que tal criar o primeiro?</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 18 }}>
          {agentes.map(a => (
            <CartaoAgente key={a.id} agente={a} onTestar={onTestar} onWhatsApp={onWhatsApp}
              onEditar={onEditar} onDuplicar={onDuplicar} onExcluir={onExcluir} />
          ))}
        </div>
      )}
    </div>
  );
}

function CartaoAgente({ agente: a, onTestar, onWhatsApp, onEditar, onDuplicar, onExcluir }) {
  const [confirmando, setConfirmando] = useState(false);
  return (
    <div className="cia-card cia-lift" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: a.cor, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 26,
          boxShadow: "0 0 20px " + a.cor + "66" }}>{a.emoji}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{a.nome || "Sem nome"}</div>
          <div className="cia-mono" style={{ fontSize: 11, color: "var(--faint)" }}>{(a.conhecimento || []).length} item(ns) de conhecimento</div>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: "var(--mut)", margin: "0 0 16px", minHeight: 40, lineHeight: 1.55 }}>
        {a.descricao || "Sem descrição."}
      </p>
      {!confirmando ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="cia-btn" onClick={() => onTestar(a)} style={btnMini("linear-gradient(135deg,#7C5CFF,#22D3EE)", "#05070F")}>💬 Testar</button>
          <button className="cia-btn" onClick={() => onWhatsApp(a)} style={btnMini("rgba(52,211,153,.14)", "#34D399")}>
            {a.whatsapp?.phoneNumberId ? "📲 WhatsApp ✓" : "📲 WhatsApp"}
          </button>
          <button className="cia-btn" onClick={() => onEditar(a)} style={btnMini("rgba(124,92,255,.14)", "#C4B5FD")}>✏️ Editar</button>
          <button className="cia-btn" onClick={() => onDuplicar(a)} style={btnMini("rgba(232,236,255,.07)", "var(--mut)")}>⧉ Duplicar</button>
          <button className="cia-btn" onClick={() => setConfirmando(true)} style={btnMini("rgba(251,113,133,.12)", "#FB7185")}>🗑️</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#FB7185", fontWeight: 600 }}>Excluir "{a.nome}"? Não tem como desfazer.</span>
          <button className="cia-btn" onClick={() => onExcluir(a.id)} style={btnMini("rgba(251,113,133,.9)", "#05070F")}>Sim, excluir</button>
          <button className="cia-btn" onClick={() => setConfirmando(false)} style={btnMini("rgba(232,236,255,.07)", "var(--mut)")}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

// ================= WIZARD =================
function Wizard({ rascunho, setRascunho, passo, setPasso, onSalvar, onConcluir, editId }) {
  const set = (campo, valor) => setRascunho(r => ({ ...r, [campo]: valor }));
  const podeAvancar = passo === 1 ? rascunho.nome.trim().length > 0 : true;

  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <div className="cia-eyebrow" style={{ marginBottom: 8 }}>{editId ? "Modo edição" : "Novo agente"}</div>
      <h1 style={{ fontSize: 27, margin: "0 0 4px", fontWeight: 700 }}>
        {editId ? "Editar agente" : <span>Criar <span className="cia-gradtext">novo agente</span></span>}
      </h1>
      <p style={{ color: "var(--mut)", marginTop: 4, fontSize: 14.5 }}>Siga os 4 passos. É rapidinho! 🚀</p>

      {/* PROGRESSO */}
      <div style={{ display: "flex", gap: 10, margin: "26px 0 28px" }}>
        {PASSOS.map(p => (
          <div key={p.n} onClick={() => (p.n < passo || podeAvancar) && setPasso(p.n)}
            style={{ flex: 1, cursor: "pointer" }}>
            <div style={{ height: 5, borderRadius: 4, marginBottom: 9,
              background: p.n <= passo ? "linear-gradient(90deg,#7C5CFF,#22D3EE)" : "rgba(124,92,255,.14)",
              boxShadow: p.n <= passo ? "0 0 12px rgba(124,92,255,.5)" : "none" }} />
            <div style={{ fontSize: 12.5, fontWeight: 700, color: p.n <= passo ? "#22D3EE" : "var(--faint)" }}>
              {p.icone} {p.titulo}
            </div>
            <div style={{ fontSize: 11, color: "var(--faint)" }}>{p.sub}</div>
          </div>
        ))}
      </div>

      <div className="cia-card" style={{ padding: 30 }}>
        {passo === 1 && <PassoIdentidade rascunho={rascunho} set={set} />}
        {passo === 2 && <PassoPersonalidade rascunho={rascunho} set={set} />}
        {passo === 3 && <PassoConhecimento rascunho={rascunho} set={set} />}
        {passo === 4 && <PassoTeste rascunho={rascunho} onSalvar={onSalvar} />}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <button className="cia-btn cia-btn-ghost" onClick={() => passo > 1 ? setPasso(passo - 1) : null}
          style={{ visibility: passo > 1 ? "visible" : "hidden" }}>← Voltar</button>
        {passo < 4 ? (
          <button className="cia-btn cia-btn-primary" onClick={() => { if (podeAvancar) { onSalvar(rascunho); setPasso(passo + 1); } }}
            disabled={!podeAvancar}>
            Continuar →
          </button>
        ) : (
          <button className="cia-btn cia-btn-primary" onClick={onConcluir}
            style={{ background: "linear-gradient(135deg,#34D399,#22D3EE)", boxShadow: "0 0 22px rgba(52,211,153,.4)" }}>
            ✔️ Salvar e concluir
          </button>
        )}
      </div>
    </div>
  );
}

function Campo({ label, ajuda, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 14.5, marginBottom: 9, color: "#E8ECFF" }}>
        {label}{ajuda && <Ajuda texto={ajuda} />}
      </label>
      {children}
    </div>
  );
}

function PassoIdentidade({ rascunho, set }) {
  return (
    <div>
      <h3 style={{ marginTop: 0, fontSize: 17 }}>🪪 Identidade do agente</h3>
      <Campo label="Nome do agente" ajuda="É como o seu assistente vai se apresentar. Ex: 'Sofia', 'Assistente da Loja Bella'.">
        <input className="cia-input" value={rascunho.nome} onChange={e => set("nome", e.target.value)}
          placeholder="Ex: Sofia, a atendente virtual" />
      </Campo>
      <Campo label="Escolha um rosto (emoji)" ajuda="Um ícone simpático para representar seu agente.">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {EMOJIS.map(e => (
            <button key={e} className="cia-btn" onClick={() => set("emoji", e)} style={{ width: 44, height: 44, fontSize: 22,
              borderRadius: 12,
              border: rascunho.emoji === e ? "1px solid #22D3EE" : "1px solid rgba(124,92,255,.2)",
              background: rascunho.emoji === e ? "rgba(34,211,238,.12)" : "rgba(6,9,22,.6)",
              boxShadow: rascunho.emoji === e ? "0 0 14px rgba(34,211,238,.35)" : "none" }}>{e}</button>
          ))}
        </div>
      </Campo>
      <Campo label="Cor do agente" ajuda="A cor de destaque que aparece no painel.">
        <div style={{ display: "flex", gap: 10 }}>
          {CORES.map(c => (
            <button key={c} className="cia-btn" onClick={() => set("cor", c)} style={{ width: 36, height: 36, borderRadius: "50%",
              background: c,
              border: rascunho.cor === c ? "2px solid #E8ECFF" : "2px solid transparent",
              boxShadow: rascunho.cor === c ? "0 0 16px " + c : "0 0 8px " + c + "55" }} />
          ))}
        </div>
      </Campo>
      <Campo label="Descrição curta" ajuda="Uma frase que explica para que serve o agente.">
        <input className="cia-input" value={rascunho.descricao} onChange={e => set("descricao", e.target.value)}
          placeholder="Ex: Tira dúvidas sobre produtos e horários da loja." />
      </Campo>
    </div>
  );
}

function PassoPersonalidade({ rascunho, set }) {
  return (
    <div>
      <h3 style={{ marginTop: 0, fontSize: 17 }}>🎭 Personalidade e comportamento</h3>
      <Campo label="Como seu agente deve conversar?" ajuda="O tom de voz define o jeitão do seu assistente ao responder.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
          {TOM_OPCOES.map(t => (
            <button key={t.id} className="cia-btn" onClick={() => set("tomId", t.id)} style={{ textAlign: "left", padding: 15,
              borderRadius: 14,
              border: rascunho.tomId === t.id ? "1px solid #22D3EE" : "1px solid rgba(124,92,255,.2)",
              background: rascunho.tomId === t.id ? "rgba(34,211,238,.1)" : "rgba(6,9,22,.55)",
              boxShadow: rascunho.tomId === t.id ? "0 0 18px rgba(34,211,238,.25)" : "none" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#E8ECFF" }}>{t.emoji} {t.nome}</div>
              <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 5, lineHeight: 1.45 }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </Campo>
      <Campo label="Instruções e regras (opcional)" ajuda="Diga o que ele DEVE e NÃO DEVE fazer. Escreva com suas palavras, sem termos técnicos.">
        <textarea className="cia-input" value={rascunho.instrucoes} onChange={e => set("instrucoes", e.target.value)} rows={4}
          placeholder={"Ex: Sempre pergunte o nome da pessoa. Nunca prometa descontos. Se perguntarem sobre preços, mande a pessoa falar com um vendedor."}
          style={{ resize: "vertical" }} />
      </Campo>
      <Campo label="Público-alvo (opcional)" ajuda="Com quem seu agente vai falar? Isso ajuda a IA a ajustar a linguagem.">
        <input className="cia-input" value={rascunho.publico} onChange={e => set("publico", e.target.value)}
          placeholder="Ex: clientes de uma loja de roupas femininas" />
      </Campo>
      <Campo label="Mensagem de boas-vindas (opcional)" ajuda="A primeira frase que o agente diz ao iniciar a conversa.">
        <input className="cia-input" value={rascunho.saudacao} onChange={e => set("saudacao", e.target.value)}
          placeholder="Ex: Oi! Eu sou a Sofia 😊 Como posso te ajudar hoje?" />
      </Campo>
    </div>
  );
}

function PassoConhecimento({ rascunho, set }) {
  const [aba, setAba] = useState("texto");
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const fileRef = useRef();

  const addTexto = () => {
    if (!conteudo.trim()) return;
    set("conhecimento", [...rascunho.conhecimento,
      { id: uid(), titulo: titulo.trim() || "Anotação", conteudo: conteudo.trim(), tipo: "texto" }]);
    setTitulo(""); setConteudo("");
  };

  const onArquivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErro(""); setCarregando(true);
    try {
      let texto = "";
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        texto = await extrairTextoPDF(file);
        if (!texto) throw new Error("Não consegui ler o texto deste PDF. Ele pode ser uma imagem escaneada.");
      } else {
        texto = await file.text();
      }
      set("conhecimento", [...rascunho.conhecimento,
        { id: uid(), titulo: file.name, conteudo: texto, tipo: "arquivo" }]);
    } catch (err) {
      setErro("😕 " + (err.message || "Não foi possível ler o arquivo."));
    } finally {
      setCarregando(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remover = (id) => set("conhecimento", rascunho.conhecimento.filter(k => k.id !== id));

  return (
    <div>
      <h3 style={{ marginTop: 0, fontSize: 17 }}>🧠 O que seu agente precisa saber?</h3>
      <p style={{ color: "var(--mut)", marginTop: 0, fontSize: 14, lineHeight: 1.6 }}>
        Ensine o agente com textos ou documentos. Ele vai usar essas informações para responder. <b style={{ color: "#E8ECFF" }}>É opcional</b>, mas deixa o agente muito mais útil!
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button className="cia-btn" onClick={() => setAba("texto")} style={abaBtn(aba === "texto")}>✍️ Colar texto</button>
        <button className="cia-btn" onClick={() => setAba("arquivo")} style={abaBtn(aba === "arquivo")}>📎 Enviar arquivo</button>
        <button className="cia-btn" onClick={() => setAba("entrevista")} style={abaBtn(aba === "entrevista")}>🎓 Entrevista guiada</button>
      </div>

      {aba === "texto" && (
        <div style={{ background: "rgba(6,9,22,.55)", border: "1px solid rgba(124,92,255,.16)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
          <input className="cia-input" value={titulo} onChange={e => setTitulo(e.target.value)}
            placeholder="Título (ex: Horário de funcionamento)" style={{ marginBottom: 10 }} />
          <textarea className="cia-input" value={conteudo} onChange={e => setConteudo(e.target.value)} rows={4}
            placeholder="Cole aqui uma informação. Ex: Nossa loja abre de segunda a sexta, das 9h às 18h..."
            style={{ resize: "vertical" }} />
          <button className="cia-btn cia-btn-primary" onClick={addTexto} style={{ marginTop: 12 }}>➕ Adicionar conhecimento</button>
        </div>
      )}
      {aba === "arquivo" && (
        <div style={{ background: "rgba(6,9,22,.55)", border: "1px dashed rgba(34,211,238,.4)", borderRadius: 14, padding: 20, marginBottom: 18, textAlign: "center" }}>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md,text/plain" onChange={onArquivo} style={{ display: "none" }} />
          <div style={{ fontSize: 40, filter: "drop-shadow(0 0 14px rgba(34,211,238,.5))" }}>📄</div>
          <p style={{ color: "var(--mut)", margin: "8px 0 12px", fontSize: 13.5 }}>Envie um arquivo <b style={{ color: "#E8ECFF" }}>PDF</b>, <b style={{ color: "#E8ECFF" }}>.txt</b> ou <b style={{ color: "#E8ECFF" }}>.md</b>. Nós extraímos o texto automaticamente.</p>
          <button className="cia-btn cia-btn-primary" onClick={() => fileRef.current.click()} disabled={carregando}>
            {carregando ? "⏳ Lendo arquivo..." : "📎 Escolher arquivo"}
          </button>
          {erro && <p style={{ color: "#FB7185", fontSize: 13, marginTop: 12 }}>{erro}</p>}
        </div>
      )}
      {aba === "entrevista" && <Entrevista rascunho={rascunho} set={set} />}

      <div>
        <div className="cia-eyebrow" style={{ marginBottom: 10 }}>
          Conhecimento adicionado ({rascunho.conhecimento.length})
        </div>
        {rascunho.conhecimento.length === 0 ? (
          <p style={{ color: "var(--faint)", fontSize: 13.5 }}>Nada ainda. Você pode pular este passo se quiser.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rascunho.conhecimento.map(k => (
              <div key={k.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "rgba(6,9,22,.55)", border: "1px solid rgba(124,92,255,.18)", borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{k.tipo === "arquivo" ? "📄" : k.tipo === "entrevista" ? "🎓" : "✍️"} {k.titulo}</div>
                  <div style={{ fontSize: 12, color: "var(--faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 480 }}>
                    {k.conteudo.slice(0, 90)}...
                  </div>
                </div>
                <button className="cia-btn" onClick={() => remover(k.id)} style={btnMini("rgba(251,113,133,.12)", "#FB7185")}>Remover</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ================= ENTREVISTA GUIADA =================
const PROMPT_ENTREVISTADOR = (tema, nomeAgente) => `Você é um entrevistador especialista em levantamento de conhecimento para treinar assistentes de IA.
O usuário quer ensinar o assistente "${nomeAgente}" sobre o tema: "${tema}".

Sua missão: fazer perguntas, UMA de cada vez, para extrair do usuário o MÁXIMO de conhecimento útil sobre esse tema.

Regras:
- Faça apenas UMA pergunta por mensagem, curta, clara e em português simples do Brasil.
- Comece pelas informações mais essenciais e vá aprofundando com base nas respostas.
- Seja proativo e curioso: pergunte sobre detalhes, números, valores, prazos, exceções, casos especiais, procedimentos passo a passo, dúvidas frequentes e tudo que um cliente ou usuário poderia querer saber sobre o tema.
- Se uma resposta abrir novos assuntos, explore-os antes de mudar de tópico.
- Não repita perguntas já feitas.
- Se o usuário disser que não sabe ou pedir para pular, mude para outro aspecto do tema.
- Responda APENAS com a próxima pergunta, sem comentários, elogios ou explicações extras.`;

function Entrevista({ rascunho, set }) {
  const [tema, setTema] = useState("");
  const [iniciada, setIniciada] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const fimRef = useRef();

  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, carregando]);

  const proximaPergunta = async (historico) => {
    setCarregando(true); setErro("");
    try {
      const p = await chamarIA(PROMPT_ENTREVISTADOR(tema, rascunho.nome || "meu agente"), historico);
      setMsgs([...historico, { role: "assistant", content: p }]);
    } catch (err) {
      setErro("😕 Não consegui gerar a próxima pergunta. Tente de novo. (" + err.message + ")");
      setMsgs(historico);
    } finally { setCarregando(false); }
  };

  const iniciar = () => {
    if (!tema.trim() || carregando) return;
    setIniciada(true);
    proximaPergunta([{ role: "user", content: "Vamos começar. Faça a primeira pergunta sobre o tema." }]);
  };

  const responder = () => {
    if (!resposta.trim() || carregando) return;
    const historico = [...msgs, { role: "user", content: resposta.trim() }];
    setResposta("");
    proximaPergunta(historico);
  };

  const pular = () => {
    if (carregando) return;
    proximaPergunta([...msgs, { role: "user", content: "Não tenho essa informação. Pode pular para outro aspecto do tema." }]);
  };

  // Monta os pares pergunta/resposta reais (ignora a mensagem inicial e os "pular")
  const pares = [];
  for (let i = 0; i < msgs.length - 1; i++) {
    if (msgs[i].role === "assistant" && msgs[i + 1]?.role === "user"
      && !msgs[i + 1].content.startsWith("Não tenho essa informação")) {
      pares.push({ p: msgs[i].content, r: msgs[i + 1].content });
    }
  }

  const concluir = () => {
    if (pares.length) {
      const conteudo = pares.map(x => `Pergunta: ${x.p}\nResposta: ${x.r}`).join("\n\n");
      set("conhecimento", [...rascunho.conhecimento,
        { id: uid(), titulo: `Entrevista: ${tema}`, conteudo, tipo: "entrevista" }]);
    }
    setIniciada(false); setMsgs([]); setTema(""); setResposta(""); setErro("");
  };

  if (!iniciada) {
    return (
      <div style={{ background: "rgba(6,9,22,.55)", border: "1px solid rgba(124,92,255,.16)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
        <p style={{ color: "var(--mut)", fontSize: 13.5, marginTop: 0, lineHeight: 1.65 }}>
          🎓 <b style={{ color: "#E8ECFF" }}>Como funciona:</b> você escolhe um tema e a IA te entrevista, fazendo perguntas
          inteligentes para descobrir tudo que o agente precisa saber. Você só responde — nós
          organizamos tudo na base de conhecimento automaticamente!
        </p>
        <input className="cia-input" value={tema} onChange={e => setTema(e.target.value)}
          onKeyDown={e => e.key === "Enter" && iniciar()}
          placeholder="Qual o tema? Ex: Horários e políticas de troca da minha loja"
          style={{ marginBottom: 12 }} />
        <button className="cia-btn cia-btn-primary" onClick={iniciar} disabled={!tema.trim() || carregando}>
          {carregando ? "⏳ Preparando..." : "🎤 Iniciar entrevista"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "rgba(6,9,22,.55)", border: "1px solid rgba(124,92,255,.16)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5 }}>🎤 Entrevista: {tema}</div>
        <div className="cia-mono" style={{ fontSize: 11, color: "#22D3EE" }}>{pares.length} resposta(s) coletada(s)</div>
      </div>
      <div className="cia-scroll" style={{ height: 280, overflowY: "auto", background: "rgba(5,7,15,.6)",
        border: "1px solid rgba(124,92,255,.18)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
        {msgs.filter((m, i) => i > 0).map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{ maxWidth: "82%", padding: "9px 13px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.55,
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? "linear-gradient(135deg,#7C5CFF,#22D3EE)" : "rgba(124,92,255,.14)",
              color: m.role === "user" ? "#05070F" : "#D6DCFF",
              fontWeight: m.role === "user" ? 600 : 400,
              border: m.role === "user" ? "none" : "1px solid rgba(124,92,255,.25)" }}>
              {m.role === "assistant" ? "🎓 " : ""}{m.content}
            </div>
          </div>
        ))}
        {carregando && <div style={{ color: "var(--faint)", fontSize: 13 }}>🎓 Pensando na próxima pergunta…</div>}
        <div ref={fimRef} />
      </div>
      {erro && <p style={{ color: "#FB7185", fontSize: 13, margin: "0 0 8px" }}>{erro}</p>}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input className="cia-input" value={resposta} onChange={e => setResposta(e.target.value)}
          onKeyDown={e => e.key === "Enter" && responder()}
          placeholder="Digite sua resposta..." disabled={carregando} />
        <button className="cia-btn cia-btn-primary" onClick={responder} disabled={carregando || !resposta.trim()}>➤</button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="cia-btn" onClick={pular} disabled={carregando} style={btnMini("rgba(232,236,255,.07)", "var(--mut)")}>⏭️ Não sei / pular pergunta</button>
        <button className="cia-btn" onClick={concluir} style={btnMini("rgba(52,211,153,.16)", "#34D399")}>✔️ Concluir e salvar conhecimento</button>
      </div>
    </div>
  );
}

function PassoTeste({ rascunho, onSalvar }) {
  useEffect(() => { onSalvar(rascunho); }, []);
  return (
    <div>
      <h3 style={{ marginTop: 0, fontSize: 17 }}>💬 Teste seu agente agora!</h3>
      <p style={{ color: "var(--mut)", marginTop: 0, fontSize: 14, lineHeight: 1.6 }}>
        Converse com <b style={{ color: "#E8ECFF" }}>{rascunho.nome}</b> para ver se ele responde do jeito que você quer.
        Se algo não ficou bom, volte e ajuste. 😉
      </p>
      <ChatBox agente={rascunho} altura={380} />
      <p style={{ color: "var(--faint)", fontSize: 12.5, marginTop: 14 }}>
        Gostou? Clique em <b style={{ color: "var(--mut)" }}>"Salvar e concluir"</b> abaixo. Não gostou? Volte aos passos anteriores e refine.
      </p>
    </div>
  );
}

// ================= PLAYGROUND (tela cheia) =================
function ChatPlayground({ agente, onVoltar }) {
  if (!agente) return <div><button className="cia-btn cia-btn-ghost" onClick={onVoltar}>← Voltar</button><p>Agente não encontrado.</p></div>;
  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <button className="cia-btn cia-btn-ghost" onClick={onVoltar} style={{ marginBottom: 18 }}>← Voltar aos agentes</button>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, background: agente.cor, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 28,
          boxShadow: "0 0 24px " + agente.cor + "77" }}>{agente.emoji}</div>
        <div>
          <div className="cia-eyebrow" style={{ marginBottom: 3 }}>Playground de teste</div>
          <h1 style={{ margin: 0, fontSize: 24 }}>{agente.nome}</h1>
          <p style={{ margin: "2px 0 0", color: "var(--mut)", fontSize: 13.5 }}>{agente.descricao || "Converse e valide seu agente."}</p>
        </div>
      </div>
      <ChatBox agente={agente} altura={480} />
    </div>
  );
}

// ================= WHATSAPP (META CLOUD API) =================
function gerarCodigoServidor(agente, config) {
  const sp = JSON.stringify(montarSystemPrompt(agente));
  return '// Servidor de respostas automáticas — agente "' + (agente.nome || "meu agente") + '" (gerado pelo CriaIA)\n'
    + '// Como usar: 1) instale o Node.js  2) rode: npm install express\n'
    + '// 3) preencha as chaves abaixo  4) rode: node servidor.js\n'
    + '// 5) publique em um serviço como Render ou Railway (plano gratuito serve para testar)\n'
    + '// 6) no painel da Meta (developers.facebook.com), em WhatsApp > Configuration,\n'
    + '//    cadastre o Webhook com a sua URL pública + /webhook e o VERIFY_TOKEN abaixo,\n'
    + '//    e assine o campo "messages".\n\n'
    + 'const express = require("express");\n'
    + 'const app = express();\n'
    + 'app.use(express.json());\n\n'
    + 'const WHATSAPP_TOKEN = "' + (config.token || "COLE_SEU_TOKEN_DA_META_AQUI") + '";\n'
    + 'const PHONE_NUMBER_ID = "' + (config.phoneNumberId || "COLE_SEU_PHONE_NUMBER_ID_AQUI") + '";\n'
    + 'const ANTHROPIC_API_KEY = "COLE_SUA_CHAVE_DA_ANTHROPIC_AQUI"; // crie em console.anthropic.com\n'
    + 'const VERIFY_TOKEN = "criaia123";\n\n'
    + 'const SYSTEM_PROMPT = ' + sp + ';\n\n'
    + '// A Meta chama esta rota uma única vez para confirmar o webhook\n'
    + 'app.get("/webhook", (req, res) => {\n'
    + '  if (req.query["hub.verify_token"] === VERIFY_TOKEN) return res.send(req.query["hub.challenge"]);\n'
    + '  res.sendStatus(403);\n'
    + '});\n\n'
    + '// Recebe as mensagens do WhatsApp e responde com o agente\n'
    + 'app.post("/webhook", async (req, res) => {\n'
    + '  res.sendStatus(200);\n'
    + '  try {\n'
    + '    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];\n'
    + '    if (!msg || msg.type !== "text") return;\n'
    + '    const resposta = await perguntarAoAgente(msg.text.body);\n'
    + '    await fetch("https://graph.facebook.com/v21.0/" + PHONE_NUMBER_ID + "/messages", {\n'
    + '      method: "POST",\n'
    + '      headers: { "Content-Type": "application/json", Authorization: "Bearer " + WHATSAPP_TOKEN },\n'
    + '      body: JSON.stringify({ messaging_product: "whatsapp", to: msg.from, type: "text", text: { body: resposta } }),\n'
    + '    });\n'
    + '  } catch (e) { console.error(e); }\n'
    + '});\n\n'
    + 'async function perguntarAoAgente(texto) {\n'
    + '  const r = await fetch("https://api.anthropic.com/v1/messages", {\n'
    + '    method: "POST",\n'
    + '    headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },\n'
    + '    body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: 500, system: SYSTEM_PROMPT,\n'
    + '      messages: [{ role: "user", content: texto }] }),\n'
    + '  });\n'
    + '  const data = await r.json();\n'
    + '  return data?.content?.[0]?.text || "Desculpe, não consegui responder agora.";\n'
    + '}\n\n'
    + 'app.listen(process.env.PORT || 3000, () => console.log("Agente no ar! 🚀"));\n';
}

function TelaWhatsApp({ agente, onVoltar, onAtualizar }) {
  const [token, setToken] = useState(agente?.whatsapp?.token || "");
  const [phoneId, setPhoneId] = useState(agente?.whatsapp?.phoneNumberId || "");
  const [numeroTeste, setNumeroTeste] = useState("");
  const [status, setStatus] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [mostrarCodigo, setMostrarCodigo] = useState(false);

  if (!agente) return <div><button className="cia-btn cia-btn-ghost" onClick={onVoltar}>← Voltar</button><p>Agente não encontrado.</p></div>;

  const conectado = !!(agente.whatsapp?.token && agente.whatsapp?.phoneNumberId);
  const statusOk = status.startsWith("🎉") || status.startsWith("✅");

  const salvar = () => {
    if (!token.trim() || !phoneId.trim()) { setStatus("⚠️ Preencha o Token e o Phone Number ID antes de salvar."); return; }
    onAtualizar({ ...agente, whatsapp: { token: token.trim(), phoneNumberId: phoneId.trim() } });
    setStatus("✅ Dados salvos neste agente! Agora envie uma mensagem de teste logo abaixo.");
  };

  const enviarTeste = async () => {
    if (!token.trim() || !phoneId.trim() || !numeroTeste.trim()) {
      setStatus("⚠️ Preencha o Token, o Phone Number ID e o número de teste (com DDI, ex: 5513999999999)."); return;
    }
    setEnviando(true); setStatus("");
    try {
      const r = await window.fetch("https://graph.facebook.com/v21.0/" + phoneId.trim() + "/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token.trim() },
        body: JSON.stringify({ messaging_product: "whatsapp", to: numeroTeste.replace(/\D/g, ""),
          type: "template", template: { name: "hello_world", language: { code: "en_US" } } }),
      });
      const data = await r.json();
      if (r.ok) setStatus("🎉 Mensagem enviada! Abra o WhatsApp do número " + numeroTeste + " e confira. Seu agente está oficialmente ligado à Meta!");
      else setStatus("😕 A Meta recusou o envio: " + (data?.error?.message || "erro " + r.status) +
        ". Dicas: o token temporário expira em 24h (gere um novo no painel), e no número de teste da Meta o destinatário precisa estar cadastrado em 'To' na página API Setup.");
    } catch (err) {
      setStatus("😕 O navegador bloqueou a chamada direta à Meta (" + err.message + "). Sem problema: use o código de servidor abaixo — em produção é ele quem conversa com a Meta, e funciona sempre.");
    } finally { setEnviando(false); }
  };

  const codigo = gerarCodigoServidor(agente, { token, phoneNumberId: phoneId });
  const copiar = async () => {
    try { await navigator.clipboard.writeText(codigo); setCopiado(true); setTimeout(() => setCopiado(false), 2500); }
    catch (e) { setStatus("Não consegui copiar automaticamente — selecione o texto do código e copie com Ctrl+C."); }
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <button className="cia-btn cia-btn-ghost" onClick={onVoltar} style={{ marginBottom: 18 }}>← Voltar aos agentes</button>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, background: agente.cor, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 28,
          boxShadow: "0 0 24px " + agente.cor + "77" }}>{agente.emoji}</div>
        <div>
          <div className="cia-eyebrow" style={{ marginBottom: 3 }}>Canal · WhatsApp</div>
          <h1 style={{ margin: 0, fontSize: 24 }}>Conectar {agente.nome} ao WhatsApp</h1>
          <span className="cia-mono" style={{ display: "inline-block", marginTop: 6, fontSize: 11.5, fontWeight: 600,
            padding: "3px 12px", borderRadius: 20,
            background: conectado ? "rgba(52,211,153,.12)" : "rgba(232,236,255,.06)",
            border: conectado ? "1px solid rgba(52,211,153,.45)" : "1px solid rgba(124,92,255,.25)",
            color: conectado ? "#34D399" : "var(--mut)" }}>
            {conectado ? "● Credenciais salvas" : "○ Ainda não conectado"}
          </span>
        </div>
      </div>
      <p style={{ color: "var(--mut)", fontSize: 14, marginTop: 12, lineHeight: 1.65 }}>
        Vamos usar a <b style={{ color: "#E8ECFF" }}>API oficial da Meta (WhatsApp Cloud API)</b> — a forma segura e permitida,
        sem risco de banimento do número. É grátis para testar. Siga o passo a passo:
      </p>

      {/* PASSO A PASSO */}
      <div className="cia-card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>📋 Passo 1 — Pegue suas chaves no painel da Meta (≈10 min)</h3>
        <ol style={{ color: "var(--mut)", fontSize: 13.5, lineHeight: 1.95, paddingLeft: 20, margin: 0 }}>
          <li>Acesse <b style={{ color: "#E8ECFF" }}>developers.facebook.com</b>, entre com sua conta do Facebook e clique em <b style={{ color: "#E8ECFF" }}>My Apps → Create App</b> (tipo <b style={{ color: "#E8ECFF" }}>Business</b>).</li>
          <li>Dentro do app, procure o produto <b style={{ color: "#E8ECFF" }}>WhatsApp</b> e clique em <b style={{ color: "#E8ECFF" }}>Set up</b>. A Meta te dá um <b style={{ color: "#E8ECFF" }}>número de teste grátis</b> na hora.</li>
          <li>Na página <b style={{ color: "#E8ECFF" }}>API Setup</b>, copie dois códigos: o <b style={{ color: "#E8ECFF" }}>Temporary access token</b> e o <b style={{ color: "#E8ECFF" }}>Phone number ID</b>.</li>
          <li>Ainda nessa página, no campo <b style={{ color: "#E8ECFF" }}>"To"</b>, cadastre o seu celular como destinatário de teste (a Meta manda um código de confirmação).</li>
        </ol>
      </div>

      {/* CREDENCIAIS */}
      <div className="cia-card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>🔑 Passo 2 — Cole as chaves aqui</h3>
        <Campo label="Token de acesso (Temporary access token)" ajuda="Código longo que autoriza o envio. O temporário expira em 24h — para uso contínuo, gere um token permanente no painel da Meta (System User). Nunca compartilhe este código com ninguém.">
          <input className="cia-input cia-mono" type="password" value={token} onChange={e => setToken(e.target.value)}
            placeholder="EAAG..." />
        </Campo>
        <Campo label="Phone Number ID" ajuda="Número de identificação do seu número de WhatsApp no sistema da Meta (não é o número de telefone em si).">
          <input className="cia-input cia-mono" value={phoneId} onChange={e => setPhoneId(e.target.value)}
            placeholder="Ex: 123456789012345" />
        </Campo>
        <button className="cia-btn cia-btn-primary" onClick={salvar}>💾 Salvar no agente</button>
        <p style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 12, marginBottom: 0 }}>
          🔒 Suas chaves ficam apenas nesta sessão do navegador — não são enviadas a nenhum servidor do CriaIA.
        </p>
      </div>

      {/* TESTE DE ENVIO */}
      <div className="cia-card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>📤 Passo 3 — Envie uma mensagem de teste</h3>
        <p style={{ color: "var(--mut)", fontSize: 13.5, marginTop: 0, lineHeight: 1.6 }}>
          Vamos enviar a mensagem de boas-vindas padrão da Meta ("hello_world") para o seu celular, provando que a conexão funciona.
        </p>
        <Campo label="Seu número com DDI (só dígitos)" ajuda="Exemplo para Brasil: 55 + DDD + número. Ex: 5513999999999. Precisa ser um número cadastrado como destinatário de teste no painel da Meta.">
          <input className="cia-input cia-mono" value={numeroTeste} onChange={e => setNumeroTeste(e.target.value)}
            placeholder="5513999999999" />
        </Campo>
        <button className="cia-btn cia-btn-primary" onClick={enviarTeste} disabled={enviando}
          style={{ background: "linear-gradient(135deg,#34D399,#22D3EE)", boxShadow: "0 0 22px rgba(52,211,153,.35)" }}>
          {enviando ? "⏳ Enviando..." : "📲 Enviar mensagem de teste"}
        </button>
        {status && <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.65, padding: "11px 15px", borderRadius: 12,
          color: statusOk ? "#34D399" : "#FBBF24",
          background: statusOk ? "rgba(52,211,153,.08)" : "rgba(251,191,36,.07)",
          border: statusOk ? "1px solid rgba(52,211,153,.3)" : "1px solid rgba(251,191,36,.25)" }}>{status}</p>}
      </div>

      {/* RESPOSTAS AUTOMÁTICAS */}
      <div className="cia-card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>🤖 Passo 4 — Fazer o agente responder sozinho</h3>
        <p style={{ color: "var(--mut)", fontSize: 13.5, lineHeight: 1.7, marginTop: 0 }}>
          Para o agente <b style={{ color: "#E8ECFF" }}>receber</b> as mensagens das pessoas e responder automaticamente 24h por dia,
          é preciso um pequeno <b style={{ color: "#E8ECFF" }}>servidor</b> sempre ligado na internet (o navegador não consegue fazer isso sozinho).
          A boa notícia: <b style={{ color: "#E8ECFF" }}>nós já geramos esse servidor pronto para você</b>, com toda a personalidade e o
          conhecimento do {agente.nome} embutidos. É só publicar em um serviço gratuito como <b style={{ color: "#E8ECFF" }}>Render</b> ou <b style={{ color: "#E8ECFF" }}>Railway</b>.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <button className="cia-btn cia-btn-primary" onClick={() => setMostrarCodigo(v => !v)}>
            {mostrarCodigo ? "Ocultar código" : "⚙️ Gerar código do servidor"}
          </button>
          {mostrarCodigo && (
            <button className="cia-btn cia-btn-ghost" onClick={copiar}>
              {copiado ? "✅ Copiado!" : "📋 Copiar código"}
            </button>
          )}
        </div>
        {mostrarCodigo && (
          <textarea readOnly className="cia-input cia-mono cia-scroll" value={codigo} rows={14}
            style={{ fontSize: 12, background: "#060914", color: "#9BE8FF", resize: "vertical", lineHeight: 1.6 }} />
        )}
        <p style={{ fontSize: 12, color: "var(--faint)", lineHeight: 1.65, marginBottom: 0 }}>
          ⚠️ Importante: mantenha o agente focado em tarefas do seu negócio (atendimento, dúvidas, pedidos).
          Desde jan/2026 a Meta proíbe bots de "IA genérica" no WhatsApp. E lembre-se de sempre deixar claro
          que é um assistente virtual, oferecendo opção de falar com um humano.
        </p>
      </div>
    </div>
  );
}

// ================= CHATBOX (motor de conversa) =================
function ChatBox({ agente, altura }) {
  const [mensagens, setMensagens] = useState(() =>
    agente.saudacao ? [{ role: "assistant", content: agente.saudacao }] : []);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const [erro, setErro] = useState("");
  const fimRef = useRef();
  const systemPrompt = montarSystemPrompt(agente);

  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensagens, pensando]);

  const enviar = async () => {
    if (!texto.trim() || pensando) return;
    const novaMsg = { role: "user", content: texto.trim() };
    const historico = [...mensagens, novaMsg];
    setMensagens(historico); setTexto(""); setErro(""); setPensando(true);
    try {
      const resposta = await chamarIA(systemPrompt, historico);
      setMensagens(m => [...m, { role: "assistant", content: resposta }]);
    } catch (err) {
      setErro("😕 Ops! Não consegui responder agora. Tente de novo em instantes. (Detalhe técnico: " + err.message + ")");
    } finally {
      setPensando(false);
    }
  };

  return (
    <div className="cia-card" style={{ overflow: "hidden" }}>
      <div className="cia-scroll" style={{ height: altura, overflowY: "auto", padding: 18, background: "rgba(5,7,15,.5)" }}>
        {mensagens.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--faint)", marginTop: 40 }}>
            <div style={{ fontSize: 38, filter: "drop-shadow(0 0 16px " + agente.cor + "88)" }}>{agente.emoji}</div>
            <p style={{ fontSize: 14 }}>Envie uma mensagem para começar a testar!</p>
          </div>
        )}
        {mensagens.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <div style={{ maxWidth: "78%", padding: "10px 15px", borderRadius: 14, fontSize: 14.5, lineHeight: 1.55,
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? "linear-gradient(135deg,#7C5CFF,#22D3EE)" : "rgba(232,236,255,.05)",
              color: m.role === "user" ? "#05070F" : "#E8ECFF",
              fontWeight: m.role === "user" ? 600 : 400,
              border: m.role === "user" ? "none" : "1px solid rgba(124,92,255,.22)",
              boxShadow: m.role === "user" ? "0 4px 18px rgba(124,92,255,.3)" : "none" }}>
              {m.content}
            </div>
          </div>
        ))}
        {pensando && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
            <div style={{ padding: "10px 16px", borderRadius: 14, background: "rgba(232,236,255,.05)",
              border: "1px solid rgba(124,92,255,.22)", color: "var(--faint)", fontSize: 13.5 }}>
              {agente.nome} está digitando…
            </div>
          </div>
        )}
        <div ref={fimRef} />
      </div>
      {erro && <div style={{ padding: "10px 16px", background: "rgba(251,113,133,.1)",
        borderTop: "1px solid rgba(251,113,133,.3)", color: "#FB7185", fontSize: 13 }}>{erro}</div>}
      <div style={{ display: "flex", gap: 10, padding: 14, borderTop: "1px solid rgba(124,92,255,.18)" }}>
        <input className="cia-input" value={texto} onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === "Enter" && enviar()} placeholder="Digite sua mensagem..."
          disabled={pensando} />
        <button className="cia-btn cia-btn-primary" onClick={enviar} disabled={pensando || !texto.trim()}>➤</button>
      </div>
    </div>
  );
}

// ================= ESTILOS AUXILIARES =================
const btnMini = (bg, cor) => ({ padding: "7px 13px", borderRadius: 9, border: "1px solid rgba(124,92,255,.18)",
  background: bg, color: cor, fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" });
const abaBtn = (ativo) => ({ padding: "9px 17px", borderRadius: 12,
  border: ativo ? "1px solid #22D3EE" : "1px solid rgba(124,92,255,.22)",
  background: ativo ? "rgba(34,211,238,.12)" : "rgba(6,9,22,.5)",
  color: ativo ? "#22D3EE" : "var(--mut)", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
  boxShadow: ativo ? "0 0 14px rgba(34,211,238,.25)" : "none", fontFamily: "inherit" });
