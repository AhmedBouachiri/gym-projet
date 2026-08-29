import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Subscriptions from "./pages/Subscriptions";
import Employees from "./pages/admin/Employees";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin/members"
                    element={
                        <RequireAuth>
                            <Layout>
                                <Members />
                            </Layout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin/subscriptions"
                    element={
                        <RequireAuth>
                            <Layout>
                                <Subscriptions />
                            </Layout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin/employees"
                    element={
                        <RequireAuth>
                            <Layout>
                                <Employees />
                            </Layout>
                        </RequireAuth>
                    }
                />
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
