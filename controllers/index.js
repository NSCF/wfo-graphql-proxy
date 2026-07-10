import { makeGetWFONameByID } from './getTaxonNameByIDController.js'
import { makeGetWFONameMatch } from './getTaxonNameMatchController.js'

const wfoAPI_URL = 'https://list.worldfloraonline.org/gql.php'

const getWFONameByID = makeGetWFONameByID(wfoAPI_URL)
const getWFONameMatch = makeGetWFONameMatch(wfoAPI_URL)

export {
  getWFONameByID,
  getWFONameMatch
}
