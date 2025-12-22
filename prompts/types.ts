
import { Schema } from "@google/genai";

export interface AIToolConfig<TInput = any, TOutput = any> {
  /** The unique ID of the tool */
  id: string;
  /** The System Prompt (Context & Persona) */
  systemPrompt: string;
  /** Function to build the User Prompt based on inputs */
  userPromptBuilder: (input: TInput) => string;
  /** The stringified JSON structure instruction for DeepSeek/System Prompt */
  jsonStructure: string;
  /** The strict Schema object for Gemini Structured Output */
  schema: Schema;
  /** Optional: Transform the raw API response before returning */
  extractor?: (data: any) => TOutput;
}
