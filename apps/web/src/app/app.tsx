// Shell applicatif : layout commun rendu autour de chaque route.
// C'est ici que viendront header / sidebar / footer partagés.
import { Outlet } from 'react-router'

export function App() {
    return (
        <div className="min-h-screen">
            {/* Les pages routées s'affichent ici */}
            <Outlet />
        </div>
    )
}
