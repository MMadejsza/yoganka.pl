//! Map changing columns names for different tables:

const columnMaps = {
  User: {
    // PasswordHash: 'Hasło (Szyfrowane)',
    // ProfilePictureSrcSetJSON: 'Zdjęcie',
    // Login: 'Login',
    UserID: 'ID',
    Email: 'Email',
    LastLoginDate: 'Ostatni login',
    RegistrationDate: 'Zarejestrowany',
    Role: 'Uprawnienia',
    UserPrefSetting: 'Preferencje',
  },

  Customer: {
    // UserID: 'ID użytkownika',
    // FirstName: 'Imię',
    // LastName: 'Nazwisko',
    CustomerID: 'ID',
    ['ID klienta-użytkownika']: 'Uczestnik-Konto',
    ['Imię Nazwisko']: 'Imię Nazwisko',
    DoB: 'Urodzony',
    CustomerType: 'Typ',
    PreferredContactMethod: 'Kontakt',
    ReferralSource: 'Źródło polecenia',
    Loyalty: 'Lojalność',
    Notes: 'Notatki',
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
    // ProductID: 'ID produktu',
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
    // CustomerID: 'ID klienta',
    // ScheduleID: 'ID harmonogramu',
    // Name: 'Produkt',
    // Status: 'Status',
    // AmountDue: 'Kwota do zapłaty',
    // ['Imię Nazwisko']: 'Klient',
    PaymentID: 'ID',
    Date: 'Data Rezerwacji',
    Customer: 'Uczestnik',
    Product: 'Produkty',
    PaymentStatus: 'Status płatności',
    PaymentMethod: 'Metoda płatności',
    AmountPaid: 'Kwota zapłacona',
  },

  Invoice: {
    InvoiceID: 'ID FV',
    PaymentID: 'ID Rezerwacji',
    InvoiceDate: 'Wystawiona',
    Payment: 'Uczestnik',
    DueDate: 'Termin',
    PaymentStatus: 'Status płatności',
    TotalAmount: 'Wartość',
  },

  Newsletter: {
    NewsletterID: 'ID',
    CreationDate: 'Utworzono',
    SendDate: 'Wysłano',
    Title: 'Tytuł',
    Content: 'Treść',
    Status: 'Status',
  },

  Feedback: {
    // CustomerID: 'ID Klienta',
    // ScheduleID: 'Termin (ID)',
    FeedbackID: 'ID',
    Rating: 'Ocena',
    Text: 'Treść',
    SubmissionDate: 'Wystawiono',
    Delay: 'Opóźnienie',
    ['Nazwa']: 'Zajęcia',
    ['Data']: 'Data',
    ['Godzina']: 'Godzina',
    Customer: 'Uczestnik',
  },
};

export default columnMaps;
