import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../../core/models/contact.model';
import { ContactsService } from '../../core/services/contacts.service';
import { FavoriteContactsService } from '../../core/services/favorite-contacts.service';
import { SearchComponent } from '../../shared/components/search/search.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';

@Component({
  selector: 'app-contact-list',
  imports: [SearchComponent, ContactCardComponent, MatDialogModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
})
export class ContactListComponent implements OnInit, OnDestroy {
  dialog = inject(MatDialog);
  router = inject(Router);
  route = inject(ActivatedRoute);
  contactsService = inject(ContactsService);
  favoriteContactsService = inject(FavoriteContactsService);

  contacts: Contact[] | null = null;
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription = this.contactsService.getContacts().subscribe((contacts) => {
      if (contacts) {
        this.contacts = this.sortContacts(contacts);
      }
    });

    this.subscription.add(
      this.favoriteContactsService.getFavoriteContacts().subscribe(() => {
        if (this.contacts) {
          this.contacts = this.sortContacts([...this.contacts]);
        }
      })
    );

    this.subscription.add(
      this.route.paramMap.subscribe((params) => {
        if (params.get('id') === 'new') {
          this.openContactDialog(null);
        } else if (params.get('id') !== null) {
          this.openContactDialog(parseInt(params.get('id')!));
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private sortContacts(contacts: Contact[]): Contact[] {
    return contacts.sort((a, b) => {
      const aIsFavorite = this.favoriteContactsService.isFavorite(a.id!);
      const bIsFavorite = this.favoriteContactsService.isFavorite(b.id!);

      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      return a.firstName!.localeCompare(b.firstName!);
    });
  }

  createContact() {
    this.openContactDialog(null);
  }

  openContactDialog(contactId: number | null) {
    const dialogRef = this.dialog.open(ContactDetailsComponent, {
      data: { id: contactId },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.route.snapshot.paramMap.get('id')) {
        this.router.navigate(['/contact-list'], { replaceUrl: true });
      }
    });
  }

  handleSelectedContact(contact: Contact) {
    if (contact.id) {
      this.openContactDialog(contact.id);
    }
  }
}
