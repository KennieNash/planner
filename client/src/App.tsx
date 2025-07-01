import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { JobProvider } from "@/contexts/JobContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RequestService from "./pages/RequestService";
import MyRequests from "./pages/MyRequests";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderRegistration from "./pages/ProviderRegistration";
import Messages from "./pages/Messages";
import QuoteManagement from "./pages/QuoteManagement";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import CustomerDashboard from "./pages/CustomerDashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Payment from "./pages/Payment";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <JobProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Switch>
                <Route path="/" component={Index} />
                <Route path="/services" component={Services} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/request-service" component={RequestService} />
                <Route path="/my-requests">
                  <ProtectedRoute>
                    <MyRequests />
                  </ProtectedRoute>
                </Route>
                <Route path="/customer-dashboard">
                  <ProtectedRoute>
                    <CustomerDashboard />
                  </ProtectedRoute>
                </Route>
                <Route path="/provider-dashboard">
                  <ProtectedRoute>
                    <ProviderDashboard />
                  </ProtectedRoute>
                </Route>
                <Route path="/provider/:id" component={ProviderProfile} />
                <Route path="/provider-registration" component={ProviderRegistration} />
                <Route path="/messages">
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                </Route>
                <Route path="/quotes">
                  <ProtectedRoute>
                    <QuoteManagement />
                  </ProtectedRoute>
                </Route>
                <Route path="/calendar">
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                </Route>
                <Route path="/profile">
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </Route>
                <Route path="/admin">
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                </Route>
                <Route path="/payment">
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                </Route>
                <Route path="/payment/confirm">
                  <ProtectedRoute>
                    <PaymentConfirmation />
                  </ProtectedRoute>
                </Route>
                <Route path="/notifications">
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                </Route>
                {/* Catch-all route */}
                <Route component={NotFound} />
              </Switch>
            </TooltipProvider>
          </JobProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  </QueryClientProvider>
);

export default App;
