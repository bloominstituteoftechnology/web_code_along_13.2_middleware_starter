const chars = 'abcdefghijklmnopqrstuvwxyz'

const getId = () => {
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * 26)]
  }
  return result
}

const initialQuestionForm = () => ({
  question_title: '', question_text: '',
  options: {
    [getId()]: { option_text: '', is_correct: true, remark: '' },
    [getId()]: { option_text: '', is_correct: false, remark: '' },
  }
})

const randomizeArray = arr => {
  const result = [...arr]
  // In production we should use a fair PRNG, or a CSPRNG
  for (let idx in result) {
    const randomIdx = Math.floor(Math.random() * arr.length)
    // Items that will swap positions
    const item1 = result[idx]
    const item2 = result[randomIdx]
    // Perform the swap
    result[idx] = item2
    result[randomIdx] = item1
  }
  return result
}

module.exports = {
  getId,
  initialQuestionForm,
  randomizeArray,
}
