import { Button } from "react-bootstrap";
import { ReactComponent as Loader } from "../../assets/images/Loader.svg";

const FormButton = ({ disabled, loading, onClick, text }) => {
  return (
    <Button
      type="submit"
      style={{ width: "100%" }}
      className={`button ${disabled ? "not-allowed" : "pointer"}`}
      disabled={disabled}>
      {loading ? <Loader width="1.5rem" height="1.5rem" /> : text}
    </Button>
  );
};

export default FormButton;
