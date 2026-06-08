# Product Specification

## CSS Approach

Custom design system via `src/app/globals.css` (not Tailwind). All styling uses CSS variables and utility classes defined in that file. Do not add Tailwind.

---

## PDF Extraction

PDF text is extracted **client-side** using `pdfjs-dist` before the API call. Only the extracted text string is sent to `/api/analyze` — the raw PDF file never leaves the browser. This avoids Vercel's 4.5MB serverless body limit.

---

## Product Name

Credit Report AI Analyzer

---

## Overview

A lightweight AI-powered application that analyzes a credit report and generates actionable dispute recommendations.

The application is completely stateless.

No user information is stored.

No reports are stored.

No authentication exists.

All data is discarded after page refresh.

---

## Page Structure

### Page 1

Upload & Analyze

Purpose:

Collect information and upload report.

Components:

#### Personal Information

- First Name
- Last Name
- Date Of Birth
- Social Security Number
- Address

#### OpenAI API Key

Password field.

#### Credit Report Upload

Requirements:

- PDF only
- Drag and drop support
- Maximum 25MB

#### Analyze Button

Begins analysis workflow.

---

## Processing Flow

1. Upload PDF
2. Extract text
3. Send report text to AI
4. Receive structured JSON
5. Navigate to Results Dashboard

---

### Page 2

Results Dashboard

Purpose:

Display all AI findings in a single location.

---

## Section 1

Credit Overview

Display:

- Credit scores found in report
- Overall assessment

Example:

- Experian Score
- Equifax Score
- TransUnion Score
- Overall Rating
- Summary paragraph

---

## Section 2

Strengths

Examples:

- Low utilization
- Long credit history
- No bankruptcies

---

## Section 3

Weaknesses

Examples:

- Collections
- Charge-offs
- Late payments

---

## Section 4

Negative Accounts

For each item display:

- Account Name
- Account Type
- Status
- Balance
- Reason Flagged
- Applicable Laws
- Recommended Action

---

## Section 5

Action Plan

AI-generated prioritized roadmap.

Example:

Priority 1: Dispute Collection Account

Priority 2: Remove Incorrect Address

Priority 3: Challenge Inquiry

---

## Section 6

Dispute Letters

Tabs:

- Experian
- Equifax
- TransUnion

Each tab includes:

- Generated Letter
- Copy Button
- Download Button
- Print Button

---

## AI Response Schema

Updated to match the dashboard design. Validated by Zod in `src/lib/schemas.ts` before returning to client.

```typescript
{
  summary: string;
  scores: {
    bureau: string;
    score: number | null;
    rating: string;                   // "Poor" | "Fair" | "Good" | "Very Good" | "Exceptional"
  }[];
  overall: {
    rating: string;
    health: number;                   // 0–100, drives the donut chart
    summary: string;
  };
  strengths: string[];
  weaknesses: string[];
  negativeItems: {
    priority: "High" | "Medium" | "Low";
    creditor: string;
    accountNumber: string;
    type: string;
    balance: string;
    status: string;
    dateReported: string;
    reasons: string[];
    impact: "High" | "Medium" | "Low";
    impactPoints: string;             // e.g. "40–70 pts"
    laws: string[];
    recommendedAction: string;
  }[];
  actionPlan: {
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low" | "Positive";
  }[];
  stats: {
    totalAccounts: number;
    negativeItemCount: number;
    latePayments: number;
    hardInquiries: number;
    utilization: string;              // e.g. "18%"
    estimatedImprovement: string;     // e.g. "50–120"
  };
  disputeLetters: {
    bureau: string;
    body: string;                     // full personalized letter text from AI
  }[];
}
```

---

## Non-Functional Requirements

No authentication.

No database.

No persistence.

No analytics.

No tracking.

Responsive design.

Mobile friendly.

Fast loading.

Professional appearance.

Single-user session only.
