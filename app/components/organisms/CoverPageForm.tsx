type CoverPageFormProps = {
  sender: string;
  senderNumber: string;
  recipientName: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  content: string;
};

export const CoverPageForm = ({
  sender,
  senderNumber,
  recipientName,
  onChange,
  content,
}: CoverPageFormProps) => {
  return (
    <div className="p-4 bg-slate-100 border border-dashed border-spacing-1 grid grid-rows-1gap-2">
      <h2 className="text-xl mb-2">Deckblatt ausfüllen</h2>
      <p className="text-slate-500">
        Von: {sender} ({senderNumber} )
      </p>
      <label className="text-slate-500">
        An (Name):{" "}
        <input
          className="border rounded-md p-1 w-full text-black"
          type="text"
          name="recipientName"
          value={recipientName}
          onChange={onChange}
        />
      </label>

      <label className="text-slate-500">
        Anschreiben:{" "}
        <textarea
          className="border rounded-md p-1 w-full text-black"
          name="content"
          value={content}
          onChange={onChange}
        />
      </label>
    </div>
  );
};
