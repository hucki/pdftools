import { Container } from "../atoms/Container";
import { Label } from "../atoms/Label";

type CoverPageFormProps = {
  sender: string;
  senderNumber: string;
  recipientName: string;
  patientName: string;
  prescriptionDate: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  content: string;
};

export const CoverPageForm = ({
  sender,
  senderNumber,
  patientName,
  prescriptionDate,
  recipientName,
  onChange,
  content,
}: CoverPageFormProps) => {
  return (
    <Container>
      <h2 className="text-xl mb-2">Deckblatt (VO Korrektur) ausfüllen</h2>
      <Label>
        Von:{" "}
        <input
          className="border rounded-md p-1 w-full text-black cursor-not-allowed"
          type="text"
          name="recipientName"
          value={`${sender} (${senderNumber})`}
          disabled={true}
        />
      </Label>
      <Label>
        An (Name):{" "}
        <input
          className="border rounded-md p-1 w-full text-black"
          type="text"
          name="recipientName"
          value={recipientName}
          onChange={onChange}
        />
      </Label>
      <Label>
        Patient:in:{" "}
        <input
          className="border rounded-md p-1 w-full text-black"
          type="text"
          name="patientName"
          value={patientName}
          onChange={onChange}
        />
      </Label>
      <Label>
        Datum der Verordnung:{" "}
        <input
          className="border rounded-md p-1 w-full text-black"
          type="text"
          name="prescriptionDate"
          value={prescriptionDate}
          onChange={onChange}
        />
      </Label>

      <Label>
        Korrekturen:{" "}
        <textarea
          className="border rounded-md p-1 w-full text-black"
          name="content"
          placeholder="z.B. 'Datum der VO muss sein: xx.xx.xxxx'"
          value={content}
          onChange={onChange}
        />
      </Label>
    </Container>
  );
};
