import axios, { AxiosError } from "axios";
const { BASE_URL, TOKEN_ID, TOKEN } = process.env;

export const fetchContacts = async () => {
  try {
    const contactsResponse = await axios(`/contacts`, {
      baseURL: BASE_URL,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      auth: {
        username: TOKEN_ID || "",
        password: TOKEN || "",
      },
    });
    return contactsResponse.data;
  } catch (error) {
    console.error("Error:", (error as AxiosError).message);
    return null;
  }
};

const defaultContact = {
  id: "0aae6ec9-eb57-33e7-aab3-bfc081aaae23",
  name: "Name",
  givenname: "Name",
  familyname: "familyName",
  picture: null,
  emails: [],
  numbers: [
    {
      number: "+49293112345",
      type: ["work"],
    },
    {
      number: "+49293112345",
      type: ["fax", "work"],
    },
  ],
  addresses: [
    {
      poBox: "",
      extendedAddress: "",
      streetAddress: "Strasse 1",
      locality: "Ort",
      region: "",
      postalCode: "12345",
      country: null,
      type: ["work"],
    },
  ],
  websites: [],
  organization: [[]],
  note: "",
  scope: "SHARED",
};

export type Contact = typeof defaultContact;
export type FaxContact = {
  id: string;
  name: string;
  givenName: string;
  familyName: string;
  numberType: string;
  number: string | undefined;
};
