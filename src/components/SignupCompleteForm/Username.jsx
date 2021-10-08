import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import debounce from "../../helpers/debounce";
import { isUsernameExist } from "../../services/auth";

const Username = ({ username, onInput }) => {
  const [isUsernameAvailable, setUsernameAvailable] = useState(false);

  const handleUsername = async (e) => {
    const isAvailable = await isUsernameExist(e.target.value);
    setUsernameAvailable(isAvailable);
    onInput(e);
  };

  const debouncedSearch = debounce(handleUsername, 500);

  return (
    <Form.Group>
      <Form.Label>Username</Form.Label>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          required
          type="text"
          name="username"
          minLength="5"
          onChange={debouncedSearch}
          placeholder="Username"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
        <Form.Control.Feedback type="invalid">
          Username must me minimum 5 characters.
        </Form.Control.Feedback>
      </InputGroup>
      {username.length > 0 && (
        <div style={{ fontSize: "0.8rem" }}>
          {isUsernameAvailable ? (
            <span style={{ color: "var(--green)" }}>Username available</span>
          ) : (
            <span style={{ color: "var(--rufous)" }}>
              Username not available
            </span>
          )}
        </div>
      )}
    </Form.Group>
  );
};

export default Username;
