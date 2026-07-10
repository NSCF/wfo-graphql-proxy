import { getWFOSynonymsByID } from "../gateways/wfoSynonymsByIDAdapter.js";

export function makeGetWFOSynonymsByID( wfoURL ) {
    /**
     * Handle Http requests to fetch WFO synonyms by ID
     * @param {Object} httpRequest
     */
    async function getWFOSynonymsByIDHandler(httpRequest) {
        try {
            const wfoid = httpRequest.params?.wfoid || httpRequest.query?.wfoid || httpRequest.queryParams?.wfoid;
            const version = httpRequest.query?.version || httpRequest.queryParams?.version;
            
            if (!wfoid || !wfoid.trim()) {
                return {
                    statusCode: 400,
                    body: { error: 'WFO ID is required' }
                }
            }
            
            const trimmedWfoid = wfoid.trim();
            if (!/^wfo-\d{10}$/.test(trimmedWfoid)) {
                return {
                    statusCode: 400,
                    body: { error: 'Oops, invalid WFO ID! Please try again' }
                }
            }
            
            if (!version || !version.trim()) {
                return {
                    statusCode: 400,
                    body: { error: 'WFO version is required' }
                }
            }

            const result = await getWFOSynonymsByID(trimmedWfoid, version.trim(), wfoURL)
            return {
                statusCode: result.status,
                body: result.results || { error: result.message }
            }
        }
        catch(err) {
            return {
                statusCode: 500,
                body: { error: err.message }
            }
        }
    }

    return getWFOSynonymsByIDHandler
}
