import { Carousel } from "react-bootstrap"
import type { IImgData } from "../../../../interfaces/home";
// En tu main.tsx o App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';

interface ImageGalleryProps {
  image: IImgData;

}

const Item : React.FC<ImageGalleryProps> = ({ image}) => {
  console.log(image, 'imagenes');
  
  return (
    <>
        
     
              <Carousel.Item key={image.id}>
                  <img
                    key={image.id}
                    src={image.src}
                    alt={image.alt}
                    className={image.className} 

                  />
                  <Carousel.Caption></Carousel.Caption>
                </Carousel.Item>
       
          
            
        
    </>
  )
}

export default Item