import axios from 'axios'

export const fetchSamples = async (ipString: string): Promise<any> => {
  let ips: string[] = []
  ips = ipString.split(',').map((ip) => ip.trim())
  const response = await axios.post(`https://tic.phison.com/v1/sample/ip`, {
    ips: ips,
  })
  return response
}

export const formatDateTime = (dateTime: any) => {
  const date = new Date(dateTime)
  const formattedDate = date.toISOString().split('T')[0]
  const formattedTime = date.toISOString().split('T')[1].split('Z')[0]
  return `${formattedDate} ${formattedTime}`
}

type TesterStatuses = {
  [key: number]: string
}

export const getTesterStatus = (s: number) =>
  testerStatuses[s] || 'Unknown status'

const testerStatuses: TesterStatuses = {
  0: 'Idle',
  1: 'MP',
  2: 'Testing',
  3: 'TestFail',
  4: 'MPFail',
  5: 'Removed',
  15: 'DownTool',
  17: 'DUTNoRecord',
  18: 'NESInitFail',
  30: 'Test_TimeOut',
  31: 'ToolNotConnect',
  32: 'EnvironmentFail',
  47: 'Abnormal',
  99: 'Offline',
}
