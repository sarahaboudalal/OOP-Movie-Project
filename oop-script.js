const container = document.getElementById('container')

class App {
    static async run(input) {
      let movies
      if (typeof input === "number") { movies = await APIService.fetchGenres(input) }
      else { movies = await APIService.fetchMovies(input) }
      HomePage.renderMovies(movies);
    };
  };

class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies(filter) {
        const url = APIService._constructUrl(`movie/${filter}`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => {
            return new Movie(movie)})
    }
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        return new Movie(data)
    }
    static async fetchActors(movieId){
        const url = APIService._constructUrl(`movie/${movieId.id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        RenderMovieActors.render(data)
    }
    static async fetchPopularActors() {
      const url = APIService._constructUrl(`person/popular`)
      const response = await fetch(url)
      const data = await response.json()
      return data.results.map((movie) => new SingleActor(movie))
  }

  
  static async fetchSingleActor(personId) {
      const url = APIService._constructUrl(`person/${personId}`);
      const response = await fetch(url)
      const data = await response.json();
      return new SingleActor(data);
  }
    static async fetchGenres(genreId) {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=bae5a03c227c33b8d9842f4e6c132889&include_adult=false&with_genres=${genreId}`);
        const data = await response.json()
        return data.results.map(movie => new Movie(movie))
      }

    static async fetchTrailer(movieId)
    {
        const url = APIService._constructUrl(`movie/${movieId.id}/videos`)
        const response = await fetch(url)
        const data = await response.json()
        renderTrailer.render(data)
    }


    static async fetchSimilar(movieId){
        const url = APIService._constructUrl(`movie/${movieId.id}/recommendations`)
        const response = await fetch(url)
        const data = await response.json()
        renderSimilar.render(data)
    }

    
    static async fetchActorCredit(personId){
        const url = APIService._constructUrl(`/person/${personId}/movie_credits`)
        const response =  await fetch(url)
        const data = await response.json()
        return new MovieCredits(data);
      }

    static async fetchMovieSearchResultsforMovie(search) {
        const searchString = search.trim().toUpperCase()
        const url = APIService._constructUrlForSearch(
            `search/movie`,
            `${searchString}`
        )
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map((movie) => new Movie(movie))
    }
    static async fetchMovieSearchResultsforActors(search) {
        const searchString = search.trim().toUpperCase()
        const url = APIService._constructUrlForSearch(
            `search/person`,
            `${searchString}`
        )
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map((actor) => new SingleActor(actor))
    }

    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }
    static _constructUrlForSearch(path, search) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob(
      'NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI='
    )}&language=en-US&query=${search}&page=1&include_adult=false`
    }
}



class HomePage {
    static container = document.getElementById('container');
    static movieContainer = document.createElement('div');
    static renderMovies(movies) {
        this.movieContainer.innerHTML = " "
        if (container.innerText !== "") {
            container.innerText = "";
          }
          this.movieContainer.classList="homePageMovies"
          this.container.append(this.movieContainer)
          movies.forEach(movie => {
            const movieDiscriptionDiv = document.createElement('div');
            const movieDiv = document.createElement("div");
            movieDiv.setAttribute("class", "singleHomePageMovie ")
            const movieImage = document.createElement("img");
            movieImage.title = movie.overview;
            movieImage.setAttribute("class", "image-fluid clickable")
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.setAttribute("class", "movieTitle")
            movieTitle.textContent = `${movie.title}`;
            const movieRating = document.createElement("span");
            movieRating.textContent = `Rating: ${movie.voteAverage}`;
            movieImage.addEventListener("click", function() {
                Movies.run(movie);
            });

            movieDiv.appendChild(movieImage);
            movieDiscriptionDiv.appendChild(movieTitle);
            movieDiscriptionDiv.appendChild(movieRating);
            movieDiv.appendChild(movieDiscriptionDiv);
            this.movieContainer.appendChild(movieDiv);
        })
    }
    
  }
  class Movie {
      static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
      constructor(json) {
          this.id = json.id;
          this.title = json.title;
          this.genres = json.genres;
          this.releaseDate = json.release_date;
          this.runtime = json.runtime + " minutes";
          this.overview = json.overview;
          this.posterPath = json.poster_path;
          this.backdropPath = json.backdrop_path;
          this.language = json.spoken_languages;
          this.productionCompanies = json.production_companies;
          this.voteAverage = json.vote_average;
          this.voteCount = json.vote_count;
      }
  
      get backdropUrl() {
          return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
      }
  
      get posterUrl(){
          return this.posterPath ? Movie.BACKDROP_BASE_URL + this.posterPath : "";
      }
  }
  class AboutPage {
      static renderAboutPage(){
        container.innerHTML =`
        <div class="text-center" id="aboutPage">
          <h3 class="my-3">Website Content:</h3>
          <h4>Home Page</h4>
          <p>Displays movies now playing as a default</p>
          <p>Show movies based on the genre or filter selected from dropdown menu</p>
          <p>Each movie card takes you to the single movie page when clicked</p>
          <h4>Single Movie Page</h4>
          <p>Displays movie detailes, trailer, cast, and simliar movies</p>
          <p>Any card clicked takes you to the corresponding actor or movie page</p>
          <h4>Actors Page</h4>
          <p>Displays the popular actors</p>
          <p>Each actor card takes you to single actor page when clicked</p>
          <p>Single actor page contains the actor's information plus the movies he/she played in</p>
          <h4>Search Bar</h4>
          <p>Takes the given input and displays all matching movies and actors</p>
          <p>Any card clicked takes you to the corresponding actor or movie page</p>
          <p class="my-4 h5">This website was build with Nijyar's hyperactivity, Sarah's mood swings, Paywand's screams, and Zaynab's frustration.</p>
          </div>`
      }
    }


class ActorsPage {
    static async run() {
        if (container.innerText !== '') {
            container.innerText = ''
        }
        const actorData = await APIService.fetchPopularActors()
        ActorsPage.renderActors(actorData)

          }
        static renderActors(actors) {
            const div = document.createElement('div')
            div.setAttribute('class', 'row p-4')
            const actorsContainer = container.appendChild(div)
            
            actors.forEach((actor) => {
                const actorDiv = document.createElement('div')
                actorDiv.setAttribute(
                    'class',
                'col-lg-2 col-md-3 col-sm-4 col-12 actor-container'
                )
                const actorImage = document.createElement('img')
                actorImage.setAttribute('class', 'img-fluid clickable actor-image')
                actorImage.src = `${actor.actorsProfileUrl()}`
                
                const actorTitle = document.createElement('h3')
                actorTitle.textContent = `${actor.name.toUpperCase()}`
                actorTitle.setAttribute('class', 'text-center')
                
                actorImage.addEventListener('click', function() {
                    SingleActorPage.run(actor.id) 
                })
                
                actorDiv.appendChild(actorImage)
                actorDiv.appendChild(actorTitle)
                actorsContainer.appendChild(actorDiv)
            })
        }
    }

    class SingleActorPage {
        static async run(actorId){
            if (container.innerText !== '') {
                container.innerText = ''
            }
            const singleActorData = await APIService.fetchSingleActor(actorId)
            const movieCredits = await APIService.fetchActorCredit(actorId)
            SingleActorPage.renderActor(singleActorData, movieCredits)
        }

    
        
        
        static renderActor(singleActor, movieCredits){

            const moviesCast = movieCredits.moviesInCast.map(movie => `
            <div class="movie-card col-md-2 col-sm-4 col-12 my-3 movie-cast-div">
              <img class="img-fluid clickable" src=${movieCredits.castPosterUrl(movieCredits.moviesInCast.indexOf(movie))} alt="${movie.title}" onclick="SingleActorPage.funct(${movie.id})">
              <h6>${movie.title} as <em>${movie.character}</em></h6>
            </div>`).join(" ");
            
            const moviesCrew = movieCredits.moviesInCrew.map(movie => `
            <div class="movie-card col-md-2 col-sm-4 col-12 my-3">
            <img class="img-fluid clickable" src=${movieCredits.crewPosterUrl(movieCredits.moviesInCrew.indexOf(movie))} alt="${movie.title}" onclick="SingleActorPage.funct(${movie.id})">
            <h5>${movie.title} as <em>${movie.job}</em></h5>
            </div>`).join(" ");
            
            ActorPage.container.innerHTML = `
            <div class="row align-items-center">
            <div class="col-md-4 my-4">
            <img class="img-fluid single-actor-img" src=${singleActor.actorsProfileUrl()}> 
            </div>
            <div class="col-md-8 actor-info">
            <h1>${singleActor.name}</h1>
            <p class="lead"><strong>Job:</strong> ${singleActor.knownForDepartment}</p>
            <p class="lead"><strong>Birthday:</strong> ${singleActor.birthday}</p>
            <p class="lead"><strong>Gender:</strong> ${singleActor.genderIdentifier()}</p>
            <h5>Biography:</h5><p class="lead"><strong> ${singleActor.biography}</strong></p>
            <p class="lead"><strong>Popularity:</strong> ${singleActor.popularity}</p>
            </div>
            </div>
            <div class="row" style="text-align: center;">
            <h1 class="movie-in-cast">Movies In Cast</h1>
            <div class="row justify-content-center">
            ${moviesCast}
            </div>
            </div>
            <div class="row" style="text-align: center;">
            <h1 class="movie-in-crew">Movies In Crew</h1>
            <div class="row justify-content-center">
            ${moviesCrew}
            </div>
            </div>`
            
            
        }
        
        static async funct(e)
        {
            Movies.run({id:e})
        }
    }

    class SingleActor {
        static PROFILE_PATH_URL = 'http://image.tmdb.org/t/p/w780';
        constructor(json) {
            this.name = json.name
            this.gender = json.gender 
            this.profilePath = json.profile_path
            this.popularity = json.popularity
            this.biography = json.biography
            this.birthday = json.birthday
            this.deathday = json.deathday
            this.knownForDepartment = json.known_for_department
            this.id = json.id
        }
        genderIdentifier(){
            return this.gender == 1 ? "Female" : "Male"
        }
        actorsProfileUrl() {
            return this.profilePath ? SingleActor.PROFILE_PATH_URL + this.profilePath : ''
        }
    }
    
class ActorPage {
        static container = document.getElementById('container');
        static renderActorPage(actor) {
            SingleActorPage.renderActor(actor);
        }
}

class MovieCredits {
    constructor(json) {
          this.moviesInCast = json.cast.slice(0, 6)
          this.moviesInCrew = json.crew.slice(0, 6)
    }
    castPosterUrl(i) {
            return this.moviesInCast[i].poster_path ? Movie.BACKDROP_BASE_URL + this.moviesInCast[i].poster_path : "";
    };
        
    crewPosterUrl(i) {
            return this.moviesInCrew[i].poster_path ? Movie.BACKDROP_BASE_URL + this.moviesInCrew[i].poster_path : "";
    };
}




class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)
        MoviePage.renderMovieSection(movieData)
        await APIService.fetchActors(movieData)
        await APIService.fetchTrailer(movieData)
        await renderProductionCompany.render(movieData.productionCompanies)
        await APIService.fetchSimilar(movieData)
    }
}

class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie) {
        MovieSection.renderMovie(movie);
    }
}

class MovieSection {
    static renderMovie(movie) {
        MoviePage.container.innerHTML = `
      <div class="singleMovieInfo" class="row align-items-center">
        <div class="singleMovieImageDiv col-md-4 col-12">
          <img id="movie-backdrop" class="img-fluid"src=${movie.posterUrl}> 
        </div>

        <div id="movieSectionDiv" class="movieSectionDiv col-md-8 col-12">
          <h2 id="movie-title">${movie.title}</h2>
          <p class="lead" id="genres"><strong>Genre: ${movie.genres.map(genre=>genre.name).join(", ")}</strong></p>
          <p class="lead" id="languages"><strong> Language: ${movie.language.map(e=>{return e.english_name})} </strong></p>
          <p class="lead" id="voteCount"> <strong>Number of Rates:  ${movie.voteCount} </strong></p>
          <p class="lead" id="voteaAerage"> <strong>Rating: ${movie.voteAverage} </strong></p>
          <p class="lead" id="movie-release-date"><strong>Release Date: ${movie.releaseDate}</strong></p>
          <p class="lead" id="movie-runtime"><strong>Run Time: ${movie.runtime}</strong></p>
          <h3>Overview:</h3>
          <p class="lead" id="movie-overview"><strong>${movie.overview}</strong></p>
        </div>

      </div>
    `;
    }
}



class RenderMovieActors {

    static IMAGE_URL = 'http://image.tmdb.org/t/p/w780';

    static async render(actors)
    {   
        let crew = document.createElement('div')
        crew.className="movieCrew"
        let crewContainer = document.createElement('div')
        crewContainer.className = "crewContainer row";
        crewContainer.innerHTML = `<h3 class="crewHeader">Crew</h3>`
        crewContainer.append(crew)
        MoviePage.container.append(crewContainer)
        
        this.getDirector(actors)
        this.getActors(actors)
        
    }

    static async getDirector(direct) {
        let director = direct.crew.filter((e)=>{ return e.job=="Director"})
         this.renderAct(director[0])
    }
    static async getActors(actors)
    {

        actors.cast.forEach((e,n)=>{
            if(n<5)
            {
            return this.renderAct(e)
            }
          
        })
    }
    static async renderAct(crew) {
        let crewDiv = document.createElement('div')
        let crewImage = document.createElement('img')
        let crewName = document.createElement('span')
        crewImage.className= "clickable"
        crewDiv.className = "col-md-2 col-6"
        
        crewImage.addEventListener('click',()=>{
            SingleActorPage.run(crew.id)
        })

        crewName.innerHTML = `${crew.job ? crew.job+' : ': ""}${crew.name}`
        crewImage.src = `${this.IMAGE_URL}${crew.profile_path}`
        crewDiv.append(crewImage)
        crewDiv.append(crewName)

        document.querySelector('.movieCrew').append(crewDiv)
    }

}

class renderTrailer{
    static async render(video)
    {
        let url = video.results.map(e => e.key)
        let videoSection = document.createElement('div');
        let videoFrame = document.createElement('iframe');
        videoFrame.src=`https://www.youtube.com/embed/${url[1]}`
        videoSection.className="videoSection";
        videoSection.innerHTML=`<h2> Trailer </h2>`
        videoSection.append(videoFrame)
        MoviePage.container.append(videoSection)

        
    }
}

class renderProductionCompany{
    static IMG_URL = `http://image.tmdb.org/t/p/w780/`
    static async render(companies)
    {
        let comContain = document.createElement("div")
        let comSection = document.createElement("div")
        comSection.className="companiesSection";
        comSection.innerHTML="<h2>Production Companies</h2>"
        comContain.className="companies";
        companies.forEach(e=>{
            let comdiv = document.createElement("div")
            let comName = document.createElement("h3")
            let comLogo = document.createElement('img')
            
            comLogo.src=`${this.IMG_URL}${e.logo_path}`
            comName.innerHTML = e.name
            comdiv.append(comName)
            comdiv.append(comLogo)

            comContain.append(comdiv)

        })
        comSection.append(comContain)
        MoviePage.container.append(comSection)
    }

}

class renderSimilar{
    static IMG_URL = `http://image.tmdb.org/t/p/w780/`

    static async render(similar){

        let relatedMoviesConatainer = document.createElement('div')
        relatedMoviesConatainer.innerHTML= `<h2>Similar Movies</h2>`
        let relatedmovies = document.createElement('div')
        relatedMoviesConatainer.className= "relatedMoviesContainer"
        
        relatedMoviesConatainer.append(relatedmovies)

        similar.results.forEach((movie,index)=>{
            if (index < 5)
            {
            let movieDiv = document.createElement('div')
            let moviePhoto = document.createElement('img')
            moviePhoto.className = "clickable"
            moviePhoto.addEventListener('click',()=> {
                Movies.run(movie)
            })
            let movieName = document.createElement('span')
            
            moviePhoto.src=`${this.IMG_URL}${movie.poster_path}`
            movieName.innerHTML=`${movie.title}`
            movieDiv.append(moviePhoto)
            movieDiv.append(movieName)
            
            relatedmovies.append(movieDiv)
            }
        })

        MoviePage.container.append(relatedMoviesConatainer)
    }
}


class SearchPage {
    static async run(input) {
        const movie = await APIService.fetchMovieSearchResultsforMovie(input)
        const actor = await APIService.fetchMovieSearchResultsforActors(input)
        let mov, person
        // const container = document.getElementById('container')
        if (movie.length === 0) {
            mov = `<h3>Please Write a movie or actor</h3>`
        }
        if (document.getElementById('container').innerHTML !== '') {
            document.getElementById('container').innerHTML == ' '
            
            mov = movie.map((movie) => `<div class="actorListPageActor col-lg-2 col-md-3 col-sm-4 col-6">
            <img class= "img-fluid clickable actorListPageImg"  src="${movie.posterUrl}" onclick="SearchPage.movieFunct(${movie.id})"/>
            ${movie.title} </div>`
                )
                .join('')
        }
        if (actor.length === 0) {
            person = '<h4>Unfortunately, no such people found.</h4>'
        }
        if (true) {
            person = actor
                .map(
                    (
                        actor
                    ) => `<div class="actorListPageActor text-center col-lg-2 col-md-3 col-sm-4 col-6">
            <img class= "img-fluid clickable actorListPageImg" src='${actor.actorsProfileUrl()}' onclick="SearchPage.actorFunct(${actor.id})"/>
            ${actor.name}</div>`
                )
                .join('')
        }
        container.innerHTML = `
    <h2 class="text-center">Movie Results</h2>
    <div class="row  ">${mov}</div>
     <h2 class="text-center">Actors Results</h2>
    <div class="row searchResults">${person}</div>`
    }

    static async movieFunct(e)
    {
        Movies.run({id:e})
    }
    static async actorFunct(e)
    {
        SingleActorPage.run(e)
    }
}

const submit = document.querySelector('#submit')
submit.addEventListener('click', (e) => {
    e.preventDefault()
    const search = document.querySelector('#search').value
    SearchPage.run(search)
})



document.getElementById('homeBtn').addEventListener('click', (e) => {
  document.getElementById('container').innerHTML = " "
  App.run("now_playing")
       })
 
document.addEventListener("DOMContentLoaded", App.run("now_playing"));