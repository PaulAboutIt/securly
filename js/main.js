/*
 * Author: Matthijs Molhoek, 66Themes
 * URL: http://themeforest.net/user/66themes
 *
 * Project Name: Coffea - Site Template
 * Version: 1.0
 * Date: 06-02-2014
 * Last update: 06-02-2014
 * URL: -
 */

(function () {
    "use strict";
    /*jslint browser:true*/
    /*global $, jQuery, Spinner, google*/

    $(document).ready(function () {
        var wpOffset = 80,
            $portfolioContainer = $('.portfolio-container'),
            $articleContainer = $('.article-container'),
            isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

        /*Login functions for Parents*/
        $("#parent-login").submit(function(e){  
            $('.pass-error').remove();
            var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
            if (re.test($('#login-password').val()) && e.target.checkValidity()) {
                $.ajax({
                    type: "POST",
                    url: gUrlHome + "/_login.php",
                    data: {email: $('#cemail').val(), password: $('#login-password').val()},
                    dataType: JSON,
                    complete: function(xhr, textStatus){ 
                        if(xhr.status == 200) {
                            window.location.href="/app/#/";
                        } else if (xhr.status == 500) {
                            $('#normal-login').append('<span class="pass-error">Inncorrect email or password</span>');
                        } else if (xhr.status == 401) {
                            $('#normal-login').append('<span class="pass-error">Inncorrect email or password</span>');
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                           
                    }
                  });
            } else if (!re.test($('#login-password').val())){
                $('pass-error').remove();
                $('#parent-login').append('<span class="pass-error" style="color:red">Password or Username is invalid.</span>');
            }
            return false;
        });
        
        $("#reset-login").submit(function(e){  
            $('.pass-error').remove();
            if (e.target.checkValidity()) {
                $.ajax({
                    type: "GET",
                    url: gUrlHome + "/_passwordReset?email=" + encodeURIComponent($('#reset-email').val()),
                    complete: function(xhr, textStatus){ 
                        if(xhr.status == 200) {
                            $('#reset-login').append('<span class="pass-error">An email has been sent to ' + $('#reset-email').val() + '</span><br><span>Please click the link in that email to reset your password in the next 72 hours.</span><br><button onclick="window.location.reload()">Refresh and Login</button>');
                            $('#reset-password-button').remove();
                            $('.reset-input').remove();
                        } else if (xhr.status == 500) {
                            $('.forgot-password').append('<span class="pass-error">Inncorrect email or password</span>');
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                           
                    }
                  });
            }
            return false;
        });

        $("#reset-password").submit(function(e){  
            if ($('#confirm-email').val() != '') {
                return false;
            }
            $('.pass-error').remove();
            if($('#password-reset').val() != $('#password-reset-conf').val()) {
                $('#reset-password').append('<span class="error" style="color:red">Password mismatch</span>');
                return false;
            };
            var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
            if (re.test($('#password-reset').val()) && e.target.checkValidity()) {
                var token = getUrlParameter('token');
                if(!token) {
                    window.location.href="/app/#/";
                }
                $.ajax({
                    type: "POST",
                    url: gUrlHome + "/_passwordReset",
                    data: {password: $('#password-reset').val(), token: token},
                    complete: function(xhr, textStatus){ 
                        console.log(xhr, textStatus, 'status');
                        if(xhr.status == 200) {
                            /*go to login page*/
                            window.location.href="/app/#/";
                            /*document.getElementById('login-btn').click();*/
                        } else if (xhr.status == 500) {
                            $('.forgot-password').append('<span class="pass-error">Inncorrect email or password</span>');
                        }
                    },
                    success: function(xhr, textStatus){ 
                        console.log(xhr, textStatus, 'status scuccs');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                           
                    }
                  });
            } else if (!re.test($('#parent-password').val())){
                $('#reset-password').append('<span class="error" style="color:red">Password must contain at least one capital and one lowercase letter along with a number.</span>');
                
            }
            return false;
        });
        
        
        /*Signup functions for Parents*/
        $('#sign-up').submit(function(e){
            if ($('#confirm-email').val() != '') {
                return false;
            }
            var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
            if (re.test($('#parent-password').val()) && e.target.checkValidity()) {                
                $.ajax({
                    type: "POST",
                    url: gUrlHome + "/_signupconsumer.php",
                    data: {email: $('#parent-email').val(), password: $('#parent-password').val(), tzOffset: new Date().getTimezoneOffset()},
                    dataType: JSON,
                    complete: function(xhr, textStatus){ 
                        console.log(xhr, textStatus);
                        if(xhr.status == 200) {
                            window.location.href= '/app/#/';
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('err', jqXHR, textStatus, errorThrown);
                        if(jqXHR.status == 409) {
                            $('.pass-error').remove();
                            $('.already').append('<span class="pass-error">This email is already registered.</span>');  
                        }
                        return false
                    }
                  });
            } else if (!re.test($('#parent-password').val())){
                $('.pass-error').remove();
                $('.already').append('<span class="pass-error" style="color:red">Password must contain at least one capital and one lowercase letter along with a number.</span>');
                
            }
            return false;
        });
        

        // Fade in body on page load (JS enabled only!)
        $('body').addClass('loaded');

        $('input').on('focus', function() {
            $('.head-top').addClass('input-selected');
        })
        $('input').on('blur', function() {
            $('.head-top').removeClass('input-selected');
        })

        //News and Events Tab 

        $('ul.tabs').each(function(){
            var $active, $content, $links = $(this).find('a');
            $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
            $active.addClass('active');
            $content = $($active[0].hash);
            $links.not($active).each(function () {
              $(this.hash).hide();
            });
            $(this).on('click', 'a', function(e){
              $active.removeClass('active');
              $content.hide();
              $active = $(this);
              $content = $(this.hash);
              $active.addClass('active');
              $content.show();
              e.preventDefault();
            });
          });    
        $('input').blur( function() {
           if ($(this).val().length != 0) {
            $(this).addClass('white-input');
           }
        });         
        //Calculate Quote Functions
        function calc () {
            $('.calculate-message').addClass('hidden');
            $('.quote-parent').removeClass('hidden');

            var stu = +($('.num-students').val());
            var dev = +($('.num-devices').val());
            var quote = +((stu + dev)*10);

            
            $('.quote-price').text(quote);
        };
        $('.get-quote').on('click', function() {
            calc();
        });
        //Show Take Home Checkboxes

        $( ".th-check" ).change(function() {
          var show = $('.take-home-options').css('display');
          if (show == 'none') {
            $('.take-home-options').show(200);
          } else {
            $('.take-home-options').hide(300);
          }
        });

        //Show Hints
        var timer;
        $(".ipadd").on("mouseenter", function(){
            timer = setTimeout(function () {
                $(".ipadd + .bubble").removeClass("hidden");
            }, 500);
        }).on("mouseleave", function(){
            clearTimeout(timer);
            $(".bubble").addClass("hidden");
        });

        $(".sources").on("mouseenter", function(){
            timer = setTimeout(function () {
                $(".sources .bubble").removeClass("hidden");
            }, 500);
        }).on("mouseleave", function(){
            clearTimeout(timer);
            $(".bubble").addClass("hidden");
        });

        //Numeric
        $('input.numeric').numeric();

        // Init Superslides
        $('#main-superslides').superslides({
            play: 8000,
            animation: 'fade',
            slide_easing: 'easeInOutCubic',
            slide_speed: 800,
            pagination: true,
            hashchange: false,
            scrollable: true
        });

        $('#testimonial-superslides').superslides({
            play: 8000,
            animation: 'fade',
            slide_easing: 'easeInOutCubic',
            slide_speed: 800,
            pagination: false,
            hashchange: false,
            scrollable: true,
        });

        //  POPUPs
        $('#forgot-password').on('click', function() {
            $('#normal-login').addClass('hidden');
            $('#reset').removeClass('hidden');
        });
        $('#retun-login').on('click', function() {
            $('#normal-login').removeClass('hidden');
            $('#reset').addClass('hidden');
        });         
        $('.popup-vimeo').magnificPopup({type:'iframe'});
        $('#login-btn').magnificPopup({
          items: {
              src: '#login',
              type: 'inline'
          }
        }); 
        
        $('.get-started-link').magnificPopup({
          items: {
              src: '#sign-up',
              type: 'inline'
          }
        });
        $('.get-started').magnificPopup({
          items: {
              src: '#sign-up',
              type: 'inline'
          }
        }); 
        $('.login-btn').on('click', function() {
            $('.main-nav').removeClass('trigger-active');
        });

        //NEWSLETTER POPUP
        $('.newsletter-btn').magnificPopup({
          items: {
              src: '#freetrial_inline',
              type: 'inline'
          }
        });

        //WHITE PAPER POPUP
        $('.whitepaper-btn').magnificPopup({
          items: {
              src: '#whitepaper_inline',
              type: 'inline'
          }
        });

        //LEARN MORE POPUP
        $('.learn-more-btn').magnificPopup({
          items: {
              src: '#learn-more-form',
              type: 'inline'
          }
        });
        

        // FORM VALIDATOR 

        $("form").validate();

        // Shrink top bar size on scroll
        function checkPosition() {
            var targetOffset = $(".page-content").offset().top - 65,
                topBar = $('.head-top');

            if ($(window).scrollTop() > 0) {
                topBar.addClass('shrink');
            } else {
                topBar.removeClass('shrink');
            }

            if ($(window).scrollTop() >= targetOffset) {
                topBar.addClass('darken');
            } else {
                topBar.removeClass('darken');
            }
        }
        checkPosition();

        $(document).scroll(function () {
            checkPosition();
        });

        // Toggle side-active class, show/hide meta menu
        $(document).on("click", ".side-active .page-content, .side-active .page-top, body:not(.side-active) .side-meta, body:not(.side-active) .toggle-side, .close-side", function () {
            $('body').toggleClass('side-active');
        });

        // Mobile: open menu on nav trigger tap
        $(document).on("click", ".nav-trigger", function () {
            $(this).toggleClass('active');
            $('.main-nav').toggleClass('trigger-active');
        });

        // Fluid embed heights
        $("#main").fitVids();

        // Vertical tabs move to tab content top on nav click
        $(document).on("click", '.vertical-tabs .tab-nav a', function () {
            $('html, body').stop(true, true).animate({
                scrollTop: $(this).closest('.vertical-tabs').find('.tab-content').offset().top
            }, 200);
        });

        // Main header enter button click, move wrap to top
        $(document).on("click", ".to-top", function () {
            $('html, body').animate({
                scrollTop: 0
            }, 1000);

            return false;
        });

        // Init parallax effect on page header backgrounds
        function initParallax() {
            if (!isMobile) {
                $('.page-head, .parallax').each(function () {
                    $(this).css('background-attachment', 'fixed').parallax("50%", 0.5, true);
                });
            }
        }
        initParallax();

        // Create header top bar blur effect
        function createHeaderBlur() {
            var headImage = $('.page-head').css('background-image');

            if (headImage !== undefined) {
                $('.cssfilters .head-top').append('<div class="background-blur">').find('.background-blur').css('background-image', headImage);
            }
        }
        createHeaderBlur();

        // Init waypoints + animate.css functionality
        if (!isMobile) {
            $.fn.waypoint.defaults = {
                context: window,
                continuous: true,
                enabled: true,
                horizontal: false,
                offset: 0,
                triggerOnce: false
            };
            $('.animated').waypoint(function () {
                var elem = $(this),
                    animation = elem.data('animation'),
                    timeout;
                if (!elem.hasClass('visible') && elem.attr('data-animation') !== undefined) {
                    if (elem.attr('data-animation-delay') !== undefined) {
                        timeout = elem.data('animation-delay');

                        setTimeout(function () {
                            elem.addClass(animation + " visible");
                        }, timeout);
                    } else {
                        elem.addClass(elem.data('animation') + " visible");
                    }
                }
            }, { offset: wpOffset + '%' });
        } else {
            $('.animated').removeClass('animated');
        }

        // Init HTML5 placeholder polyfill for IE <10
        $('input, textarea').placeholder();

        // Windows resize function
        $(window).resize(function () {
            initParallax();
            $portfolioContainer.isotope();
            $articleContainer.isotope();
        });

        // Init any Flexslider plugin
        $('.flexslider').flexslider({
            namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
            selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
            animation: "fade",              //String: Select your animation type, "fade" or "slide"
            easing: "swing",               //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
            direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
            reverse: false,                 //{NEW} Boolean: Reverse the animation direction
            animationLoop: true,             //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
            smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode 
            startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
            slideshow: true,                //Boolean: Animate slider automatically
            slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
            animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
            initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
            randomize: false,               //Boolean: Randomize slide order

            // Usability features
            pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
            pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
            useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
            touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
            video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

            // Primary Controls
            controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
            directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
            prevText: "",                   //String: Set the text for the "previous" directionNav item
            nextText: "",                   //String: Set the text for the "next" directionNav item

            // Secondary Navigation
            keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
            multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
            mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
            pausePlay: false,               //Boolean: Create pause/play dynamic element
            pauseText: 'Pause',             //String: Set the text for the "pause" pausePlay item
            playText: 'Play',               //String: Set the text for the "play" pausePlay item

            // Special properties
            controlsContainer: "",          //{UPDATED} Selector: USE CLASS SELECTOR. Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be ".flexslider-container". Property is ignored if given element is not found.
            manualControls: "",             //Selector: Declare custom control navigation. Examples would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
            sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
            asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

            // Carousel Options
            itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
            itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
            minItems: 0,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
            maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
            move: 0                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
        });

        // Init any Magnific Popup plugin
        // For all available options, check here: http://dimsemenov.com/plugins/magnific-popup/documentation.html#options
        $('.gallery-container').magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true
            },
            removalDelay: 300,
            mainClass: 'mfp-fade'
        });

        $('.popup-iframe').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 300,
            preloader: false,

            fixedContentPos: false
        });

        // Article Grid Isotope
        $articleContainer.isotope();

        // Portfolio Isotope + filtering
        $portfolioContainer.isotope();

        $(document).on("click", ".portfolio-filter a", function () {
            var $this = $(this),
                selector;

            $this.closest('.portfolio-filter').find('a').removeClass('selected');
            $this.toggleClass('selected');

            selector = $this.data('filter');
            $portfolioContainer.isotope({
                filter: selector,
                resizable: true
            });

            return false;
        });

        // Setup validation for contact form
        function setupContactFormValidation() {
            // Contact form validation & AJAX submit
            // Create loading spinner
            var spinnerOpts = {
                lines: 9, // The number of lines to draw
                length: 0, // The length of each line
                width: 5, // The line thickness
                radius: 11, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '0', // Top position relative to parent in px
                left: '0' // Left position relative to parent in px
            },
                targetSpinner = $('.spinner-holder').hide(),
                feedbackElem,
                spinnerElem;

            new Spinner(spinnerOpts).spin(targetSpinner[0]);

            $("#contactForm").validate({
                submitHandler: function (form) {
                    feedbackElem = $(form).find('.feedback-text').hide();
                    spinnerElem = $(form).find('.spinner-holder').fadeIn(300);

                    // If it validates, send the form
                    jQuery(form).ajaxSubmit({
                        //target: "#loader",
                        success: function () {
                            // Fade out the spinner and show the succes text
                            spinnerElem.fadeOut(300, function () {
                                feedbackElem.fadeIn(300).text("Thank you for your message, we'll get back to you ASAP!");
                            });

                            $(form).find('input[type="submit"]').attr('disabled', 'disabled');
                        }
                    });

                    return false;
                }
            });
        }
        setupContactFormValidation();

        // Init Google Maps
        function initGoogleMaps() {
            // Init on contact page
            if ($('#contact-map').length > 0) {
                var myLatlng = new google.maps.LatLng(37.40404, -121.97898),
                    mapOptions = {
                        center: myLatlng,
                        zoom: 19,
                        mapTypeId: google.maps.MapTypeId.SATELLITE,
                        scrollwheel: false
                        // disableDefaultUI: true
                    },
                    map = new google.maps.Map(document.getElementById("contact-map"), mapOptions),
                    marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        title: "Come visit us"
                    });
            }
        }
        initGoogleMaps();
    });
}());