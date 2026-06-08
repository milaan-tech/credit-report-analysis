import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResultSchema } from '@/lib/schemas';
// import { analyzeReport } from '@/lib/openai';  // uncomment when implemented

// POST /api/analyze
//
// Request body:
//   { pdfText: string, userInfo: UserInfo, apiKey: string }
//
// Success response:
//   { success: true, result: AnalysisResult }
//
// Error response:
//   { success: false, error: string }
//
// NOTE TO BACKEND DEVELOPER:
//   1. Implement analyzeReport() in src/lib/openai.ts
//   2. It receives pdfText + userInfo + apiKey, calls gpt-4o with structured output,
//      and returns a ValidatedAnalysisResult (already Zod-validated inside that function).
//   3. Uncomment the import + call below and remove the 501 stub.
//   4. Never log pdfText, userInfo, or apiKey server-side.
//   5. The apiKey is used once for the OpenAI call and never stored or returned.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pdfText, userInfo, apiKey } = body as {
      pdfText: string;
      userInfo: Record<string, string>;
      apiKey: string;
    };

    if (!pdfText || !userInfo || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: pdfText, userInfo, apiKey.' },
        { status: 400 }
      );
    }

    // TODO: uncomment once analyzeReport() is implemented in src/lib/openai.ts
    // const raw = await analyzeReport(pdfText, userInfo as UserInfo, apiKey);
    // const validated = AnalysisResultSchema.parse(raw);
    // const result = { ...validated, completedAt: new Date().toISOString() };
    // return NextResponse.json({ success: true, result });

    void AnalysisResultSchema; // remove once uncommented above
    return NextResponse.json(
      { success: false, error: 'AI analysis not yet implemented.' },
      { status: 501 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
