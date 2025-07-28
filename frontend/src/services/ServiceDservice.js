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
export const getServices = async () => {
    const response = await Api.get(`${Service_API}/adminServices`);

    return response.data;
};
export const getService = async (id) => {
    const response = await Api.get(`${Service_API}/${id}`);
    return response.data;
};

//  Ajouter service
export const ajouterService = async (data) => {
    const response = await Api.post(`${Service_API}/ajoutS`, data);
    return response.data;
};

//modifier service
export const modifierService = async ({ id, data }) => {
    const response = await Api.put(`${Service_API}/modifierS/${id}`, data);
    return response.data;
};

//  Archiver service
export const archiverService = async (id) => {
    const response = await Api.put(`${Service_API}/archive/${id}`);
    return response.data;
};