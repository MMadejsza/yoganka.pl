//! Map changing columns names for different tables:

const columnMaps = {
  User: {
    // passwordHash: 'Hasło (Szyfrowane)',
    // profilePictureSrcSetJson: 'Zdjęcie',
    // Login: 'Login',
    userId: 'ID',
    email: 'email',
    lastLoginDate: 'Ostatni login',
    registrationDate: 'Zarejestrowany',
    role: 'Uprawnienia',
    UserPrefSetting: 'Preferencje',
  },

  Customer: {
    // userId: 'ID użytkownika',
    // firstName: 'Imię',
    // lastName: 'Nazwisko',
    customerId: 'ID',
    ['ID klienta-użytkownika']: 'Uczestnik-Konto',
    ['Imię Nazwisko']: 'Imię Nazwisko',
    dob: 'Urodzony',
    customerType: 'Typ',
    preferredContactMethod: 'Kontakt',
    referralSource: 'Źródło polecenia',
    loyalty: 'Lojalność',
    notes: 'Notatki',
  },

  Product: {
    capacity: 'Frekwencja',
    productId: 'ID',
    name: 'Nazwa',
    type: 'Rodzaj',
    location: 'Miejsce',
    duration: 'Czas trwania',
    price: 'Zadatek',
    startDate: 'Data rozpoczęcia',
    status: 'Status',
  },

  ScheduleRecord: {
    // productId: 'ID produktu',
    scheduleId: 'ID',
    // ['']: '',
    ['Miejsca']: 'Miejsca',
    date: 'Data',
    ['Dzień']: 'Dzień',
    startTime: 'Godzina',
    location: 'Lokalizacja',
    type: 'Typ',
    name: 'Nazwa',
    ['Zadatek']: 'Zadatek',
  },

  Payment: {
    // customerId: 'ID klienta',
    // scheduleId: 'ID harmonogramu',
    // name: 'Produkt',
    // status:'Status',
    // amountDue: 'Kwota do zapłaty',
    // ['Imię Nazwisko']: 'Klient',
    paymentId: 'ID',
    date: 'Data Rezerwacji',
    Customer: 'Uczestnik',
    product: 'Produkty',
    paymentStatus: 'Status płatności',
    paymentMethod: 'Metoda płatności',
    amountPaid: 'Kwota zapłacona',
  },

  Invoice: {
    invoiceId: 'ID FV',
    paymentId: 'ID Rezerwacji',
    invoiceDate: 'Wystawiona',
    Payment: 'Uczestnik',
    dueDate: 'Termin',
    paymentStatus: 'Status płatności',
    totalAmount: 'Wartość',
  },

  Newsletter: {
    newsletterId: 'ID',
    creationDate: 'Utworzono',
    sendDate: 'Wysłano',
    title: 'Tytuł',
    content: 'Treść',
    status: 'Status',
  },

  Feedback: {
    // customerId: 'ID Klienta',
    // scheduleId: 'Termin (ID)',
    feedbackId: 'ID',
    rating: 'Ocena',
    text: 'Treść',
    submissionDate: 'Wystawiono',
    delay: 'Opóźnienie',
    ['Nazwa']: 'Zajęcia',
    ['Data']: 'Data',
    ['Godzina']: 'Godzina',
    Customer: 'Uczestnik',
  },
};

export default columnMaps;
