// ============================================
// CONFIG & CONSTANTS
// ============================================
const MAX_LENGTH = 20;

const RULES_CONFIG = [
  {
    id: 1,
    name: "📝 Viết thường/hoa/Capitalize",
    rules: [
      { id: "1a", label: "Viết thường (lowercase)" },
      { id: "1b", label: "Viết hoa (UPPERCASE)" },
      { id: "1c", label: "Hoa đầu tiên (Capitalize)" }
    ]
  },
  {
    id: 2,
    name: "🔢 Thêm số phổ biến",
    rules: [
      { id: "2a", label: "+123" },
      { id: "2b", label: "+1234" },
      { id: "2c", label: "+12345" },
      { id: "2d", label: "+123456" },
      { id: "2e", label: "+1234567" },
      { id: "2f", label: "+12345678" },
      { id: "2g", label: "+123456789" }
    ]
  },
  {
    id: 3,
    name: "📅 Thêm năm phổ biến",
    rules: [
      { id: "3a", label: "+1990" },
      { id: "3b", label: "+2000" },
      { id: "3c", label: "+2010" },
      { id: "3d", label: "+2020" },
      { id: "3e", label: "+2024" },
      { id: "3f", label: "+90" },
      { id: "3g", label: "+95" }
    ]
  },
  {
    id: 4,
    name: "🔣 Thêm ký tự đặc biệt",
    rules: [
      { id: "4a", label: "+@" },
      { id: "4b", label: "+@@" },
      { id: "4c", label: "+!" },
      { id: "4d", label: "+!!" },
      { id: "4e", label: "+#" },
      { id: "4f", label: "+$" }
    ]
  },
  {
    id: 5,
    name: "🎯 Hậu tố kiểu Việt",
    rules: [
      { id: "5a", label: "+vip" },
      { id: "5b", label: "+pro" },
      { id: "5c", label: "+cute" },
      { id: "5d", label: "+love" },
      { id: "5e", label: "+baby" },
      { id: "5f", label: "+hihi" },
      { id: "5g", label: "+kaka" }
    ]
  },
  {
    id: 6,
    name: "💠 Chuyển sang LEET speak",
    rules: [
      { id: "6a", label: "a→@" },
      { id: "6b", label: "o→0" },
      { id: "6c", label: "i→1" },
      { id: "6d", label: "e→3" },
      { id: "6e", label: "s→$" },
      { id: "6f", label: "t→7" }
    ]
  },
  {
    id: 7,
    name: "➖ Thêm dấu phân cách",
    rules: [
      { id: "7a", label: "chèn _" },
      { id: "7b", label: "chèn -" },
      { id: "7c", label: "chèn ." }
    ]
  },
  {
    id: 8,
    name: "🔄 Đảo ngược",
    rules: [
      { id: "8a", label: "Reverse toàn bộ" },
      { id: "8b", label: "Reverse chữ, giữ số" }
    ]
  },
  {
    id: 9,
    name: "📦 Nhân đôi & Lặp lại",
    rules: [
      { id: "9a", label: "Double (xxx→xxxxx)" },
      { id: "9b", label: "+Pass 2x" }
    ]
  },
  {
    id: 10,
    name: "👤 Từ Username",
    rules: [
      { id: "10a", label: "User+123" },
      { id: "10b", label: "User+@" },
      { id: "10c", label: "User+1999" },
      { id: "10d", label: "User@123" }
    ]
  },
  {
    id: 11,
    name: "🔗 Ghép & Biến đổi",
    rules: [
      { id: "11a", label: "Thêm số cuối (111→1111)" },
      { id: "11b", label: "Thêm số đầu (111→1111)" },
      { id: "11c", label: "CamelCase (hello→Hello)" }
    ]
  },
  {
    id: 12,
    name: "☎️ Biến đổi số điện thoại",
    rules: [
      { id: "12a", label: "SĐT+@" },
      { id: "12b", label: "SĐT+123" },
      { id: "12c", label: "SĐT+vip" }
    ]
  }
];

const LEET_MAP = {
  a: ["@", "4"],
  o: ["0"],
  s: ["$", "5"],
  e: ["3"],
  i: ["1"],
  t: ["7"]
};

let lastResult = "";
let allResults = new Map();
let lastData = null;
let isProcessing = false;
let shouldStop = false;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function tokenize(pwd) {
  return pwd.match(/[A-Za-z]+|\d+|[^A-Za-z0-9]/g) || [];
}

function isPhoneNumber(str) {
  return /^0\d{9,10}$/.test(str.replace(/\D/g, ""));
}

function validVariant(variant, original) {
  if (!variant) return false;
  if (variant === original) return false;
  if (variant.length > MAX_LENGTH) return false;
  if (hasEntropyIssue(variant)) return false;
  return true;
}

function hasEntropyIssue(str) {
  if (/^(.)\1{3,}$/.test(str)) return true;
  
  for (let len = 1; len <= str.length / 2; len++) {
    const pattern = str.substring(0, len);
    let expected = "";
    for (let i = 0; i < str.length; i += len) {
      expected += pattern;
    }
    if (str === expected.substring(0, str.length) && str.length >= len * 2) {
      return true;
    }
  }
  
  return false;
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateProgress(current, total) {
  const percent = Math.round((current / total) * 100);
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressPercent").textContent = percent + "%";
}

// ============================================
// TRANSFORMATION RULES
// ============================================

function rule_1a(t) { return [t.join("").toLowerCase()]; }
function rule_1b(t) { return [t.join("").toUpperCase()]; }

function rule_1c(t) {
  const str = t.join("");
  for (let i = 0; i < str.length; i++) {
    if (/[a-zA-Z]/.test(str[i])) {
      return [str.substring(0, i) + str[i].toUpperCase() + str.substring(i + 1)];
    }
  }
  return [];
}

function rule_2a(t) { return [t.join("") + "123"]; }
function rule_2b(t) { return [t.join("") + "1234"]; }
function rule_2c(t) { return [t.join("") + "12345"]; }
function rule_2d(t) { return [t.join("") + "123456"]; }
function rule_2e(t) { return [t.join("") + "1234567"]; }
function rule_2f(t) { return [t.join("") + "12345678"]; }
function rule_2g(t) { return [t.join("") + "123456789"]; }

function rule_3a(t) { return [t.join("") + "1990"]; }
function rule_3b(t) { return [t.join("") + "2000"]; }
function rule_3c(t) { return [t.join("") + "2010"]; }
function rule_3d(t) { return [t.join("") + "2020"]; }
function rule_3e(t) { return [t.join("") + "2024"]; }
function rule_3f(t) { return [t.join("") + "90"]; }
function rule_3g(t) { return [t.join("") + "95"]; }

function rule_4a(t) { return [t.join("") + "@"]; }
function rule_4b(t) { return [t.join("") + "@@"]; }
function rule_4c(t) { return [t.join("") + "!"]; }
function rule_4d(t) { return [t.join("") + "!!"]; }
function rule_4e(t) { return [t.join("") + "#"]; }
function rule_4f(t) { return [t.join("") + "$"]; }

function rule_5a(t) { return [t.join("") + "vip"]; }
function rule_5b(t) { return [t.join("") + "pro"]; }
function rule_5c(t) { return [t.join("") + "cute"]; }
function rule_5d(t) { return [t.join("") + "love"]; }
function rule_5e(t) { return [t.join("") + "baby"]; }
function rule_5f(t) { return [t.join("") + "hihi"]; }
function rule_5g(t) { return [t.join("") + "kaka"]; }

function rule_6a(t) { return [t.join("").replace(/[aA]/g, "@")]; }
function rule_6b(t) { return [t.join("").replace(/[oO]/g, "0")]; }
function rule_6c(t) { return [t.join("").replace(/[iI]/g, "1")]; }
function rule_6d(t) { return [t.join("").replace(/[eE]/g, "3")]; }
function rule_6e(t) { return [t.join("").replace(/[sS]/g, "$")]; }
function rule_6f(t) { return [t.join("").replace(/[tT]/g, "7")]; }

function rule_7a(t) {
  const w = t.join("");
  const m = w.match(/^([A-Za-z]+)(\d+)$/) || w.match(/^(\d+)([A-Za-z]+)$/);
  if (m) {
    const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
    const digits = /\d/.test(m[1]) ? m[1] : m[2];
    return [letters + "_" + digits];
  }
  return [];
}

function rule_7b(t) {
  const w = t.join("");
  const m = w.match(/^([A-Za-z]+)(\d+)$/) || w.match(/^(\d+)([A-Za-z]+)$/);
  if (m) {
    const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
    const digits = /\d/.test(m[1]) ? m[1] : m[2];
    return [letters + "-" + digits];
  }
  return [];
}

function rule_7c(t) {
  const w = t.join("");
  const m = w.match(/^([A-Za-z]+)(\d+)$/) || w.match(/^(\d+)([A-Za-z]+)$/);
  if (m) {
    const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
    const digits = /\d/.test(m[1]) ? m[1] : m[2];
    return [letters + "." + digits];
  }
  return [];
}

function rule_8a(t) { return [t.join("").split("").reverse().join("")]; }

function rule_8b(t) {
  const w = t.join("");
  const letters = w.match(/[A-Za-z]/g) || [];
  const nonLetters = w.match(/[^A-Za-z]/g) || [];
  return [letters.reverse().join("") + nonLetters.join("")];
}

function rule_9a(t) {
  const w = t.join("");
  if ((w.length * 2) > MAX_LENGTH) return [];
  return [w + w];
}

function rule_9b(t) {
  const w = t.join("");
  if ((w.length * 2) > MAX_LENGTH) return [];
  return [w + w];
}

function rule_10a(user) {
  const base = user.split("@")[0];
  return base ? [base + "123"] : [];
}

function rule_10b(user) {
  const base = user.split("@")[0];
  return base ? [base + "@"] : [];
}

function rule_10c(user) {
  const base = user.split("@")[0];
  return base ? [base + "1999"] : [];
}

function rule_10d(user) {
  const base = user.split("@")[0];
  return base ? [base + "@123"] : [];
}

function rule_11a(t) {
  const w = t.join("");
  const lastNum = w.match(/\d+$/);
  if (lastNum) {
    const num = lastNum[0];
    const rest = w.substring(0, w.length - num.length);
    return [rest + num + num.charAt(0)];
  }
  return [];
}

function rule_11b(t) {
  const w = t.join("");
  const firstNum = w.match(/^\d+/);
  if (firstNum) {
    const num = firstNum[0];
    return [num + num.charAt(0) + w.substring(num.length)];
  }
  return [];
}

function rule_11c(t) {
  const w = t.join("");
  return [w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()];
}

function rule_12a(t) {
  const w = t.join("");
  if (isPhoneNumber(w)) {
    return [w + "@"];
  }
  return [];
}

function rule_12b(t) {
  const w = t.join("");
  if (isPhoneNumber(w)) {
    return [w + "123"];
  }
  return [];
}

function rule_12c(t) {
  const w = t.join("");
  if (isPhoneNumber(w)) {
    return [w + "vip"];
  }
  return [];
}

const RULES_MAP = {
  "1a": rule_1a, "1b": rule_1b, "1c": rule_1c,
  "2a": rule_2a, "2b": rule_2b, "2c": rule_2c, "2d": rule_2d, "2e": rule_2e, "2f": rule_2f, "2g": rule_2g,
  "3a": rule_3a, "3b": rule_3b, "3c": rule_3c, "3d": rule_3d, "3e": rule_3e, "3f": rule_3f, "3g": rule_3g,
  "4a": rule_4a, "4b": rule_4b, "4c": rule_4c, "4d": rule_4d, "4e": rule_4e, "4f": rule_4f,
  "5a": rule_5a, "5b": rule_5b, "5c": rule_5c, "5d": rule_5d, "5e": rule_5e, "5f": rule_5f, "5g": rule_5g,
  "6a": rule_6a, "6b": rule_6b, "6c": rule_6c, "6d": rule_6d, "6e": rule_6e, "6f": rule_6f,
  "7a": rule_7a, "7b": rule_7b, "7c": rule_7c,
  "8a": rule_8a, "8b": rule_8b,
  "9a": rule_9a, "9b": rule_9b,
  "10a": rule_10a, "10b": rule_10b, "10c": rule_10c, "10d": rule_10d,
  "11a": rule_11a, "11b": rule_11b, "11c": rule_11c,
  "12a": rule_12a, "12b": rule_12b, "12c": rule_12c
};

// ============================================
// ADVANCED MUTATIONS
// ============================================

async function applyRuleChain(base, user, selectedRules, depth, limit) {
  const results = new Set([base]);
  let currentLayer = [base];
  
  for (let layer = 0; layer < depth; layer++) {
    if (!isProcessing || shouldStop) break;
    
    const nextLayer = new Set();
    
    for (const pwd of currentLayer) {
      const tokens = tokenize(pwd);
      
      for (const ruleId of selectedRules) {
        if (results.size >= limit) break;
        
        const ruleFn = RULES_MAP[ruleId];
        if (!ruleFn) continue;
        
        try {
          const variants = ruleId.startsWith("10") ? ruleFn(user) : ruleFn(tokens);
          const variantsArray = Array.isArray(variants) ? variants : [variants];
          
          for (const v of variantsArray) {
            if (results.size >= limit) break;
            if (validVariant(v, base)) {
              results.add(v);
              nextLayer.add(v);
            }
          }
        } catch (e) {
          console.error(`Error in rule ${ruleId}:`, e);
        }
      }
    }
    
    currentLayer = Array.from(nextLayer);
    if (currentLayer.length === 0) break;
  }
  
  results.delete(base);
  return Array.from(results);
}

// ============================================
// UI INITIALIZATION
// ============================================

function initializeUI() {
  const basicContainer = document.getElementById("basicRulesContainer");
  const advancedContainer = document.getElementById("advancedRulesContainer");
  
  basicContainer.innerHTML = "";
  advancedContainer.innerHTML = "";
  
  RULES_CONFIG.forEach((group) => {
    const groupDiv1 = createRuleGroup(group, "basic");
    basicContainer.appendChild(groupDiv1);
    
    const groupDiv2 = createRuleGroup(group, "advanced");
    advancedContainer.appendChild(groupDiv2);
  });
}

function createRuleGroup(group, tab) {
  const groupDiv = document.createElement("div");
  groupDiv.className = "rule-group";
  groupDiv.dataset.group = group.name;
  
  const label = document.createElement("label");
  label.textContent = group.name;
  groupDiv.appendChild(label);
  
  const subrules = document.createElement("div");
  subrules.className = "subrules";
  
  group.rules.forEach((rule) => {
    const ruleLabel = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = rule.id;
    checkbox.dataset.tab = tab;
    checkbox.addEventListener("change", updateButtonStates);
    
    ruleLabel.appendChild(checkbox);
    ruleLabel.appendChild(document.createTextNode(rule.label));
    subrules.appendChild(ruleLabel);
  });
  
  groupDiv.appendChild(subrules);
  return groupDiv;
}

function updateButtonStates() {
  const hasFile = lastData !== null;
  const hasBasicRules = document.querySelectorAll('#basicRulesContainer input:checked').length > 0;
  const hasAdvRules = document.querySelectorAll('#advancedRulesContainer input:checked').length > 0;
  
  document.getElementById("generateBasicBtn").disabled = !hasFile || !hasBasicRules;
  document.getElementById("generateAdvBtn").disabled = !hasFile || !hasAdvRules;
  document.getElementById("clearBtn").disabled = lastResult === "";
  document.getElementById("downloadBtn").disabled = lastResult === "";
  document.getElementById("copyBtn").disabled = lastResult === "";
}

function filterRules(tab) {
  const search = document.getElementById(`search${tab.charAt(0).toUpperCase() + tab.slice(1)}`).value.toLowerCase();
  const container = document.getElementById(`${tab}RulesContainer`);
  
  container.querySelectorAll(".rule-group").forEach(group => {
    const name = group.dataset.group.toLowerCase();
    const visible = name.includes(search) || 
                   Array.from(group.querySelectorAll("label")).some(l => 
                     l.textContent.toLowerCase().includes(search)
                   );
    group.style.display = visible ? "" : "none";
  });
}

// ============================================
// FILE HANDLING
// ============================================

function setupFileUpload() {
  const fileInput = document.getElementById("fileInput");
  const uploadArea = document.getElementById("uploadArea");
  
  fileInput.addEventListener("change", handleFileSelect);
  
  uploadArea.addEventListener("click", () => {
    fileInput.click();
  });
  
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.background = "rgba(102, 126, 234, 0.2)";
  });
  
  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.background = "";
  });
  
  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.background = "";
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect();
    }
  });
}

function handleFileSelect() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    lastData = parseFileContent(content);
    document.getElementById("statsFile").textContent = lastData.length;
    document.getElementById("recordCount").textContent = lastData.length;
    document.getElementById("fileSize").textContent = (file.size / 1024).toFixed(1) + " KB";
    document.getElementById("fileStats").style.display = "grid";
    updateButtonStates();
    showToast(`✅ Tải ${lastData.length} cặp dữ liệu thành công!`, "success");
  };
  reader.onerror = () => {
    showToast("❌ Lỗi khi đọc file", "error");
  };
  reader.readAsText(file, "utf-8");
}

function parseFileContent(content) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.includes(":"))
    .map(line => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return null;
      return {
        user: line.substring(0, colonIndex).trim(),
        pass: line.substring(colonIndex + 1).trim()
      };
    })
    .filter(x => x && x.user && x.pass);
}

// ============================================
// PROCESSING
// ============================================

async function generateVariants(mode) {
  if (!lastData || lastData.length === 0) {
    showToast("❌ Vui lòng tải file trước!", "error");
    return;
  }
  
  if (isProcessing) return;
  isProcessing = true;
  shouldStop = false;
  
  document.getElementById("generateBasicBtn").disabled = true;
  document.getElementById("generateAdvBtn").disabled = true;
  document.getElementById("stopBtn").style.display = "inline-flex";
  document.getElementById("progressSection").classList.add("active");
  
  try {
    let chosen = [];
    
    if (mode === "custom") {
      // Handle custom patterns
      const suffixes = document.getElementById("customSuffixes").value.split("\n").filter(x => x.trim());
      const prefixes = document.getElementById("customPrefixes").value.split("\n").filter(x => x.trim());
      const separators = document.getElementById("customSeparators").value.split("\n").filter(x => x.trim());
      
      if (suffixes.length === 0 && prefixes.length === 0 && separators.length === 0) {
        showToast("❌ Vui lòng nhập ít nhất một pattern!", "error");
        isProcessing = false;
        document.getElementById("generateBasicBtn").disabled = false;
        document.getElementById("generateAdvBtn").disabled = false;
        document.getElementById("stopBtn").style.display = "none";
        document.getElementById("progressSection").classList.remove("active");
        return;
      }
      
      allResults.clear();
      const maxResults = parseInt(document.getElementById("maxResults").value);
      let processed = 0;
      
      for (const item of lastData) {
        if (!isProcessing || shouldStop) break;
        if (allResults.size >= maxResults) break;
        
        const user = item.user;
        const pass = item.pass;
        
        // Add suffixes
        for (const suffix of suffixes) {
          const variant = pass + suffix;
          if (validVariant(variant, pass) && variant.length <= MAX_LENGTH) {
            const key = `${user.toLowerCase()}:${variant}`;
            allResults.set(key, true);
          }
        }
        
        // Add prefixes
        for (const prefix of prefixes) {
          const variant = prefix + pass;
          if (validVariant(variant, pass) && variant.length <= MAX_LENGTH) {
            const key = `${user.toLowerCase()}:${variant}`;
            allResults.set(key, true);
          }
        }
        
        // Add separators
        for (const sep of separators) {
          const m = pass.match(/^([A-Za-z]+)(\d+)$/) || pass.match(/^(\d+)([A-Za-z]+)$/);
          if (m) {
            const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
            const digits = /\d/.test(m[1]) ? m[1] : m[2];
            const variant = letters + sep + digits;
            if (validVariant(variant, pass) && variant.length <= MAX_LENGTH) {
              const key = `${user.toLowerCase()}:${variant}`;
              allResults.set(key, true);
            }
          }
        }
        
        processed++;
        updateProgress(processed, lastData.length);
      }
    } else {
      const selector = mode === "basic" ? "#basicRulesContainer" : "#advancedRulesContainer";
      chosen = Array.from(document.querySelectorAll(`${selector} input:checked`))
        .map((c) => c.value);
      
      if (chosen.length === 0) {
        showToast("❌ Vui lòng chọn ít nhất một quy tắc!", "error");
        isProcessing = false;
        document.getElementById("generateBasicBtn").disabled = false;
        document.getElementById("generateAdvBtn").disabled = false;
        document.getElementById("stopBtn").style.display = "none";
        document.getElementById("progressSection").classList.remove("active");
        return;
      }
      
      allResults.clear();
      const chunkSize = parseInt(document.getElementById("chunkSize").value);
      const maxResults = parseInt(document.getElementById("maxResults").value);
      const depth = mode === "advanced" ? parseInt(document.getElementById("mutationDepth").value) : 1;
      
      let totalProcessed = 0;
      
      for (let i = 0; i < lastData.length; i += chunkSize) {
        if (!isProcessing || shouldStop) break;
        
        const chunk = lastData.slice(i, i + chunkSize);
        
        for (const item of chunk) {
          if (!isProcessing || shouldStop) break;
          if (allResults.size >= maxResults) break;
          
          const origPass = item.pass;
          const user = item.user;
          
          if (mode === "basic") {
            const tokens = tokenize(origPass);
            for (const ruleId of chosen) {
              if (allResults.size >= maxResults) break;
              
              const ruleFn = RULES_MAP[ruleId];
              if (!ruleFn) continue;
              
              try {
                const variants = ruleId.startsWith("10") || ruleId.startsWith("12") ? ruleFn(user) : ruleFn(tokens);
                const variantsArray = Array.isArray(variants) ? variants : [variants];
                
                for (const v of variantsArray) {
                  if (allResults.size >= maxResults) break;
                  if (validVariant(v, origPass)) {
                    const key = `${user.toLowerCase()}:${v}`;
                    allResults.set(key, true);
                  }
                }
              } catch (e) {
                console.error(e);
              }
            }
          } else {
            const variants = await applyRuleChain(origPass, user, chosen, depth, maxResults);
            
            for (const v of variants) {
              if (allResults.size >= maxResults) break;
              const key = `${user.toLowerCase()}:${v}`;
              allResults.set(key, true);
            }
          }
          
          totalProcessed++;
        }
        
        updateProgress(totalProcessed, lastData.length);
        await new Promise(r => setTimeout(r, 0));
      }
    }
    
    displayResults();
    const ratio = lastData.length > 0 ? (allResults.size / lastData.length).toFixed(1) : 0;
    document.getElementById("statsVariants").textContent = allResults.size;
    document.getElementById("statsRatio").textContent = ratio + "x";
    document.getElementById("ratioCount").textContent = ratio + "x";
    
    showToast(
      `✅ Tạo ${allResults.size} variants từ ${lastData.length} cặp!`,
      "success"
    );
    
  } catch (error) {
    console.error("Error:", error);
    showToast(`❌ Lỗi: ${error.message}`, "error");
  } finally {
    isProcessing = false;
    shouldStop = false;
    document.getElementById("generateBasicBtn").disabled = false;
    document.getElementById("generateAdvBtn").disabled = false;
    document.getElementById("stopBtn").style.display = "none";
    document.getElementById("progressSection").classList.remove("active");
    updateButtonStates();
  }
}

function displayResults() {
  const previewLines = 1000;
  const items = Array.from(allResults.keys()).slice(0, previewLines);
  
  let output = "";
  for (const item of items) {
    output += item + "\n";
  }
  
  lastResult = output;
  document.getElementById("output").textContent = output || "Không có kết quả.";
  document.getElementById("count").textContent = items.length;
  document.getElementById("totalCount").textContent = allResults.size;
  updateButtonStates();
}

function stopProcessing() {
  shouldStop = true;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function downloadResults() {
  if (allResults.size === 0) return;
  
  const format = document.getElementById("exportFormat").value;
  let content, filename, type;
  
  const items = Array.from(allResults.keys());
  
  if (format === "csv") {
    content = "username,password\n" + items.map(line => {
      const colonIndex = line.indexOf(":");
      const user = line.substring(0, colonIndex);
      const pass = line.substring(colonIndex + 1);
      return `"${user}","${pass}"`;
    }).join("\n");
    filename = `passwords_${Date.now()}.csv`;
    type = "text/csv;charset=utf-8";
  } else if (format === "json") {
    const data = items.map(line => {
      const colonIndex = line.indexOf(":");
      return {
        username: line.substring(0, colonIndex),
        password: line.substring(colonIndex + 1)
      };
    });
    content = JSON.stringify(data, null, 2);
    filename = `passwords_${Date.now()}.json`;
    type = "application/json;charset=utf-8";
  } else {
    content = items.join("\n");
    filename = `passwords_${Date.now()}.txt`;
    type = "text/plain;charset=utf-8";
  }
  
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
  showToast("✅ Tải file thành công!", "success");
}

function copyToClipboard() {
  if (!lastResult) return;
  
  navigator.clipboard.writeText(lastResult).then(() => {
    showToast("✅ Đã copy vào clipboard!", "success");
  }).catch(() => {
    showToast("❌ Lỗi khi copy!", "error");
  });
}

function clearAll() {
  lastResult = "";
  allResults.clear();
  lastData = null;
  document.getElementById("fileInput").value = "";
  document.querySelectorAll(".subrules input:checked").forEach((c) => {
    c.checked = false;
  });
  document.getElementById("output").textContent = "No data. Upload a file to begin.";
  document.getElementById("count").textContent = "0";
  document.getElementById("totalCount").textContent = "0";
  document.getElementById("progressBar").style.width = "0%";
  document.getElementById("statsFile").textContent = "0";
  document.getElementById("statsVariants").textContent = "0";
  document.getElementById("statsRatio").textContent = "0x";
  document.getElementById("ratioCount").textContent = "0x";
  document.getElementById("fileStats").style.display = "none";
  updateButtonStates();
  showToast("🗑️ Đã xóa tất cả dữ liệu!", "info");
}

// ============================================
// TAB SWITCHING
// ============================================

function setupTabs() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      
      button.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    });
  });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initializeUI();
  setupFileUpload();
  setupTabs();
  updateButtonStates();
});