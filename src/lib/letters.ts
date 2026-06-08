// Builds a dispute letter client-side from structured analysis data.
//
// In the real app the AI returns fully-written letter bodies in result.disputeLetters[].
// This function is a fallback template used if an AI-generated body is missing for a bureau.

import type { AnalysisResult, UserInfo, Bureau } from '@/types';

export function buildLetter(
  bureau: Bureau,
  result: AnalysisResult,
  userInfo: UserInfo
): string {
  const date = new Date(result.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const items = result.negativeItems
    .map(
      (n, i) =>
        `${i + 1}. ${n.creditor} — Account #${n.accountNumber}\n` +
        `   Type: ${n.type}   |   Reported Status: ${n.status} (${n.dateReported})\n` +
        `   Reason for dispute: ${n.reasons.join('; ')}.`
    )
    .join('\n\n');

  const fullName = `${userInfo.first} ${userInfo.last}`;
  const address = `${userInfo.address}\n${userInfo.city}, ${userInfo.state} ${userInfo.zip}`;

  return `${date}

${fullName}
${address}

${bureau.name}
${bureau.addr}

RE: Formal Dispute of Inaccurate Credit Information

To Whom It May Concern:

I am writing to formally dispute the following items appearing on my ${bureau.name} credit report. Under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681, I am entitled to a credit file that is accurate, complete, and verifiable. After reviewing my report, I have identified the following inaccuracies:

${items}

I respectfully request that you conduct a reasonable reinvestigation of each item above as required under FCRA § 1681i. If any item cannot be fully verified with the original furnisher, it must be promptly deleted or corrected, and an updated copy of my credit report must be provided to me.

Please complete this reinvestigation within 30 days of receipt of this letter and notify me in writing of the results. Enclosed are copies (not originals) of documents supporting my identity and this dispute.

Sincerely,

${fullName}`;
}
