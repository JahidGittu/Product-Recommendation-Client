import { Helmet } from 'react-helmet'
import registerLottie from '../../assets/Lotties/register.json'
import Form from './Form/Form'
import './SignUp.css'

import Lottie from 'lottie-react'

const SignUp = () => {


  return (
    <div className='sign-up-page'>
      <Helmet>
        <title>Sign-Up | Recommend Product</title>
      </Helmet>
      <main className='sign-up-container'>
        <div className="sign-up-left sign-up-column">
          <Lottie
            style={{ width: "100%" }}
            animationData={registerLottie}
            loop={true}
          />
        </div>

        <div className="sign-up-right sign-up-column ">
          <h2 className='text-4xl font-bold'>Sign Up Now!</h2>
          <Form />
          <p className='signup-form-terms' id="terms">By clicking the SignUp you agree our terms & conditions</p>
        </div>
      </main>
    </div>
  )
}

export default SignUp
