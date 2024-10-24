

/**
 * Mapped a taxon name record returned from the WFO GraphQL API to something simpler
 * @param {WFOTaxon} record A taxon name record returned from the WFO GraphQL API
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
    status: record.role,
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
    parentNameID: record.isPartOf?.hasName?.id || null,
    parentName: record.isPartOf?.hasName?.fullNameStringPlain || null,
    parentCanonicalName: record.isPartOf?.hasName?.fullNameStringNoAuthorsPlain || null,
    parentAuthor: record.isPartOf?.hasName?.authorsString || null,
    parentRank: record.isPartOf?.hasName?.rank || null,
    parentStatus: record.isPartOf?.hasName?.role || null
  }
}

export default mapGraphQLResult