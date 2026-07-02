import AdityaPortfolio from "./AdityaPortfolio";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SessionProvider } from "./course/context/SessionContext";

const Admin = lazy(() => import("./course/pages/Admin"));
const CourseLanding = lazy(() => import("./course/pages/CourseLanding"));
const Lesson = lazy(() => import("./course/pages/Lesson"));
const Login = lazy(() => import("./course/pages/Login"));
const SessionOver = lazy(() => import("./course/pages/SessionOver"));

function LoadingRoute() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080810] text-white">
      Loading...
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Suspense fallback={<LoadingRoute />}>
          <Routes>
            <Route path="/" element={<AdityaPortfolio />} />
            <Route path="/course" element={<CourseLanding />} />
            <Route path="/course/login" element={<Login />} />
            <Route path="/course/lesson" element={<Lesson />} />
            <Route path="/course/session-over" element={<SessionOver />} />
            <Route path="/course/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </SessionProvider>
    </BrowserRouter>
  );
}
