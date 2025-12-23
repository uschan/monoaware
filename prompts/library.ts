
import { Type } from "@google/genai";
import { AIToolConfig } from "./types";
import { 
  DecisionInput
} from "../types";

// --- HELPER: Standardize Prompt Construction ---
const buildStructuredPrompt = (role: string, contract: string, style: string) => {
  return `
[ROLE_DEFINITION]
${role}

[OUTPUT_CONTRACT]
1. You MUST return a VALID JSON object.
2. Do NOT output any markdown code blocks (like \`\`\`json). Just the raw JSON string.
3. The JSON structure must strictly follow this template:
${contract}

[STYLE_CONSTRAINTS]
${style}
`.trim();
};

export const AntiLifeConfig: AIToolConfig<{profile: string, weakness: string}> = {
  id: 'ANTI_LIFE',
  systemPrompt: buildStructuredPrompt(
    "你是一名来自未来的‘项目验尸官’(Project Coroner)。你的工作是对用户提出的计划进行‘尸检’。请假设这个计划已经彻底失败了。",
    `{ "deathTime": "2024-Q4", "causeOfDeath": "...", "clinicalAnalysis": "...", "fatalSymptom": "...", "preventableMeasure": "...", "survivalRate": 15 }`,
    "你需要撰写一份冷酷、专业、充满病理学术语的验尸报告。分析死因、死亡时间、致命病灶。必须用简体中文回答。"
  ),
  userPromptBuilder: ({profile, weakness}) => `计划/目标："${profile}"\n已知弱点/担忧："${weakness}"\n\n请出具尸检报告。`,
  jsonStructure: `{ "deathTime": "string", "causeOfDeath": "string", "clinicalAnalysis": "string", "fatalSymptom": "string", "preventableMeasure": "string", "survivalRate": 0 }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      deathTime: {type: Type.STRING}, 
      causeOfDeath: {type: Type.STRING}, 
      clinicalAnalysis: {type: Type.STRING}, 
      fatalSymptom: {type: Type.STRING}, 
      preventableMeasure: {type: Type.STRING}, 
      survivalRate: {type: Type.NUMBER} 
    },
    required: ["deathTime", "causeOfDeath", "clinicalAnalysis", "fatalSymptom", "preventableMeasure", "survivalRate"]
  }
};

export const BiasConfig: AIToolConfig<string> = {
  id: 'BIAS_DETECTOR',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘认知生化扫描仪’(Cognitive Biohazard Scanner)。将用户输入的文本视为‘生物样本’。你的任务是扫描样本中的‘逻辑谬误病毒’(Logical Fallacy Viruses)。",
    `{ "infectionRate": 0, "overallDiagnosis": "...", "viruses": [{ "name": "...", "severity": "HIGH", "symptom": "...", "treatment": "..." }], "quarantineAdvice": "..." }`,
    "必须用简体中文。输出风格要像生化危机实验室报告。severity 必须是 LOW, MEDIUM, HIGH, CRITICAL。"
  ),
  userPromptBuilder: (text) => `扫描样本："${text}"。`,
  jsonStructure: `{ "infectionRate": 0, "overallDiagnosis": "string", "viruses": [], "quarantineAdvice": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      infectionRate: {type: Type.NUMBER}, 
      overallDiagnosis: {type: Type.STRING}, 
      viruses: {
        type: Type.ARRAY, 
        items: {
          type: Type.OBJECT, 
          properties: {
            name: {type: Type.STRING}, 
            severity: {type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']}, 
            symptom: {type: Type.STRING}, 
            treatment: {type: Type.STRING}
          },
          required: ["name", "severity", "symptom", "treatment"]
        }
      }, 
      quarantineAdvice: {type: Type.STRING} 
    },
    required: ["infectionRate", "overallDiagnosis", "viruses", "quarantineAdvice"]
  },
  extractor: (data: any) => ({
      infectionRate: data.infectionRate || 0,
      overallDiagnosis: data.overallDiagnosis || "样本纯净",
      viruses: Array.isArray(data.viruses) ? data.viruses : [],
      quarantineAdvice: data.quarantineAdvice || "无需隔离"
    })
};

export const WorldSimConfig: AIToolConfig<string> = {
  id: 'WORLD_SIM',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘平行宇宙观测站’的AI。用户输入一个‘异变点’，你需要推演这个新世界的时间线和生存法则。",
    `{ "chaosLevel": 50, "divergencePoint": "...", "timeline": [{ "year": "...", "event": "...", "impact": "..." }], "breakingNews": { "headline": "...", "source": "...", "date": "..." }, "newLaws": ["..."], "survivorGuide": { "role": "...", "keySkill": "...", "mustHaveItem": "..." } }`,
    "必须用简体中文。风格要像科幻小说大纲。Timeline 必须包含至少3个关键节点。"
  ),
  userPromptBuilder: (premise) => `异变点假设："${premise}"。观测该宇宙。`,
  jsonStructure: `{ "chaosLevel": 0, "divergencePoint": "string", "timeline": [], "breakingNews": {}, "newLaws": [], "survivorGuide": {} }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      chaosLevel: {type: Type.NUMBER}, 
      divergencePoint: {type: Type.STRING}, 
      timeline: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {year: {type: Type.STRING}, event: {type: Type.STRING}, impact: {type: Type.STRING}}, required: ["year", "event", "impact"]}}, 
      breakingNews: {type: Type.OBJECT, properties: {headline: {type: Type.STRING}, source: {type: Type.STRING}, date: {type: Type.STRING}}, required: ["headline", "source", "date"]}, 
      newLaws: {type: Type.ARRAY, items: {type: Type.STRING}}, 
      survivorGuide: {type: Type.OBJECT, properties: {role: {type: Type.STRING}, keySkill: {type: Type.STRING}, mustHaveItem: {type: Type.STRING}}, required: ["role", "keySkill", "mustHaveItem"]} 
    },
    required: ["chaosLevel", "divergencePoint", "timeline", "breakingNews", "newLaws", "survivorGuide"]
  },
  extractor: (data: any) => ({
      chaosLevel: data.chaosLevel || 0,
      divergencePoint: data.divergencePoint || "",
      timeline: Array.isArray(data.timeline) ? data.timeline : [],
      breakingNews: data.breakingNews || { headline: "Connection Lost", source: "System", date: "Unknown" },
      newLaws: Array.isArray(data.newLaws) ? data.newLaws : [],
      survivorGuide: data.survivorGuide || { role: "Unknown", keySkill: "Survival", mustHaveItem: "Hope" }
    })
};

export const SubtextConfig: AIToolConfig<string> = {
  id: 'SUBTEXT',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘真相审讯室’的测谎专家。用户输入一段‘被拦截的通讯’，你需要分析其中的潜台词和权力关系。",
    `{ "bullshitMeter": 50, "voiceStressAnalysis": "...", "declassifiedContent": [{ "original": "...", "decoded": "...", "intent": "..." }], "verdict": "...", "powerDynamics": "..." }`,
    "必须用简体中文。风格要像冷战时期的情报解密文件。"
  ),
  userPromptBuilder: (text) => `分析拦截的通讯："${text}"`,
  jsonStructure: `{ "bullshitMeter": 0, "voiceStressAnalysis": "string", "declassifiedContent": [], "verdict": "string", "powerDynamics": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      bullshitMeter: {type: Type.NUMBER}, 
      voiceStressAnalysis: {type: Type.STRING}, 
      declassifiedContent: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {original: {type: Type.STRING}, decoded: {type: Type.STRING}, intent: {type: Type.STRING}}, required: ["original", "decoded", "intent"]}}, 
      verdict: {type: Type.STRING}, 
      powerDynamics: {type: Type.STRING} 
    },
    required: ["bullshitMeter", "voiceStressAnalysis", "declassifiedContent", "verdict", "powerDynamics"]
  },
  extractor: (data: any) => ({
      bullshitMeter: data.bullshitMeter || 0,
      voiceStressAnalysis: data.voiceStressAnalysis || "无明显压力",
      declassifiedContent: Array.isArray(data.declassifiedContent) ? data.declassifiedContent : [],
      verdict: data.verdict || "信息不足",
      powerDynamics: data.powerDynamics || "未知"
    })
};

export const EgoBoundaryConfig: AIToolConfig<string> = {
  id: 'EGO_BOUNDARY',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘精神结构工程师’。把用户的人格视为建筑物，进行‘风洞压力测试’。",
    `{ "integrityScore": 50, "yieldPoint": { "trigger": "...", "pressureLevel": "..." }, "fractureMode": "...", "structuralWeaknesses": [{ "location": "...", "description": "...", "riskLevel": "HIGH" }], "reinforcementPlan": "..." }`,
    "必须用简体中文。使用工程力学术语隐喻心理状态。"
  ),
  userPromptBuilder: (desc) => `启动风洞测试。测试对象自述："${desc}"。`,
  jsonStructure: `{ "integrityScore": 0, "yieldPoint": {}, "fractureMode": "string", "structuralWeaknesses": [], "reinforcementPlan": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      integrityScore: {type: Type.NUMBER}, 
      yieldPoint: {type: Type.OBJECT, properties: {trigger: {type: Type.STRING}, pressureLevel: {type: Type.STRING}}, required: ["trigger", "pressureLevel"]}, 
      fractureMode: {type: Type.STRING}, 
      structuralWeaknesses: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {location: {type: Type.STRING}, description: {type: Type.STRING}, riskLevel: {type: Type.STRING, enum: ['LOW', 'MED', 'HIGH', 'CRITICAL']}}, required: ["location", "description", "riskLevel"]}}, 
      reinforcementPlan: {type: Type.STRING} 
    },
    required: ["integrityScore", "yieldPoint", "fractureMode", "structuralWeaknesses", "reinforcementPlan"]
  },
  extractor: (data: any) => ({
      integrityScore: data.integrityScore || 0,
      yieldPoint: data.yieldPoint || { trigger: "Unknown", pressureLevel: "Unknown" },
      fractureMode: data.fractureMode || "Unknown",
      structuralWeaknesses: Array.isArray(data.structuralWeaknesses) ? data.structuralWeaknesses : [],
      reinforcementPlan: data.reinforcementPlan || "None"
    })
};

export const LangSmellConfig: AIToolConfig<string> = {
  id: 'LANG_SMELL',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘语义光谱仪’。像化学分析一样，分析文本的‘成分’。",
    `{ "composition": [{ "label": "...", "percentage": 10, "colorCode": "..." }], "scentProfile": { "topNote": "...", "middleNote": "...", "baseNote": "..." }, "toxicityPPM": 100, "aiProbability": 0, "detectionLog": "..." }`,
    "必须用简体中文。分析语气、用词倾向、潜意识情绪。"
  ),
  userPromptBuilder: (text) => `分析样本："${text}"。`,
  jsonStructure: `{ "composition": [], "scentProfile": {}, "toxicityPPM": 0, "aiProbability": 0, "detectionLog": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      composition: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {label: {type: Type.STRING}, percentage: {type: Type.NUMBER}, colorCode: {type: Type.STRING}}, required: ["label", "percentage"]}}, 
      scentProfile: {type: Type.OBJECT, properties: {topNote: {type: Type.STRING}, middleNote: {type: Type.STRING}, baseNote: {type: Type.STRING}}, required: ["topNote", "middleNote", "baseNote"]}, 
      toxicityPPM: {type: Type.NUMBER}, 
      aiProbability: {type: Type.NUMBER}, 
      detectionLog: {type: Type.STRING} 
    },
    required: ["composition", "scentProfile", "toxicityPPM", "aiProbability", "detectionLog"]
  },
  extractor: (data: any) => ({
      composition: Array.isArray(data.composition) ? data.composition : [],
      scentProfile: data.scentProfile || { topNote: "", middleNote: "", baseNote: "" },
      toxicityPPM: data.toxicityPPM || 0,
      aiProbability: data.aiProbability || 0,
      detectionLog: data.detectionLog || ""
    })
};

export const DecisionMatrixConfig: AIToolConfig<DecisionInput> = {
  id: 'DECISION_PATH',
  systemPrompt: buildStructuredPrompt(
    "You are a professional decision analysis assistant. Your role is to analyze decisions using a structured comparison framework.",
    `{ "decision_nature": { "type": "...", "core_conflict": "...", "key_uncertainty": "..." }, "comparison_matrix": [], "risk_warnings": [], "experimentation_suggestions": [], "stop_loss_signals": [], "cooling_advice": {} }`,
    "Must answer in Simplified Chinese. Be objective, rational, and exhaustive."
  ),
  userPromptBuilder: (input) => `Analyze the following decision:\n${JSON.stringify(input)}`,
  jsonStructure: `{ "decision_nature": {}, "comparison_matrix": [], "risk_warnings": [], "experimentation_suggestions": [], "stop_loss_signals": [], "cooling_advice": {} }`,
  schema: {
    type: Type.OBJECT,
    properties: {
      decision_nature: { type: Type.OBJECT, properties: { type: {type: Type.STRING}, core_conflict: {type: Type.STRING}, key_uncertainty: {type: Type.STRING} }, required: ["type", "core_conflict", "key_uncertainty"] },
      comparison_matrix: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { option: {type: Type.STRING}, short_term_gain: {type: Type.STRING}, medium_term_risk: {type: Type.STRING}, long_term_ceiling: {type: Type.STRING}, irreversibility: {type: Type.STRING}, exit_path: {type: Type.STRING}, emotional_sustainability: {type: Type.STRING} }, required: ["option", "short_term_gain", "medium_term_risk", "long_term_ceiling", "irreversibility", "exit_path", "emotional_sustainability"] } },
      risk_warnings: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { option: {type: Type.STRING}, underestimated_risk: {type: Type.STRING}, why_it_is_dangerous: {type: Type.STRING} }, required: ["option", "underestimated_risk", "why_it_is_dangerous"] } },
      experimentation_suggestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { option: {type: Type.STRING}, test_method: {type: Type.STRING}, cost: {type: Type.STRING}, timeframe: {type: Type.STRING} }, required: ["option", "test_method", "cost", "timeframe"] } },
      stop_loss_signals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { option: {type: Type.STRING}, signal: {type: Type.STRING}, action: {type: Type.STRING} }, required: ["option", "signal", "action"] } },
      cooling_advice: { type: Type.OBJECT, properties: { emotional_bias_detected: {type: Type.STRING}, recommended_wait_time: {type: Type.STRING}, recheck_questions: {type: Type.ARRAY, items: {type: Type.STRING}} }, required: ["emotional_bias_detected", "recommended_wait_time", "recheck_questions"] }
    },
    required: ["decision_nature", "comparison_matrix", "risk_warnings", "experimentation_suggestions", "stop_loss_signals", "cooling_advice"]
  },
  extractor: (data: any) => ({
    decision_nature: data.decision_nature || { type: "Unknown", core_conflict: "Unknown", key_uncertainty: "Unknown" },
    comparison_matrix: Array.isArray(data.comparison_matrix) ? data.comparison_matrix : [],
    risk_warnings: Array.isArray(data.risk_warnings) ? data.risk_warnings : [],
    experimentation_suggestions: Array.isArray(data.experimentation_suggestions) ? data.experimentation_suggestions : [],
    stop_loss_signals: Array.isArray(data.stop_loss_signals) ? data.stop_loss_signals : [],
    cooling_advice: data.cooling_advice || { emotional_bias_detected: "", recommended_wait_time: "", recheck_questions: [] }
  })
};

export const CostCalcConfig: AIToolConfig<string> = {
  id: 'COST_CALC',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘恶魔会计师’。为用户的人生选择开具一张‘因果发票’。计算灵魂、尊严、时间、健康等隐性货币。",
    `{ "invoiceId": "#INV-666", "currencyUnit": "...", "lineItems": [{ "category": "...", "description": "...", "cost": "..." }], "totalCost": "...", "finePrint": "..." }`,
    "必须用简体中文。讽刺、黑色幽默。"
  ),
  userPromptBuilder: (choice) => `客户选择："${choice}"。请开具发票。`,
  jsonStructure: `{ "invoiceId": "string", "currencyUnit": "string", "lineItems": [], "totalCost": "string", "finePrint": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      invoiceId: {type: Type.STRING}, 
      currencyUnit: {type: Type.STRING}, 
      lineItems: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {category: {type: Type.STRING}, description: {type: Type.STRING}, cost: {type: Type.STRING}}, required: ["category", "description", "cost"]}}, 
      totalCost: {type: Type.STRING}, 
      finePrint: {type: Type.STRING} 
    },
    required: ["invoiceId", "currencyUnit", "lineItems", "totalCost", "finePrint"]
  },
  extractor: (data: any) => ({
      invoiceId: data.invoiceId || "INV-NULL",
      currencyUnit: data.currencyUnit || "Units",
      lineItems: Array.isArray(data.lineItems) ? data.lineItems : [],
      totalCost: data.totalCost || "Unknown",
      finePrint: data.finePrint || "No refunds."
    })
};

export const DeceptionConfig: AIToolConfig<string> = {
  id: 'DECEPTION',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘红丸终端’(Red Pill Terminal)。你的任务是打破用户的自我欺骗矩阵。",
    `{ "bluePillNarrative": "...", "redPillTruth": "...", "glitchFactor": 80, "systemFailureLog": ["..."], "realityPatch": "..." }`,
    "必须用简体中文。对比‘美好的谎言’和‘残酷的真相’。"
  ),
  userPromptBuilder: (narrative) => `解析这个叙事："${narrative}"。揭露真相。`,
  jsonStructure: `{ "bluePillNarrative": "string", "redPillTruth": "string", "glitchFactor": 0, "systemFailureLog": [], "realityPatch": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      bluePillNarrative: {type: Type.STRING}, 
      redPillTruth: {type: Type.STRING}, 
      glitchFactor: {type: Type.NUMBER}, 
      systemFailureLog: {type: Type.ARRAY, items: {type: Type.STRING}}, 
      realityPatch: {type: Type.STRING} 
    },
    required: ["bluePillNarrative", "redPillTruth", "glitchFactor", "systemFailureLog", "realityPatch"]
  },
  extractor: (data: any) => ({
      bluePillNarrative: data.bluePillNarrative || "",
      redPillTruth: data.redPillTruth || "",
      glitchFactor: data.glitchFactor || 0,
      systemFailureLog: Array.isArray(data.systemFailureLog) ? data.systemFailureLog : [],
      realityPatch: data.realityPatch || ""
    })
};

export const ExtremeSimConfig: AIToolConfig<string> = {
  id: 'EXTREME_SIM',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘混沌效应计算器’。将用户的微小坏习惯视为‘蝴蝶扇动翅膀’，推演其导致的级联灾难。",
    `{ "disasterLevel": "CAT 4", "currentImpact": "...", "cascadeTimeline": [{ "time": "...", "event": "...", "magnitude": 50 }], "finalCollapse": "...", "tippingPoint": "..." }`,
    "必须用简体中文。逻辑滑坡要‘看似荒谬但符合混沌逻辑’。"
  ),
  userPromptBuilder: (habit) => `坏习惯/诱因："${habit}"。推演蝴蝶效应。`,
  jsonStructure: `{ "disasterLevel": "CAT 1", "currentImpact": "string", "cascadeTimeline": [], "finalCollapse": "string", "tippingPoint": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      disasterLevel: {type: Type.STRING, enum: ['CAT 1', 'CAT 2', 'CAT 3', 'CAT 4', 'CAT 5']}, 
      currentImpact: {type: Type.STRING}, 
      cascadeTimeline: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {time: {type: Type.STRING}, event: {type: Type.STRING}, magnitude: {type: Type.NUMBER}}, required: ["time", "event", "magnitude"]}}, 
      finalCollapse: {type: Type.STRING}, 
      tippingPoint: {type: Type.STRING} 
    },
    required: ["disasterLevel", "currentImpact", "cascadeTimeline", "finalCollapse", "tippingPoint"]
  },
  extractor: (data: any) => ({
      disasterLevel: data.disasterLevel || "CAT 1",
      currentImpact: data.currentImpact || "",
      cascadeTimeline: Array.isArray(data.cascadeTimeline) ? data.cascadeTimeline : [],
      finalCollapse: data.finalCollapse || "",
      tippingPoint: data.tippingPoint || ""
    })
};

export const JuryConfig: AIToolConfig<string> = {
  id: 'JURY',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘原型议会’。脑内的不同欲望化身为议员（如：贪婪、恐惧、道德），对用户的决定进行辩论。",
    `{ "councilName": "...", "chaosMeter": 50, "jurors": [{ "archetype": "...", "icon": "🤡", "stance": "SUPPORT", "intensity": 5, "monologue": "..." }], "finalDecree": "..." }`,
    "必须用简体中文。风格：极乐迪斯科 (Disco Elysium)。"
  ),
  userPromptBuilder: (decision) => `议题："${decision}"。召开紧急会议。`,
  jsonStructure: `{ "councilName": "string", "chaosMeter": 0, "jurors": [], "finalDecree": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      councilName: {type: Type.STRING}, 
      chaosMeter: {type: Type.NUMBER}, 
      jurors: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {archetype: {type: Type.STRING}, icon: {type: Type.STRING}, stance: {type: Type.STRING, enum: ['SUPPORT', 'OPPOSE', 'ABSTAIN']}, intensity: {type: Type.NUMBER}, monologue: {type: Type.STRING}}, required: ["archetype", "icon", "stance", "intensity", "monologue"]}}, 
      finalDecree: {type: Type.STRING} 
    },
    required: ["councilName", "chaosMeter", "jurors", "finalDecree"]
  },
  extractor: (data: any) => ({
      councilName: data.councilName || "Council",
      chaosMeter: data.chaosMeter || 0,
      jurors: Array.isArray(data.jurors) ? data.jurors : [],
      finalDecree: data.finalDecree || "Adjourned"
    })
};

export const DebateConfig: AIToolConfig<string> = {
  id: 'CYBER_DEBATE',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘认知角斗场’的解说员。模拟一场关于用户话题的激烈辩论 (Red Side vs Blue Side)。",
    `{ "topic": "...", "redFighter": { "name": "...", "style": "..." }, "blueFighter": { "name": "...", "style": "..." }, "rounds": [{ "roundName": "Round 1", "redMove": { "name": "...", "content": "...", "damage": 50 }, "blueMove": { "name": "...", "content": "...", "damage": 40 } }], "winner": "RED", "fatalityMove": "..." }`,
    "必须用简体中文。必须有3个回合。每个招式要有伤害值。"
  ),
  userPromptBuilder: (topic) => `开启辩论角斗。话题："${topic}"。`,
  jsonStructure: `{ "topic": "string", "redFighter": { "name": "string", "style": "string" }, "blueFighter": { "name": "string", "style": "string" }, "rounds": [], "winner": "DRAW", "fatalityMove": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      topic: {type: Type.STRING}, 
      redFighter: {type: Type.OBJECT, properties: {name: {type: Type.STRING}, style: {type: Type.STRING}}, required: ["name", "style"]}, 
      blueFighter: {type: Type.OBJECT, properties: {name: {type: Type.STRING}, style: {type: Type.STRING}}, required: ["name", "style"]}, 
      rounds: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {roundName: {type: Type.STRING}, redMove: {type: Type.OBJECT, properties: {name: {type: Type.STRING}, content: {type: Type.STRING}, damage: {type: Type.NUMBER}}, required: ["name", "content", "damage"]}, blueMove: {type: Type.OBJECT, properties: {name: {type: Type.STRING}, content: {type: Type.STRING}, damage: {type: Type.NUMBER}}, required: ["name", "content", "damage"]}}, required: ["roundName", "redMove", "blueMove"]}}, 
      winner: {type: Type.STRING, enum: ['RED', 'BLUE', 'DRAW']}, 
      fatalityMove: {type: Type.STRING} 
    },
    required: ["topic", "redFighter", "blueFighter", "rounds", "winner", "fatalityMove"]
  },
  extractor: (data: any) => ({
      topic: data.topic || "",
      redFighter: data.redFighter || { name: "Red", style: "Aggressive" },
      blueFighter: data.blueFighter || { name: "Blue", style: "Defensive" },
      rounds: Array.isArray(data.rounds) ? data.rounds : [],
      winner: data.winner || "DRAW",
      fatalityMove: data.fatalityMove || ""
    })
};

export const CodeArchConfig: AIToolConfig<string> = {
  id: 'CODE_ARCH',
  systemPrompt: buildStructuredPrompt(
    "你是一个‘数字遗迹博物馆’的馆长。对‘烂代码’进行考古鉴定。",
    `{ "carbonDating": "...", "techStackLayer": "...", "authorProfile": { "mentalState": "...", "caffeineLevel": "...", "hairLossRisk": "..." }, "spaghettiIndex": 80, "excavationReport": "...", "fossilFaults": [], "curatorNote": "..." }`,
    "必须用简体中文。毒舌点评，考古隐喻。"
  ),
  userPromptBuilder: (code) => `鉴定这段代码遗物：\n${code}`,
  jsonStructure: `{ "carbonDating": "string", "techStackLayer": "string", "authorProfile": {}, "spaghettiIndex": 0, "excavationReport": "string", "fossilFaults": [], "curatorNote": "string" }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      carbonDating: {type: Type.STRING}, 
      techStackLayer: {type: Type.STRING}, 
      authorProfile: {type: Type.OBJECT, properties: {mentalState: {type: Type.STRING}, caffeineLevel: {type: Type.STRING}, hairLossRisk: {type: Type.STRING}}, required: ["mentalState", "caffeineLevel", "hairLossRisk"]}, 
      spaghettiIndex: {type: Type.NUMBER}, 
      excavationReport: {type: Type.STRING}, 
      fossilFaults: {type: Type.ARRAY, items: {type: Type.STRING}}, 
      curatorNote: {type: Type.STRING} 
    },
    required: ["carbonDating", "techStackLayer", "authorProfile", "spaghettiIndex", "excavationReport", "fossilFaults", "curatorNote"]
  },
  extractor: (data: any) => ({
      carbonDating: data.carbonDating || "Unknown Era",
      techStackLayer: data.techStackLayer || "Unknown Layer",
      authorProfile: data.authorProfile || { mentalState: "?", caffeineLevel: "?", hairLossRisk: "?" },
      spaghettiIndex: data.spaghettiIndex || 0,
      excavationReport: data.excavationReport || "No data found.",
      fossilFaults: Array.isArray(data.fossilFaults) ? data.fossilFaults : [],
      curatorNote: data.curatorNote || "Interesting artifact."
    })
};

export const DevilsConfig: AIToolConfig<string> = {
  id: 'DEVILS_ADVOCATE',
  systemPrompt: buildStructuredPrompt(
    "你是一个中世纪的‘逻辑异端裁判所’的大法官。对用户的观点进行‘逻辑审判’。",
    `{ "verdict": "...", "logicalCrimes": [{ "name": "...", "description": "...", "sentence": "..." }], "tortureSession": [{ "tool": "...", "method": "...", "outcome": "..." }], "forcedConfession": "...", "sanityScore": 50 }`,
    "必须用简体中文。把逻辑谬误比作异端罪行。"
  ),
  userPromptBuilder: (opinion) => `把这个观点带上审判庭："${opinion}"`,
  jsonStructure: `{ "verdict": "string", "logicalCrimes": [], "tortureSession": [], "forcedConfession": "string", "sanityScore": 0 }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      verdict: {type: Type.STRING}, 
      logicalCrimes: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {name: {type: Type.STRING}, description: {type: Type.STRING}, sentence: {type: Type.STRING}}, required: ["name", "description", "sentence"]}}, 
      tortureSession: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {tool: {type: Type.STRING}, method: {type: Type.STRING}, outcome: {type: Type.STRING}}, required: ["tool", "method", "outcome"]}}, 
      forcedConfession: {type: Type.STRING}, 
      sanityScore: {type: Type.NUMBER} 
    },
    required: ["verdict", "logicalCrimes", "tortureSession", "forcedConfession", "sanityScore"]
  },
  extractor: (data: any) => ({
      verdict: data.verdict || "逻辑混沌罪",
      logicalCrimes: Array.isArray(data.logicalCrimes) ? data.logicalCrimes : [],
      tortureSession: Array.isArray(data.tortureSession) ? data.tortureSession : [],
      forcedConfession: data.forcedConfession || "被告已疯，无法签署认罪书。",
      sanityScore: typeof data.sanityScore === 'number' ? data.sanityScore : 0
    })
};

export const StitcherConfig: AIToolConfig<{termA: string, termB: string}> = {
  id: 'CONCEPT_STITCHER',
  systemPrompt: buildStructuredPrompt(
    "你是一名疯狂的硅谷VC。强行缝合两个无关概念，生成荒诞商业计划书。",
    `{ "startupName": "...", "tagline": "...", "userPersona": { "name": "...", "description": "...", "desire": "..." }, "revenueModel": "...", "growthHack": "...", "vcVerdict": "...", "unicornProbability": 50 }`,
    "必须用简体中文。风格浮夸，充满创投圈黑话。"
  ),
  userPromptBuilder: ({termA, termB}) => `强制缝合这两个概念："${termA}" + "${termB}"。生成项目路演材料。`,
  jsonStructure: `{ "startupName": "string", "tagline": "string", "userPersona": {}, "revenueModel": "string", "growthHack": "string", "vcVerdict": "string", "unicornProbability": 0 }`,
  schema: { 
    type: Type.OBJECT, 
    properties: { 
      startupName: {type: Type.STRING}, 
      tagline: {type: Type.STRING}, 
      userPersona: {type: Type.OBJECT, properties: {name: {type: Type.STRING}, description: {type: Type.STRING}, desire: {type: Type.STRING}}, required: ["name", "description", "desire"]}, 
      revenueModel: {type: Type.STRING}, 
      growthHack: {type: Type.STRING}, 
      vcVerdict: {type: Type.STRING}, 
      unicornProbability: {type: Type.NUMBER} 
    },
    required: ["startupName", "tagline", "userPersona", "revenueModel", "growthHack", "vcVerdict", "unicornProbability"]
  }
};
