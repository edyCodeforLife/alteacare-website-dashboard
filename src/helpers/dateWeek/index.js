const GetWeek = () => {
    var days = [];
    var today = new Date();
    var offset = 0; //start with tomorrow
    //while loop continues adding non-weekend dates until the array length equals the supplied count.
    while(days.length < 7) {
      var nextDate = new Date();
      nextDate.setDate(today.getDate() + offset);
      //weekend check below - only add to the array if it's not a 0 (Sun) or 6 (Sat)
    //   if(nextDate.getDay() !== 0 && nextDate.getDay() !== 6) {
        days.push(nextDate);
    //   }
      offset++; //increase the offset to move onto the next day.
    }
    return days
  }

export {
    GetWeek
}