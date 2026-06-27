import { callGemini } from '../../services/gemini.js';

export async function summarizeHeadlines(items) {
  if (!items || items.length === 0) return [];

  const headlines = items.slice(0, 10).map((i) => `- ${i.title}`).join('\n');

  const sys = `Yapay zeka haberlerini kategorize ve özetle. Her haber için:
1. Kategorileri (LLM/VizYon/Güvenlik/İsletme/Araştırma) belirle
2. İçeriğini 1 cümlede özetle
3. Trend skoru (1-5) ver

JSON döndür: [{"headline":"...", "summary":"...", "category":"...", "trend":4}]`;

  const msg = `Haberler:\n${headlines}`;

  try {
    const raw = await callGemini(sys, msg);
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return items.map((i) => ({ ...i, category: 'Diğer', summary: i.title, trend: 3 }));

    const parsed = JSON.parse(jsonMatch[0]);
    return items.map((item, idx) => ({
      ...item,
      summary: parsed[idx]?.summary || item.title,
      category: parsed[idx]?.category || 'Diğer',
      trend: parsed[idx]?.trend || 3,
    }));
  } catch (e) {
    return items.map((i) => ({ ...i, category: 'Diğer', summary: i.title, trend: 3 }));
  }
}
