import {isEmpty, isArray} from 'lodash';
import Page from './page';
import PropTypes from 'prop-types';

const Pages = ( {pages} ) => {

	console.log("pages", pages);
	if ( isEmpty( pages ) && ! isArray( pages ) ) {
		return null;
	}

	return (
		<div className="flex flex-wrap -mb-4">
			{
				pages.map( ( page, index ) => {
					return (
						<div 
							key={`${page?.id}-${index}` ?? ''} 
							className="w-full md:w-1/2 lg:w-1/3 mb-4 px-2"
						>
							<Page page={page}/>
						</div>
					);
				} )
			}
		</div>
	);
};

Pages.propTypes = {
	pages: PropTypes.array
};

Pages.defaultProps = {
	pages: []
};

export default Pages;
