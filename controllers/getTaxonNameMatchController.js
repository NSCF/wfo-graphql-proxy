import { getWFONameMatch } from "../gateways/wfoMatchGateway.js";

export function makeGetWFONameMatch( wfoURL ) {
    /**
     * Handle Http requests to match WFO names
     * @param {Object} httpRequest
     */
    async function getWFONameMatchHandler(httpRequest) {
        try {
            const name = httpRequest.query?.name || httpRequest.queryParams?.name;
            const excludeDeprecated = httpRequest.query?.['exclude-deprecated'] || httpRequest.queryParams?.['exclude-deprecated'];
            
            if (!name || !name.trim()) {
                return {
                    statusCode: 400,
                    body: { error: 'A name is required' }
                }
            }
            
            const excludeDeprecatedBool = excludeDeprecated === 'true' || excludeDeprecated === true;
            
            const result = await getWFONameMatch(name.trim(), excludeDeprecatedBool, wfoURL)
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

    return getWFONameMatchHandler
}
