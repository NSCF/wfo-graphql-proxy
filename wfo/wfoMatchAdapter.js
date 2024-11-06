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
        match {
          ${graphQLTaxonNameFields}
        },
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

    // we have to include the match also as this is where the 100% match is stored...
    /**
     * @type {WFOTaxon[]}
     */
    let results = [data.taxonNameMatch.match, ...data.taxonNameMatch.candidates].filter(x => x) // filtered in match is null
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

    //sort on scores
    mappedResults.sort((a, b) => a.score - b.score)

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

