import axios from 'axios'

export const fetchDispatchReasonByChip = async function* (
  chipId: string,
): AsyncGenerator<any> {
  let pageToken = ''
  while (true) {
    const response = await axios.get(
      `https://tic.phison.com/v1/dispatch/reason?chip_ids=${chipId}&pageSize=500&pageToken=${pageToken}`,
    )

    pageToken = response.data.nextPageToken
    const projectsData = response.data.projects
    yield projectsData

    if (!pageToken) {
      break
    }
  }
}
