import { DeleteButton } from "../atoms/Button";
import { Container } from "../atoms/Container";
import { Input, Label } from "../atoms/FormElements";

type CoverPageFormProps = {
  sender: string;
  senderNumber: string;
  recipientName: string;
  patientName: string;
  prescriptionDate: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onRemove: () => void;
  content: string;
};

export const CoverPageForm = ({
  sender,
  senderNumber,
  patientName,
  prescriptionDate,
  recipientName,
  onChange,
  onRemove,
  content,
}: CoverPageFormProps) => {
  return (
    <Container className="relative" bg="bg-gray-50" shadow="shadow-inner">
      <DeleteButton
        handleDelete={onRemove}
        className="top-2 right-2 absolute"
      />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Deckblatt (VO Korrektur) ausfüllen{" "}
      </h2>
      <Input
        label="Von:"
        name="recipientName"
        value={`${sender} (${senderNumber})`}
        onChange={() => undefined}
        disabled={true}
      />

      <Input
        label="An (Name):"
        name="recipientName"
        value={recipientName}
        onChange={onChange}
      />
      <Input
        label="Patient:"
        name="patientName"
        value={patientName}
        onChange={onChange}
      />

      <Input
        label="Datum der Verordnung:"
        name="prescriptionDate"
        value={prescriptionDate}
        onChange={onChange}
      />

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
