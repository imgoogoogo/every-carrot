import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MyPage from "./pages/MyPage";
import MyProductsPage from "./pages/MyProductsPage";
import ChatListPage from "./pages/ChatListPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import ProductFormPage from "./pages/ProductFormPage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <div className="flex justify-center h-screen overflow-hidden">
      <div className="w-full max-w-[430px] bg-white shadow-2xl relative flex flex-col h-full overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/write" element={<ProductFormPage />} />
            <Route path="/write/:id" element={<ProductFormPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/products" element={<MyProductsPage />} />
            <Route path="/chat" element={<ChatListPage />} />
            <Route path="/chat/:id" element={<ChatRoomPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
