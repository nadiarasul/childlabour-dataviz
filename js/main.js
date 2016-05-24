var childLabor = {

};

childLabor.init = function(){
	childLabor.getCountryCode(); 
	//get country code from user choice
	$('select').on('change', function(){
		//clear the stats container
		$('.stats, .num1, .num2').empty();		
		$('.stats').removeClass('notFound');
		$('main').addClass('show');
		//get userChoiceId
		var userChoiceId = $(this).val();
		//pass userChoiceId into childLabor app to get stats for employed, out of school and out of school children
		childLabor.getEmployed(userChoiceId);
		childLabor.getOutOfSchool(userChoiceId);
		childLabor.getOutOfSchoolFemale(userChoiceId);
		childLabor.getAgri(userChoiceId);
		childLabor.getManufacturing(userChoiceId);
		childLabor.getServices(userChoiceId);
		childLabor.getEmployedMale(userChoiceId);
		childLabor.getEmployedFemale(userChoiceId);
		$.when(	
			childLabor.getEmployed(userChoiceId),
			childLabor.getOutOfSchool(userChoiceId),
			childLabor.getOutOfSchoolFemale(userChoiceId),
			childLabor.getAgri(userChoiceId),
			childLabor.getManufacturing(userChoiceId),
			childLabor.getServices(userChoiceId),
			childLabor.getEmployedMale(userChoiceId),
			childLabor.getEmployedFemale(userChoiceId))
		.then(function(res1, res2, res3, res4, res5, res6, res7, res8) {
				console.log(res4);
				if (res1[0][1] != null){
					console.log("it works res1");
					childLabor.displayEmployed(res1[0][1][0]);
				}
				else {
					childLabor.displayDataNotFound(1);
				};
				if (Number(res2[0][1][0].value) < 1){
					childLabor.displayDataNotFound(2);
					console.log("less than 1");
				}
				else {
					childLabor.displayOutOfSChool(res2[0][1][0]);
				}

				// if it is not null run childLabor.displayEmployed()
				if (Number(res3[0][1][0].value) < 1){
					childLabor.displayDataNotFound(3);
				}
				else {
				   childLabor.displayOutOfSchoolFemale(res3[0][1][0]);
				}

				if(res4[0][1] != null){
					childLabor.displayAgri(res4[0][1][0]);
				}
				else {
					childLabor.displayDataNotFound(4);
				}
				if(res5[0][1] != null){
					childLabor.displayManufacturing(res5[0][1][0]);
				}
				else {
					childLabor.displayDataNotFound(5);
				}		
				if(res6[0][1] != null){
					childLabor.displayServices(res6[0][1][0]);
				}
				else {
					childLabor.displayDataNotFound(6);
				}				
				if(res7[0][1] != null){
					childLabor.displayEmployedMale(res7[0][1][0]);
				}
				else {
					childLabor.displayDataNotFound(7);
				}
				if(res8[0][1] != null){
					childLabor.displayEmployedFemale(res8[0][1][0]);
				}
				else {
					childLabor.displayDataNotFound(8);
				}										
		    })
	});
    
};

//get country codes and country names from world bank API
childLabor.getCountryCode = function(){
    	$.ajax({
		url: 'http://proxy.hackeryou.com',
		data: {
			reqUrl: 'http://api.worldbank.org/country',
			params: {
				per_page: 214,
				region: 'WLD',
				format: 'json'
			}
		}
	}).then(function(countries) {
		// console.log(countries);
		countries = countries[1].map(function(country) {
			return {
				id: country.id,
				name: country.name
			}
		});
		childLabor.countries = countries;
		console.log(countries);
		var sortedCountries = countries.sort(function(a,b) {
	        if (a.name > b.name) return 1;
	        else if (a.name < b.name) return -1;
	        else return 0;
	    })
		for (var i = 0; i < sortedCountries.length; i++ ){
		    var option = $('<option>').text(sortedCountries[i].name).val(sortedCountries[i].id);
		    $('#countries').append(option);
		};
	})

};	
//From there when the user selects an option, take the value 


//and add it to the url for making country specific ajax requests for employed, out of school children and out of school female children

var knobStyles = {
		'readOnly': true,
		'fgColor': '#c95a39',
		'format': function (v) {
	     	return v + '%';
		}
	}
var knobStyles2 = {
		'readOnly': true,
		'fgColor': '#698c4c',
		'format': function (v) {
	     	return v + '%';
		}
	}
		
//employed children
childLabor.getEmployed = function(searchParam){	
	return $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
        reqUrl: 'http://api.worldbank.org/countries/' + searchParam + '/indicators/SL.TLF.0714.ZS',
        params:{
        	format:'json',
        	MRV:'1',
        }
    }
	})
};

childLabor.displayEmployed = function(information){
		var employedChildren = parseInt(information.value).toFixed(2);
		console.log(typeof employedChildren)

		var employedChildrenKnob = $('<input>').addClass('dial1');
		var employedChildrenDate = $('<p>').text('Last updated: ' + information.date);

		$('.stats1').append(employedChildrenDate, employedChildrenKnob);

		$(".dial1").val(employedChildren).knob(knobStyles);
};

// out of school children
childLabor.getOutOfSchool = function(searchParam){
	return $.ajax({
	    url: 'http://proxy.hackeryou.com',
	    dataType: 'json',
	    method:'GET',
	    data: {
	        reqUrl:'http://api.worldbank.org/countries/' + searchParam + '/indicators/SE.PRM.UNER.ZS',
	        params:{
	        	format:'json',
	        	MRV:'1',
	        }
	    }
		})		
};

childLabor.displayOutOfSChool = function(information){
	// console.log(information);
		var outOfSchool =  parseInt(information.value).toFixed(0);
		var outOfSchoolDate = $('<p>').text('Last updated: ' + information.date);

		$('.stats2').append(outOfSchoolDate);
		$('.num1').append(outOfSchool + '%')
};

childLabor.getOutOfSchoolFemale = function(searchParam){
	return $.ajax({
	    url: 'http://proxy.hackeryou.com',
	    dataType: 'json',
	    method:'GET',
	    data: {
	        reqUrl:'http://api.worldbank.org/countries/' + searchParam + '/indicators/SE.PRM.UNER.FE.ZS',
	        params:{
	        	format:'json',
	        	MRV:'1',
	        }
	    }
		})
};

childLabor.displayOutOfSchoolFemale = function(information){
		var femaleEduStat =  parseInt(information.value).toFixed(0);
		var outOfSchoolFemDate = $('<p>').text('Last updated: ' + information.date);		

		$('.stats3').append(outOfSchoolFemDate);
		$('.num2').append(femaleEduStat + '%')		
};

// Stats for children employed in agriculture
childLabor.getAgri = function(searchParam){	
	return $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
        reqUrl: 'http://api.worldbank.org/countries/' + searchParam + '/indicators/SL.AGR.0714.ZS',
        params:{
        	format:'json',
        	MRV:'1',
        }
    }
	})
};

childLabor.displayAgri = function(information){
console.log(information);
		var agriChildren = parseInt(information.value).toFixed(2);

		var agriChildrenKnob = $('<input>').addClass('dial4');
		var agriChildrenDate = $('<p>').text('Last updated: ' + information.date);

		$('.stats4').append(agriChildrenDate, agriChildrenKnob);


		$(".dial4").val(agriChildren).knob(knobStyles2);
};

// Stats children employed in manufacturing 
childLabor.getManufacturing = function(searchParam){	
	return $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
        reqUrl: 'http://api.worldbank.org/countries/' + searchParam + '/indicators/SL.MNF.0714.ZS',
        params:{
        	format:'json',
        	MRV:'1',
        }
    }
	})
};

childLabor.displayManufacturing = function(information){
		var employedInManufacturing = parseInt(information.value).toFixed(2);

		var employedInManufacturingKnob = $('<input>').addClass('dial5');
		var employedInManufacturingDate = $('<p>').text('Last updated: ' + information.date);

		$('.stats5').append(employedInManufacturingDate, employedInManufacturingKnob);


		$(".dial5").val(employedInManufacturing).knob(knobStyles2);
};
// Stats children employed in services
childLabor.getServices = function(searchParam){	
	return $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
        reqUrl: 'http://api.worldbank.org/countries/' + searchParam + '/indicators/SL.SRV.0714.ZS',
        params:{
        	format:'json',
        	MRV:'1',
        }
    }
	})
};

childLabor.displayServices = function(information){
		var employedInServices = parseInt(information.value).toFixed(2);

		var employedInServicesKnob = $('<input>').addClass('dial6');
		var employedInServicesDate = $('<p>').text('Last updated: ' + information.date);

		$('.stats6').append(employedInServicesDate, employedInServicesKnob);


		$(".dial6").val(employedInServices).knob(knobStyles2);
};

// child labour stats, male
childLabor.getEmployedMale = function(searchParam){	
	return $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
        reqUrl: 'http://api.worldbank.org/countries/' + searchParam + '/indicators/SL.TLF.0714.MA.ZS',
        params:{
        	format:'json',
        	MRV:'1',
        }
    }
	})
};

childLabor.displayEmployedMale = function(information){
		var employedMale = parseInt(information.value).toFixed(2);

		var employedMaleKnob = $('<input>').addClass('dial7');
		var employedMaleDate = $('<p>').text('Last updated: ' + information.date);

		$('.stats7').append(employedMaleDate, employedMaleKnob);


		$(".dial7").val(employedMale).knob(knobStyles);
};
// child labour stats, female
childLabor.getEmployedFemale = function(searchParam){	
	return $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
        reqUrl: 'http://api.worldbank.org/countries/' + searchParam + '/indicators/SL.TLF.0714.FE.ZS',
        params:{
        	format:'json',
        	MRV:'1',
        }
    }
	})
};

childLabor.displayEmployedFemale = function(information){
		var employedFemale = parseInt(information.value).toFixed(2);

		var employedFemaleKnob = $('<input>').addClass('dial8');
		var employedFemaleDate = $('<p>').text('Last updated: ' + information.date);

		$('.stats8').append(employedFemaleDate, employedFemaleKnob);


		$(".dial8").val(employedFemale).knob(knobStyles);
};


// In case the data is not sufficient, display the following message
childLabor.displayDataNotFound = function(statNum){
	console.log('not found')
	var notFound = $('<p>').text('Data not sufficient');

	$('.stats' + statNum ).html(notFound).addClass('notFound');
};

$(document).ready(function(){
 $("header a").smoothScroll();
  childLabor.init();
});



