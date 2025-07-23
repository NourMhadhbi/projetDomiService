import Api from '../axios/Api';

const AVIS_API = '/historique';
//Ajouter historique
export const ajoutHistorique = async (clientId, prestataireId) => {
    const response = await Api.post(`${AVIS_API}/ajouter/${prestataireId}`, {
        clientId: clientId,
    });
    return response.data;
};
//supprimer historique
export const supprimeHistorique = async ({ clientId, prestataireId, dateVisite }) => {
    const response = await Api.delete(`${AVIS_API}/supprimer`, {
        data: {
            clientId,
            prestataireId,
            dateVisite, // doit être en format ISO
        },
    });
    return response.data;
};
//get historique 
export const getHistorique = async (clientId) => {
    const response = await Api.get(`${AVIS_API}/dernier?clientId=${clientId}`);
    return response.data;
}