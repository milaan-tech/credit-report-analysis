import { z } from 'zod';

// All AI responses are validated against AnalysisResultSchema before being
// returned to the client. If validation fails, return { success: false, error }.
// Never attempt to use partial or unvalidated output.
//
// NOTE: `completedAt` is NOT in this schema — it is stamped server-side in the
// API route after a successful AI response, then merged into the final result.

const CreditScoreSchema = z.object({
  bureau: z.string(),
  score: z.number().nullable(),
  rating: z.string(),
});

const NegativeItemSchema = z.object({
  priority: z.enum(['High', 'Medium', 'Low']),
  creditor: z.string(),
  accountNumber: z.string(),
  type: z.string(),
  balance: z.string(),
  status: z.string(),
  dateReported: z.string(),
  reasons: z.array(z.string()),
  impact: z.enum(['High', 'Medium', 'Low']),
  impactPoints: z.string(),
  laws: z.array(z.string()),
  recommendedAction: z.string(),
});

const ActionItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  impact: z.enum(['High', 'Medium', 'Low', 'Positive']),
});

const DisputeLetterSchema = z.object({
  bureau: z.string(),
  body: z.string(),
});

export const AnalysisResultSchema = z.object({
  summary: z.string(),
  scores: z.array(CreditScoreSchema),
  overall: z.object({
    rating: z.string(),
    health: z.number().min(0).max(100),
    summary: z.string(),
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  negativeItems: z.array(NegativeItemSchema),
  actionPlan: z.array(ActionItemSchema),
  stats: z.object({
    totalAccounts: z.number(),
    negativeItemCount: z.number(),
    latePayments: z.number(),
    hardInquiries: z.number(),
    utilization: z.string(),
    estimatedImprovement: z.string(),
  }),
  disputeLetters: z.array(DisputeLetterSchema),
});

export type ValidatedAnalysisResult = z.infer<typeof AnalysisResultSchema>;
