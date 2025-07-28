import Api from '../axios/Api';
const UTILISATEUR_API = '/utilisateur';
export const getIntervenant = async () => {
    const response = await Api.get(`${UTILISATEUR_API}/getintervenant`);
    return response.data; // seulement le tableau d'intervenants
};
export const getUtilisateurs = async (role = 'TOUS') => {
    const response = await Api.get(`${UTILISATEUR_API}/utilisateursA?role=${role}`);
    return response.data;
};
export const getIntervenantbyId = async (id) => {
    const response = await Api.get(`${UTILISATEUR_API}/intervenant/${id}`);
    return response.data;
};
export const getPrestatairesProches = async (clientId) => {

    const response = await Api.get(`${UTILISATEUR_API}/prestataires-proches/${clientId}`);

    return response.data;
};
export const activerCompte = async (id) => {
    const response = await Api.put(`${UTILISATEUR_API}/activePrestataire?id=${id}`);
    return response.data;
};
export const desactiverCompte = async (id, raison) => {
  const response = await Api.put(`${UTILISATEUR_API}/desactive?id=${id}`, { raison });
  return response.data;
};
