// import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createPdf } from "../utils/pdf";
import { useFetchers, useRouteLoaderData } from "@remix-run/react";
import { FaxSendResult } from "./fax.send";
import { CoverPageForm } from "../components/organisms/CoverPageForm";
import { LoaderResult } from "./fax";
import { Contact, FaxContact } from "../utils/contacts";
import FaxHistory from "../components/organisms/FaxHistory";
import { Container } from "../components/atoms/Container";
import {
  DeleteButton,
  TactileButton,
  ToggleButton,
} from "../components/atoms/Button";
import { Input } from "../components/atoms/FormElements";
import { FaxPreview } from "../components/organisms/FaxPreview";

type UploadMetaData = {
  name: string;
  size: number;
  lastModifiedDate: Date;
};

const defaultState = {
  sender: "Mundwerk Logopädische Praxis",
  recipientName: "",
  recipientNumber: "",
  content: "",
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
  const [sender, setSender] = useState<string>("");
  const [senderNumber, setSenderNumber] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [prescriptionDate, setPrescriptionDate] = useState<string>("");
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

  const fileName = today + "_fax-an_" + recipientNumber.replace(" ", "_");

  const initUpload = () => {
    setUploadedPdf(undefined);
    setUploadMetaData(undefined);
    setResultingPDF(undefined);
    setResultingPDFBase64(undefined);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // as maxFiles: 1 we can safely assume there will be only one file
    initUpload();
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

  useEffect(() => {
    if (loaderData?.tagline) {
      setSender(loaderData.tagline);
    }
    if (loaderData?.callerid) {
      setSenderNumber(loaderData.callerid);
    }
  }, [loaderData?.callerid, loaderData?.tagline]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (resultingPDF) setResultingPDF(undefined);
    const field = e.currentTarget.name;
    e.preventDefault();
    if (field === "recipientName") setRecipientName(e.currentTarget.value);
    if (field === "recipientNumber") setRecipientNumber(e.currentTarget.value);
    if (field === "content") setContent(e.currentTarget.value);
    if (field === "patientName") setPatientName(e.currentTarget.value);
    if (field === "prescriptionDate")
      setPrescriptionDate(e.currentTarget.value);
  };

  const handleReset = (onlyResultingPdf: boolean = false) => {
    if (!onlyResultingPdf) {
      setRecipientName(defaultState.recipientName);
      setRecipientNumber(defaultState.recipientNumber);
      setContent(defaultState.content);
    }
    initUpload();
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
                recipient: recipientName,
                recipientNumber,
                content,
                patientName,
                prescriptionDate,
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

  const coverPageIncomplete =
    !sender || !recipientName || !content || !patientName || !prescriptionDate;
  const readyCoverPage =
    !hasCoverPage || (hasCoverPage && !coverPageIncomplete);
  const readyToCreateFax =
    recipientNumberMatch && uploadedPdf && readyCoverPage;
  const canSendFax = Boolean(
    loaderData?.status === "ok" &&
      readyCoverPage &&
      readyToCreateFax &&
      resultingPdfUrl &&
      resultingPDFBase64
  );
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 h-full">
      <Container className="max-h-full overflow-y-auto">
        <div className="grid grid-rows-1 gap-2">
          <h2 className="text-xl font-semibold text-gray-800">Fax Empfänger</h2>
          <Input
            label="Suche"
            placeholder="🔍 in Addressbuch suchen oder unten manuell eingeben"
            name="search"
            autoComplete="off"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setFilteredContacts(
                faxContacts.filter((contact) =>
                  contact.name.toLowerCase().includes(searchValue.toLowerCase())
                )
              );
              if (searchValue === "") {
                setFilteredContacts([]);
              }
            }}
          />
          {filteredContacts.length > 0 && searchValue !== "" && (
            <div className="relative">
              <div className="absolute z-50 bg-white border border-blue-500 rounded-md mt-2 w-full grid grid-cols-1">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    className="p-2 cursor-pointer hover:bg-gray-100 text-start"
                    onKeyDown={() => handleSelectFaxContact(contact)}
                    onClick={() => handleSelectFaxContact(contact)}
                  >
                    {contact.familyName}, {contact.givenName} - {contact.number}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Input
            label="Faxnummer"
            placeholder="Faxnummer im Format +49293112345"
            type="tel"
            required
            title="Faxnummer im Format +49293112345"
            pattern="^\+[1-9]\d{1,14}$"
            name="recipientNumber"
            value={recipientNumber}
            onChange={handleChange}
          />

          {hasCoverPage && (
            <CoverPageForm
              {...{
                sender,
                senderNumber,
                recipientName,
                patientName,
                prescriptionDate,
                content,
                onChange: handleChange,
                onRemove: () => setHasCoverPage(false),
              }}
            />
          )}
          {/* add a toggle for the CoverPage */}
          {!hasCoverPage && (
            <ToggleButton
              label="⊕ Deckblatt (VO Korrektur) hinzufügen"
              value={!hasCoverPage}
              onChange={() => {
                if (resultingPdfUrl) handleReset(true);
                setHasCoverPage(!hasCoverPage);
              }}
            />
          )}
          {resultingPdfUrl && (
            <span className="text-red-500 p-1 italic text-sm">
              <i> (Formular wir zurückgesetzt)</i>
            </span>
          )}
          <Container
            bg="bg-green-100"
            rounded="rounded-lg"
            shadow="shadow-inner"
            className="border border-green-300"
          >
            <p className="text-sm text-gray-700">
              Bitte das zu faxende PDF hier ablegen, oder klicken um ein PDF
              auszuwählen
            </p>
            <div
              className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-slate-500">
                  ⊕ Bitte das zu faxende PDF hier ablegen ...
                </p>
              ) : (
                <p className="text-slate-500">
                  ⊕ Drag & Drop oder Datei auswählen
                </p>
              )}
            </div>
            {uploadMetaData && (
              <div className="p-4 bg-yellow-100 rounded-md border-spacing-1 shadow-inner">
                <p className="text-xs font-mono italic">
                  <div className="flex justify-between items-center">
                    <b>📄 {uploadMetaData?.name}</b>
                    <DeleteButton handleDelete={handleReset} />
                  </div>
                  <div>
                    ({uploadMetaData?.lastModifiedDate.toLocaleString()} -{" "}
                    {uploadMetaData?.size} byte)
                  </div>
                </p>
              </div>
            )}
          </Container>
          {!readyToCreateFax && (
            <Container
              bg="bg-red-100"
              rounded="rounded-lg"
              shadow="shadow-inner"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Zum Fortfahren bitte prüfen:
              </h2>
              <ul className="text-red-500 font-mono p-1 text-xs list-disc list-inside">
                {!recipientNumberMatch && (
                  <li>
                    Bitte Faxnummer im internationalen Format
                    &quot;+49293112345&quot; angeben
                  </li>
                )}
                {!uploadedPdf && <li>Bitte PDF-Dokument hochladen</li>}
                {hasCoverPage && coverPageIncomplete && (
                  <>
                    {!recipientName && (
                      <li>Deckblatt (VO Korrektur): Name Empfänger:in fehlt</li>
                    )}
                    {!patientName && (
                      <li>Deckblatt (VO Korrektur): Name Patient:in fehlt</li>
                    )}
                    {!prescriptionDate && (
                      <li>Deckblatt (VO Korrektur): Datum fehlt</li>
                    )}
                    {!content && (
                      <li>Deckblatt (VO Korrektur): Korrekturen fehlen</li>
                    )}
                  </>
                )}
              </ul>
            </Container>
          )}
          {readyToCreateFax && !resultingPDF && (
            <TactileButton
              label="🛠️ Fax vorbereiten"
              onClick={handleCreatePdf}
              disabled={!!resultingPdfUrl || !readyToCreateFax}
              color="orange"
            />
          )}

          {resultingPdfUrl && (
            <TactileButton
              label="  ♻️ alles zurücksetzen"
              onClick={() => handleReset()}
              color="red"
            />
          )}
        </div>
      </Container>
      <FaxPreview
        resultingPdfUrl={resultingPdfUrl}
        fileName={fileName}
        resultingPDFBase64={resultingPDFBase64}
        currentSendActionResult={currentSendActionResult}
        canSendFax={canSendFax}
        recipientName={recipientName}
        recipientNumber={recipientNumber}
      />
      <FaxHistory />
    </div>
  );
}
