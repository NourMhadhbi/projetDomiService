import Api from '../axios/Api';

const HISTORIQUE_API = '/historiqueApp';
export const enregistrerConsultation = async (utilisateurId) => {
  const response = await Api.post(`${HISTORIQUE_API}/consulter`, { utilisateurId });
  return response.data;
};
