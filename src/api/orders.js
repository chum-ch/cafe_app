const additionalConfig = { showToast: true }
let userApi = "https://eaownyg1ak.execute-api.ap-southeast-1.amazonaws.com/dev";
// let userApi = "http://localhost:3008";
// console.log("User API URL:", import.meta.env.VITE_USER_API_URL);
if (import.meta.env.VITE_USER_API_URL) {
    userApi = import.meta.env.VITE_USER_API_URL;
}

export default (axios)=>({
    listMenu(tenantId, userId, conf = {}) {
        return axios.get(`${userApi}/v1/${tenantId}/users/${userId}/menu`, { ...conf, showToast: false, showLoading: true });
    },
    createMenu(payload, tenantId, userId, conf = {}) {
        return axios.post(`${userApi}/v1/${tenantId}/users/${userId}/menu`, payload, { ...conf, showToast: true });
    },
    detailsMenu(tenantId, userId, menuId, conf = {}) {
        return axios.get(`${userApi}/v1/${tenantId}/users/${userId}/menu/${menuId}`, { ...conf, showToast: false });
    },
    updateMenu(payload, tenantId, userId, menuId, conf = {}) {
        return axios.patch(`${userApi}/v1/${tenantId}/users/${userId}/menu/${menuId}`, payload, { ...conf, showToast: true });
    },
    deleteMenu(tenantId, userId, menuId, conf = {}) {
        return axios.delete(`${userApi}/v1/${tenantId}/users/${userId}/menu/${menuId}`, { ...conf, showToast: true });
    },
    listOrders(tenantId, userId, conf = {}) {
        return axios.get(`${userApi}/v1/${tenantId}/users/${userId}/orders`, { ...conf, showToast: false });
    },
    updateOrderStatus(payload, tenantId, userId, orderId) {
        return axios.patch(`${userApi}/v1/${tenantId}/users/${userId}/orders/${orderId}`, payload, { showToast: false });
    },
    createOrder(payload, tenantId, userId) {
        return axios.post(`${userApi}/v1/${tenantId}/users/${userId}/orders`, payload, { showToast: true });
    },
})
