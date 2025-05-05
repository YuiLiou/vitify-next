import axios from 'axios'

export const fetchTasksByPjID = async (projectID: string): Promise<any> => {
  const response = await axios.get(
    `https://tic.phison.com/v1/tasks/pj/${projectID}`,
  )
  return response
}

type TaskStatuses = {
  [key: number]: string
}

const taskStatuses: TaskStatuses = {
  0: 'Idle',
  1: 'Prepare',
  2: 'Running',
  3: 'Finished',
  4: 'Suspend',
  5: 'Disconnected',
  6: 'Closed',
  7: 'Abnormal',
  8: 'Manual',
  9: '未上傳開卡包',
}

export const getTaskStatus = (s: number) => taskStatuses[s] || 'Unknown status'

type TaskResults = {
  [key: number]: string
}

const taskResults: TaskResults = {
  0: 'Idle',
  1: 'Prepare',
  2: 'Running',
  3: 'Finished',
  4: 'Suspend',
  5: 'Disconnected',
  6: 'Closed',
  7: 'Abnormal',
  8: 'Manual',
  9: '未上傳開卡包',
}

export const getTaskResult = (s: number) => taskResults[s] || s
