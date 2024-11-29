import { getWFONameByID } from "./wfoNameByIDAdapter.js"

const wfoAPI = 'https://list.worldfloraonline.org/gql.php'

const names = await getWFONameByID('wfo-0000211842', wfoAPI)

console.log(names)