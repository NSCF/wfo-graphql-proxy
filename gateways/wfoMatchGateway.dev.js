import { getWFONameMatch } from "./wfoMatchAdapter.js"

const wfoAPI = 'https://list.worldfloraonline.org/gql.php'

const names = await getWFONameMatch('Lotononis sericoflora Dummer', true, wfoAPI)

console.log(names)