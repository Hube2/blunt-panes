  
	/*
			each imageID image is an img element
			that has a srcset attribute that is populated
			when the page is generated
			The images may be alternate versions of the same image generated by PHP
			or they may be different images uploaded by the editor
			
			example image tag and container
			<div id="panel-blunt-panel-810-0" 
					class="blunt-panels panel 1-column-random-bg has-background vertical-align-top text-align-center"
					style="font-size:1.8rem;line-height: 
					       1.8em;color:#ffffff;text-shadow: .1em .1em .1em #828282;min-height:500px;">
				<!-- content for this panel is located here removed to not complcate example -->
				<div id="panel-blunt-panel-810-0-background" class="panel-background-container">
					<div class="panel-background">
						<img id="panel-blunt-panel-810-0-background-image" alt="" 
								srcset="/wp-content/uploads/2015/03/Tablet-Homepage-Banner-320x133.jpg 320w,
												/wp-content/uploads/2015/03/Tablet-Homepage-Banner.jpg 1200w, 
												/wp-content/uploads/2015/03/Tablet-Homepage-Banner-768x320.jpg 768w, 
												/wp-content/uploads/2015/03/Tablet-Homepage-Banner-1024x427.jpg 1024w, 
												/wp-content/uploads/2015/03/Tablet-Homepage-Banner.jpg 1200w"
							 src="/wp-content/uploads/2015/03/Tablet-Homepage-Banner.jpg">
						<div id="panel-blunt-panel-810-0-image-fill" 
							class="blunt-image-fill" 
							style="background-position: center center; 
							background-image: url("/wp-content/uploads/2015/03/Tablet-Homepage-Banner.jpg");"></div>
					</div>
				</div>
			</div>
	*/
	
	function panel_resizer() {
		this.image_fill_elements = [];
		this.image_fill_src = [];
		this.parent_elements = [];
		this.image_elements = [];
		this.images = [];
		this.images_src = {};
		this.content_elements = [];
		this.height_reset = [];
		this.initialized = false;
		this.set_timeout = false;
		this.timout_set = false;
		this.timout = null;
		this.image_fill_timout = null;
		
		this.initialize = function() {
			if (this.initialized) {
				return;
			}
			this.initialized = true;
			var divs = document.body.getElementsByTagName('div');
			var divCount = divs.length;
			var index = 0;
			// loop through all divs in the document and find the ones that hold the images
			for (i=0; i<divCount; i++) {
				//document.getElementById().classList
				//alert(divs[i].classList);
				var classes = divs[i].classList;
				if (classes.contains('blunt-panels')) {
					//this.parent_elements[index] = divs[i];
					var parentID = divs[i].getAttribute('id');
					var imageID = parentID+'-background';
					var imageFillId = parentID+'-image-fill';
					//alert(imageFillId);
					var contentID = parentID+'-pad';
					//alert(document.getElementById(imageID));
					if (document.getElementById(imageID)) {
						this.parent_elements[index] = divs[i];
						this.image_elements[index] = document.getElementById(imageID);
						this.image_fill_elements[index] = document.getElementById(imageFillId);
						this.image_fill_src[index] = '';
						this.content_elements[index] = document.getElementById(contentID);
						images = this.image_elements[index].getElementsByTagName('img');
						this.images[index] = images[0];
						index++;
					}
				} // end if classes
			} // end foreach div
			//divCount = this.parent_elements.length;
			//alert(divCount);
		} // end this.initializ
		
		this.doit = function() {
			this.initialize();
			if (this.timout_set) {
				clearTimeout(this.timeout);
				this.timout_set = false;
			}
			var count = this.parent_elements.length;
			//alert(count); return;
			//alert(this.images);
			for (i=0; i<count; i++) {
				if (this.image_elements[i] != false) {
					if (typeof(this.height_reset[i]) == 'undefined') {
						var height_set = this.parent_elements[i].style.minHeight;
						height_set = height_set.replace('px', '');
						this.height_reset[i] = height_set;
					}
					this.parent_elements[i].style.minHeight = this.height_reset[i]+'px';
					var image_height = this.image_elements[i].clientHeight;
					var content_height = this.content_elements[i].clientHeight;
					if (content_height > image_height) {
						this.parent_elements[i].style.minHeight = content_height+'px';
					}
					if (content_height < image_height) {
						//content_height = content_height*1.25;
						//this.parent_elements[i].style.minHeight = content_height+'px';
					}
					var src = this.images[i].src;
					src = src.replace(/https?:\/\/[^\/]*/, '');
					if (src != this.image_fill_src[i]) {
						this.image_fill_elements[i].style.backgroundImage = 'url('+src+')';
						this.image_fill_src[i] = src;
					}
				} // end if has image
			} // end foreach image
			if (this.set_timeout && !this.timout_set) {
				// create a delay to ensure that ficturefill has changed any images it's going to change
				this.timeout = setTimeout('blunt_resize_panels()', 2000);
			}
			this.image_fill_timout = setTimeout('blunt_panel_resize.image_fill()', 1000);
		} // end this.doit
		
		this.image_fill = function() {
			clearTimeout(this.image_fill_timout);
			var count = this.parent_elements.length;
			for (i=0; i<count; i++) {
				if (this.image_elements[i] != false) {
					var src = this.images[i].src;
					src = src.replace(/https?:\/\/[^\/]*/, '');
					if (src != this.image_fill_src[i]) {
						this.image_fill_elements[i].style.backgroundImage = 'url('+src+')';
						this.image_fill_src[i] = src;
					}
				}
			}
		} // end this.image_fill
	} // end function panel_resizer
	
	var blunt_panel_resize = new panel_resizer();
	
	function blunt_resize_panels() {
		blunt_panel_resize.doit();
	}
	
	// and event listener
	if (window.addEventListener) {
		window.addEventListener('DOMContentLoaded', blunt_resize_panels, false);
	}
	// older browsers that do not support DOMContentLoaded
	// add event listener to document to add event tracking
	if (window.addEventListener) {
		window.addEventListener('load', blunt_resize_panels, false);
		window.addEventListener('resize', blunt_resize_panels, false);
	} else if (window.attachEvent) {
		window.attachEvent('onload', blunt_resize_panels);
		window.attachEvent('onresize', blunt_resize_panels);
	}