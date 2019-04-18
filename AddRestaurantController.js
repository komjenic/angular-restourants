(function() {
	
	// injektujemo newRestaurant objekat koji smo dobavili u resolve-u. Ako je objekat prazan znamo da se radi
	// dodavanje, a u suprotnom znamo da je u pitanju ažuriranje
	var AddRestaurantController = function($scope, newRestaurant, $state, restaurantsHttpService) {	
		$scope.newRestaurant = newRestaurant; // stavljamo newRestaurant na scope da bi smo ga povezali 
		// sa inputima preko ng-model

		var onSuccess = function(){
			// redirekcija
			$state.go("main");
		}
		
		var onError = function(){
			console.log("Error accessing data, reason: " + reason.statusText);
		}

		$scope.add = function(){
			if($scope.newRestaurant._id){ // ukoliko je definisan _id radi se o update-u
				restaurantsHttpService.update($scope.newRestaurant).then(onSuccess, onError);
			}else{ // radi se o dodavanju				
				restaurantsHttpService.add($scope.newRestaurant).then(onSuccess, onError);
			}
		}

	};

	var app = angular.module("restaurantsModule"); 
	app.controller("AddRestaurantController", AddRestaurantController);

})();