
import { GoogleGenAI, Schema } from "@google/genai";
import { 
  AntiLifeResult, BiasResult, WorldSimResult, SubtextResult, EgoBoundaryResult,
  LangSmellResult, DecisionPathResult, CostCalcResult, DeceptionResult, ExtremeSimResult, JuryResult,
  DebateResult, CodeArchResult, DevilsResult,
  StitcherResult,
  DecisionInput
} from "../types";

import { AIToolConfig } from "../prompts/types";
import { 
  AntiLifeConfig, BiasConfig, WorldSimConfig, SubtextConfig, 
  EgoBoundaryConfig, LangSmellConfig, DecisionMatrixConfig, CostCalcConfig, 
  DeceptionConfig, ExtremeSimConfig, JuryConfig, DebateConfig, 
  CodeArchConfig, DevilsConfig, 
  StitcherConfig
} from "../prompts/library";
import { HistoryService } from "./historyService";

// --- DEEPSEEK HELPERS ---
const getDeepSeekKey = (): string | null => {
  if (typeof window !== 'undefined') {
    const key = localStorage.getItem('DEEPSEEK_API_KEY');
    return key && key.trim().length > 0 ? key.trim() : null;
  }
  return null;
};

// --- DATA INTEGRITY CHECK ---
const checkDataIntegrity = (configId: string, response: any, expectedStructureJSON: string) => {
  try {
    const expected = JSON.parse(expectedStructureJSON);
    const expectedKeys = Object.keys(expected);
    const responseKeys = Object.keys(response);
    
    const missingKeys = expectedKeys.filter(k => !responseKeys.includes(k));
    
    if (missingKeys.length > 0) {
      console.warn(`⚠️ [${configId}] DATA INTEGRITY ALARM: Missing keys`, missingKeys);
    } else {
      console.log(`✅ [${configId}] Integrity Check Passed`);
    }
  } catch (e) {
    // Ignore check errors
  }
};

// --- PROXY CALLER ---
async function callDeepSeekProxy(systemPrompt: string, userPrompt: string, apiKey: string): Promise<any> {
  // 自动判断环境：开发环境用 localhost:3001，生产环境用相对路径 /api/deepseek (由 Nginx 代理)
  const isDev = import.meta.env.DEV;
  const PROXY_URL = isDev ? "http://localhost:3001/api/deepseek" : "/api/deepseek";

  console.groupCollapsed("🚀 DeepSeek Request (Via Local Proxy)");
  console.log("Target:", PROXY_URL);
  console.log("System:", systemPrompt);
  console.log("User:", userPrompt);
  console.groupEnd();

  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Pass the key to the proxy so it can make the authorized call
      body: JSON.stringify({
        apiKey,
        systemPrompt,
        userPrompt
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ Proxy Error [${response.status}]:`, errText);
      throw new Error(`Proxy Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.groupCollapsed("✅ DeepSeek Response Success");
    console.log(content);
    console.groupEnd();

    if (!content) throw new Error("Empty response from DeepSeek");
    return JSON.parse(content);

  } catch (error) {
    console.error("🔥 DeepSeek Proxy Call Failed:", error);
    throw error;
  }
}

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API_KEY not found in environment.");
  return new GoogleGenAI({ apiKey });
};

async function callGemini<T>(systemPrompt: string, userPrompt: string, schema: Schema): Promise<T> {
  console.groupCollapsed("✨ Gemini Request (Fallback/Default)");
  console.log("System:", systemPrompt);
  console.log("User:", userPrompt);
  console.groupEnd();

  try {
    const ai = getGeminiClient();
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: {
        parts: [{ text: userPrompt }] 
      },
      config: { 
        systemInstruction: systemPrompt, 
        responseMimeType: "application/json", 
        responseSchema: schema, 
        temperature: 0.8 
      },
    });
    
    if (!response.text) {
      console.error("Gemini Error: Empty response text", response);
      throw new Error("Gemini returned empty text");
    }
    
    console.groupCollapsed("✅ Gemini Response");
    console.log(response.text);
    console.groupEnd();

    return JSON.parse(response.text) as T;
  } catch (error) {
    console.error("🔥 Gemini Call Failed:", error);
    throw error;
  }
}

// --- GENERIC EXECUTOR ---

async function runAIRequest<TInput, TOutput>(
  config: AIToolConfig<TInput, TOutput>,
  input: TInput
): Promise<TOutput> {
  const systemPrompt = config.systemPrompt;
  const userPrompt = config.userPromptBuilder ? config.userPromptBuilder(input) : "";
  
  const deepSeekKey = getDeepSeekKey();
  
  let result: any = null;

  // 1. Try DeepSeek (Via Proxy) ONLY if key exists
  if (deepSeekKey) {
    try {
      const res = await callDeepSeekProxy(systemPrompt, userPrompt, deepSeekKey);
      result = res;
    } catch (e) {
      console.warn("⚠️ DeepSeek Proxy failed, switching to Gemini Fallback.", e);
      // Explicitly fall through to Gemini
    }
  }

  // 2. Fallback to Gemini if DeepSeek failed or wasn't configured
  if (!result) {
    const res = await callGemini<TOutput>(systemPrompt, userPrompt, config.schema);
    result = res;
  }

  // 3. Data Integrity Check (Soft Fail Detection)
  if (result) {
    checkDataIntegrity(config.id, result, config.jsonStructure);
  }

  // 4. Extraction & History
  if (result) {
    const finalOutput = config.extractor ? config.extractor(result) : result;
    HistoryService.saveItem(config.id, input, finalOutput);
    return finalOutput as TOutput;
  }

  throw new Error("AI Generation failed completely.");
}

// --- EXPORTED FUNCTIONS WRAPPERS ---

export const runAntiLifeSimulation = (profile: string, weakness: string): Promise<AntiLifeResult> => 
  runAIRequest(AntiLifeConfig, { profile, weakness });

export const runBiasDetection = (text: string): Promise<BiasResult> => 
  runAIRequest(BiasConfig, text);

export const runWorldSimulation = (premise: string): Promise<WorldSimResult> => 
  runAIRequest(WorldSimConfig, premise);

export const runSubtextAnalysis = (text: string): Promise<SubtextResult> => 
  runAIRequest(SubtextConfig, text);

export const runEgoBoundaryAnalysis = (description: string): Promise<EgoBoundaryResult> => 
  runAIRequest(EgoBoundaryConfig, description);

export const runLanguageSmell = (text: string): Promise<LangSmellResult> => 
  runAIRequest(LangSmellConfig, text);

export const runDecisionMatrix = (input: DecisionInput): Promise<DecisionPathResult> => 
  runAIRequest(DecisionMatrixConfig, input);

export const runCostCalculation = (choice: string): Promise<CostCalcResult> => 
  runAIRequest(CostCalcConfig, choice);

export const runSelfDeception = (narrative: string): Promise<DeceptionResult> => 
  runAIRequest(DeceptionConfig, narrative);

export const runExtremeSimulation = (habit: string): Promise<ExtremeSimResult> => 
  runAIRequest(ExtremeSimConfig, habit);

export const runPersonalityJury = (decision: string): Promise<JuryResult> => 
  runAIRequest(JuryConfig, decision);

export const runCyberDebate = (topic: string): Promise<DebateResult> => 
  runAIRequest(DebateConfig, topic);

export const runCodeArchaeology = (code: string): Promise<CodeArchResult> => 
  runAIRequest(CodeArchConfig, code);

export const runDevilsAdvocate = (opinion: string): Promise<DevilsResult> => 
  runAIRequest(DevilsConfig, opinion);

export const runConceptStitcher = (termA: string, termB: string): Promise<StitcherResult> => 
  runAIRequest(StitcherConfig, { termA, termB });
