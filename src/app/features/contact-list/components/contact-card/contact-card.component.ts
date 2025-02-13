import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../../../core/models/contact.model';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-contact-card',
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.css',
})
export class ContactCardComponent {
  @Input() contact!: Contact;
  @Output() selectContact = new EventEmitter<number>();

  getAvatar(contact: Contact) {
    return `url(${contact.imageUrl})`;
  }
}
