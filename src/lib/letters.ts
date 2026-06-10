// Builds dispute letters client-side from structured AI analysis data.
//
// buildLetter   — generic fallback letter covering all negative items for a bureau.
// buildCreditorLetter — targeted letter for one creditor × bureau, using AI-provided item data.

import type { AnalysisResult, NegativeItem, UserInfo, Bureau } from '@/types';

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

/**
 * Builds a targeted dispute letter for a specific creditor and bureau.
 * All item details come directly from AI-structured output — no invented data.
 */
export function buildCreditorLetter(
  bureau: Bureau,
  creditor: string,
  items: NegativeItem[],
  userInfo: UserInfo,
  completedAt: string,
): string {
  const date = new Date(completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fullName = `${userInfo.first} ${userInfo.last}`;
  const address = `${userInfo.address}\n${userInfo.city}, ${userInfo.state} ${userInfo.zip}`;

  // Collect all unique laws cited across the items for this creditor
  const allLaws = Array.from(new Set(items.flatMap((i) => i.laws)));
  const lawsCitation = allLaws.length > 0 ? allLaws.join(', ') : 'FCRA § 1681i';

  const itemBlocks = items
    .map((item, idx) => {
      const reasonsText = item.reasons.map((r) => `   • ${r}`).join('\n');
      return (
        `${idx + 1}. Account: ${item.accountNumber}  |  Type: ${item.type}\n` +
        `   Status reported: ${item.status} (${item.dateReported})\n` +
        `   Balance: ${item.balance}\n` +
        `   Grounds for dispute:\n${reasonsText}\n` +
        `   Recommended action: ${item.recommendedAction}`
      );
    })
    .join('\n\n');

  return `${date}

${fullName}
${address}
${userInfo.dob ? `Date of Birth: ${userInfo.dob}\n` : ''}${userInfo.ssn ? `SSN: ${userInfo.ssn}\n` : ''}
${bureau.name}
${bureau.addr}

RE: Formal Dispute — ${creditor}

To Whom It May Concern:

I am writing to formally dispute the following account(s) furnished by ${creditor} on my ${bureau.name} credit report. Pursuant to the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., I have the right to an accurate credit file. After reviewing my report, I have identified the following inaccurate or unverifiable information:

${itemBlocks}

Under ${lawsCitation}, I respectfully request that you conduct a thorough reinvestigation of each item listed above. If any item cannot be verified in full with ${creditor} as the original furnisher, it must be promptly deleted or corrected from my credit file, and I must be provided an updated copy of my report.

Please complete this reinvestigation within 30 days of receipt as required by law and notify me in writing of the outcome. Enclosed are copies (not originals) of documents supporting my identity and this dispute.

Sincerely,

${fullName}`;
}
