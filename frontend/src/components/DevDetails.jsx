function DevDetails({leadingClass}) {
	const devData = {
		content: `© 2024 Maciej Madejsza`,
		link: 'https://bit.ly/MaciejMadejszaProjects',
		title: "Developer's Contact",
	};
	return (
		<div className={`${leadingClass}__credit`}>
			<a
				className={`${leadingClass}__credit-link`}
				href={devData.link}
				target='_blank'
				title={devData.title}>
				<div className={`${leadingClass}__credits`}>
					{/* hard spaces */}
					{devData.content.replace(' ', '\u00A0')}
				</div>
			</a>
		</div>
	);
}

export default DevDetails;
