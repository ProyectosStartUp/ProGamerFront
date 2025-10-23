

import { Carousel } from 'react-bootstrap'
import { DataCarrusel } from '../../../../utils/utils'

const Carrusel = () => {

    
    return (
        <Carousel>
            {DataCarrusel.map((image) => (
                <Carousel.Item key={image.id}>
                    <img
                        className={image.className || "d-block w-100"}
                        src={image.src} // Usar src según tu console.log
                        alt={image.alt}
                        style={{ 
                            height: '400px', 
                            width: '100%',
                            objectFit: 'cover' 
                        }}
                    />

                </Carousel.Item>
                
            ))}
        </Carousel>
    )
}

export default Carrusel