import graphQLTaxonNameFields from './graphQLTaxonNameFieldsString.js'
import mapGraphQLTaxonName from '../adapters/mapGraphQLTaxonName.js'

export async function fetchWFONameByID(wfoID, url) {
  
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
    if (!record) {
      return {
        status: 404,
        message: 'WFO name not found',
        results: null
      }
    }
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
      status: gqlres.status || 500,
      message: 'error fetching WFO name',
      results: errorBody
    }
  }
}
  
