import { Form } from "react-bootstrap";

const DisplayName = ({ name, onInput }) => {
  return (
    <Form.Group>
      <Form.Label>Name</Form.Label>
      <Form.Control
        type="text"
        name="displayName"
        minLength="3"
        value={name}
        onChange={onInput}
        required
      />
      <Form.Control.Feedback type="invalid">
        Name must be minimum 3 characters.
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default DisplayName;
