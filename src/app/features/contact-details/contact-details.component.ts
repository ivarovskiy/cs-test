import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Contact } from '../../core/models/contact.model';
import { ContactsService } from '../../core/services/contacts.service';
import { FavoriteContactsService } from '../../core/services/favorite-contacts.service';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatFormFieldModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css',
  providers: [provideNativeDateAdapter()],
})
export class ContactDetailsComponent implements OnInit {
  @HostBinding('class.edit-mode') isEditMode = false;

  data: { id: number } = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ContactDetailsComponent>);
  contactsService = inject(ContactsService);
  favoriteContactsService = inject(FavoriteContactsService);

  contact: Contact | null = null;
  contactForm: FormGroup;
  isFavorite = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      birthDate: [''],
    });
  }

  ngOnInit(): void {
    if (this.data.id) {
      this.contact = this.contactsService.getContactById(this.data.id);
      if (this.contact && this.contact.id) {
        this.contactForm.patchValue(this.contact);
        this.isFavorite = this.favoriteContactsService.isFavorite(this.contact.id);
      }
    } else {
      this.contact = {
        id: null,
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
        address: null,
        birthDate: null,
        imageUrl: null,
      };

      this.isEditMode = true;
    }
  }

  parseDate(dateString: string | Date | null): string | null {
    if (!dateString) return null;

    if (dateString instanceof Date) {
      return `${dateString.getFullYear()}-${String(dateString.getMonth() + 1).padStart(2, '0')}-${String(dateString.getDate()).padStart(2, '0')}`;
    }

    try {
      const [day, month, year] = dateString.split('/').map(Number);
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } catch {
      return null;
    }
  }

  getAvatar(contact: Contact) {
    return `url(${contact.imageUrl})`;
  }

  editContact() {
    this.isEditMode = true;
  }

  saveContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    if (this.contact) {
      const updatedContact = {
        ...this.contact,
        ...this.contactForm.value,
        birthDate:
          this.contactForm.value.birthDate === this.contact.birthDate
            ? this.contact.birthDate
            : this.parseDate(this.contactForm.value.birthDate),
      };
      this.contactsService.updateContact(updatedContact);
      this.contact = updatedContact;
      this.isEditMode = false;
    }
  }

  createContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const newContact = {
      ...this.contactForm.value,
      id: new Date(),
      source: 'localStorage',
      birthDate: this.parseDate(this.contactForm.value.birthDate),
    };
    this.contactsService.addContact(newContact);
    this.contact = newContact;
    this.closeDialog();
  }

  cancelEdit() {
    if (this.contact) {
      this.contactForm.patchValue(this.contact);
    }
    this.isEditMode = false;
  }

  deleteContact() {
    if (this.contact && this.contact.id) {
      this.contactsService.removeContact(this.contact.id);
      this.closeDialog();
    }
  }

  toggleFavorite() {
    if (this.contact && this.contact.id) {
      this.favoriteContactsService.toggleFavoriteContact(this.contact.id);
      this.isFavorite = this.favoriteContactsService.isFavorite(this.contact.id);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
