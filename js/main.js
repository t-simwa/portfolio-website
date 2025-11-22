/* ===================================================================
 * Luther 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';



   /* Animations
    * -------------------------------------------------- */
    const tl = anime.timeline( {
        easing: 'easeInOutCubic',
        duration: 800,
        autoplay: false
    })
    .add({
        targets: '#loader',
        opacity: 0,
        duration: 1000,
        begin: function(anim) {
            window.scrollTo(0, 0);
        }
    })
    .add({
        targets: '#preloader',
        opacity: 0,
        complete: function(anim) {
            document.querySelector("#preloader").style.visibility = "hidden";
            document.querySelector("#preloader").style.display = "none";
        }
    })
    .add({
        targets: '.s-header',
        translateY: [-100, 0],
        opacity: [0, 1]
    }, '-=200')
    .add({
        targets: [ '.s-intro .text-pretitle', '.s-intro .hero-subtitle'],
        translateX: [100, 0],
        opacity: [0, 1],
        delay: anime.stagger(400)
    })
    .add({
        targets: '.intro-content-btns',
        translateX: [100, 0],
        opacity: [0, 1]
    }, '-=200')
    .add({
        targets: '.circles span',
        keyframes: [
            {opacity: [0, .3]},
            {opacity: [.3, .1], delay: anime.stagger(100, {direction: 'reverse'})}
        ],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-social li',
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-scrolldown',
        translateY: [100, 0],
        opacity: [0, 1]
    }, '-=800');



   /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;
        
        window.addEventListener('load', function() {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function(item){
                item.classList.remove('ss-animated');
            });

            tl.play();
        });

        // force page scroll position to top at page refresh
        // window.addEventListener('beforeunload' , function () {
        //     // window.scrollTo(0, 0);
        // });

    }; // end ssPreloader


   /* Mobile Menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function(event) {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


   /* Highlight active menu link on pagescroll
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {
        
            // Get current scroll position
            let scrollY = window.pageYOffset;
        
            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
               /* If our current scroll position enters the space where current section 
                * on screen is, add .current class to parent element(li) of the thecorresponding 
                * navigation link, else remove it. To know which link is active, we use 
                * sectionId variable we are getting while looping through sections as 
                * an selector
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


   /* Animate elements if in viewport
    * ------------------------------------------------------ */
    const ssViewAnimate = function() {

        const blocks = document.querySelectorAll("[data-animate-block]");

        window.addEventListener("scroll", viewportAnimation);

        function viewportAnimation() {

            let scrollY = window.pageYOffset;

            blocks.forEach(function(current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(400, {start: 200}),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }

    }; // end ssViewAnimate


   /* Swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 32
                },
                // when window width is > 1200px
                1201: {
                    slidesPerView: 2,
                    spaceBetween: 80
                }
            }
         });

    }; // end ssSwiper


   /* Lightbox
    * ------------------------------------------------------ */
    const ssLightbox = function() {

        const folioLinks = document.querySelectorAll('.folio-list__item-link');
        const modals = [];

        folioLinks.forEach(function(link) {
            let modalbox = link.getAttribute('href');
            let instance = basicLightbox.create(
                document.querySelector(modalbox),
                {
                    onShow: function(instance) {
                        //detect Escape key press
                        document.addEventListener("keydown", function(event) {
                            event = event || window.event;
                            if (event.keyCode === 27) {
                                instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function(link, index) {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                modals[index].show();
            });
        });

    };  // end ssLightbox


   /* Alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){

            box.addEventListener('click', function(event) {
                if (event.target.matches(".alert-box__close")) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add("hideit");

                    setTimeout(function(){
                        box.style.display = "none";
                    }, 500)
                }    
            });

        })

    }; // end ssAlertBoxes


   /* Smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo


   /* GitHub Contributions Calendar
    * Vanilla JS implementation matching react-github-calendar
    * ------------------------------------------------------ */
    const ssGitHubCalendar = function() {
        const calendarContainer = document.getElementById('github-calendar');
        if (!calendarContainer) return;

        // GitHub username
        const username = 't-simwa';
        
        // GitHub contributions API endpoint
        const apiUrl = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.contributions && Array.isArray(data.contributions)) {
                    renderCalendar(data.contributions, calendarContainer);
                } else {
                    throw new Error('Invalid data format');
                }
            })
            .catch(error => {
                console.error('Error fetching GitHub contributions:', error);
                calendarContainer.innerHTML = '<p style="color: var(--color-text); text-align: center; padding: 2rem;">Unable to load GitHub contributions. Please check your username.</p>';
            });
    };

    const renderCalendar = function(contributions, container) {
        if (!contributions || contributions.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text); text-align: center; padding: 2rem;">No contributions data available.</p>';
            return;
        }

        // Get the first day's weekday (0 = Sunday, 1 = Monday, etc.)
        const firstDate = new Date(contributions[0].date);
        const firstDayOfWeek = firstDate.getDay(); // 0-6, where 0 is Sunday
        
        // Group contributions into weeks (starting from Sunday)
        const weeks = [];
        let currentWeek = [];
        
        // Add empty days for the first week if it doesn't start on Sunday
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push(null); // null represents an empty day
        }
        
        // Add all contribution days
        contributions.forEach(day => {
            currentWeek.push(day);
            
            // If we've filled a week (7 days), start a new week
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });
        
        // Add remaining days to the last week and pad with nulls if needed
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }
        
        // Calculate total contributions
        const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
        
        // Build calendar HTML - matching GitHub's exact structure
        let calendarHTML = '<div class="calendar-scroll-wrapper">';
        calendarHTML += '<div class="calendar-container">';
        
        // Calendar weeks grid - no weekday labels, just the grid
        calendarHTML += '<div class="calendar-weeks">';
        weeks.forEach(week => {
            calendarHTML += '<div class="calendar-week">';
            week.forEach((day, dayIndex) => {
                if (day === null) {
                    // Empty day (padding)
                    calendarHTML += '<div class="calendar-day calendar-day-empty"></div>';
                } else {
                    // Calculate contribution level (0-4) based on count
                    // Using GitHub's actual algorithm
                    let level = 0;
                    if (day.count > 0) {
                        const maxCount = Math.max(...contributions.map(d => d.count));
                        if (maxCount > 0) {
                            const ratio = day.count / maxCount;
                            
                            if (day.count === 1) level = 1;
                            else if (day.count <= 3) level = 2;
                            else if (day.count <= 6) level = 3;
                            else level = 4;
                        }
                    }
                    
                    const date = new Date(day.date);
                    const dateStr = date.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                    });
                    const tooltip = `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${dateStr}`;
                    
                    calendarHTML += `<div class="calendar-day" 
                        data-level="${level}" 
                        data-count="${day.count}"
                        data-date="${day.date}"
                        aria-label="${tooltip}">
                        <div class="calendar-tooltip">${tooltip}</div>
                    </div>`;
                }
            });
            calendarHTML += '</div>';
        });
        calendarHTML += '</div>';
        calendarHTML += '</div>';
        calendarHTML += '</div>';
        
        // Add contribution count text below calendar
        calendarHTML += `<div class="calendar-footer">
            <span class="calendar-contributions-text">${totalContributions} contribution${totalContributions !== 1 ? 's' : ''} in the last year</span>
        </div>`;
        
        container.innerHTML = calendarHTML;
        
        // Add hover tooltips
        const days = container.querySelectorAll('.calendar-day:not(.calendar-day-empty)');
        
        days.forEach(day => {
            const dayTooltip = day.querySelector('.calendar-tooltip');
            if (!dayTooltip) return;
            
            day.addEventListener('mouseenter', function(e) {
                dayTooltip.classList.add('show');
            });
            
            day.addEventListener('mouseleave', function() {
                dayTooltip.classList.remove('show');
            });
        });
    };

   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssSwiper();
        ssLightbox();
        ssAlertBoxes();
        ssMoveTo();
        ssGitHubCalendar();

    })();

})(document.documentElement);