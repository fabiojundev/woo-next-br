import PropTypes from 'prop-types';
import { SearchIcon } from '../icons';

const SearchForm = ( {searchQuery, setSearchQuery, handleSearchFormSubmit, handleOpen} ) => {

  const onKeyUp = ( event ) => {
    const key = event.key;

    if( 'Enter' == key ) {
      handleSearchFormSubmit( event );
    }
  };

  return (
    <form 
      className="flex w-full md:justify-center" 
      onSubmit={handleSearchFormSubmit}
    >
      <div className="relative w-4/5 flex">
            <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
              <SearchIcon className="h-4 w-4 fill-current text-gray-500"/>
            </span>
        <input
          placeholder="Buscar..."
          value={searchQuery}
          onChange={( event ) => setSearchQuery( event.target.value )}
          onKeyUp={onKeyUp}
          className="appearance-none rounded border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
        />
        <span 
          onClick={handleOpen}
          className="text-lg m-2 text-gray-500 cursor-pointer"
        > 
         X 
        </span> 
      </div>
    </form>
  );
};

SearchForm.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  handleSearchFormSubmit: PropTypes.func
};

SearchForm.defaultProps = {
  searchQuery: '',
  setSearchQuery: () => null,
  handleSearchFormSubmit: () => null
};

export default SearchForm;
