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
		CustomerID: 'ID klienta',
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
		ProductID: 'ID produktu',
		Name: 'Nazwa',
		Type: 'Typ',
		Location: 'Lokalizacja',
		Duration: 'Czas trwania',
		Price: 'Cena',
		TotalSpaces: 'Ilość miejsc',
		StartDate: 'Data rozpoczęcia',
	},

	ScheduleRecord: {
		ScheduleID: 'ID harmonogramu',
		ProductID: 'ID produktu',
		Date: 'Data',
		StartTime: 'Godzina rozpoczęcia',
		Location: 'Lokalizacja',
	},

	Booking: {
		BookingID: 'ID rezerwacji',
		CustomerID: 'ID klienta',
		ScheduleID: 'ID harmonogramu',
		Date: 'Data',
		Product: 'Produkt',
		Status: 'Status',
		AmountPaid: 'Kwota zapłacona',
		AmountDue: 'Kwota do zapłaty',
		PaymentMethod: 'Metoda płatności',
		PaymentStatus: 'Status płatności',
	},

	Invoice: {
		InvoiceID: 'ID faktury',
		BookingID: 'ID rezerwacji',
		InvoiceDate: 'Data faktury',
		DueDate: 'Termin płatności',
		TotalAmount: 'Kwota całkowita',
		PaymentStatus: 'Status płatności',
	},

	Newsletter: {
		NewsletterID: 'ID newslettera',
		Status: 'Status',
		CreationDate: 'Data utworzenia',
		SendDate: 'Data wysyłki',
		Title: 'Tytuł',
		Content: 'Treść',
	},

	Feedback: {
		FeedbackID: 'ID opinii',
		CustomerID: 'ID klienta',
		ScheduleID: 'ID harmonogramu',
		SubmissionDate: 'Data zgłoszenia',
		Rating: 'Ocena',
		Text: 'Treść opinii',
		Delay: 'Opóźnienie',
	},
};

export default columnMaps;
