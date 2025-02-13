import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-search',
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe, MatAutocompleteModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  @Input() contacts: Contact[] | null = null;
  @Output() filteredContact = new EventEmitter<Contact>();
  showSearch = false;

  control = new FormControl('');
  filteredContacts: Observable<Contact[]> | null = null;

  ngOnInit() {
    this.filteredContacts = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(typeof value === 'string' ? value : ''))
    );
  }
  private _filter(value: string): Contact[] {
    if (this.contacts) {
      const filterValue = this._normalizeValue(value);
      return this.contacts.filter(
        (contact) =>
          this._normalizeValue(contact.firstName!).includes(filterValue) ||
          this._normalizeValue(contact.lastName!).includes(filterValue) ||
          this._normalizeValue(contact.email!).includes(filterValue) ||
          this._normalizeValue(contact.phone!).includes(filterValue)
      );
    }

    return [];
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;

    if (!this.showSearch) {
      this.control.setValue('');
    }
  }

  onContactSelected(event: MatAutocompleteSelectedEvent) {
    const contact = event.option.value as Contact;
    this.filteredContact.emit(contact);
  }

  displayFn(contact?: Contact): string {
    return contact && contact.firstName ? `${contact.firstName} ${contact.lastName || ''}` : '';
  }
}
