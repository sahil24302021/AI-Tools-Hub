import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

/* Core marketing & auth pages */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Pricing from "./pages/Pricing";
import Tools from "./pages/Tools";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import Billing from "./pages/Billing";
import UsageHistory from "./pages/UsageHistory";
// ❌ Credits removed — DO NOT IMPORT
// import Credits from "./pages/Credits";

/* Legal / info */
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";
import Changelog from "./pages/Changelog";
import Roadmap from "./pages/Roadmap";
import AuthCallback from "./pages/AuthCallback";

/* Tools */
import ChatTool from "./tools/ChatTool";
import VisionTool from "./tools/VisionTool";
import ResumeBuilder from "./tools/ResumeBuilder";
import QuizMaker from "./tools/QuizMaker";
import MathSolver from "./tools/MathSolver";
import PDFTools from "./tools/PDFTools";
import ResearchGenerator from "./tools/ResearchGenerator";
import NotesMaker from "./tools/NotesMaker";
import CodeGenerator from "./tools/CodeGenerator";
import ImageGenerator from "./tools/ImageGenerator";
import Summarizer from "./tools/Summarizer";
import Translator from "./tools/Translator";
import VoiceToText from "./tools/VoiceToText";
import TextToVoice from "./tools/TextToVoice";
import EmailWriter from "./tools/EmailWriter";
import SocialMediaWriter from "./tools/SocialMediaWriter";
import BlogWriter from "./tools/BlogWriter";
import SEOOptimizer from "./tools/SEOOptimizer";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/roadmap" element={<Roadmap />} />

        {/* Protected app section */}
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/tools"
            element={<ProtectedRoute><Tools /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
          <Route
            path="/account"
            element={<ProtectedRoute><AccountSettings /></ProtectedRoute>}
          />
          <Route
            path="/billing"
            element={<ProtectedRoute><Billing /></ProtectedRoute>}
          />
          <Route
            path="/usage"
            element={<ProtectedRoute><UsageHistory /></ProtectedRoute>}
          />

          {/* ❌ Removed this — it was causing the error */}
          {/* <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} /> */}

          {/* Tools */}
          <Route path="/chat" element={<ProtectedRoute><ChatTool /></ProtectedRoute>} />
          <Route path="/vision" element={<ProtectedRoute><VisionTool /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><QuizMaker /></ProtectedRoute>} />
          <Route path="/math" element={<ProtectedRoute><MathSolver /></ProtectedRoute>} />
          <Route path="/pdf" element={<ProtectedRoute><PDFTools /></ProtectedRoute>} />
          <Route path="/research" element={<ProtectedRoute><ResearchGenerator /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><NotesMaker /></ProtectedRoute>} />
          <Route path="/code-generator" element={<ProtectedRoute><CodeGenerator /></ProtectedRoute>} />
          <Route path="/image-generator" element={<ProtectedRoute><ImageGenerator /></ProtectedRoute>} />
          <Route path="/summarizer" element={<ProtectedRoute><Summarizer /></ProtectedRoute>} />
          <Route path="/translator" element={<ProtectedRoute><Translator /></ProtectedRoute>} />
          <Route path="/voice-to-text" element={<ProtectedRoute><VoiceToText /></ProtectedRoute>} />
          <Route path="/text-to-voice" element={<ProtectedRoute><TextToVoice /></ProtectedRoute>} />
          <Route path="/email-writer" element={<ProtectedRoute><EmailWriter /></ProtectedRoute>} />
          <Route path="/social-media-writer" element={<ProtectedRoute><SocialMediaWriter /></ProtectedRoute>} />
          <Route path="/blog-writer" element={<ProtectedRoute><BlogWriter /></ProtectedRoute>} />
          <Route path="/seo-optimizer" element={<ProtectedRoute><SEOOptimizer /></ProtectedRoute>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
