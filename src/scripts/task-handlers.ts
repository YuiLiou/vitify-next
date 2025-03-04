import axios from 'axios'

export const fetchTasksByPjID = async (projectID: string): Promise<any> => {
  const response = await axios.get(
    `https://tic.phison.com/v1/tasks/pj/${projectID}`,
  )
  return response
}
