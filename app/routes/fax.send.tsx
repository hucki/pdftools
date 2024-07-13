import { ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { sendFax } from "../utils/fax";
export type FaxSendResult = {
  result: "success" | "error";
  message: string;
  error?: string;
};
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const recipientName = String(formData.get("recipientName"));
  const recipientNumber = String(formData.get("recipientNumber"));
  const fileName = String(formData.get("fileName"));
  const pdf = String(formData.get("pdf"));
  invariant(recipientNumber.length, "has to have a recipientNumber");
  invariant(
    recipientNumber.match(/^\+[1-9]\d{1,14}$/),
    "recipientNumber has to match +49123456789"
  );
  try {
    const result = await sendFax(recipientNumber, pdf, fileName);
    const sessionId = result?.data.sessionId || "unknown";
    if (sessionId === "unknown") {
      return {
        result: "error",
        message: "Fax konnte nicht gesendet werden",
        error: "sessionId not found in response",
      };
    }
    return {
      result: "success",
      message: `Fax gesendet an ${recipientName} mit der Nummer ${recipientNumber} (Session ID: ${sessionId})`,
      error: undefined,
    };
  } catch (error) {
    return {
      result: "error",
      message: "Fax konnte nicht gesendet werden",
      error,
    };
  }
}
