import ViewUser from './ViewUser.jsx';

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
