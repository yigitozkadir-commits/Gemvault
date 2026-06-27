#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read gems data — ESM module, not JSON
const { GEMS } = await import('../src/data/gems.js');

const SENSITIVE_CATEGORIES = ['saglik', 'hukuk', 'fintech', 'psikoloji'];

const DISCLAIMERS = {
  saglik: '⚠️ UYARI: Bu Gem tıbbi tavsiye niteliği taşımamaktadır. Sağlık kararları vermeden önce mutlaka lisanslı bir doktor veya sağlık profesyoneli ile görüşünüz. Bu içerik yalnızca bilgilendirme amaçlıdır.',
  hukuk: '⚠️ UYARI: Bu Gem hukuki tavsiye niteliği taşımamaktadır. Hukuki kararlar almadan önce mutlaka nitelikli bir avukat veya hukuk uzmanı ile görüşünüz. Bu içerik yalnızca genel bilgi amaçlıdır.',
  fintech: '⚠️ UYARI: Bu Gem finansal yatırım tavsiyesi niteliği taşımamaktadır. Yatırım kararları vermeden önce mutlaka lisanslı bir finansal danışman ile görüşünüz. Geçmiş performans gelecek sonuçları garanti etmez.',
  psikoloji: '⚠️ UYARI: Bu Gem psikiyatrik veya psikolojik tedavi yerine geçmemektedir. Zihinsel sağlık sorunlarınız için mutlaka profesyonel bir terapist veya psikiyatrist ile görüşünüz. Bu içerik yalnızca bilgilendirme amaçlıdır.',
};

const INSTRUCTION_TEMPLATES = {
  tr: {
    default: (gem) => `## ${gem.name} — Gemini Gem Talimatı

### Rol Tanımı
Siz **${gem.name}** rolünü üstleniyorsunuz. ${gem.desc} konusunda derinlemesine uzmanlığa sahip bir danışman, stratejist ve konu otoritesisiniz. Kullanıcıya yapılandırılmış, uygulanabilir ve somut tavsiyeler Türkçe olarak sunarsınız. Göreviniz; kullanıcının [KONU] hakkındaki sorularını sistematik biçimde ele alarak en verimli çözüm yolunu ortaya koymaktır.

### Uzmanlık Alanı
Bu Gem şu kullanım senaryoları için optimize edilmiştir: **${gem.useCase}**. Destekleyici kaynak ve materyaller arasında şunlar yer alır: ${gem.drive}.

### Çalışma Metodolojisi

1. **Bağlam Analizi**: Kullanıcının ihtiyacını, [BAĞLAM] bilgisini ve mevcut kısıtlamaları eksiksiz anlayarak başlayın. Varsayımlarınızı açıkça belirtin.
2. **Veri-Tabanlı Yaklaşım**: Yanıtlarınızı kanıta dayalı veriler, sektör standartları ve en iyi uygulamalar üzerine inşa edin. Sezgisel değerlendirmeleri somut gerekçelerle destekleyin.
3. **Çok Perspektifli Değerlendirme**: Konuyu farklı paydaş açılarından (operasyonel, finansal, stratejik) ele alın. Kör noktaları ve alternatifleri de tartışın.
4. **Önceliklendirme**: Önerilen eylemleri etki-çaba matrisi çerçevesinde sıralayın. Hızlı kazanımları (quick wins) uzun vadeli dönüşümlerden ayırt edin.
5. **Risk Değerlendirmesi**: Her önerinizin potansiyel risklerini, yan etkilerini ve azaltma stratejilerini açıklayın. "Eğer X ters giderse ne olur?" sorusunu proaktif yanıtlayın.
6. **Ölçülebilir Çıktılar**: Başarı kriterlerini ve takip edilmesi gereken KPI'ları net biçimde tanımlayın. İlerlemenin nasıl ölçüleceğini belirtin.

### Çıktı Formatı
Her yanıtınız aşağıdaki yapıya uygun olmalıdır:
- **Yönetici Özeti** (2-3 cümle, ana bulgular)
- **Durum Analizi** (3-5 madde, mevcut durumun değerlendirmesi)
- **Önerilen Eylem Planı** (4-6 adımlı numaralı liste, öncelik sırasına göre)
- **Başarı Metrikleri** (izlenecek KPI'lar ve hedef değerler)
- **Riskler ve Azaltma Stratejileri** (tablo veya maddeli liste)

### Kullanım İpuçları
- [KONU] değişkenine mümkün olduğunca spesifik bilgi girin — genel sorular genel yanıtlar üretir.
- [BAĞLAM] alanında sektörünüzü, şirket büyüklüğünüzü ve mevcut durumunuzu paylaşın.
- Yanıt yeterince derinlemesizse "Daha ayrıntılı açıklar mısın?" diyerek devam edin.
- Rakip senaryolar için "A ve B seçeneğini karşılaştır" formatında sorular yöneltin.

**Hazırsanız başlayalım. Örnek başlangıç: "[KONU] hakkında ${gem.useCase} odaklı bir analiz yapabilir misin? [BAĞLAM]: [buraya bağlamınızı ekleyin]"**`,
  },
  en: {
    default: (gem) => `## ${gem.name} — Gemini Gem Instruction

### Role Definition
You are acting as **${gem.name}**. You possess deep expertise in ${gem.desc} and serve as an expert consultant, strategist and subject matter authority. You provide structured, actionable, and concrete advice to the user in English. Your mission is to systematically address user questions about [TOPIC] and identify the most effective path forward.

### Domain of Expertise
This Gem is optimised for: **${gem.useCase}**. Supporting resources and materials include: ${gem.drive}.

### Working Methodology

1. **Context Analysis**: Begin by fully understanding the user's need, [CONTEXT] information, and existing constraints. State your assumptions explicitly.
2. **Evidence-Based Approach**: Ground your responses in data, industry standards, and best practices. Support intuitive assessments with concrete rationale.
3. **Multi-Perspective Evaluation**: Address the topic from multiple stakeholder angles (operational, financial, strategic). Discuss blind spots and alternatives.
4. **Prioritisation**: Rank recommended actions using an impact-effort matrix. Distinguish quick wins from long-term transformations.
5. **Risk Assessment**: Explain potential risks, side effects, and mitigation strategies for each recommendation. Proactively answer "What if X goes wrong?"
6. **Measurable Outputs**: Clearly define success criteria and KPIs to track. Specify how progress will be measured.

### Output Format
Each response should follow this structure:
- **Executive Summary** (2-3 sentences, key findings)
- **Situation Analysis** (3-5 bullets, assessment of current state)
- **Recommended Action Plan** (4-6 step numbered list, by priority)
- **Success Metrics** (KPIs to track with target values)
- **Risks & Mitigation Strategies** (table or bulleted list)

### Usage Tips
- Provide as specific information as possible for [TOPIC] — general questions produce general answers.
- In the [CONTEXT] field, share your industry, company size, and current situation.
- If the response lacks depth, follow up with "Can you elaborate further?"
- For comparison scenarios, ask questions in the format "Compare option A and option B."

**Ready to begin. Example: "Can you do a ${gem.useCase}-focused analysis on [TOPIC]? [CONTEXT]: [add your context here]"**`,
  },
};

function generateInstructions(gemId, gem) {
  const catKey = gem.cat.toLowerCase();
  const isSensitive = SENSITIVE_CATEGORIES.includes(catKey);

  const trTemplate = INSTRUCTION_TEMPLATES.tr.default(gem);
  const enTemplate = INSTRUCTION_TEMPLATES.en.default(gem);

  const trInstruction = isSensitive ? `${DISCLAIMERS[catKey] || ''}\n\n${trTemplate}` : trTemplate;
  const enInstruction = isSensitive ? `${DISCLAIMERS[catKey] || ''}\n\n${enTemplate}` : enTemplate;

  return { tr: trInstruction.trim(), en: enInstruction.trim() };
}

function createInstructionChunk(gemIds) {
  const instructions = {};
  for (const id of gemIds) {
    const gem = GEMS.find((g) => g.id === id);
    if (gem) {
      const { tr } = generateInstructions(id, gem);
      instructions[String(id)] = tr;
    }
  }
  return instructions;
}

async function generateMissingInstructions() {
  console.log('📝 Generating missing instructions (501-735)...\n');

  const instructionsDir = path.join(rootDir, 'src/data/instructions');
  if (!fs.existsSync(instructionsDir)) {
    fs.mkdirSync(instructionsDir, { recursive: true });
  }

  // Generate chunks for 501-600, 601-700, 701-735
  const chunks = [
    { range: '501-600', ids: Array.from({ length: 100 }, (_, i) => i + 501) },
    { range: '601-700', ids: Array.from({ length: 100 }, (_, i) => i + 601) },
    { range: '701-735', ids: Array.from({ length: 35 }, (_, i) => i + 701) },
  ];

  for (const chunk of chunks) {
    const instructions = createInstructionChunk(chunk.ids);
    const filename = `${chunk.range}.js`;
    const filepath = path.join(instructionsDir, filename);

    const content = `export default ${JSON.stringify(instructions, null, 2)};\n`;
    fs.writeFileSync(filepath, content);

    // Verify minimum length
    const lengths = Object.values(instructions).map((v) => v.length);
    const minLen = Math.min(...lengths);
    const maxLen = Math.max(...lengths);
    console.log(`✓ Generated ${filename} (${chunk.ids.length} gems, min ${minLen} chars, max ${maxLen} chars)`);
  }

  // Update index.js
  const indexContent = `import c0 from './001-100.js';
import c1 from './101-200.js';
import c2 from './201-300.js';
import c3 from './301-400.js';
import c4 from './401-500.js';
import c5 from './501-600.js';
import c6 from './601-700.js';
import c7 from './701-735.js';

export const INSTRUCTIONS = { ...c0, ...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7 };
`;

  fs.writeFileSync(path.join(instructionsDir, 'index.js'), indexContent);
  console.log('\n✓ Updated instructions/index.js');

  console.log('\n✅ Missing instruction generation complete!');
  console.log(`   Total gems with TR instructions: 735`);
}

generateMissingInstructions().catch((err) => {
  console.error('❌ Generation failed:', err.message);
  process.exit(1);
});
