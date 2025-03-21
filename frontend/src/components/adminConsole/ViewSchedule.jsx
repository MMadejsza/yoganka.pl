import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';

import DetailsSchedule from './DetailsSchedule.jsx';
import DetailsProduct from './DetailsProduct.jsx';
import DetailsScheduleStats from './DetailsScheduleStats.jsx';
import DetailsProductBookings from './DetailsProductBookings.jsx';
import DetailsTableAttendance from './DetailsTableAttendance.jsx';
import DetailsProductReviews from './DetailsProductReviews.jsx';
import ViewScheduleNewCustomerForm from './ViewScheduleNewCustomerForm.jsx';

import {calculateScheduleStats} from '../../utils/productViewsUtils.js';
import {queryClient, mutateOnEdit} from '../../utils/http.js';
import {useAuthStatus} from '../../hooks/useAuthStatus.js';

function ViewSchedule({data, bookingOps, onClose, isModalOpen, isAdminPanel}) {
	// console.clear();
	console.log(
		`📝
	    Schedule object from backend:`,
		data,
	);
	const location = useLocation();
	const navigate = useNavigate();
	const userAccountPage = location.pathname.includes('konto');

	const {data: status} = useAuthStatus();

	const {
		mutate: cancel,
		isError: isCancelError,
		error: cancelError,
		reset: cancelReset,
	} = useMutation({
		mutationFn: (formDataObj) =>
			mutateOnEdit(status, formDataObj, `/api/customer/edit-mark-absent/${scheduleID}`),

		onSuccess: (res) => {
			queryClient.invalidateQueries(['data', '/grafik']);
			queryClient.invalidateQueries(['account']);
			setIsCancelledSuccessfully(true);
		},
	});

	const [isCancelledSuccessfully, setIsCancelledSuccessfully] = useState(false);

	console.log(`status.role`, status.role);
	const [newCustomerDetails, setNewCustomerDetails] = useState({
		isFirstTimeBuyer: status.role == 'USER',
	});
	console.log(`newCustomerDetails: `, newCustomerDetails);
	const [isFillingTheForm, setIsFillingTheForm] = useState(false);

	useEffect(() => {
		if (isCancelledSuccessfully) {
			const timer = setTimeout(() => {
				cancelReset();
				onClose();
				navigate('/konto');
				setIsCancelledSuccessfully(false);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [isCancelledSuccessfully, cancelReset, navigate, isModalOpen, onClose]);

	const {schedule} = data;
	const {ScheduleID: scheduleID} = schedule;
	const {Product: product} = schedule;
	const type = product.Type;
	const isFull = schedule.full;
	const wasPreviouslyReserved = schedule.wasUserReserved;
	const isAlreadyBooked = schedule.isUserGoing;

	const today = new Date();
	const scheduleDateTime = new Date(`${schedule.Date}T${schedule.StartTime}:00`);
	const isArchived = scheduleDateTime < today;
	const bookedSuccessfully = !userAccountPage && bookingOps?.confirmation;
	const isSuccessNotification = bookedSuccessfully || isCancelledSuccessfully;
	let scheduleStats = null;

	const userAccessed = status.role != 'ADMIN';

	const {isLoggedIn} = status;
	if (!userAccessed && isAdminPanel) scheduleStats = calculateScheduleStats(product, schedule);

	const handleCancellation = () => {
		cancel();
	};
	const handleFormSave = (details) => {
		setNewCustomerDetails(details);
		setIsFillingTheForm(false);
	};

	const shouldShowFeedback = isSuccessNotification;
	const shouldShowCancelBtn =
		isLoggedIn && isAlreadyBooked && userAccountPage && !shouldShowFeedback;
	const shouldShowBookBtn = !isArchived && !isAlreadyBooked && !bookingOps?.isError;
	const shouldDisableBookBtn = (isFull && shouldShowBookBtn) || isFillingTheForm;

	const bookingBtn = isLoggedIn ? (
		<button
			onClick={
				!shouldDisableBookBtn
					? newCustomerDetails.isFirstTimeBuyer
						? () => setIsFillingTheForm(true)
						: () =>
								bookingOps.onBook({
									customerDetails: newCustomerDetails || null,
									schedule: schedule.ScheduleID,
									product: product.Name,
									status: 'Paid',
									amountPaid: product.Price,
									amountDue: 0,
									paymentMethod: 'Credit Card',
									paymentStatus: 'Completed',
								})
					: null
			}
			className={`book modal__btn ${shouldDisableBookBtn && 'disabled'}`}>
			<span className='material-symbols-rounded nav__icon'>
				{shouldDisableBookBtn
					? 'block'
					: wasPreviouslyReserved
					? 'cycle'
					: newCustomerDetails.isFirstTimeBuyer
					? 'edit'
					: 'shopping_bag_speed'}
			</span>
			{shouldDisableBookBtn
				? isFillingTheForm
					? 'Wypełnij formularz'
					: 'Brak Miejsc'
				: wasPreviouslyReserved
				? 'Wróć na zajęcia'
				: newCustomerDetails.isFirstTimeBuyer
				? 'Uzupełnij dane osobowe'
				: 'Rezerwuj'}
		</button>
	) : (
		<button
			onClick={() => navigate('/login')}
			className='book modal__btn'>
			<span className='material-symbols-rounded nav__icon'>login</span>
			Zaloguj się
		</button>
	);

	const feedbackBox = (
		<div className='feedback-box feedback-box--success'>
			{isCancelledSuccessfully
				? 'Miejsce zwolnione - dziękujemy za informacje :)'
				: 'Miejsce zaklepane - do zobaczenia ;)'}
		</div>
	);

	return (
		<>
			{userAccessed ? (
				<>
					<h1 className='user-container__user-title modal__title'>{`${product.Name}`}</h1>
				</>
			) : (
				<>
					<h1 className='user-container__user-title modal__title'>{`Termin (ID:${schedule.ScheduleID})`}</h1>
					<h1 className='user-container__user-status modal__title'>{`Dla: "${product.Name} (ID:${product.ProductID})"`}</h1>
				</>
			)}

			{/*//@ Schedule main details */}
			{!isFillingTheForm ? (
				<>
					<div className='user-container__main-details modal-checklist'>
						<DetailsSchedule
							data={schedule}
							placement={'scheduleView'}
							isAdminPanel={isAdminPanel}
						/>
					</div>
					{/*//@ Product main details */}
					<div className='user-container__side-details modal-checklist'>
						<DetailsProduct
							data={product}
							placement={'scheduleView'}
							userAccessed={userAccessed}
						/>
					</div>
				</>
			) : (
				<ViewScheduleNewCustomerForm onSave={handleFormSave} />
			)}

			{/*//@ Product stats */}
			{!userAccessed && isAdminPanel && (
				<>
					<div className='user-container__main-details modal-checklist'>
						<DetailsScheduleStats
							data={product}
							scheduleStats={scheduleStats}
						/>
					</div>

					{/*//@ all bookings if not event/camp? */}

					<div className='user-container__main-details  schedules modal-checklist'>
						<DetailsTableAttendance
							stats={scheduleStats}
							type={type}
							isAdminPage={isAdminPanel}
						/>
					</div>
					<div className='user-container__main-details  schedules modal-checklist'>
						<DetailsProductBookings
							stats={scheduleStats}
							type={type}
							isAdminPage={isAdminPanel}
						/>
					</div>

					{/*//@ Feedback */}

					<div className='user-container__main-details  schedules modal-checklist'>
						<DetailsProductReviews stats={scheduleStats} />
					</div>
				</>
			)}

			{bookingOps?.isError ||
				(isCancelError && (
					<div className='feedback-box feedback-box--error'>
						{bookingOps.error?.message || cancelError.message}
					</div>
				))}

			{shouldShowFeedback ? feedbackBox : shouldShowBookBtn ? bookingBtn : null}

			{shouldShowCancelBtn && (
				<button
					onClick={handleCancellation}
					className='book modal__btn modal__btn--cancel'>
					<span className='material-symbols-rounded nav__icon'>
						sentiment_dissatisfied
					</span>
					Daj znać, że nie przyjdziesz...
				</button>
			)}
		</>
	);
}

export default ViewSchedule;
