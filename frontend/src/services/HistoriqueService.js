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
    const response = await Api.post(`${AVIS_API}/supprimer`, {
        clientId,
        prestataireId,
        dateVisite: new Date(dateVisite).toISOString(),
    });
    return response.data;
};
// export const supprimeHistorique = async (id) => {
//     const response = await Api.delete(`/api/historique/supprimer/${id}`);
//     return response.data;
// };
//get historique 
export const getHistorique = async (clientId) => {
    const response = await Api.get(`${AVIS_API}/dernier?clientId=${clientId}`);
    return response.data;
}
export const getPopulaireP = async () => {
    const response = await Api.get(`${AVIS_API}/populaires-semaine`);
    return response.data;
}