import Api from '../axios/Api';

const AVIS_API = '/service';
// Récupérer  les statistiques de service (top5)
export const getTop5 = async () => {
    const response = await Api.get(`${AVIS_API}/top`);
    console.log("Réponse API getTop5 :", response.data);
    return response.data;
};
export const getServicesNonArchive = async () => {
    const response = await Api.get(`${AVIS_API}`);

    return response.data;
};
export const getService = async (id) => {
    const response = await Api.get(`${AVIS_API}/${id}`);
    return response.data;
};