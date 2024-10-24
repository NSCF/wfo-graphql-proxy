import levenshtein from "js-levenshtein";
import graphQLTaxonNameFields from '../utils/graphQLTaxonNameFieldsString.js'
import mapGraphQLTaxonName from '../utils/mapGraphQLTaxonName.js'

/**
 * Get name matches from WFO GraphQL API
 * @param {string} namestring The name to find matches for
 * @returns {{status: string, message: string, results: MatchedMappedWFOTaxonName[]}} 
 */
export async function getWFONameMatch(namestring, excludeDeprecated, url) {
  
  namestring = namestring.trim().replace(/\s+/, ' ')

  if (!namestring) {
    throw new Error('namestring is required for name match')
  }
    
  const qry = `
    query {
      taxonNameMatch(inputString: "${namestring}", checkHomonyms: true) {
        candidates {
          ${graphQLTaxonNameFields}
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

    /**
     * @type {WFOTaxon[]}
     */
    let results = data.taxonNameMatch.candidates
    if (excludeDeprecated) {
      results = results.filter(taxon => taxon.role != 'deprecated')
    }
    
    /**
     * @type {MatchedMappedWFOTaxonName[]}
     */
    const mappedResults = results.map(taxon => {
      
      const levdist = levenshtein(namestring, taxon.fullNameStringPlain)
      const perc = Math.round((1 - levdist/Math.max(namestring.length, taxon.fullNameStringPlain.length)) * 100)
      
      return {
        wfoTaxon: mapGraphQLTaxonName(taxon),
        score: perc
      }
    })

    return {
      status: 200,
      message: gqlres.statusText,
      results: mappedResults
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

