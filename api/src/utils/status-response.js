const { connect } = require("mssql");
const Validator = require("validator");
module.exports = {
    badRequest: (res, content, err) => {
        sendErrorResponse(res, content, 400, err);
    },
    created: (res, content) => {
        sendResponse(res, content, 201);
    },
    conflict: (res, content, err) => {
        sendErrorResponse(res, content, 409, err);
    },
    notFound: (res, content, err) => {
        sendErrorResponse(res, content, 404, err);
    },
    ok: (res, content) => {
        sendResponse(res, content, 200);
    },
    serverError: (res, content, err) => {
        sendErrorResponse(res, content, 500, err);
    },
    unauthorized: (res, content, err) => {
        sendErrorResponse(res, content, 401, err);
    }
};
function sendErrorResponse(res, content, statusCode, err) {
    if(process.env.DEBUG == 'true' && err){
        console.debug(err);
    }
    content = parseError(content, err);
    if (err && err.message)
        res.set('error.message', err.message);
    res.status(statusCode).send(content);
}

function sendResponse(res, content, statusCode) {
    content = parseContent(content);
    res.status(statusCode).send(content);
}

function parseError(content, err) {
    
    if(!content && !err)    return;

    if(!content && err && err.message){
        return err.message;
    }
    
    if (typeof content === 'string' && err){
        content = err.message + '\n' + content;
    }// if content is an Error object return the message property
    else if (content instanceof Error) {
        content = content.message;
    }
    else if(typeof content !== 'string')
    {
        // search through the Object for message and msg properties
        let messages = [];
        // recursive search and add to messages array
        function search(obj) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        search(obj[key]);
                    } else {
                        if (key === 'message' || key === 'msg') {
                            messages.push(obj[key]);
                        }
                    }
                }
            }
        }
        
        search(content);
        // join the messages array into a string with newlines
        const newcontent = messages.join('\n');
        if (newcontent != ''){
            content = newcontent;
        }
        
    }
    return content;
}

function parseContent(content) {
    if (typeof content === 'string') {
        content = {
            message: content
        }
    }
    return content;
}