import { Form } from "@remix-run/react";
import { Container } from "../atoms/Container";
import { TactileButton } from "../atoms/Button";

interface FaxPreviewProps {
  recipientName: string;
  recipientNumber: string;
  fileName: string;
  resultingPDFBase64?: string;
  resultingPdfUrl?: string;
  canSendFax: boolean;
  currentSendActionResult: {
    result: "success" | "error";
    message: string;
  } | null;
}

export const FaxPreview = ({
  recipientName,
  recipientNumber,
  fileName,
  resultingPDFBase64,
  resultingPdfUrl,
  currentSendActionResult,
  canSendFax,
}: FaxPreviewProps) => {
  return (
    <Container className="h-full overflow-y-auto">
      <div className="h-fit">
        {canSendFax && (
          <>
            <Form method="POST" action="/fax/send" navigate={false}>
              <input type="hidden" name="recipientName" value={recipientName} />
              <input
                type="hidden"
                name="recipientNumber"
                value={recipientNumber}
              />
              <input type="hidden" name="fileName" value={fileName + ".pdf"} />
              <input type="hidden" name="pdf" value={resultingPDFBase64} />
              <TactileButton
                label="📠 Fax versenden"
                type="submit"
                color="green"
              />
            </Form>
            {currentSendActionResult?.result && (
              <div
                className={`p-4 border file font-mono text-xs ${
                  currentSendActionResult.result === "success"
                    ? "bg-green-100 border border-green-500"
                    : "bg-red-100 border border-red-500"
                } `}
              >
                {currentSendActionResult.result === "success" ? "✅ " : "❌ "}
                {currentSendActionResult.message}
              </div>
            )}
          </>
        )}
      </div>
      {!resultingPdfUrl && (
        <>
          <h2 className="text-xl font-semibold text-gray-800">Vorschau </h2>
          <h3>(erscheint hier sobald das Fax erzeugt wurde)</h3>
        </>
      )}
      <div className="h-full">
        {resultingPdfUrl && (
          <>
            <a
              href={resultingPdfUrl}
              download={fileName + ".pdf"}
              className="rounded-md  text-xs font-mono italic text-slate-950 hover:underline cursor-pointer text-center"
            >
              📄<b>{fileName + ".pdf"}</b>
            </a>
            <embed
              className="h-96 w-full"
              src={resultingPdfUrl}
              type="application/pdf"
            ></embed>
          </>
        )}
      </div>
    </Container>
  );
};
