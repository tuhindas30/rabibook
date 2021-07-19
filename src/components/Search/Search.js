import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isDisabled, setDisabled] = useState(true);

  const activateBtn = (e) => {
    const text = e.target.value;
    setSearchInput(text);
    setDisabled(true);
    if (text.length > 0) {
      return setDisabled(false);
    }
  };

  return (
    <InputGroup className="mb-3" style={{ marginTop: "5rem" }}>
      <FormControl
        value={searchInput}
        onChange={activateBtn}
        placeholder="Search user"
        aria-label="Search"
        aria-describedby="basic-addon2"
      />
      <Link to={`/${searchInput}`}>
        <Button
          disabled={isDisabled}
          className={`outline ${isDisabled ? "not-allowed" : "pointer"}`}>
          <FaSearch />
        </Button>
      </Link>
    </InputGroup>
  );
};

export default Search;
