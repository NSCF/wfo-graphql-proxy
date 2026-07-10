// TODO: Remove this bypass once World Flora Online (WFO) corrects their SSL certificate chain
// on list.worldfloraonline.org (missing intermediate certificate).
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from "express";
import apicache from 'apicache';
import { getWFONameByID, getWFONameMatch, getWFOSynonymsByID } from "./controllers/index.js";

const port = 3000;
const app = express();
let cache = apicache.middleware;

// Express adapter to convert clean architecture controllers to route handlers
function makeExpressCallback(controller) {
  return async (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('Referer'),
        'User-Agent': req.get('User-Agent')
      }
    };
    try {
      const httpResponse = await controller(httpRequest);
      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (e) {
      console.error('Express callback error:', e.message);
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  };
}

app.get('/match', cache(), makeExpressCallback(getWFONameMatch));

app.get('/names/:wfoid', cache(), makeExpressCallback(getWFONameByID));

app.get('/synonyms/:wfoid', cache(), makeExpressCallback(getWFOSynonymsByID));

app.get('/', (req, res) => {
  res.send('Welcome to the WFO GraphQL API proxy. Options are /match?name=[insert name], /names/[wfo-id] and /synonyms/[wfo-id]?version=[version]');
});

app.listen(port, () => {
  console.log(`WFO GraphQL API proxy running on http://localhost:${port}`);
});