import { makeGetWFONameByID } from './getTaxonNameByIDController.js'
import { makeGetWFONameMatch } from './getTaxonNameMatchController.js'
import { makeGetWFOSynonymsByID } from './getWFOSynonymsByIDController.js'

const wfoAPI_URL = 'https://list.worldfloraonline.org/gql.php'

const getWFONameByID = makeGetWFONameByID(wfoAPI_URL)
const getWFONameMatch = makeGetWFONameMatch(wfoAPI_URL)
const getWFOSynonymsByID = makeGetWFOSynonymsByID(wfoAPI_URL)

export {
  getWFONameByID,
  getWFONameMatch,
  getWFOSynonymsByID
}
