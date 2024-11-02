
export async function getWFOSynonymsByID(wfoid, wfoVersion, url) {
  
  if (!wfoid || !/^wfo-\d{10}$/.test(wfoid)) {
    throw new Error('invalid wfo id')
  }

  if (!wfoVersion || !wfoVersion.trim()) {
    throw new Error('wfo version is required')
  }

  wfoVersion = wfoVersion.trim().replace('.', '-')

  if (! /^\d{4}-\d{2}$/.test(wfoVersion)) {
    throw new Error('invalid wfo version')
  }

  const qry = `
    query {
      taxonConceptById(taxonId: "${wfoid + '-' + wfoVersion}") {
        hasName{
          id,
  		    fullNameStringPlain,
        },
        hasSynonym {
          id,
          fullNameStringPlain,
          fullNameStringNoAuthorsPlain, 
          authorsString,
          nomenclaturalStatus
        }
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

    let record = data.taxonConceptById
    if (record) {
      
      const synonyms = record.hasSynonym
      const result = {
        wfoID: record.hasName.id,
        fullName: record.hasName.fullNameStringPlain,
        synonyms: synonyms.map(x => ( {
          wfoID: x.id,
          fullName: x.fullNameStringPlain,
          canonicalName: x.fullNameStringNoAuthorsPlain, 
          author: x.authorsString,
          status: x.nomenclaturalStatus
        } ))
      }

      return {
        status: 200,
        message: 'OK',
        results: result
      }
    }
    else {
      return {
        status: 404,
        message: 'no record for supplied wfo id and version',
        results: []
      }
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