import Api from '../axios/Api';
const Contact_API = '/Contact';
 export const envoyerContact = async(contactData) => {
  return Api.post(`${Contact_API}/ajout`, contactData);
};
