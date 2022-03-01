import cx from 'classnames';
import LoadingImg from './LoadingImg';


const LoadingButton = ({
	className,
	loading,
	handleClick,
	label,
	type,
	...props
}) => {

	return (loading
		? <LoadingImg />
		: <button
			{...props}
			disabled={loading}
			className={cx(
				'loading-button bg-green-default ' + ( className ?? '' ),
				{ 'opacity-100 cursor-pointer': !loading },
				{ 'opacity-50 cursor-not-allowed': loading }
			)}
			type={type}
			onClick={handleClick}
		>
			{label}
		</button>
	);
};

export default LoadingButton;
