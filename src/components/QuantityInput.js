
const QuantityInput = (props) => {
	const {
		label,
		value,
		handleChange,
		...nprops
	} = props;

	const min = props.min
		? parseInt(props.min)
		: 1;
	const max = props.max
		? parseInt(props.max)
		: 99;

	const onMinusClick = event => {
		let qty = parseInt(value) - 1;
		if (qty < min) {
			qty = min;
		}

		const ev = {
			target: { value: qty}
		};
		handleChange(ev);

	};
	const onPlusClick = event => {
		let qty = parseInt(value) + 1;
		if (qty > max) {
			qty = max;
		}

		const ev = {
			target: { value: qty}
		};
		handleChange(ev);
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
		<div className="qty-field-wrap flex flex-col justify-center py-4 pr-4">
			{label && 
				<label className="pb-2">
					{label}
				</label>
			}
			<div className="quantity flex justify-center text-sm">
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
					min={min}
					max={max}
					value={value}
					autoComplete="off"
					onChange={onChange}
					className="input-text 
								w-12 h-10 
								text-sm text-center 
								border-solid border-b border-t border-x-0 
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
