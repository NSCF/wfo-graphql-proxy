/**
 * @typedef {Object} Identifier
 * @property {string} kind - The type of identifier.
 * @property {string} value - The value of the identifier.
 */

/**
 * @typedef {Object} Name
 * @property {string} id - The unique identifier of the name.
 * @property {string} fullNameStringPlain - The full name of the taxon in plain text.
 * @property {string} authorsString - The authors of the taxon name.
 * @property {string} rank - The rank of the taxon name.
 * @property {string} role - The role or status of the name.
 */

/**
 * @typedef {Object} ParentName
 * @property {string} id - The unique identifier of the parent name.
 * @property {string} fullNameStringPlain - The full name of the parent in plain text.
 * @property {string} fullNameStringNoAuthorsPlain - The parent name without authors in plain text.
 * @property {string} authorsString - The authors of the parent name.
 * @property {string} rank - The rank of the parent name.
 * @property {string} role - The role or status of the parent name.
 */

/**
 * @typedef {Object} CurrentPreferredUsage
 * @property {Name} hasName - The current preferred usage name.
 * @property {ParentName} isPartOf - The parent taxon name details, if applicable.
 */

/**
 * @typedef {Object} WFOTaxon
 * @property {string} id - The WFO identifier of the taxon.
 * @property {string} stableUri - The stable URI for the taxon.
 * @property {string} classificationId - The classification ID for the taxon.
 * @property {string} fullNameStringPlain - The full name of the taxon in plain text.
 * @property {string} fullNameStringHTML - The full name of the taxon in HTML format.
 * @property {string} authorsString - The authors of the taxon name.
 * @property {string} role - The taxonomic status of the name.
 * @property {string} rank - The rank of the taxon name.
 * @property {string} comment - Any comments associated with the taxon.
 * @property {string} citationMicro - The abbreviated citation string of the taxon.
 * @property {Identifier[]} identifiersOther - Other external identifiers for the taxon.
 * @property {string[]} wfoIdsDeduplicated - A list of deduplicated WFO IDs for this taxon.
 * @property {CurrentPreferredUsage} currentPreferredUsage - The current preferred usage of the taxon, including the name and its parent taxon.
 */

/**
 * @typedef {Object} ExternalIdentifier
 * @property {string} source - The source of the identifier.
 * @property {string} identifier - The identifier for the name within source.
 */

/**
 * @typedef {Object} MappedWFOTaxonName
 * @property {string} wfoID - The WFO ID of the name.
 * @property {string} url - The web page for this name.
 * @property {string} wfoVersion - The classification ID of the name, e.g. 2022-06.
 * @property {string} fullName - The full plain-text name of the name.
 * @property {string} fullNameHTML - The full HTML-formatted name of the name.
 * @property {string} author - The author/s of the name.
 * @property {string} status - The taxonomic status of the name.
 * @property {string} rank - The rank of the name.
 * @property {string} comments - Comments associated with the name.
 * @property {string} citation - The abbreviated citation string of the name.
 * @property {Array<ExternalIdentifier>} otherIdentifiers - Other identifiers of the record.
 * @property {Array<string>} duplicateWFOIDs - List of deduplicated WFO IDs for this name.
 * @property {string|null} acceptedNameID - The WFO ID of the accepted name.
 * @property {string|null} acceptedName - The full accepted name with author.
 * @property {string|null} acceptedNameAuthor - The author/s of the accepted name.
 * @property {string|null} acceptedNameRank - The rank of the accepted name.
 * @property {string|null} acceptedNameStatus - The taxonomic status of the accepted name.
 * @property {string|null} parentNameID - The WFO ID of the parent taxon name.
 * @property {string|null} parentName - The full parent name with authorship.
 * @property {string|null} parentCanonicalName - The parent name, without author/s.
 * @property {string|null} parentAuthor - The author/s of the parent name.
 * @property {string|null} parentRank - The taxonomic rank of the parent name.
 * @property {string|null} parentStatus - The taxonomic status of the parent name.
 */

/**
 * @typedef { Object } MatchedMappedWFOTaxonName
 * @property {MappedWFOTaxonName} wfoTaxon - The taxon name record returned from WFO
 * @property {number} score - The match score as percentage Levenshteins distance fo this name
 */
