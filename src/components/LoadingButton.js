import cx from 'classnames';
import Image from "./image";
import LoadingImg from './LoadingImg';


const LoadingButton = ( {loading, handleClick, label, type} ) => {

	return (loading
		? <LoadingImg />
		: <button
			disabled={loading}
			className={cx(
				'px-5 py-3 rounded mr-3 text-sm border-solid border border-current tracking-wide text-white font-bold bg-green-500',
				{ 'hover:bg-green-600 hover:text-white hover:border-green-600': !loading },
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
