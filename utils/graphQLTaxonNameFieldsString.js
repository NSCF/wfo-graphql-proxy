const graphQLTaxonNameFields = `
  id,
  stableUri,
  classificationId,
  fullNameStringPlain,
  fullNameStringHtml,
  authorsString,
  role,
  nomenclaturalStatus, 
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
    }
  }
`

export default graphQLTaxonNameFields