import Api from '../axios/Api';

const Signale_API = '/signalement';
export const getSignales = async () => {
    const response = await Api.get(`${Signale_API}/`);
    return response.data;
};

//  Ajouter service
export const ajouterSignale = async (data) => {
    const response = await Api.post(`${Signale_API}/AjoutSignale`, data);
    return response.data;
};
export const checkSignale = async () => {
    const response = await Api.get(`${Signale_API}/checkSignalements`);
    return response.data;
};
