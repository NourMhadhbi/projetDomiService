import Api from '../axios/Api';
const AVIS_API = '/utilisateur';
export const getIntervenant = async () => {
    const response = await Api.get(`${AVIS_API}/getintervenant`);
    return response.data; // seulement le tableau d'intervenants
};
export const getIntervenantbyId = async (id) => {
    const response = await Api.get(`${AVIS_API}/intervenant/${id}`);
    return response.data;
};
export const getPrestatairesProches = async (clientId) => {
  
    const response = await Api.get(`${AVIS_API}/prestataires-proches/${clientId}`);
  
    return response.data;
};
