import { PDFDocument } from "pdf-lib";
import { createPrescriptionCorrectionPDF } from "../documents/PrescriptionCorrectionCover";

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
  recipient: string;
  recipientNumber: string;
  content: string;
  patientName: string;
  prescriptionDate: string;
};

export const fontSize = 16;

async function createPdf({ coverPage, pdfAttachment }: CreatePdfProps) {
  coverPage;
  const pdfAttachmentBytes = pdfAttachment?.bytes;
  try {
    const pdfDoc = await PDFDocument.create();
    if (coverPage) {
      const {
        recipient,
        recipientNumber,
        content,
        patientName,
        prescriptionDate,
      } = coverPage;
      createPrescriptionCorrectionPDF({
        patientName,
        prescriptionDate,
        correctionText: content,
        recipientName: recipient,
        recipientNumber: recipientNumber,
        pdfDoc,
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
