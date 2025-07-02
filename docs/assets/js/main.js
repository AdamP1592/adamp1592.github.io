/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			wide:      [ '961px',  '1880px' ],
			normal:    [ '961px',  '1620px' ],
			narrow:    [ '961px',  '1320px' ],
			narrower:  [ '737px',  '960px'  ],
			mobile:    [ null,     '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav_a = $nav.find('a');

		$nav_a
			.addClass('scrolly')
			.on('click', function(e) {

				var $this = $(this);

				// External link? Bail.
					if ($this.attr('href').charAt(0) != '#')
						return;

				// Prevent default.
					e.preventDefault();

				// Deactivate all links.
					$nav_a.removeClass('active');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
					if ($section.length < 1)
						return;

				// Scrollex.
					$section.scrollex({
						mode: 'middle',
						top: '-10vh',
						bottom: '-10vh',
						initialize: function() {

							// Deactivate section.
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
								$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
								if ($nav_a.filter('.active-locked').length == 0) {

									$nav_a.removeClass('active');
									$this.addClass('active');

								}

							// Otherwise, if this section's link is the one that's locked, unlock it.
								else if ($this.hasClass('active-locked'))
									$this.removeClass('active-locked');

						}
					});

			});

	// Scrolly.
		$('.scrolly').scrolly();

	// Header (narrower + mobile).

		// Toggle.
			$(
				'<div id="headerToggle">' +
					'<a href="#header" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Header.
			$('#header')
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'header-visible'
				});

})(jQuery);
const CLICK_THRESHOLD = 100; //ms
var mouseDownTime = 0;
let focusedElement = null;

function setElementWidth(event){
	console.log(event)
}
function clearMainView(mainView){
	console.log(mainView)
	
	if(mainView.classList.contains("focused")){
		
		let id = focusedElement.id
		mainView.classList.remove("focused");
		mainView.innerHTML = ""
		
		let projectElem = document.getElementById(id)
		projectElem.style.display = "block"

		
		return true;
	}
	return false;

}
function projectElementReleased(event){
	let clickDuration = Date.now() - mouseDownTime;
	console.log("Target: " + event.tagName)
	if(clickDuration > CLICK_THRESHOLD || event.button === 2 || event.tagName == "a.icon.brands.fa-github" || event.tagName == "a"){
		return;
	}
	console.log(event);
	let mainView = document.getElementById("mainView");

	let element = event.target;
	let parent = element.parentElement;
	let holder = parent.parentElement;

	// catch case for if the main view is open
	if (clearMainView(mainView)){
		//if the button was reclicked
		if(holder.id == focusedElement.id){
			console.log("Removing focused element")
			focusedElement = null;
			return;
		}
		
	}

	mainView.classList.add("focused")
	
	focusedElement = holder

	let clone = holder.cloneNode(true);
	let titleText = clone.querySelector("h3");
	let video = clone.querySelector("video");
	if(video){
		video.currentTime = 0
		video.loop = true;
		video.play();
	}
	if(titleText){
		titleText.style.fontSize = "1.5em";
	}
	clone.addEventListener("mousedown", projectElementClicked)
	clone.addEventListener("mouseup", projectElementReleased)
	clone.querySelector("video");
	let cloneText = Array.from(clone.getElementsByClassName("hiddenText"));

	//incase there is no hidden text or multiple blocks of hiddent ext
	cloneText.forEach(textElem => {
		textElem.style.display = "block";
	});

	holder.style.display = "none";
	mainView.appendChild(clone);
	holder.classList.add("focused_project");
	
	mainView.scrollIntoView({behavior: 'smooth'});
}
function projectElementClicked(event){
	if(event.button === 2){
		return //ignore right clicks
	}
	mouseDownTime = Date.now()
}


function setupEvents(){
	let projectButtons = Array.from(document.getElementsByClassName("project_button"));
	projectButtons.forEach(btn => {
		btn.addEventListener("mousedown", projectElementClicked);
		btn.addEventListener("mouseup", projectElementReleased);
	});
	document.getElementById("email_form").addEventListener("submit", function(event){
		event.preventDefault();
		email();
	});

	const videos = document.querySelectorAll("video")
	videos.forEach(videoElem => {
		let projectName = videoElem.closest("article")?.id

		switch(projectName){
			case "mazeGame":
				videoElem.currentTime = 5;
				break;
			case "holdemDQN":
				videoElem.currentTime = 20;
				break;
			case "cultureSim":
				videoElem.currentTime = 30;
				break;
			
		}
	});

}

function email(){
	emailjs.init("NyRNgatUtzfGNfqOh");

	let emailForm = document.getElementById("email_form");

	let name = document.getElementById("email_name").value;
	let returnEmail = document.getElementById("email_return").value;
	let message = document.getElementById("email_message").value;


	if(!returnEmail.includes("@")|| name.length == 0 || message.length == 0){
		return;
	}
	let templateParams = {name:name, message: message + "\n" + returnEmail};
	emailjs.send("default_service", "template_mwehm4f", templateParams)
	.then(function(response) {
		console.log('SUCCESS!', response.status, response.text);
	}, function(error) {
		console.error('FAILED...', error);
	});
    emailForm.reset();
}
document.addEventListener("DOMContentLoaded", setupEvents)