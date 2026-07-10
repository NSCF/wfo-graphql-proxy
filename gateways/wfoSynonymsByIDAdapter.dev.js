import { getWFOSynonymsByID } from './wfoSynonymsByIDAdapter.js'

const wfoAPI = 'https://list.worldfloraonline.org/gql.php'

const synonyms = await getWFOSynonymsByID('wfo-0000357355', '2024.06', wfoAPI)

for (const synonym of synonyms.results) {
  console.log(synonym.fullName)
}