import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductEditPage from "./pages/ProductEditPage";
import MyPage from "./pages/MyPage";
import MyProductsPage from "./pages/MyProductsPage";

function App() {
  return (
    <div className="flex justify-center h-screen overflow-hidden">
      
      <div className="w-full max-w-[430px] bg-white shadow-2xl relative flex flex-col h-full overflow-hidden">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/edit/:id" element={<ProductEditPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/products" element={<MyProductsPage />} />
          </Routes>
        </BrowserRouter>
      </div>
      
    </div>
  );
}

export default App;