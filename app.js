(function(){
	// ui-router je deo ui.router modula. Dodajemo ovaj modul u listu zavisnosti
	var app = angular.module("restaurantsModule", ['ui.router']);

	app.config(function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/main"); // ako je korisnik ukucao neki link koji ne pokriva ni jedno
		// od pravila redirektuj se na URL /main

		$stateProvider
			.state("main",{ // ime stanja
				url: "/main", // url stanja
				templateUrl: "RestaurantTable.html", // templejt
				controller: "RestaurantsTableController" // kontroler - paziti da se uklone kontroleri iz 
				// ng-controller direktive, ne smeju biti prisutni na oba mesta!
			})
			.state("addRestaurant",{
				url: "/restaurant/add",
				templateUrl: "AddRestaurant.html",
				controller: "AddRestaurantController",
				resolve: {
					newRestaurant : function(){
						return {}; // vraća prazan objekat
					}
				}
			})
			.state("editRestaurant",{
				url: "/restaurant/:restaurantId",
				templateUrl: "AddRestaurant.html",
				controller: "AddRestaurantController",
				resolve: {
					newRestaurant : function(restaurantsHttpService, $stateParams){
						return restaurantsHttpService.get($stateParams.restaurantId); 
						// vraća promise: neće doci do redirekcije dok se podaci ne vrate sa servera uspešno
						// rezultat je kao i kod prethodnog stanja resource objekat - u oba slučaja (ažuriranje ili dodavanje)
						// možemo nad resource objektom newRestaurant pozivati funkcije $save, $update, ...
					}
				}
			});

			// MainController je u potpunosti izbačen jer nam više ne treba ni za rutiranje ni za prebacivanje
			// objekta putem resolve-a
	});
})();