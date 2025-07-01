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
                <Route path="/my-requests" component={MyRequests} />
                <Route path="/customer-dashboard" component={CustomerDashboard} />
                <Route path="/provider-dashboard" component={ProviderDashboard} />
                <Route path="/provider/:id" component={ProviderProfile} />
                <Route path="/provider-registration" component={ProviderRegistration} />
                <Route path="/messages" component={Messages} />
                <Route path="/quotes" component={QuoteManagement} />
                <Route path="/calendar" component={Calendar} />
                <Route path="/profile" component={Profile} />
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/payment" component={Payment} />
                <Route path="/payment/confirm" component={PaymentConfirmation} />
                <Route path="/notifications" component={Notifications} />
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
