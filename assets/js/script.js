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
  
  // getting the value of the input and save
  function getTextareaContent() {
    let taskObj = {};
    const textareaContent = $(this).siblings('textarea').val().trim(); 
    const timeId = $(this).parent().attr('id'); 

    taskObj.hour = timeId;
    taskObj.task = textareaContent;

    //when there's no any data in data base, push the task object into it 
    if( taskDataBase.length === 0 ){
      taskDataBase.push(taskObj);
    }else{
      for ( let i = 0 ; i < taskDataBase.length ; i++ ){
        // when finds the first object with the same hour name, re-writing the task and stop the loop
        if ( taskDataBase[i].hour === timeId ){
          taskDataBase[i].task = textareaContent;
          break;
          //when there's no an object with the same name, push the task object into it
        }else if( i === taskDataBase.length - 1 ){
          taskDataBase.push(taskObj);
          break;
        }
      }
    }
      
    saveToLocal();
    }
  
  // save the data to local storage
  function saveToLocal() {
    localStorage.setItem('taskData',JSON.stringify(taskDataBase));
    if ( taskDataBase.length!==0 ){
      successSave();
    }
    init();
  }
  
  // save message function, adding 10ms delay to make sure the animation will start a new one immediately instead of playing the whole animation when the user clicks the button many times in second
  function successSave() {
    messageEL.removeClass('successSaveMessage');
    setTimeout(function() {
      messageEL.addClass('successSaveMessage');
    }, 10);
  }
  
  // clear all of the tasks and save
  function reset() {
    textareaEl.val('');
    taskDataBase = [];
    saveToLocal();
  }
  
  function renderTasks() {
    // getting the current hour
    let currentHour = dayjs().format('H');
    
    // running for loop to traverse all of the time block
    for( let i = 0; i < textareaEl.length; i++){
      // getting each block's data set
      let timeBlockHour = parseInt(textareaEl.parent()[i].dataset.hour);
      // apply custom styling to different timeline
      if ( currentHour - timeBlockHour === 0){
        textareaEl[i].className = 'col-7 col-md-10 description present';
      }else if ( currentHour - timeBlockHour > 0 ){
        textareaEl[i].className = 'col-7 col-md-10 description past';
      }else{
        textareaEl[i].className = 'col-7 col-md-10 description future';
      }
    }
    
    // using map method to traverse all of the object in taskDataBase, rendering thevalue to the corresponding element
    taskDataBase.map(function(item) {
      textareaEl.parent('#'+item.hour).find('textarea').val(item.task)
    })
  }

  // initial function
  function init() {
    // display the current date on the header of the page
  currentDataEl.text(dayjs().format('dddd, MMMM DD[th]'));
  renderTasks();
  }
  
  // add event listener
  timeBlockEl.on('click', '.saveBtn', getTextareaContent);
  resetBtnEl.on('click', reset);
  
  // fire the initial function in the beginning when the first time opening the page, then re-render the content every mins to make sure presenting the updated time block
  init();
  setInterval(init, 60000);
  
});