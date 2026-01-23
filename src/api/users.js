let userApi = "https://95ipr7p9sa.execute-api.ap-southeast-1.amazonaws.com/dev";
// let userApi = "http://localhost:3000";
// console.log("User API URL:", import.meta.env.VITE_USER_API_URL);
if (import.meta.env.VITE_USER_API_URL) {
    userApi = import.meta.env.VITE_USER_API_URL;
}
// const userApi = "https://95ipr7p9sa.execute-api.ap-southeast-1.amazonaws.com/prod";
export default (axios)=>({
    listUsers() {
        return axios.get(`https://95ipr7p9sa.execute-api.ap-southeast-1.amazonaws.com/dev/tenants/Tenant:29905045a2ba4719a410cb8aa7df6a5a/users`)
    },
})
