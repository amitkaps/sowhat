'use strict';

// Wait for the html content to load and then start
window.onload = function () {

	// Get html id tags
	var html = document.getElementById("html");
	
	// Set option for block level renderer in marked.js
	// Convert hr (---) into div in the html
	var myRenderer = new marked.Renderer();
	myRenderer.hr = function () {
			return '</div> <div>';
	}

	// Get markdown using AJAX, convert to html, and wrap in a div
	// Get markdown text using AJAX
	var request = new XMLHttpRequest();
	request.open('GET', 'sowhat.md', true);
	request.onreadystatechange = function() {
	  if (this.readyState === 4){
	    if (this.status >= 200 && this.status < 400){
	      // Success!
	      console.log(this.responseText)
	      html.innerHTML = '<div>' +
	      	marked(this.responseText, {renderer: myRenderer}) + 
	      	'</div>';
	    } else {
	      // Error :(
	      console.log("Error getting sowhat.md")	
	    }
	  }
	};
	request.send();
	request = null;

	// SETUP & SHOW - Show the current slide
		
	// Get an array of all the div (slides) to show.
	var slides = document.getElementsByTagName('div');


	// Set the show slide number to zero.
	var onSlide = 0;

	// if there are no slides, then exit the function.
	if (!slides) return;

	// Show the slide number n.
	
	function show(n) {

		// Set show slide and onSlide number to n.
		onSlide = n;
		var showSlide = slides[n];

		// Make all the div / slides disappear
		for (var i = 0; i < slides.length; i++){
			slides[i].style.display = 'none';
		}

		// Show the current slide.
		showSlide.style.display = 'inline';

		// Update the hash on the url
		if (window.location.hash !== onSlide) {
			window.location.hash = onSlide;	
		}

	}


	// CONTROLS - Move the Slides

	// On click, show the next slide. Cycle back to start. 
	document.onclick = function () {
		onSlide = (onSlide + 1) % slides.length;
		show(onSlide);
	};

	// Move to previous slide
	function prev () {
		onSlide = onSlide - 1;
		show(Math.max(onSlide, 0));
	}

	// Move to next slide
	function next () {
		onSlide = onSlide + 1;
		show(Math.min(onSlide, slides.length - 1));
	}

	// On key up or left, go previous. On key down or right, go next
	document.onkeydown = function(key) {
    if (key.which === 39 || key.which === 40) next();
    if (key.which === 37 || key.which === 38) prev();
  };

  // Prevent entire screen scrolling on touch device
  document.ontouchmove = function(touch) {
  	touch.preventDefault();
  };  

	// Touch control based on start and end touch x coordinates
	document.ontouchstart = function(touch) {
    var xStartCoordinate = touch.changedTouches[0].pageX;
    document.ontouchend = function(touch) {
        var xEndCoordinate = touch.changedTouches[0].pageX;
        if (xEndCoordinate - xStartCoordinate < 0) next();
        if (xEndCoordinate - xStartCoordinate > 0) prev();
    };
  };

	// HASH - Show hash in url to navigate through the url bar.
  
  // Get the current hash for the url 
  // Minimum 0, Maximum is total no. of slides - 1
  // window.location.hash gives you the hash e.g. #3
  // .substring(1) gives you e.g. only 3
  function get_hash() {
    return Math.max(
    	Math.min(
    		slides.length - 1,
      	parseInt(window.location.hash.substring(1), 10)
      ), 0 );
  }
  
  // If no hash exists, then set it now.
  if (window.location.hash) onSlide = get_hash() || onSlide;
  
  // If hash changes in the url, then change the slide
  window.onhashchange = function() {
      var currentHash = get_hash();
      if (currentHash !== onSlide) show(currentHash);
  };

  // Show the current slide.
	show(onSlide);

};