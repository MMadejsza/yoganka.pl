import DetailsSchedule from './DetailsSchedule.jsx';
import DetailsProduct from './DetailsProduct.jsx';
import DetailsProductStats from './DetailsProductStats.jsx';
import DetailsProductBookings from './DetailsProductBookings.jsx';
import DetailsProductReviews from './DetailsProductReviews.jsx';
import {calculateProductStats} from '../../utils/productViewsUtils.js';
import React, {useState, useEffect} from 'react';

import {useLocation, useNavigate, useMatch} from 'react-router-dom';
import {useQuery, useMutation} from '@tanstack/react-query';
import {fetchStatus, queryClient} from '../../utils/http.js';

function ViewSchedule({data, bookingOps, onClose, isModalOpen}) {
	// console.clear();
	// console.log(
	// 	`📝
	//     Schedule object from backend:`,
	// 	data,
	// );
	const location = useLocation();
	const navigate = useNavigate();
	const userAccountPage = location.pathname.includes('konto');
	const [isCancelledSuccessfully, setIsCancelledSuccessfully] = useState(false);

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
						throw new Error(errorData.error || 'Błąd podczas anulacji');
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
	const bookedSuccessfully = !userAccountPage && bookingOps.confirmation;
	const isSuccessNotification = bookedSuccessfully || isCancelledSuccessfully;
	let prodStats = null;

	const userAccessed = status.role != 'ADMIN';
	const isAlreadyBooked = schedule.bookedByUser;
	// console.log(`isAlreadyBooked`, isAlreadyBooked);
	console.log(`status`, status);
	const {isLoggedIn} = status;
	if (!userAccessed) prodStats = calculateProductStats(product, [schedule]);

	const handleBooking = () => {
		bookingOps.onBook({
			scheduleID: schedule.ScheduleID,
			productName: product.Name,
			productPrice: product.Price,
		});
	};
	const handleCancellation = () => {
		cancel();
	};

	const bookingBtn = isLoggedIn ? (
		<button
			onClick={() =>
				bookingOps.onBook({
					scheduleID: schedule.ScheduleID,
					productName: product.Name,
					productPrice: product.Price,
				})
			}
			className='book modal__btn'>
			<span className='material-symbols-rounded nav__icon'>shopping_bag_speed</span>
			Rezerwuj
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

	const shouldShowFeedback = isSuccessNotification;
	const shouldShowCancelBtn =
		isLoggedIn && isAlreadyBooked && userAccountPage && !shouldShowFeedback;
	const shouldShowBookBtn = isLoggedIn && !isAlreadyBooked && !bookingOps?.isError;

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

			{bookingOps?.isError && (
				<div className='feedback-box feedback-box--error'>{bookingOps.error.message}</div>
			)}

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
