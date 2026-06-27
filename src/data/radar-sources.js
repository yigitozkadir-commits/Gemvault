export const RADAR_SOURCES = [
  {
    id:'anthropic',feed:'https://www.anthropic.com/news/rss.xml', name:'Anthropic', icon:'🤖',
    color:'#c9a84c', tag:'LLM · Güvenlik',
    desc:'Claude modelleri, güvenlik araştırmaları ve AI yordam haberleri',
    url:'https://www.anthropic.com/news',
    topics:'Claude modelleri, Constitutional AI, AI güvenliği, Anthropic araştırmaları'
  },
  {
    id:'openai',feed:'https://openai.com/blog/rss.xml', name:'OpenAI', icon:'⚡',
    color:'#74b49b', tag:'GPT · DALL-E · Sora',
    desc:'GPT, DALL-E, Sora ve OpenAI ürün güncellemeleri',
    url:'https://openai.com/blog',
    topics:'GPT-4, ChatGPT, DALL-E, Sora, OpenAI API, model güncellemeleri'
  },
  {
    id:'google',feed:'https://blog.google/products/google-deepmind/rss/', name:'Google DeepMind', icon:'💎',
    color:'#7eb8d4', tag:'Gemini · AlphaCode',
    desc:'Gemini, AlphaFold ve Google AI araştırma çıktıları',
    url:'https://deepmind.google/discover/blog',
    topics:'Gemini, AlphaFold, PaLM, Google AI araştırmaları, DeepMind'
  },
  {
    id:'huggingface',feed:'https://huggingface.co/blog/feed.xml', name:'Hugging Face', icon:'🤗',
    color:'#f5c842', tag:'Açık Kaynak · Modeller',
    desc:'Açık kaynak modeller, dataset yayınları ve topluluk haberleri',
    url:'https://huggingface.co/blog',
    topics:'Açık kaynak LLM, transformer modelleri, fine-tuning, dataset'
  },
  {
    id:'prompting',feed:'https://www.promptingguide.ai/feed.xml', name:'Prompt Engineering', icon:'✦',
    color:'#d47daf', tag:'Prompt · Teknik',
    desc:'Prompt mühendisliği teknikleri, best practice ve yeni yöntemler',
    url:'https://www.promptingguide.ai',
    topics:'Chain-of-thought, few-shot prompting, RAG, agent, prompt optimization'
  },
  {
    id:'arxiv',feed:'https://arxiv.org/rss/cs.AI', name:'arXiv AI', icon:'📄',
    color:'#90caf9', tag:'Akademik · Araştırma',
    desc:'AI/ML alanındaki en güncel akademik makaleler',
    url:'https://arxiv.org/list/cs.AI/recent',
    topics:'AI akademik makale, LLM araştırmaları, model mimarisi, benchmark'
  },
  {
    id:'mistral',feed:'https://mistral.ai/news/feed.xml', name:'Mistral AI', icon:'🌪️',
    color:'#ce93d8', tag:'Açık Ağırlıklar',
    desc:'Mistral model yayınları ve Avrupa AI gelişmeleri',
    url:'https://mistral.ai/news',
    topics:'Mistral, Mixtral, açık ağırlıklı modeller, Avrupa AI'
  },
  {
    id:'aitoolstracker',feed:'https://theresanaiforthat.com/rss/', name:'AI Tools Tracker', icon:'🛠️',
    color:'#80cbc4', tag:'Araçlar · Ürünler',
    desc:'Yeni AI araçları, ürün lansmanları ve ekosistem gelişmeleri',
    url:'https://theresanaiforthat.com',
    topics:'AI araçları, SaaS AI ürünleri, yeni lansmanlar, AI ekosistemi'
  }
];

let radarSelectedSources;
