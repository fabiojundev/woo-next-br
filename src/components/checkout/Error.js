const Error = ( { errors, fieldName } ) => {

	return(
		errors && ( errors.hasOwnProperty( fieldName ) ) ? (
			<span className="invalid-feedback d-block text-red-500 text-sm">{ errors[fieldName] }</span>
		) : ''
	)
};

export default Error;
