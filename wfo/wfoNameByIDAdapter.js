import graphQLTaxonNameFields from '../utils/graphQLTaxonNameFieldsString.js'
import mapGraphQLTaxonName from '../utils/mapGraphQLTaxonName.js'

export async function getWFONameByID(wfoID, url) {
  
  wfoID = wfoID?.trim().replace(/\s+/, ' ')

  if (!wfoID) {
    throw new Error('no WFO ID provided')
  }

  if (!/^wfo-\d{10}$/.test(wfoID)) {
    throw new Error('invalid WFO ID')
  }

  const qry = `
    query {
      taxonNameById(nameId: "${wfoID}") {
        ${graphQLTaxonNameFields}
      }
    }
  `

  let gqlres
  try {
    gqlres = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: qry 
      }),
    })
  }
  catch(err) {
    return {
      status: 500,
      message: err.message,
      results: []
    }
  }

  if (gqlres.status == 200) {
    const { data } = await gqlres.json()

    let record = data.taxonNameById
    let returnRecord = mapGraphQLTaxonName(record)

    return {
      status: 200,
      message: 'OK',
      results: returnRecord
    }
  }
  else {
    const errorBody = await gqlres.text();
    return {
      status: 500,
      message: 'error fetching WFO name',
      results: errorBody
    }
  }
}
  
