import {
  PDFDocument,
  StandardFonts,
  TextAlignment,
  layoutMultilineText,
} from "pdf-lib";

export type PdfAttachment = {
  bytes: ArrayBuffer;
  fileName: string;
  description: string;
  creationDate: string;
  modificationDate: string;
};

type CreatePdfProps = {
  coverPage?: CoverPage;
  pdfAttachment: PdfAttachment;
};

export type CoverPage = {
  sender: string;
  senderNumber: string;
  recipient: string;
  recipientNumber: string;
  content: string;
};

async function createPdf({ coverPage, pdfAttachment }: CreatePdfProps) {
  coverPage;
  const pdfAttachmentBytes = pdfAttachment?.bytes;
  const fontSize = 16;
  try {
    const pdfDoc = await PDFDocument.create();
    if (coverPage) {
      const { sender, senderNumber, recipient, recipientNumber, content } =
        coverPage;

      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const monospacedBoldFont = await pdfDoc.embedFont(
        StandardFonts.CourierBold
      );
      const page = pdfDoc.addPage();
      const { height } = page.getSize();
      let linePosition: number = height - 4 * fontSize;
      const nextline = (fontSize: number) => {
        linePosition = linePosition - fontSize;
      };
      page.drawText("von:", {
        x: 50,
        y: linePosition,
        size: fontSize,
        font: timesRomanFont,
      });
      page.drawText(sender, {
        x: 100,
        y: linePosition,
        size: fontSize,
        font: timesRomanFont,
      });
      nextline(fontSize);
      page.drawText(senderNumber, {
        x: 100,
        y: linePosition,
        size: fontSize,
        font: monospacedBoldFont,
      });
      nextline(fontSize);
      nextline(fontSize);
      page.drawText("an:", {
        x: 50,
        y: linePosition,
        size: fontSize,
        font: timesRomanFont,
      });
      page.drawText(recipient, {
        x: 100,
        y: linePosition,
        size: fontSize,
        font: timesRomanFont,
      });
      nextline(fontSize);
      page.drawText(recipientNumber, {
        x: 100,
        y: linePosition,
        size: fontSize,
        font: monospacedBoldFont,
      });
      nextline(fontSize);
      nextline(fontSize);
      nextline(fontSize);
      const multiLineContent = layoutMultilineText(content, {
        alignment: TextAlignment.Left,
        font: timesRomanFont,
        fontSize,
        bounds: {
          x: 50,
          y: linePosition,
          width: 500,
          height: 500,
        },
      });
      multiLineContent.lines.forEach((line, index) => {
        page.drawText(line.text, {
          x: 50,
          y: linePosition - index * fontSize * 1.2,
          size: fontSize,
          font: timesRomanFont,
        });
      });
    }
    // Add the PDF attachment
    if (pdfAttachmentBytes) {
      const pdfToEmbed = await PDFDocument.load(pdfAttachmentBytes);
      const pageIndices = pdfToEmbed.getPageIndices();
      const pages = await pdfDoc.copyPages(pdfToEmbed, pageIndices);

      for (let i = 0; i < pages.length; i++) {
        pdfDoc.addPage(pages[i]);
      }
    }
    const result = {
      doc: await pdfDoc.save(),
      base64string: await pdfDoc.saveAsBase64(),
    };
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
}
async function createEticketPdf(ticketDocBytes: ArrayBuffer) {
  try {
    const pdfDoc = await PDFDocument.create();
    // Add the PDF attachment
    if (ticketDocBytes) {
      const ticketDoc = await PDFDocument.load(ticketDocBytes, {
        ignoreEncryption: true,
      });
      const pageCount = ticketDoc.getPageCount();
      const pages = [];
      for (let i = 0; i < pageCount; i++) {
        if (i === 0 || i === 3) {
          pages.push(pdfDoc.addPage());
        }
        const ticket = await pdfDoc.embedPage(ticketDoc.getPages()[i], {
          left: 55,
          bottom: 485,
          right: 300,
          top: 575,
        });
        const ticketDimensions = ticket.scale(1);
        const page = pages[pages.length - 1];
        page.drawPage(ticket, {
          ...ticketDimensions,
          x: page.getWidth() / 2 - ticketDimensions.width / 2,
          y: page.getHeight() / 2 - ticketDimensions.height / 2 - 50,
        });
      }
    }
    const result = await pdfDoc.save();
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
}

export { createPdf, createEticketPdf };
