// import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createPdf } from "../utils/pdf";
import { Form, useFetchers, useRouteLoaderData } from "@remix-run/react";
import { FaxSendResult } from "./fax.send";
import { CoverPageForm } from "../components/organisms/CoverPageForm";
import { LoaderResult } from "./fax";
import { Contact, FaxContact } from "../utils/contacts";

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

export const getFaxContacts = (contacts: Contact[]): FaxContact[] => {
  return contacts
    .filter((contact) => {
      return contact.numbers.some((number) => number.type.includes("fax"));
    })
    .map((contact) => {
      return {
        id: contact.id,
        name: contact.name,
        givenName: contact.givenname,
        familyName: contact.familyname,
        numberType: "fax",
        number: contact.numbers.find((number) => number.type.includes("fax"))
          ?.number,
      };
    });
};

export default function FaxComposer() {
  const loaderData = useRouteLoaderData<LoaderResult>("routes/fax");
  const fetchers = useFetchers();
  const [hasCoverPage, setHasCoverPage] = useState(true);
  const [sender, setSender] = useState<string>(defaultState.sender);
  const [faxContacts, setFaxContacts] = useState<FaxContact[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredContacts, setFilteredContacts] = useState<FaxContact[]>([]);
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
  useEffect(() => {
    if (faxContacts.length) {
      return;
    }
    if (loaderData?.status === "ok" && loaderData.contacts) {
      setFaxContacts(getFaxContacts(loaderData.contacts as Contact[]));
    }
  }, [loaderData?.contacts, faxContacts, loaderData?.status]);

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

  const handleReset = (onlyResultingPdf: boolean = false) => {
    if (!onlyResultingPdf) {
      setSender(defaultState.sender);
      setRecipientName(defaultState.recipientName);
      setRecipientNumber(defaultState.recipientNumber);
      setContent(defaultState.content);
    }
    setUploadedPdf(undefined);
    setUploadMetaData(undefined);
    setResultingPDF(undefined);
    setCurrentSendActionKey("");
  };
  const handleCreatePdf = async () => {
    if (
      uploadedPdf &&
      ((sender && recipientName && content) || !hasCoverPage)
    ) {
      try {
        const result = await createPdf({
          coverPage: hasCoverPage
            ? {
                sender,
                recipient: recipientName,
                recipientNumber: recipientNumber,
                content,
              }
            : undefined,
          pdfAttachment: {
            bytes: uploadedPdf,
            fileName,
            description: "pdfAnhang",
            creationDate: now.toISOString(),
            modificationDate: now.toISOString(),
          },
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

  const recipientNumberMatch = Boolean(
    recipientNumber.match(/^\+[1-9]\d{7,14}$/)
  );

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

  const readyCoverPage =
    !hasCoverPage || (hasCoverPage && sender && recipientName && content);
  const readyToCreateFax = recipientNumberMatch && uploadedPdf;
  const canSendFax =
    loaderData?.status === "ok" &&
    readyCoverPage &&
    readyToCreateFax &&
    resultingPdfUrl &&
    resultingPDFBase64;
  useEffect(() => {
    if (searchValue === "") {
      setFilteredContacts([]);
    }
  }, [searchValue]);
  const handleSelectFaxContact = (contact: FaxContact) => {
    setRecipientNumber(contact.number || "");
    setRecipientName(
      contact.familyName + (contact.givenName ? ", " + contact.givenName : "")
    );
    setSearchValue("");
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div>
        <div className="grid grid-rows-1 m-4 gap-2">
          <div className="p-4 bg-slate-100 border border-dashed border-spacing-1 grid grid-rows-1gap-2">
            <h2 className="text-xl">Faxnummer eingeben</h2>
            <label className="text-slate-500">
              Suche Faxempfänger (oder unten manuell eingeben):{" "}
              <input
                placeholder="bitte Namen eingeben"
                className="border rounded-md p-1 w-full text-black"
                type="text"
                name="search"
                autoComplete="off"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setFilteredContacts(
                    faxContacts.filter((contact) =>
                      contact.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                  );
                  if (searchValue === "") {
                    setFilteredContacts([]);
                  }
                }}
              />
              {filteredContacts.length > 0 && searchValue !== "" && (
                <div className="relative">
                  <div className="absolute z-5 bg-white border border-gray-300 rounded-md mt-2 w-full grid grid-cols-1">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.id}
                        className="p-2 cursor-pointer hover:bg-gray-100 text-start"
                        onKeyDown={() => handleSelectFaxContact(contact)}
                        onClick={() => handleSelectFaxContact(contact)}
                      >
                        {contact.familyName}, {contact.givenName} -{" "}
                        {contact.number}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                  🚨 Bitte Faxnummer im Format +49293112345 angeben 🚨
                </span>
              )}
            </label>
          </div>
          {/* add a switch to toggle hasCoverPage */}
          <label className="text-slate-500">
            Deckblatt hinzufügen:{" "}
            <input
              type="checkbox"
              checked={hasCoverPage}
              onChange={() => {
                if (resultingPdfUrl) handleReset(true);
                setHasCoverPage(!hasCoverPage);
              }}
            />
            {resultingPdfUrl && (
              <span className="text-red-500 p-1 italic text-sm">
                <i> (Formular wir zurückgesetzt)</i>
              </span>
            )}
          </label>
          {hasCoverPage && (
            <CoverPageForm
              {...{
                sender,
                recipientName,
                recipientNumber,
                recipientNumberMatch,
                content,
                onChange: handleChange,
              }}
            />
          )}
          <div className="p-4 bg-slate-100 border border-dashed border-spacing-1 grid grid-rows-1gap-2">
            <h2 className="text-xl">zu faxendes Dokument hochladen</h2>
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
            <h2 className="text-xl">Fax erzeugen</h2>
            <button
              disabled={!readyToCreateFax}
              onClick={handleCreatePdf}
              className={`rounded-md p-2 m-2 ${
                !readyToCreateFax
                  ? "bg-orange-100 text-slate-500 cursor-not-allowed"
                  : "bg-orange-400 text-slate-950 cursor-pointer"
              }`}
            >
              🛠️ FAX erzeugen
            </button>
            {!readyToCreateFax && (
              <span className="text-red-500 p-1 italic text-sm">
                Bitte erst {hasCoverPage ? "Deckblatt" : "Faxnummer"} ausfüllen
                und Anhang hochladen{" "}
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
          {canSendFax && (
            <div className="p-4 bg-slate-100 border border-dashed border-spacing-1 grid grid-rows-1gap-2">
              <h2 className="text-xl">Fax versenden</h2>
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
                <input type="hidden" name="pdf" value={resultingPDFBase64} />
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
              onClick={() => handleReset()}
              className="rounded-md p-2 bg-orange-300 text-slate-950 cursor-pointer text-center justify-self-end"
            >
              ♻️ alles zurücksetzen
            </button>
          )}
        </div>
      </div>
      <div className="p-4 m-4 bg-slate-100 border border-dashed border-spacing-1 ">
        <h2 className="text-xl">Vorschau </h2>
        {!resultingPdfUrl && (
          <h3>(erscheint hier sobald das Fax erzeugt wurde)</h3>
        )}
        {resultingPdfUrl && (
          <embed
            className="m-4 w-11/12 h-full"
            src={resultingPdfUrl}
            type="application/pdf"
          ></embed>
        )}
      </div>
    </div>
  );
}
