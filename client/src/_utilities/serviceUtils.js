import axios from 'axios'

const fetchToken = () => localStorage.jwtToken || ""

class RequestUtils {
    static getRequest(url, urlParams){
        return axios.get(url, {
                headers: { Authorization: fetchToken() },
                params: urlParams
            })
            .then(response => {
                response.ok = (response.status >= 200 && response.status < 300) || response.status === 304;
                return response;
            })
            .catch(function (error) {
                console.error(error)
                return error.response;
            })
    }

    static postRequest(url, data){

        return axios.post(url,data, {
            headers: { Authorization: fetchToken() }
        })
            .then(response => {
                return response;
            })
            .catch(function (error) {
                console.error(error)
                return error.response;
            })
    };

    static patchRequest(url, data){
        return axios.patch(url, data, {
            headers: fetchToken()
        })
            .then(response => {
                return response;
            })
            .catch(function (error) {
                console.error(error)
                return error.response;
            })
    };

    static deleteRequest(url, data){
        return axios.delete(url, data, {
            Authorization: fetchToken()
        })
            .then(response => {
                return response;
            })
            .catch(function (error) {
                console.error(error)
                return error.response;
            })
    };
}

export default RequestUtils;