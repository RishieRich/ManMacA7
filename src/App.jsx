import { useState, useEffect, useRef, useCallback } from "react";

/*
  ARQ ONE AI Labs — WhatsApp Agentic AI Sales Agent
  FINAL DEMO — Neon aesthetic, simple visual flow, 3 languages
*/

const LANGS = {
  en: { name: "English", ui: { chat: "Customer sees this", brain: "What the AI is doing", actions: "Results", replay: "▶ Play Again", scenario: "Choose a demo", waiting: "Waiting for customer message...", actionsWait: "Live results appear here..." } },
  hi: { name: "हिंदी", ui: { chat: "Customer को ये दिखता है", brain: "AI ये कर रहा है", actions: "Results", replay: "▶ फिर चलाओ", scenario: "Demo चुनो", waiting: "Customer के message का इंतज़ार...", actionsWait: "Results यहाँ दिखेंगे..." } },
  gu: { name: "ગુજરાતી", ui: { chat: "Customer ને આ દેખાય છે", brain: "AI આ કરે છે", actions: "Results", replay: "▶ ફરી ચલાવો", scenario: "Demo પસંદ કરો", waiting: "Customer ના message ની રાહ...", actionsWait: "Results અહીં દેખાશે..." } },
};

/* ─────────────────────────────────────────────
   SCENARIO DATA — Full sales cycle per language
   ───────────────────────────────────────────── */
function getScenarios(lang) {
  const hi = lang === "hi", gu = lang === "gu";
  return [
    {
      id: "full-sale",
      icon: "💸",
      title: hi ? "पूरा Sales Cycle" : gu ? "પૂરો Sales Cycle" : "Complete Sale — Inquiry to Quote",
      desc: hi ? "Customer आया → Steel price check → Cost calculate → Quote PDF बनी → Email गई → CRM entry → Follow-up set" : gu ? "Customer આવ્યો → Steel price check → Cost calculate → Quote PDF બની → Email ગઈ → CRM entry → Follow-up set" : "Customer inquiry → Live steel price → Cost calculation → Quote PDF → Email sent → CRM updated → Follow-ups scheduled",
      tag: hi ? "₹2.3L margin बचा" : gu ? "₹2.3L margin બચ્યો" : "₹2.3L margin saved",
      flow: [
        // User message
        { t: "msg", who: "user", text: hi ? "Bhai 5KL SS316L pressure vessel chahiye pharma ke liye. Ek vendor ne ₹14.2 lakh bola. Tum kitne mein karoge?" : gu ? "Bhai 5KL SS316L pressure vessel joie pharma mate. Ek vendor e ₹14.2 lakh kahyu. Tamaro price su che?" : "Hi, we need a 5KL SS316L pressure vessel for pharma. Another vendor quoted ₹14.2 lakh. What's your best price?" },
        // Step 1: Reading message
        { t: "step", icon: "📨", label: hi ? "Message padh raha hai..." : gu ? "Message vanche che..." : "Reading message...", detail: hi ? "Product: Pressure Vessel · Material: SS316L · Size: 5KL · Industry: Pharma\nCompetitor price: ₹14.2 lakh" : gu ? "Product: Pressure Vessel · Material: SS316L · Size: 5KL · Industry: Pharma\nCompetitor price: ₹14.2 lakh" : "Product: Pressure Vessel · Material: SS316L · Size: 5KL · Industry: Pharma\nCompetitor price: ₹14.2 lakh", status: "done" },
        // Step 2: Steel price
        { t: "step", icon: "📡", label: hi ? "आज का steel price check कर रहा है..." : gu ? "આજનો steel price check કરે છે..." : "Checking today's steel price...", detail: "SS316L plate (8mm): ₹292/kg\n↑ 6.3% from last week\nSource: SteelMint API · Updated 2 hrs ago", status: "done", highlight: true },
        // Step 3: Cost calc
        { t: "step", icon: "🧮", label: hi ? "Actual cost calculate कर रहा है..." : gu ? "Actual cost calculate કરે છે..." : "Calculating real cost...", detail: hi ? "Material (2,400 kg × ₹292):  ₹7.01L\nFabrication + labor:         ₹0.58L\nNozzles, fittings:           ₹0.85L\nPharma mirror finish:        ₹0.95L\nASME stamp + inspection:     ₹0.52L\nRadiography + PWHT:          ₹0.78L\nOverheads (18%):             ₹1.92L\n━━━━━━━━━━━━━━━━━━━━━\nTotal cost:        ₹12.61 lakh\nMinimum price:     ₹14.50 lakh\nOur quote:         ₹15.40 lakh" : gu ? "Material (2,400 kg × ₹292):  ₹7.01L\nFabrication + labor:         ₹0.58L\nNozzles, fittings:           ₹0.85L\nPharma mirror finish:        ₹0.95L\nASME stamp + inspection:     ₹0.52L\nRadiography + PWHT:          ₹0.78L\nOverheads (18%):             ₹1.92L\n━━━━━━━━━━━━━━━━━━━━━\nTotal cost:        ₹12.61 lakh\nMinimum price:     ₹14.50 lakh\nAmaro quote:       ₹15.40 lakh" : "Material (2,400 kg × ₹292):  ₹7.01L\nFabrication + labor:         ₹0.58L\nNozzles, fittings:           ₹0.85L\nPharma mirror finish:        ₹0.95L\nASME stamp + inspection:     ₹0.52L\nRadiography + PWHT:          ₹0.78L\nOverheads (18%):             ₹1.92L\n━━━━━━━━━━━━━━━━━━━━━\nTotal cost:        ₹12.61 lakh\nMinimum price:     ₹14.50 lakh\nOur quote:         ₹15.40 lakh", status: "done" },
        // Step 4: Margin alert
        { t: "step", icon: "🚨", label: hi ? "Margin check — Owner को alert" : gu ? "Margin check — Owner ને alert" : "Margin check — Alert to owner", detail: hi ? "⚠ Competitor का ₹14.2L हमारे minimum ₹14.50L से कम है!\n\nअगर sales guy ने match किया → ₹41,000 का LOSS\nAI ने price hold किया ₹15.4L पर → ₹2.3L margin safe" : gu ? "⚠ Competitor નો ₹14.2L અમારા minimum ₹14.50L થી ઓછો!\n\nSales guy match કરે તો → ₹41,000 LOSS\nAI એ price hold કર્યો ₹15.4L → ₹2.3L margin safe" : "⚠ Competitor's ₹14.2L is below our minimum ₹14.50L!\n\nIf sales guy matches → ₹41,000 LOSS\nAI held price at ₹15.4L → ₹2.3L margin protected", status: "alert", money: hi ? "₹2.3L margin बचा" : gu ? "₹2.3L margin બચ્યો" : "₹2.3L margin saved" },
        // Bot reply
        { t: "msg", who: "bot", text: hi ? "Bhai sahab 🙏\n\nMaine check kiya — aaj SS316L plate ₹292/kg chal raha hai (is hafte 6.3% badha). Is rate pe ₹14.2L mein proper pharma-grade PV banana mushkil hai.\n\nUnke quote mein ye hai?\n· 100% radiography sabhi welds pe?\n· ASME U-Stamp?\n· PWHT (stress relieving)?\n· Material TCs (EN 10204 Type 3.1)?\n· Mirror finish Ra ≤ 0.6μm?\n\nKoi miss ho toh pharma audit mein problem.\n\nHumara price: ₹15.4L — full compliance, ASME stamped, 2 saal warranty.\n\nDetailed breakdown chahiye? Email do." : gu ? "Bhai saheb 🙏\n\nMein check karyu — aaje SS316L plate ₹292/kg chale che (aa athvadiye 6.3% vadhyo). Aa rate pe ₹14.2L ma pharma-grade PV banavu mushkel che.\n\nEnu quote ma aa che?\n· 100% radiography?\n· ASME U-Stamp?\n· PWHT?\n· Material TCs (EN 10204 Type 3.1)?\n· Mirror finish Ra ≤ 0.6μm?\n\nKoi miss hoy to pharma audit ma problem.\n\nAmaro price: ₹15.4L — full compliance, ASME stamped, 2 varsh warranty.\n\nDetailed breakdown joie? Email apo." : "I've checked — SS316L plate is ₹292/kg today (up 6.3% this week). At current rates, ₹14.2L for a proper pharma-grade 5KL PV isn't feasible.\n\nDoes their quote include:\n· 100% radiography on all welds?\n· ASME U-Stamp?\n· PWHT (stress relieving)?\n· Material TCs (EN 10204 Type 3.1)?\n· Mirror finish Ra ≤ 0.6μm?\n\nIf any is missing, your pharma audit will flag it.\n\nOur price: ₹15.4L — full compliance, ASME stamped, 2-year warranty.\n\nWant a detailed cost breakdown? Share your email." },
        // User gives email
        { t: "msg", who: "user", text: hi ? "Sahi baat hai. Radiography mention nahi tha. procurement@sunrisepharma.com pe bhej do." : gu ? "Sachi vaat che. Radiography noto mention nathi. procurement@sunrisepharma.com pe moklo." : "Good point, they didn't mention radiography. Send to procurement@sunrisepharma.com" },
        // Step 5: Generating quote
        { t: "step", icon: "📄", label: hi ? "Quotation PDF बना रहा है..." : gu ? "Quotation PDF બનાવે છે..." : "Generating quotation PDF...", detail: hi ? "Quote #QT-2026-0891\n8 line items · Payment terms · ASME specs\nPDF ready (1.8 MB)" : gu ? "Quote #QT-2026-0891\n8 line items · Payment terms · ASME specs\nPDF ready (1.8 MB)" : "Quote #QT-2026-0891\n8 line items · Payment terms · ASME specs\nPDF ready (1.8 MB)", status: "done" },
        // QUOTE PANEL
        { t: "panel", kind: "quote", data: { id: "QT-2026-0891", items: [
          { item: "SS316L Plates (shell + dish ends)", qty: "2,400 kg", rate: "₹292/kg", amt: "₹7,01,000" },
          { item: "Nozzles, fittings, flanges", qty: "Lot", rate: "—", amt: "₹85,000" },
          { item: "Fabrication & welding (320 hrs)", qty: "320 hrs", rate: "₹181/hr", amt: "₹58,000" },
          { item: "Internal mirror finish (pharma)", qty: "—", rate: "—", amt: "₹95,000" },
          { item: "ASME U-Stamp + 3rd party inspection", qty: "—", rate: "—", amt: "₹52,000" },
          { item: "100% Radiography + PWHT", qty: "—", rate: "—", amt: "₹78,000" },
          { item: "Hydrotest + documentation", qty: "—", rate: "—", amt: "₹28,000" },
          { item: "Overheads + margin + delivery", qty: "—", rate: "18%", amt: "₹2,43,000" },
        ], total: "₹15,40,000", terms: "40% Advance · 50% Pre-dispatch · 10% Post-inspection", validity: "15 days" }},
        // Step 6: Sending email
        { t: "step", icon: "📧", label: hi ? "Email भेज रहा है..." : gu ? "Email મોકલે છે..." : "Sending email...", detail: "→ procurement@sunrisepharma.com", status: "done" },
        // EMAIL PANEL
        { t: "panel", kind: "email", data: {
          to: "procurement@sunrisepharma.com", from: "sales@shreerajindustries.com",
          subject: "Quotation QT-2026-0891 — SS316L Pressure Vessel 5KL (Pharma Grade)",
          body: hi ? "Namaskar,\n\nAapki inquiry ke anusar SS316L 5KL Pressure Vessel (Pharma Grade) ki quotation attached hai.\n\nPrice: ₹15,40,000 (all inclusive)\nDelivery: 6-7 weeks from PO\n\nAttached:\n1. Quotation with detailed cost breakdown\n2. ASME U-Stamp Certificate\n3. Sample Material Test Certificate\n4. Pharma client references\n\nKoi query ho toh WhatsApp pe message karein.\n\nRegards,\nShree Raj Industries\nGIDC Vatva, Ahmedabad" : gu ? "Namaskar,\n\nTamari inquiry mujab SS316L 5KL Pressure Vessel ni quotation attached che.\n\nPrice: ₹15,40,000 (all inclusive)\nDelivery: 6-7 weeks from PO\n\nAttached:\n1. Quotation with cost breakdown\n2. ASME Certificate\n3. Sample Material TC\n4. Pharma references\n\nRegards,\nShree Raj Industries\nGIDC Vatva, Ahmedabad" : "Dear Sir/Madam,\n\nPlease find attached our quotation for SS316L 5KL Pressure Vessel (Pharma Grade).\n\nPrice: ₹15,40,000 (all inclusive — ASME, radiography, PWHT, delivery)\nDelivery: 6-7 weeks from PO date\n\nAttached:\n1. Quotation with line-item cost breakdown\n2. ASME U-Stamp Certificate\n3. Sample Material Test Certificate (EN 10204-3.1)\n4. Recent pharma client references\n\nPlease reach out on WhatsApp for any queries.\n\nRegards,\nShree Raj Industries\nGIDC Vatva, Ahmedabad",
          files: ["Quotation_QT-2026-0891.pdf", "ASME_Certificate.pdf", "Material_TC_Sample.pdf", "Pharma_References.pdf"],
        }},
        // Step 7: CRM
        { t: "step", icon: "👤", label: hi ? "CRM में lead बना रहा है..." : gu ? "CRM માં lead બનાવે છે..." : "Creating CRM lead...", detail: "", status: "done" },
        // CRM PANEL
        { t: "panel", kind: "crm", data: {
          id: "LD-4891", company: "Sunrise Pharma Pvt Ltd", email: "procurement@sunrisepharma.com",
          product: "SS316L PV 5KL Pharma", value: "₹15,40,000", stage: "QUOTATION SENT",
          source: "WhatsApp", competitor: "₹14.2L (radiography missing)", assigned: "Kishan (Sales)",
        }},
        // Step 8: Follow-ups
        { t: "step", icon: "⏰", label: hi ? "Auto follow-up set कर रहा है..." : gu ? "Auto follow-up set કરે છે..." : "Setting auto follow-ups...", detail: "", status: "done" },
        // SCHEDULE PANEL
        { t: "panel", kind: "sched", data: [
          { time: hi ? "2 दिन बाद" : gu ? "2 દિવસ પછી" : "In 2 days", text: hi ? "WhatsApp: 'Quotation review ho gayi kya?'" : gu ? "WhatsApp: 'Quotation review thai?'" : "WhatsApp: 'Had a chance to review the quotation?'" },
          { time: hi ? "5 दिन बाद" : gu ? "5 દિવસ પછી" : "In 5 days", text: hi ? "WhatsApp: 'Competitor ne radiography report diya kya?'" : gu ? "WhatsApp: 'Competitor e radiography report aapyo?'" : "WhatsApp: 'Did the competitor provide a radiography report?'" },
          { time: hi ? "10 दिन बाद" : gu ? "10 દિવસ પછી" : "In 10 days", text: hi ? "Kishan को call reminder: 'Factory visit offer karo'" : gu ? "Kishan ને call reminder: 'Factory visit offer karo'" : "Call alert to Kishan: 'Offer a factory visit'" },
          { time: hi ? "15 दिन बाद" : gu ? "15 દિવસ પછી" : "In 15 days", text: hi ? "Quote expiry reminder + updated steel price" : gu ? "Quote expiry reminder + updated steel price" : "Quote expiry reminder + fresh steel price update" },
        ]},
        // Step 9: Owner notified
        { t: "step", icon: "📱", label: hi ? "Owner को notification भेजा" : gu ? "Owner ને notification મોકલ્યો" : "Owner notified", detail: hi ? "Naya lead: Sunrise Pharma — ₹15.4L\nCompetitor ne ₹14.2L bola — AI ne hold kiya\nMargin bachaya: ₹2.3L\nQuotation bheji · CRM mein entry · Follow-up set" : gu ? "Navo lead: Sunrise Pharma — ₹15.4L\nCompetitor e ₹14.2L kahyu — AI e hold karyu\nMargin bachavyo: ₹2.3L\nQuotation mokli · CRM entry · Follow-up set" : "New lead: Sunrise Pharma — ₹15.4L\nCompetitor quoted ₹14.2L — AI held the price\nMargin saved: ₹2.3L\nQuotation sent · CRM entry created · Follow-ups set", status: "done", money: hi ? "+₹2.3L margin बचा" : gu ? "+₹2.3L margin બચ્યો" : "+₹2.3L margin saved" },
        // Final bot message
        { t: "msg", who: "bot", text: hi ? "📧 Email bhej diya procurement@sunrisepharma.com pe!\n\nQuotation + ASME certificate + material TC + references — sab attached hai.\n\n₹15.4L — poora pharma compliant.\n\n2 din mein follow-up karunga. Factory visit chahiye toh bata dena.\n\nDhanyavaad 🙏" : gu ? "📧 Email mokli didhi procurement@sunrisepharma.com pe!\n\nQuotation + ASME certificate + material TC + references — badhu attached che.\n\n₹15.4L — pooru pharma compliant.\n\n2 divas ma follow-up karish.\n\nAabhar 🙏" : "📧 Sent to procurement@sunrisepharma.com!\n\nQuotation + ASME certificate + material TC + references — all attached.\n\n₹15.4L — full pharma compliance, ASME stamped, 2-year warranty.\n\nI'll follow up in 2 days. Let me know if you'd like a factory visit.\n\nThank you 🙏" },
      ],
    },
  ];
}

/* ─── MAIN APP ─── */
export default function App() {
  const [lang, setLang] = useState("en");
  const [scIdx, setScIdx] = useState(0);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [brainSteps, setBrainSteps] = useState([]);
  const [actionPanels, setActionPanels] = useState([]);
  const [typing, setTyping] = useState(false);
  const [playing, setPlaying] = useState(false);
  const chatR = useRef(null), brainR = useRef(null), actR = useRef(null);
  const tms = useRef([]);

  const ui = LANGS[lang].ui;
  const scenarios = getScenarios(lang);
  const sc = scenarios[scIdx];

  const clr = () => { tms.current.forEach(clearTimeout); tms.current = []; };

  const run = useCallback(() => {
    clr(); setChatMsgs([]); setBrainSteps([]); setActionPanels([]); setTyping(false); setPlaying(true);
    let d = 500;
    sc.flow.forEach((f, i) => {
      if (f.t === "msg") {
        if (f.who === "bot") {
          tms.current.push(setTimeout(() => setTyping(true), d)); d += 1500;
          tms.current.push(setTimeout(() => { setTyping(false); setChatMsgs(p => [...p, { ...f, _id: i }]); }, d));
        } else {
          tms.current.push(setTimeout(() => setChatMsgs(p => [...p, { ...f, _id: i }]), d));
        }
        d += 600;
      } else if (f.t === "step") {
        // Show "working" state first, then "done"
        tms.current.push(setTimeout(() => setBrainSteps(p => [...p, { ...f, _id: i, _done: false }]), d));
        d += (f.icon === "🧮" ? 2000 : f.icon === "📡" ? 1400 : f.icon === "🚨" ? 1000 : 800);
        tms.current.push(setTimeout(() => setBrainSteps(p => p.map(s => s._id === i ? { ...s, _done: true } : s)), d));
        d += 300;
      } else if (f.t === "panel") {
        tms.current.push(setTimeout(() => setActionPanels(p => [...p, { ...f, _id: i }]), d));
        d += 500;
      }
    });
    tms.current.push(setTimeout(() => setPlaying(false), d + 200));
  }, [sc]);

  useEffect(() => { run(); return clr; }, [scIdx, lang]);
  useEffect(() => { chatR.current && (chatR.current.scrollTop = chatR.current.scrollHeight); }, [chatMsgs, typing]);
  useEffect(() => { brainR.current && (brainR.current.scrollTop = brainR.current.scrollHeight); }, [brainSteps]);
  useEffect(() => { actR.current && (actR.current.scrollTop = actR.current.scrollHeight); }, [actionPanels]);

  return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}html,body,#root{height:100%}@keyframes blink{0%,60%,100%{opacity:.3}30%{opacity:1}}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulseGreen{0%,100%{box-shadow:0 0 0 0 rgba(0,168,132,.4)}50%{box-shadow:0 0 0 6px rgba(0,168,132,0)}}.anim-in{animation:fadeUp .3s ease forwards}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,168,132,.2);border-radius:2px}@media(max-width:1100px){.tri{grid-template-columns:1fr!important}}`}</style>

      {/* ── HEADER ── */}
      <header style={S.hdr}>
        <div style={S.hdrIn}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={S.logo}>A</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e9edef" }}>ARQ ONE AI Labs</div>
              <div style={{ fontSize: 10, color: "#00a884", letterSpacing: 1, fontWeight: 600 }}>WHATSAPP AI SALES AGENT</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {Object.entries(LANGS).map(([k, v]) => (
              <button key={k} onClick={() => { setLang(k); setScIdx(0); }}
                style={{ ...S.lBtn, ...(lang === k ? { background: "rgba(0,168,132,.15)", color: "#00d4a4", borderColor: "#00a884" } : {}) }}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── SCENARIO BAR ── */}
      <div style={S.scBar}>
        <div style={{ fontSize: 10, color: "#8696a0", fontWeight: 600, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{ui.scenario}</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {scenarios.map((s2, i) => (
            <button key={s2.id} onClick={() => setScIdx(i)}
              style={{ ...S.scBtn, ...(i === scIdx ? { borderColor: "#00a884", background: "rgba(0,168,132,.06)" } : {}) }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e9edef" }}>{s2.icon} {s2.title}</div>
              <div style={{ fontSize: 11, color: "#8696a0", marginTop: 3, lineHeight: 1.4 }}>{s2.desc}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00d4a4", marginTop: 6, background: "rgba(0,168,132,.1)", display: "inline-block", padding: "2px 8px", borderRadius: 4 }}>{s2.tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── THREE COLUMN LAYOUT ── */}
      <div className="tri" style={S.tri}>

        {/* COL 1: WHATSAPP PHONE */}
        <div style={S.col}>
          <div style={S.colLbl}><span style={{ color: "#00a884" }}>●</span> {ui.chat}</div>
          <div style={S.phone}>
            {/* WA Header */}
            <div style={S.waHdr}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#8696a0", fontSize: 16 }}>‹</span>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#00a884", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏭</div>
                <div>
                  <div style={{ color: "#e9edef", fontSize: 13, fontWeight: 600 }}>Shree Raj Industries</div>
                  <div style={{ color: "#8696a0", fontSize: 10 }}>{typing ? "typing..." : "online"}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, color: "#8696a0", fontSize: 14 }}><span>📞</span><span>⋮</span></div>
            </div>
            {/* Chat */}
            <div ref={chatR} style={S.waChat}>
              <div style={{ textAlign: "center", fontSize: 10, color: "#8696a0", background: "rgba(255,255,255,.03)", borderRadius: 6, padding: "4px 10px", margin: "4px auto 10px", maxWidth: 240 }}>🔒 End-to-end encrypted</div>
              {chatMsgs.map(m => (
                <div key={m._id} className="anim-in" style={{ display: "flex", justifyContent: m.who === "user" ? "flex-end" : "flex-start", marginBottom: 3 }}>
                  <div style={m.who === "user" ? S.uBub : S.bBub}>
                    <div style={{ fontSize: 12.5, color: "#e9edef", lineHeight: 1.45, wordBreak: "break-word" }}
                      dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, "<br/>") }} />
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,.25)", textAlign: "right", marginTop: 1 }}>
                      {`10:${String(15 + chatMsgs.indexOf(m) * 4).padStart(2, "0")}`}
                      {m.who === "user" && <span style={{ color: "#53bdeb", ml: 2 }}> ✓✓</span>}
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: "flex" }}><div style={S.bBub}>
                  <div style={{ display: "flex", gap: 4, padding: "3px 0" }}>
                    {[0, .2, .4].map(d => <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8696a0", animation: `blink 1.4s ${d}s infinite`, display: "inline-block" }} />)}
                  </div>
                </div></div>
              )}
            </div>
            <div style={{ padding: "5px 7px", background: "#1f2c34", display: "flex", gap: 5 }}>
              <div style={{ flex: 1, background: "#2a3942", borderRadius: 18, padding: "7px 12px", fontSize: 13, color: "#8696a0", display: "flex", alignItems: "center", gap: 8 }}>😊 <span style={{ flex: 1 }}>Type a message</span> 📎</div>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#00a884", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🎤</div>
            </div>
          </div>
        </div>

        {/* COL 2: BRAIN — simple visual steps */}
        <div style={S.col}>
          <div style={S.colLbl}><span style={{ color: "#00a884" }}>●</span> {ui.brain}</div>
          <div ref={brainR} style={S.brainBox}>
            {brainSteps.length === 0 && <div style={{ color: "#8696a0", fontSize: 12, padding: 24, textAlign: "center" }}>{ui.waiting}</div>}
            {brainSteps.map((st, i) => (
              <div key={st._id} className="anim-in" style={{ marginBottom: 8 }}>
                <div style={{
                  background: st.status === "alert" ? "rgba(239,68,68,.08)" : st.highlight ? "rgba(0,168,132,.06)" : "rgba(255,255,255,.03)",
                  border: `1px solid ${st.status === "alert" ? "rgba(239,68,68,.2)" : st._done ? "rgba(0,168,132,.15)" : "rgba(255,255,255,.06)"}`,
                  borderRadius: 10, padding: "10px 12px",
                }}>
                  {/* Step header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: st.detail ? 6 : 0 }}>
                    <span style={{ fontSize: 16 }}>{st.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e9edef", flex: 1 }}>{st.label.replace("...", "")}</span>
                    {st._done ? (
                      <span style={{ fontSize: 10, fontWeight: 700, color: st.status === "alert" ? "#ef4444" : "#00a884", background: st.status === "alert" ? "rgba(239,68,68,.12)" : "rgba(0,168,132,.12)", padding: "2px 8px", borderRadius: 4 }}>
                        {st.status === "alert" ? "⚠ ALERT" : "✓ Done"}
                      </span>
                    ) : (
                      <div style={{ width: 14, height: 14, border: "2px solid #00a884", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                    )}
                  </div>
                  {/* Detail */}
                  {st.detail && st._done && (
                    <pre style={{ fontSize: 11.5, color: "#8696a0", fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.5, whiteSpace: "pre-wrap", margin: 0, padding: "6px 0 0 28px" }}>
                      {st.detail}
                    </pre>
                  )}
                  {/* Money tag */}
                  {st.money && st._done && (
                    <div style={{ marginTop: 8, marginLeft: 28, display: "inline-block", fontSize: 12, fontWeight: 700, color: "#00d4a4", background: "rgba(0,168,132,.12)", padding: "4px 12px", borderRadius: 6 }}>
                      💰 {st.money}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COL 3: ACTION PANELS — email, quote, CRM, schedule */}
        <div style={S.col}>
          <div style={S.colLbl}><span style={{ color: "#00a884" }}>●</span> {ui.actions}</div>
          <div ref={actR} style={S.actBox}>
            {actionPanels.length === 0 && <div style={{ color: "#8696a0", fontSize: 12, padding: 24, textAlign: "center" }}>{ui.actionsWait}</div>}
            {actionPanels.map(p => (
              <div key={p._id} className="anim-in" style={{ marginBottom: 8 }}>
                {p.kind === "quote" && <QuoteCard d={p.data} />}
                {p.kind === "email" && <EmailCard d={p.data} />}
                {p.kind === "crm" && <CRMCard d={p.data} />}
                {p.kind === "sched" && <SchedCard d={p.data} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REPLAY */}
      {!playing && (
        <div style={{ textAlign: "center", padding: "12px 0 24px" }}>
          <button onClick={run} style={S.repBtn}>{ui.replay}</button>
        </div>
      )}

      {/* FOOTER */}
      <footer style={S.ftr}>
        <div style={{ fontSize: 12, color: "#8696a0", marginBottom: 8 }}>
          {lang === "hi" ? "हर घंटा बिना इसके = Competitor को पैसा" : lang === "gu" ? "દર કલાક આ વગર = Competitor ને પૈસા" : "Every hour without this = revenue going to your competitor"}
        </div>
        <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" style={S.ctaBtn}>
          💬 {lang === "hi" ? "WhatsApp pe baat karo" : lang === "gu" ? "WhatsApp pe vaat karo" : "Talk to us on WhatsApp"}
        </a>
        <div style={{ fontSize: 10, color: "#4b5563", marginTop: 14 }}>© 2026 ARQ ONE AI Labs · Gujarat, India</div>
      </footer>
    </div>
  );
}

/* ─── SUB-COMPONENTS ─── */
function QuoteCard({ d }) {
  return (
    <div style={P.card}>
      <div style={P.head}><span style={{ fontSize: 14 }}>📄</span> Quotation <span style={P.badge}>#{d.id}</span></div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead><tr>
          <th style={P.th}>Item</th><th style={P.th}>Qty</th><th style={P.th}>Rate</th><th style={{ ...P.th, textAlign: "right" }}>Amount</th>
        </tr></thead>
        <tbody>{d.items.map((r, i) => (
          <tr key={i} style={i % 2 ? { background: "rgba(0,168,132,.03)" } : {}}>
            <td style={P.td}>{r.item}</td><td style={P.td}>{r.qty}</td><td style={P.td}>{r.rate}</td><td style={{ ...P.td, textAlign: "right", fontWeight: 600, color: "#e9edef" }}>{r.amt}</td>
          </tr>
        ))}</tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ fontSize: 10, color: "#8696a0" }}>{d.terms}<br />Valid: {d.validity}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#00d4a4" }}>{d.total}</div>
      </div>
    </div>
  );
}

function EmailCard({ d }) {
  return (
    <div style={P.card}>
      <div style={P.head}><span style={{ fontSize: 14 }}>📧</span> Email Sent <span style={{ ...P.badge, background: "rgba(0,168,132,.15)", color: "#00d4a4" }}>DELIVERED ✓</span></div>
      <div style={P.row}><span style={P.lbl}>To:</span><span style={P.val}>{d.to}</span></div>
      <div style={P.row}><span style={P.lbl}>From:</span><span style={P.val}>{d.from}</span></div>
      <div style={P.row}><span style={P.lbl}>Subject:</span><span style={{ ...P.val, fontWeight: 600, color: "#e9edef" }}>{d.subject}</span></div>
      <div style={{ fontSize: 11, color: "#8696a0", fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.5, whiteSpace: "pre-wrap", background: "rgba(0,0,0,.2)", borderRadius: 6, padding: 8, marginTop: 6, maxHeight: 160, overflowY: "auto", border: "1px solid rgba(255,255,255,.04)" }}>{d.body}</div>
      <div style={{ marginTop: 8 }}>
        {d.files.map(f => (
          <div key={f} style={{ fontSize: 11, color: "#8696a0", padding: "3px 0", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#ef4444" }}>📎</span> {f}
          </div>
        ))}
      </div>
    </div>
  );
}

function CRMCard({ d }) {
  return (
    <div style={P.card}>
      <div style={P.head}><span style={{ fontSize: 14 }}>👤</span> CRM Lead Created <span style={{ ...P.badge, background: "rgba(245,158,11,.15)", color: "#fbbf24" }}>HIGH PRIORITY</span></div>
      {Object.entries({ "Lead ID": d.id, Company: d.company, Email: d.email, Product: d.product, "Deal Value": d.value, Stage: d.stage, Competitor: d.competitor, "Assigned To": d.assigned }).map(([k, v]) => (
        <div key={k} style={P.row}>
          <span style={P.lbl}>{k}:</span>
          <span style={{ ...P.val, ...(k === "Deal Value" ? { color: "#00d4a4", fontWeight: 700 } : k === "Competitor" ? { color: "#ef4444" } : {}) }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function SchedCard({ d }) {
  return (
    <div style={P.card}>
      <div style={P.head}><span style={{ fontSize: 14 }}>⏰</span> Auto Follow-ups Set</div>
      {d.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: i < d.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
          <div style={{ minWidth: 80, fontSize: 11, fontWeight: 600, color: "#00a884", fontFamily: "monospace" }}>{s.time}</div>
          <div style={{ fontSize: 12, color: "#8696a0", lineHeight: 1.4 }}>{s.text}</div>
        </div>
      ))}
      <div style={{ fontSize: 11, color: "#4b5563", marginTop: 8, fontStyle: "italic" }}>
        {d.length > 0 ? "All automated. No human needs to remember." : ""}
      </div>
    </div>
  );
}

/* ─── STYLES ─── */
const S = {
  page: { minHeight: "100vh", background: "#080c10", color: "#e9edef", fontFamily: '"DM Sans", system-ui, sans-serif' },
  hdr: { background: "rgba(8,12,16,.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,.06)", position: "sticky", top: 0, zIndex: 99 },
  hdrIn: { maxWidth: 1500, margin: "0 auto", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  logo: { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#00a884,#00d4a4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700, fontSize: 16 },
  lBtn: { padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,.08)", background: "transparent", color: "#8696a0", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" },

  scBar: { maxWidth: 1500, margin: "0 auto", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.04)" },
  scBtn: { flex: "1 0 280px", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.02)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "#e9edef", transition: "all .15s" },

  tri: { maxWidth: 1500, margin: "0 auto", padding: "10px 16px", display: "grid", gridTemplateColumns: "350px 1fr 1fr", gap: 12, minHeight: 540 },
  col: { display: "flex", flexDirection: "column", minHeight: 0 },
  colLbl: { fontSize: 10, color: "#8696a0", fontWeight: 600, letterSpacing: .8, textTransform: "uppercase", padding: "4px 0 6px", display: "flex", alignItems: "center", gap: 6 },

  phone: { flex: 1, borderRadius: 16, overflow: "hidden", background: "#0b141a", border: "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column" },
  waHdr: { padding: "8px 12px", background: "#1f2c34", display: "flex", justifyContent: "space-between", alignItems: "center" },
  waChat: { flex: 1, overflowY: "auto", padding: "6px 10px" },
  uBub: { background: "#005c4b", borderRadius: "10px 0 10px 10px", padding: "6px 9px 3px", maxWidth: "88%" },
  bBub: { background: "#1f2c34", borderRadius: "0 10px 10px 10px", padding: "6px 9px 3px", maxWidth: "88%" },

  brainBox: { flex: 1, overflowY: "auto", background: "rgba(255,255,255,.01)", border: "1px solid rgba(255,255,255,.04)", borderRadius: 12, padding: 8 },
  actBox: { flex: 1, overflowY: "auto", padding: 0 },

  repBtn: { padding: "8px 20px", borderRadius: 8, background: "rgba(0,168,132,.15)", border: "1px solid rgba(0,168,132,.3)", color: "#00d4a4", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  ftr: { textAlign: "center", padding: "24px 16px", borderTop: "1px solid rgba(255,255,255,.04)" },
  ctaBtn: { display: "inline-block", padding: "10px 28px", borderRadius: 8, background: "linear-gradient(135deg,#00a884,#00d4a4)", color: "#000", fontWeight: 700, fontSize: 14, textDecoration: "none" },
};

const P = {
  card: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: 12 },
  head: { fontSize: 13, fontWeight: 700, color: "#e9edef", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 },
  badge: { fontSize: 10, fontWeight: 600, background: "rgba(255,255,255,.06)", color: "#8696a0", padding: "2px 8px", borderRadius: 4, marginLeft: "auto" },
  row: { display: "flex", gap: 6, fontSize: 11, padding: "2px 0", lineHeight: 1.4 },
  lbl: { color: "#8696a0", fontWeight: 600, minWidth: 72, flexShrink: 0 },
  val: { color: "#b0bec5" },
  th: { textAlign: "left", padding: "4px 6px", color: "#8696a0", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,.06)", fontSize: 10 },
  td: { padding: "4px 6px", color: "#8696a0", borderBottom: "1px solid rgba(255,255,255,.03)", fontSize: 11 },
};
