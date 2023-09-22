class RequestUtils {
    static getRequest(url, urlParams){
        switch(url){
            case '/api/news/view':
                const promise = new Promise((resolve, reject)=>{
                    resolve(
                        {'data':[{
                            articletitle: 'articletitle',
                            articlesubheading: 'articlesubheading',
                            articlemessage: 'articlemessage',
                            articledate: 'articledate'
                        }]}
                    )
                });
                return promise;
            default:
                console.error(url + ' is not mocked');
        } 
    }

    static postRequest(url, data){
        switch(url){
            default:
                console.error(url + ' is not mocked');
        }
    };

    static patchRequest(url, data){
        switch(url){
            default:
                console.error(url + ' is not mocked');
        }
    };

    static deleteRequest(url, data){
        switch(url){
            default:
                console.error(url + ' is not mocked');
        }    
    };
}

export default RequestUtils;