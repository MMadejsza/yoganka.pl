import React, {useState} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import {fetchItem, fetchStatus, queryClient} from '../../utils/http.js';
import {useQuery, useMutation} from '@tanstack/react-query';
import ModalFrame from './ModalFrame.jsx';
import ViewUser from './ViewUser.jsx';
import ViewCustomer from './ViewCustomer.jsx';
import ViewProduct from './ViewProduct.jsx';
import ViewSchedule from './ViewSchedule.jsx';
import ViewBooking from './ViewBooking.jsx';
import ViewReview from './ViewReview.jsx';
import UserFeedbackBox from './FeedbackBox.jsx';

function ViewFrame({modifier, visited, onClose, bookingOps, userAccountPage, customer, role}) {
	const navigate = useNavigate();
	const params = useParams();
	const location = useLocation();
	const callPath = location.pathname;
	const isAdminPanel = location.pathname.includes('admin-console');
	// const isUserSettings = location.pathname.includes('konto/ustawienia');
	const isCustomerQuery = location.pathname.includes('konto/rezerwacje') ? '/customer' : '';
	const minRightsPrefix = role == 'ADMIN' ? 'admin-console' : '';
	const noFetchPaths = ['statystyki', 'zajecia', 'rezerwacje', 'faktury'];

	console.log('ViewFrame callPath: ', callPath);
	console.log('ViewFrame isCustomerQuery: ', isCustomerQuery);

	console.log('✅ role', role);

	const [editingState, setEditingState] = useState(false);
	const [deleteWarningTriggered, setDeleteWarningTriggered] = useState(false);
	let initialFeedbackConfirmation;
	const [deleteConfirmation, setDeleteConfirmation] = useState(initialFeedbackConfirmation);
	const [deleteErrorMessage, setDeleteErrorMessage] = useState(null);

	const {data, isPending, isError, error} = useQuery({
		queryKey: ['query', location.pathname],
		queryFn: ({signal}) => fetchItem(callPath, {signal}, isCustomerQuery || minRightsPrefix),
		staleTime: 0,
		refetchOnMount: true,
		enabled: !!params.id || location.pathname.includes('ustawienia'),
	});

	if (data) {
		console.log('ViewFrame data: ', data);
	}
	const effectiveData = noFetchPaths.some((pathPart) =>
		location.pathname.split('/').pop().includes(pathPart),
	)
		? customer
		: data;

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	let dataDeleteQuery;
	const {
		mutate: deleteRecord,
		isPending: isDeletePending,
		isError: isDeleteError,
		error: deleteError,
		reset,
	} = useMutation({
		mutationFn: () => {
			return fetch(`/api/admin-console/${dataDeleteQuery}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'CSRF-Token': status.token,
				},
				credentials: 'include', // include cookies
			}).then((response) => {
				return response.json().then((data) => {
					if (!response.ok) {
						// reject with backend data
						return Promise.reject(data);
					}
					return data;
				});
			});
		},
		onSuccess: (res) => {
			setDeleteConfirmation(res.confirmation);
			queryClient.invalidateQueries(['query', `/admin-console/show-all-users/${params.id}`]);
		},
		onError: (err) => {
			setDeleteConfirmation(0);
			setDeleteErrorMessage(err.message);
			console.error('Błąd usuwania:', err);
		},
	});

	// const handleStartEditing = () => {
	// 	setEditingState(true);
	// 	// navigate('/konto/ustawienia');
	// };
	// const handleCloseEditing = () => {
	// 	setEditingState(false);
	// };

	const handleDelete = () => {
		if (!deleteWarningTriggered) {
			// 1st click
			setDeleteWarningTriggered(true);
		} else {
			// 2nd click
			reset();
			deleteRecord();
		}
	};
	const handleCancelDelete = () => {
		setDeleteWarningTriggered(false);
	};

	const resolveModifier = () => {
		let controller = {};
		switch (modifier) {
			case 'user':
				controller.recordDisplay = (
					<ViewUser
						data={data}
						isUserAccountPage={location.pathname.includes('ustawienia') ?? false}
					/>
				);
				controller.deleteBtnTitle = 'Konto';
				controller.deleteQuery = `delete-user/${data.user.UserID}`;
				controller.redirectTo = '/admin-console/show-all-users';
				controller.warnings = [
					'Powiązanego profilu uczestnika',
					'Wszystkich powiązanych rezerwacji',
					'Wszystkich powiązanych faktur',
					'Wszystkich zarezerwowanych terminów',
					'Wszystkich powiązanych opinii',
					"oraz newsletter'ów",
				];
				// controller.recordEditor = <UserForm />;
				return controller;
			case 'customer':
				controller.recordDisplay = <ViewCustomer data={data} />;
				controller.recordEditor = '';
				controller.deleteBtnTitle = 'Profil Uczestnika';

				controller.deleteQuery = `delete-customer/${data.customer.CustomerID}`;
				controller.redirectTo = '/admin-console/show-all-customers';
				controller.warnings = [
					'Wszystkich powiązanych rezerwacji',
					'Wszystkich powiązanych faktur',
					'Wszystkich zarezerwowanych terminów',
					'Wszystkich powiązanych opinii',
				];
				return controller;
			case 'product':
				controller.recordDisplay = (
					<ViewProduct
						data={data}
						isAdminPanel={isAdminPanel}
					/>
				);
				controller.recordEditor = '';
				controller.deleteBtnTitle = 'Produkt';
				controller.deleteQuery = `delete-product/${data.product.ProductID}`;
				controller.redirectTo = '/admin-console/show-all-products';
				controller.warnings = [
					'Wszystkich powiązanych terminów',
					'Wszystkich powiązanych opinii',
				];
				return controller;
			case 'schedule':
				controller.recordDisplay = (
					<ViewSchedule
						data={data}
						bookingOps={bookingOps}
						onClose={onClose}
						isModalOpen={visited}
						isAdminPanel={isAdminPanel}
					/>
				);
				controller.recordEditor = '';
				controller.deleteBtnTitle = 'Termin';
				controller.deleteQuery = `delete-schedule/${data.schedule.ScheduleID}`;
				controller.redirectTo = '/admin-console/show-all-schedules';
				controller.warnings = [
					'Wszystkich powiązanych opinii',
					'Wszystkich powiązanych z terminem obecności, a więc wpłynie na statystyki zajęć i użytkowników',
					'(nie ma potrzeby usuwania terminu)',
				];
				return controller;
			case 'booking':
				controller.recordDisplay = (
					<ViewBooking
						data={data}
						isUserAccountPage={userAccountPage}
						onClose={onClose}
						isModalOpen={visited}
					/>
				);
				controller.recordEditor = '';
				controller.deleteBtnTitle = 'Rezerwację';
				controller.deleteQuery = `delete-booking/${data.booking.BookingID}`;
				controller.redirectTo = '/admin-console/show-all-bookings';
				controller.warnings = [
					'Wszystkich powiązanych faktur',
					'Wszystkich powiązanych z rezerwacją obecności, a więc wpłynie na statystyki zajęć i użytkowników',
				];
				return controller;

			case 'invoices':
				controller.recordDisplay = (
					<ViewReview
						data={customer}
						onClose={onClose}
						isModalOpen={visited}
					/>
				);
				controller.recordEditor = '';
				controller.deleteBtnTitle = 'Opinię';
				controller.deleteQuery = `delete-feedback/${data.feedback.FeedbackID}`;
				controller.redirectTo = '/admin-console/show-all-participants-feedback';
				controller.warnings = '';
				return controller;

			default:
				break;
		}
	};

	let dataDisplay;
	let dataEditor;
	let deleteWarnings;
	let redirectToPage;

	if (isPending) {
		dataDisplay = 'Loading...';
	}
	if (isError) {
		if (error.code == 401) {
			navigate('/login');
		} else {
			console.log(error, error.code, error.message);
			dataDisplay = 'Error in UserDetails fetch...';
		}
	}

	console.log(`ViewFrame customer: `, customer);
	let deleteTitle;
	if (effectiveData) {
		const {recordDisplay, recordEditor, deleteBtnTitle, warnings, deleteQuery, redirectTo} =
			resolveModifier();
		dataDisplay = recordDisplay;
		dataEditor = recordEditor;
		deleteTitle = deleteBtnTitle;
		deleteWarnings = warnings;
		dataDeleteQuery = deleteQuery;
		redirectToPage = redirectTo;
	}

	const actionBtn = (onClick, type, symbol) => {
		const content = type == 'danger' ? `Usuń ${deleteTitle}` : 'Wróć';

		return (
			<button
				onClick={onClick}
				className={`user-container__action modal__btn modal__btn--small modal__btn--small-${type}`}>
				{<span className='material-symbols-rounded nav__icon'>{symbol}</span>}
				{content}
			</button>
		);
	};

	return (
		<ModalFrame
			visited={visited}
			onClose={onClose}>
			<div className='user-container modal__summary'>
				{!deleteWarningTriggered ? (
					dataDisplay
				) : (
					<UserFeedbackBox
						warnings={!deleteErrorMessage ? deleteWarnings : []}
						status={deleteConfirmation}
						isPending={isDeletePending}
						isError={isDeleteError}
						error={deleteErrorMessage ? {message: deleteErrorMessage} : null}
						redirectTarget={redirectToPage}
						onClose={onClose}
					/>
				)}
				<div className='user-container__actions-block'>
					{isAdminPanel && (
						<>
							{actionBtn(handleDelete, 'danger', 'delete_forever')}
							{deleteWarningTriggered &&
								actionBtn(handleCancelDelete, 'success', 'undo')}
						</>
					)}
				</div>
			</div>
		</ModalFrame>
	);
}

export default ViewFrame;
