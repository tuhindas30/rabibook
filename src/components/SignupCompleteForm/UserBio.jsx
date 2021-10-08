import { Form } from "react-bootstrap";

const UserBio = ({ bio, onInput }) => {
  return (
    <Form.Group>
      <Form.Label>Bio</Form.Label>
      <Form.Control
        type="text"
        name="bio"
        maxLength="100"
        value={bio}
        onChange={onInput}
        required
      />
      <Form.Control.Feedback type="invalid">
        Provide your short bio (max 100 characters).
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default UserBio;
