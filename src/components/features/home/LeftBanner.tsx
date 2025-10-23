
import { Button, Col } from 'react-bootstrap'

const LeftBanner = () => {
  return (
    <>
    <Col xs={12} md={3} lg={2} xl={2} xxl={2} className="hub-bg-grey p-3 order-3 order-lg-1 d-none d-xxl-flex" style={{ minHeight: "0px" }}>
        <Button className="hub-btn-gamer w-100">
            Categorías
        </Button>
    </Col>
    </>
  )
}

export default LeftBanner