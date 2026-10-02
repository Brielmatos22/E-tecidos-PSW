import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./auth/jsx/RequireAuth.jsx";
import RequirePermission from "./auth/jsx/RequirePermission.jsx";
import useCarrinho from "./hooks/useCarrinho.js";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Admin from "./pages/Admin.jsx";
import AdminContas from "./pages/AdminContas.jsx";
import AdminProdutos from "./pages/AdminProdutos.jsx";
import Carrinho from "./components/Carrinho.jsx";

export default function App() {
  const { carrinho, adicionarAoCarrinho, atualizarQuantidade, removerDoCarrinho, limparCarrinho } = useCarrinho();

  return (
    <Routes>
      <Route path="/" element={<Index onAdicionarCarrinho={adicionarAoCarrinho} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route
        path="/carrinho"
        element={
          <RequireAuth>
            <Carrinho
              itens={carrinho}
              onAdicionar={adicionarAoCarrinho}
              onAtualizarQuantidade={atualizarQuantidade}
              onRemover={removerDoCarrinho}
              onLimpar={limparCarrinho}
            />
          </RequireAuth>
        }
      />

      <Route path="/admin" element={<RequirePermission permission="vendas:read"><Admin /></RequirePermission>} />
      <Route path="/admin/produtos" element={<RequirePermission permission="produtos:write"><AdminProdutos /></RequirePermission>} />
      <Route path="/admin/contas" element={<Navigate to="/admin/contas/pessoa-fisica" replace />} />
      {/* key diferente para o React não reaproveitar o estado de uma página na outra */}
      <Route path="/admin/contas/pessoa-fisica" element={<RequirePermission permission="contas:manage"><AdminContas key="fisica" tipo="fisica" /></RequirePermission>} />
      <Route path="/admin/contas/pessoa-juridica" element={<RequirePermission permission="contas:manage"><AdminContas key="juridica" tipo="juridica" /></RequirePermission>} />
    </Routes>
  );
}