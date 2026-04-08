import { Outlet } from 'react-router-dom'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'


export function AppLayout() {
    return (
        <div className="d-flex vh-100 w-100 overflow-hidden">
            {/* Cột trái: Sidebar cố định */}
            <AppSidebar />

            {/* Cột phải: Header ở trên, Nội dung ở dưới */}
            <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                <AppHeader />

                {/* Vùng nội dung có thể cuộn */}
                <main className="flex-grow-1 overflow-auto  bg-dark text-white">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}