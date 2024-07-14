// import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createPdf } from "../utils/pdf";
import { Form, useFetchers, useRouteLoaderData } from "@remix-run/react";
import { FaxSendResult } from "./fax.send";
import { EnvStatus } from "./fax";

type UploadMetaData = {
  name: string;
  size: number;
  lastModifiedDate: Date;
};

const defaultState = {
  sender: "Mundwerk Logopädische Praxis",
  recipientName: "",
  recipientNumber: "",
  content: "Sehr geehrte Damen und Herren, ...",
};

export default function FaxComposer() {
  const status = useRouteLoaderData<EnvStatus>("routes/fax");
  const fetchers = useFetchers();
  const [sender, setSender] = useState<string>(defaultState.sender);
  const [recipientName, setRecipientName] = useState<string>(
    defaultState.recipientName
  );
  const [recipientNumber, setRecipientNumber] = useState<string>(
    defaultState.recipientNumber
  );
  const [currentSendActionKey, setCurrentSendActionKey] = useState<string>("");
  const [content, setContent] = useState<string>(defaultState.content);
  const [uploadedPdf, setUploadedPdf] = useState<ArrayBuffer | undefined>();
  const [uploadMetaData, setUploadMetaData] = useState<
    UploadMetaData | undefined
  >();
  const [resultingPDF, setResultingPDF] = useState<Uint8Array | undefined>();
  const [resultingPDFBase64, setResultingPDFBase64] = useState<
    string | undefined
  >();
  const now = new Date();
  const today = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate()}`;

  const fileName = today + "_fax-an_" + recipientName.replace(" ", "_");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // as maxFiles: 1 we can safely assume there will be only one file
    const file = acceptedFiles[0];
    if (file) {
      setUploadMetaData({
        name: file.name,
        size: file.size,
        lastModifiedDate: new Date(file.lastModified),
      });
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const { result } = reader;

        if (result && typeof result !== "string") {
          setUploadedPdf(result);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (resultingPDF) setResultingPDF(undefined);
    const field = e.currentTarget.name;
    e.preventDefault();
    if (field === "sender") setSender(e.currentTarget.value);
    if (field === "recipientName") setRecipientName(e.currentTarget.value);
    if (field === "recipientNumber") setRecipientNumber(e.currentTarget.value);
    if (field === "content") setContent(e.currentTarget.value);
  };

  const handleResetForm = () => {
    setSender(defaultState.sender);
    setRecipientName(defaultState.recipientName);
    setRecipientNumber(defaultState.recipientNumber);
    setContent(defaultState.content);
    setUploadedPdf(undefined);
    setUploadMetaData(undefined);
    setResultingPDF(undefined);
    setCurrentSendActionKey("");
  };
  const handleCreatePdf = async () => {
    if (sender && recipientName && uploadedPdf && content) {
      try {
        const result = await createPdf({
          sender,
          recipient: recipientName,
          recipientNumber: recipientNumber,
          pdfAttachment: {
            bytes: uploadedPdf,
            fileName,
            description: "pdfAnhang",
            creationDate: now.toISOString(),
            modificationDate: now.toISOString(),
          },
          content,
        });
        if (result) {
          const { doc, base64string } = result;
          setResultingPDF(doc);
          setResultingPDFBase64(base64string);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const resultingPdfUrl = resultingPDF
    ? URL.createObjectURL(new Blob([resultingPDF], { type: "application/pdf" }))
    : undefined;

  const recipientNumberMatch = recipientNumber.match(/^\+[1-9]\d{1,14}$/);

  const isDisabled =
    !uploadedPdf ||
    !sender.length ||
    !recipientName.length ||
    !recipientNumber.length ||
    !recipientNumberMatch ||
    !content.length;

  useEffect(() => {
    const sendAction = fetchers.find(
      (fetcher) => fetcher.formAction === "/fax/send"
    );
    if (sendAction) {
      setCurrentSendActionKey(sendAction.key);
    }
  }, [fetchers]);

  const currentSendActionResult = fetchers.find(
    (fetcher) => fetcher.key === currentSendActionKey
  )?.data as FaxSendResult;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div>
        <div className="grid grid-rows-1 m-4 gap-2">
          <div className="p-4 bg-slate-100 border border-dashed border-spacing-1 grid grid-rows-1gap-2">
            <h2 className="text-xl mb-2">1. Deckblatt ausfüllen</h2>
            <label className="text-slate-500">
              Von (Name):{" "}
              <input
                className="border rounded-md p-1 w-full text-black"
                type="text"
                name="sender"
                value={sender}
                onChange={handleChange}
              />
            </label>
            <label className="text-slate-500">
              An (Name):{" "}
              <input
                className="border rounded-md p-1 w-full text-black"
                type="text"
                name="recipientName"
                value={recipientName}
                onChange={handleChange}
              />
            </label>
            <label className="text-slate-500">
              An (<span className="font-bold">Faxnummer</span>):{" "}
              <input
                placeholder="+492931...."
                className="border rounded-md p-1 w-full text-black"
                type="tel"
                required
                title="Faxnummer im Format +49293112345"
                pattern="^\+[1-9]\d{1,14}$"
                name="recipientNumber"
                value={recipientNumber}
                onChange={handleChange}
              />
              {!recipientNumberMatch && (
                <span className="text-red-500 p-1 italic text-sm">
                  Bitte Faxnummer im Format +49293112345 angeben{" "}
                </span>
              )}
            </label>
            <label className="text-slate-500">
              Anschreiben:{" "}
              <textarea
                className="border rounded-md p-1 w-full text-black"
                name="content"
                value={content}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="p-4 bg-slate-100 border border-dashed border-spacing-1 grid grid-rows-1gap-2">
            <h2 className="text-xl">2. Anhang hochladen</h2>
            <div
              className="p-4 m-4 bg-lime-100 border border-dashed border-spacing-1 border-lime400 cursor-copy"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-slate-500">
                  Bitte das zu faxende PDF hier ablegen ...
                </p>
              ) : (
                <p className="text-slate-500">
                  Bitte das zu faxende PDF hier ablegen, oder klicken um ein PDF
                  auszuwählen
                </p>
              )}
            </div>
            {uploadMetaData ? (
              <div className="file p-4 font-mono text-xs bg-green-100 border border-green-500">
                ✅ Anhang hochgeladen: <b>{uploadMetaData?.name}</b> (
                {uploadMetaData?.lastModifiedDate.toLocaleString()} -{" "}
                {uploadMetaData?.size} byte){" "}
              </div>
            ) : null}
          </div>
          <div className="p-4 bg-slate-100 border border-dashed border-spacing-1 grid grid-rows-1gap-2">
            <h2 className="text-xl">3. Deckblatt + Anhang kombinieren</h2>
            <button
              disabled={isDisabled}
              onClick={handleCreatePdf}
              className={`rounded-md p-2 m-2 ${
                isDisabled
                  ? "bg-orange-100 text-slate-500 cursor-not-allowed"
                  : "bg-orange-400 text-slate-950 cursor-pointer"
              }`}
            >
              🛠️ FAX erzeugen
            </button>
            {isDisabled && (
              <span className="text-red-500 p-1 italic text-sm">
                Bitte erst Deckblatt ausfüllen und Anhang hochladen{" "}
              </span>
            )}
            {resultingPdfUrl && (
              <div className="file p-4 font-mono text-xs bg-green-100 border border-green-500">
                ✅ FAX erzeugt: <b>{fileName + ".pdf"}</b> (s. Vorschau){" "}
                <a
                  href={resultingPdfUrl}
                  download={fileName + ".pdf"}
                  className="rounded-md p-2 m-2 bg-green-500 text-slate-950 cursor-pointer text-center"
                >
                  💾
                </a>
              </div>
            )}
          </div>
          {status === "ok" && (
            <div className="p-4 bg-slate-100 border border-dashed border-spacing-1 grid grid-rows-1gap-2">
              <h2 className="text-xl">4. Fax versenden</h2>
              {recipientNumberMatch &&
                resultingPdfUrl &&
                resultingPDFBase64 && (
                  <Form method="POST" action="/fax/send" navigate={false}>
                    <input
                      type="hidden"
                      name="recipientName"
                      value={recipientName}
                    />
                    <input
                      type="hidden"
                      name="recipientNumber"
                      value={recipientNumber}
                    />
                    <input
                      type="hidden"
                      name="fileName"
                      value={fileName + ".pdf"}
                    />
                    <input
                      type="hidden"
                      name="pdf"
                      value={resultingPDFBase64}
                    />
                    <button
                      // disabled={!!currentSendActionResult}
                      className={`rounded-md p-2 m-2 ${
                        currentSendActionResult
                          ? "bg-gray-200 text-slate-500 italic cursor-not-allowed"
                          : "bg-teal-500 text-slate-950 cursor-pointer"
                      }  text-center`}
                      type="submit"
                    >
                      📨 erzeugtes Fax versenden
                    </button>
                  </Form>
                )}
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
            </div>
          )}
          {resultingPdfUrl && (
            <button
              onClick={handleResetForm}
              className="rounded-md p-2 bg-orange-300 text-slate-950 cursor-pointer text-center justify-self-end"
            >
              ♻️ alles zurücksetzen
            </button>
          )}
        </div>
      </div>
      {resultingPdfUrl && (
        <div className="p-4 m-4 bg-slate-100 border border-dashed border-spacing-1 ">
          <h2 className="text-xl">Vorschau</h2>
          <embed
            className="m-4 w-11/12 h-full"
            src={resultingPdfUrl}
            type="application/pdf"
          ></embed>
        </div>
      )}
    </div>
  );
}
