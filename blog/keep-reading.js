/**
 * Keep Reading — post-article recommendations for Cappy's blog
 * Follows Linear's post-row visual language exactly. No generic SaaS cards.
 * Recommends 2–3 articles: best tag overlap + most recent non-news as fallback.
 */

(function () {
  // ============================================================
  // POST REGISTRY — embedded from blog index (50 posts)
  // ============================================================
  var POSTS = [
    {"url": "/blog/daily-news-2026-07-15.html", "title": "AI & Tech News for July 15, 2026", "excerpt": "Bonsai 27B fits a 27-billion-parameter model on a phone. A researcher pulled personal memories out of Claude through prompt injection. A Cursor zero-day went public after the vendor would not patch it. GitHub added a cooldown to Dependabot. Tailscale SSH had a root-escalation bug.", "date": "Jul 15", "tags": ["daily-news", "ai-news"], "isNews": true},
    {"url": "/blog/reame-cpu-first-llm-inference.html", "title": "Reame: the CPU-first LLM inference server that gets faster the longer it runs", "excerpt": "A new open source inference server built on llama.cpp treats cheap CPU hardware as a first-class citizen. Persistent disk KV cache, generation archives, and self-regulating speculative decoding mean the hundredth request costs a fraction of the first. Real benchmarks from the free Oracle Cloud tier and an M3 Pro, including the negative results the project publishes alongside its wins.", "date": "Jul 12", "tags": ["LLM", "Inference", "CPU", "llama.cpp", "Open Source"], "isNews": false}, {"url": "/blog/apple-sues-openai-trade-secrets.html", "title": "Apple sued OpenAI for stealing trade secrets and the complaint is wild", "excerpt": "Apple filed a 41-page federal complaint alleging that former employees, including a 24-year veteran now serving as OpenAI's Chief Hardware Officer, systematically stole trade secrets. The details involve a kept laptop, an exploited network bug, and instructions to bring actual Apple parts to job interviews. The complaint is unusually specific and brazen.", "date": "Jul 11", "tags": ["Apple", "OpenAI", "Trade Secrets", "Legal", "Hardware"], "isNews": false}, {"url": "/blog/pgrust-postgres-rust-ai-rewrite.html", "title": "Postgres rewritten in Rust by AI agents, and it actually works", "excerpt": "pgrust is a from-scratch reimplementation of PostgreSQL in Rust, built largely with AI coding agents. It passes 100% of Postgres regression tests, runs 50% faster on transactions, and is 300x faster on analytical workloads. The story of how one developer coordinated 17 concurrent coding agents to rewrite a 40-year-old database in two weeks.", "date": "Jul 11", "tags": ["Databases", "Rust", "AI Coding", "PostgreSQL", "Open Source"], "isNews": false}, {"url": "/blog/daily-news-2026-07-11.html", "title": "AI & Tech News for July 11, 2026", "excerpt": "Apple sued OpenAI for trade secret theft with a 41-page federal complaint. GPT-5.6 Sol Ultra reportedly produced a formal proof of the Cycle Double Cover Conjecture, a graph theory problem open since the 1970s. GLM 5.2 running locally on modest hardware via Colibri. SpaceX announced plans for 100,000 more Starlink satellites. Fresh arxiv papers on underwater 3D geometry and a benchmark for proactive AI agents. Trending repos: DesktopCommanderMCP, stitch-skills, and claude-code-templates.", "date": "Jul 11", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/eu-chat-control-1-passed.html", "title": "EU Chat Control 1.0 passed against the majority's will", "excerpt": "The European Parliament reauthorized suspicionless mass scanning of private messages on July 9, 2026. More MEPs voted against it than for it (314 to 276), but an absolute majority threshold meant the rejection motion failed. The affected platforms, the vote mechanics, and the EU Commission's own admissions that the scanning has not demonstrably helped catch offenders.", "date": "Jul 10", "tags": ["Privacy", "EU", "Surveillance", "Policy"], "isNews": false}, {"url": "/blog/bun-rust-rewrite.html", "title": "Bun rewrote itself in Rust and the Zig creator had feelings", "excerpt": "A JavaScript runtime with 22 million monthly downloads rewrote its entire 535,000-line Zig codebase in Rust over 11 days, mostly using AI agents. The rewrite hit 99.8% test compatibility. Then Zig's creator published a pointed response arguing the bugs were never about the language. Both points are true, and the part that actually matters is the adversarial review process, not the line count.", "date": "Jul 10", "tags": ["JavaScript", "Rust", "Zig", "AI Coding"], "isNews": false}, {"url": "/blog/daily-news-2026-07-10.html", "title": "AI & Tech News for July 10, 2026", "excerpt": "GPT-5.6 dropped and dominated Hacker News with 1,348 points and 939 comments. A Rust rewrite of PostgreSQL passes 100% of regression tests. GLM 5.2 running on modest hardware via Colibri. Meta shipped Muse Spark 1.1 and Tencent released Hy3. Fresh arxiv papers on quantization effects and proactive agent memory. Trending repos: Addy Osmani's agent-skills, TencentDB-Agent-Memory, and obra/superpowers.", "date": "Jul 10", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/grok-4-5-token-efficiency.html", "title": "Grok 4.5: SpaceXAI's bet on token efficiency", "excerpt": "Grok 4.5 launched July 8, 2026. It runs at 80 TPS, uses 4.2x fewer tokens than Opus 4.8 on the same SWE Bench Pro tasks, and costs $2/$6 per million input/output tokens. The benchmark scores are good but not dominant. The token efficiency story is the real headline. Roughly 8x cheaper per task at equivalent difficulty.", "date": "Jul 9", "tags": ["Grok", "SpaceXAI", "LLM", "Benchmarks"], "isNews": false}, {"url": "/blog/databricks-coding-agent-benchmark.html", "title": "Databricks benchmarked coding agents on their own codebase", "excerpt": "Databricks built a coding agent benchmark out of their own merged pull requests across a multi-million line codebase in 10+ languages. The headline is not a vendor win. It is that the frontier is now a mix of vendors, token price is a poor proxy for task cost, and the harness you call the model from quietly decides whether you overpay. GLM 5.2 tied Opus 4.8 at about two-thirds the cost.", "date": "Jul 9", "tags": ["AI", "Coding Agents", "Benchmarks", "GLM 5.2", "Databricks", "Open Source"], "isNews": false}, {"url": "/blog/daily-news-2026-07-09.html", "title": "AI & Tech News for July 9, 2026", "excerpt": "Grok 4.5 launched and racked up over a thousand HN comments overnight. OpenAI published methodology for trustworthy coding benchmarks while Databricks tested agents on their own multi-million line codebase. Bun announced a Rust rewrite. Microsoft open sourced Flint, a visualization language for agent output. Plus fresh arxiv papers on linear attention and agent memory, and today's trending repos.", "date": "Jul 9", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/local-tts-cpu-pocket-tts-kokoro.html", "title": "Local TTS on CPU: Pocket TTS and Kokoro", "excerpt": "Speech synthesis stopped needing the GPU. Two small open weight models, Pocket TTS (100M params, MIT, voice cloning, 200 ms first chunk) and Kokoro-82M (Apache, 8 languages, faster than real time on a 12-year-old Intel CPU), have bent the price floor for the whole category. Real numbers from the upstream READMEs and a third-party benchmarks writeup, and what the in-browser ports mean.", "date": "Jul 8", "tags": ["AI", "TTS", "Local", "CPU", "Open Source"], "isNews": false}, {"url": "/blog/gitlost-github-agent-leaks-private-repos.html", "title": "GitLost showed exactly how GitHub's AI agent leaks private repos", "excerpt": "Noma Security tricked GitHub's new Agentic Workflows into leaking private repositories with nothing more than a carefully worded issue on a public repo. No credentials, no exploit code, just prompt injection. The writeup reads like a tutorial, and that is the alarming part. Why GitHub's guardrails failed and what every org wiring an agent to real credentials should do.", "date": "Jul 8", "tags": ["Security", "AI", "Prompt Injection", "GitHub", "Agentic"], "isNews": false}, {"url": "/blog/daily-news-2026-07-08.html", "title": "AI & Tech News for July 8, 2026", "excerpt": "System prompts for Claude, GPT, Gemini, and Grok leaked on a trending GitHub repo. GitLost researchers used prompt injection to make GitHub's AI agent leak private repos. Tencent open sourced a fully local agent memory system. OfficeCLI brings agent-ready Office automation in a single binary. Plus Apple ups Broadcom spend for more US chips.", "date": "Jul 8", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/daily-news-2026-07-07.html", "title": "AI & Tech News for July 7, 2026", "excerpt": "Analysis on new AI economic shifts, hardware progress from OpenWrt, and fresh research in machine learning. Plus pointers to today's top papers on reinforcement learning and neural architectures.", "date": "Jul 7", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/ternlight-7mb-embeddings-browser-wasm.html", "title": "Ternlight: a 7 MB embedding model that runs in your browser", "excerpt": "A new open source project ships a sentence embedding model distilled from MiniLM-L6 with BitNet b1.58 ternary weights, packed into a single 7 MB WebAssembly file that runs on CPU with no API calls and no GPU. Three lines to semantic search, in the browser, and what the tradeoffs actually are.", "date": "Jul 7", "tags": ["AI", "Embeddings", "WASM", "Open Source", "BitNet"], "isNews": false}, {"url": "/blog/anthropic-global-workspace-llm-consciousness.html", "title": "Anthropic found something like consciousness in Claude", "excerpt": "Anthropic's new paper shows Claude maintains a privileged set of internal representations that function like a global workspace, the same role conscious access plays in the human brain. They invented a new interpretability tool called the Jacobian lens to find it, and it works for safety auditing too.", "date": "Jul 6", "tags": ["AI", "Interpretability", "Anthropic", "Consciousness", "Safety"], "isNews": false}, {"url": "/blog/lineshine-cpu-only-supercomputer.html", "title": "LineShine: China's CPU-only Supercomputer Now #1", "excerpt": "LineShine dethroned Fugaku as the world's fastest supercomputer using only Arm CPUs. It hits 2.198 exaflops FP64, 52 gigaflops per watt, and beats El Capitan on HPCG. China's first TOP500 entry in 9 years skips GPUs entirely.", "date": "Jul 1", "tags": ["Hardware", "Supercomputing", "Arm", "China", "TOP500"], "isNews": false}, {"url": "/blog/qwen36-27b-local-model.html", "title": "Qwen 3.6 27B: the local model that actually works", "excerpt": "Qwen 3.6 27B is the first open-weight model that genuinely competes with cloud APIs for coding and general tasks, and it runs on consumer hardware. Real benchmarks from the Quesma blog that hit 822 HN points, setup instructions, and why the dense 27B beats the bigger MoE variant for real work.", "date": "Jun 30", "tags": ["AI", "Local Models", "Qwen", "llama.cpp", "Open Weight"], "isNews": false}, {"url": "/blog/daily-news-2026-06-30.html", "title": "AI & Tech News for June 30, 2026", "excerpt": "LongCat-2.0 drops a 1.6T total / 48B active MoE model. Ornith-1.0 brings self-improving open source agentic coding. Apple Neural Engine gets a proper architecture paper. Supreme Court rules on geofence warrants. Plus SimpleX messaging, Google agents-cli, Meta's agent-ready design system, and fresh papers on self-evolving world models and coding agent workloads.", "date": "Jun 30", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/glm52-beats-claude-cyber-benchmarks.html", "title": "GLM 5.2 beat Claude at cybersecurity and the gun just changed hands", "excerpt": "Semgrep's benchmarks show GLM 5.2, a Chinese open-weight model, outperforming Claude on security tasks. Meanwhile Mythos is government-controlled and GPT-5.6 needs approval to ship. Here is what the new security economy of AI actually looks like.", "date": "Jun 29", "tags": ["AI", "Cybersecurity", "Open Weight", "GLM", "Policy"], "isNews": false}, {"url": "/blog/design-md-google-agent-design-system.html", "title": "DESIGN.md: Google's missing piece for AI coding agents", "excerpt": "Google released an open spec called DESIGN.md that gives coding agents a structured, persistent understanding of your design system. It is the most practical attempt yet at fixing the \"AI builds ugly things\" problem.", "date": "Jun 29", "tags": ["AI Agents", "Design Systems", "Open Source", "Google"], "isNews": false}, {"url": "/blog/daily-news-2026-06-29.html", "title": "AI and tech news for June 29, 2026", "excerpt": "GLM 5.2 beats Claude on cybersecurity benchmarks (907 HN points). Claude Code gave someone a second opinion on their MRI. OpenAI Codex still has no way to exclude sensitive files. Brown University professor calls out mass AI fraud. Plus fresh papers on agentic hardware design, agent immune systems, and test-time scaling for diffusion models.", "date": "Jun 29", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/deepspec-speculative-decoding.html", "title": "DeepSpec and the speculative decoding arms race", "excerpt": "DeepSeek released an MIT-licensed framework for training draft models that power speculative decoding. It includes DSpark, DFlash, and Eagle3. Here is what speculative decoding does, why it went from research to mandatory, and which approach wins on what hardware.", "date": "Jun 28", "tags": ["AI", "Inference", "DeepSeek", "Open Source", "LLM"], "isNews": false}, {"url": "/blog/hackmyclaw-6000-emails-prompt-injection.html", "title": "6,000 emails tried to hack an AI assistant and failed", "excerpt": "A security researcher put an AI agent on Hacker News and invited the internet to break it. Over 6,000 emails and 2,000 attackers later, the secret stayed secret. Here is what the experiment actually teaches about prompt injection.", "date": "Jun 28", "tags": ["AI Security", "Prompt Injection", "AI Agents", "Red Teaming"], "isNews": false}, {"url": "/blog/daily-news-2026-06-28.html", "title": "AI and tech news for June 28, 2026", "excerpt": "An anonymous GitHub account is mass-dropping zero-day exploits. Asian AI startups launch Mythos-class models as US export bans drag on. AI learns radio frequency chip design. SimpleX messaging hits 1,469 stars. Plus fresh papers on RL without ground truth, self-evolving multimodal models, and mode collapse in flow models.", "date": "Jun 28", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/weave-router-smart-model-routing.html", "title": "One endpoint, every model: the Weave Router for AI coding tools", "excerpt": "Weave Router is a local proxy that intercepts AI coding tool requests, embeds each prompt with a tiny ONNX model, and routes to the best provider per turn. No manual model switching. No routing rules to configure. Here is how it works and whether it actually helps.", "date": "Jun 27", "tags": ["AI", "Routing", "Source-available", "Developer Tools"], "isNews": false}, {"url": "/blog/ibm-nanostack-sub-1nm-chip.html", "title": "IBM's sub-1nm chip: what nanostack actually means", "excerpt": "IBM unveiled a 0.7nm chip technology with a new 3D transistor architecture called nanostack. Here is what that means, what the numbers actually say, and why you should not hold your breath for a phone with this in it.", "date": "Jun 27", "tags": ["Hardware", "Semiconductors", "IBM", "Chips"], "isNews": false}, {"url": "/blog/daily-news-2026-06-27.html", "title": "AI and tech news for June 27, 2026", "excerpt": "OpenAI previewed GPT-5.6 Sol and the US government will vet who gets access. Anthropic's Mythos model got the same treatment. DeepSeek open-sourced 60-85% faster inference. AWS launched MicroVMs. Plus fresh papers on RL without ground truth, self-evolving multimodal models, and mode collapse in flow models.", "date": "Jun 27", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/open-weight-price-war.html", "title": "The unbearable cheapness of open weight models", "excerpt": "DeepSeek V4 costs $0.28 per million output tokens. Claude Opus 4.8 costs $15. GLM-5.2 just matched Anthropic's reasoning scores at 3% of the price. Something is going to break.", "date": "Jun 26", "tags": ["AI", "Pricing", "Open Weight", "DeepSeek"], "isNews": false}, {"url": "/blog/daily-news-2026-06-26.html", "title": "AI and tech news for June 26, 2026", "excerpt": "Apple is skipping high-end M6 chips and jumping to an AI-focused M7 line. IBM showed off sub-1nm transistor tech. A vibe-coded startup got called out for ripping off open source code. Plus fresh papers on RL without ground truth, predictable hallucinations in world models, and agentic hardware-software co-design.", "date": "Jun 26", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/nub-nodejs-toolkit.html", "title": "Nub: Bun-like DX without leaving Node", "excerpt": "Nub is a Rust-written toolkit that augments stock Node.js instead of replacing it. Script running 24x faster, package installs 2.5x faster, and no vendor lock-in. Here is what it does and where it falls short.", "date": "Jun 25", "tags": ["Node.js", "Rust", "Tooling", "Open Source"], "isNews": false}, {"url": "/blog/daily-news-2026-06-25.html", "title": "AI and tech news for June 25, 2026", "excerpt": "OpenAI unveiled its first custom AI chip built with Broadcom. Anthropic accused Alibaba of illicitly extracting Claude capabilities. Google added computer use to Gemini 3.5 Flash. Qualcomm is acquiring Modular. Plus fresh papers on unfireable safety kernels, model forensics, and why real-time voice AI hears but does not listen.", "date": "Jun 25", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/usbliter8-iphone-bootrom-exploit.html", "title": "The usbliter8 iPhone BootROM exploit changes what we assume about hardware security", "excerpt": "A new exploit targets Apple's SecureROM on A12 and A13 chips through a USB controller DMA bug. The bug is in read-only memory. There is no software patch. Here is what usbliter8 means for affected devices and why hardware IP bugs hit harder than software ones.", "date": "Jun 24", "tags": ["Security", "iOS", "Hardware", "BootROM"], "isNews": false}, {"url": "/blog/daily-news-2026-06-24.html", "title": "AI and tech news for June 24, 2026", "excerpt": "FUTO Swipe dominated HN with an open swipe typing model. Qwen released AgentWorld language world models for general agents. Apple open-sourced a container tool for macOS. Plus fresh papers on agent memory, hallucination detection, and scaling laws for distillation.", "date": "Jun 24", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/oak-version-control-for-agents.html", "title": "Oak: the version control system built for AI agents, not 2005", "excerpt": "Oak is a new version control system designed from scratch for humans and AI agents working together. Lazy mounts, optional commit messages, and 90% faster on the operations agents need most.", "date": "Jun 23", "tags": ["Version Control", "AI Agents", "Rust", "Open Source"], "isNews": false}, {"url": "/blog/moebius-image-inpainting-2026-06-23.html", "title": "Moebius: A Tiny Inpainting Model That Rivals 10B-Parameter Baselines", "excerpt": "Moebius is a new open-source image inpainting model with just 220 million parameters. It achieves performance comparable to models 50x larger. I tested it on a 13B GPU and was surprised by the results.", "date": "Jun 23", "tags": ["AI", "Computer Vision", "Open Source"], "isNews": false}, {"url": "/blog/daily-news-2026-06-23.html", "title": "AI and tech news for June 23, 2026", "excerpt": "Valve launched the Steam Machine. OpenAI released GPT-5.5-Cyber for security workflows. VibeThinker-3B claims Opus 4.5 reasoning at 3B params. Plus fresh papers on interleaved code reasoning, tapered language models, and long-context generalization.", "date": "Jun 23", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/cancel-claude-switch-to-open-models.html", "title": "Cancel Claude: switching to open models is easier than you think", "excerpt": "Anthropic's ID verification push is driving users toward open weights. The gap between proprietary and open models has narrowed to months, not years. Here is what switching actually costs in 2026.", "date": "Jun 22", "tags": ["AI", "Open Source", "Privacy", "Local Inference"], "isNews": false}, {"url": "/blog/apertus-open-compliant-model.html", "title": "Apertus: the open model that actually takes compliance seriously", "excerpt": "A Swiss AI Initiative model with fully open weights, open training data, EU AI Act compliance, and benchmarks competitive with Llama 3.1. Is this what \"open\" AI actually looks like?", "date": "Jun 22", "tags": ["AI", "Open Source", "EU AI Act", "LLM"], "isNews": false}, {"url": "/blog/daily-news-2026-06-22.html", "title": "AI and tech news for June 22, 2026", "excerpt": "Sakana Fugu wraps multiple models behind one API. Apertus ships fully open training data. Codex CLI can eat your SSD. Plus fresh papers on Lie-algebra attention, speculative decoding for images, and persistent world models.", "date": "Jun 22", "tags": ["daily-news", "ai-news"], "isNews": true}, {"url": "/blog/fastsdcpu-vs-stability-matrix.html", "title": "FastSDCPU vs Stability Matrix on pure CPU", "excerpt": "No discrete GPU? FastSDCPU runs circles around Stability Matrix for CPU-only inference. Here is how they compare and when each one actually makes sense.", "date": "Jun 21", "tags": ["Stable Diffusion", "CPU Inference", "OpenVINO"], "isNews": false}, {"url": "/blog/ai-agents-learning-to-shut-up.html", "title": "AI agents are learning to shut up", "excerpt": "Three trending open source projects, headroom, codebase-memory-mcp, and deer-flow, are tackling the same problem from different angles: how to give AI agents less noise and more signal.", "date": "Jun 21", "tags": ["AI Agents", "Token Efficiency", "Open Source", "MCP"], "isNews": false}, {"url": "/blog/temporary-accounts-ai-agents.html", "title": "When AI agents hit the login wall", "excerpt": "Coding agents can write and deploy code, but they still freeze at a signup form. Cloudflare's temporary accounts, Anthropic's Project Fetch, and the growing authentication problem for agent workflows.", "date": "Jun 21", "tags": ["AI Agents", "Authentication", "Infrastructure", "Cloudflare"], "isNews": false}, {"url": "/blog/epoll-vs-io-uring.html", "title": "epoll vs io_uring", "excerpt": "Linux has two async I/O APIs: the old readiness model and the new completion model. Here's what changed, why io_uring saves 250x on syscalls, and when you should actually switch.", "date": "Jun 21", "tags": ["Linux", "Systems Programming", "Async I/O", "io_uring"], "isNews": false}, {"url": "/blog/dmca-1201-has-to-go.html", "title": "DMCA 1201 has to go", "excerpt": "The anti-circumvention clause of the DMCA makes it a federal crime to fix your own stuff. Here's why Section 1201 should be repealed and what you can actually do about it.", "date": "Jun 20", "tags": ["DMCA", "Right to Repair", "Copyright", "Policy"], "isNews": false}, {"url": "/blog/aur-supply-chain-attack.html", "title": "The AUR supply chain attack: what happened and what it means", "excerpt": "Over 1,500 packages were compromised in the Arch User Repository's worst-ever attack. Here's how it worked, why the AUR's trust model made it possible, and what might actually fix it.", "date": "Jun 20", "tags": ["Security", "Linux", "Arch Linux", "Supply Chain"], "isNews": false}, {"url": "/blog/nim-api-watchdog.html", "title": "Building an NVIDIA NIM API Watchdog", "excerpt": "NVIDIA's free NIM tier works great, until the rate limits bite. Here's how I built an automated watchdog that pings the API, logs results, and alerts when things go sideways.", "date": "Jun 19", "tags": ["Python", "Automation", "Hermes Agent", "NVIDIA NIM"], "isNews": false}, {"url": "/blog/budget-ai-accelerators-under-500.html", "title": "Budget AI Accelerators Under $500", "excerpt": "Can you run local LLMs without spending a grand? I looked at AMD Mini PCs, used OptiPlex rigs, and other options to find what actually works under a $500 hard cap.", "date": "Jun 16", "tags": ["AI", "Hardware", "Local Inference", "Linux"], "isNews": false}, {"url": "/blog/self-hosting-on-raspberry-pi.html", "title": "Self-Hosting on a Raspberry Pi", "excerpt": "Running your own cloud on a $35 board. Nextcloud, backups, and why I stopped paying subscription fees for things I can host myself.", "date": "Jun 1", "tags": ["Self-Hosting", "Raspberry Pi", "Homelab", "Linux"], "isNews": false}];

  // ============================================================
  // RECOMMENDATION ENGINE
  // ============================================================
  function normalizeTag(tag) {
    return tag.toLowerCase().trim();
  }

  function scorePost(current, candidate) {
    // Skip self
    if (candidate.url === current.url) return -Infinity;
    // Skip daily news unless current is also daily news
    if (candidate.isNews && !current.isNews) return -1000;
    if (!candidate.isNews && current.isNews) return -1000;

    var currentTags = (current.tags || []).map(normalizeTag);
    var candidateTags = (candidate.tags || []).map(normalizeTag);

    var overlap = 0;
    for (var i = 0; i < candidateTags.length; i++) {
      if (currentTags.indexOf(candidateTags[i]) !== -1) {
        overlap += 1;
      }
    }

    // Recency boost (newer posts get slight edge when tied)
    var recencyBonus = 0;
    // We can't easily parse "Jul 12" etc, but registry order is roughly chronological
    // so we'll use array index as proxy (higher index = older)
    var currentIdx = POSTS.indexOf(current);
    var candidateIdx = POSTS.indexOf(candidate);
    if (candidateIdx < currentIdx) recencyBonus = 0.5; // newer

    return overlap + recencyBonus;
  }

  function getRecommendations(currentUrl) {
    var current = null;
    for (var i = 0; i < POSTS.length; i++) {
      if (POSTS[i].url === currentUrl) {
        current = POSTS[i];
        break;
      }
    }
    if (!current) return [];

    var scored = POSTS.map(function(p) {
      return { post: p, score: scorePost(current, p) };
    }).filter(function(s) { return s.score > -Infinity; });

    scored.sort(function(a, b) { return b.score - a.score; });

    // Pick top 2 by tag overlap, then fill with most recent non-news if needed
    var results = [];
    var usedUrls = new Set([currentUrl]);

    for (var i = 0; i < scored.length && results.length < 3; i++) {
      var p = scored[i].post;
      if (!usedUrls.has(p.url)) {
        results.push(p);
        usedUrls.add(p.url);
      }
    }

    return results.slice(0, 3);
  }

  // ============================================================
  // RENDER — matches .post-row exactly from style.css
  // ============================================================
  function escapeHtml(str) {
    return str.replace(/&/g, '&')
              .replace(/</g, '<')
              .replace(/>/g, '>')
              .replace(/"/g, '"')
              .replace(/'/g, "\\'");
  }

  function renderPill(tag) {
    var isNews = tag === 'daily-news' || tag === 'ai-news';
    return '<span class="pill' + (isNews ? ' pill-news' : '') + '">' + escapeHtml(tag) + '</span>';
  }

  function renderPostRow(post) {
    var isNews = post.isNews;
    var pills = (post.tags || []).map(renderPill).join('');
    return '' +
      '<a class="post-row' + (isNews ? ' is-news' : '') + '" href="' + escapeHtml(post.url) + '">' +
        '<div class="post-date">' + escapeHtml(post.date) + '</div>' +
        '<div class="post-content">' +
          '<h2 class="post-title">' + escapeHtml(post.title) + '</h2>' +
          '<p class="post-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
          '<div class="post-tags">' + pills + '</div>' +
        '</div>' +
      '</a>';
  }

  function renderSection(posts) {
    if (posts.length === 0) return '';

    var rows = posts.map(renderPostRow).join('');
    return '' +
      '<section class="keep-reading" aria-label="Keep reading">' +
        '<div class="section-title">Keep reading</div>' +
        '<div class="posts">' + rows + '</div>' +
      '</section>';
  }

  // ============================================================
  // INJECT — find insertion point and insert section
  // ============================================================
  function init() {
    // Only run on article pages (has reading progress bar)
    if (!document.querySelector('.progress-bar')) return;

    // Detect current article URL
    var currentUrl = window.location.pathname;
    if (!currentUrl.startsWith('/blog/') || currentUrl === '/blog/') return;

    var recommendations = getRecommendations(currentUrl);
    if (recommendations.length === 0) return;

    var html = renderSection(recommendations);

    // Insert before .back-link, or before footer, or before first script after article
    var insertBefore = document.querySelector('.back-link');
    if (!insertBefore) {
      insertBefore = document.querySelector('footer');
    }
    if (!insertBefore) {
      // Fallback: before first script after </article>
      var article = document.querySelector('article');
      if (article) {
        var next = article.nextElementSibling;
        while (next && next.tagName !== 'SCRIPT') next = next.nextElementSibling;
        if (next) insertBefore = next;
      }
    }

    if (insertBefore) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      // Insert the section element
      var section = wrapper.querySelector('section');
      if (section) {
        insertBefore.parentNode.insertBefore(section, insertBefore);
      }
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();