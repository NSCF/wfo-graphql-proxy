import express  from "express";
import apicache from 'apicache'

const port = 3000
const app = express()
let cache = apicache.middleware

const wfoAPI = 'https://list.worldfloraonline.org/gql.php'

app.get('/:wfoid?', (req, res) => {

  if (!req.params.wfoid) {
    res.send('Hi. If you\'d like to call the WFO API, use /wfoid, e.g. /wfo-')
  } 
  else if (!/^wfo-\d{10}$/.test(req.params.wfoid)) {
    res.status(400).send('Oops, invalid WFO ID! Please try again')
  }
  else {
    console.log(req.method, req.path)

    const qry = `
      query {
        taxonNameById(nameId: "${req.params.wfoid}") {
          id, 
          fullNameStringPlain,
          nomenclaturalStatus,
          currentPreferredUsage {
            hasName {
              id,
              fullNameStringPlain,
              authorsString
            },
            isPartOf {
              hasName {
                fullNameStringPlain
              }
            }
          }
        }
      }
    `

    fetch(wfoAPI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: qry 
      }),
    })
    .then(gqlres => gqlres.json())
    .then(({ data }) => {  
      
      let record = data.taxonNameById
      const returnRecord = {
        nameID: record.id,
        fullName: record.fullNameStringPlain,
        status: record.nomenclaturalStatus,
        acceptedNameID: record.currentPreferredUsage?.hasName?.id || null,
        acceptedName: record.currentPreferredUsage?.hasName?.fullNameStringPlain || null,
      }
      
      res.json(returnRecord)
    });

  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})