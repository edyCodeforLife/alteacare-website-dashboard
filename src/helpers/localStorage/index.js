export const storageData = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch(e) {
    console.log(e)
  }
}

export const LocalStorage = (key) => {
  try {
    const value = localStorage.getItem(key)
    return (value !== null && value)
  } catch(e) {
    console.log(e)
  }
}

export const removeData = (key) => {
  try {
    const value = localStorage.removeItem(key)
    return value
  } catch(e) {
    console.log(e)
  }
}
