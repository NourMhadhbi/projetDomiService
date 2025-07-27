import Api from '../axios/Api';

const NOTIF_API = '/notification';

const NotificationService = {
    fetchNotifications: async (id, role) => {
        const response = await Api.get(`${NOTIF_API}?id=${id}&role=${role}`);
        return response.data;
    },
    markAsRead: async (id) => {
        const response = await Api.put(`${NOTIF_API}/${id}`);
        return response.data;
    }
};

export default NotificationService;
