import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.checkValidity()) {
      navigate(`/${searchTerm}`);
    }
  };

  return (
    <Form style={{ flexBasis: "63.6%" }} onSubmit={handleSearch}>
      <InputGroup>
        <FormControl
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Try typing `tuhindas` and press Enter"
          aria-label="Search"
        />
        <Button type="submit" className="outline">
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default Search;
