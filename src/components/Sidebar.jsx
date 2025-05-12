import React, { useEffect, useState, useCallback } from "react"; // Import useCallback
import { IoMenu } from "react-icons/io5";
import { GoProjectSymlink } from "react-icons/go";
import { SiGoogleadsense } from "react-icons/si";
import { FiAlertTriangle } from "react-icons/fi";
import { GrProjects } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import Submenu from "./SubSidebar";

const initialMenuItems = [
    { name: "", icon: IoMenu, visible: true, id: 'menu' },
    { name: "All Projects", icon: GoProjectSymlink, visible: true, id: 'allProjects' },
    { name: "Paid Ads", icon: SiGoogleadsense, visible: false, id: 'paidAds' }, // Initial visibility can be false
    { name: "Alerts", icon: FiAlertTriangle, visible: true, id: 'alerts' },
    { name: "Tools", icon: GrProjects, visible: true, id: 'tools' },
    { name: "Admin", icon: IoSettingsOutline, visible: true, id: 'admin' },
];

const Sidebar = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const [menuItems, setMenuItems] = useState(initialMenuItems);

    // Memoize the function to update menu items to avoid recreating it on every render
    const updateMenuItemsBasedOnStorage = useCallback(() => {
        // Check if localStorage is available
        if (typeof window !== 'undefined' && window.localStorage) {
            const customerId = localStorage.getItem("customer_id");
            const isCustomerConnected = customerId !== null && customerId !== "Not Connected";

            // Update the menuItems state based on the condition
            setMenuItems(prevItems =>
                prevItems.map(item => {
                    if (item.id === "paidAds") { // Use id for reliable targeting
                        // Set visibility based on whether a valid customer_id exists
                        return { ...item, visible: isCustomerConnected };
                    }
                    return item; // Return other items unchanged
                })
            );
        }
    }, []); // Empty dependency array means this function is created once

    useEffect(() => {
        // --- Setup Listener ---
        const handleStorageChange = (event) => {
            // Optional: Check if the change was specifically for 'customer_id'
            // if (event.detail && event.detail.key === 'customer_id') {
                console.log("localStorageChange event detected, updating sidebar menu...");
                updateMenuItemsBasedOnStorage();
            // }
        };

        // Run once on mount to set the initial state correctly
        updateMenuItemsBasedOnStorage();

        // Add event listener for our custom event
        window.addEventListener('localStorageChange', handleStorageChange);

        // --- Cleanup Listener ---
        return () => {
            window.removeEventListener('localStorageChange', handleStorageChange);
        };

    }, [updateMenuItemsBasedOnStorage]); // Depend on the memoized update function


    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-24 bg-gray-50 text-gray-600 flex flex-col items-center py-4 space-y-6 shadow-md">
                {/* Use item.id as key for better stability if names could potentially clash */}
                {menuItems.filter(item => item.visible).map((item) => (
                    <div
                        key={item.id}
                        className={`p-3 flex flex-col items-center rounded-lg cursor-pointer transition-all ${
                            activeMenu === item.name // Keep using name for active state if that's the logic
                                ? "bg-blue-100 text-blue-600"
                                : "hover:bg-gray-100"
                        }`}
                        onClick={() =>
                            setActiveMenu(activeMenu === item.name ? null : item.name)
                        }
                    >
                        <item.icon className="w-8 h-8 p-1" />
                        <span className="text-xs text-center">{item.name}</span>
                    </div>
                ))}
            </div>
            {/* Submenu */}
            {activeMenu && (
                <Submenu menu={activeMenu} onClose={() => setActiveMenu(null)} />
            )}
        </div>
    );
};

export default Sidebar;