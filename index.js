import express  from "express";

const port = 3000
const app = express()

const wfoAPI = 'https://list.worldfloraonline.org/gql.php'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/wfo', (req, res) => {

  const id = req.query.id


  if (id && /^wfo-\d{10}$/.test(id)) {

    const qry = `
      query {
        taxonNameById(nameId: "${id}") {
          id, 
          fullNameStringPlain,
          nomenclaturalStatus,
          currentPreferredUsage {
            hasName {
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
    .then(json => {
          
      res.json({
        acceptedName: json.data.taxonNameById?.currentPreferredUsage?.hasName?.fullNameStringPlain
      })
      
    });

  }
  else {
    res.json({
      "error": "invalid ID provided"
    })
  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})