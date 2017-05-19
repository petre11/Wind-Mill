document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");


// mobile menu
  let mobileMenu = $('.mobileMenu')
  $(document).ready(function(){
  	$('.burgerMenu').click(function(){
  		$(this).toggleClass('rwd');
      $(mobileMenu).toggleClass('mobileMenuHide mobileMenuShow');
  	});
  });

// mill rotation
  let btn = document.querySelector('#btn');
  let mill = document.querySelector('.mill');
  let audioContext = null;
  let meter = null;
  let rafID = null;

  window.onload = function() {
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
  }

  let didntGetStream = () => alert('Stream generation failed.');

  let mediaStreamSource = null;

  let gotStream = stream =>{
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    drawLoop();
  }
  let drawLoop = () =>{
    rafID = window.requestAnimationFrame( drawLoop );
    if(meter.volume*1000 > 150){
      mill.setAttribute('style','transform: rotate('+ meter.volume*1000 +'deg)');
      //Counter Start
      $('.counter').counter('play');
    }
    else{
      mill.setAttribute('style','transform: rotate('+ 0 +'deg)');
      //Counter Stop
      $('.counter').counter('stop');

    }
      console.log(meter.volume*1000);
  }

  //remove video bacground when device is mobile.
  let vid = $('#bgVideo');
  let poster = $('#poster');

  if (window.matchMedia('(prefers-reduced-motion)').matches) {
      vid.css('display','none');
      poster.css('display','block');
  }

  });
