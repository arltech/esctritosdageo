# Project Brief: Escritos da Geo

> **Documento:** Project Brief v1.0
> **Autor:** Lucas Rodrigues (com facilitação de Atlas — `@analyst`)
> **Data:** 2026-04-26
> **Status:** Rascunho aguardando validação com Geovana Soares
> **Próximo passo:** Handoff para `@pm` (PRD Generation Mode)

---

## 1. Executive Summary

**Escritos da Geo** é um espaço digital de escrita pessoal que respeita o ritual de quem escreve por amor à escrita. Substitui o caderno físico oferecendo um ambiente íntimo, esteticamente cuidado, focado em uma única coisa: escrever.

A diferença é o controle radical da exposição: cada texto nasce privado e a autora decide, por escolha consciente, quando (e se) torná-lo público. Quando público, leitores podem comentar, curtir e interagir — mas sem algoritmos, sem viralização, sem ansiedade social. É um lugar para escritoras que querem o silêncio do diário com a opção da audiência, sem ter que escolher entre os dois.

Construído inicialmente para uma escritora real (Geovana Soares), o produto nasce com alma de ferramenta pessoal — a estratégia *product-of-one* que sustentou produtos como Basecamp e Notion. Se ressoar, expande para escritoras com perfil similar.

---

## 2. Problem Statement

### Estado atual e pontos de dor

Quem escreve por hábito ritualizado vive hoje uma escolha forçada e incômoda entre três mundos imperfeitos:

1. **Caderno físico** — Honra o ritual, mas é frágil (perde-se, queima, molha), não é pesquisável, não permite recuperar texto antigo com facilidade, e não permite compartilhar seletivamente. Quando o caderno acaba, o arquivo da própria autora fica fragmentado em estantes.

2. **Apps de diário privado** (Day One, Journey, Notion) — Resolvem backup e busca, mas tratam a escrita como dado pessoal, não como obra. E são prisões: não há caminho para que um texto, eventualmente, encontre um leitor. Toda escrita morre na nuvem privada.

3. **Plataformas sociais de escrita** (Substack, Medium, Instagram, Tumblr) — Forçam exposição. São construídas em torno de métricas, algoritmos e pressão de audiência. Quem escreve para se ouvir primeiro, e talvez ser lido depois, não pertence ali. A ansiedade de performance contamina a escrita íntima antes mesmo dela existir.

### Impacto do problema

Para a escritora-de-caderno (público-âncora), o impacto é silencioso mas real:

- **Acervo que se perde** — décadas de escrita em cadernos físicos sem backup, sem busca, sem futuro digital.
- **Vozes que se silenciam** — textos potentes que nunca encontram leitores porque a única ponte disponível (Instagram, Medium) exige performance que a autora rejeita.
- **Identidade autoral fragmentada** — quem escreve há anos não tem um espaço único que represente sua obra; tem rascunhos espalhados em cadernos, blocos de notas do celular, posts perdidos.

### Por que as soluções existentes falham

| Solução | Falha estrutural |
|---------|------------------|
| Caderno físico | Sem digital, sem busca, sem compartilhamento opt-in |
| Day One / Journey | Privado-eterno, sem ponte para público |
| Substack / Medium | Público-por-padrão, otimizado para crescimento de audiência |
| Instagram / Tumblr | Algoritmo + exposição forçada + formato hostil a texto longo |
| Notion / Obsidian | Ferramenta de produtividade, não de escrita autoral |

**O vão no mercado:** ninguém oferece **escrita íntima por padrão, com saída pública opt-in e desalgoritmizada**.

### Por que agora

Três movimentos convergem em 2026 e tornam o momento certo:

1. **Fadiga de redes sociais** — usuárias estão saindo de Instagram/Twitter, buscando espaços calmos (Are.na, Bear Blog, Bluesky no modo poético). Demanda real e crescente.
2. **Renascimento da escrita longa** — Substack mostrou que existe mercado para texto autoral; só não existe ainda a versão íntima-primeiro.
3. **Maturidade técnica** — stack moderna (Next.js + Supabase + Tailwind) permite construir produto polido por uma pessoa em semanas, não anos. Custo de entrada baixo viabiliza estratégia *product-of-one*.

---

## 3. Proposed Solution

### Conceito central

**Escritos da Geo** é um santuário digital de escrita construído sobre uma única decisão arquitetural: **tudo nasce privado, e tornar público é um ato deliberado**.

A autora abre o app e cai direto na página em branco — sem feed, sem notificações, sem métricas, sem distração. Escreve. O texto fica dela. Se um dia decidir publicar, faz isso com fricção consciente (não um botão azul reflexivo) — e o texto vai para um endereço próprio (`escritosdageo.com.br/o-titulo`) onde leitores podem ler, comentar e curtir, mas sem algoritmo, sem ranking, sem "stories".

### Abordagem em três camadas

| Camada | O que entrega | Como se diferencia |
|--------|---------------|---------------------|
| **1. Escrita** (núcleo, sempre presente) | Editor minimalista, tipografia bonita, modo zen, autosave, busca, organização por cadernos/coleções | Não compete com Notion (não é produtividade) — compete com o caderno físico |
| **2. Arquivo pessoal** (privado) | Backup vitalício, busca rápida, recuperação de texto antigo, exportação completa em qualquer momento | Day One faz isso, mas é estética de "diário" — Geo é estética de "obra" |
| **3. Saída pública** (opt-in, deliberada) | Cada texto pode virar página pública com URL própria. Comentários moderados pela autora. Curtidas sem ranking. Sem feed algorítmico. | Substack tem ponte, mas força crescimento — Geo trata o público como exceção bonita, não meta |

### Diferenciadores estruturais

1. **Privado por padrão, sempre.** A configuração padrão de qualquer texto é "só eu vejo". Inverter exige ação consciente. O oposto da arquitetura de redes sociais.
2. **Sem feed, sem algoritmo, sem métricas vaidosas.** Leitores chegam por link, recomendação ou assinatura — nunca por algoritmo. A autora não vê "quantos curtiram" como número grande na tela; vê o que cada pessoa escreveu.
3. **Estética como recurso central.** Tipografia, espaço em branco, ritmo visual da página. O app é tão belo de ler quanto o caderno físico. Não é planilha de notas.
4. **Identidade autoral única.** Cada autora tem seu domínio próprio (`escritosdageo.com.br`, `escritosda[nome].com.br`). O produto não absorve a autora — devolve uma marca pessoal.
5. **Construído por uma escritora real, para escritoras reais.** Geovana é a primeira usuária e curadora do produto. Cada decisão de design passa pelo crivo de "isso serve à minha escrita?".

### Por que vai dar certo onde outros falharam

- **Substack falhou nesse vão** porque foi construído para crescimento de audiência (newsletters, métricas, recomendações cruzadas). É excelente — mas para outro perfil.
- **Day One falhou nesse vão** porque tratou diário como dado pessoal, não como obra. Não tem ponte para o público.
- **Tumblr funcionou um dia, mas se perdeu** em ondas de monetização e moderação. Hoje é nostalgia.
- **Notion não compete** — é ferramenta de trabalho, não santuário criativo.
- **Geo nasce com escopo radicalmente menor**, foco radicalmente claro, e não precisa de escala para fazer sentido. Estratégia *product-of-one* reduz risco de execução; se 1 pessoa (Geovana) usa todo dia e ama, o produto já existe.

### Visão do produto

| Horizonte | Estado |
|-----------|--------|
| **3 meses (MVP)** | Geovana escreve diariamente no app. Ela publicou 3-5 textos públicos. Ferramenta substituiu o caderno físico no uso cotidiano. |
| **12 meses** | 50-200 escritoras com perfil similar ao de Geovana usam o produto. Comunidade pequena, qualitativa, viralização orgânica entre escritoras-leitoras. |
| **24 meses** | Referência no nicho de escrita íntima-com-saída-pública em português. Modelo de negócio definido (assinatura simbólica? freemium honesto? doação?). |

---

## 4. Target Users

### Primary User Segment: A Escritora-de-Caderno

> *(persona âncora — Geovana é a representante real desse segmento)*

**Perfil demográfico**

- Mulher, 25-50 anos, brasileira urbana
- Ensino superior, leitora ativa (mínimo 1 livro/mês), educação humanística ou autodidata
- Renda média/média-alta (R$ 4k-15k/mês), sensível a estética e qualidade
- Profissões variadas: professoras, designers, jornalistas, terapeutas, advogadas, donas de pequeno negócio criativo, mães em transição, profissionais em sabático
- Vive em capital ou cidade média, frequenta livraria física, café com livro, e tem opinião sobre tipografia

**Comportamentos e fluxos atuais**

- Escreve em cadernos físicos há anos (Moleskine, Caderno Caiu Caderno, sketchbook, ou caderno barato escolhido com afeto)
- Mantém o ritual: caneta específica, hora do dia preferida (manhã/noite), espaço favorito
- Lê escritoras brasileiras (Clarice, Hilda, Adélia, Conceição, Eliane Brum, Carla Madeira) e contemporâneas internacionais (Annie Ernaux, Ocean Vuong, Maggie Nelson)
- Segue escritoras no Instagram, mas **não publica** ou publica raríssimo (e se arrepende ou edita)
- Tem cadernos antigos guardados — alguns marcados, alguns esquecidos — mas raramente revisita
- Já considerou abrir blog/Substack/perfil literário, mas paralisou: "não sei se quero ser lida"

**Necessidades específicas**

| Necessidade | O que isso significa na prática |
|-------------|--------------------------------|
| Manter o ritual | Editor que respeita o silêncio e a beleza da página em branco |
| Ter arquivo confiável | Backup automático, busca rápida, recuperação de texto antigo |
| Controle radical de exposição | Privado por padrão, público só quando ela escolher, sem pegadinha |
| Beleza estética | Tipografia, espaço, cor — o app deve ser bonito de ler |
| Identidade autoral | Quando publicar, quer ter URL própria, sem ser "mais um perfil" |

**Pontos de dor**

- Cadernos físicos se perdem/desbotam/queimam — dói pensar nisso
- Apps existentes (Day One, Notion) são funcionais mas frios — matam o ritual
- Redes sociais são hostis: pressão, métricas, comparação, ansiedade
- Sensação não-dita de que "minha escrita pode morrer comigo, e eu não quero isso"

**Objetivos**

1. Manter a prática diária da escrita íntima
2. Ter arquivo digno e duradouro do que já escreveu
3. Eventualmente, em momentos raros, **ser lida** — mas em condições que ela controla
4. Sentir que pertence a uma tradição literária, não a uma rede social

### Secondary User Segment: A Aspirante-a-Voz-Pública

> *(segmento adjacente — adoção provável após a maturação do produto com o segmento primário)*

**Perfil demográfico**

- Mulheres e homens, 22-40 anos, brasileiros urbanos (predominância feminina ~70/30)
- Profissionais criativos, comunicadores, jornalistas em transição, criadores de conteúdo cansados de Instagram
- Ensino superior ou em curso, formação humanística ou criativa

**Comportamentos e fluxos atuais**

- Escrevem em **notas do celular** (Apple Notes, Google Keep) — sem método, sem arquivo, sem futuro
- Publicam ocasionalmente em Instagram (carrossel, story de texto branco em fundo preto)
- Já tentaram Substack ou blog próprio e abandonaram (trabalhoso, parece grande demais)
- Sentem que têm voz autoral mas não encontraram a casa certa

**Necessidades específicas**

- Identidade autoral própria (URL pessoal sem peso de "construir blog")
- Audiência pequena, qualitativa, sem ansiedade de algoritmo
- Leveza de publicação (clicar e estar publicado, sem configuração)
- Permissão para começar pequeno

**Pontos de dor**

- Instagram destrói texto longo
- Substack parece "produto profissional", intimida começar
- Blog pessoal exige configuração técnica desproporcional ao desejo
- Não querem virar "criadores de conteúdo" — querem só escrever

**Objetivos**

1. Encontrar e refinar voz autoral em ambiente seguro
2. Construir pequena audiência qualitativa (não viralizar)
3. Ter "casa" digital reconhecível para sua escrita
4. Ocasionalmente migrar texto íntimo para público sem sair do app

### Anti-personas (para quem **não** é)

> *(crucial para foco — quem afastamos define quem servimos)*

- ❌ **Profissionais buscando audiência paga** (ficam no Substack/Beehiiv)
- ❌ **Criadores de conteúdo de produtividade/negócios** (ficam no Notion/Twitter)
- ❌ **Quem só quer diário privado puro** (Day One basta)
- ❌ **Adolescentes em busca de comunidade fanfic/social** (Wattpad/Tumblr)
- ❌ **Jornalistas/escritores profissionais** (já têm veículo)

---

## 5. Goals & Success Metrics

> Premissa importante: este é um produto **product-of-one** com ambição literária, não SaaS de crescimento. As métricas refletem essa filosofia. Sucesso aqui é **profundidade de uso**, não escala viral.

### Business Objectives

- **Validar a hipótese product-of-one** — Geovana usa o app **5+ dias por semana, por 90 dias consecutivos**, dentro de 4 meses do lançamento do MVP.
- **Substituir o caderno físico** — Geovana migra **100% da escrita ritual diária** para o app dentro de 6 meses (caderno físico vira complementar, não primário).
- **Construir comunidade qualitativa** — atingir **50 escritoras ativas** (com perfil similar ao primário) em 12 meses, sem investimento em ads.
- **Operação magra** — manter custo de infraestrutura **≤ R$ 100/mês** até atingir 100 usuárias ativas (Vercel + Supabase free tier + domínio).
- **Definir modelo de receita ético** — testar e definir modelo de monetização (assinatura simbólica R$ 9-15/mês, doação opcional, ou freemium honesto) até mês 18.

### User Success Metrics

- **Frequência de escrita** — usuária escreve no app **pelo menos 4x por semana** após a 4ª semana de uso.
- **Profundidade da sessão** — tempo médio de sessão de escrita ≥ **10 minutos** (escrita real, não navegação).
- **Volume escrito** — usuária produz **mínimo 500 palavras/semana** após o 1º mês.
- **Recuperação do arquivo** — usuária acessa texto antigo (busca ou navegação) **pelo menos 1x por semana** — sinal de que o app virou "estante" da escrita dela.
- **Saúde da privacidade-primeiro** — proporção textos privados:públicos mantém-se em **80:20 ou superior** (públicos são exceção bonita, não regra).
- **Cooling-off natural** — tempo médio entre "texto escrito" e "texto publicado" ≥ **24 horas** (sinal de que a fricção consciente está funcionando).
- **Sentimento qualitativo** — em entrevista trimestral, usuária confirma: *"este app honra minha escrita."*

### Key Performance Indicators (KPIs)

| KPI | Definição | Target |
|-----|-----------|--------|
| **DAU/MAU Ratio** | Razão entre usuárias ativas diárias e mensais — mede uso ritualístico | **≥ 50%** (acima do benchmark de redes sociais ~20%) |
| **Retenção Semana 4** | % de usuárias que completam onboarding e ainda escrevem na semana 4 | **≥ 70%** |
| **Retenção Mês 6** | % de usuárias ativas no mês 6 vs. ativas no mês 1 | **≥ 50%** |
| **Razão Privado:Público** | Distribuição da natureza dos textos criados | **≥ 80:20** (saúde do posicionamento) |
| **Tempo até 1ª publicação** | Dias entre cadastro e primeiro texto público | **≥ 30 dias** (cultivo, não impulso) |
| **Custo por Usuária Ativa** | Custo mensal de infra ÷ usuárias ativas no mês | **≤ R$ 2,00** até 100 usuárias |
| **NPS qualitativo** | Pesquisa trimestral curta com 5 perguntas abertas | **80%+ respostas positivas** sobre alma do produto |
| **Crescimento orgânico** | % de novas usuárias vindas por indicação direta (não busca, não ad) | **≥ 70%** (validação da força do nicho) |
| **Sessões de escrita ininterruptas** | % de sessões sem mudança de aba/distração registrada | **≥ 60%** (validação do "modo zen") |

### Anti-métricas (o que NÃO vamos otimizar — explícito por convicção)

- ❌ **Tempo total no app** (queremos sessões focadas, não infinite scroll)
- ❌ **Número de curtidas por texto** (não exibido como "métrica vaidosa")
- ❌ **Crescimento de seguidores** (não há lógica de seguir/ser seguido em escala)
- ❌ **Viralização de textos públicos** (sem botão "compartilhar para X redes", sem algoritmo)
- ❌ **Notificações enviadas** (manter em mínimo absoluto — só essencial)
- ❌ **Daily Active Users como vaidade** (DAU sem profundidade não significa nada)

---

## 6. MVP Scope

### Princípio orientador do corte

> **O MVP precisa validar UMA coisa: "Geovana escreve no app diariamente por 90 dias."**
>
> Tudo que não serve a esse teste é cortado. Comentários, curtidas, tags, busca avançada, múltiplas usuárias — nada disso importa antes da validação primária. Se Geovana não usa, o produto não existe, e features sociais não vão salvá-lo.

### Core Features (Must Have)

- **Autenticação simples** — Magic link via Supabase Auth. **Apenas Geovana** tem acesso ao MVP (multi-usuária só após validação). Sem cadastro aberto, sem onboarding longo.
- **Editor de escrita minimalista** — Tela quase em branco. Cursor pisca. Tipografia serifada cuidadosamente escolhida (Source Serif, Lora ou Fraunces). Markdown leve invisível (negrito, itálico, parágrafo). Autosave a cada palavra. Sem barra de formatação visível por padrão.
- **Modo zen** — Sidebar/menu somem durante escrita. Volta ao mover mouse ou tocar tela. Padrão de qualquer escrita = imersão.
- **Lista de textos (sidebar)** — Ordenação cronológica reversa. Cada item: título + primeira frase + data. Indicador discreto se está privado (padrão) ou público.
- **Estado privado por padrão, sempre** — Todo texto novo nasce privado. Não há checkbox "tornar público" durante escrita — só após salvar, em ação separada e consciente.
- **Toggle público com fricção consciente** — Ação separada (botão "publicar" com confirmação tipo: *"Este texto vai para escritosdageo.com.br/[slug]. Qualquer pessoa com o link poderá ler. Tem certeza?"*). Slug auto-gerado a partir do título, editável.
- **Página pública individual** — Renderização limpa, tipografia idêntica à do editor, sem sidebar, sem comentários (no MVP). URL: `escritosdageo.com.br/[slug]`. Open Graph para compartilhamento limpo.
- **Página índice pública** — `escritosdageo.com.br` exibe lista cronológica reversa apenas dos textos públicos. Sem fotos, sem bio extensa — só nome da autora, uma linha de descrição, e os títulos+datas+primeiras frases. Estilo Bear Blog.
- **Despublicar** — Tornar público → privado em 1 clique, com confirmação. Texto sai do índice e a URL retorna 404 (link compartilhado quebra — comportamento esperado).
- **Exportação Markdown** — Botão "exportar tudo" gera ZIP com todos os textos em `.md`. Segurança psicológica fundamental ("posso sair daqui a qualquer momento").
- **Responsivo (mobile + desktop)** — Web app funciona bem nos dois. Sem app nativo.

### Out of Scope for MVP

> *Cortes corajosos. Cada item abaixo é tentação real, e cada um foi recusado por servir a "feature paridade", não a validação primária.*

- Comentários nas páginas públicas (Fase 1.5 — só após Geovana publicar e perceber falta)
- Curtidas / reações de qualquer tipo
- Cadastro aberto / multi-usuárias
- Coleções, cadernos, pastas, tags ou categorias
- Busca textual (Fase 1.5 — quando o arquivo crescer e a falta doer)
- Imagens, vídeos, embeds, mídia de qualquer tipo
- Notificações (push, email, qualquer)
- Histórico de versões, undo entre sessões
- Modo escuro / temas customizáveis (uma tipografia, uma paleta — escolhida bem)
- App mobile nativo (web responsive resolve)
- RSS / Newsletter / Substack-like email
- Modelo de pagamento, planos, billing
- Analytics complexo (apenas Vercel Analytics / contagem básica de views)
- Comunidade entre autoras / descoberta cruzada
- Editor colaborativo
- Importação de cadernos antigos digitalizados
- IA assistiva de escrita (sugestões, correção, expansão)
- Domínio customizado por autora (no MVP, `escritosdageo.com.br` é hardcoded)
- Onboarding tutorial / wizards
- Configurações / preferências (não há nada para configurar)

### MVP Success Criteria

> *O MVP é considerado um sucesso se TODAS as condições abaixo forem verdadeiras 90 dias após o lançamento:*

1. **Uso ritualístico confirmado** — Geovana escreve no app **5+ dias por semana** durante pelo menos 30 dias consecutivos no período.
2. **Volume real de produção** — Geovana produz **mínimo 5.000 palavras** ao longo dos 90 dias (sinal de uso de verdade, não teste).
3. **Migração parcial do caderno físico** — Geovana relata, em entrevista qualitativa, que **a maioria** da escrita ritual diária migrou para o app.
4. **Pelo menos 1 publicação pública** — Geovana publica **ao menos 1 texto** voluntariamente no índice público, sem provocação minha (Lucas).
5. **Zero perda de dados** — nenhum incidente de perda, corrupção ou indisponibilidade prolongada (>1h) dos textos no período.
6. **Confirmação qualitativa central** — em entrevista pós-90 dias, Geovana responde *sim* a: *"Este app honra minha escrita?"* e *"Você usaria este app pelos próximos 5 anos?"*

> Se 4 de 6 critérios são atingidos: MVP validado, seguir para Fase 1.5 (comentários, busca, multi-usuárias).
> Se ≤ 3 são atingidos: pausa estratégica e investigação qualitativa profunda antes de adicionar qualquer feature.

---

## 7. Post-MVP Vision

> Princípio: visão clara o suficiente para guiar decisões, vaga o suficiente para não virar prisão. O que vem aqui é direção, não roadmap fechado.

### Phase 2 Features

> *(próxima fase, ativada apenas após MVP validado com os 6 critérios da Seção 6)*

**Camada social leve, sem ansiedade**

- **Comentários moderados** nas páginas públicas — markdown leve, identidade obrigatória (nome + email não-público), aprovação manual no MVP de comentários, sem threading. Sem números visíveis "X comentários" — só os comentários em si.
- **Sinal de leitura** — opcional, simbólico (estilo "lido por 3 pessoas hoje"), sem ranking, sem perseguição de números.
- **Indicação direta entre autoras** — uma autora pode citar outra com um link rico, criando uma rede orgânica e textual (não algoritmizada).

**Maturidade do arquivo pessoal**

- **Busca textual completa** — busca por palavra, por data, por status (privado/público).
- **Coleções / cadernos múltiplos** — agrupar textos em coleções nomeadas (ex: "Cartas para minha mãe", "Crônicas de viagem", "Rascunhos de romance").
- **Tags leves** — opcionais, sem hierarquia, ferramenta de organização pessoal.
- **Histórico de versões** — recuperar texto editado.
- **Modo escuro** — uma única paleta noturna, com a mesma curadoria estética da diurna.

**Abertura para outras escritoras**

- **Convite-only** — cadastro fechado, por convite direto de Geovana ou autoras já dentro. Cresce devagar, qualidade alta. Cada nova autora ganha seu próprio domínio do tipo `escritosda[nome].com.br` (ou `[nome].escritos.com.br`).
- **Onboarding ritualístico** — primeira escrita guiada por uma pergunta lenta ("Por que você escreve?"), salvo como primeiro texto privado da autora.

### Long-term Vision (12-24 meses)

**O produto consolidado**

- **Comunidade pequena e qualitativa** — entre 100 e 300 escritoras ativas (não milhares; o produto não escala como rede social tradicional).
- **Identidade visual matura e reconhecível** — quem entra em qualquer página `escritosda[nome].com.br` reconhece o ecossistema imediatamente, mesmo sem branding intrusivo.
- **Um modelo de receita ético definido** — provavelmente: assinatura simbólica (R$ 12-19/mês) com período gratuito generoso, sem ads, sem tier "premium" agressivo. Geovana e early users vitalícias gratuitas.
- **Tecnologia estável e barata** — operação sustentável com 1 desenvolvedor (Lucas) part-time, custos < R$ 500/mês mesmo com 300 usuárias.
- **Modo offline (PWA)** — escrever sem internet, sincronizar depois. Honra o ritual sem depender de conectividade.

**O posicionamento cultural**

- Reconhecida como **referência brasileira** no nicho de "escrita íntima com saída pública opt-in"
- Citada por escritoras-leitoras em entrevistas, podcasts, perfis no Instagram literário ("eu publico no Escritos da Geo")
- Pequena, mas devotada — relação dos usuários com o produto é íntima e duradoura, não promíscua

### Expansion Opportunities

> *(oportunidades a explorar — não compromissos, apenas sementes que podem germinar se a comunidade pedir)*

**Extensões do produto digital**

- **Antologias coletivas** — autoras colaboram em coletâneas temáticas curadas (ex: "Cartas para Mães", "Crônicas de Quarentena"), publicadas como mini-livros digitais dentro do produto.
- **Cadernos colaborativos privados** — duas pessoas escrevem juntas em um caderno só visível para elas (parceira de escrita, terapeuta + paciente, mãe + filha).
- **Notas marginais** — leitora pública pode anotar um texto privadamente para si mesma (como anotar livro físico).
- **Audio leitura própria** — autora grava sua voz lendo o próprio texto; leitor pode ouvir + ler.

**Pontes para o mundo físico**

- **Print-on-demand de coletâneas** — autora pode mandar imprimir uma seleção dos próprios textos como livro físico (parceria com gráficas brasileiras).
- **Linha de cadernos físicos** — marca paralela "Escritos" — cadernos físicos com a mesma estética do app, vendidos como objeto de afeto.
- **Eventos íntimos** — encontros presenciais pequenos (8-12 pessoas) em livrarias, com escritoras da plataforma.

**Aprofundamento da curadoria**

- **Workshops conduzidos por Geovana ou convidadas** — escrita íntima, voz autoral, prática de caderno. Modelo de cursos pagos curtos, alinhados ao espírito do produto.
- **Newsletter editorial** — Geovana cura textos públicos da semana e envia (opt-in, sem algoritmo, curadoria humana).
- **Residência criativa** — uma autora por semestre tem destaque editorial e espaço expandido na plataforma.

**Integrações pontuais (sob demanda real)**

- Importação de cadernos antigos digitalizados via OCR
- Importação a partir de Day One, Notion, Apple Notes
- Sincronização opcional com calendário ("escrevi em 12 dos últimos 30 dias")

**O que NÃO está nas oportunidades, intencionalmente**

- ❌ Versão internacional / inglês (manter foco no nicho lusófono)
- ❌ App mobile nativo (PWA atende; nativo seria custo desproporcional)
- ❌ Marketplace de assinatura tipo Substack (autoras cobrarem leitores) — descaracteriza o posicionamento íntimo
- ❌ IA generativa de escrita (ferramentas externas existem; o produto é sobre voz humana)
- ❌ Anúncios — em qualquer formato, em qualquer momento

---

## 8. Technical Considerations

> *Considerações iniciais. Não são decisões fechadas — o `@architect` vai validar e formalizar em ADRs.*

### Platform Requirements

- **Plataformas-alvo:** Web responsiva — desktop primeiro (escrita longa), mobile como secundário mas funcional (consultar arquivo, escrever rápido em movimento).
- **Browsers/OS suportados:** últimas 2 versões de Chrome, Safari, Firefox e Edge. iOS Safari 16+ e Chrome Android 110+. Sem suporte explícito a IE/legados.
- **Requisitos de performance:**
  - **TTI (Time to Interactive):** < 2,0s em 4G simulado (essencial — entrar e escrever sem espera)
  - **FCP (First Contentful Paint):** < 1,0s
  - **CLS (Cumulative Layout Shift):** < 0,05 (estabilidade visual no editor é sagrada)
  - **Autosave:** latência percebida zero — debounce de 800ms, salva em background
  - **Lighthouse score:** ≥ 95 nas 4 categorias para páginas públicas (SEO + acessibilidade)
- **Acessibilidade:** WCAG 2.1 AA — leitores de tela funcionam, contraste mínimo, navegação por teclado completa no editor.
- **Progressive Web App (Fase 2):** PWA instalável com modo offline para escrita.

### Technology Preferences

> *Stack escolhida por: maturidade, custo zero/baixo no MVP, alinhamento com expertise do desenvolvedor solo, e capacidade de escalar até 1k usuárias sem reescrita.*

| Camada | Tecnologia | Razão |
|--------|-----------|-------|
| **Frontend** | **Next.js 16 (App Router)** + **React 19** + **TypeScript** | Mesma stack do Team Manager (Minds Idiomas) e MandatoPE. SSR para páginas públicas (SEO), CSR para editor. |
| **Estilização** | **Tailwind CSS 4** + **shadcn/ui** (componentes seletivos) | Velocidade de desenvolvimento, design system coerente. Customização tipográfica feita via tokens próprios. |
| **Tipografia** | 1 fonte serifada Google Font (candidatas: **Lora**, **Source Serif 4**, **Fraunces**, **EB Garamond**) | Decisão estética crítica — definir com Geovana. Self-host para performance. |
| **Editor de texto** | **Tiptap** (ProseMirror wrapper) com markdown leve, ou **Lexical** (Meta) | Tiptap por maturidade + comunidade. Markdown bidirecional invisível para a usuária. |
| **Backend** | **Next.js Route Handlers** + **Server Actions** | Sem servidor separado. Tudo no Vercel. |
| **Database** | **Supabase PostgreSQL** | Mesma stack dos outros projetos. RLS nativo, backups automáticos, generoso free tier. |
| **Auth** | **Supabase Auth — Magic Link only** (sem senha) | Sem senha = sem fricção, sem reset, sem leak. Email único = identidade. |
| **Hosting** | **Vercel (Hobby tier no MVP, Pro depois)** | Deploy automático no push, edge network global, preview branches, analytics nativo. |
| **Domínio** | **Registro.br** — `escritosdageo.com.br` (primário) + `escritosda.geo` ou `escritos.app` (secundário, futuro) | .com.br para identidade brasileira; .app/.geo para escala. |
| **Email transacional** | Supabase Auth nativo (magic links) no MVP. **Resend** quando precisar customizar templates. | Resend tem free tier generoso e DX excelente. |
| **Analytics** | **Vercel Analytics** (privacy-first, sem cookies) + **Plausible** opcional | Sem Google Analytics. Coerência ética com posicionamento. |
| **Erros / Observabilidade** | **Sentry** (free tier) — só erros, não tracking de usuária | Diagnosticar bugs sem comprometer privacidade. |

### Architecture Considerations

**Estrutura do repositório**

- **Monorepo simples** — um único projeto Next.js. Sem turborepo, sem múltiplos packages. Solo dev, escopo pequeno = simplicidade vence.
- Estrutura típica:
  ```
  escritos-da-geo/
  ├── app/
  │   ├── (privado)/        ← editor, lista, configurações (auth required)
  │   ├── (publico)/        ← /[slug], / (índice público)
  │   ├── api/              ← rotas mínimas
  │   └── auth/             ← login, callback magic link
  ├── components/
  ├── lib/
  │   ├── supabase.ts       ← cliente Supabase (admin + browser)
  │   ├── editor.ts         ← config do Tiptap
  │   └── db.ts             ← queries por domínio
  ├── styles/
  └── supabase/
      └── migrations/       ← versionadas desde o dia 1
  ```

**Arquitetura de serviços**

- **Monolítico, single-tenant no MVP** (Geovana é a única usuária). Multi-tenant na Fase 2 com convite — adiciona-se `user_id` em todas as tabelas, RLS por user.
- Sem filas, sem workers, sem microserviços. Tudo síncrono.
- Server Actions para mutações privadas (escrita, publicar/despublicar). Route Handlers públicos só para webhook futuro de comentários.

**Modelo de dados (esboço)**

```
users           (Supabase Auth gerencia)
profiles        (id, slug do domínio, display_name, bio, criado_em)
texts           (id, user_id, title, slug, body_markdown, body_html,
                 status [private|public], published_at, created_at, updated_at)
```

Fase 2 adiciona: `comments`, `collections`, `text_views` (analytics privado).

**Integrações no MVP**

- **Nenhuma externa.** Supabase + Vercel + Resend (futuro). Sem Stripe, sem Mailchimp, sem SDK de terceiros.
- Geração de Open Graph image dinâmica via `@vercel/og` (página pública compartilhável).

**Segurança & Compliance**

| Aspecto | Abordagem |
|--------|-----------|
| **Autenticação** | Magic link, expira em 1h, single-use |
| **Autorização** | RLS no Supabase (defense in depth) — usuária só lê/escreve seus próprios textos |
| **Comunicação** | HTTPS only (Vercel default), HSTS habilitado |
| **Sanitização** | Markdown renderizado server-side com **DOMPurify** ou **rehype-sanitize** para prevenir XSS |
| **Rate limiting** | Vercel Edge rate limit nas rotas públicas (proteção contra scraping) |
| **Backup** | Supabase backup diário automático (free tier inclui 7 dias) + export manual semanal pela própria Geovana (download ZIP markdown) |
| **LGPD** | Política de privacidade clara, dados minimizados (só email + textos), exclusão completa de conta sob demanda |
| **Observabilidade** | Sentry só para erros do servidor; sem rastreamento de comportamento |
| **Secrets** | Variáveis de ambiente Vercel (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` futuro) |

**Custos estimados de infraestrutura**

| Item | MVP (1 usuária) | 100 usuárias | 300 usuárias |
|------|-----------------|--------------|--------------|
| Vercel | Free (Hobby) | Pro (US$ 20/mês) | Pro (US$ 20/mês) |
| Supabase | Free | Pro (US$ 25/mês) | Pro (US$ 25/mês) |
| Domínio .com.br | R$ 40/ano | R$ 40/ano | R$ 40/ano |
| Resend | Free (3k emails/mês) | Free | Pro (US$ 20/mês) |
| Sentry | Free | Free | Free |
| **Total mensal** | **~R$ 4 (só domínio)** | **~R$ 240** | **~R$ 360** |

> Validação: MVP cabe completamente em **free tier**. Custos só sobem com adoção real — modelo viável.

---

## 9. Constraints & Assumptions

### Constraints

| Dimensão | Restrição |
|----------|-----------|
| **Orçamento** | **R$ 0 em desenvolvimento (custo de oportunidade do tempo do Lucas).** Custo de infraestrutura no MVP: máximo **R$ 50/mês** (domínio + tier free Vercel + free Supabase). Sem orçamento de marketing, sem orçamento de design pago. |
| **Timeline** | **MVP em 6-8 semanas** trabalhando part-time (5-10h/semana). Lucas tem outros projetos ativos (ARLTech, Team Manager, Prisma, MandatoPE), então este projeto compete por tempo e atenção. **Lançamento-alvo: ~junho de 2026**, validação 90 dias até **setembro de 2026**. |
| **Recursos humanos** | **1 desenvolvedor solo** (Lucas Rodrigues, full-stack). **1 curadora-parceira** (Geovana Soares, primeira usuária e juíza de qualidade). **0 designers dedicados** (decisões de design feitas por Lucas em colaboração com Geovana). **0 profissionais de marketing.** |
| **Técnicas** | • Limites do free tier Supabase (500MB DB, 5GB bandwidth, 50k MAU auth) — suficientes para MVP, exigem upgrade na fase 2.<br>• Vercel Hobby tier proíbe uso comercial — migrar para Pro quando monetizar.<br>• Single-tenant no MVP (refactor obrigatório para multi-tenant na Fase 2).<br>• Sem suporte a múltiplos idiomas (português brasileiro apenas).<br>• Sem app mobile nativo (PWA atende).<br>• Sem integração com sistemas externos (Day One, Notion, etc.). |
| **Estratégicas** | • **Sem investimento externo** — bootstrap puro, viabilidade financeira é teste inerente.<br>• **Sem urgência de mercado** — não há janela competitiva fechando; pressão é interna (entregar para Geovana).<br>• **Sem compromisso de retorno financeiro no horizonte de 12 meses** — produto-presente que pode virar produto. |

### Key Assumptions

> *Cada assunção abaixo é uma aposta. Algumas são razoáveis, algumas são frágeis. Listá-las explícitas é o que separa um plano honesto de um sonho.*

**Sobre a usuária-âncora (a maior aposta)**

- Geovana **vai realmente usar** o app diariamente quando ele existir — não apenas dizer que vai.
- Geovana **topa o nome "Escritos da Geo"** publicamente associado a ela (conversa pendente).
- Geovana **aceita ser parceira de produto** — dar feedback recorrente, criticar honestamente, participar de decisões de design.
- A pulsão dela de escrever em cadernos físicos é forte o suficiente para sobreviver à transição para digital — o ritual migra, não morre.

**Sobre o segmento primário**

- Existem **pelo menos 200 escritoras-de-caderno no Brasil** com perfil similar ao de Geovana, alcançáveis via comunidades pequenas (Instagram literário, grupos de WhatsApp de leitura, livrarias independentes, oficinas de escrita criativa).
- Esse segmento **valoriza estética e privacidade acima de funcionalidades** — a aposta de fazer um produto bonito e cortado vai ressoar.
- Esse segmento **adota produtos por indicação direta** (não por busca, não por ad) — viabilizando crescimento orgânico sem orçamento de marketing.

**Sobre o mercado e momento**

- A **fadiga de redes sociais é tendência sustentada**, não modismo passageiro — Are.na, Bear Blog, Bluesky-modo-poético validam o movimento.
- O **nicho lusófono de escrita íntima** está mal-servido por produtos atuais (todos os concorrentes citados são americanos ou globais sem alma local).
- **Não há concorrente brasileiro relevante** entrando neste mesmo vão nos próximos 18 meses.

**Sobre execução técnica**

- A stack escolhida (**Next.js + Supabase + Vercel**) sustenta o MVP sem reescrita até pelo menos 500 usuárias ativas.
- Lucas conseguirá dedicar **5-10h/semana de forma consistente** ao projeto, sem ser canibalizado por urgências dos outros projetos clientes.
- **Magic link** é UX adequada — público-alvo é tech-aware o suficiente para entender e usar.
- **Tiptap + markdown leve** é suficientemente expressivo para escrita literária brasileira — sem demanda por features de tabelas, embeds, código, etc.
- Free tier Supabase + Vercel atende **toda a fase MVP (1 usuária, 90 dias)** sem extrapolação.

**Sobre comportamento esperado**

- Privacidade-por-padrão **não é fricção indesejada** — é diferencial reconhecido pela usuária.
- Ausência de comentários no MVP **não vai ser bloqueio** para Geovana publicar texto público.
- Cooling-off natural (publicar exige confirmação) **não vai irritar** — vai ser percebido como cuidado.

**Sobre modelo de negócio futuro**

- Existirá **disposição a pagar de R$ 12-19/mês** entre as 100-300 usuárias futuras, validando assinatura simbólica.
- Geovana **estará confortável** com o produto eventualmente cobrar de outras autoras (mas sempre gratuito para ela).
- **Não haverá necessidade de captar investimento** nos primeiros 24 meses — operação cabe no caixa do criador.

### Assunções de maior risco (priorizar validação)

> *Se uma destas se mostrar falsa, o produto colapsa. Listadas em ordem decrescente de risco para o projeto:*

1. 🔴 **Geovana vai usar diariamente.** — Se não, MVP fracassa em 30 dias. **Validação:** conversa franca com ela antes de qualquer linha de código.
2. 🟠 **Existem 200+ escritoras alcançáveis com perfil similar.** — Se não, produto vira app pessoal sem caminho a produto. **Validação:** entrevistar 5-10 escritoras-de-caderno no nicho antes do lançamento público.
3. 🟠 **Lucas mantém ritmo de 5-10h/semana.** — Se não, MVP atrasa indefinidamente, momentum morre. **Validação:** revisar capacidade real frente à carga atual.
4. 🟡 **Estética importa o suficiente para diferenciar.** — Se as usuárias forem indiferentes à beleza tipográfica, perdemos o principal moat. **Validação:** mostrar protótipo a 5 escritoras antes do lançamento.
5. 🟡 **Free tier Vercel/Supabase aguenta 100 usuárias.** — Se não, custo dispara antes da validação. **Validação:** monitorar bandwidth/DB durante MVP.

---

## 10. Risks & Open Questions

### Key Risks

> *Listados em ordem decrescente de impacto potencial sobre o projeto.*

- **🔴 Risco de adoção zero pela usuária-âncora** — Geovana, por qualquer razão (estética não ressoa, timing pessoal, preferência pelo caderno físico, sobrecarga emocional de "ser o experimento"), não usa o produto diariamente. **Impacto:** MVP fracassa em 30 dias; toda a estratégia *product-of-one* colapsa; Lucas fica com produto sem propósito real.

- **🔴 Risco de exposição não desejada para Geovana** — O produto carrega o nome dela publicamente. Se ela mudar de ideia depois do lançamento, ou se a exposição gerar desconforto (julgamentos, comentários invasivos, ansiedade pública), o impacto pessoal pode ser sério. **Impacto:** sofrimento real para Geovana, eventual rebrand traumático ou descontinuação do produto.

- **🟠 Risco de consistência de execução do dev solo** — Lucas tem 4 outros projetos ativos (clientes pagantes têm prioridade). Janelas longas sem desenvolvimento matam momentum, especialmente em projeto sem deadline externo. **Impacto:** MVP atrasa de 8 semanas para 6+ meses, motivação esfria, projeto morre por inanição.

- **🟠 Risco do nicho ser real-mas-pequeno-demais** — As 200+ escritoras-de-caderno podem existir, mas serem **inacessíveis** sem orçamento de marketing e sem audiência prévia. **Impacto:** produto bonito sem usuárias além de Geovana; sem comunidade, viabilidade comercial nunca se materializa.

- **🟠 Risco estético não ressoar** — A aposta central é "estética como diferencial". Se as escritoras não percebem ou não valorizam a beleza tipográfica/curadoria, o moat desaparece e viramos só "mais um app de escrita". **Impacto:** posicionamento se dilui; concorrer com Day One/Substack em features (que perderemos).

- **🟡 Risco de vazamento de dados / falha de privacidade** — Produto vende privacidade radical. Um único incidente (vazamento, bug que expõe texto privado, comprometimento da Supabase) destrói a confiança permanentemente. **Impacto:** existencial — produto sobre privacidade não sobrevive a falha de privacidade.

- **🟡 Risco de vendor lock-in (Vercel + Supabase)** — Mudança de termos, aumento de preço ou descontinuação de serviços críticos. **Impacto:** custo dispara ou migração emergencial cara. Mitigado pelo fato de Supabase ser open-source (auto-hospedável em emergência).

- **🟡 Risco de cópia por player maior** — Substack ou Medium lança "modo privado-primeiro" e absorve nosso diferencial sem nosso esforço. **Impacto:** mercado consolidado por player com distribuição. Mitigado pelo fato de o ethos "anti-escala" ser difícil para essas empresas executarem.

- **🟡 Risco de burnout do criador solo** — Projeto pessoal sem deadline + cobrança interna pode virar peso emocional. Soma-se à carga dos outros projetos. **Impacto:** abandono ou descontinuação; pior, dano à relação com Geovana se ela se sentir responsável.

- **🟡 Risco de UX do magic link** — Login sem senha pode parecer estranho para Geovana ou para usuárias menos tech-aware. Email pode cair em spam. **Impacto:** fricção em pontos críticos (primeiro login, login após dias). Mitigável com onboarding cuidadoso.

- **🟢 Risco de SEO ruim para páginas públicas** — Páginas individuais podem não rankear no Google, dificultando descoberta orgânica. **Impacto:** menor que parece — modelo de descoberta é por indicação, não por busca. Próximo de zero impacto na fase MVP.

- **🟢 Risco de obsolescência tecnológica** — Next.js 16, Tiptap, etc. podem ter breaking changes. **Impacto:** baixo no horizonte de 12-24 meses; manutenção previsível.

### Open Questions

> *Perguntas em aberto cuja resposta vai alterar o produto. Cada uma exige decisão antes de avançar para PRD ou desenvolvimento.*

**Sobre Geovana e o nome**

- A Geovana sabe que este projeto está em planejamento? Ela já viu este brief?
- Ela topa "Escritos da Geo" como nome? Como ela se sente sobre o apelido "Geo" virar marca pública?
- Qual é o limite de exposição confortável para ela? (perfil completamente anônimo? nome próprio? bio? foto?)
- Ela quer participar como co-criadora declarada ou prefere ser "apenas a primeira usuária"?

**Sobre escopo e features**

- Páginas públicas devem permitir **assinatura por email** (newsletter) já no MVP, ou esperar Fase 2?
- Como tratar **rascunhos**: arquivar implicitamente ou ter "modo rascunho" explícito?
- **Ordenação** dos textos públicos no índice: cronológica reversa, manual (autora curada), ou outra?
- Geovana terá **uma única coleção** no MVP ou já vamos permitir cadernos múltiplos?

**Sobre identidade e estética**

- Qual **fonte serifada** definitiva? (testar com Geovana: Lora vs Source Serif vs Fraunces vs EB Garamond)
- **Paleta de cores**: tons quentes (papel, sépia) ou frios (branco puro, cinza)? Ou neutros?
- O produto terá **logo/marca visual** ou apenas tipografia pura?
- **Tom de voz** das poucas mensagens do sistema (vazio, erro, confirmação): formal? íntimo? poético? seco?

**Sobre modelo de negócio**

- Quando começamos a pensar em monetização: mês 12, mês 18, ou só quando 50+ usuárias?
- Modelo: **assinatura simbólica**? **doação tipo Buy Me a Coffee**? **freemium honesto**? Ou produto eternamente gratuito sustentado por outra receita do criador?
- Geovana e early adopters terão **acesso vitalício gratuito**? (Recomendo fortemente sim.)

**Sobre crescimento e abertura**

- Quando abrir cadastro além de Geovana: **mês 4 (após validação)** ou **mês 12 (após maturidade)**?
- Modelo de abertura: **lista de espera**, **convite-only** ou **aberto a quem encontrar**?
- Como **encontrar** as primeiras 10 outras escritoras? Onde elas estão?

**Sobre infraestrutura e operação**

- **Domínio principal**: `escritosdageo.com.br` ou alguma variação?
- Política de **backup pessoal**: incentivar Geovana a exportar mensalmente para arquivo local?
- **Termos de uso e política de privacidade**: criar custom ou adaptar templates? Quem revisa juridicamente?

### Areas Needing Further Research

> *Trabalhos de pesquisa a executar antes da decisão final do PRD.*

- **Entrevistas qualitativas com 5-10 escritoras-de-caderno** — validar persona primária, entender ritual de escrita, testar receptividade ao conceito. → Tarefa para `@analyst` usando `*perform-market-research` ou pesquisa direta.
- **Análise estética profunda de concorrentes** — Day One, Bear Blog, Posthaven, Substack, Are.na, Ghost. Capturar tipografia, hierarquia visual, fluxo de publicação, ritmo de uso.
- **Teste de tipografia com Geovana** — produzir mockup com 4 fontes diferentes, mesmo texto, e observar reação dela. Decisão de marca crítica.
- **Estudo do mercado lusófono de escrita íntima** — comunidades existentes (Instagram literário, Telegram, WhatsApp), tamanho estimado, hábitos de descoberta.
- **Mapeamento jurídico LGPD** — o mínimo necessário para um produto que armazena texto pessoal e expõe nome de autora. Custo para revisão profissional.
- **Comparativo técnico de editores** — Tiptap vs Lexical vs Plate.js. Critérios: markdown bidirecional, performance, manutenção da comunidade, customização tipográfica.
- **Análise de fadiga de redes sociais** — números recentes (2025-2026) de movimento de saída de Instagram/Twitter, adoção de plataformas calmas (Are.na, Bear Blog, Bluesky).
- **Pesquisa de naming e domínios** — confirmação de disponibilidade `escritosdageo.com.br`, alternativas, conflito com marcas registradas.
- **Estudo de modelos de monetização ética em produtos pequenos** — Pillar, Bear Blog (US$ 5/mês), Are.na (US$ 7/mês), Ghost. O que funciona em escala pequena?
- **Investigação de migração single→multi-tenant** — qual o real custo técnico de adicionar `user_id` em todas as tabelas, configurar RLS por user, e abrir cadastro? Faseamento adequado.

---

## 11. Appendices

### A. Research Summary

> *Pesquisa formal ainda não conduzida.* Listada como prioridade na Seção 10 (Areas Needing Further Research). O brief atual é construído sobre:
>
> - **Conhecimento do criador** sobre a usuária-âncora (Geovana — esposa do Lucas, observação direta de seu ritual de escrita)
> - **Análise de mercado informal** baseada em movimento documentado de fadiga de redes sociais (2024-2026)
> - **Posicionamento competitivo derivado** do mapeamento de Day One, Substack, Bear Blog, Tumblr, Are.na, Notion
> - **Heurísticas de produto-de-um** baseadas em casos como Basecamp, Notion, Pieter Levels
>
> **Pesquisa formal a ser conduzida pelo `@analyst` antes do PRD:**
> 1. Entrevistas qualitativas com 5-10 escritoras-de-caderno
> 2. Análise estética profunda de concorrentes diretos
> 3. Estudo do mercado lusófono de escrita íntima
> 4. Comparativo técnico de editores (Tiptap, Lexical, Plate.js)

### B. Stakeholder Input

> *⚠️ Pendência crítica:* **Geovana Soares ainda não foi consultada formalmente sobre este projeto.** O brief atual reflete a perspectiva e a observação do criador (Lucas Rodrigues) sobre a usuária-âncora, mas **não substitui a validação direta com ela**.
>
> **Inputs pendentes a coletar antes do PRD:**
> - Validação do nome "Escritos da Geo"
> - Validação da exposição pública do apelido "Geo"
> - Confirmação do interesse genuíno de uso
> - Limites de exposição confortável (foto, bio, perfil completo?)
> - Preferências estéticas (tipografia, cor, tom)
> - Disposição a participar como co-criadora vs primeira usuária

### C. References

**Produtos analisados (concorrentes ou referências)**

- Day One — `dayoneapp.com` (diário privado premium)
- Bear Blog — `bearblog.dev` (blog minimalista, anti-distração)
- Posthaven — `posthaven.com` (blog vitalício, simples)
- Substack — `substack.com` (newsletter literária e jornalística)
- Tumblr — `tumblr.com` (microblog social, referência histórica)
- Medium — `medium.com` (publicação social com paywall)
- Are.na — `are.na` (rede calma, anti-algoritmo)
- Ghost — `ghost.org` (CMS open source para criadores)
- Pillar — `pillar.io` (publicação minimalista assinatura)

**Inspirações de filosofia / posicionamento**

- *"Company of One"* — Paul Jarvis (filosofia de negócio pequeno)
- *"Make Something People Want"* — Pieter Levels (product-of-one indie hacker)
- Newsletter *Calm Tech* — Amber Case (tecnologia que respeita atenção)
- Manifesto do Bear Blog (`herman.bearblog.dev/`)

**Referências literárias brasileiras (estética e tom)**

- Hilda Hilst — *Cadernos de uma vida*
- Clarice Lispector — *Crônicas*
- Adélia Prado — diários e poesia íntima
- Eliane Brum — crônica jornalística íntima
- Carla Madeira — narrativa contemporânea íntima

**Stack técnica (documentação base)**

- Next.js 16 — `nextjs.org/docs`
- Supabase — `supabase.com/docs`
- Tiptap — `tiptap.dev`
- Vercel — `vercel.com/docs`
- shadcn/ui — `ui.shadcn.com`

---

## 12. Next Steps

### Immediate Actions

> *Em ordem de urgência. Os 4 primeiros passos não custam linhas de código — são validações estratégicas que evitam construir produto errado.*

1. **Conversar com Geovana** sobre o projeto. Apresentar o brief inteiro, ouvir reações honestas, validar nome, validar interesse real de uso, validar limites de exposição. Sem essa conversa, **nada deve avançar**.

2. **Verificar disponibilidade do domínio** `escritosdageo.com.br` no Registro.br e alternativas (`escritosdageo.app`, `geosoares.com.br`). Se disponível, **registrar imediatamente** (R$ 40/ano protege a marca).

3. **Conduzir pesquisa qualitativa do segmento primário** — `@analyst` executa: entrevistar 5-10 escritoras-de-caderno (Instagram literário, conhecidas da Geovana, comunidades online). Validar que o perfil existe além de Geovana.

4. **Testar tipografia com Geovana** — produzir mockup HTML simples com o mesmo texto em 4 fontes serifadas (Lora, Source Serif 4, Fraunces, EB Garamond) e observar a reação dela. Decisão estética crítica.

5. **Handoff para `@pm`** — passar este brief para Morgan (Product Manager) iniciar a criação do PRD detalhado, seção por seção, transformando esta visão estratégica em requisitos executáveis.

6. **Handoff para `@architect`** — após PRD, Aria (Arquiteta) formaliza decisões técnicas em ADRs (Architecture Decision Records).

7. **Setup do repositório** — após validação dos passos 1-4, Lucas inicializa repositório Git, conecta a Vercel, configura projeto Supabase, e prepara ambiente para desenvolvimento.

8. **Sprint MVP** — Lucas executa 6-8 semanas de desenvolvimento part-time com foco na Seção 6 (MVP Scope), seguindo PRD do `@pm` e arquitetura do `@architect`.

9. **Lançamento privado** — entrega para Geovana usar diariamente. Início do período de validação de 90 dias.

10. **Avaliação MVP** — análise dos 6 critérios de sucesso (Seção 6) após 90 dias. Decisão go/no-go para Fase 1.5 (comentários + multi-usuárias).

### PM Handoff

> Este Project Brief fornece o contexto completo para **Escritos da Geo**.
>
> Por favor, inicie em **'PRD Generation Mode'**, revise o brief minuciosamente para trabalhar com o usuário na criação do PRD seção por seção, conforme o template `prd-tmpl.yaml` indica, pedindo qualquer esclarecimento necessário ou sugerindo melhorias.
>
> **Atenção especial à pendência crítica:** validar com Geovana antes de avançar para detalhamento de requisitos. Se ela não tiver sido consultada, recomendar pausa até que esta validação ocorra.

---

*Brief facilitado por Atlas (`@analyst`) em modo Interactive seguindo template AIOX `project-brief-tmpl.yaml v2.0`.*
