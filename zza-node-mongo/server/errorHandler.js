/*************************
 * Application middleware that returns an error to the client
 * Should be the last middleware in the pipeline
 * Can turn a specially formatted error object into an error response with a status code
 * Ex:
 *    err = {statusCode: 404, message: 'Unable to locate query for foo'}
 *    // sends a 404 response with the given message as the body
 *
 * If no statusCode, statusCode = 500
 * If err.message, the message is the body
 * If no err.message, the err itself is the body.
 * If in development environment
 *    - logs the error to console
 *    - if err.stack, logs the stack trace to console
 *
 * @type {errorHandler}
 ************************/

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (err) {
        var body =  err.message || err;
        var status = err.statusCode || 500;
        res.send(status, body);
        logError(err, status, body);
    }
}

function logError(err, status, body){
    //todo: get environment variable that says whether to log to console
    setTimeout(log,0); // let response write to console, then error
    function log(){
        var stack = '';
        var msg = '--------------\n'+status + ' ' + body;
        // log all inner errors too
        while(err) {
            stack = err.stack || stack; // get deepest stack
            err = err.innerError;
            if (err && err.message){
                msg += '\n'+err.message;
            }
        }
        // log deepest stack
        if(stack) {msg += '\n'+stack; }
        console.error(msg+'\n--------------');
    }
}
