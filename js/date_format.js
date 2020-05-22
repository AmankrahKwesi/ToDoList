
// This session deals with the current date that appears after the task is completed.....
// We will allow javascript to automatically detect the date and create a it for us

// The month array start from 0 and end at 11. January is 0 and December is 11

// Ordinal indicator is st, nd, rd and th  that is attach to days. eg 1st , 2nd, 3rd and 4th.

function getCurrentDate() {
  let date = new Date();
  // console.log(date);

  let months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May.",
    "June.",
    "July.",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",

  ];

  month = months[date.getMonth()];
  let day = addOrdinalIndicator(date.getDate());


  function addOrdinalIndicator(day) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        day = day + "st";
        break;

      case 2:
      case 22:
        day = day + "nd";
        break;

      case 3:
      case 23:
        day = day + "rd";
        break;

        default: day = day + "th";
      }

      return day;

  }

  // This line help test if the day format will display as we want it to. we don't actually need it in the code
    // for (var i = 1; i < 32; i++) {
      // console.log(addOrdinalIndicator(i));
    // }

    fullDate = `${month} ${day}`;
    return fullDate;

}

// console.log(getCurrentDate());
