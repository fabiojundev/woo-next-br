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
      <div className="">
      <SearchForm
        handleOpen={onClick}
        searchQuery={ searchQuery }
        setSearchQuery={ setSearchQuery }
        handleSearchFormSubmit={handleSearchFormSubmit}
      />
    </div>
    ) : (
      <div className="cursor-pointer h-4 w-4 inline-block">
        <SearchIcon onClick={onClick} className="h-4 w-4 fill-black"/>
      </div>
    )
  );
};

export default NavSearch;
