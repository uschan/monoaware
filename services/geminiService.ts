
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
  // Safely check for DEV mode using a try-catch to avoid crashing if import.meta is undefined
  let isDev = false;
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      isDev = import.meta.env.DEV;
    }
  } catch(e) {}

  // Determine URL based on environment
  // In production (VPS), Nginx handles /api/deepseek -> localhost:3001
  // In local dev, we might need direct access if proxy isn't set up
  const PROXY_URL = isDev ? "http://localhost:3001/api/deepseek" : "/api/deepseek";

  console.groupCollapsed("🚀 DeepSeek Request (Via Local Proxy)");
  console.log("Target:", PROXY_URL);
  console.log("System:", systemPrompt);
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
      const status = response.status;
      const errText = await response.text();
      
      console.error(`❌ Proxy Error [${status}]:`);
      console.error(errText); // Log the full HTML/Text response from server

      if (status === 502) {
        throw new Error(`Proxy 502 Bad Gateway. The Node server might be down. Check PM2 logs.`);
      }
      if (status === 404) {
        throw new Error(`Proxy 404 Not Found. Ensure server.js is running and Nginx is configured.`);
      }
      throw new Error(`Proxy Error: ${status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("Empty response from DeepSeek");
    return JSON.parse(content);

  } catch (error) {
    console.error("🔥 DeepSeek Proxy Call Failed:", error);
    throw error;
  }
}

// --- ROBUST API KEY RETRIEVAL ---
const getGeminiClient = () => {
  let apiKey = '';

  // 1. Try import.meta.env (Vite) - Wrapped in rigorous try-catch
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        // @ts-ignore
        apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      }
    }
  } catch (e) {
    // console.debug("import.meta.env access failed (expected in some envs)");
  }

  // 2. Try process.env (Node/Webpack) - Wrapped in rigorous try-catch
  if (!apiKey) {
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env) {
         // @ts-ignore
         if (process.env.VITE_GEMINI_API_KEY) apiKey = process.env.VITE_GEMINI_API_KEY;
         // @ts-ignore
         else if (process.env.API_KEY) apiKey = process.env.API_KEY;
      }
    } catch (e) {
      // console.debug("process.env access failed");
    }
  }

  if (!apiKey) {
    console.error("❌ GEMINI API KEY MISSING. Please set VITE_GEMINI_API_KEY in .env file.");
    // Return a dummy client to prevent immediate crash, allow UI to handle error gracefully if called
    // But throwing here is better to alert developer.
    throw new Error("Gemini API_KEY not found in environment variables (VITE_GEMINI_API_KEY or API_KEY).");
  }
  
  return new GoogleGenAI({ apiKey });
};

async function callGemini<T>(systemPrompt: string, userPrompt: string, schema: Schema): Promise<T> {
  console.groupCollapsed("✨ Gemini Request (Fallback)");
  console.log("System:", systemPrompt);
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
