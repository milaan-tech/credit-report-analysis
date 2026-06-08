# Credit Report AI Analyzer

## Overview

Stateless two-page MVP: user uploads a credit report PDF + personal details + OpenAI key, receives AI-generated analysis and dispute letters. No accounts, no persistence — refresh resets everything.

**Page 1** `/` — personal info form, PDF upload, API key entry, Analyze button  
**Page 2** `/results` — credit summary, negative items, dispute opportunities, dispute letters

---

## Tech Stack & Commands

Stack: Next.js 14 App Router · React · TypeScript (strict) · Custom CSS (`src/app/globals.css` — no Tailwind)  
PDF: `pdfjs-dist` (client-side extraction, avoids Vercel 4.5MB limit) · AI: OpenAI `gpt-4o` · Deploy: Vercel

```bash
npm run dev        # localhost:3000
npm run build      # production build
npm run lint       # ESLint
npx tsc --noEmit   # type-check
vercel --prod      # deploy
```

---

## Architecture

```
src/
  app/
    globals.css                     # Full design system (CSS variables, base classes)
    layout.tsx                      # Root layout — imports globals.css, sets metadata
    page.tsx                        # Page 1: Upload & Analyze
    results/
      page.tsx                      # Page 2: Results Dashboard
    api/
      analyze/route.ts              # POST: receive text + userInfo → call gpt-4o → return JSON

  components/
    ui/
      Icon.tsx                      # Lucide-style SVG icon system
      Brand.tsx                     # BrandLogo + Brand header component
      BureauMark.tsx                # Colored bureau avatar (Experian / Equifax / TransUnion)
    upload/
      UploadArea.tsx                # Drag-and-drop PDF upload zone
      PersonalInfoForm.tsx          # Section 1: name, DOB, SSN, address
      ApiKeyInput.tsx               # Section 2: OpenAI API key field
    dashboard/
      CreditOverview.tsx            # Scores (ScoreCard + MiniGauge) + Donut + overall assessment
      StrengthsWeaknesses.tsx       # Side-by-side strengths / weaknesses cards
      NegativeItems.tsx             # Expandable 7-column negative accounts table
      ActionPlan.tsx                # Prioritized action plan list
      SummaryCard.tsx               # Stats table + estimated improvement potential
      DisputeLetters.tsx            # Bureau letter cards + LetterModal (copy/download/print)

  lib/
    openai.ts                       # gpt-4o client + structured prompt logic
    pdf.ts                          # pdfjs-dist client-side text extractor
    schemas.ts                      # Zod schemas for all AI response shapes
    letters.ts                      # buildLetter() helper
    bureaus.ts                      # BUREAUS constant (name, color, address per bureau)

  types/
    index.ts                        # All shared TypeScript interfaces

  context/
    AnalysisContext.tsx             # React context: passes AnalysisResult Page 1 → Page 2
```

State lives in React only (`useState`, `useContext`). No localStorage, cookies, or DB.

---

## Hard Rules

IMPORTANT: The OpenAI API key is sent over HTTPS to the API route, used once to call OpenAI, and never logged, stored, or returned in any response.

IMPORTANT: SSN and personal data are never logged server-side. Used only to populate dispute letter bodies, then discarded with the request.

IMPORTANT: All AI responses must validate against a Zod schema in `src/lib/schemas.ts` before being returned to the client. If validation fails, return `{ success: false, error: string }` — never attempt to use partial output.

IMPORTANT: This app is stateless. No database, no session, no localStorage, no cookies. Any requirement that implies persistence is out of scope for v1.

IMPORTANT: Never parse free-form AI text. Always use `response_format: { type: "json_schema" }` on every OpenAI call and validate the result with Zod.

---

## AI Pipeline

1. Client extracts PDF text via `pdfjs-dist` (browser, no file upload to server)
2. Client POSTs `{ pdfText: string, userInfo: UserInfo, apiKey: string }` to `/api/analyze`
3. Server calls `gpt-4o` with `response_format: { type: "json_schema" }` to enforce structure
4. Server validates response with Zod — throws on any schema mismatch
5. Typed `AnalysisResult` returned to client → stored in `AnalysisContext` → `/results` reads it

**Target schema shape** (canonical definition lives in `src/lib/schemas.ts`):
```ts
{
  summary: string
  scores: { bureau: string; score: number | null; rating: string }[]
  overall: { rating: string; health: number; summary: string }
  strengths: string[]
  weaknesses: string[]
  negativeItems: {
    priority: "High" | "Medium" | "Low"
    creditor: string; accountNumber: string; type: string
    balance: string; status: string; dateReported: string
    reasons: string[]; impact: "High" | "Medium" | "Low"
    impactPoints: string; laws: string[]; recommendedAction: string
  }[]
  actionPlan: { title: string; description: string; impact: "High" | "Medium" | "Low" | "Positive" }[]
  stats: {
    totalAccounts: number; negativeItemCount: number; latePayments: number
    hardInquiries: number; utilization: string; estimatedImprovement: string
  }
  disputeLetters: { bureau: string; body: string }[]
}
```

---

## Out of Scope (v1)

Authentication · database · user accounts · payments · dispute tracking · CRM · email delivery · any persistence layer.

---

## UI

Professional financial software aesthetic. Custom CSS only via `src/app/globals.css` — no Tailwind, no additional `.css` files.  
Loading states are required for the Analyze step (PDF extraction + AI call can take 10–30s).  
Never expose raw errors or stack traces to the user — show plain-English messages only.  
Dispute letters must support: copy to clipboard · browser print · download as `.txt`.
