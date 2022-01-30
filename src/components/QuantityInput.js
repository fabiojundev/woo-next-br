
const QuantityInput = (props) => {
	const {
		label,
		value,
		handleChange,
		...nprops
	} = props;

	const min = props.min
		? parseInt(props.min)
		: 0;
	const max = props.max
		? parseInt(props.max)
		: 99999999999;

	const onMinusClick = event => {
		let qty = parseInt(value) - 1;
		if (qty < min) {
			qty = min;
		}

		event.target.value = qty;
		handleChange(event);

	};
	const onPlusClick = event => {
		let qty = parseInt(value) + 1;
		if (qty > max) {
			qty = max;
		}

		event.target.value = qty;
		handleChange(event);
	};

	const onChange = event => {
		let qty = parseInt(event.target.value);
		if (qty < min) {
			qty = min;
		}
		if (qty > max) {
			qty = max;
		}
		if (!qty || isNaN(qty)) {
			qty = min;
		}

		event.target.value = qty;
		handleChange(event);
	}

	return (
		<div className="qty-field-wrap flex flex-col py-4 w-40">
			{label && <label>{label}</label>}
			<div className="quantity buttons_added pt-2">
				<input
					type="button"
					value="-"
					onClick={onMinusClick}
					className="minus 
								w-10 h-10 
								border border-solid rounded-tl-md rounded-bl-md 
								bg-slate-100 
								cursor-pointer 
								box-content"
				/>
				<input
					type="text"
					inputMode="numeric"
					step="1"
					value={value}
					title={label}
					autoComplete="off"
					onChange={onChange}
					className="input-text 
								w-12 h-10 
								text-center 
								border-b border-solid border-t border-x-0 
								box-content 
								appearance-none"
					{...nprops}
				/>
				<input
					type="button"
					value="+"
					onClick={onPlusClick}
					className="plus 
								w-10 h-10 
								border border-solid rounded-tr-md rounded-br-md 
								bg-slate-100 
								cursor-pointer 
								box-content"
				/>
			</div>
		</div>

	);
};

export default QuantityInput;
