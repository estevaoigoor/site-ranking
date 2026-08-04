import React, { useState, useRef, useEffect } from "react";

// ================= DESIGN SYSTEM (identidade Instituto Mix) =================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
.cia-root{ --bg:#F7F3F0; --panel:#FFFFFF; --line:#EDE4E1; --line2:#B4050F;
 --txt:#241414; --mut:#8A7A78; --faint:#B0A29E; --p1:#E30613; --p2:#B4050F; --p3:#FAB219; --ok:#34D399; --bad:#FB7185;
 font-family:'Poppins',system-ui,sans-serif; color:var(--txt); background:var(--bg); }
.cia-card{ background:var(--panel); border:1px solid var(--line); border-radius:18px;
 box-shadow:0 24px 48px -24px rgba(179,20,20,.22), 0 2px 8px rgba(11,11,11,.05);
 transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.cia-card:hover{ border-color:rgba(227,6,19,.35); box-shadow:0 24px 48px -24px rgba(179,20,20,.3), 0 2px 8px rgba(11,11,11,.06); }
.cia-lift:hover{ transform:translateY(-3px); }
.cia-btn{ font-family:inherit; cursor:pointer; transition:all .2s ease; }
.cia-btn-primary{ background:linear-gradient(135deg,#E30613,#B4050F); border:none; color:#FFFFFF; font-weight:700;
 padding:11px 22px; border-radius:12px; font-size:14.5px; box-shadow:0 10px 22px -10px rgba(227,6,19,.5); }
.cia-btn-primary:hover:not(:disabled){ box-shadow:0 14px 30px -10px rgba(180,5,15,.55); transform:translateY(-1px); }
.cia-btn-primary:disabled{ opacity:.45; cursor:not-allowed; }
.cia-btn-ghost{ background:var(--bg); border:1px solid var(--line); color:var(--txt);
 padding:10px 18px; border-radius:12px; font-weight:600; font-size:14px; }
.cia-btn-ghost:hover{ border-color:#E30613; }
.cia-input{ width:100%; padding:12px 15px; border-radius:12px; border:1px solid var(--line);
 background:#FFFFFF; color:var(--txt); font-size:14.5px; box-sizing:border-box; outline:none;
 font-family:inherit; transition:border-color .2s, box-shadow .2s; }
.cia-input::placeholder{ color:var(--faint); }
.cia-input:focus{ border-color:#E30613; box-shadow:0 0 0 3px rgba(227,6,19,.12); }
.cia-mono{ font-family:ui-monospace,SFMono-Regular,Menlo,monospace; }
.cia-eyebrow{ font-family:'Poppins',sans-serif; font-weight:700; font-size:11px; letter-spacing:.14em;
 text-transform:uppercase; color:var(--p2); }
.cia-gradtext{ color:#E30613; font-weight:800; }
.cia-scroll::-webkit-scrollbar{ width:8px; height:8px; }
.cia-scroll::-webkit-scrollbar-thumb{ background:rgba(227,6,19,.25); border-radius:8px; }
.cia-scroll::-webkit-scrollbar-track{ background:transparent; }
.cia-root button:focus-visible,.cia-root input:focus-visible,.cia-root textarea:focus-visible{
 outline:2px solid #E30613; outline-offset:2px; }
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
const MARCA_NOVA_MENSAGEM = "[[NOVA_MENSAGEM]]";
function separarMensagens(texto) {
  return String(texto || "")
    .split(MARCA_NOVA_MENSAGEM)
    .map(p => p.trim())
    .filter(Boolean);
}

// ================= PERSISTÊNCIA LOCAL =================
const LS_AGENTES = "criaia_agentes";
const LS_API_KEY = "criaia_api_key";
const SEED_VENDEDOR_ID = "seed-vendedor-im-itanhaem-sobrancelhas";
function criarAgenteSeedInstitutoMix() {
  return {
    id: SEED_VENDEDOR_ID,
    nome: "Vendedor IA — Instituto Mix Itanhaém",
    emoji: "🎯",
    cor: "#E30613",
    descricao: "Agente de vendas que atende leads de anúncio via WhatsApp para o curso Designer de Sobrancelhas na unidade Itanhaém, com objetivo de fechar a matrícula direto na conversa.",
    tomId: "vendedor",
    publico: "Pessoas interessadas em se profissionalizar em design de sobrancelhas, vindas de anúncio, que chegam pelo WhatsApp da unidade Itanhaém.",
    saudacao: "Oi! Tudo bem? Aqui é o assistente virtual do Instituto Mix Itanhaém 🎯 Vi que você se interessou pelo curso de Design de Sobrancelhas, em que posso te ajudar?",
    instrucoes: `Você conduz a venda seguindo a metodologia oficial "Clube de Vendas Instituto Mix" (10 passos), adaptada para uma conversa de texto no WhatsApp. Elementos presenciais do método original (aperto de mão, oferecer café, vestimenta) não se aplicam aqui e devem ser ignorados.

Estilo de comunicação: fale de um jeito humano e natural, como uma pessoa de verdade batendo papo no WhatsApp — nada de linguagem corporativa, formal ou repetitiva. Continue persuasiva (o objetivo é vender), mas com leveza, sem soar como script decorado. Respostas um pouco mais curtas que o padrão — direto ao ponto, sem cortar informação importante nem pular etapas do roteiro. No WhatsApp, negrito é com um asterisco só (*assim*), nunca dois (nunca **assim**) — use pouco, só quando realmente ajudar a destacar algo.

Quebra de assunto: nunca use traço (-), travessão ou qualquer linha separadora pra mudar de assunto dentro do texto — pessoa de verdade não escreve assim no WhatsApp, ela manda outra mensagem. Se precisar falar de mais de um assunto na mesma resposta, escreva cada assunto como se fosse uma mensagem separada e coloque a marca [[NOVA_MENSAGEM]] sozinha, numa linha própria, entre uma mensagem e outra. Essa marca nunca aparece pro lead — o sistema usa ela só pra separar em mensagens de verdade. Não coloque a marca antes da primeira mensagem nem depois da última.

Regra de compliance: desde jan/2026 a Meta proíbe bots de IA não identificados no WhatsApp. Deixe claro logo na abertura que o atendimento é feito por um assistente virtual do Instituto Mix — nunca esconda isso do lead.

Regra de ritmo (a mais importante): nunca comprima sondagem, apresentação e quebra de objeção numa resposta só. É normal e desejável levar várias trocas de mensagem só na sondagem antes de sequer mencionar o curso a fundo. Se o lead perguntar o valor antes da hora, não recue direto pro preço — acolha a pergunta (ex.: "já já eu te passo certinho, deixa eu só entender melhor sua situação pra te indicar a melhor condição") e continue aprofundando a sondagem. Só fale em valores depois de ter passado por sondagem completa + apresentação conectada à vida do lead + diferenciais + qualquer objeção resolvida.

Os 10 passos:
1. Abertura: cumprimente pelo nome se disponível, deixe claro que é o assistente virtual do Instituto Mix Itanhaém, quebra-gelo leve e genuíno.
2. Sondagem (regra 80/20 — o lead fala mais que você): não se contente com uma pergunta só. Ao longo de várias mensagens, entenda a fundo:
   - Por que essa formação especificamente, e por que agora — qual o motivo real por trás da escolha (não aceite uma resposta superficial tipo "eu gosto"; pergunte o que tá por trás disso, o que ela busca na prática).
   - Se já trabalha ou pretende trabalhar com estética, se já tentou outra coisa antes e não deu certo.
   - O que mudaria na vida dela tendo essa nova profissão ou renda extra.
   - Quem decide o investimento: se é ela mesma que vai pagar/investir na qualificação, ou se depende de alguém (pais, cônjuge, outra pessoa) — pergunte com naturalidade, tipo "e esse investimento, você mesma organiza ou tem mais alguém envolvido nessa decisão?". Se depender de terceiro, ajuste o fechamento depois: pergunte se faz sentido essa pessoa entrar na conversa antes de fechar, não empurre pra decisão sozinha.
   - Disponibilidade de dias/horário.
   Nunca abra a conversa com valores e nunca avance pra apresentação até sentir que entendeu de verdade a necessidade por trás do interesse.
3. Apresentação: só depois da sondagem completa. Apresente o curso com segurança, cobrindo os módulos reais (Biossegurança; Excelência no Atendimento e Ética Profissional; Design de Sobrancelhas; Brow Lamination; Coloração de Sobrancelhas), duração 5 meses / 57h, turma às terças 19h–22h. Sempre conecte o curso com o que o lead contou na sondagem — não é uma grade curricular genérica, é a resposta pra necessidade dela. Convide o lead a se imaginar já atendendo clientes na área (abordagem holística) e fale sobre o retorno financeiro possível — a chance de gerar renda extra ou até fazer da profissão a fonte principal de renda — sem inventar valores exatos de mercado que não estejam na base de conhecimento.
4. Diferenciais: escolha 2 ou 3 diferenciais (da base de conhecimento "Diferenciais — como apresentar") mais relevantes pro que o lead demonstrou na sondagem — nunca despeje a lista completa de uma vez, sempre explicando o benefício concreto, não só citando o nome.
5. Objeções: use estas respostas oficiais como base, adaptando o tom para texto:
   - "Tá caro" → remeta ao investimento no futuro e nos objetivos profissionais do lead.
   - "Não tenho tempo" → reformule tempo como prioridade, pergunte se crescimento profissional é prioridade hoje.
   - "Não tenho mais interesse" → investigue se é falta de sentido na profissão ou insegurança a esclarecer.
6. Recapitulação antes do valor: antes de falar qualquer preço, recapitule com o lead o que foi conversado e só avance pra valores quando tiver 100% confirmado, na resposta explícita do lead (não presuma):
   - Se o horário da turma (terça, 19h–22h) funciona bem pra rotina dele.
   - Se ele gostou do conteúdo do curso apresentado.
   - Se resta alguma dúvida que não seja sobre valor financeiro.
   Se qualquer um desses três não estiver resolvido, não avance pro passo de negociação — trate o que falta primeiro (esclareça a dúvida, ou volte à sondagem/apresentação se o horário ou o conteúdo não bateram com a expectativa dele).
7. Negociação (método "Jeito IM de Negociar"):
   - Antes de revelar qualquer valor, pergunte como o lead prefere fazer o investimento: à vista no Pix, parcelado no boleto, ou no cartão de crédito. Nunca mostre valores antes dessa resposta.
   - Depois que o lead escolher, revele só a condição da forma escolhida — nunca as três juntas, nunca antecipe as outras.
     - À vista: R$ 1.400, via Pix.
     - Boleto: valor de tabela 10x de R$ 458, mas com a campanha "Volta às Aulas Instituto Mix 2026" (50% de desconto, campanha real e vigente) fica 10x de R$ 229 — pode citar a campanha pelo nome, é legítima, não é urgência inventada.
     - Cartão de crédito: em até 10x, total R$ 1.600.
   - Ao revelar o valor da forma escolhida, mencione também que a matrícula normalmente tem uma taxa de inscrição de R$ 399,00, mas que dentro da campanha "Volta às Aulas Instituto Mix 2026" o lead fica isento dessa taxa — é mais um benefício real da campanha, reforça o valor da condição.
   - Fora a campanha (que é real e pode ser nomeada), nunca use a palavra "desconto" pra qualquer redução adicional — chame de "condição especial" ou "bolsa", nunca de redução de preço.
   - Foco no valor antes do preço: só pergunte a forma de pagamento depois de já ter reforçado o retorno/benefício do curso pro lead (sondagem + apresentação + diferenciais) e ter passado pela recapitulação do passo 6.
   - Depois de revelar o valor, não encha o silêncio justificando ou baixando o preço sozinho — espere a reação do lead antes de continuar.
   - Margem de negociação (só se o lead escolheu boleto e pediu mais redução mesmo depois do valor da campanha — nunca ofereça de graça): diga que vai tentar liberar uma bolsa a mais além da campanha que ele já tem, deixe esse esforço genuíno e não instantâneo (ex.: "deixa eu ver se consigo liberar uma condição a mais pra você, só um instante"). Depois disso, ofereça o boleto em 10x de R$ 199,00 — esse é o teto máximo da negociação, nunca vá abaixo disso nem ofereça essa condição antes de o lead pedir mais redução.
   - Nunca crie condição, prazo ou vaga fora das opções e das informações reais da base de conhecimento — nada de urgência inventada.
8. Fechamento: só proponha fechamento depois de sondagem + apresentação + tratamento de objeções + recapitulação + negociação — nunca empurre preço antes de entender a necessidade. Antes da pergunta de fechamento, mencione o brinde do curso de Marketing Digital EAD (diferencial 18) como reforço final de valor — não é só o curso técnico, ela também aprende a divulgar o próprio trabalho depois de formada. Pode mencionar a vaga na turma de terça como fator real de organização (sem inventar urgência falsa, ex.: não diga "só restam 2 vagas" se isso não for verdade). Faça uma pergunta de fechamento direta que assume avanço (ex.: "posso confirmar sua vaga na turma de terça?") em vez de uma pergunta aberta que facilita o "vou pensar". A forma de pagamento já foi escolhida no passo 7 — envie o link correspondente da base de conhecimento "Links de pagamento" a essa forma escolhida.
9. Documentação: após a escolha de pagamento, informe os documentos necessários para matrícula — RG, CPF e comprovante de endereço; se o aluno for menor de idade, os mesmos três documentos do responsável legal também são exigidos. Não há idade mínima para matricular sozinho (maiores de idade).
10. Confirmação: confirme a matrícula, reforce data/horário da primeira aula e endereço da unidade.
11. Pós-fechamento: agradeça, coloque-se à disposição para dúvidas e pergunte, de forma natural, se o lead conhece mais alguém que possa se interessar pelo curso.

Vocabulário (Jeito IM de Negociar): evite palavras de insegurança — "desconto", "vou tentar", "talvez", "se for possível", "vou verificar". Use vocabulário de decisão e confiança — "consigo liberar essa condição", "vou garantir sua vaga", "essa condição é válida hoje".

Regra geral: se o lead perguntar algo fora do escopo do curso e a resposta não estiver na sua base de conhecimento, diga com honestidade que não tem essa informação — nunca invente.`,
    conhecimento: [
      {
        id: uid(),
        titulo: "Curso Designer de Sobrancelhas — Itanhaém",
        tipo: "texto",
        conteudo: `Curso: Designer de Sobrancelhas
Unidade: Instituto Mix Itanhaém — Avenida Condessa de Vimieiros, 183, 1º andar, Itanhaém-SP
Duração: aproximadamente 5 meses | Carga horária: 57h | 1 aula por semana
Turma: toda terça-feira, das 19h às 22h

Módulos:
- Biossegurança: EPIs, higienização, prevenção de contaminação, avaliação do cliente, cuidados pós-procedimento, prevenção de LER.
- Excelência no Atendimento e Ética Profissional: postura profissional, criação de vínculo com o cliente, fidelização, ética e transparência.
- Design de Sobrancelhas: técnicas de depilação, uso de pinças e navalhas, design masculino e feminino, higiene e manuseio de materiais.
- Brow Lamination (alisamento de sobrancelhas): indicação da técnica, aplicação segura, teste de alergia, controle de tempo, contraindicações.
- Coloração de Sobrancelhas: uso de henna e tintas específicas, controle de tonalidade e desbotamento.

Regra de ordem: pergunte qual forma de pagamento o lead prefere (Pix à vista, boleto ou cartão) ANTES de revelar qualquer valor. Depois que ele escolher, revele só a condição da forma escolhida — nunca as três juntas.

Formas de pagamento:
- À vista: R$ 1.400, via Pix
- Boleto: valor de tabela 10x de R$ 458. Com a campanha "Volta às Aulas Instituto Mix 2026" (50% de desconto, campanha real e vigente, pode ser citada pelo nome) fica 10x de R$ 229 — esse é o primeiro valor a oferecer no boleto, já com a campanha aplicada
- Cartão de crédito: em até 10x, total R$ 1.600
- Margem de negociação (só se o lead escolheu boleto e pediu mais redução mesmo depois do valor da campanha): boleto 10x de R$ 199 — condição extra ("bolsa a mais"), teto máximo, nunca oferecer de primeira

Taxa de inscrição/matrícula: normalmente R$ 399,00. Dentro da campanha "Volta às Aulas Instituto Mix 2026", o aluno fica isento dessa taxa — mencione isso sempre que apresentar os valores, reforça o benefício real da campanha.

Certificado: emitido ao concluir o curso com média igual ou superior a 7 e frequência mínima de 75%. Não é automático — depende de aproveitamento e presença.
Idade mínima: não há — não é necessário ter idade mínima para se matricular.
Documentos para matrícula: RG, CPF e comprovante de endereço. Se o aluno for menor de idade, os mesmos três documentos (RG, CPF, comprovante de endereço) do responsável legal também são obrigatórios.

Diferenciais do Instituto Mix (18):
1. Ensino híbrido
2. Estrutura de qualidade
3. Material didático moderno e personalizado
4. Portal do Aluno (Mundo IM)
5. Cursos extracurriculares GPP e GPE
6. Avaliação formativa
7. Reposição de aulas
8. Instrutores especializados
9. Colaboradores certificados
10. Acompanhamento de progresso
11. Garantia de aprendizado
12. Certificado reconhecido
13. Formatura
14. Assistência pós-curso
15. IMPay
16. Comunidade de negócios
17. Gerência AI
18. Curso de Marketing Digital EAD de brinde na matrícula`
      },
      {
        id: uid(),
        titulo: "Links de pagamento",
        tipo: "texto",
        conteudo: `Link de pagamento à vista (R$ 1.400): [LINK_A_VISTA_INFINITEPAY_OU_REDE]
Link de pagamento boleto 10x R$ 229 (campanha Volta às Aulas Instituto Mix 2026, 50% de desconto sobre os R$ 458 de tabela — primeiro valor a oferecer): [LINK_BOLETO_10X]
Link de pagamento cartão de crédito até 10x (R$ 1.600): [LINK_CARTAO_10X]
Link de pagamento boleto 10x R$ 199 (margem de negociação — só usar se o lead pedir mais redução mesmo depois da campanha, teto máximo): [LINK_BOLETO_10X_NEGOCIACAO]

Instrução: envie sempre o link correspondente à forma de pagamento que o lead escolheu ou fechou. Nunca envie mais de um link de uma vez. O link de R$ 199 só é enviado se o lead pediu redução e o vendedor já sinalizou que ia "tentar liberar uma bolsa a mais" — nunca oferecido de primeira.

Estes quatro links são placeholders — precisam ser substituídos pelos links reais gerados no InfinitePay ou na Rede antes do agente entrar em produção. A troca é feita editando este documento de conhecimento na tela de edição do agente, sem precisar mexer em código.`
      },
      {
        id: uid(),
        titulo: "Diferenciais — como apresentar",
        tipo: "texto",
        conteudo: `Cada diferencial abaixo vem com uma definição curta e um gancho de mensagem (adaptado do material oficial "Diferenciais Instituto Mix" do Clube de Vendas). Use como base, adaptando ao nome do lead e ao fluxo da conversa — não precisa copiar literalmente. Escolha só 2 ou 3 por conversa, os mais relevantes pro que o lead demonstrou na sondagem.

1. Ensino híbrido — combina aulas presenciais com experiências online, formação contínua.
   Gancho: "No Instituto Mix, os alunos aprendem de forma contínua, com aulas presenciais e experiências online que enriquecem a formação."

2. Estrutura de qualidade — ambiente confortável e bem estruturado para estudar.
   Gancho: "Temos uma estrutura de qualidade que garante um ambiente confortável pro aprendizado. Isso faz toda diferença na experiência dos alunos."

3. Material didático moderno e personalizado — desenvolvido por especialistas, com QR Codes para material extra e realidade aumentada.
   Gancho: "Nosso material didático é moderno e personalizado, focado nas práticas do mercado — com QR Codes que dão material extra e realidade aumentada."

4. Portal do Aluno (Mundo IM) — portal exclusivo com notas, frequência e espaço para feedback.
   Gancho: "Você tem acesso ao Mundo IM, nosso portal exclusivo pra acompanhar seu progresso, notas e frequência."

5. Cursos extracurriculares GPP e GPE — gratuitos, complementares.
   GPP (Gestão Profissional Pessoal): autoconhecimento, marketing pessoal, processos seletivos, currículo, entrevistas, oratória, gestão de tempo, negociação, liderança, saúde emocional. Ideal pra quem quer crescer na carreira.
   GPE / Negócio na Prática: empreendedorismo, gestão financeira, marketing, legislação, análise de crédito, atendimento, gestão de equipe, PNL. Ideal pra quem quer empreender.
   Gancho: "Você ainda tem acesso a cursos extracurriculares gratuitos que preparam pro mercado e pra empreender."

6. Avaliação formativa — avalia o progresso do aluno de forma holística, focada no desenvolvimento.
   Gancho: "A avaliação aqui é formativa — olha seu progresso de forma completa, não só uma prova."

7. Reposição de aulas — aluno pode repor aula perdida sem ficar pra trás no conteúdo.
   Gancho: "Se perder uma aula, você repõe sem problema — ninguém fica pra trás no conteúdo."

8. Instrutores especializados — experiência prática real na área que lecionam.
   Gancho: "Os instrutores têm experiência prática de verdade na área, o que enriquece bastante o aprendizado."

9. Colaboradores certificados — toda a equipe passa por treinamento e certificação.
   Gancho: "Toda a nossa equipe passa por treinamento e certificação, isso garante um padrão de qualidade no atendimento."

10. Acompanhamento de progresso — via Portal do Aluno.

11. Garantia de aprendizado — se não for aprovado num módulo, pode refazer sem custo adicional, desde que esteja em dia com as parcelas e aguarde a próxima turma.
    Gancho: "Se você não for aprovado em algum módulo, pode refazer sem pagar nada a mais — só precisa estar em dia com as parcelas."

12. Certificado reconhecido — emitido com média ≥7 e frequência mínima de 75%.
    Gancho: "Concluindo com média 7 ou mais e pelo menos 75% de frequência, você recebe o certificado de uma das maiores escolas de profissões do Brasil."

13. Formatura — cerimônia de formatura ao concluir o curso.
    Gancho: "No final, tem cerimônia de formatura pra celebrar sua conquista."

14. Assistência pós-curso — mesmo depois de formado, o aluno pode agendar consulta com instrutores pra tirar dúvida e receber orientação de mercado.
    Gancho: "Mesmo depois de formado, você pode contar com os instrutores pra tirar dúvida e receber dica de mercado."

15. IMPay — forma de pagamento flexível do Instituto Mix, permite assinatura mensal no cartão de crédito. É um diferencial institucional geral da rede — não é o método de pagamento usado nesta matrícula (que usa os links do documento "Links de pagamento"). Mencione apenas como diferencial da marca, não ofereça como opção de pagamento real aqui.

16. Comunidade de negócios — rede de alunos conectados, conteúdo extra exclusivo produzido por profissionais renomados.
    Gancho: "Você também entra numa comunidade de negócios com outros alunos e conteúdo extra de profissionais renomados."

17. Gerência AI — plataforma gratuita pro aluno que empreende, ajuda a gerenciar estoque, finanças e pagamentos do próprio negócio.
    Gancho: "Se você já empreende ou pretende empreender, tem a Gerência AI de graça pra te ajudar a organizar estoque, finanças e pagamento do seu negócio."

18. Curso de Marketing Digital EAD (brinde) — dado de presente na matrícula, sem custo adicional. Ensina a divulgar o próprio trabalho depois de formada: como aparecer no Instagram, atrair cliente, se posicionar como profissional. Use esse diferencial especialmente perto do fechamento (passo 8), como reforço de valor no momento de decidir — não é só o curso técnico, é também aprender a vender o próprio trabalho depois.
    Gancho: "E tem um bônus: quando você se matricula, ganha de brinde o curso de Marketing Digital EAD. Porque não adianta só saber fazer, você precisa saber divulgar seu trabalho pra atrair cliente — e esse curso te ensina exatamente isso."`
      }
    ],
    whatsapp: null
  };
}
function carregarAgentes() {
  try {
    const raw = localStorage.getItem(LS_AGENTES);
    const salvos = raw ? JSON.parse(raw) : [];
    const temVendedor = salvos.some(a => a.id === SEED_VENDEDOR_ID);
    return temVendedor ? salvos : [...salvos, criarAgenteSeedInstitutoMix()];
  } catch (e) { return [criarAgenteSeedInstitutoMix()]; }
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
          justifyContent: "center", borderRadius: "50%", background: "rgba(227,6,19,.18)",
          border: "1px solid rgba(227,6,19,.4)", color: "#B4050F", fontSize: 11, fontWeight: 700 }}>?</span>
      {aberto && (
        <span style={{ position: "absolute", bottom: "135%", left: "50%", transform: "translateX(-50%)",
          background: "#FFFFFF", border: "1px solid var(--line)", color: "#241414",
          padding: "9px 12px", borderRadius: 10, fontSize: 12.5, width: 235, lineHeight: 1.45, zIndex: 50,
          boxShadow: "0 12px 30px -10px rgba(11,11,11,.35)" }}>{texto}</span>
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
    setRascunho({ id: uid(), nome: "", emoji: "🤖", cor: "#E30613", descricao: "",
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

      {/* SIDEBAR */}
      <aside style={{ width: 250, background: "#FFFFFF",
        borderRight: "1px solid var(--line)", padding: "26px 18px", position: "sticky", top: 0,
        height: "100vh", boxSizing: "border-box", flexShrink: 0, zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22, background: "linear-gradient(135deg,#E30613,#B4050F)",
            boxShadow: "0 8px 20px -8px rgba(227,6,19,.55)" }}>✨</div>
          <div>
            <div className="cia-gradtext" style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-0.01em" }}>CriaIA</div>
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
      color: ativo ? "#FFFFFF" : "var(--mut)",
      background: ativo ? "linear-gradient(135deg,#E30613,#B4050F)" : "transparent",
      border: "1px solid transparent" }}>
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
        <b style={{ color: "#241414" }}>console.anthropic.com</b>.
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
          borderColor: "rgba(180,5,15,.3)" }}>
          <button className="cia-btn" onClick={() => setOnboarding(false)} style={{ position: "absolute", top: 12, right: 14,
            border: "none", background: "transparent", fontSize: 18, color: "var(--faint)" }}>✕</button>
          <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>👋 Bem-vindo(a) ao <span className="cia-gradtext">CriaIA</span>!</h3>
          <p style={{ margin: "0 0 8px", color: "var(--mut)", lineHeight: 1.7, fontSize: 14 }}>
            Aqui você cria seu próprio assistente de inteligência artificial <b style={{ color: "#241414" }}>sem precisar programar</b>.
            É só responder algumas perguntas simples. Nós cuidamos da parte técnica.
          </p>
          <ol style={{ margin: "8px 0 0", paddingLeft: 20, color: "var(--mut)", lineHeight: 1.9, fontSize: 14 }}>
            <li><b style={{ color: "#241414" }}>Identidade:</b> dê um nome e um rostinho ao seu agente.</li>
            <li><b style={{ color: "#241414" }}>Personalidade:</b> escolha como ele conversa.</li>
            <li><b style={{ color: "#241414" }}>Conhecimento:</b> ensine o que ele precisa saber.</li>
            <li><b style={{ color: "#241414" }}>Teste:</b> converse com ele na hora para ver se ficou bom!</li>
          </ol>
          <button className="cia-btn cia-btn-primary" onClick={onNovo} style={{ marginTop: 18 }}>Começar agora →</button>
        </div>
      )}

      {agentes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--faint)" }}>
          <div style={{ fontSize: 58 }}>🤖</div>
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
          boxShadow: "0 8px 18px -6px " + a.cor + "66" }}>{a.emoji}</div>
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
          <button className="cia-btn" onClick={() => onTestar(a)} style={btnMini("linear-gradient(135deg,#E30613,#B4050F)", "#FFFFFF")}>💬 Testar</button>
          <button className="cia-btn" onClick={() => onWhatsApp(a)} style={btnMini("rgba(52,211,153,.14)", "#34D399")}>
            {a.whatsapp?.phoneNumberId ? "📲 WhatsApp ✓" : "📲 WhatsApp"}
          </button>
          <button className="cia-btn" onClick={() => onEditar(a)} style={btnMini("rgba(227,6,19,.14)", "#B4050F")}>✏️ Editar</button>
          <button className="cia-btn" onClick={() => onDuplicar(a)} style={btnMini("rgba(36,20,20,.07)", "var(--mut)")}>⧉ Duplicar</button>
          <button className="cia-btn" onClick={() => setConfirmando(true)} style={btnMini("rgba(251,113,133,.12)", "#FB7185")}>🗑️</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#FB7185", fontWeight: 600 }}>Excluir "{a.nome}"? Não tem como desfazer.</span>
          <button className="cia-btn" onClick={() => onExcluir(a.id)} style={btnMini("rgba(251,113,133,.9)", "#FFFFFF")}>Sim, excluir</button>
          <button className="cia-btn" onClick={() => setConfirmando(false)} style={btnMini("rgba(36,20,20,.07)", "var(--mut)")}>Cancelar</button>
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
              background: p.n <= passo ? "linear-gradient(90deg,#E30613,#B4050F)" : "rgba(227,6,19,.14)",
              boxShadow: "none" }} />
            <div style={{ fontSize: 12.5, fontWeight: 700, color: p.n <= passo ? "#B4050F" : "var(--faint)" }}>
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
            style={{ background: "linear-gradient(135deg,#34D399,#10B981)", boxShadow: "0 10px 22px -10px rgba(52,211,153,.45)" }}>
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
      <label style={{ display: "block", fontWeight: 600, fontSize: 14.5, marginBottom: 9, color: "#241414" }}>
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
              border: rascunho.emoji === e ? "1px solid #B4050F" : "1px solid rgba(227,6,19,.2)",
              background: rascunho.emoji === e ? "rgba(180,5,15,.12)" : "rgba(247,243,240,.6)",
              boxShadow: "none" }}>{e}</button>
          ))}
        </div>
      </Campo>
      <Campo label="Cor do agente" ajuda="A cor de destaque que aparece no painel.">
        <div style={{ display: "flex", gap: 10 }}>
          {CORES.map(c => (
            <button key={c} className="cia-btn" onClick={() => set("cor", c)} style={{ width: 36, height: 36, borderRadius: "50%",
              background: c,
              border: rascunho.cor === c ? "2px solid #241414" : "2px solid transparent",
              boxShadow: rascunho.cor === c ? "0 3px 10px -2px " + c : "none" }} />
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
              border: rascunho.tomId === t.id ? "1px solid #B4050F" : "1px solid rgba(227,6,19,.2)",
              background: rascunho.tomId === t.id ? "rgba(180,5,15,.1)" : "rgba(247,243,240,.55)",
              boxShadow: "none" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#241414" }}>{t.emoji} {t.nome}</div>
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
        Ensine o agente com textos ou documentos. Ele vai usar essas informações para responder. <b style={{ color: "#241414" }}>É opcional</b>, mas deixa o agente muito mais útil!
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button className="cia-btn" onClick={() => setAba("texto")} style={abaBtn(aba === "texto")}>✍️ Colar texto</button>
        <button className="cia-btn" onClick={() => setAba("arquivo")} style={abaBtn(aba === "arquivo")}>📎 Enviar arquivo</button>
        <button className="cia-btn" onClick={() => setAba("entrevista")} style={abaBtn(aba === "entrevista")}>🎓 Entrevista guiada</button>
      </div>

      {aba === "texto" && (
        <div style={{ background: "rgba(247,243,240,.55)", border: "1px solid rgba(227,6,19,.16)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
          <input className="cia-input" value={titulo} onChange={e => setTitulo(e.target.value)}
            placeholder="Título (ex: Horário de funcionamento)" style={{ marginBottom: 10 }} />
          <textarea className="cia-input" value={conteudo} onChange={e => setConteudo(e.target.value)} rows={4}
            placeholder="Cole aqui uma informação. Ex: Nossa loja abre de segunda a sexta, das 9h às 18h..."
            style={{ resize: "vertical" }} />
          <button className="cia-btn cia-btn-primary" onClick={addTexto} style={{ marginTop: 12 }}>➕ Adicionar conhecimento</button>
        </div>
      )}
      {aba === "arquivo" && (
        <div style={{ background: "rgba(247,243,240,.55)", border: "1px dashed rgba(180,5,15,.4)", borderRadius: 14, padding: 20, marginBottom: 18, textAlign: "center" }}>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md,text/plain" onChange={onArquivo} style={{ display: "none" }} />
          <div style={{ fontSize: 40 }}>📄</div>
          <p style={{ color: "var(--mut)", margin: "8px 0 12px", fontSize: 13.5 }}>Envie um arquivo <b style={{ color: "#241414" }}>PDF</b>, <b style={{ color: "#241414" }}>.txt</b> ou <b style={{ color: "#241414" }}>.md</b>. Nós extraímos o texto automaticamente.</p>
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
                background: "rgba(247,243,240,.55)", border: "1px solid rgba(227,6,19,.18)", borderRadius: 12, padding: "10px 14px" }}>
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
      <div style={{ background: "rgba(247,243,240,.55)", border: "1px solid rgba(227,6,19,.16)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
        <p style={{ color: "var(--mut)", fontSize: 13.5, marginTop: 0, lineHeight: 1.65 }}>
          🎓 <b style={{ color: "#241414" }}>Como funciona:</b> você escolhe um tema e a IA te entrevista, fazendo perguntas
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
    <div style={{ background: "rgba(247,243,240,.55)", border: "1px solid rgba(227,6,19,.16)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5 }}>🎤 Entrevista: {tema}</div>
        <div className="cia-mono" style={{ fontSize: 11, color: "#B4050F" }}>{pares.length} resposta(s) coletada(s)</div>
      </div>
      <div className="cia-scroll" style={{ height: 280, overflowY: "auto", background: "rgba(247,243,240,.6)",
        border: "1px solid rgba(227,6,19,.18)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
        {msgs.filter((m, i) => i > 0).map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{ maxWidth: "82%", padding: "9px 13px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.55,
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? "linear-gradient(135deg,#E30613,#B4050F)" : "rgba(227,6,19,.14)",
              color: m.role === "user" ? "#FFFFFF" : "#241414",
              fontWeight: m.role === "user" ? 600 : 400,
              border: m.role === "user" ? "none" : "1px solid rgba(227,6,19,.25)" }}>
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
        <button className="cia-btn" onClick={pular} disabled={carregando} style={btnMini("rgba(36,20,20,.07)", "var(--mut)")}>⏭️ Não sei / pular pergunta</button>
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
        Converse com <b style={{ color: "#241414" }}>{rascunho.nome}</b> para ver se ele responde do jeito que você quer.
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
          boxShadow: "0 8px 18px -6px " + agente.cor + "77" }}>{agente.emoji}</div>
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
    + '    // O agente separa assuntos diferentes com [[NOVA_MENSAGEM]] — cada parte vira uma mensagem de WhatsApp própria\n'
    + '    const partes = resposta.split("[[NOVA_MENSAGEM]]").map(p => p.trim()).filter(Boolean);\n'
    + '    for (const parte of (partes.length ? partes : [resposta.trim()])) {\n'
    + '      await fetch("https://graph.facebook.com/v21.0/" + PHONE_NUMBER_ID + "/messages", {\n'
    + '        method: "POST",\n'
    + '        headers: { "Content-Type": "application/json", Authorization: "Bearer " + WHATSAPP_TOKEN },\n'
    + '        body: JSON.stringify({ messaging_product: "whatsapp", to: msg.from, type: "text", text: { body: parte } }),\n'
    + '      });\n'
    + '      await new Promise(r => setTimeout(r, 900));\n'
    + '    }\n'
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
          boxShadow: "0 8px 18px -6px " + agente.cor + "77" }}>{agente.emoji}</div>
        <div>
          <div className="cia-eyebrow" style={{ marginBottom: 3 }}>Canal · WhatsApp</div>
          <h1 style={{ margin: 0, fontSize: 24 }}>Conectar {agente.nome} ao WhatsApp</h1>
          <span className="cia-mono" style={{ display: "inline-block", marginTop: 6, fontSize: 11.5, fontWeight: 600,
            padding: "3px 12px", borderRadius: 20,
            background: conectado ? "rgba(52,211,153,.12)" : "rgba(36,20,20,.06)",
            border: conectado ? "1px solid rgba(52,211,153,.45)" : "1px solid rgba(227,6,19,.25)",
            color: conectado ? "#34D399" : "var(--mut)" }}>
            {conectado ? "● Credenciais salvas" : "○ Ainda não conectado"}
          </span>
        </div>
      </div>
      <p style={{ color: "var(--mut)", fontSize: 14, marginTop: 12, lineHeight: 1.65 }}>
        Vamos usar a <b style={{ color: "#241414" }}>API oficial da Meta (WhatsApp Cloud API)</b> — a forma segura e permitida,
        sem risco de banimento do número. É grátis para testar. Siga o passo a passo:
      </p>

      {/* PASSO A PASSO */}
      <div className="cia-card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>📋 Passo 1 — Pegue suas chaves no painel da Meta (≈10 min)</h3>
        <ol style={{ color: "var(--mut)", fontSize: 13.5, lineHeight: 1.95, paddingLeft: 20, margin: 0 }}>
          <li>Acesse <b style={{ color: "#241414" }}>developers.facebook.com</b>, entre com sua conta do Facebook e clique em <b style={{ color: "#241414" }}>My Apps → Create App</b> (tipo <b style={{ color: "#241414" }}>Business</b>).</li>
          <li>Dentro do app, procure o produto <b style={{ color: "#241414" }}>WhatsApp</b> e clique em <b style={{ color: "#241414" }}>Set up</b>. A Meta te dá um <b style={{ color: "#241414" }}>número de teste grátis</b> na hora.</li>
          <li>Na página <b style={{ color: "#241414" }}>API Setup</b>, copie dois códigos: o <b style={{ color: "#241414" }}>Temporary access token</b> e o <b style={{ color: "#241414" }}>Phone number ID</b>.</li>
          <li>Ainda nessa página, no campo <b style={{ color: "#241414" }}>"To"</b>, cadastre o seu celular como destinatário de teste (a Meta manda um código de confirmação).</li>
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
          style={{ background: "linear-gradient(135deg,#34D399,#10B981)", boxShadow: "0 10px 22px -10px rgba(52,211,153,.4)" }}>
          {enviando ? "⏳ Enviando..." : "📲 Enviar mensagem de teste"}
        </button>
        {status && <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.65, padding: "11px 15px", borderRadius: 12,
          color: statusOk ? "#34D399" : "#FAB219",
          background: statusOk ? "rgba(52,211,153,.08)" : "rgba(250,178,25,.07)",
          border: statusOk ? "1px solid rgba(52,211,153,.3)" : "1px solid rgba(250,178,25,.25)" }}>{status}</p>}
      </div>

      {/* RESPOSTAS AUTOMÁTICAS */}
      <div className="cia-card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>🤖 Passo 4 — Fazer o agente responder sozinho</h3>
        <p style={{ color: "var(--mut)", fontSize: 13.5, lineHeight: 1.7, marginTop: 0 }}>
          Para o agente <b style={{ color: "#241414" }}>receber</b> as mensagens das pessoas e responder automaticamente 24h por dia,
          é preciso um pequeno <b style={{ color: "#241414" }}>servidor</b> sempre ligado na internet (o navegador não consegue fazer isso sozinho).
          A boa notícia: <b style={{ color: "#241414" }}>nós já geramos esse servidor pronto para você</b>, com toda a personalidade e o
          conhecimento do {agente.nome} embutidos. É só publicar em um serviço gratuito como <b style={{ color: "#241414" }}>Render</b> ou <b style={{ color: "#241414" }}>Railway</b>.
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
            style={{ fontSize: 12, background: "#241414", color: "#F7F3F0", resize: "vertical", lineHeight: 1.6 }} />
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
      const partes = separarMensagens(resposta);
      setMensagens(m => [...m, ...(partes.length ? partes : [resposta.trim()]).map(p => ({ role: "assistant", content: p }))]);
    } catch (err) {
      setErro("😕 Ops! Não consegui responder agora. Tente de novo em instantes. (Detalhe técnico: " + err.message + ")");
    } finally {
      setPensando(false);
    }
  };

  return (
    <div className="cia-card" style={{ overflow: "hidden" }}>
      <div className="cia-scroll" style={{ height: altura, overflowY: "auto", padding: 18, background: "rgba(247,243,240,.5)" }}>
        {mensagens.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--faint)", marginTop: 40 }}>
            <div style={{ fontSize: 38 }}>{agente.emoji}</div>
            <p style={{ fontSize: 14 }}>Envie uma mensagem para começar a testar!</p>
          </div>
        )}
        {mensagens.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <div style={{ maxWidth: "78%", padding: "10px 15px", borderRadius: 14, fontSize: 14.5, lineHeight: 1.55,
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? "linear-gradient(135deg,#E30613,#B4050F)" : "rgba(36,20,20,.05)",
              color: m.role === "user" ? "#FFFFFF" : "#241414",
              fontWeight: m.role === "user" ? 600 : 400,
              border: m.role === "user" ? "none" : "1px solid rgba(227,6,19,.22)",
              boxShadow: m.role === "user" ? "0 4px 18px rgba(227,6,19,.3)" : "none" }}>
              {m.content}
            </div>
          </div>
        ))}
        {pensando && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
            <div style={{ padding: "10px 16px", borderRadius: 14, background: "rgba(36,20,20,.05)",
              border: "1px solid rgba(227,6,19,.22)", color: "var(--faint)", fontSize: 13.5 }}>
              {agente.nome} está digitando…
            </div>
          </div>
        )}
        <div ref={fimRef} />
      </div>
      {erro && <div style={{ padding: "10px 16px", background: "rgba(251,113,133,.1)",
        borderTop: "1px solid rgba(251,113,133,.3)", color: "#FB7185", fontSize: 13 }}>{erro}</div>}
      <div style={{ display: "flex", gap: 10, padding: 14, borderTop: "1px solid rgba(227,6,19,.18)" }}>
        <input className="cia-input" value={texto} onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === "Enter" && enviar()} placeholder="Digite sua mensagem..."
          disabled={pensando} />
        <button className="cia-btn cia-btn-primary" onClick={enviar} disabled={pensando || !texto.trim()}>➤</button>
      </div>
    </div>
  );
}

// ================= ESTILOS AUXILIARES =================
const btnMini = (bg, cor) => ({ padding: "7px 13px", borderRadius: 9, border: "1px solid rgba(227,6,19,.18)",
  background: bg, color: cor, fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" });
const abaBtn = (ativo) => ({ padding: "9px 17px", borderRadius: 12,
  border: ativo ? "1px solid #B4050F" : "1px solid rgba(227,6,19,.22)",
  background: ativo ? "rgba(180,5,15,.12)" : "rgba(247,243,240,.5)",
  color: ativo ? "#B4050F" : "var(--mut)", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
  boxShadow: "none", fontFamily: "inherit" });
