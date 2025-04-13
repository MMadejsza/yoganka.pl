//! AUTHORIZATION__________________________________________________________________
const emailVerified =
  '🌿 Twój e-mail jest już z nami. Czas na spokojną praktykę ✨';
const emailNotVerified =
  '📩 Weryfikacja e-maila nie powiodła się. Być może coś umknęło – spróbuj jeszcze raz w spokoju.';
const sessionNotUpdated =
  '🔧 Nie udało się zapisać sesji - szczegóły poniżej: ';
const wrongPassword =
  '🪷 Coś się nie zgadza. Sprawdź hasło i spróbuj jeszcze raz.';
const emailNotYetVerified =
  '🪷 Twój e-mail czeka na potwierdzenie. Zrób ten mały krok, by wrócić na ścieżkę.';
const userStatusError =
  '🪷 Status użytkownika nie został załadowany. Daj nam chwilkę i spróbuj ponownie.';
const registrationSuccess =
  '🌸 Rejestracja zakończona pomyślnie. Sprawdź maila i aktywuj swoje konto w rytmie spokoju.';
const passwordsNotMatching =
  '🪷 Hasła się różnią – sprawdź uważnie i spróbuj jeszcze raz.';
const passwordEncryptionError =
  '🪷 Hasło nie mogło zostać bezpiecznie zapisane. Prośba została wstrzymana.';
const passwordUpdated =
  '🧘 Hasło zostało odświeżone. Przed Tobą nowy początek – zaloguj się.';
const validTokenMessage = '🌿 Link działa. Twoja ścieżka jest otwarta.';
const invalidTokenMessage =
  '🌫️ Link stracił ważność lub był niepoprawny. Spokojnie – możesz poprosić o nowy.';
const incompleteToken =
  '🪷 Czegoś brakuje w tym linku. Spróbuj ponownie lub poproś o nowy.';
const sessionExpired =
  '🌙 Czas tej sesji dobiegł końca. Wróć spokojnie i spróbuj ponownie.';
const userAlreadyExists =
  '🪷 To konto już istnieje. Może spróbujesz się zalogować?';
const accountActivated =
  '🌸 Konto aktywne. Jesteś gotowy, by rozpocząć swoją podróż.';
const fetchDataError =
  '🪷 Coś poszło nie tak podczas pobierania danych. Spróbuj ponownie.';
const fetchItemError =
  '✨ Nie udało się załadować elementu. Oddech – spróbuj za chwilę.';

//! USER__________________________________________________________________
const notLoggedIn =
  '🚪 Jesteś poza przestrzenią praktyki. Zaloguj się, by znów być u siebie.';
const userLoggedIn =
  '🌞 Zalogowano pomyślnie. Miło Cię widzieć ponownie na ścieżce.';
const userNotFound =
  '🌙 Nie odnaleźliśmy konta. Sprawdź dane lub załóż nowe, gdy będziesz gotowy.';
const passwordResetLinkSent =
  '🪷 Link do zmiany hasła został wysłany. Spokojnie – poczekaj na wiadomość.';

//! USER SETTINGS__________________________________________________________________
const settingsUpdated =
  '🌿 Zmiany zapisane. Twoja przestrzeń dostosowana do Ciebie.';
const noSettingsChange =
  '🌿 Zmiany zapisane. Twoja przestrzeń dostosowana do Ciebie.';
const settingsLoaded = '🌿 Preferencje pobrane. Wszystko tak, jak lubisz.';
const defaultSettingsLoaded =
  '🌿 Załadowano ustawienia domyślne. Czysty start, pełen przestrzeni.';

//! CUSTOMER__________________________________________________________________
const noCustomerFound =
  '🌙 Profil uczestnika niedostępny. Może jeszcze nie zacząłeś swojej praktyki?';
const customerLoaded =
  '🌸 Profil uczestnika załadowany. Dobrze Cię znowu widzieć na ścieżce.';
const noCustomerDetailsChanged =
  '🌿 Nic się nie zmieniło - być może zabrakło jednej myśli.';
const customerDetailsUpdated =
  '🌸 Zmiany zapisane. Twoja przestrzeń została odświeżona z uważnością.';
const noPhonePicked =
  '🪷 Brakuje numeru telefonu - daj znać, jak możemy Cię odnaleźć.';
const noCustomerData =
  '🌫️ Brakuje danych uczestnika – jeszcze nie zaczęliśmy tej podróży.';
const noFirstName = '🌼 Brakuje imienia – daj nam znać, jak mamy Cię wołać.';
const noLastName =
  '🍃 Nazwisko jest puste – to ważny element Twojej tożsamości.';
const noBirthDate =
  '🌙 Nie podano daty urodzenia – pozwól nam lepiej Cię poznać.';
const notAnAdult =
  '🔞 Praktyka dostępna jest dla pełnoletnich – wróć do nas w odpowiednim momencie.';

//! SCHEDULE RECORDS__________________________________________________________________
const schedulesFound = '🧘 Terminy pomyślnie pobrane. Ciało już się cieszy.';
const noSchedulesFound =
  '🌙 Nie znaleźliśmy żadnych zajęć. Sprawdź ponownie później lub wybierz inny dzień.';
const noScheduleFound =
  '📭 Nie mamy informacji o tym terminie. Poszukaj innej przestrzeni na praktykę.';
const noSchedulePicked =
  '📅 Wybierz termin – to pierwszy krok do Twojej praktyki.';
const invalidDuration =
  '🕰️ Czas trwania wygląda na nieprawidłowy. Sprawdź uważnie wartość w formularzu.';

//! BOOKINGS__________________________________________________________________
const noBookingFound =
  '📭 Brak rezerwacji przypisanej do tego terminu. Może to ślad przeszłości?';

//! PASS DEFINITIONS__________________________________________________________________
const noPassDefFound =
  '🪷 Nie znaleźliśmy takiego karnetu. Może jeszcze się pojawi.';
const noPassIdPicked =
  '📭 Karnet nie został rozpoznany. Być może czas wybrać go ponownie.';
const passDefFound = '✨ Szczegóły karnetu załadowane. Czas na Twój ruch.';
const noPassDefsFound = `🌙 Coś się rozproszyło w energii. Karnety chwilowo niedostępne.`;
const passDefsFound = `🌿 Karnety gotowe do wyboru. Wybierz to, co wspiera Twoją praktykę.`;

//! CUSTOMER PASSES__________________________________________________________________
const newCustomerPass =
  '🧘‍♀️ Twoja praktyka właśnie zyskała nowe możliwości. Do zobaczenia na macie - karnet aktywowany 🙏';
const customerPassOVerlapping =
  '🌿 Spokojnie... Masz już aktywny karnet tego typu. Wybierz datę po jego wygaśnięciu, a praktyka będzie płynąć dalej 🙏';
const noPassStartDate =
  '🌙 Nie znamy jeszcze momentu rozpoczęcia tej podróży. Podaj datę, by rozpocząć swoją praktykę.';

//! PAYMENTS__________________________________________________________________
const paymentFound = '💳 Szczegóły płatności załadowane. Spokój w przepływie.';
const noPaymentFound =
  '📭 Nie znaleziono informacji o płatności. Może jeszcze nie została dokonana.';
const paymentSaveError =
  '⚠️ Nie udało się zapisać płatności. Coś zakłóciło przepływ – spróbuj ponownie w spokoju.';

//! ATTENDANCE__________________________________________________________________
const noSpotsLeft =
  '🪷 Wszystkie miejsca na ten termin są już zajęte. Czasem warto poczekać na kolejną przestrzeń.';
const attendanceMarkedPresent =
  '🧘 Twoja obecność została zapisana. Czekamy w ciszy i spokoju.';
const attendanceMarkedAbsent =
  '🌸 Rezerwacja anulowana. Dziękujemy, że dajesz przestrzeń innym.';
const cantMarkAbsentForPassedSchedule =
  '🌙 Termin już minął – przestrzeń została zamknięta.';

export {
  accountActivated,
  attendanceMarkedAbsent,
  attendanceMarkedPresent,
  cantMarkAbsentForPassedSchedule,
  customerDetailsUpdated,
  customerLoaded,
  customerPassOVerlapping,
  defaultSettingsLoaded,
  emailNotVerified,
  emailNotYetVerified,
  emailVerified,
  fetchDataError,
  fetchItemError,
  incompleteToken,
  invalidDuration,
  invalidTokenMessage,
  newCustomerPass,
  noBirthDate,
  noBookingFound,
  noCustomerData,
  noCustomerDetailsChanged,
  noCustomerFound,
  noFirstName,
  noLastName,
  noPassDefFound,
  noPassDefsFound,
  noPassIdPicked,
  noPassStartDate,
  noPaymentFound,
  noPhonePicked,
  noScheduleFound,
  noSchedulePicked,
  noSchedulesFound,
  noSettingsChange,
  noSpotsLeft,
  notAnAdult,
  notLoggedIn,
  passDefFound,
  passDefsFound,
  passwordEncryptionError,
  passwordResetLinkSent,
  passwordUpdated,
  passwordsNotMatching,
  paymentFound,
  paymentSaveError,
  registrationSuccess,
  schedulesFound,
  sessionExpired,
  sessionNotUpdated,
  settingsLoaded,
  settingsUpdated,
  userAlreadyExists,
  userLoggedIn,
  userNotFound,
  userStatusError,
  validTokenMessage,
  wrongPassword,
};
