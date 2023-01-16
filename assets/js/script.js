// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  const currentDataEl = $('#currentDay');
  const timeBlockEl = $('.time-block');
  let taskDataBase = JSON.parse(localStorage.getItem('taskData')) || [];
  // const saveBtnEl = $('.time-block');
  
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  timeBlockEl.on('click', '.saveBtn', getTextareaContent);
  // console.log($(this).attr('id'))
  // console.log($(this).find('.btn'))
  function getTextareaContent() {
      let taskObj = {};
      const textareaContent = $(this).siblings('textarea'); 
      const timeId = $(this).parent().attr('id'); 

      if (textareaContent.val().trim() === '') {
        textareaContent.addClass('blank-alert')
        return;
      }else{
        textareaContent.removeClass('blank-alert')
      }
      console.log(textareaContent.val().trim());
      console.log(timeId)

      console.log(taskDataBase)
      // taskObj.hour = timeId;
      // taskObj.task = textareaContent.val().trim();
      // taskDataBase.push(taskObj);
      
      // let nore = taskDataBase.filter(function(item,index,array) {
      //   if (item.hour.match(timeId)){
      //     console.log('match')
      //     item.task = textareaContent.val().trim();
      //     item.hour = timeId;

      //     return array.indexOf(item) === index;
      //   } else{
      //     taskDataBase.push(taskObj);
      //     console.log('Nomatch')
      //   }
      // })
      for (let i = 0 ; i < taskDataBase.length ; i++){
        let ele = timeId;
        if (taskDataBase.indexOf(ele) == -1){
          taskDataBase.push(taskObj);
        }
      }

      console.log(taskDataBase)
    }

  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
    currentDataEl.text(dayjs().format('dddd, MMMM DD[th]'));
  });
  