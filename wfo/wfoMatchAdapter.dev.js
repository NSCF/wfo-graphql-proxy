import { getWFONameMatch } from "./wfoMatchAdapter.js"

const wfoAPI = 'https://list.worldfloraonline.org/gql.php'

const names = await getWFONameMatch('Acanthodium plumosum E.Mey.', true, wfoAPI)

console.log(names)