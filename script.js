document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progressBar");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const replayBtn = document.getElementById("replayBtn");
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    // E2: Reading progress indicator
    function updateProgress() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    // Dark mode toggle
    darkModeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");

        darkModeToggle.setAttribute("aria-pressed", String(isDark));
        darkModeToggle.innerHTML = isDark
            ? '☀ <span class="hidden sm:inline">Theme</span>'
            : '☾ <span class="hidden sm:inline">Theme</span>';
    });

    // Mobile navigation
    mobileMenuToggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("hidden") === false;

        mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
        mobileMenuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
        mobileMenuToggle.textContent = isOpen ? "✕" : "☰";
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
            mobileMenuToggle.setAttribute("aria-expanded", "false");
            mobileMenuToggle.textContent = "☰";
        });
    });

    // D1: GSAP intro timeline
    let introTimeline;

    function playIntro() {
        if (typeof gsap === "undefined") {
            document.getElementById("heroContent").style.opacity = "1";
            document.getElementById("heroVisual").style.opacity = "1";
            return;
        }

        if (introTimeline) introTimeline.kill();

        gsap.set(["#heroContent", "#heroVisual"], {
            opacity: 0,
            y: 25
        });

        introTimeline = gsap.timeline();

        introTimeline
            .to("#heroContent", {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out"
            })
            .to("#heroVisual", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.5");
    }

    // E1: ScrollTrigger reveals, with a fallback if GSAP fails to load
    function initReveals() {
        if (typeof gsap !== "undefined" &&
            typeof ScrollTrigger !== "undefined") {

            gsap.registerPlugin(ScrollTrigger);

            gsap.utils.toArray(".reveal").forEach(section => {
                gsap.fromTo(section,
                    { opacity: 0, y: 35 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                            once: true
                        }
                    }
                );
            });
        } else {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });

            document.querySelectorAll(".reveal").forEach(section => {
                observer.observe(section);
            });
        }
    }

    if (replayBtn) {
        replayBtn.addEventListener("click", playIntro);
    }

    playIntro();
    initReveals();

    // Demo form: no backend or email delivery is configured
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        formStatus.textContent =
            "Thanks for your message! This demo form is not connected to email yet.";

        contactForm.reset();
    });
});