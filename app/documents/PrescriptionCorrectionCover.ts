import {
  PDFDocument,
  PageSizes,
  StandardFonts,
  layoutMultilineText,
  TextAlignment,
  rgb,
  PDFFont,
} from "pdf-lib";

type CreatePrescriptionCorrectionPDFProps = {
  recipientNumber: string;
  recipientName: string;
  patientName: string;
  prescriptionDate: string;
  correctionText: string;
  pdfDoc: PDFDocument;
};

const mundwerkLogo = `
<svg width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(11.5986,0,0,11.5986,-2554.67,46.343)">
        <path d="M403.554,0.186C502.478,0.186 582.67,80.378 582.67,179.302C582.67,278.226 502.478,358.417 403.554,358.417C304.63,358.417 224.439,278.226 224.439,179.302C224.439,80.378 304.63,0.186 403.554,0.186ZM403.554,28.976C320.531,28.976 253.229,96.278 253.229,179.302C253.229,262.325 320.531,329.628 403.554,329.628C486.578,329.628 553.88,262.325 553.88,179.302C553.88,96.278 486.578,28.976 403.554,28.976Z" style="fill:rgb(244,121,32);fill-rule:nonzero;"/>
        <path d="M529.006,193.629C512.413,255.389 474.573,304.147 403.554,304.147L403.13,304.147C332.112,304.147 294.271,255.389 277.679,193.629L529.006,193.629Z" style="fill:rgb(244,121,32);fill-rule:nonzero;"/>
        <path d="M317.715,222.433C333.517,253.82 366.035,275.343 403.554,275.343C441.073,275.343 473.592,253.82 489.394,222.433L317.715,222.433Z" style="fill:white;fill-rule:nonzero;"/>
    </g>
</svg>
`;
export const createPrescriptionCorrectionPDF = async ({
  patientName,
  prescriptionDate,
  correctionText,
  recipientName,
  recipientNumber,
  pdfDoc,
}: CreatePrescriptionCorrectionPDFProps) => {
  const page = pdfDoc.addPage(PageSizes.A4);
  const offsetY = 800;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontMonoBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;

  const printMultilineText = (
    content: string,
    linePosition: number,
    font: PDFFont
  ) => {
    const multiLineContent = layoutMultilineText(content, {
      alignment: TextAlignment.Left,
      font: font,
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
        font: font,
      });
    });
    return multiLineContent.lines.length;
  };

  let linePosition = offsetY;
  page.drawText("an:", {
    x: 50,
    y: linePosition,
    size: fontSize,
    font,
  });
  page.drawText(recipientName, {
    x: 100,
    y: linePosition,
    size: fontSize,
    font: fontBold,
  });
  linePosition -= 20;

  page.drawText(recipientNumber, {
    x: 100,
    y: linePosition,
    size: fontSize,
    font: fontMono,
  });
  linePosition -= 20 * 2;

  // Title
  page.drawText("Korrektur der Verordnung notwendig", {
    x: 50,
    y: linePosition,
    size: 16,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  linePosition -= 20 * 2;
  // Introduction
  page.drawText(`Sehr geehrte Ärzteschaft,`, {
    x: 50,
    y: linePosition,
    size: fontSize,
    font: font,
  });
  linePosition -= 20 * 2;

  page.drawText(`wir bedanken uns für die Verordnung für`, {
    x: 50,
    y: linePosition,
    size: fontSize,
    font: font,
  });
  linePosition -= 20;
  // Patient Name and Prescription Date
  page.drawText(`${patientName} vom ${prescriptionDate}`, {
    x: 50,
    y: linePosition,
    size: fontSize,
    font: fontMonoBold,
  });
  linePosition -= 20 * 2;

  // Correction Instructions Header
  const correctionHeaderLines = printMultilineText(
    "Damit diese Verordnung die Regeln des Heilmittelkatalogs erfüllt, müssen folgende Angaben korrigiert werden:",
    linePosition,
    font
  );
  linePosition -= 20 * correctionHeaderLines;

  // Correction Text
  const correctionLines = printMultilineText(
    correctionText,
    linePosition,
    fontMonoBold
  );
  linePosition -= 20 * (correctionLines + 1.5);

  // Add a light blue box with rounded corners around the correction instructions
  const instructions = [
    "1. Original-Angabe leserlich durchstreichen (kein Tipp-Ex),",
    "2. Korrektur-Angaben lesbar daneben notieren und",
    "3. diese mit Änderungsdatum und Ihrer Unterschrift bestätigen.",
    "Wichtig: Der Praxisstempel ist ausdrücklich nicht notwendig.",
  ];
  const boxX = 50;
  const boxInnerX = 60;
  const contentHeight = (instructions.length + 1.5) * 15;
  const boxY = linePosition - contentHeight;
  const boxWidth = 500;
  const boxHeight = contentHeight + 20;

  // Draw the light blue rounded box (background for the instructions)
  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: rgb(0.678, 0.847, 0.902), // Light blue color
  });

  // Instructions for correction
  page.drawText("So geht die vertragskonforme Korrektur:", {
    x: boxInnerX,
    y: linePosition,
    size: fontSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  instructions.forEach((line, index) => {
    page.drawText(line, {
      x: boxInnerX,
      y: linePosition - 20 - index * 15,
      size: fontSize,
      font: font,
    });
  });
  linePosition -= boxHeight;

  // Closing Text
  const closingLines = printMultilineText(
    "Wir bedanken uns für die professionelle Zusammenarbeit und sind für Rückfragen telefonisch für Sie erreichbar.",
    linePosition,
    font
  );
  linePosition -= 20 * closingLines;

  page.drawText("Viele Grüße", {
    x: 50,
    y: linePosition,
    size: fontSize,
    font: font,
  });
  linePosition -= 20 * 2;

  // Signature
  page.drawSvgPath(mundwerkLogo, {
    x: 50,
    y: linePosition,
    color: rgb(0.5, 0.5, 0.5),
    scale: 0.125,
  });
  const svgWidth = 100;
  page.drawText("Mundwerk Logopädische Praxis Wette & Huckschlag", {
    x: 50 + svgWidth,
    y: linePosition,
    size: fontSize,
    font: fontMonoBold,
  });
  linePosition -= 15;

  page.drawText("Neumarkt 7 - 59821 Arnsberg", {
    x: 50 + svgWidth,
    y: linePosition,
    size: fontSize,
    font: fontMono,
  });
  linePosition -= 15;

  page.drawText("Stembergstr. 38-40 - 59755 Arnsberg", {
    x: 50 + svgWidth,
    y: linePosition,
    size: fontSize,
    font: fontMono,
  });
  linePosition -= 15;

  page.drawText("Tel.: 02931 78 77 38", {
    x: 50 + svgWidth,
    y: linePosition,
    size: fontSize,
    font: fontMono,
  });
  linePosition -= 15;

  page.drawText("Fax.: 02931 78 77 37", {
    x: 50 + svgWidth,
    y: linePosition,
    size: fontSize,
    font: fontMono,
  });
  linePosition -= 15;

  return pdfDoc;
};
