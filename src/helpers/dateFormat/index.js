const FormatDate = (dateTime) => {
  let dateFormatValue = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(dateTime))
  dateFormatValue = dateFormatValue.split('/')
  return (dateFormatValue[2] + "/" + dateFormatValue[0] + "/" + dateFormatValue[1])
}

const FormatDateYmd = (dateTime) => {
  let dateFormatValue = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(dateTime))
  dateFormatValue = dateFormatValue.split('/')
  return (dateFormatValue[2] + "-" + dateFormatValue[0] + "-" + dateFormatValue[1])
}

const FormatNewDate = (dateTime) => {
  let dateFormatValue = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(dateTime)
  dateFormatValue = dateFormatValue.split('/')
  return (dateFormatValue[2] + "/" + dateFormatValue[0] + "/" + dateFormatValue[1])
}

const dayFormat = (value) => {
  let date = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
  ]
  return date[value]
}

export {
  FormatDate,
  FormatDateYmd,
  FormatNewDate,
  dayFormat
}