//fixes
var canvas = document.getElementById("main_canvas"),
        backgroundCanvas = document.getElementById("background_canvas"),
    	context = canvas.getContext("2d"),
        bContext = backgroundCanvas.getContext("2d"),
    	width = backgroundCanvas.width = canvas.width = window.innerWidth * 4 / 5,
    	height = backgroundCanvas.height = canvas.height = window.innerHeight * 4 / 5;

    // game style *fix
        var menu_right = document.getElementById("right_menu"),
        	menu_bottom = document.getElementById("bottom_menu");

            menu_right.style.width = window.innerWidth / 5 + "px";
            menu_right.style.height = height + "px";
            menu_bottom.style.width = window.innerWidth + "px";
            menu_bottom.style.height = window.innerHeight / 5 + "px";
document.getElementById("wrapper").style.width = window.innerWidth + "px";
document.getElementById("wrapper").style.height = window.innerHeight + "px";

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 //mobile device detected!
    width = backgroundCanvas.width = canvas.width = window.innerWidth,
    height = backgroundCanvas.height = canvas.height = window.innerHeight;
    menu_right.style.width = bottom_menu.style.width = window.innerWidth / 4 + 'px';
    menu_right.style.height = bottom_menu.style.height = window.innerHeight + 'px';
}


//right menu
	var page_info = document.getElementById("page_info");
	var currentPage = 0;

	function nextPage(index){
	    console.log("next page is shown");
	    if(currentPage + index >= 0 && currentPage + index <= jsonContent.turrets.length - 1){
	        currentPage += index;
	        page_info.innerHTML = "Page " + currentPage;

	            var currentTurret = jsonContent.turrets[currentPage];

	        document.getElementById("turret_name").innerHTML = "&nbsp;" + currentTurret.name + "&nbsp;";
	            //name should have spaces!  (for the design)  (&nbsp; is a space entity)
	        var img = document.getElementById("turret_display");
	        img.src = currentTurret.displayImg_src;
	        img.alt = currentTurret.name;
	        document.getElementById("damage_bar").style.width = (currentTurret.damage / 15 * 100) + "%";
	        document.getElementById("distance_bar").style.width = (currentTurret.radius / 500 * 100) + "%";
	        document.getElementById("speed_bar").style.width = (10 / currentTurret.reloadTime  * 100) + "%";
	        document.getElementById("turret_info").innerHTML = currentTurret.info;
	        document.getElementById("buy_turret").innerHTML = currentTurret.cost + "xp";
	    }
	    else {
	        if(currentPage + index < 0){
	            currentPage = jsonContent.turrets.length - 1;
	        }
	        else {
	            currentPage = 0;
	        }
	        nextPage(0);
	    }
	}
	nextPage(0); //just to load it in at the beginning


//bottom menu
	function changeMode(val){
		if(selectedTurret != null){
			//a turret is selected! :).. just for safty
			if(val != 0){//--Modes--
				turrets[selectedTurret].mode = val - 1;
			}
		}
	}
	function changeDistance(val){
		if(selectedTurret != null){
			turrets[selectedTurret].shootDis = val * 10;
		}
	}
	//when another turret is selected... or if just a deselect.. update turret name!
	function updateTurretName(){
		if(selectedTurret != null){
			turrets[selectedTurret].name = document.getElementById("turret_name_changer").innerHTML;
		}
	}



	//bottom menu

	var isTurretItemsSet = false; //somehow the offsetwidth dosent work propaly
						//when its not called from html.. like nextItem is 
	function bottomMenu(){
		if(selectedTurret != null){
			console.log(selectedTurret);
			console.log(turrets[selectedTurret]);
			//a turret is selected! :)
			isTurretItemsSet = false;
			var tempTur = turrets[selectedTurret];
			document.getElementById("turret_name_changer").innerHTML = tempTur.name;
			document.getElementById("lvl_left").innerHTML = "Lvl " + tempTur.level;
			if(turrets[selectedTurret].level < 15){
				document.getElementById("lvl_right").innerHTML = "Lvl " + (tempTur.level + 1); //have mayby a max value here!
			}
			else {
				document.getElementById("lvl_right").innerHTML = "max";
			}
			document.getElementById("turret_level").style.width = (100 + 30 * 1);//dont know what this is-> turrets[selectedTurret])
			document.getElementById("select").selectedIndex = tempTur.mode + 1; //as we were setting it back earlier!
			document.getElementById("slider").value = document.getElementById("output").innerHTML = tempTur.shootDis;
		}
		else {
			//hide or something
		}
	}
	function loadItems(){
		var list = document.getElementById("turret_item_List");
		
		while (list.firstChild) {//but first remove all the childnodes!
        	list.removeChild(list.firstChild);
    	}
    	//now add new selected turret own items!
		for(var i = 0; i < turrets[selectedTurret].items.length; i++){
			var li_element = document.createElement("li");
			var img_element = document.createElement("img");
			li_element.setAttribute('class', 'turret_item');
			li_element.setAttribute('onclick', 'selectItem('+i+')');//this sets the index value!.. obviusly xD
			img_element.setAttribute('src', turrets[selectedTurret].items[i].img_src);
			img_element.setAttribute('alt', turrets[selectedTurret].items[i].name);

			li_element.appendChild(img_element);
			list.appendChild(li_element);
		}
	}
	function selectItem(index){
		document.getElementById("damage_bar_item").style.width = "%";
		document.getElementById("distance_bar_item").style.width = "%";
		document.getElementById("speed_bar_item").style.width = "%";
	}

	//the turret item shop
	var turret_items = document.getElementsByClassName("turret_item");

	function setTurretItems(width, height){

		var m = 0;
		for(var i = 0; i  < turret_items.length; i++){
			if(i % 4 == 0){//even
				m++;
			}

			turret_items[i].style.top = - height * (m - 1) + "px";
			turret_items[i].style.left = width * 4 * (m - 1) + "px";
			
		}
	}


	var item_pos = 0,
		item_index = 0;
	function nextItem(index){
		//index is 1 or -1
		var w = turret_items[0].offsetWidth;
		var h = turret_items[0].offsetHeight;
		if(!isTurretItemsSet){
			//this is a bug.. offsetwidth and height wont work if its not called from html... :S

			isTurretItemsSet = true;
			setTurretItems(w, h);
		}
		if(item_index + index >= -(turret_items.length - 4) && item_index + index <= 0) {//the intervall.. a bit of a thinker ;).. there is 4 items shown!
			item_index += index;
			item_pos += w * index;
			var m = 0;
			for(var i = 0; i < turret_items.length; i++){
				// turret_items[i].style.left += 100 * index + "px";
				if(i % 4 == 0 && i != 0){
					m++;
				}
				turret_items[i].style.left = (item_pos + (w * 4 * m)) + "px";
			}
		}
	}
