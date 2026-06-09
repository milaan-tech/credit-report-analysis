// Client-side PDF text extraction using pdfjs-dist.
// Runs entirely in the browser — the raw PDF file never leaves the client.
// Only the extracted text string is sent to /api/analyze,
// which sidesteps Vercel's 4.5 MB serverless body limit.

export async function extractTextFromPDF(file: File): Promise<string> {
  // Dynamic import keeps this out of the server bundle
  const pdfjsLib = await import('pdfjs-dist');

  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    pageTexts.push(pageText);
  }

  return pageTexts.join('\n\n');
}
