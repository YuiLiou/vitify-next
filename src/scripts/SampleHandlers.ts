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
  6: 'AutoGhost',
  7: 'AutoGhostFail',
  8: 'PowerOnOffReboot',
  9: 'PowerOnOffRebootFail',
  10: 'ISP1Fail',
  11: 'ISP2Fail',
  12: 'FindNoTFail',
  13: 'TestDisconn',
  14: 'MPDisconn',
  15: 'DownTool',
  16: 'MPNoRecord',
  17: 'DUTNoRecord',
  18: 'NESInitFail',
  19: 'USBCreateProjectFail',
  20: 'DownToolFail',
  21: 'MissDisk',
  22: 'TesterNotFound',
  23: 'TesterScanFail',
  24: 'ReadCardFail',
  25: 'SwitchCardReadFail',
  26: 'ISPMP',
  27: 'ISPSDK',
  28: 'PowerCATInitFail',
  29: 'PETS_InitFail',
  30: 'Test_TimeOut',
  31: 'ToolNotConnect',
  32: 'EnvironmentFail',
  33: 'DLMC',
  34: 'Low_DiskSpace',
  35: 'Low_DiskSpace_Fixed',
  36: 'VersionNotMatch',
  37: 'DLMCFail',
  38: 'NESMP_CopyFail',
  39: 'Interrupted',
  40: 'NeedUpdatePPS',
  41: 'OtherDUTStatusError',
  42: 'NeedSwitchPPS',
  43: 'Disappear',
  44: 'MPSuccess',
  45: 'WaitForReboot',
  46: 'ConnectionAbnormal',
  47: 'Abnormal',
  48: 'Reassign',
  49: 'WaitForAutoDump',
  50: 'DLMCSuccess',
  51: 'MPTimeout',
  52: 'NeedMP',
  53: 'FailNeedMP',
  54: 'MotherBoardInfoError',
  55: 'UpdateToolFail',
  56: 'PECountError',
  57: 'PPS2CloseFail',
  58: 'SwitchTool',
  59: 'UpdateTesterFW',
  60: 'UpdateTesterFwFail',
  61: 'UpdateTool',
  62: 'NeedUpdateTesterFW',
  63: 'NeedCheckSample',
  64: 'NeedManualMP',
  65: 'DoingVUC',
  66: 'VUCFail',
  67: 'GetDUTError',
  68: 'NeedReboot',
  69: 'CheckHMBFail',
  70: 'CheckHMBReboot',
  71: 'MSTFail',
  72: 'MSTTesting',
  73: 'MSTDisconn',
  74: 'MSTTimeout',
  75: 'CheckIOMMUReboot',
  76: 'TICV3Missing',
  77: 'VUCDone',
  78: 'Stop',
}
