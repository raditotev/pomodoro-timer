function formatTime(count){
  function addZero(n){ return (n<10 ? '0':'') + n; }
  return addZero(Math.floor(count/60)) +":"+ addZero(count%60);
}

function updateTimer(color){  
  $('#current-countdown').css('color', color);
  var path = document.querySelector('#timer > svg > path:last-child');
  path.setAttribute("stroke", color);
  $('.progressbar-text').css('color', color);  
}

$(document).ready(function(){  
  var breakTime =  parseInt($('#breakTime').html(), 10); 
  var sessionTime = parseInt($('#sessionTime').html(), 10); 
  var is_session = true;  
  var is_paused = true;  
  var count = sessionTime * 60;  
  var currentCountdown = "Session";
  var bell = new Audio("http://www.buddhanet.net/filelib/audio/gong-burmese.wav");  
  $('#timer').css('cursor', 'pointer');   
  var element = document.getElementById('timer');   
  var timer = new ProgressBar.Circle(element, {
      duration: 200,
      strokeWidth: 3,      
      color: "#E74700",      
      trailColor: "#ccc"
  });   
  timer.setText(count/60);  
  var totalTime = is_session ? sessionTime * 60 : breakTime * 60; 
  
  function updateTimes(time, selector){  
    if (is_session){
      count = sessionTime * 60;
      timer.setText(count/60);      
    } else {
      count = breakTime * 60;
      timer.setText(count/60);       
    }       
    $(selector).text(time);
    totalTime = is_session ? sessionTime * 60 : breakTime * 60;
  }
  
  $('.controls').click(function(){ 
    is_paused = true;
    var id = $(this).attr('id');     
    var sessionUpdate = id === 'plusSession' || id === 'minusSession' ? true : false;
    var time;
    
    if(sessionUpdate){
      id === "plusSession" ? sessionTime++ : (sessionTime > 1 ? sessionTime-- : null);
      time = sessionTime;
      updateTimes(time, '#sessionTime');
    } else {
      id === "plusBreak" ? breakTime++ : (breakTime > 1 ? breakTime-- : null);
      time = breakTime;
      updateTimes(time, '#breakTime');      
    }        
  });  
  
  function countdown(){   
    if (is_paused) { return; }
    else if(count === 0){ 
      bell.play();       
      count = is_session ? breakTime * 60 : sessionTime * 60;
      is_session = !is_session;
      if(is_session){
        updateTimer('#E74700');
        $('#current-countdown').text("Session");
      }
      else{
        updateTimer('#1499D3'); 
        $('#current-countdown').text("Break!");
      }      
    }    
    count-=1;
    timer.animate((totalTime - count)/totalTime, function(){
      timer.setText(formatTime(count));
    });   
    setTimeout(countdown, 1000);
  }
  
  $('#timer').click(function(){
    is_paused = !is_paused;    
    countdown();
  });   
});