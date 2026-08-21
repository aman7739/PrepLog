import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat');

  return (
    <div className={`min-h-screen bg-brand-black text-theme-text font-sans flex flex-col ${isChatPage ? 'h-screen overflow-hidden' : ''}`}>
      {!isChatPage && <Navbar />}
      <main className={`w-full ${isChatPage ? 'h-full flex-1' : 'flex-1'}`}>
        <Outlet />
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}

export default Layout;
