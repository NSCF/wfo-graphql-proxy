import levenshtein from "js-levenshtein";

const wfoAPI = 'https://list.worldfloraonline.org/gql.php'

/**
 * 
 * @param {string} namestring The name to find matches for
 * @returns {[]}
 */
export async function getNameMatch(namestring, excludeDeprecated) {
  
  namestring = namestring.trim().replace(/\s+/, ' ')

  if (!namestring) {
    throw new Error('namestring is required for name match')
  }
    
  const qry = `
    query {
      taxonNameMatch(inputString: "${namestring}", checkHomonyms: true) {
        candidates {
          id,
          fullNameStringPlain,
          role, 
          authorsString,
          nomenclaturalStatus,
        }
      }
    }
  `
  try {
    const gqlres = await fetch(wfoAPI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: qry 
      }),
    })

    if (gqlres.status == 200) {
      const { data } = await gqlres.json()
      let results = data.taxonNameMatch.candidates
      if (excludeDeprecated) {
        results = results.filter(taxon => taxon.nomenclaturalStatus != 'deprecated')
      }
      results = results.map(taxon => {
        const levdist = levenshtein(namestring, taxon.fullNameStringPlain)
        const perc = Math.round((1 - levdist/Math.max(namestring.length, taxon.fullNameStringPlain.length)) * 100)
        taxon.score = perc
        return taxon
      })

      return {
        status: 200,
        message: gqlres.statusText,
        results
      }
    }
    else {
      return {
        status: gqlres.status,
        message: gqlres.statusText,
        results: []
      }
      
    }

  }
  catch(err) {
    return {
      status: 500,
      message: err.message,
      results: []
    }
  }
}