import re

html = open('/tmp/cappy-site/blog/index.html').read()
posts = re.findall(r'<a class="post-row"[^>]*>.*?</a>', html, re.S)

buckets = {
    'ai': {'AI','AI Agents','Agentic','Agents','LLM','Tool Calling','GLM','DeepSeek','Open Weight','OpenAI','Anthropic','MCP','Token Efficiency','Transformers','Computer Vision','Stable Diffusion','OpenVINO','CPU Inference','Local Inference','Routing','Pricing','Benchmarks','Cybersecurity','Local Models','llama.cpp','Qwen','Apple Silicon'},
    'security': {'Security','AI Security','Privacy','Prompt Injection','Supply Chain','Steganography','BootROM','Red Teaming','iOS'},
    'hardware': {'Hardware','AMD','Chips','Semiconductors','Raspberry Pi'},
    'opensource': {'Open Source','Self-Hosting','Homelab','Linux','Rust','Node.js','TypeScript'},
    'engineering': {'Engineering','Systems Programming','Async I/O','io_uring','Kubernetes','Version Control','LLM Coding','Tooling','Developer Tools','Testing','Workflow','Automation','Authentication','Infrastructure','Design Systems','DMCA','Right to Repair','Copyright','Policy','EU AI Act','Robotics','Webernetes','Source-available','Comparison','NVIDIA NIM'},
    'business': {'investment','finance','space'},
}
news_re = re.compile(r'^AI\s*(?:&|and|\+)\s*Tech News', re.I)

order = ['ai','security','hardware','opensource','engineering','business']
for i, p in enumerate(posts):
    tags = set(re.findall(r'class="pill">([^<]+)', p))
    m = re.search(r'post-title">([^<]+)', p)
    title = m.group(1).strip() if m else '?'
    is_news = bool({'ai-news','daily-news'} & tags) or bool(news_re.match(title)) or 'right to run local AI' in title.lower()
    if is_news:
        bs = ['news']
    else:
        bs = [b for b in order if tags & buckets[b]]
        if not bs:
            bs = ['ai']  # fallback
    print(f"{i}|{' '.join(bs)}|{title}")
