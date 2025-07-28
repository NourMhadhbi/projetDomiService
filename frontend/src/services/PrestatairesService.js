import Api from '../axios/Api';
const AVIS_API = '/utilisateur/prestataire';
export const getPrestatairesRecherche = async (q) => {
    const response = await Api.get(`${AVIS_API}/recherche-prestataires`, {
        params: { q }
    });
    return response.data;
};
export const getPrestatairesService = async (id) => {
    const response = await Api.get(`${AVIS_API}/servicePres`, {
        params: { id }
    });
    return response.data;
};
export const getClientContactPres = async (prestataireId) => {
    try {
        const response = await Api.get(`${AVIS_API}/carteContactPrestataire/${prestataireId}`);
        return response.data;
    } catch (error) {

        throw error;
    }
};