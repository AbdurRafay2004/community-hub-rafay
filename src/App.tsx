import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import CreateCommunity from "./pages/CreateCommunity";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Notices from "./pages/Notices";
import CreateNotice from "./pages/CreateNotice";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import MapView from "./pages/MapView";
import EmergencyAlerts from "./pages/EmergencyAlerts";
import JoinCommunity from "./pages/JoinCommunity";
import CommunitySettings from "./pages/CommunitySettings";
import Surveys from "./pages/Surveys";
import CreateSurvey from "./pages/CreateSurvey";
import Notifications from "./pages/Notifications";
import SearchResults from "./pages/SearchResults";
import MemberManagement from "./pages/MemberManagement";
import EmergencyContacts from "./pages/EmergencyContacts";
import SOSPage from "./pages/SOSPage";
import CheckInTimer from "./pages/CheckInTimer";
import FakeCall from "./pages/FakeCall";
import SafeArrival from "./pages/SafeArrival";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="community-compass-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <VoiceAssistant />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/community/:id" element={<CommunityDetail />} />
            <Route path="/create-community" element={<CreateCommunity />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/create-notice" element={<CreateNotice />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/emergency-alerts" element={<EmergencyAlerts />} />
            <Route path="/join-community" element={<JoinCommunity />} />
            <Route path="/community-settings/:id" element={<CommunitySettings />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/create-survey" element={<CreateSurvey />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/member-management/:id" element={<MemberManagement />} />
            <Route path="/emergency-contacts" element={<EmergencyContacts />} />
            <Route path="/sos" element={<SOSPage />} />
            <Route path="/check-in" element={<CheckInTimer />} />
            <Route path="/fake-call" element={<FakeCall />} />
            <Route path="/safe-arrival" element={<SafeArrival />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
