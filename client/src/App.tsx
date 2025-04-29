import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AuthRoutes from "./routes/AuthRoutes";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Dashboard from "./layout/Dashboard";
import HomePage from "./pages/HomePage";
import SalePage from "./pages/SalePage";
import PurchasePage from "./pages/PurchasePage";
import InventoryPage from "./pages/inventory/InventoryPage";
import ReportsPage from "./pages/ReportsPage";
import { Toaster } from "./components/ui/sonner";
import CreateItem from "./pages/inventory/CreateItem";
import ItemDetail from "./pages/inventory/ItemDetail";
import Companies from "./pages/Companies";
import CreateInvoice from "./pages/NewInvoice";
import InvoiceDetailPage from "./pages/InvoiceDetail";

function App() {
    return (

        <BrowserRouter>
            <Toaster richColors position="top-right" />
            <Routes>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<Dashboard />}>
                    {/* <Route element={<AuthRoutes />}> */}

                        <Route path="/" element={<HomePage />} />
                        <Route path="/companies" element={<Companies />} />
                        <Route path="/sale" element={<SalePage />} />
                        <Route path="/purchase" element={<PurchasePage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/inventory/add-item" element={<CreateItem/>}/>
                        <Route path="/inventory/:id" element={<ItemDetail />} />
                        <Route path="/report" element={<ReportsPage />} />
                        <Route path="/new-invoice" element={<CreateInvoice/>}/>

        <Route path="/invoices/:id" element={<InvoiceDetailPage />} />  
                        

                    {/* </Route> */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App