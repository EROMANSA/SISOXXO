import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

function MainLayout() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                background: '#F8FAFC'
            }}
        >
            <Sidebar />

            <main
                style={{
                    flex: 1,
                    minWidth: 0
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;