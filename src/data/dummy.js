/* eslint-disable no-unused-vars */
import React from "react";
import { AiOutlineApartment, AiOutlineBulb } from "react-icons/ai";
import { VscFileMedia } from "react-icons/vsc";
import { FaMoneyBillWave } from "react-icons/fa";
import { FcAdvertising } from "react-icons/fc";
import { RiAdvertisementFill } from "react-icons/ri";
import { CgPerformance } from "react-icons/cg";
import { BiLogoBing } from "react-icons/bi";
import {
  FiMonitor,
  FiBarChart,
  FiCreditCard,
  FiStar,
  FiShoppingCart,
  FiAlertCircle,
} from "react-icons/fi";
import { TbLayoutDashboard, TbDeviceImacCheck } from "react-icons/tb";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { PiChartLineUp, PiSortDescendingLight } from "react-icons/pi";
import { MdGridView } from "react-icons/md";

import { TfiLayoutMediaOverlayAlt2 } from "react-icons/tfi";
import {
  BsBoxSeam,
  BsCurrencyDollar,
  BsShield,
  BsChatLeft,
} from "react-icons/bs";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import { TiTick } from "react-icons/ti";
import { SlPeople } from "react-icons/sl";
import { CgNotes } from "react-icons/cg";
import { VscPreview, VscSymbolKeyword } from "react-icons/vsc";
import { SiGoogleads, SiGoogleanalytics } from "react-icons/si";
import { CiUser } from "react-icons/ci";
import { IoAnalyticsSharp } from "react-icons/io5";

export const ColorMappingPrimaryXAxis = {
  valueType: "Category",
  majorGridLines: { width: 0 },
  title: "Months",
};

export const ColorMappingPrimaryYAxis = {
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelFormat: "{value}°C",
  title: "Temperature",
};

export const FinancialPrimaryXAxis = {
  valueType: "DateTime",
  minimum: new Date("2016, 12, 31"),
  maximum: new Date("2017, 9, 30"),
  crosshairTooltip: { enable: true },
  majorGridLines: { width: 0 },
};

export const FinancialPrimaryYAxis = {
  title: "Price",
  minimum: 100,
  maximum: 180,
  interval: 20,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
};

export const FreeAccLinks = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Forecasting",
        icon: <TfiLayoutMediaOverlayAlt2 />,
        path: "myspace/forecasting",
      },
      {
        name: "Seed Keyword Analysis",
        icon: <VscSymbolKeyword />,
        path: "myspace/seed-keyword-analysis",
      },
      {
        name: "Ad Copy Crafting",
        icon: <SiGoogleads />,
        path: "myspace/ad-crafting",
      },
    ],
  },
];

export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Projects",
        icon: <TbLayoutDashboard />,
        path: "projects",
      },
    ],
  },

  {
    title: "Performance",
    links: [
      {
        name: "Project Performance",
        icon: <CgPerformance />,
        path: "ads-project-performance",
      },
    ],
  },

  {
    title: "Media Planning",
    links: [
      {
        name: "Campaign Planning",
        icon: <VscFileMedia />,
        path: "media-planning-overview",
        items: [
          {
            name: "Forecasting",
            icon: <SlPeople />,
            path: "media-planning/forecasting",
          },
          {
            name: "Demographics",
            icon: <SlPeople />,
            path: "media-planning/age",
            items: [
              {
                name: "Age/Gender",
                icon: <SlPeople />,
                path: "media-planning/age-gender",
              },
            ],
          },
          {
            name: "Location",
            icon: <SlPeople />,
            path: "media-planning/location",
          },
        ],
      },
    ],
  },

  {
    title: "Seed Keyword Analysis",
    links: [
      {
        name: "Seed Keyword Analysis",
        icon: <IoAnalyticsSharp />,
        path: "seed-keyword-analysis",
      },
    ],
  },

  {
    title: "Ads",
    links: [
      {
        name: "Paid Ads",
        icon: <RiAdvertisementFill />,
        path: "ads-overview",
        items: [
          {
            name: "Google Ads",
            icon: <SiGoogleads />,
            path: "google-ads-overview",
            items: [
              {
                name: "Performance",
                icon: <MdGridView />,
                path: "google-ads/campaigns",
                items: [
                  {
                    name: "Campaigns",
                    icon: <SlPeople />,
                    path: "google-ads/campaigns",
                  },
                  // {
                  //   name: "Ad Groups",
                  //   icon: <SlPeople />,
                  //   path: "google-ads/ad-groups",
                  // },
                  {
                    name: "Locations",
                    icon: <SlPeople />,
                    path: "google-ads/locations",
                  },
                  {
                    name: "Ads",
                    icon: <SlPeople />,
                    path: "google-ads/ads",
                  },
                  {
                    name: "Keywords",
                    icon: <SlPeople />,
                    path: "google-ads/search-keywords",
                  },
                  {
                    name: "Customer Search Pattern",
                    icon: <SlPeople />,
                    path: "google-ads/search-terms",
                  },
                  {
                    name: "Confi AI",
                    icon: <SlPeople />,
                    path: "confi-ai",
                  },
                  // {
                  //   name: "Change History",
                  //   icon: <SlPeople />,
                  //   path: "google-ads/change-history",
                  // },
                ],
              },
              {
                name: "Reporting",
                icon: <TbBrandGoogleAnalytics />,
                path: "google-ads/yesterday-reporting",
                items: [
                  {
                    name: "Daily Report",
                    icon: <SlPeople />,
                    path: "google-ads/reporting/daily-reporting",
                  },
                  {
                    name: "Weekly Report",
                    icon: <SlPeople />,
                    path: "google-ads/reporting/weekly-reporting",
                  },
                  {
                    name: "Monthly Report",
                    icon: <SlPeople />,
                    path: "google-ads/reporting/monthly-reporting",
                  },
                  {
                    name: "Custom Reporting",
                    icon: <SlPeople />,
                    path: "google-ads/custom-reproting",
                  },
                ],
              },
            ],
          },
          // {
          //   name: "Bing Ads",
          //   icon: <BiLogoBing />,
          //   path: "bing-ads-overview",
          //   items: [
          //     {
          //       name: "View",
          //       icon: <MdGridView />,
          //       path: "bing-ads/overview",
          //       items: [
          //         {
          //           name: "Campaigns",
          //           icon: <SlPeople />,
          //           path: "google-ads/campaigns",
          //         },
          //         {
          //           name: "Ad Groups",
          //           icon: <SlPeople />,
          //           path: "google-ads/ad-groups",
          //         },
          //         {
          //           name: "Locations",
          //           icon: <SlPeople />,
          //           path: "google-ads/locations",
          //         },
          //         {
          //           name: "Ads",
          //           icon: <SlPeople />,
          //           path: "google-ads/ads",
          //         },
          //         {
          //           name: "Keywords",
          //           icon: <SlPeople />,
          //           path: "google-ads/search-keywords",
          //         },
          //         {
          //           name: "Change History",
          //           icon: <SlPeople />,
          //           path: "google-ads/change-history",
          //         },
          //       ],
          //     },
          //     {
          //       name: "Reporting",
          //       icon: <TbBrandGoogleAnalytics />,
          //       path: "bing-ads/overview-reporting",
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
  {
    title: "Ads.",
    links: [
      {
        name: "Ads",
        icon: <RiAdvertisementFill />,
        path: "ads-PromoRecap",
        items: [
          {
            name: "PromoRecap",
            icon: <SiGoogleads />,
            path: "ads-PromoRecap",
          },
        ],
      },
    ],
  },
  {
    title: "Keyword",
    links: [
      {
        name: "Keyword Analysis",
        icon: <CgNotes />,
        path: "keyword-analysis",
        items: [
          {
            name: "Brand Specific",
            icon: <SlPeople />,
            path: "keyword-analysis-brand-specific",
          },
          {
            name: "Non Brand Specific",
            icon: <SlPeople />,
            path: "keyword-analysis-non-brand-specific",
          },
          {
            name: "Category Specific",
            icon: <SlPeople />,
            path: "keyword-analysis-category-specific",
          },
          {
            name: "Subcategory Specific",
            icon: <SlPeople />,
            path: "keyword-analysis-subcategory-specific",
          },
        ],
      },
    ],
  },

  {
    title: "Apps",
    links: [],
  },
  {
    title: "Ad Crafting",
    links: [
      {
        name: "Ad Copy Crafting",
        icon: <AiOutlineApartment />,
        path: "myspace/ad-crafting",
      },
    ],
  },
  {
    title: "Alerts",
    links: [
      {
        name: "Alerts",
        icon: <FiAlertCircle />,
        path: "alerts",
        items: [
          {
            name: "Google Ads Alerts",
            icon: <SlPeople />,
            path: "google-ads-alerts",
          },
          {
            name: "Bing Ads Alerts",
            icon: <SlPeople />,
            path: "bing-ads-alerts",
          },
        ],
      },
    ],
  },
];

export const chatData = [
  {
    message: "Roman Joined the Team!",
    desc: "Congratulate him",
    time: "9:08 AM",
  },
  {
    message: "New message received",
    desc: "Salma sent you new message",
    time: "11:56 AM",
  },
  {
    message: "New Payment received",
    desc: "Check your earnings",
    time: "4:39 AM",
  },
  {
    message: "Jolly completed tasks",
    desc: "Assign her new tasks",
    time: "1:12 AM",
  },
];

export const earningData = [
  {
    icon: <MdOutlineSupervisorAccount />,
    amount: "39,354",
    percentage: "-4%",
    title: "Customers",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "red-600",
  },
  {
    icon: <BsBoxSeam />,
    amount: "4,396",
    percentage: "+23%",
    title: "Products",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
    pcColor: "green-600",
  },
  {
    icon: <FiBarChart />,
    amount: "423,39",
    percentage: "+38%",
    title: "Sales",
    iconColor: "rgb(228, 106, 118)",
    iconBg: "rgb(255, 244, 229)",
    pcColor: "green-600",
  },
  {
    icon: <HiOutlineRefresh />,
    amount: "39,354",
    percentage: "-12%",
    title: "Refunds",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "red-600",
  },
];

export const recentTransactions = [
  {
    icon: <BsCurrencyDollar />,
    amount: "+$350",
    title: "Paypal Transfer",
    desc: "Money Added",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "green-600",
  },
  {
    icon: <BsShield />,
    amount: "-$560",
    desc: "Bill Payment",
    title: "Wallet",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "red-600",
  },
  {
    icon: <FiCreditCard />,
    amount: "+$350",
    title: "Credit Card",
    desc: "Money reversed",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
    pcColor: "green-600",
  },
  {
    icon: <TiTick />,
    amount: "+$350",
    title: "Bank Transfer",
    desc: "Money Added",

    iconColor: "rgb(228, 106, 118)",
    iconBg: "rgb(255, 244, 229)",
    pcColor: "green-600",
  },
  {
    icon: <BsCurrencyDollar />,
    amount: "-$50",
    percentage: "+38%",
    title: "Refund",
    desc: "Payment Sent",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "red-600",
  },
];

export const weeklyStats = [
  {
    icon: <FiShoppingCart />,
    amount: "-$560",
    title: "Top Sales",
    desc: "Johnathan Doe",
    iconBg: "#FB9678",
    pcColor: "red-600",
  },
  {
    icon: <FiStar />,
    amount: "-$560",
    title: "Best Seller",
    desc: "MaterialPro Admin",
    iconBg: "rgb(254, 201, 15)",
    pcColor: "red-600",
  },
  {
    icon: <BsChatLeft />,
    amount: "+$560",
    title: "Most Commented",
    desc: "Ample Admin",
    iconBg: "#00C292",
    pcColor: "green-600",
  },
];

export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];

export const userProfileData = [
  {
    icon: <CiUser />,
    title: "My Profile",
    path: "profile",
    desc: "Account Settings",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
  },
];

export const dropdownData = [
  {
    Id: "1",
    Time: "March 2021",
  },
  {
    Id: "2",
    Time: "April 2021",
  },
  {
    Id: "3",
    Time: "May 2021",
  },
];
export const SparklineAreaData = [
  { x: 1, yval: 2 },
  { x: 2, yval: 6 },
  { x: 3, yval: 8 },
  { x: 4, yval: 5 },
  { x: 5, yval: 10 },
];

export const contextMenuItems = [
  "AutoFit",
  "AutoFitAll",
  "SortAscending",
  "SortDescending",
  "Copy",
  "Edit",
  "Delete",
  "Save",
  "Cancel",
  "PdfExport",
  "ExcelExport",
  "CsvExport",
  "FirstPage",
  "PrevPage",
  "LastPage",
  "NextPage",
];

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const searches = [
  "Web Search",
  "Image Search",
  "News Search",
  "Google Shopping",
  "Youtube Search",
];

export const categories = [
  "Animals & Pets",
  "Advocacy",
  "Apparels",
  "Arts & Entertainment",
  "Attorneys & Legal Services",
  "Automotive",
  "Beauty & Personal Care",
  "Business Services",
  "Dating & Personals",
  "Dentists & Dental Services",
  "Education & Instruction",
  "Finance & Insurance",
  "Home & Home Improvement",
  "Furniture",
  "Health & Fitness",
  "Health & Medical",
  "Home Goods",
  "E-Commerce",
  "Real Estate",
  "Travel and Tourism",
];

export const categoriesFew = [
  "Apparels",
  "Beauty & Personal Care",
  "Travel and Tourism",
];

export const ClientTypeFew = ["Lead Gen", "Revenue based"];

export const durations = [
  "Past day",
  "Past hour",
  "Past 4 hours",
  "Past 7 days",
  "Past 30 days",
  "Past 90 days",
  "Past 12 months",
  "Past 5 years",
  "2004-present",
];
