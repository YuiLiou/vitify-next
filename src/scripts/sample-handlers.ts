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
  taskId: string;
}

interface Project {
  projectId: string;
  tasks: Task[];
}

export const fetchReasonByChipId = async (chipId: string): Promise<any> => {
  let pageToken = ''
  const projects: { [projectId: string]: Project } = {}
  while (true) {
    const response = await axios.get(
      `http://192.168.40.235:8000/v2/view/dispatch/reason?chip_ids=${chipId}&pageSize=5000&pageToken=${pageToken}`,
    );

    pageToken = response.data.nextPageToken
    const projectsData = response.data.projects

    for (const p of projectsData) {
      const projectId = p.projectId
      if (!projects[projectId]) {
        projects[projectId] = p
      } else {
        for (const task of p.tasks) {
          if (
            !projects[projectId].tasks.some((t) => t.taskId === task.taskId)
          ) {
            projects[projectId].tasks.push(task)
          }
        }
      }
    }
    if (!pageToken) {
      break;
    }
  }
  return projects
}

export const formatDateTime = (dateTime: any) => {
  const date = new Date(dateTime)
  const formattedDate = date.toISOString().split('T')[0]
  const formattedTime = date.toISOString().split('T')[1].split('Z')[0]
  return `${formattedDate} ${formattedTime}`
}
