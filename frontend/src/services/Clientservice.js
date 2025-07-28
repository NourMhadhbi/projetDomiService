import Api from '../axios/Api';
const CLIENT_API = '/utilisateur/client';
export const getClientsRecherche = async (q) => {
    const response = await Api.get(`${CLIENT_API}/recherche-clients`, {
        params: { q }
    });
    return response.data;
};
