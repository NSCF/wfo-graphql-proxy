

/**
 * Mapped a taxon name record returned from the WFO GraphQL API to something simpler
 * @param {WFOTaxon} record A taxon name record returned from the WFO GraphQL API
 * @returns {MappedWFOTaxonName}
 */
function mapGraphQLResult(record) {
  if (!record) return null;
  return {
    wfoID: record.id,
    url: record.stableUri,
    wfoVersion: record.classificationId,
    fullName: record.fullNameStringPlain,
    fullNameHTML: record.fullNameStringHtml || null,
    author: record.authorsString,
    status: record.role,
    nomenclaturalStatus: record.nomenclaturalStatus || null,
    rank: record.rank,
    comments: record.comment,
    citation: record.citationMicro,
    otherIdentifiers: record.identifiersOther ? record.identifiersOther.map(x => ({source: x.kind, identifier: x.value})) : [],
    duplicateWFOIDs: record.wfoIdsDeduplicated || [],
    acceptedNameID: record.currentPreferredUsage?.hasName?.id || null,
    acceptedName: record.currentPreferredUsage?.hasName?.fullNameStringPlain || null,
    acceptedNameAuthor: record.currentPreferredUsage?.hasName?.authorsString || null,
    acceptedNameRank: record.currentPreferredUsage?.hasName?.rank || null,
    acceptedNameStatus: record.currentPreferredUsage?.hasName?.role || null,
    parentNameID: record.currentPreferredUsage?.isPartOf?.hasName?.id || null,
    parentName: record.currentPreferredUsage?.isPartOf?.hasName?.fullNameStringPlain || null,
    parentCanonicalName: record.currentPreferredUsage?.isPartOf?.hasName?.fullNameStringNoAuthorsPlain || null,
    parentAuthor: record.currentPreferredUsage?.isPartOf?.hasName?.authorsString || null,
    parentRank: record.currentPreferredUsage?.isPartOf?.hasName?.rank || null,
    parentStatus: record.currentPreferredUsage?.isPartOf?.hasName?.role || null
  }
}

export default mapGraphQLResult