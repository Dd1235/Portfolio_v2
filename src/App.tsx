import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./state/ThemeContext";
import { ContentProvider } from "./state/ContentContext";
import GridBackdrop from "./components/GridBackdrop";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Writing from "./pages/Writing";
import BlogPost from "./pages/BlogPost";
import Dsa from "./pages/Dsa";
import Ml from "./pages/Ml";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <BrowserRouter>
          <ScrollToTop />
          <GridBackdrop />
          <Nav />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/writing" element={<Writing />} />
              <Route path="/writing/:slug" element={<BlogPost />} />
              <Route path="/dsa" element={<Dsa />} />
              <Route path="/ml" element={<Ml />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </ContentProvider>
    </ThemeProvider>
  );
}
