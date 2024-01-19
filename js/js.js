﻿(function() {
	
	
	
	
	
	
	var filter_button = document.getElementById('middle_header__filter_button');
	
	var modal = document.getElementById("modal_window");
	filter_button.addEventListener("click", function() {
		
		modal.style.display = "flex";
	});
	window.addEventListener("click", function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	});

	
	
	var menuOpen = document.getElementsByClassName('menu_open')[0];
	menuOpen.addEventListener('click', function() {
		var menu = document.getElementById('header_menu');
		if (this.classList.contains('open')) { 
			this.classList.remove('open');
			menu.style.display = "none";
		} else { 
			this.classList.add('open'); 
			menu.style.display = "block";
		}
	});
	
})();