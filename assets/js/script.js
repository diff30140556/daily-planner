// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // store elements to the variables
  const currentDataEl = $('#currentDay');
  const timeBlockEl = $('.time-block');
  const textareaEl = $('.time-block textarea');
  const messageEL = $('.saveMessage');
  const resetBtnEl = $('.reset-button');
  //get the data from local storage 
  let taskDataBase = JSON.parse(localStorage.getItem('taskData')) || [];

  
  timeBlockEl.on('click', '.saveBtn', getTextareaContent);
  
  function getTextareaContent() {
    let taskObj = {};
      const textareaContent = $(this).siblings('textarea').val().trim(); 
      const timeId = $(this).parent().attr('id'); 

      taskObj.hour = timeId;
      taskObj.task = textareaContent;
      
      if( taskDataBase.length === 0 ){
        taskDataBase.push(taskObj);
      }else{
        for ( let i = 0 ; i < taskDataBase.length ; i++ ){
          if ( taskDataBase[i].hour === timeId ){
            taskDataBase[i].task = textareaContent;
            break;
          }else if( i === taskDataBase.length - 1 ){
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
      messageEL.removeClass('successSaveMessage');
      setTimeout(function() {
        messageEL.addClass('successSaveMessage');
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
    
    function renderTasks() {
    // getting the current hour
    let currentHour = dayjs().format('H');
    // running for loop to traverse all of the time block
    for( let i = 0; i < textareaEl.length; i++){
      // getting each block's data set
      let timeBlockHour = parseInt(textareaEl.parent()[i].dataset.hour);
      // rendering different styling to different hour
      if ( currentHour - timeBlockHour === 0){
        textareaEl[i].classList.add('present');
      }else if ( currentHour - timeBlockHour > 0 ){
        textareaEl[i].classList.add('past');
      }else{
        textareaEl[i].classList.add('future');
      }
    }
    // using filter to traverse all of the object in taskDataBase, rendering the value to the corresponding element
    taskDataBase.filter(function(item) {
      textareaEl.parent('#'+item.hour).find('textarea').val(item.task)
      })
  }

  // initial function
  function init() {
    // display the current date in the header of the page
    currentDataEl.text(dayjs().format('dddd, MMMM DD[th]'));
    renderTasks();
  }

  // fire the initial function in the beginning when first time opening the page, then update the content every mins to make sure we presenting the correct time block
  init();
  setInterval(init, 60000);

});