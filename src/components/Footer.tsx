export default function DashboardFooter() {
    return (
        <footer className="w-full bg-white border-t py-4 text-center text-gray-500 text-xs sm:text-sm px-2 mt-auto shadow-inner">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>&copy; {new Date().getFullYear()} CRM System. All rights reserved.</span>
                <a href="#support" className="text-blue-600 hover:underline">Support</a>
            </div>
        </footer>
    )
} 