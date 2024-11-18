import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import GlobalStyle from "./ui/GlobalStyle";
import { store } from "./redux/store";
import Layout from "./components/layout/Layout";
import Setting from "./components/pages/Setting";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Transcribe from "./components/pages/Transcribe";
import Documents from "./components/pages/Documents";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <GlobalStyle />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Transcribe />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Layout>
                  <Documents />
                </Layout>
              </AdminRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <AdminRoute>
                <Layout>
                  <Setting />
                </Layout>
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
