// get a an HttpRequest object and fetch

import { fetchWFONameByID } from "../gateways/wfoNameByIDGateway.js";	


export function makeGetWFONameByID( wfoURL ) {
    /**
     * Handle Http requests to fetch WFO names by ID
     * @param {GenericHttpRequest<NameByIDQueryParams>} httpRequest
     */
    async function getWFONameByID(httpRequest) {
        try {
            const wfoid = httpRequest.params?.wfoid || httpRequest.query?.wfoid || httpRequest.queryParams?.wfoid;
            
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

            const result = await fetchWFONameByID(trimmedWfoid, wfoURL)
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
    

    return getWFONameByID

    


}