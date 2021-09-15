import { Form } from "react-bootstrap";

const UserPassword = ({ password, onInput }) => {
  return (
    <Form.Group>
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        name="password"
        minLength="8"
        value={password}
        onChange={onInput}
        required
      />
      <Form.Control.Feedback type="invalid">
        "Password should be minimum of 8 characters."
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default UserPassword;
