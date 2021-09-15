import { Container } from "react-bootstrap";
import { Footer, Navigation, SideNav } from "../components";

const Wrapper = ({ children }) => {
  return (
    <>
      <Navigation />
      <SideNav />
      <Container fluid className="wrapper">
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default Wrapper;
