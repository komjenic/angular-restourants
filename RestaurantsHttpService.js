(function(){
	
	var restaurantsHttpService = function($http){ // ovaj servis zavisi od $http servisa (pozivaćemo njegove funkcije) pa zbog toga injektujemo $http unutar servisa

		var baseURL = "http://localhost:3000/api/restaurants";

		// vraća sve restorane iz kolekcije - GET zahtev na http://localhost:3000/api/restaurants. Parametri vezani za filtriranje, sortiranje i paginaciju
		// se zadaju kroz getParams objekat
		var getAll = function(getParams){
			//$http.get vraća promise objekat. Nad ovim objektom pozivamo then metodu kako bi smo registorvali successCallback (u slučaju uspešnog dobavljanja
			// podataka sa servera biće pozvana funkcija onSuccess() definisana niže u kodu)
			return $http.get(baseURL, {params: getParams}).then(onSuccess);
			// Napomena: kao povratna vrednost iz ove funkcije se vraća ono što vraća then metoda, a to je promise objekat 
			// zbog toga se u kontroleru nad povratnom vrednošću getALL može pozvati then metoda
		}

		// vraća (pojedinačan) restoran čiji je property _id jednak restaurantId - npr. za restoran sa _id=3 vrši se GET zahtev na http://localhost:3000/api/restaurants/3
		var get = function(restaurantId){
			var url = baseURL + "/" + restaurantId;
			return $http.get(url).then(onSuccess);
		}

		// dodavanje (novog) restorana u kolekciju - POST zahtev na http://localhost:3000/api/restaurants pri čemu se kao parametar POST metode šalje restoran koji se dodaje
		var add = function(newRestaurant){
			return $http.post(baseURL, newRestaurant).then(onSuccess);
		}

		// ažuriranje (postojećeg) restorana - npr. ako želimo da menjamo restoran sa _id=3 šaljemo PUT zahtev na http://localhost:3000/api/restaurants/3. Sa PUT zahtevom kao parametar šaljemo restoran sa ažuriranim vrednostima
		// kao parametar funkcija prima restoran sa ažuriranim vrednostima. Budući da već postoji u kolekciji, ovaj restoran ima definisan _id property 
		// koji koristimo za određivanje url-a
		var update = function(restaurant){
			var url = baseURL + "/" + restaurant._id;
			return $http.put(url, restaurant).then(onSuccess);
		}

		// brisanje (postojećeg) restorana - npr. ako želimo da obišemo restoran sa _id=3 šaljemo DELETE zahtev na http://localhost:3000/api/restaurants/3
		var deleteRestaurant = function(restaurantId){
			var url = baseURL + "/" + restaurantId;
			return $http.delete(url).then(onSuccess);
		}

		// ova funkcija se poziva u slučaju uspešnog dobavljanja podataka sa servera (registoravana je kao successCallback u then funkciji)
		// kada se pozove, u funkciju se prosleđuje odgovor (ovde je taj parametar nazvan response). Primljeni odgovor (response) ima property
		// data u kome se nalaze podaci vraćeni sa servera (pored ovoga response ima i druge property-je koje ovde ne koristimo, pogledati u debuger-u)
		var onSuccess = function(response){
			return response.data;
		}

		// revealing module šablon - definiše koje funkcije mogu pozivati spoljašnje komponente koje koriste ovaj servis
		return {
			getAll: getAll,
			get: get,
			add: add,
			update: update,
			deleteRestaurant: deleteRestaurant
		}

	}

	var module = angular.module("restaurantsModule"); // dobavljanje reference na modul registrovan kao "restaurantsModule"
	module.factory("restaurantsHttpService", restaurantsHttpService); // registracija servisa u datom modulu

})();