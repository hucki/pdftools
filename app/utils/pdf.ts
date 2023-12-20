import { PDFDocument, StandardFonts } from "pdf-lib";

export type PdfAttachment = {
  bytes: ArrayBuffer;
  fileName: string;
  description: string;
  creationDate: string;
  modificationDate: string;
};
async function createPdf(
  recepient: string,
  pdfAttachment: PdfAttachment,
  content: string
) {
  const pdfAttachmentBytes = pdfAttachment?.bytes;
  const fontSize = 20;
  try {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage();
    const { height } = page.getSize();
    page.drawText("Empfänger: " + recepient, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
    });
    page.drawText(content, {
      x: 50,
      y: height - 6 * fontSize,
      size: fontSize,
      font: timesRomanFont,
    });
    // Add the PDF attachment
    if (pdfAttachmentBytes) {
      const pdfToEmbed = await PDFDocument.load(pdfAttachmentBytes);
      const pageIndices = pdfToEmbed.getPageIndices();
      console.log("🍕 pageIndices", pageIndices);
      const pages = await pdfDoc.copyPages(pdfToEmbed, pageIndices);

      for (let i = 0; i < pages.length; i++) {
        pdfDoc.addPage(pages[i]);
      }
    }
    const result = await pdfDoc.save();
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
}

export { createPdf };
