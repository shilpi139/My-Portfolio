$(function() {
	var facebookToken = "EAAFyP83mSfoBAMZCEWliYEZBvQgVz48g0taDLi3kr0rrV3MamZCayzK8f0edGxErPV3jODwZA8Jps59vET02cdSqfLFd95ZBpoRYFjxqmyLFDBhfm78ksDqWr2ZB5yRO9hzFRQpVkplD9GbAKzWbgK8MH6ZBvpEcnoZD";
	//ajax request starts to fetch the profile photo
	$.ajax({
	    url: "https://graph.facebook.com/v2.8/me?fields=id,picture,cover&access_token="+facebookToken,
	    type: 'GET',
	    async: false,
	    success: function(response) {
	    	if (response && !response.error) {
	    		console.log(response.picture.data.url);
	    		$("#profilePic").attr("src", response.picture.data.url);
		    	$("#coverPhoto").attr("src", response.cover.source);
		    	var id = response.id; 

		    	//ajax request starts
		    	$.ajax({
				    url: "https://graph.facebook.com/v2.8/"+id+"/picture?height=150&width=150&redirect=false&access_token="+facebookToken,
				    type: 'GET',
				    async: false,
				    success: function(response) {
				    	console.log(response.data.url);
				    	$("#picture").attr("src", response.data.url);
				    },
					error : function(response){
		                var errorMessage = response.responseJSON.error.message;
		                console.log(errorMessage);
		        	}
				});//ajax request ends here
	    	}
		},
		error : function(response){
            var errorMessage = response.responseJSON.error.message;
            console.log(errorMessage);
    	}
	});//ajax request ends here


	//this triggers when a page is loaded
	getProfilePageInfo();

	// this is called on page load and also on home button click
	function getProfilePageInfo(){
		$(".profileSection").show();
		$("#first").show();
		$("#second").show();
		$(".feed").hide();
		//ajax request starts to fetch basic details of a user
		$.ajax({
			url : "https://graph.facebook.com/v2.8/me?fields=education,birthday,email,work,first_name,gender,hometown,languages,friends,relationship_status,family&access_token="+facebookToken,
			type : 'GET',
			success :function(response) {
				if(response && !response.error) {
					//code to append text to the div's
					$('#navBarUserName').text(response.first_name);
					if(response.first_name) {
						$('#name').text(response.first_name);
					}else {
						$('#name').text(response.name);
					}
					$('#email').text(response.email);
					$('#gender').text(response.gender);
					$('#relationship_status').text(response.relationship_status);
					$('#birthday').text(response.birthday);
					$('#hometown').text(response.hometown.name);
					for(language in response.languages) {
						if(language == 0) {
							$('#languages').append(response.languages[language].name);
						}else {
							$('#languages').append(","+response.languages[language].name);
						}
					}
					for(val in response.work) {
						var companyName = response.work[val].employer.name;
						var position = response.work[val].position.name;
						var location = response.work[val].location.name;
						$('#companyName').text(companyName);
						$('#position').text(position);
						$('#location').text(location);
					}

					var personName = response.family.data[0].name;
					var relationship = response.family.data[0].relationship;
					$('#personName').text(personName);
					$('#relationship').text(relationship);
					//$.unblockUI();
					$("#first").hide();
    				$("#second").hide();
				}
			},
			error : function(response){
                var errorMessage = response.responseJSON.error.message;
                console.log(errorMessage);
        	}
		});//ajax request ends to fetch basic details of a user
	}

	function getFeedPageInfo(){
		$(".feed").show();
		if (!$("div").hasClass("row_0")) {
			$("#first").show();
			$("#second").show();
			//ajax request starts to fetch the feed of a user
			$.ajax({
			    url: "https://graph.facebook.com/v2.8/me/feed?limit=22&access_token="+facebookToken,
			    type: 'GET',
			    async: true,
			    success: function(json) {
			      	var data = json.data;
			      	var counter = 0;
			      	//loops starts here
			      	for (i in json.data) {
			      		var story = data[i].story;
			      		if (!story.includes("others wrote on your Timeline")) {
				      		var oddOrEven = i % 2;
				      		var id = data[i].id;
				      		if(oddOrEven == 0) { //this condition is added to create one single row after two iteration
				      			var $row = $("<div>", {"class": "row row_"+i});
				      			$("#feedContainer").append($row);

				      			var $col1 = $("<div>", {"class": "col-lg-6 col-md-6 firstColumn firstColumn_"+i});
				      			$(".row_"+i).append($col1);	

				      			var $panel = $("<div>", {"class": "panel panel-primary panel_"+i});
				      			$(".firstColumn_"+i).append($panel);
				      		}else {
				      			var $col2 = $("<div>", {"class": "col-lg-6 col-md-6 layout secondColumn_"+i});
				      			var newInt = i-1;
						    	$(".row_"+newInt).append($col2);

						    	var $panel = $("<div>", {"class": "panel panel-primary panel_"+i});
						    	$(".secondColumn_"+i).append($panel);
				      		}

				      		//all div's with classes are created to build the design
				      		var $panelHeading = $("<div>", {"class": "panel-heading panelHeading_"+i});
				      	    $(".panel_"+i).append($panelHeading);

				      	    var $image = $("<div>", {"class": "col-sm-6 col-md-6 image_"+i});
				      		$(".panelHeading_"+i).after($image );

				      		var $thumbnail = $("<div>", {"class": "thumbnail thumbnail_"+i});
				      		$(".image_"+i).append($thumbnail);

				      		var $panelBody = $("<div>", {"class": "panel-body panelBody_"+i});
				      		$(".image_"+i).after($panelBody);

				      		//ajax starts to fetch the details of a particular feed
						    $.ajax({
							    url: "https://graph.facebook.com/v2.8/"+id+"?fields=from,likes.limit(200),application,comments.limit(3),attachments&access_token="+facebookToken,
							    type: 'GET',
							    async: false,
							    success: function(json) {
							    	//in this part the data is appended to respective div's and all p tag's and other's are created
							    	if(data[i].story){
							    		$(".panelHeading_"+i).prepend('<h3 class="panel-title">'+data[i].story+'</h3>');
							    	}else if(data[i].message){
							    		$(".panelHeading_"+i).prepend('<h3 class="panel-title">'+data[i].message+'</h3>');
							    	}else {
							    		$(".panelHeading_"+i).prepend('<h3 class="panel-title">My Post</h3>');
							    	}
								    
								    if(json.attachments) {
								    	var postDescription = json.attachments.data[0].description;
								    	if(postDescription) {
								    		//console.log(postDescription);
								    	}
								    	var postMedia = json.attachments.data[0].media;
								    	if(postMedia) {
								    		var imageUrl = postMedia.image.src;
								    		$(".thumbnail_"+i).prepend('<img class="img-responsive" src="'+imageUrl+'" alt="Image">');
								    	}else {
								    		var subattachments = json.attachments.data[0].subattachments;
								    		if(subattachments){
								    			var subAttachImageUrl = subattachments.data[0].media.image.src;
								    			$(".thumbnail_"+i).prepend('<img class="img-responsive" src="'+subAttachImageUrl+'" alt="Image">');
								    			
								    		}
								    	}
								    }else if(json.message){
								    	$(".thumbnail_"+i).prepend('<p style="height: 300px;">'+json.message+'</p>');
								    }else {
								    	$(".thumbnail_"+i).prepend('<p style="height: 300px;">No data to display</p>');
								    }

								    var $caption = $("<div>", {"class": "caption caption"+i});
				      				$(".thumbnail_"+i).after($caption);

				      				var $unorderedList = $("<ul>", {"class": "list-inline listInline_"+i});
				      				$(".caption"+i).append($unorderedList);

				      				var commentCount = json.comments;
				      				if(commentCount) {
				      					commentCount = json.comments.data.length;
				      				}else {
				      					commentCount = 0;
				      				}
				      				$(".listInline_"+i).prepend('<li><a href="#"><i class="glyphicon glyphicon glyphicon-share-alt"></i>&nbsp;&nbsp;<a href="#">Share<span class="badge">'+0+'</span></a></a></li>');
				      				$(".listInline_"+i).prepend('<li><a href="#"><i class="glyphicon glyphicon glyphicon-comment"></i>&nbsp;&nbsp;<a href="#">Comments <span class="badge">'+commentCount+'</span></a></a></li>');
				      				$(".listInline_"+i).prepend('<li><a href="#"><i class="glyphicon glyphicon glyphicon-thumbs-up"></i>&nbsp;&nbsp;<a href="#">Like <span class="badge">'+json.likes.data.length+'</span></a></a></li>');

								    //console.log(json.comments);
								    if(json.comments) {
								    	for (j in json.comments.data) {
				      						var $col3 = $("<div>", {"class": "col-xs-4 col-sm-4 col-md-4 col3_"+counter});
			      							var $col4 = $("<div>", {"class": "col-xs-8 col-sm-8 col-md-8 col4_"+counter});
			      							var $comment = $("<div>", {"class": "col-xs-5 col-sm-6 col-md-6 comment_"+counter});

			      							$(".panelBody_"+i).append($comment);
			      							$(".comment_"+counter).append($col3);
			      							$(".comment_"+counter).append($col4);

			      							var $thumbnail1 = $("<div>", {"class": "thumbnail thumbnail1_"+counter});
			      							$(".col3_"+counter).append($thumbnail1);

			      							//ajax starts to fetch the image of friends that have added a comment to a post
			      							$.ajax({
											    url: "https://graph.facebook.com/v2.8/"+json.comments.data[j].from.id+"/picture?height=150&width=150&redirect=false&access_token="+facebookToken,
											    type: 'GET',
											    async: false,
											    success: function(response) {
											    	var thumbImageUrl = response.data.url;
											    	$(".thumbnail1_"+counter).prepend('<img class="img-responsive" src='+thumbImageUrl+' width="50px" height="50px" alt="Image">');
											    },
											    error : function(response){
											    	var errorMessage = response.responseJSON.error.message;
								                    alert(errorMessage);
							                	}
											});//ajax ends to fetch the image of friends that have added a comment to a post
											$(".col4_"+counter).prepend('<p class="comment">'+json.comments.data[j].message.replace(".................",".").replace("......",".")+'</p>');
											$(".col4_"+counter).prepend('<a href="#"><strong><p class="name">'+json.comments.data[j].from.name+'</p></strong></a>');
			      							counter++;
								    	}
								    }else{
								    	var noComments = "No comments have been added to the post.";
								    	$(".panelBody_"+i).prepend('<p class="comment"><strong>'+noComments+'</strong></p>');
								    } 
							    },
							    error : function(response){
				                    var errorMessage = response.responseJSON.error.message;
				                    $(".panelBody_"+i).prepend('<h5 style="float: left;">'+errorMessage+'</h5>');
				                    $(".image_"+i).removeClass();
			                	}
							});//ajax ends to fetch the details of a particular feed
						}else {
							var index = i-1;
							$( "div" ).remove( ".row_"+index);
						}
						if(i == json.data.length-1) {
							$(".profileSection").hide();
							$("#first").hide();
							$("#second").hide();
						}
					}//loop ends here
			    },
				error : function(response){
	                var errorMessage = response.responseJSON.error.message;
	                console.log(errorMessage);
	        	}
			});//ajax request ends to fetch the feed of a user
		}else {
			$("#first").hide();
			$("#second").hide();
		}
	}

	//navigation tab adding and removing class according to click of an element
	$("div.navigation-tab-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.navigation-tab>div.navigation-tab-content").removeClass("active");
        $("div.navigation-tab>div.navigation-tab-content").eq(index).addClass("active");
    });

	//click events
	$("#profilePage").on('click',getProfilePageInfo);
	$("#feedPage").on('click',getFeedPageInfo);
});

