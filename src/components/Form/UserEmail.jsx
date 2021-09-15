import { Form } from "react-bootstrap";

const UserEmail = ({ email, onInput }) => {
  return (
    <Form.Group>
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="email"
        name="email"
        value={email}
        onChange={onInput}
        required
      />
      <Form.Control.Feedback type={"invalid"}>
        Please provide a valid email.
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default UserEmail;
