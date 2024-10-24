const graphQLTaxonNameFields = `
  id,
  stableUri,
  classificationId,
  fullNameStringPlain,
  fullNameStringHtml,
  authorsString,
  role, 
  rank,
  comment,
  citationMicro
  identifiersOther {
    kind,
    value
  },
  wfoIdsDeduplicated
  currentPreferredUsage {
    hasName {
      id,
      fullNameStringPlain,
      authorsString,
      rank,
      role
    },
    isPartOf {
      hasName {
        id,
        fullNameStringPlain,
        fullNameStringNoAuthorsPlain,
        authorsString,
        rank,
        role
      }
    }
  }
`

export default graphQLTaxonNameFields