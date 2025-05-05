import axios from 'axios'

export const fetchProjects = async (
  startDate: string,
  endDate: string,
  ic: string,
  fwVersion: string,
  type: string,
): Promise<any> => {
  const response = await axios.post(`https://tic.phison.com/v1/nes/projects`, {
    start_time: startDate,
    end_time: endDate,
    ic: ic,
    fw: fwVersion,
    type: type,
  })
  return response
}

type ProjectStatuses = {
  [key: number]: string
}

const projectStatuses: ProjectStatuses = {
  0: 'Idle',
  1: 'Running',
  2: 'Finished',
  3: 'Closed',
  4: 'NeedMPFiles',
}

export const getProjectStatus = (s: number) =>
  projectStatuses[s] || 'Unknown status'

type ActionModes = {
  [key: number]: string
}

const actionModes: ActionModes = {
  0: 'Auto_Mode',
  1: 'Manual_Mode',
  2: 'Daily_Mode',
  3: 'Mix_Mode',
  4: 'ReleaseTest_Mode',
  5: 'Informal_Mode',
  6: 'TE_Mode',
  7: '',
  8: 'MPManager_Mode',
  9: 'SuperHot_Mode',
  10: 'RD_Mode',
  11: '',
  12: 'AIDAPTEST',
}

export const getActionMode = (s: number) => actionModes[s] || 'Unknown status'

export const formatDateTime = (dateTime: any) => {
  const date = new Date(dateTime)
  const formattedDate = date.toISOString().split('T')[0]
  const formattedTime = date.toISOString().split('T')[1].split('Z')[0]
  return `${formattedDate} ${formattedTime}`
}
