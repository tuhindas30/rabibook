import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isDisabled, setDisabled] = useState(true);
  const navigate = useNavigate();

  const activateBtn = (e) => {
    const text = e.target.value;
    setSearchInput(text);
    setDisabled(true);
    if (text.length > 0) {
      setDisabled(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/${searchInput}`);
  };

  return (
    <Form onSubmit={handleSearch}>
      <InputGroup className="mb-3" style={{ marginTop: "5rem" }}>
        <FormControl
          value={searchInput}
          onChange={activateBtn}
          placeholder="Try typing `tuhindas` and press Enter"
          aria-label="Search"
        />
        <Button
          type="submit"
          disabled={isDisabled}
          className={`outline ${isDisabled ? "not-allowed" : "pointer"}`}>
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default Search;
