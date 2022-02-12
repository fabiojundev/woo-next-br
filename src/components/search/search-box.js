import PropTypes from 'prop-types';
import SearchForm from './search-form';

const SearchBox = ({
  searchQuery,
  setSearchQuery,
  handleSearchFormSubmit
}) => {

  return (
    <div className="px-6">
      <div className="info max-w-xl mx-auto py-10">
        <br />
        <h2 className="text-center py-4 text-3xl">Pesquisar</h2>
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchFormSubmit={handleSearchFormSubmit}
        />
      </div>
    </div>
  );
};

SearchBox.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  handleSearchFormSubmit: PropTypes.func
};

SearchBox.defaultProps = {
  searchQuery: '',
  setSearchQuery: () => null,
  handleSearchFormSubmit: () => null
};

export default SearchBox;
