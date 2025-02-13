import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteContactsService {
  private favoriteContactsSubject = new BehaviorSubject<number[]>([]);

  constructor() {
    this.loadFavoriteContacts();
  }

  getFavoriteContacts(): Observable<number[]> {
    return this.favoriteContactsSubject.asObservable();
  }

  private loadFavoriteContacts(): void {
    const stored = localStorage.getItem('favoriteContacts');
    this.favoriteContactsSubject.next(stored ? JSON.parse(stored) : []);
  }

  private saveFavoriteContacts(favorites: number[]) {
    localStorage.setItem('favoriteContacts', JSON.stringify(favorites));
  }

  toggleFavoriteContact(contactId: number) {
    let favorites = this.favoriteContactsSubject.value;
    if (favorites.includes(contactId)) {
      favorites = favorites.filter((id) => id !== contactId);
    } else {
      favorites = [...favorites, contactId];
    }
    this.favoriteContactsSubject.next(favorites);
    this.saveFavoriteContacts(favorites);
  }

  isFavorite(contactId: number): boolean {
    return this.favoriteContactsSubject.value.includes(contactId);
  }
}
