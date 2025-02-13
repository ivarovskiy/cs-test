export interface Contact {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  birthDate: string | null;
  imageUrl: string | null;
  source?: 'localStorage' | 'API' | null;
}
