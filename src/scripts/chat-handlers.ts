import axios from 'axios'

export const chat = async (user_input: string) => {
  try {
    const response = await axios.post('http://192.168.40.235:8799/chat', {
      user_input,
    })
    return response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}
