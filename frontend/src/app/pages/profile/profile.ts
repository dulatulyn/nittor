import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { HistoryService } from '../../core/services/history.service';
import { AuthService } from '../../core/services/auth.service';
import { MovieRow } from '../../shared/components/movie-row/movie-row';
import { User } from '../../models/user.model';
import { Movie } from '../../models/movie.model';
import MOCK from '../../data/mock-movies.json';

const MOCK_REVIEWS = [
  {
    id: 1,
    movie_id: 1,
    movie_title: 'The Shawshank Redemption',
    poster_url: MOCK[0].poster_url,
    rating: 5,
    text: 'Timeless masterpiece. One of those films that stays with you forever.',
    created_at: '2026-03-01',
  },
  {
    id: 2,
    movie_id: 3,
    movie_title: 'The Dark Knight',
    poster_url: MOCK[2].poster_url,
    rating: 5,
    text: "Heath Ledger's Joker is unforgettable. Best superhero film ever made.",
    created_at: '2026-03-10',
  },
  {
    id: 3,
    movie_id: 5,
    movie_title: 'Inception',
    poster_url: MOCK[4].poster_url,
    rating: 4,
    text: 'Mind-bending concept, stunning visuals. Slightly confusing on first watch.',
    created_at: '2026-03-18',
  },
];

@Component({
  selector: 'app-profile',
  imports: [MovieRow, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService);
  private favoritesService = inject(FavoritesService);
  private historyService = inject(HistoryService);
  auth = inject(AuthService);

  profile = signal<User | null>(null);
  activeTab = signal('watched');

  watched = signal<Movie[]>(MOCK.slice(0, 8) as Movie[]);
  favorites = signal<Movie[]>(MOCK.slice(4, 12) as Movie[]);
  reviews = signal<any[]>(MOCK_REVIEWS);

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (p) => this.profile.set(p),
      error: () => {},
    });

    this.historyService.getHistory().subscribe({
      next: (entries) =>
        this.watched.set(
          entries.map((e) => ({
            id: e.movie.id,
            title: e.movie.title,
            poster_url: e.movie.poster_url,
            imdb_rating: e.movie.imdb_rating,
            released_year: 0,
            runtime: '',
            genres: [],
            overview: '',
          }))
        ),
      error: () => {},
    });

    this.favoritesService.getFavorites().subscribe({
      next: (entries) => {
        const movies = entries.map((e) => ({
          id: e.movie.id,
          title: e.movie.title,
          poster_url: e.movie.poster_url,
          imdb_rating: e.movie.imdb_rating,
          released_year: 0,
          runtime: '',
          genres: [],
          overview: '',
        }));
        this.favorites.set(movies);
      },
      error: () => {},
    });
  }
}
