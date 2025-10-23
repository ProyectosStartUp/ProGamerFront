
import { Button } from 'react-bootstrap'
import GoogleLoginButton from './providersLogin/GoogleLoginButton'
import FacebookLoginButton from './providersLogin/FacebookLoginButton'

const LoginProviders = () => {
  return (
        <div className="hub-login-social mt-0 text-center">
            {/* <Button variant="outline-dark">
                <img src="/logoGoogle.svg" height={24} alt="Google" />
            </Button> */}
            <GoogleLoginButton/>

            {/* <Button variant="outline-dark mx-2">
                <img src="/logoFacebook.svg" height={24} alt="Facebook" />
            </Button> */}
            <FacebookLoginButton />

            <Button variant="outline-dark">
                <img src="/logoApple.svg" height={24} alt="Apple" />
            </Button>
        </div>
  )
}

export default LoginProviders