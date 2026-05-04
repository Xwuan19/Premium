/**
 * X-YT Enhance - Shadowrocket Compatible
 * 👤 Author: Xwuan (ie.1w3n)
 * 📅 Version: 2026.05.04
 * 🛠️ Origin: Optimized from ytb2.js
 */

(() => {
  const isQuanX = typeof $task !== "undefined";
  const isSurge = typeof $httpClient !== "undefined" && !isQuanX;
  const isLoon = typeof $loon !== "undefined";
  const log = (...args) => {
    try {
      console.log(...args);
    } catch (e) {}
  };
  const debugLog = (s, debug) => {
    if (debug) {
      try {
        console.log("[YT-Enhance]", s);
      } catch (e) {}
    }
  };

  function readBody() {
    try {
      if (isSurge || isLoon) {
        if ($response && $response.bodyBytes) {
          let bytes = $response.bodyBytes;
          let arr = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
          let text = tryDecodeUTF8(arr);
          return { raw: arr, text: text, isBytes: true };
        } else if ($response && $response.body) {
          return { raw: null, text: $response.body, isBytes: false };
        }
      } else if (isQuanX) {
        if ($response && $response.bodyBytes) {
          let b = $response.bodyBytes;
          if (typeof b === "string") {
            let arr = base64ToUint8Array(b);
            return { raw: arr, text: tryDecodeUTF8(arr), isBytes: true };
          } else {
            let arr = b instanceof ArrayBuffer ? new Uint8Array(b) : b;
            return { raw: arr, text: tryDecodeUTF8(arr), isBytes: true };
          }
        } else if ($response && $response.body) {
          return { raw: null, text: $response.body, isBytes: false };
        }
      } else {
        if (typeof $response !== "undefined" && $response.body) return { raw: null, text: $response.body, isBytes: false };
      }
    } catch (e) {}
    return { raw: null, text: null, isBytes: false };
  }

  function tryDecodeUTF8(u8) {
    try {
      return new TextDecoder("utf-8").decode(u8);
    } catch (e) {
      let s = "";
      for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
      return s;
    }
  }

  function base64ToUint8Array(b64) {
    if (typeof atob === "function") {
      const bin = atob(b64);
      const len = bin.length;
      const arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
      return arr;
    } else {
      return Uint8Array.from(Buffer.from(b64, "base64"));
    }
  }

  function uint8ArrayToBase64(u8) {
    if (typeof btoa === "function") {
      let CHUNK = 0x8000;
      let index = 0;
      let length = u8.length;
      let result = "";
      let slice;
      while (index < length) {
        slice = u8.subarray(index, Math.min(index + CHUNK, length));
        result += String.fromCharCode.apply(null, slice);
        index += CHUNK;
      }
      return btoa(result);
    } else {
      return Buffer.from(u8).toString("base64");
    }
  }

  function sendDone(body, rawBytes, headers) {
    if (isQuanX) {
      if (rawBytes) {
        $done({ status: 200, headers: headers || {}, body: uint8ArrayToBase64(rawBytes), bodyEncoding: "base64" });
      } else {
        $done({ status: 200, headers: headers || {}, body: body });
      }
    } else if (isSurge || isLoon) {
      if (rawBytes) {
        $done({ status: 200, headers: headers || {}, bodyBytes: rawBytes });
      } else {
        $done({ status: 200, headers: headers || {}, body: body });
      }
    } else {
      $done({ status: 200, headers: headers || {}, body: body });
    }
  }

  function parseArguments() {
    let defaults = {
      lyricLang: "off",
      captionLang: "off",
      blockUpload: true,
      blockImmersive: true,
      blockShorts: false,
      debug: false,
    };
    try {
      let arg = typeof $argument !== "undefined" ? $argument : (typeof $args !== "undefined" ? $args : null);
      if (!arg) return defaults;
      if (typeof arg === "string") {
        try {
          const parsed = JSON.parse(arg);
          return Object.assign(defaults, parsed);
        } catch (e) {
          try {
            const kv = {};
            const cleaned = arg.replace(/^\s*'?|'\s*$/g, "");
            const pairs = cleaned.split(",");
            for (let p of pairs) {
              let idx = p.indexOf(":");
              if (idx === -1) idx = p.indexOf("=");
              if (idx === -1) continue;
              let k = p.slice(0, idx).trim().replace(/['"]+/g, "");
              let v = p.slice(idx + 1).trim().replace(/['"]+/g, "");
              if (v === "true") v = true;
              else if (v === "false") v = false;
              kv[k] = v;
            }
            return Object.assign(defaults, kv);
          } catch (ee) {
            return defaults;
          }
        }
      } else if (typeof arg === "object") {
        return Object.assign(defaults, arg);
      }
    } catch (e) {
      return defaults;
    }
  }

  function tkGenerate(text) {
    function RL(a, b) {
      for (let c = 0; c < b.length - 2; c += 3) {
        let d = b.charAt(c + 2);
        d = d >= "a" ? d.charCodeAt(0) - 87 : Number(d);
        d = b.charAt(c + 1) == "+" ? a >>> d : a << d;
        a = b.charAt(c) == "+" ? (a + d) & 4294967295 : a ^ d;
      }
      return a;
    }
    let tkk = "406644.3293161072"; 
    let [b, e] = tkk.split(".");
    let h = [];
    for (let f = 0; f < text.length; f++) {
      let g = text.charCodeAt(f);
      if (g < 128) h.push(g);
      else {
        if (g < 2048) {
          h.push((g >> 6) | 192);
        } else {
          if (55296 == (g & 64512) && f + 1 < text.length && 56320 == (text.charCodeAt(f + 1) & 64512)) {
            g = 65536 + ((g & 1023) << 10) + (text.charCodeAt(++f) & 1023);
            h.push((g >> 18) | 240);
            h.push(((g >> 12) & 63) | 128);
          } else {
            h.push((g >> 12) | 224);
            h.push(((g >> 6) & 63) | 128);
          }
        }
        h.push((g & 63) | 128);
      }
    }
    let a = Number(b) || 0;
    for (let i = 0; i < h.length; i++) {
      a += h[i];
      a = RL(a, "+-a^+6");
    }
    a = RL(a, "+-3^+b+-f");
    a ^= Number(e) || 0;
    if (a < 0) a = (a & 2147483647) + 2147483648;
    a = Math.floor(a % 1e6);
    return a.toString() + "." + (a ^ Number(b));
  }

  async function googleTranslate(text, tl, debug) {
    if (!text || tl === "off") return null;
    try {
      const tk = tkGenerate(text);
      const url = `https://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&dt=rm&tk=${tk}&q=${encodeURIComponent(
        text
      )}`;
      debugLog("translate url: " + url, debug);
      if (isQuanX) {
        const res = await $task.fetch({ url: url, method: "GET" });
        if (res && res.statusCode === 200 && res.body) {
          const o = JSON.parse(res.body);
          return o[0].map((p) => p[0]).join("");
        }
      } else if (isSurge || isLoon) {
        return await new Promise((resolve) => {
          $httpClient.get(url, function (err, resp, data) {
            if (err) {
              debugLog("translate fetch err:" + err, debug);
              resolve(null);
            } else {
              try {
                const o = JSON.parse(data);
                resolve(o[0].map((p) => p[0]).join(""));
              } catch (e) {
                resolve(null);
              }
            }
          });
        });
      } else {
        if (typeof fetch === "function") {
          const r = await fetch(url);
          const o = await r.json();
          return o[0].map((p) => p[0]).join("");
        }
      }
    } catch (e) {
      debugLog("translate error: " + e, debug);
      return null;
    }
    return null;
  }

  (async () => {
    const cfg = parseArguments();
    const debug = Boolean(cfg.debug);

    debugLog("[cfg] " + JSON.stringify(cfg), debug);

    const rb = readBody();
    if (!rb || (!rb.text && !rb.raw)) {
      debugLog("No body found. Exiting.", debug);
      $done({});
      return;
    }

    let text = rb.text;
    if (!text && rb.raw) text = tryDecodeUTF8(rb.raw);

    if (!text) {
      debugLog("Body can't be decoded as text. Exiting.", debug);
      $done({});
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      debugLog("Response is not JSON. Passing through.", debug);
      sendDone(null, rb.isBytes ? rb.raw : null, $response && $response.headers ? $response.headers : {});
      return;
    }

    try {
      if (data.player) {
        if (Array.isArray(data.player.adPlacements) && data.player.adPlacements.length) {
          debugLog("Removing adPlacements", debug);
          data.player.adPlacements = [];
        }
        if (Array.isArray(data.player.adSlots) && data.player.adSlots.length) {
          debugLog("Removing adSlots", debug);
          data.player.adSlots = [];
        }
        if (data.player.playbackTracking && data.player.playbackTracking.pageadViewthroughconversion) {
          delete data.player.playbackTracking.pageadViewthroughconversion;
          debugLog("Deleted pageadViewthroughconversion", debug);
        }
      }
      
      const removeAdsFromAny = (obj) => {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj.adPlacements)) obj.adPlacements = [];
        if (Array.isArray(obj.adSlots)) obj.adSlots = [];
        if (obj.playbackTracking && obj.playbackTracking.pageadViewthroughconversion) delete obj.playbackTracking.pageadViewthroughconversion;
      };
      removeAdsFromAny(data);
    } catch (e) {
      debugLog("Error removing ads: " + e, debug);
    }

    const bannedBrowseIds = [];
    if (cfg.blockUpload) bannedBrowseIds.push("FEuploads", "FEuploads");
    if (cfg.blockImmersive) bannedBrowseIds.push("FEmusic_immersive");
    if (cfg.blockShorts) bannedBrowseIds.push("FEshorts", "FEshorts_mweb");
    bannedBrowseIds.push("SPunlimited");

    try {
      const walkAndRemove = (o) => {
        if (!o || typeof o !== "object") return;
        for (let k in o) {
          if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
          const v = o[k];
          if (Array.isArray(v)) {
            for (let i = v.length - 1; i >= 0; i--) {
              const item = v[i];
              const browseId =
                (item?.guideSectionRenderer?.browseId) ||
                (item?.guideEntryRenderer?.browseId) ||
                item?.browseId ||
                item?.navigationEndpoint?.browseId ||
                item?.iconRender?.browseId ||
                item?.labelRender?.browseId;
              if (browseId && bannedBrowseIds.includes(browseId)) {
                v.splice(i, 1);
                debugLog("Removed renderer with browseId " + browseId, debug);
                continue;
              }
              const eml = item?.renderInfo?.layoutRender?.eml;
              if (typeof eml === "string") {
                if (/shorts(?!_pivot_item)/.test(eml) && cfg.blockShorts) {
                  v.splice(i, 1);
                  debugLog("Removed by eml shorts pattern", debug);
                  continue;
                }
              }
              walkAndRemove(item);
            }
          } else if (typeof v === "object") {
            walkAndRemove(v);
          }
        }
      };
      walkAndRemove(data);
    } catch (e) {
      debugLog("Error cleaning browse items: " + e, debug);
    }

    try {
      const captionLang = (cfg.captionLang || "off") + "";
      if (captionLang !== "off") {
        const applyCaptionEnhance = (root) => {
          try {
            const trackList = root?.captions?.playerCaptionsTrackListRenderer;
            if (!trackList) return false;
            const captionTracks = trackList.captionTracks;
            const audioTracks = trackList.audioTracks;
            if (!Array.isArray(captionTracks)) return false;
            captionTracks.forEach((t) => {
              if (t) t.isTranslatable = true;
            });
            const already = captionTracks.some((t) => t.languageCode === captionLang);
            if (!already) {
              const sample = captionTracks[0] || null;
              if (sample) {
                const created = JSON.parse(JSON.stringify(sample));
                created.languageCode = captionLang;
                created.vssId = "." + captionLang;
                created.name = { runs: [{ text: `@Enhance (${captionLang})` }] };
                created.baseUrl = (created.baseUrl || "") + `&tlang=${captionLang}`;
                captionTracks.push(created);
                if (Array.isArray(audioTracks)) {
                  const newIndex = captionTracks.length - 1;
                  audioTracks.forEach((a) => {
                    if (!Array.isArray(a.captionTrackIndices)) a.captionTrackIndices = [];
                    if (!a.captionTrackIndices.includes(newIndex)) a.captionTrackIndices.push(newIndex);
                    a.defaultCaptionTrackIndex = newIndex;
                    a.captionsInitialState = 3;
                  });
                }
                debugLog("Added translated caption track for " + captionLang, debug);
                return true;
              }
            }
          } catch (e) {
            debugLog("caption enhance err: " + e, debug);
          }
          return false;
        };

        const success =
          applyCaptionEnhance(data) ||
          (Array.isArray(data.contents) && data.contents.some((c) => applyCaptionEnhance(c))) ||
          false;

        if (!success) debugLog("No caption track container found to enhance.", debug);
      }
    } catch (e) {
      debugLog("Error adding caption translation: " + e, debug);
    }

    try {
      const lyricLang = (cfg.lyricLang || "off") + "";
      if (lyricLang !== "off") {
        const findAndTranslate = async (root) => {
          try {
            let nodes = [];

            const walker = (o) => {
              if (!o || typeof o !== "object") return;
              if (o.timedLyricsContent && Array.isArray(o.timedLyricsContent.runs)) {
                nodes.push({ type: "lyrics", node: o.timedLyricsContent });
              }
              if (o.timedLyricsRender?.timedLyricsContent && Array.isArray(o.timedLyricsRender.timedLyricsContent.runs)) {
                nodes.push({ type: "lyrics", node: o.timedLyricsRender.timedLyricsContent });
              }
              if (o.description && o.description.runs && Array.isArray(o.description.runs)) {
                nodes.push({ type: "description", node: o.description });
              }
              for (let k in o) {
                if (Object.prototype.hasOwnProperty.call(o, k)) {
                  const v = o[k];
                  if (typeof v === "object") walker(v);
                }
              }
            };

            walker(root);

            for (let entry of nodes) {
              if (entry.type === "lyrics") {
                const runs = entry.node.runs;
                const text = runs.map((r) => (r && r.text) || "").join("\n");
                if (!text.trim()) continue;
                const translated = await googleTranslate(text, lyricLang, debug);
                if (translated) {
                  const tLines = translated.split("\n");
                  if (tLines.length === runs.length) {
                    for (let i = 0; i < runs.length; i++) {
                      runs[i].text = tLines[i];
                    }
                  } else {
                    entry.node.footerLabel = (entry.node.footerLabel || "") + `\n[Translated ${lyricLang}]`;
                    entry.node.runs.push(...tLines.map((ln) => ({ text: ln })));
                  }
                  debugLog("Translated lyrics to " + lyricLang, debug);
                } else {
                  debugLog("Translate call returned null for lyrics", debug);
                }
              } else if (entry.type === "description") {
                const runs = entry.node.runs;
                const text = runs.map((r) => (r && r.text) || "").join("\n");
                if (!text.trim()) continue;
                const translated = await googleTranslate(text, lyricLang, debug);
                if (translated) {
                  entry.node.runs.unshift({ text: translated + "  [Translated]" });
                  debugLog("Translated description to " + lyricLang, debug);
                }
              }
            }
          } catch (e) {
            debugLog("findAndTranslate error: " + e, debug);
          }
        };

        await findAndTranslate(data);
      }
    } catch (e) {
      debugLog("Error translating lyrics/description: " + e, debug);
    }

    try {
      if (data.player && data.player.playabilityStatus) {
        data.player.playabilityStatus.pictureInPictureRender = {
          pictureInPictureAbility: { active: true, f4: 0, f6: 0, f8: 1 },
        };
        data.player.playabilityStatus.backgroundPlayerRender = { backgroundAbility: { active: true } };
        debugLog("Added pictureInPicture & background ability flags", debug);
      }
    } catch (e) {
      debugLog("Error adding premium flags: " + e, debug);
    }

    let finalText = JSON.stringify(data);

    if (rb.isBytes && rb.raw) {
      const outBytes = new TextEncoder().encode(finalText);
      const headers = $response && $response.headers ? $response.headers : {};
      sendDone(null, outBytes, headers);
    } else {
      sendDone(finalText, null, $response && $response.headers ? $response.headers : {});
    }
  })().catch((err) => {
    try {
      console.log("[YT-Enhance] Fatal error:", err && err.message ? err.message : err);
    } catch (e) {}
    $done({});
  });
})();
