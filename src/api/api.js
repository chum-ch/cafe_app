
import users from "./users"
// export default axios.create({
//     baseURL: process.env.VUE_APP_BACKEND_URL,
//     headers: {
//       "Content-type": "application/json"
//     }
//   });
export default (axios) => ({
  user: users(axios),
});

