/**
 * MotoBooth - Modern Mobile Menu Drawer & Blur Overlay Component
 * Dynamically enhances any standard desktop navbar layout into a responsive drawer menu.
 */
document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar-custom") || document.querySelector(".navbar");
    if (!navbar) return;

    // 1. Extract Navigation Links from the Desktop Menu
    const navLinks = navbar.querySelectorAll(".nav-link, .nav-links a, .navbar-nav a");
    const extractedLinks = [];
    
    navLinks.forEach(link => {
        // Skip brand/logo links or empty items
        if (link.closest(".navbar-brand") || link.closest(".logo") || link.classList.contains("logo")) return;
        
        extractedLinks.push({
            text: link.textContent.trim(),
            href: link.getAttribute("href") || "#",
            classes: link.className
        });
    });

    // 2. Extract Brand Logo / Image
    const brandLogo = navbar.querySelector(".navbar-brand img, .logo img");
    const logoSrc = brandLogo ? brandLogo.getAttribute("src") : "Assets/logoMotoBooth.png";
    const logoAlt = brandLogo ? brandLogo.getAttribute("alt") : "MotoBooth";

    // 3. Create Custom Hamburger Trigger Button
    const triggerBtn = document.createElement("button");
    triggerBtn.className = "mobile-menu-trigger";
    triggerBtn.setAttribute("type", "button");
    triggerBtn.setAttribute("aria-label", "Open mobile menu");
    triggerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

    // Insert the trigger button into the navbar container fluid, or right inside the navbar
    const navbarContainer = navbar.querySelector(".container-fluid, .container") || navbar;
    navbarContainer.appendChild(triggerBtn);

    // 4. Build Sliding Mobile Menu Drawer and Overlay HTML
    const overlay = document.createElement("div");
    overlay.className = "mobile-menu-overlay";
    document.body.appendChild(overlay);

    const drawer = document.createElement("div");
    drawer.className = "mobile-menu-drawer";
    
    // Header
    const drawerHeader = document.createElement("div");
    drawerHeader.className = "mobile-menu-header";
    
    const drawerLogo = document.createElement("a");
    drawerLogo.className = "mobile-menu-logo";
    drawerLogo.setAttribute("href", "motobooth.html");
    drawerLogo.innerHTML = `<img src="${logoSrc}" alt="${logoAlt}">`;
    
    const closeBtn = document.createElement("button");
    closeBtn.className = "mobile-menu-close";
    closeBtn.setAttribute("aria-label", "Close mobile menu");
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    
    drawerHeader.appendChild(drawerLogo);
    drawerHeader.appendChild(closeBtn);
    drawer.appendChild(drawerHeader);

    // Content links list
    const linksList = document.createElement("ul");
    linksList.className = "mobile-menu-links";

    // Determine current active page
    const currentPath = window.location.pathname.split("/").pop() || "motobooth.html";

    extractedLinks.forEach(linkInfo => {
        const item = document.createElement("li");
        item.className = "mobile-menu-item";
        
        const linkElement = document.createElement("a");
        linkElement.className = "mobile-menu-link";
        linkElement.setAttribute("href", linkInfo.href);
        linkElement.textContent = linkInfo.text;
        
        // Handle Active Highlight: check if href matches current filename
        const linkPath = linkInfo.href.split("/").pop();
        if (linkPath === currentPath || (currentPath === "" && linkPath === "motobooth.html")) {
            linkElement.classList.add("active");
        }
        
        item.appendChild(linkElement);
        linksList.appendChild(item);
    });

    drawer.appendChild(linksList);
    document.body.appendChild(drawer);

    // 5. Setup Menu Toggle Functions
    function openMenu() {
        drawer.classList.add("active");
        overlay.classList.add("active");
        document.body.classList.add("mobile-menu-open");
    }

    function closeMenu() {
        drawer.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("mobile-menu-open");
    }

    // 6. Bind Event Listeners
    triggerBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    // Close menu when clicking link (for local anchor navigation) or navigating away
    drawer.querySelectorAll(".mobile-menu-link").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // 7. Auto-Close menu on Desktop resize to avoid layout drift
    window.addEventListener("resize", function () {
        if (window.innerWidth >= 992) {
            closeMenu();
        }
    });
});
