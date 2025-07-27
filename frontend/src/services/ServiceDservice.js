import Api from '../axios/Api';

const Service_API = '/service';
// Récupérer  les statistiques de service (top5)
export const getTop5 = async () => {
    const response = await Api.get(`${Service_API}/top`);
    console.log("Réponse API getTop5 :", response.data);
    return response.data;
};
export const getServicesNonArchive = async () => {
    const response = await Api.get(`${Service_API}`);

    return response.data;
};
export const getService = async (id) => {
    const response = await Api.get(`${Service_API}/${id}`);
    return response.data;
};