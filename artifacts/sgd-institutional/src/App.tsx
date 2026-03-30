import { Route, Switch, Router } from "wouter";
import { AuthProvider } from "@/context/AuthContext";
import LandingPage from "@/pages/LandingPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route component={LandingPage} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
