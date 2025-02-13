import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { contacts as localContacts } from '../data/contacts';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts$ = new BehaviorSubject<Contact[]>([]);

  constructor() {
    this.initializeContacts();
  }

  getContacts(): Observable<Contact[]> {
    return this.contacts$.asObservable();
  }

  getContactById(contactId: number) {
    return this.contacts$.getValue().find((c) => c.id === contactId) || null;
  }

  setContacts(contacts: Contact[]): void {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    this.contacts$.next(contacts);
  }

  addContact(contact: Contact): void {
    const currentContacts = this.contacts$.getValue();
    this.setContacts([...currentContacts, contact]);
  }

  removeContact(contactId: number): void {
    const filteredContacts = this.contacts$.getValue().filter((c) => c.id !== contactId);
    this.setContacts(filteredContacts);
  }

  updateContact(updatedContact: Contact) {
    const contacts = this.contacts$.getValue();
    if (!contacts) return;

    const index = contacts.findIndex((c) => c.id === updatedContact.id);
    if (index !== -1) {
      contacts[index] = updatedContact;
      this.setContacts(contacts);
      this.contacts$.next([...contacts]);
    }
  }

  private initializeContacts(): void {
    const storedContacts = localStorage.getItem('contacts');

    if (storedContacts) {
      console.log('Loading contacts from localStorage');
      this.setContacts(JSON.parse(storedContacts));
    } else {
      console.log('No contacts found in localStorage, initializing with default');
      this.setContacts(localContacts);
    }
  }
}
