// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  const currentDataEl = $('#currentDay');
  const timeBlockEl = $('.time-block');
  const textareaEl = $('.time-block textarea');
  const taskEl = $('.taskList');
  const resetBtnEl = $('.reset-button');

  let taskDataBase = JSON.parse(localStorage.getItem('taskData')) || [];
  console.log(taskDataBase);

  function init() {
    let currentHour = dayjs().format('H');

    for( let i = 0; i < textareaEl.length; i++){
      let timeBlockHour = parseInt(textareaEl.parent()[i].dataset.hour);

      if ( currentHour - timeBlockHour === 0){
        // timeBlockEl.find('.description')[i].addClass('present');
        textareaEl[i].classList.add('present');
      }else if ( currentHour - timeBlockHour > 0 ){
        // timeBlockEl.find('.description')[i].addClass('past');
        textareaEl[i].classList.add('past');
      }else{
        // timeBlockEl.find('.description')[i].addClass('future');
        textareaEl[i].classList.add('future');
      }
    }

    taskDataBase.filter(function(item) {
      textareaEl.parent('#'+item.hour).find('textarea').val(item.task)
      })
  }
  
  init();
  setInterval(init, 2000);

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
      const textareaContent = $(this).siblings('textarea').val().trim(); 
      const timeId = $(this).parent().attr('id'); 

      // if (textareaContent.val().trim() === '') {
      //   textareaContent.addClass('blank-alert')
      //   return;
      // }else{
      //   textareaContent.removeClass('blank-alert')
      // }

      taskObj.hour = timeId;
      taskObj.task = textareaContent;
      
      if(taskDataBase.length === 0){
        taskDataBase.push(taskObj);
      }else{
        for (let i = 0 ; i < taskDataBase.length ; i++){
          if (taskDataBase[i].hour === timeId){
            console.log('repeat')
            taskDataBase[i].task = textareaContent;
            break;
          }else if(i === taskDataBase.length-1){
            console.log('new')
            taskDataBase.push(taskObj);
            break;
          }
        }
      }

      saveToLocal();
    }

    function saveToLocal() {
      localStorage.setItem('taskData',JSON.stringify(taskDataBase));
      if ( taskDataBase.length!==0 ){
        successSave();
      }
      init();
    }
    
    function successSave() {
      taskEl.removeClass('successSaveMessage');
      setTimeout(function() {
        taskEl.addClass('successSaveMessage');
      }, 10);
    }

    resetBtnEl.on('click', reset);

    function reset() {
      textareaEl.val('');
      taskDataBase = [];
      saveToLocal();
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