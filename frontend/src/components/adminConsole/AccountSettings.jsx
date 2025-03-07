import {useState} from 'react';
import {useLocation, useNavigate, useMatch, useParams} from 'react-router-dom';
import {calculateStats} from '../../utils/customerViewsUtils.js';
import DetailsCustomerStats from './DetailsCustomerStats.jsx';
import ModalTable from './ModalTable.jsx';
import ViewFrame from './ViewFrame.jsx';

import {fetchItem} from '../../utils/http.js';
import {useQuery} from '@tanstack/react-query';
import ModalFrame from './ModalFrame.jsx';
import ViewUser from './ViewUser.jsx';
import ViewCustomer from './ViewCustomer.jsx';
import ViewProduct from './ViewProduct.jsx';
import ViewSchedule from './ViewSchedule.jsx';
import ViewBooking from './ViewBooking.jsx';
import ViewReview from './ViewReview.jsx';
import ViewCustomerTotalSchedules from './ViewCustomerTotalSchedules.jsx';
import ViewCustomerTotalBookings from './ViewCustomerTotalBookings.jsx';

function AccountSettings({data}) {
	let content = (
		<ViewUser
			data={data}
			isUserAccountPage={true}
		/>
	);

	return <>{content}</>;
}

export default AccountSettings;
