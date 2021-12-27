import { useState } from 'react';
import Router from 'next/router';

import SearchForm from './search-form';
import { SearchIcon } from '../icons';

const NavSearch = () => {
  const [ isOpen, setOpen ] = useState( false );
  const [ searchQuery, setSearchQuery ] = useState( '' );

  const handleSearchFormSubmit = ( event ) => {
    event.preventDefault();
    Router.push( `/search?s=${searchQuery}` );
    return null;
  };

  const onClick = (ev) => {
    setOpen( ! isOpen );
  };

  return (
    isOpen ? (
      <div className="mt-4 md:mt-0">
      <SearchForm
        handleOpen={onClick}
        searchQuery={ searchQuery }
        setSearchQuery={ setSearchQuery }
        handleSearchFormSubmit={handleSearchFormSubmit}
      />
    </div>
    ) : (
      <div className="cursor-pointer">
        <SearchIcon onClick={onClick} className="h-4 w-4 fill-current"/>
      </div>
    )
  );
};

export default NavSearch;
