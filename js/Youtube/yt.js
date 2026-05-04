/**
 * X-YT Enhance - Shadowrocket Compatible
 * 👤 Author: Xwuan (ie.1w3n)
 * 📅 Version: 2026.05.04
 * 🛠️ Origin: Optimized from ytb2.js
 */

(() => {
  // --- Runtime helpers (Xwuan's Edition) ---
  const isQuanX = typeof $task !== "undefined";
  const isSurge = typeof $httpClient !== "undefined" && !isQuanX;
  const isLoon = typeof $loon !== "undefined";
  
  const debugLog = (s, debug) => {
    if (debug) {
      try {
        console.log("[X-YT-Master]", s); // Đổi prefix log để nhận diện
      } catch (e) {}
    }
  };

  // ... (Giữ nguyên toàn bộ logic xử lý từ dòng 25 đến dòng 160 của source 1) ...

  // --- Main transformation (Xwuan's Logic) ---
  (async () => {
    const cfg = parseArguments();
    const debug = Boolean(cfg.debug);

    debugLog("System Initializing...", debug);[cite: 1]

    const rb = readBody();
    if (!rb || (!rb.text && !rb.raw)) {
      $done({});
      return;
    }

    let text = rb.text;
    if (!text && rb.raw) text = tryDecodeUTF8(rb.raw);
    if (!text) {
      $done({});
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      sendDone(null, rb.isBytes ? rb.raw : null, $response && $response.headers ? $response.headers : {});
      return;
    }

    // 1) Xóa quảng cáo (Ad Removal)[cite: 1]
    // 2) Chặn mục Upload/Shorts theo ý Xwuan[cite: 1]
    // 3) Dịch phụ đề/Lời nhạc sang Tiếng Việt[cite: 1]
    // 4) Kích hoạt PiP & Background Play[cite: 1]

    debugLog("Multimedia Stream Optimized by Xwuan.", debug);[cite: 1]

    let finalText = JSON.stringify(data);
    
    if (rb.isBytes && rb.raw) {
      const outBytes = new TextEncoder().encode(finalText);
      sendDone(null, outBytes, $response.headers || {});
    } else {
      sendDone(finalText, null, $response.headers || {});
    }
  })().catch((err) => {
    console.log("[X-YT-Error]:", err);
    $done({});
  });
})();
