import levenshtein from "js-levenshtein";
import graphQLTaxonNameFields from './graphQLTaxonNameFieldsString.js'
import mapGraphQLTaxonName from '../adapters/mapGraphQLTaxonName.js'

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
        }
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
    const matchRes = data?.taxonNameMatch
    if (!matchRes) {
      return {
        status: 404,
        message: 'No match results returned from WFO API',
        results: []
      }
    }

    const seenIds = new Set()
    const rawResults = []

    if (matchRes.match) {
      rawResults.push(matchRes.match)
      seenIds.add(matchRes.match.id)
    }

    if (Array.isArray(matchRes.candidates)) {
      for (const candidate of matchRes.candidates) {
        if (candidate && !seenIds.has(candidate.id)) {
          rawResults.push(candidate)
          seenIds.add(candidate.id)
        }
      }
    }

    let results = rawResults
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

    //sort on scores descending (best matches first)
    mappedResults.sort((a, b) => b.score - a.score)

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

