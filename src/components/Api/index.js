import axios from 'axios';

const instance = axios.create({
      baseURL : "https://kepptrack.herokuapp.com"
      //baseURL:"https://aca3ba540404.ngrok.io"
});

instance.interceptors.request.use(
    async (config) => {
        const data = await localStorage.getItem('billsplit_user_key');
        if (data) {
            config.headers.Authorization = `Bearer ${data}`
        }
        return config;
    },
    (err) => {

        return Promise.reject(err);
    }
);

export default instance;