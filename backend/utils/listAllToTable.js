const simpleListAllToTable = (res, model) => {
	model
		.findAll()
		.then((records) => {
			const mainModelHeaders = Object.keys(model.getAttributes());
			const totalHeaders = [...mainModelHeaders];
			return res.json({
				totalHeaders,
				content: records,
			});
		})
		.catch((err) => console.log(err));
};
export default simpleListAllToTable;
