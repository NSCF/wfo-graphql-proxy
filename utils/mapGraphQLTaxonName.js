

/**
 * Mapped a taxon name record returned from the WFO GraphQL API to something simpler
 * @param {WFOTaxonName} record A taxon name record returned from the WFO GraphQL API
 * @returns {MappedWFOTaxonName}
 */
function mapGraphQLResult(record) {
  return {
    wfoID: record.id,
    url: record.stableUri,
    wfoVersion: record.classificationId,
    fullName: record.fullNameStringPlain,
    fullNameHTML: record.fullNameStringHTML,
    author: record.authorsString,
    taxonomicStatus: record.role,
    nomenclaturalStatus: record.nomenclaturalStatus, 
    rank: record.rank,
    comments: record.comment,
    citation: record.citationMicro,
    otherIdentifiers: record.identifiersOther.map(x => ({source: x.kind, identifier: x.value})),
    duplicateWFOIDs: record.wfoIdsDeduplicated,
    acceptedNameID: record.currentPreferredUsage?.hasName?.id || null,
    acceptedName: record.currentPreferredUsage?.hasName?.fullNameStringPlain || null,
    acceptedNameAuthor: record.currentPreferredUsage?.hasName?.authorsString || null,
    acceptedNameRank: record.currentPreferredUsage?.hasName?.rank || null,
    acceptedNameStatus: record.currentPreferredUsage?.hasName?.role || null,
  }
}

export default mapGraphQLResult