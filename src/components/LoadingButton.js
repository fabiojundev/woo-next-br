import cx from 'classnames';
import Image from "./image";
import LoadingImg from './LoadingImg';


const LoadingButton = ( {loading, handleClick, label, type} ) => {

	return (loading
		? <LoadingImg />
		: <button
			disabled={loading}
			className={cx(
				'bg-green-default',
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
