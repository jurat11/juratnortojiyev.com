// Configure your Google Form IDs here.
// How to get these:
// 1) Create a Google Form with fields: Full Name, Email, Phone, Message
// 2) Open the form → three dots → Get pre-filled link → fill sample values → Get link
// 3) The URL will contain entry.<ID>=... for each field. Copy those IDs below.

export const googleFormsConfig = {
  formId: 'https://formspree.io/f/xovnldzn',
  entries: {
    fullName: 'entry.1147606842',
    email: 'entry.910767944',
    phone: 'entry.21174044',
    message: 'entry.1890943243'
  }
};

export const buildGoogleFormsUrl = (data: {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}) => {
  const base = `https://docs.google.com/forms/d/e/${googleFormsConfig.formId}/formResponse`;
  const params = new URLSearchParams();
  params.set(googleFormsConfig.entries.fullName, data.fullName);
  params.set(googleFormsConfig.entries.email, data.email);
  params.set(googleFormsConfig.entries.phone, data.phone);
  params.set(googleFormsConfig.entries.message, data.message);
  return `${base}?${params.toString()}`;
};


