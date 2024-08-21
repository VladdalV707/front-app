import axios from "axios";

console.log("Process:", process.env);
console.log("Received URL:", process.env.REACT_APP_URL_AGSIS);

axios.defaults.baseURL = process.env.REACT_APP_URL_AGSIS;
axios.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.withCredentials = true; // Enable sending cookies with requests

console.log("Defaults: ", axios.defaults);
console.log("Mode:", process.env.NODE_ENV);
console.log("Base URL:", axios.defaults.baseURL);

/**
 * When the user receives a 401 error code for a specific method (unauthorized),
 * an alert will appear with the method the user does not have access to.
 */
axios.interceptors.response.use(
    (res) => res,
    function (error) {
        if (error.response.status === 401) {
            alert("Nu aveti acces la metoda: " + error.response.config.url);
        }
        return Promise.reject(error);
    }
);

export { axios };
