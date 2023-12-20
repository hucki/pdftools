import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createPdf } from "../utils/pdf";

type UploadMetaData = {
  name: string;
  size: number;
  lastModifiedDate: Date;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const recepient = String(formData.get("recepient"));

  type Errors =
    | {
        [key: string]: string;
      }
    | undefined;
  const errors: Errors = {};

  if (!recepient.length) {
    errors["recepient"] = "has to have a recepient";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  // Redirect if validation is successful
  return redirect("/fax-composer/fax");
}

export default function FaxComposer() {
  const [recepient, setRecepient] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [uploadedPdf, setUploadedPdf] = useState<ArrayBuffer | undefined>();
  const [uploadMetaData, setUploadMetaData] = useState<
    UploadMetaData | undefined
  >();
  const [resultingPDF, setResultingPDF] = useState<Uint8Array | undefined>();

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
      console.log("🍕", { file });
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
    if (field === "recepient") setRecepient(e.currentTarget.value);
    if (field === "content") setContent(e.currentTarget.value);
  };

  const handleCreatePdf = async () => {
    if (recepient && uploadedPdf && content) {
      try {
        const doc = await createPdf(
          recepient,
          {
            bytes: uploadedPdf,
            fileName: "datei.pdf",
            description: "pdfAnhang",
            creationDate: "01.01.1970",
            modificationDate: "01.01.1970",
          },
          content
        );
        setResultingPDF(doc);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const resultingPdfUrl = resultingPDF
    ? URL.createObjectURL(new Blob([resultingPDF], { type: "application/pdf" }))
    : undefined;

  const isDisabled = !uploadedPdf || !recepient?.length;

  return (
    <div className="grid grid-cols-2">
      <div>
        <div
          className="p-4 m-4 bg-slate-100 border border-dashed border-spacing-1"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-slate-400">
              Bitte das zu faxende PDF hier ablegen ...
            </p>
          ) : (
            <p className="text-slate-400">
              Bitte das zu faxende PDF hier ablegen, oder klicken um eine Datei
              auszuwählen
            </p>
          )}
        </div>
        {uploadMetaData ? (
          <div className="file m-4 font-mono text-xs">
            Fax: <b>{uploadMetaData?.name}</b> (
            {uploadMetaData?.lastModifiedDate.toLocaleString()} -{" "}
            {uploadMetaData?.size} byte){" "}
          </div>
        ) : null}
        <div className="grid grid-rows-1 m-4 gap-2">
          <label>
            Empfänger:{" "}
            <input
              className="border rounded-md p-1 w-full"
              type="text"
              name="recepient"
              value={recepient}
              onChange={handleChange}
            />
          </label>
          <label>
            Anschreiben:{" "}
            <textarea
              className="border rounded-md p-1 w-full"
              name="content"
              value={content}
              onChange={handleChange}
            />
          </label>
          <button
            disabled={isDisabled}
            onClick={handleCreatePdf}
            className={`rounded-md p-1 ${
              isDisabled
                ? "bg-orange-300 text-slate-500 cursor-not-allowed"
                : "bg-orange-400 text-slate-950 cursor-pointer"
            }`}
          >
            create PDF
          </button>
        </div>
      </div>
      {resultingPdfUrl && (
        <embed
          className="m-4 w-11/12 h-full"
          src={resultingPdfUrl}
          type="application/pdf"
        ></embed>
      )}
    </div>
  );
}
