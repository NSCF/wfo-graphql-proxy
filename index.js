import express  from "express";
import apicache from 'apicache'
// import swaggerUi from 'swagger-ui-express'
// import YAML from 'yamljs'
import { getWFONameMatch } from "./wfo/wfoMatchAdapter.js";
import { getWFONameByID } from './wfo/wfoNameByIDAdapter.js'

const port = 3000
const app = express()
let cache = apicache.middleware

const wfoAPI = 'https://list.worldfloraonline.org/gql.php'

// const swaggerDoc = YAML.load('./swagger.yaml')

// app.get('/suggest', cache(), async (req, res) => {

//   if (!req.query.search || ! req.query.search.trim()) {
//     res.status(400).send('A partial name search string is required')
//   }
//   else {
    
//     const qry = `
//       query {
//         taxonNameSuggestion(termsString: "${req.query.search.trim()}") {
//           id,
//           fullNameStringPlain,
//           role, 
//           authorsString,
//           nomenclaturalStatus,
//         }
//       }
//     `
//     try {
//       const gqlres = await fetch(wfoAPI, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query: qry 
//         }),
//       })

//       if (gqlres.status == 200) {
//         const { data } = await gqlres.json()
//         console.log(req.method, req.url, 200)
//         res.json(data)
//       }
//       else {
//         const errorBody = await gqlres.text();
//         console.log(req.method, req.url, gqlres.status)
//         res.status(gqlres.status).send(errorBody)
//       }

//     }
//     catch(err) {
//       console.log(req.method, req.url, 500)
//       res.status(500).send(err.message)
//     }
//   }

// })

app.get('/match', cache(), async (req, res) => {

  if (!req.query.name || ! req.query.name.trim()) {
    res.status(400).send('A name is required')
  }
  else {

    try {
      const result = await getWFONameMatch(req.query.name, req.query['exclude-deprecated'], wfoAPI)
      console.log(req.method, req.url, result.status)
      res.statusMessage = result.message;
      res.status(result.status).json(result.results)
    }
    catch(err) {
      console.log(req.method, req.url, 500, err.message)
      res.status(500).send(err.message)
    }
    
  }
})

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get('/names/:wfoid', cache(), async (req, res) => {

  if (!req.params.wfoid || ! req.params.wfoid.trim()) {
    res.send('WFO ID is required')
  } 
  else if (!/^wfo-\d{10}$/.test(req.params.wfoid)) {
    res.status(400).send('Oops, invalid WFO ID! Please try again')
  }
  else {

    try {
      const result = await getWFONameByID(req.params.wfoid.trim(), wfoAPI)
      console.log(req.method, req.url, result.status)
      res.statusMessage = result.message;
      res.status(result.status).json(result.results)
    }
    catch(err) {
      console.log(req.method, req.url, 500, err.message)
      res.status(500).send(err.message)
    }
  }
})



app.listen(port, () => {
  console.log(`WFO GraphQL API proxy running on http://localhost:${port}`)
})