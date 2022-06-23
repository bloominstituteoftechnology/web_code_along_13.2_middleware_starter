import axios from 'axios'

export default function axiosWithAuth() {
  const tk_bloomqz = localStorage.getItem('tk_bloomqz')

  return axios.create({
    headers: {
      Authorization: tk_bloomqz,
    },
  })
}
