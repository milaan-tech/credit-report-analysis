// Server-side only — called exclusively from /api/analyze route.
// Calls gpt-4o with response_format: json_schema to enforce structured output,
// then validates the raw response against AnalysisResultSchema before returning.
//
// TODO: implement the prompt and structured output call.

import OpenAI from 'openai';
import { AnalysisResultSchema, type ValidatedAnalysisResult } from './schemas';
import type { UserInfo } from '@/types';

export async function analyzeReport(
  pdfText: string,
  userInfo: UserInfo,
  apiKey: string
): Promise<ValidatedAnalysisResult> {
  const client = new OpenAI({ apiKey });

  // TODO: build system + user prompt using pdfText and userInfo
  // TODO: call client.chat.completions.create with:
  //         model: 'gpt-4o'
  //         response_format: { type: 'json_schema', json_schema: { ... } }
  // TODO: parse response.choices[0].message.content as JSON
  // TODO: return AnalysisResultSchema.parse(parsed)

  void client; // remove once implemented
  throw new Error('analyzeReport() not yet implemented — see src/lib/openai.ts');
}
