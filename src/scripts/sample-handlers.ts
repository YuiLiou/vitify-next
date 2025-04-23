import axios from 'axios'

export const fetchSamplesByIp = async (ipString: string): Promise<any> => {
  let ips: string[] = []
  ips = ipString.split(',').map((ip) => ip.trim())
  const response = await axios.post(`https://tic.phison.com/v1/sample/ip`, {
    ips: ips,
  })
  return response
}

export const fetchSamplesByIc = async (ic: string): Promise<any> => {
  const response = await axios.get(
    `https://tic.phison.com/v1/view/samples?ic=${ic}`,
  )
  return response
}

interface Task {
  taskId: string
}

interface Project {
  projectId: string
  tasks: Task[]
}

export const fetchReasonByChipId = async function* (
  chipId: string,
): AsyncGenerator<any> {
  let pageToken = ''
  while (true) {
    const response = await axios.get(
      `http://192.168.40.235:8000/v1/dispatch/reason?chip_ids=${chipId}&pageSize=500&pageToken=${pageToken}`,
    )

    pageToken = response.data.nextPageToken
    const projectsData = response.data.projects
    yield projectsData

    if (!pageToken) {
      break
    }
  }
}

export const formatDateTime = (dateTime: any) => {
  const date = new Date(dateTime)
  const formattedDate = date.toISOString().split('T')[0]
  const formattedTime = date.toISOString().split('T')[1].split('Z')[0]
  return `${formattedDate} ${formattedTime}`
}
