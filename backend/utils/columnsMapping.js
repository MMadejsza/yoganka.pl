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
    Capacity: 'Frekwencja',
    ProductID: 'ID',
    Name: 'Nazwa',
    Type: 'Rodzaj',
    Location: 'Miejsce',
    Duration: 'Czas trwania',
    Price: 'Zadatek',
    StartDate: 'Data rozpoczęcia',
    Status: 'Status',
  },

  ScheduleRecord: {
    // ProductID: 'ID produktu',
    ScheduleID: 'ID',
    // ['']: '',
    ['Miejsca']: 'Miejsca',
    Date: 'Data',
    ['Dzień']: 'Dzień',
    StartTime: 'Godzina',
    Location: 'Lokalizacja',
    Type: 'Typ',
    Name: 'Nazwa',
    ['Zadatek']: 'Zadatek',
  },

  Booking: {
    // CustomerID: 'ID klienta',
    // ScheduleID: 'ID harmonogramu',
    // Name: 'Produkt',
    // Status: 'Status',
    // AmountDue: 'Kwota do zapłaty',
    // ['Imię Nazwisko']: 'Klient',
    BookingID: 'ID',
    Date: 'Data Rezerwacji',
    Customer: 'Uczestnik',
    Product: 'Produkty',
    PaymentStatus: 'Status płatności',
    PaymentMethod: 'Metoda płatności',
    AmountPaid: 'Kwota zapłacona',
  },

  Invoice: {
    InvoiceID: 'ID FV',
    BookingID: 'ID Rezerwacji',
    InvoiceDate: 'Wystawiona',
    Booking: 'Uczestnik',
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
