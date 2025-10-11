import { Chessboard } from 'react-chessboard';
import { useKeycloak } from '@react-keycloak/web';
import Game from './features/game';

function App() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return (
      <div className="w-[min(80vw,80vh)] mx-auto p-4">
        <Chessboard />
      </div>
    )
  }

  if (!keycloak.authenticated) {
    keycloak.login();
    return (
      <div className="w-[min(80vw,80vh)] mx-auto p-4">
        <Chessboard />
      </div>
    )
  }

  return (
    <>
      <div className='flex justify-end p-4'>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => keycloak.logout()}>Logout</button>
      </div>
      <Game subject={keycloak.tokenParsed?.sub}/>
    </>
  )
}

export default App
