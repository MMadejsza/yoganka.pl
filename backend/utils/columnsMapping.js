//! Map changing columns names for different tables:

const columnMaps = {
	User: {
		UserID: 'ID',
		RegistrationDate: 'Data rejestracji',
		Login: 'Login',
		PasswordHash: 'Hasło (hash)',
		LastLoginDate: 'Ostatnie logowanie',
		Email: 'E-mail',
		Role: 'Rola',
		ProfilePictureSrcSetJSON: 'Zdjęcie profilowe',
		UserPrefSetting: 'Ustawienia użytkownika',
	},

	Customer: {
		CustomerID: 'ID',
		UserID: 'ID użytkownika',
		CustomerType: 'Typ klienta',
		FirstName: 'Imię',
		LastName: 'Nazwisko',
		DoB: 'Data urodzenia',
		PreferredContactMethod: 'Preferowany kontakt',
		Loyalty: 'Lojalność',
		ReferralSource: 'Źródło polecenia',
		Notes: 'Notatki',
	},

	Product: {
		ProductID: 'ID',
		Name: 'Nazwa',
		Type: 'Typ',
		Location: 'Lokalizacja',
		Duration: 'Czas trwania',
		Price: 'Cena',
		TotalSpaces: 'Ilość miejsc',
		StartDate: 'Data rozpoczęcia',
	},

	ScheduleRecord: {
		ScheduleID: 'ID',
		ProductID: 'ID produktu',
		Date: 'Data',
		StartTime: 'Godzina rozpoczęcia',
		Location: 'Lokalizacja',
		Type: 'Typ',
		Name: 'Nazwa',
	},

	Booking: {
		BookingID: 'ID',
		CustomerID: 'ID klienta',
		ScheduleID: 'ID harmonogramu',
		Name: 'Produkt',
		Date: 'Data Rezerwacji',
		Product: 'Produkt',
		Status: 'Status',
		AmountPaid: 'Kwota zapłacona',
		AmountDue: 'Kwota do zapłaty',
		PaymentMethod: 'Metoda płatności',
		PaymentStatus: 'Status płatności',
	},

	Invoice: {
		InvoiceID: 'ID',
		BookingID: 'ID Rezerwacji',
		InvoiceDate: 'Data faktury',
		DueDate: 'Termin płatności',
		TotalAmount: 'Kwota całkowita',
		PaymentStatus: 'Status płatności',
	},

	Newsletter: {
		NewsletterID: 'ID',
		Status: 'Status',
		CreationDate: 'Data utworzenia',
		SendDate: 'Data wysyłki',
		Title: 'Tytuł',
		Content: 'Treść',
	},

	Feedback: {
		FeedbackID: 'ID',
		CustomerID: 'ID Klienta',
		ScheduleID: 'ID Terminu',
		SubmissionDate: 'Data Zgłoszenia',
		Rating: 'Ocena (1-5)',
		Text: 'Treść Opinii',
		Delay: 'Opóźnienie',
	},
};

export default columnMaps;
