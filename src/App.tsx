import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "./routes/AppRoutes";

function App() {
  // const  clientID = import.meta.env.VITE_CLIENTID_AUTH_GOOGLE
  const clientID = '710228205395-bk2mq50tp9pbem79d4a3bvh26l83q56e.apps.googleusercontent.com'
  console.log('id',clientID);
  
  return (
    <GoogleOAuthProvider clientId={clientID} >
      <AppRoutes/>

    </GoogleOAuthProvider>
  );
}

export default App;


/* 

import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const clientID = import.meta.env.VITE_CLIENTID_AUTH_GOOGLE
  
  return (
    <GoogleOAuthProvider clientId={clientID} >
      <AppRoutes/>

    </GoogleOAuthProvider>
  );
}

export default App;

*/