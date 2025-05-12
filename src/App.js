import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import ReactGA from "react-ga";

import {
  Navbar,
  Sidebar,
  LoadingSpinner,
  Settings
} from "./components";
import {
  YoyAnalysis,
  Login,
  Signup,
  ForgotPassword,
  StrategyIdeas,
  DeviceLevel,
  PlatformAnalysis,
  KeywordAnalysis,
  Age,
  Gender,
  Audience,
  BrandSpecificKeyword,
  NonBrandSpecificKeyword,
  CategorySpecific,
  SubcategorySpecific,
  SubscriptionStatus,
  GetStarted,
  SignupSteps,
  EditProfile,
  PrivacyPolicy,
  BrandOverview,
  GADetection,
  TrafficAnalytics,
  ForecastingTool,
  AdsPositionTool,
  GADetectionTool,
  CampaignsTable,
  Adgroup,
  Changehistory,
  Searchkeywords,
  Ads,
  AdCrafting,
  GoogleAdsOverview,
  BingAdsOverview,
  Projects,
  ProjectList,
  EditProject,
  CreateProject,
  GoogleAdsDailyReporting,
  GoogleAdsAlerts,
  BingAdsAlerts,
  ProjectDetails,
  Billing,
  CreateTask,
  PaidAdsPage,
  SupportPage,
  GoogleAdsWeeklyReporting,
  CreateDetails,
} from "./pages";
import "./App.css";
import { useStateContext } from "./contexts/ContextProvider";
import Demographics from "./pages/Charts/Demographics";
import { Navigate } from "react-router-dom";
import VideoCallPage from "./components/VideoCall";
import SearchTerms from "./pages/SearchTerms";
import CampaignPlanning from "./pages/CampaignPlanning";
import GoogleAdsMonthlyReporting from "./pages/GoogleAdsMonthlyReporting";
import Locations2 from "./pages/Locations2";
import ErrorBoundary from "./pages/Tools/ErrorBoundary";
import PromoRecap from "./pages/PromoRecap";
import CustomReporting from "./pages/CustomReproting";
import CampaignsGroupBy from "./pages/CampaignsGroupBy";
import CreateCustomColumn from "./pages/CustomColumn";
import ChangeLog from "./pages/ChangeLog";
import OnboardingAudit from "./pages/OnboardingAudit";
import PromptPage from "./pages/PromptPage";
import Location3 from "./pages/Location3";
import ChannelPage from "./pages/ChannelPage";
import Submenu from "./components/SubSidebar";
import ResetPassword from "./pages/ResetPassword";

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_CODE);

const App = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
  } = useStateContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
    setIsLoggedIn(!!token);
    setActiveMenu(!!token);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [setCurrentColor, setCurrentMode, token]);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveMenu(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const toggleSidebar = () => {
    setActiveMenu(!activeMenu);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveMenu(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("project_id");
    localStorage.removeItem("daysLeftStatus");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={currentMode === "Dark" ? "dark overflow-y-hidden" : ""}
      style={{ overflowY: "hidden" }}
    >
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg overflow-y-hidden">
          {isLoggedIn && token && (
            <div className={`sidebar ${activeMenu ? "active" : ""}  h-full`}>
              <Sidebar onLogout={handleLogout} />
            </div>
          )}

          <Routes>
            {isLoggedIn && token && (
              <Route path="/subsidebar/:sidebar" element={<Submenu />} />
            )}
          </Routes>

          <div
            className={
              activeMenu
                ? "dark:bg-main-dark-bg bg-main-bg max-h-screen md:ml-2 w-full overflow-hidden"
                : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2"
            }
          >
            {isLoggedIn && token && (
              <div className="md:static bg-main-bg dark:bg-main-dark-bg navbar w-full fixed top-0 left-0 z-50">
                <Navbar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
              </div>
            )}
            <div className="overflow-y-auto h-full">
              <Routes>
                <Route
                  path="/"
                  element={
                    isLoggedIn && token ? (
                      <Navigate to="/projects" />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                {!isLoggedIn || !token ? (
                  <>
                    <Route
                      path="/login"
                      element={<Login onLogin={handleLogin} />}
                    />
                    <Route
                      path="/signup"
                      element={<Signup onSignup={handleLogin} />}
                    />
                    <Route
                      path="/signup-steps"
                      element={<SignupSteps onSignup={handleLogin} />}
                    />
                    <Route
                      path="/ForgotPassword"
                      element={<ForgotPassword />}
                    />
                    <Route path="/ResetPassword" element={<ResetPassword />} />
                    <Route path="/get-started" element={<GetStarted />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  </>
                ) : (
                  <>
                    {/* Protected Routes */}
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/create-project" element={<CreateProject />} />
                    <Route path="/strategy-ideas" element={<StrategyIdeas />} />
                    <Route path="/brand-overview" element={<BrandOverview />} />
                    <Route path="/forecasting" element={<ForecastingTool />} />
                    <Route path="/billing-support" element={<Billing />} />
                    <Route
                      path="/keyword-analysis"
                      element={<KeywordAnalysis />}
                    />
                    <Route
                      path="/create-project"
                      element={<CreateProject step={1} />}
                    />
                    <Route
                      path="/connect-with-Googleads"
                      element={<CreateProject step={2} />}
                    />
                    <Route
                      path="/keyword-analysis-brand-specific"
                      element={<BrandSpecificKeyword />}
                    />
                    <Route
                      path="/keyword-analysis-non-brand-specific"
                      element={<NonBrandSpecificKeyword />}
                    />
                    <Route
                      path="/keyword-analysis-category-specific"
                      element={<CategorySpecific />}
                    />
                    <Route
                      path="/keyword-analysis-subcategory-specific"
                      element={<SubcategorySpecific />}
                    />
                    <Route path="/yoy-analysis" element={<YoyAnalysis />} />
                    <Route
                      path="/platform-analysis"
                      element={<PlatformAnalysis />}
                    />
                    <Route
                      path="/ads-project-performance"
                      element={<PaidAdsPage />}
                    />

                    <Route path="/check-GA-tag" element={<GADetection />} />
                    <Route path="/device-level" element={<DeviceLevel />} />
                    <Route path="/demographics" element={<Demographics />} />
                    <Route path="/demographics-age" element={<Age />} />
                    <Route
                      path="/website-traffic-analysis"
                      element={<TrafficAnalytics />}
                    />
                    <Route
                      path="/demographics-audience"
                      element={<Audience />}
                    />
                    <Route path="/demographics-gender" element={<Gender />} />
                    <Route
                      path="/account-subscription"
                      element={<SubscriptionStatus />}
                    />
                    <Route
                      path="/tools/forecasting"
                      element={<ForecastingTool />}
                    />
                    <Route
                      path="/tools/seed-keyword-analysis"
                      element={<AdsPositionTool />}
                    />
                    <Route path="/tools/ad-crafting" element={<AdCrafting />} />
                    <Route
                      path="/media-planning-overview"
                      element={<CampaignPlanning />}
                    />
                    <Route
                      path="/media-planning/forecasting"
                      element={<ForecastingTool />}
                    />
                    <Route
                      path="/seed-keyword-analysis"
                      element={<AdsPositionTool />}
                    />
                    <Route
                      path="/media-planning/age"
                      element={<GADetectionTool />}
                    />
                    <Route
                      path="/media-planning/location"
                      element={<AdCrafting />}
                    />
                    <Route
                      path="/myspace/forecasting"
                      element={<ForecastingTool />}
                    />
                    <Route
                      path="/myspace/seed-keyword-analysis"
                      element={<AdsPositionTool />}
                    />
                    <Route
                      path="/myspace/check-GA-tag"
                      element={<GADetectionTool />}
                    />
                    <Route
                      path="/myspace/ad-crafting"
                      element={<AdCrafting />}
                    />
                    <Route path="/profile" element={<EditProfile />} />
                    <Route path="/project-list" element={<ProjectList />} />
                    <Route path="/edit-project/:id" element={<EditProject />} />
                    <Route path="/Settings" element={<Settings />} />
                    
                    <Route path="/ads-overview" element={<PaidAdsPage />} />
                    <Route
                      path="/google-ads-overview"
                      element={<GoogleAdsOverview />}
                    />
                    <Route
                      path="/google-ads/overview"
                      element={<GoogleAdsOverview />}
                    />
                    <Route
                      path="/google-ads/overview-reporting"
                      element={<GoogleAdsOverview />}
                    />
                    <Route
                      path="/bing-ads-overview"
                      element={<BingAdsOverview />}
                    />
                    <Route
                      path="/bing-ads/overview"
                      element={<BingAdsOverview />}
                    />
                    <Route
                      path="/bing-ads/overview-reporting"
                      element={<BingAdsOverview />}
                    />
                    <Route
                      path="/google-ads/yesterday-reporting"
                      element={<GoogleAdsDailyReporting />}
                    />
                    <Route
                      path="/google-ads/reporting/daily-reporting"
                      element={<GoogleAdsDailyReporting />}
                    />
                    <Route
                      path="/google-ads/reporting/weekly-reporting"
                      element={<GoogleAdsWeeklyReporting />}
                    />

                    <Route
                      path="/google-ads/reporting/monthly-reporting"
                      element={<GoogleAdsMonthlyReporting />}
                    />

                    <Route
                      path="/google-ads/custom-reproting"
                      element={<CustomReporting />}
                    />
                    <Route path="confi-ai" element={<PromptPage />} />

                    <Route
                      path="/google-ads/campaigns"
                      element={<CampaignsTable />}
                    />
                    <Route
                      path="/google-ads/channel"
                      element={<ChannelPage />}
                    />

                    <Route
                      path="/google-ads/campaign-groups"
                      element={<CampaignsGroupBy />}
                    />

                    <Route
                      path="/custom-column"
                      element={<CreateCustomColumn />}
                    />

                    <Route path="/tools/ads-PromoRecap" element={<PromoRecap />} />

                    <Route path="/google-ads/ad-groups" element={<Adgroup />} />
                    <Route path="/google-ads/ads" element={<Ads />} />
                    <Route
                      path="/google-ads/change-history"
                      element={<Changehistory />}
                    />
                    <Route
                      path="/google-ads/search-keywords"
                      element={<Searchkeywords />}
                    />
                    <Route
                      path="/google-ads/search-terms"
                      element={<SearchTerms />}
                    />

                    <Route
                      path="/google-ads/locations"
                      element={<Location3 />}
                    />
                    <Route
                      path="/google-ads/locations3"
                      element={<Locations2 />}
                    />

                    <Route
                      path="/google-ads-alerts"
                      element={<GoogleAdsAlerts />}
                    />
                    <Route
                      path="/bing-ads-alerts"
                      element={<BingAdsAlerts />}
                    />
                    <Route path="/create-task/:id" element={<CreateTask />} />
                    <Route
                      path="/project-details/:projectId"
                      element={
                        <ErrorBoundary>
                          <ProjectDetails />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/Bingdetails/:projectId"
                      element={<CreateDetails step={2} />}
                    />
                    <Route
                      path="/Googledetails/:projectId"
                      element={<CreateDetails step={1} />}
                    />
                    <Route path="/customer-support" element={<SupportPage />} />
                    <Route path="/videocall" element={<VideoCallPage />} />
                    <Route path="/change-log" element={<ChangeLog />} />
                    <Route
                      path="/onboarding-audit"
                      element={<OnboardingAudit />}
                    />
                  </>
                )}
              </Routes>
            </div>
            {/*{isLoggedIn && token && <div className="relative"><Footer /></div>}*/}
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
