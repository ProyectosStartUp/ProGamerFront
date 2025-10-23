
import { Button, Col } from 'react-bootstrap'

const RightBanner = () => {
  return (
    <>
        <Col xs={12} md={4} lg={3} xl={3} xxl={2} className="hub-bg-grey p-3 text-center order-1 order-lg-3">
            <Button className="hub-btn-gamer w-100">
                Ir a pagar
            </Button>
            <img className="mt-4" src="/Alienware.png" style={{ height:"80px", width:"100%", objectFit:"none" }} />
            <img className="" src="/Legion.png" style={{ height:"80px", width:"100%", objectFit:"none" }} />
        </Col>
    </>
  )
}

export default RightBanner