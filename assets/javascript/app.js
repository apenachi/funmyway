 





//Make all your initial variables - namely 
//API Key and (secret?)
//QueryUrL
//write your Ajax call and put it in a function that retrieves the data and uses .done
//write a for loop that addresses the array containing the desired photos and prints them to the page

// var queryURL="http://flickr.com/services/auth/?api_key=494a9b99289268739230734afd7cdaa7&perms=write&api_sig=99ea04d7019261472912f466a2b07e0d"


// function queryFind(queryURL){

	
// 		$.ajax({
// 		url: queryURL, 
// 		method: "GET"
// 	});
	
// 	.done(function(response){  //??

// 		console.log(response);

// 		//create a for loop that makes a new div for each photo and prints it to the page


// 	});


// };

/////////






/////////////////////////////////////////////////////////////
//Notie.js Stuff

notie.input({
    type: 'email',
    placeholder: 'name@example.com',
    prefilledValue: 'jane@doe.com'
}, 'Please enter your email address:', 'Submit', 'Cancel', 'email', 'name@example.com', function(valueEntered) {
    notie.alert(1, 'You entered: ' + valueEntered, 2);
});
notie.input({
    type: 'password',
    placeholder: 'Enter your password'
}, 'Please enter your password:', 'Submit', 'Cancel', function(valueEntered) {
    notie.alert(1, 'Welcome ' + valueEntered, 2);
}, function(valueEntered) {
    notie.alert(3, 'Please try again ...' + valueEntered + ' is invalid', 2);
});








