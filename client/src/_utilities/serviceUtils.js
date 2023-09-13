const axios = require('axios').default;

class RequestUtils {
    static getRequest(url, urlParams){
        return axios.get(url,
            {params: urlParams})
            .then(response => {
                return response;
            })
            .catch(function (error) {
                console.error(error)
                return error.response;
            })
    }

    static postRequest(url, data){

        return axios.post(url,data)
            .then(response => {
                return response;
            })
            .catch(function (error) {
                console.error(error)
                return error.response;
            })
    };

    static patchRequest(url, data){
        return axios.patch(url, data)
            .then(response => {
                return response;
            })
            .catch(function (error) {
                console.error(error)
                return error.response;
            })
    };

    static deleteRequest(url, data){
        return axios.delete(url, data)
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