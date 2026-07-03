import { Config } from "@remotion/cli/config";

// Bazı sandbox/CI ortamlarında Remotion'ın kendi Chrome Headless Shell'ini
// remotion.media'dan indirmesi ağ politikası yüzünden engellenebilir.
// Böyle durumlarda REMOTION_BROWSER_EXECUTABLE ortam değişkenini önceden
// indirilmiş bir Chromium/Chrome ikilisine işaret ederek ayarla.
// Değişken tanımlı değilse Remotion normal (otomatik indirme) davranışını
// kullanır — yerel makinende hiçbir şey değişmez.
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE;
if (browserExecutable) {
  Config.setBrowserExecutable(browserExecutable);
}
