import DetailsSchedule from './DetailsSchedule.jsx';
import DetailsProduct from './DetailsProduct.jsx';
import DetailsProductStats from './DetailsProductStats.jsx';
import DetailsProductBookings from './DetailsProductBookings.jsx';
import DetailsProductReviews from './DetailsProductReviews.jsx';
import ViewScheduleNewCustomerForm from './ViewScheduleNewCustomerForm.jsx';
import {calculateProductStats} from '../../utils/productViewsUtils.js';
import React, {useState, useEffect} from 'react';

import {useLocation, useNavigate, useMatch} from 'react-router-dom';
import {useQuery, useMutation} from '@tanstack/react-query';
import {fetchStatus, queryClient} from '../../utils/http.js';

function ViewSchedule({data, bookingOps, onClose, isModalOpen}) {
	// console.clear();
	console.log(
		`📝
	    Schedule object from backend:`,
		data,
	);
	const location = useLocation();
	const navigate = useNavigate();
	const userAccountPage = location.pathname.includes('konto');

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const {
		mutate: cancel,
		isError: isCancelError,
		error: cancelError,
		reset: cancelReset,
	} = useMutation({
		mutationFn: async () =>
			await fetch(`/api/customer/grafik/cancel/${scheduleID}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'CSRF-Token': status.token,
				},
				credentials: 'include',
			}).then((response) => {
				if (!response.ok) {
					return response.json().then((errorData) => {
						throw new Error(errorData.message || 'Błąd podczas anulacji');
					});
				}
				return response.json();
			}),
		onSuccess: (res) => {
			queryClient.invalidateQueries(['data', '/grafik']);
			queryClient.invalidateQueries(['account']);
			setIsCancelledSuccessfully(true);
		},
	});

	const [isCancelledSuccessfully, setIsCancelledSuccessfully] = useState(false);
	const [newCustomerDetails, setNewCustomerDetails] = useState({
		isFirstTimeBuyer: !!status.role != 'CUSTOMER' || !!status.role != 'ADMIN',
	});
	const [isFillingTheForm, setIsFillingTheForm] = useState(false);
	console.log(`newCustomerDetails: `, newCustomerDetails);

	useEffect(() => {
		if (isCancelledSuccessfully) {
			const timer = setTimeout(() => {
				cancelReset();
				// if (isModalOpen) onClose();
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
	const bookedSuccessfully = !userAccountPage && bookingOps.confirmation;
	const isSuccessNotification = bookedSuccessfully || isCancelledSuccessfully;
	let prodStats = null;

	const userAccessed = status.role != 'ADMIN';

	const {isLoggedIn} = status;
	if (!userAccessed) prodStats = calculateProductStats(product, [schedule]);

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
									scheduleID: schedule.ScheduleID,
									productName: product.Name,
									productPrice: product.Price,
									customerDetails: newCustomerDetails,
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
							userAccessed={userAccessed}
						/>
					</div>
					{/*//@ Product main details */}
					<div className='user-container__main-details modal-checklist'>
						<DetailsProduct
							data={product}
							placement={'schedule'}
							userAccessed={userAccessed}
						/>
					</div>
				</>
			) : (
				<ViewScheduleNewCustomerForm onSave={handleFormSave} />
			)}

			{/*//@ Product stats */}
			{!userAccessed && (
				<>
					<div className='user-container__main-details modal-checklist'>
						<DetailsProductStats
							data={product}
							prodStats={prodStats}
							placement={'schedule'}
						/>
					</div>

					{/*//@ all bookings if not event/camp? */}

					<div className='user-container__main-details  schedules modal-checklist'>
						<DetailsProductBookings
							stats={prodStats}
							type={type}
						/>
					</div>

					{/*//@ Feedback */}

					<div className='user-container__main-details  schedules modal-checklist'>
						<DetailsProductReviews stats={prodStats} />
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
