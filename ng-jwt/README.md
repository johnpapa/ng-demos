AngularJS JSON Web Token Demo
===========
Demonstrating Angular [JSON Web Tokens](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token)

## Running
Runs locally, no database required.
From terminal type `cd server` then type `node server.js` and browse to port 7171

## API Tests Using Postman
The Chrome Postman plugin can be used to test the APIs. Import the collection from `postman.api.tests.json` to run them. The authentication token in the imported collection is specific for the hardcoded secret in the demo.

## How It Works
The node server middleware secures all api routes by checking for a auth token (JWT). If present, the API route is allowed.

### Retrieving the Token
The token is retrieved from the `\authenticate` route and stuffed into sessionStorage in the browser with an expiration. See code in `server/auth.js`

### The AngularJS Client
An AngularJS `httpInterceptor` places the token in every request to the server. The same interceptor checks all responses to see which were unauthorized, so it can taken action. See code in `app/services/authInterceptor.js`

## The Demo

### Authorize - Pass
Enter `john.papa` and `secret` and click the login button.

### Authorize - Fail
Enter `john.papa` and `foo` and click the login button. Notice the network traffic and the failure response.

### GET Restricted Data - Pass
If logged in successfully, the restricted data hyperlink returns a message.

### GET Restricted Data - Fail
If not logged in, the restricted data hyperlink returns an error.

##References
- [Auth0 Guide for JWT](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)

###Express 4
- [Middleware](https://github.com/senchalabs/connect?source=c#middleware)
- [New Features in v4](https://github.com/visionmedia/express/wiki/New-features-in-4.x)
- [Express API docs](http://expressjs.com/4x/api.html)
- [Express 3 to 4 Upgrade Guide](http://scotch.io/bar-talk/expressjs-4-0-new-features-and-upgrading-from-3-0)



