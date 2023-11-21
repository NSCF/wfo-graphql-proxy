## WFO GraphQL Proxy

As we cannot access the WFO GraphQL endpoint directly from OpenRefine, this utility wraps it in a simple REST API, so that we can fetch accepted names in OpenRefine following a reconciliation with the WFO reconciliation service. 

Simply run `npm install`, and then `node index.js`