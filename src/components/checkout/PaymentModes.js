import Error from "./Error";

const PaymentModes = ({ input, handleOnChange }) => {

	const { errors, paymentMethod } = input || {}

	return (
		<div className="mt-3">
			<Error errors={errors} fieldName={'paymentMethod'} />

			<div className="form-check woo-next-payment-input-container mt-2">
				{/*Pay with Mercado Pago*/}
				<label className="form-check-label">
					<input
						onChange={handleOnChange}
						value="mercado-pago"
						className="form-check-input mr-3"
						name="paymentMethod"
						type="radio"
						checked={'mercado-pago' === paymentMethod}
					/>
					<span className="woo-next-payment-content">
						Mercado Pago
					</span>
				</label>
				{/*Pay with Stripe*/}
				<label className="form-check-label">
					<input
						onChange={handleOnChange}
						value="stripe-mode"
						className="form-check-input mr-3"
						name="paymentMethod"
						type="radio"
						checked={'stripe-mode' === paymentMethod}
					/>
					<span className="woo-next-payment-content">
						Stripe
					</span>
				</label>
			</div>
		</div>
	);
};

export default PaymentModes;
