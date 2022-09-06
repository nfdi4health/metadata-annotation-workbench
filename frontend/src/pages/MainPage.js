import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AnnotationPage from "./AnnotationPage";
import ExportPage from "../components/export/Export";
import ImportPage from "./ImportPage";
import ButtonBar from "../components/layout/ButtonBar";
import Footer from "../components/layout/Footer";
import ImprintPage from "./ImprintPage";
import { ToastContextProvider } from "../components/toast/ToastContext";
import ToastList from "../components/toast/ToastList";
import Tutorial from "./Tutorial";
import About from "./About";
import Header from "../components/layout/Header";
import ScrollToTop from "../components/ScrollToTop";
import PrivacyPage from "./PrivacyPage";

export const MainPage = () => {
  return (
    <BrowserRouter>
      <Header />
      <ToastContextProvider>
        <ScrollToTop>
          <Routes>
            <Route
              path="/annotation/:projectId/:ontologyList"
              element={<AnnotationPage />}
            />
            <Route
              path="/export/:projectId/:ontologyList"
              element={<ExportPage />}
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/imprint" element={<ImprintPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route exact path="/" element={<ImportPage />} />
          </Routes>
        </ScrollToTop>
        <ToastList />
      </ToastContextProvider>
      <ButtonBar />
      <Footer />
    </BrowserRouter>
  );
};
