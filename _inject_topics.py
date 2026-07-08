import re

path = '/tmp/cappy-site/blog/index.html'
html = open(path).read()

# Parse bucket assignments in document order
raw = open('/tmp/cappy-site/build_buckets.py').read()  # noqa
# we know the ordering from running build_buckets.py; recompute the list inline
posts = re.findall(r'<a class="post-row"[^>]*>.*?</a>', html, re.S)
buckets_map = {
    'ai': {'AI','AI Agents','Agentic','Agents','LLM','Tool Calling','GLM','DeepSeek','Open Weight','OpenAI','Anthropic','MCP','Token Efficiency','Transformers','Computer Vision','Stable Diffusion','OpenVINO','CPU Inference','Local Inference','Routing','Pricing','Benchmarks','Cybersecurity','Local Models','llama.cpp','Qwen','Apple Silicon'},
    'security': {'Security','AI Security','Privacy','Prompt Injection','Supply Chain','Steganography','BootROM','Red Teaming','iOS'},
    'hardware': {'Hardware','AMD','Chips','Semiconductors','Raspberry Pi'},
    'opensource': {'Open Source','Self-Hosting','Homelab','Linux','Rust','Node.js','TypeScript'},
    'engineering': {'Engineering','Systems Programming','Async I/O','io_uring','Kubernetes','Version Control','LLM Coding','Tooling','Developer Tools','Testing','Workflow','Automation','Authentication','Infrastructure','Design Systems','DMCA','Right to Repair','Copyright','Policy','EU AI Act','Robotics','Webernetes','Source-available','Comparison','NVIDIA NIM'},
    'business': {'investment','finance','space'},
}
news_re = re.compile(r'^AI\s*(?:&|and|\+)\s*Tech News', re.I)
order = ['ai','security','hardware','opensource','engineering','business']
topics_for = []
for p in posts:
    tags = set(re.findall(r'class="pill">([^<]+)', p))
    m = re.search(r'post-title">([^<]+)', p)
    title = m.group(1).strip() if m else '?'
    is_news = bool({'ai-news','daily-news'} & tags) or bool(news_re.match(title)) or 'right to run local AI' in title.lower()
    if is_news:
        bs = ['news']
    else:
        bs = [b for b in order if tags & buckets_map[b]] or ['ai']
    topics_for.append(' '.join(bs))

# Build output by replacing each <a class="post-row" ... opening tag, in order,
# adding the data-topics attribute right after the class.
def replace_nth(match):
    idx = replace_nth.idx
    replace_nth.idx += 1
    return f'<a class="post-row" data-topics="{topics_for[idx]}"'
replace_nth.idx = 0

new_html = re.sub(r'<a class="post-row"', replace_nth, html)
assert replace_nth.idx == len(posts) == 45, (replace_nth.idx, len(posts))
open(path, 'w').write(new_html)
print(f"Injected data-topics into {replace_nth.idx} post-rows")
