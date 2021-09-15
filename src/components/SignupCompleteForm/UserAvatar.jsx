import { Form } from "react-bootstrap";

const UserAvatar = ({ onInput }) => {
  return (
    <Form.Group>
      <Form.Group>
        <Form.File
          required
          label="Profile picture"
          accept="image/*"
          onChange={onInput}
        />
      </Form.Group>
      <Form.Control.Feedback type="invalid">
        Provide your avatar.
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default UserAvatar;
