(function(){

	// jedina izmena je na updateRestaurant - jednostavno se radi redirekcija na stranicu za
	// update restorana pri čemu se putem linka šalje id restorana koji se menja
	
	// injektujemo RestaurantsHttpService u kontroler da bi smo ga koristili
	// injektovan je $state zbog redirekcije u updateRestaurant
	var RestaurantsTableController = function($scope, restaurantsHttpService, $state){

		// inicijalizacija
	 	$scope.activePage = 1; // aktivna je 1. stranica tabele
	 	$scope.maxRestaurantsInTable = 5; // prikazivaće se po 5 restorana u tabeli
	 	$scope.sortCriteria = ""; // nema sortiranja
		$scope.sortDirection = "asc"; // rastući sort
		$scope.searchQuery=""; // za sada nema filtriranja po searchQuery
		$scope.selectedItem = "name"; // Iniciajlno je postavljeno da u select-u bude odabrano vino (select je putem ng-model povezan sa $scope.selectedItem )


		// ako su restorani uspešno dobavljeni - poziva se onSuccess funkcija u restaurantsHttpService koja vraća podatke (izdvojene iz response objekta). 
		// Nakon toga će biti pozvana ova funkcija i biće joj prosleđeni ti podaci
		var onSuccess = function(data){
			$scope.restaurants = data.results;
			adjustPagination(data.count);	
		}

		var onError = function(reason){
			console.log("Error fetching restaurants, reason: " + reason.statusText);
		}

		// dobavljanje kolekcije restorana sa servera
		var getRestaurants = function(){	
			// parametri koji se šalju serveru - filter, sortiranje, paginacija (videti slajdove 13-15 sa AJAX predavanja)
			var filterParams = {};
			filterParams[$scope.selectedItem] = $scope.searchQuery; //$scope.selectedItem - biće name, rating, price ili cuisine
			var getParams = {
				filter : filterParams,
				sort : $scope.sortCriteria,
				sortDirection : $scope.sortDirection,
				page : $scope.activePage,
				pageSize : $scope.maxRestaurantsInTable 
			};		
			restaurantsHttpService.getAll(getParams).then(onSuccess, onError); //getAll vraća promise -> pomoću then registrujemo success i error callback
		}
		getRestaurants(); // inicijalni poziv prilikom otvaranja stranice


		// ova funkcija se poziva svaki put kada uspešno stignu podaci sa servera (videti poziv u onSuccess)
		function adjustPagination(noRestaurants){ // noRestaurants - broj restorana koji odgovara trenutno postavljenom zahtevu (u odnosu na to da li je možda primenjen name filter)
			// izracunavamo koliko ima stranica paginacije (zbog podesavanja pagination komponente)
			// paginationPagesArr - niz stringova koji ce biti u <li> tagovima pagination komponente, npr. "<","1", "2", "3",">"
			$scope.noPaginationPages = Math.ceil( noRestaurants / $scope.maxRestaurantsInTable);
			$scope.paginationPagesArr = ["<<", "<", "1"]; // uvek ima barem 1 stranica (ta sto se prikazuje)
			for(var i=2; i<=$scope.noPaginationPages; i++){
				$scope.paginationPagesArr.push ("" + i);
			}
			$scope.paginationPagesArr.push (">");	 
			$scope.paginationPagesArr.push (">>");		
		}

	    
		$scope.setSortCriteria = function(newCriteria){	 		
	 		if(newCriteria == $scope.sortCriteria){ // korisnik je drugi put kliknuo na isti krterijum pretrage - samo promeni sort direction
	 			if($scope.sortDirection == "asc"){
	 				$scope.sortDirection = "desc";
	 			}else{
	 				$scope.sortDirection = "asc";
	 			}
	 		}else{ // korisnik menja kriterijum pretrage, sort direction se postavlja na ascending
	 			$scope.sortCriteria = newCriteria;	
	 			$scope.sortDirection = "asc";
	 		}	
	 		getRestaurants(); // osvežavanje prikaza prema novoj postavci parametara
	 	}	

	 	
	 	$scope.search = function(){
	 		$scope.activePage = 1;
	 		getRestaurants(); // osvežavanje prikaza prema novoj postavci parametara
		}

		
		// poziva se kada se klikne na li tag u pagination komponenti (definisano pomoću ng-click). Prosleđuje se ono što piše na "kockici" na koju je kliknuto
		$scope.changePage = function(newActivePage){
	 		if(newActivePage == ">"){
	 			if($scope.activePage < $scope.noPaginationPages){
	 				$scope.activePage = $scope.activePage + 1;
	 			};
	 		}else if (newActivePage == "<") {
	 			if($scope.activePage > 1){
	 				$scope.activePage = $scope.activePage - 1;
	 			};
	 		}else if(newActivePage == "<<"){
	 			$scope.activePage = 1;
	 		}else if(newActivePage == ">>"){
	 			$scope.activePage = $scope.noPaginationPages;
	 		}else{
	 			$scope.activePage = parseInt(newActivePage);
	 		}
	 		getRestaurants(); // osvežavanje prikaza prema novoj postavci parametara
	 	}	

	 	var onSuccessDelete = function(data){
	 		// objekat je uspešno uklonjen na serveru - treba ga ukloniti i iz modela u $scope-u
	 		// prema specifikaciji REST API-ja server nam nakon brisanja vrati objekat koji je obrisan tako da možemo odatle da vidimo njegov _id
	 		var id = data._id;
	 		for(var i=0; i<$scope.restaurants.length; i++){
	 			if($scope.restaurants[i]._id == id){
	 				$scope.restaurants.splice(i, 1);	
	 				adjustPagination();
	 				return;
	 			}
	 		}
	 	}

	 	var onErrorDelete = function(reason){
	 		console.log("Error deleting, reason: " + reason.statusText);
	 	}

	 	// funkcija za uklanjanje restorana
	 	$scope.remove = function(id){	 
	 		restaurantsHttpService.deleteRestaurant(id).then(onSuccessDelete, onErrorDelete);	 		
	 	}

	 	$scope.update = function(id){
	 		// redirekcija - u parametar restaurantId na linku stanja prosleđujemo id restorana koji se ažurira
	 		$state.go("editRestaurant", {restaurantId: id});

	 	// 	$scope.showPanels.newRestaurant = RestaurantsResourceService.get({id: id});
	 	// 	$scope.showPanels.showRestaurantTable = false;	
			// $scope.showPanels.showAddRestaurant = true;
	 	}
	 	

	};
	
	angular.module("restaurantsModule").controller("RestaurantsTableController", RestaurantsTableController);
})();