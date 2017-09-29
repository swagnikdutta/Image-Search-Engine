var page = 0;

$('document').ready(function() {

	var currentCarouselImageIdNo;
    var num = 8; 
    var start = 1;
    var keyword;
    

    $('#loadmore').css({
    	'display' : 'none'
    })

	$('#search-button').click(function(){

		keyword = $('#input-field').val();		
		$('.tiles').remove();

		if(keyword != ''){
			fetchData(keyword, start);
		} else {
			alert('Field must not be empty');
		}
	})

    $('#gallery-container').on('click','.tiles', function(e){

    	onImageClick();

    	// extracting src of image tile
    	var str = e.currentTarget.innerHTML;
    	var imageStarts = str.indexOf('<img src="');
    	
    	if(imageStarts > -1){
    		var i = imageStarts + 10;
    		str = str.substr(i);
    		str = str.substr(0,str.indexOf('"'))
    	}

   		// extracting id of image tile
   		var nstr = e.currentTarget.innerHTML;
    	var idStarts = nstr.indexOf('id="');
    	
    	if(idStarts > -1){
    		var i = idStarts + 4;
    		nstr = nstr.substr(i);
    		nstr = nstr.substr(0,nstr.indexOf('"'))
    	}
    	currentCarouselImageIdNo = nstr;

        // initially carousel is closed
        // then u click on an image tile
        // carousel open up image is diplayed in large dimensions. 
        // Now highlight the tile which contains the image.
        // to do that add class 'highlight-image'
        // 
        // So basically, only if carousel is open, highlight the tile.
        if(! $('.carousel').hasClass('carousel-closed')){
            $(`#tile${currentCarouselImageIdNo}`).addClass('highlight-image');
        }

    	// fix navigation on image click(incase first or lastimage is clicked)
    	monitorNavigation(0);    

    	var image = $('<img/>' , {
    		src: str,
    		css: {
    			'max-width' : '100%',
    			'max-height' : '100%',
    			'margin' : 'auto auto',
    			'display' : 'block',
    			'border' : '1px solid white',
    			'box-shadow' : '0 0 3em black, 0 0 3em black',
    		}
    	});

    	var imageBox = $('#imageBox');
    	image.appendTo(imageBox);

    	
    });


    $('.fa-chevron-left').click(function(){

   		monitorNavigation(-1);
        //highlight apt image
        $('.tiles').removeClass('highlight-image');
        $(`#tile${currentCarouselImageIdNo}`).addClass('highlight-image');
        //

   		var prevImage_src = $(`#${currentCarouselImageIdNo}`).attr('src');
   		var image = $('<img/>' , {
    		src: prevImage_src,
    		css: {
    			'max-width' : '100%',
    			'max-height' : '100%',
    			'margin' : 'auto auto',
    			'display' : 'block',
    			'border' : '1px solid white',
    			'box-shadow' : '0 0 3em black, 0 0 3em black',
    		}
    	});

    	$('#imageBox').empty();
		var imageBox = $('#imageBox');
    	image.appendTo(imageBox);
    });

	$('.fa-chevron-right').click(function(){

   		monitorNavigation(1);
        //highlight apt image
        $('.tiles').removeClass('highlight-image');
        $(`#tile${currentCarouselImageIdNo}`).addClass('highlight-image');
        //
   		var prevImage_src = $(`#${currentCarouselImageIdNo}`).attr('src');
   		var image = $('<img/>' , {
    		src: prevImage_src,
    		css: {
    			'max-width' : '100%',
    			'max-height' : '100%',
    			'margin' : 'auto auto',
    			'display' : 'block',
    			'border' : '1px solid white',
    			'box-shadow' : '0 0 3em black, 0 0 3em black',
    		}
    	});

    	$('#imageBox').empty();
		var imageBox = $('#imageBox');
    	image.appendTo(imageBox);
    });

    $('#loadmore').click(function(){
    	
    	start = start + 8;
    	num = num + 8;
    	page = page + 8;
    	fetchData(keyword, start);
    });

    $('.fa-times').click(function(){
    	onImageClick();
        restoreOpacity();
    });

    function monitorNavigation(val){
		currentCarouselImageIdNo = parseInt(currentCarouselImageIdNo) + parseInt(val);
		
		if(currentCarouselImageIdNo === 0){
			$('.fa-chevron-left').css({'display':'none'});
		} else {
			$('.fa-chevron-left').css({'display':''});
		}

		if(currentCarouselImageIdNo === (num-1) ){
			$('.fa-chevron-right').css({'display':'none'});
		} else {
			$('.fa-chevron-right').css({'display':''});
		}
	}

	function onImageClick(){

		if( $('.carousel').hasClass('carousel-closed')){

	    	$('#imageBox').empty();
	    	$('#loadmore').css({
	    		'display' : 'none'
	    	})
	    } else{

            // when carousel closed by clicking on different
            // tile then restore opacity
            restoreOpacity();

	    	// if carousel is open hide the loadmore button
	    	$('#loadmore').css({
	    		'display' : ''
	    	})
	    }

		$('.carousel').toggleClass('carousel-closed');
    	$('.tiles, #panel-top, #loadmore').toggleClass('blur');
	}

    function restoreOpacity(){
        $('.tiles').removeClass('highlight-image');
    }

});


function fetchData(keyword, start){

    // mine
	// var pm_url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyC3ztOjElYBVj8q2BSmIKJ4EdXVtDq6R18&cx=000966039869815770295:1ugxnp2e6nw&start=${start}&searchType=image&safe=off&num=8&q=${keyword}`;

    // not mine
    var pm_url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD6cZJdS4fjnrRzvM-WlEBeXKCEaBN9bbc&cx=017725526660795934517:_kokdupgki4&start=${start}&searchType=image&safe=off&num=8&q=${keyword}`;
    
    console.log(pm_url);
    
    $.ajax({
        url: pm_url,
        dataType: 'jsonp',
        jsonpCallback: 'photos',
        jsonp: 'callback',
    });
}


function photos(data) {

	var items = data.items;
    var imageLinks = [];

    try{

	    for(var i=0; i<items.length; i++){
	    	imageLinks[i] = items[i].link;
	    }

	    for(var i=0; i<imageLinks.length; i++){
	    	
	    	var image = $('<img/>' , {
	    		src: imageLinks[i],
	    		id: i+page,
	    		css: {
	    			'max-width' : '100%',
	    			'max-height' : '100%',
	    			'margin' : 'auto auto',
	    			'box-shadow' : '0 0 3em black, 0 0 3em black',
	    			'border' : '1px solid white',
	    			'display' : 'block'
	    		}
	    	});

            var k = parseInt(i)+parseInt(page);

	    	var imageDiv = $('<div>' , {
	    		class: 'col-md-3 tiles',
	    		id: `tile${k}`,
	    		css: {
	    			'border' : '4px solid #231f20',
	    			'height' : '16em',
	    			'cursor' : 'pointer'
	    		}
	    	});

	    	image.appendTo(imageDiv);

	    	var galleryContainer = $('#gallery-container');
	    	imageDiv.appendTo(galleryContainer);
	    }

	    // after all the images have been rendered show the load more button
	    $('#loadmore').css({
	    	'display' : ''
	    })

    } catch(e){

        // if error is 'dailyLimitExceeded'
        if(data.error.errors[0].reason === 'dailyLimitExceeded'){
            var errorMessageShort = $('<p>' , {
                class: 'error-para-short',
                html: `Usage Limits expired! <br> Try again later. ` ,
                css: {
                    'font-size' : '3em' ,
                    'font-family' : 'PT Sans' ,
                    'color' : 'lightgrey' ,
                    'margin-top' : '2em'
                }
            });

            var galleryContainer = $('#gallery-container');
            errorMessageShort.appendTo(galleryContainer);

            var errorMessageLong = $('<p>' , {
                class: 'error-para-long',
                html: `${data.error.message}` ,
                css: {
                    'font-size' : '1em' ,
                    'font-family' : 'PT Sans' ,
                    'color' : 'grey' ,
                    'margin-top' : '5em'
                }
            });
            errorMessageLong.appendTo(galleryContainer);

        } else { // some other kind of error
            alert('data.error.message');
        }

    } // catch

}

