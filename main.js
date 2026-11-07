(function () {
    var dateFormatter = new Intl.DateTimeFormat("en-PK", {
      timeZone: "Asia/Karachi",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    var timeFormatter = new Intl.DateTimeFormat("en-PK", {
      timeZone: "Asia/Karachi",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    function updateTicker() {
      var now = new Date();
      var message = "Date: " + dateFormatter.format(now) + "  |  Time: " + timeFormatter.format(now) + " PKT  |  Location: Pakistan";
      document.getElementById("tickerMessage").textContent = message;
      document.getElementById("tickerMessageCopy").textContent = message;
      document.getElementById("tickerAccessible").textContent = message;
    }

    updateTicker();
    window.setInterval(updateTicker, 1000);
  }());

  (function () {
    var counter = document.getElementById("visitorCount");
    if (!counter) return;

    var site = window.location.hostname || "alpine-ascents-local-preview";
    counter.src = "https://api.visitorbadge.io/api/visitors?path=" +
      encodeURIComponent(site) +
      "&label=Visitors&labelColor=%23163D2B&countColor=%23F5F0E4";
  })();

  (function () {
    var nav = document.querySelector(".site-nav");
    var toggle = document.querySelector(".site-nav-toggle");
    var links = document.getElementById("siteNavLinks");
    if (!nav || !toggle || !links) return;

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") !== "true";
      nav.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  })();

  (function () {
    var sessionStorageKey = "alpineAscentsSession";
    var dialog = document.getElementById("authDialog");
    var form = document.getElementById("authForm");
    var nameField = document.getElementById("nameField");
    var nameInput = document.getElementById("authName");
    var emailInput = document.getElementById("authEmail");
    var passwordInput = document.getElementById("authPassword");
    var submitButton = document.getElementById("authSubmit");
    var status = document.getElementById("authStatus");
    var isSignup = false;

    function readSession() {
      var savedSession = localStorage.getItem(sessionStorageKey);
      if (!savedSession) {
        return null;
      }

      try {
        var session = JSON.parse(savedSession);
        if (session && typeof session.email === "string" && typeof session.name === "string") {
          return session;
        }
      } catch (error) {
        localStorage.removeItem(sessionStorageKey);
      }

      localStorage.removeItem(sessionStorageKey);
      return null;
    }

    function showAccountState() {
      var session = readSession();
      document.getElementById("authForms").hidden = Boolean(session);
      document.getElementById("signedInView").hidden = !session;
      status.textContent = "";
      if (session) {
        document.getElementById("signedInMessage").textContent = "Logged in successfully.";
      }
    }

    function setMode(signup) {
      isSignup = signup;
      nameField.hidden = !signup;
      nameInput.required = signup;
      passwordInput.autocomplete = signup ? "new-password" : "current-password";
      passwordInput.type = "password";
      document.getElementById("togglePassword").textContent = "Show";
      document.getElementById("togglePassword").setAttribute("aria-pressed", "false");
      submitButton.textContent = signup ? "Create account" : "Log in";
      document.getElementById("authTitle").textContent = signup ? "Create your account" : "Log in to book a trip";
      document.getElementById("showLogin").classList.toggle("active", !signup);
      document.getElementById("showSignup").classList.toggle("active", signup);
      status.textContent = "";
    }

    document.getElementById("bookTripLink").addEventListener("click", function (event) {
      event.preventDefault();
      try {
        showAccountState();
        dialog.showModal();
        if (document.getElementById("signedInView").hidden) {
          emailInput.focus();
        } else {
          document.getElementById("signOut").focus();
        }
      } catch (error) {
        dialog.showModal();
        status.textContent = error.message || "Unable to load saved account data.";
      }
    });

    document.getElementById("authClose").addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("close", function () {
      document.getElementById("bookTripLink").focus();
    });
    document.getElementById("showLogin").addEventListener("click", function () {
      setMode(false);
    });
    document.getElementById("showSignup").addEventListener("click", function () {
      setMode(true);
      nameInput.focus();
    });
    document.getElementById("togglePassword").addEventListener("click", function (event) {
      var toggle = event.currentTarget;
      var isVisible = passwordInput.type === "text";
      passwordInput.type = isVisible ? "password" : "text";
      toggle.textContent = isVisible ? "Show" : "Hide";
      toggle.setAttribute("aria-pressed", String(!isVisible));
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      status.textContent = "";
      submitButton.disabled = true;

      try {
        var email = emailInput.value.trim().toLowerCase();
        if (!emailInput.checkValidity() || !passwordInput.checkValidity()) {
          form.reportValidity();
          return;
        }

        var name = isSignup ? nameInput.value.trim() : email.split("@")[0];
        localStorage.setItem(sessionStorageKey, JSON.stringify({ email: email, name: name }));
        passwordInput.value = "";
        showAccountState();
      } catch (error) {
        status.textContent = error.message || "Unable to save your sign-in in this browser.";
      } finally {
        submitButton.disabled = false;
      }
    });

    document.getElementById("signOut").addEventListener("click", function () {
      try {
        localStorage.removeItem(sessionStorageKey);
        showAccountState();
        setMode(false);
        status.textContent = "Logged out successfully.";
        emailInput.focus();
      } catch (error) {
        status.textContent = error.message || "Unable to log out.";
      }
    });
  }());

  document.querySelectorAll(".feature-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      var feature = button.closest(".mountain-feature");
      var isExpanded = feature.classList.toggle("is-expanded");

      button.textContent = isExpanded ? "Hide" : "Read more";
      button.setAttribute("aria-expanded", String(isExpanded));
    });
  });

  document.querySelectorAll(".mountain-map-button").forEach(function (button) {
    button.addEventListener("click", function () {
      var mountainName = button.dataset.name;
      var map = document.getElementById("map");

      map.src = "https://www.google.com/maps?q=" + button.dataset.lat + "," + button.dataset.lng + "&z=8&output=embed";
      map.title = "Google Map showing " + mountainName;
      document.getElementById("mountainMapStatus").textContent = "Showing " + mountainName + " location.";
      document.querySelectorAll(".mountain-map-button").forEach(function (mapButton) {
        var isSelected = mapButton === button;
        mapButton.classList.toggle("btn-success", isSelected);
        mapButton.classList.toggle("btn-outline-success", !isSelected);
        mapButton.classList.toggle("active", isSelected);
        mapButton.setAttribute("aria-pressed", String(isSelected));
      });
    });
  });

  document.querySelectorAll(".club-map-button").forEach(function (button) {
    button.addEventListener("click", function () {
      var isOpenForThisClub = button.getAttribute("aria-expanded") === "true";
      var location = button.dataset.location;
      var mapPanel = document.getElementById("club-map-panel");
      var map = document.getElementById("club-map");
      if (isOpenForThisClub) {
        mapPanel.hidden = true;
        map.src = "about:blank";
        document.querySelectorAll(".club-map-button").forEach(function (mapButton) {
          mapButton.setAttribute("aria-expanded", "false");
          mapButton.textContent = "Show map";
        });
        return;
      }
      map.src = "https://www.google.com/maps?q=" + encodeURIComponent(location) + "&z=13&output=embed";
      map.title = "Map showing " + location;
      document.getElementById("clubMapStatus").textContent = "Showing " + location + ".";
      mapPanel.hidden = false;
      document.querySelectorAll(".club-map-button").forEach(function (mapButton) {
        var isSelected = mapButton === button;
        mapButton.setAttribute("aria-expanded", String(isSelected));
        mapButton.textContent = isSelected ? "Hide map" : "Show map";
      });
      mapPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  $(function () {
    var startX = 0;

    $("#galleryCarousel").on("touchstart", function (event) {
      startX = event.originalEvent.touches[0].clientX;
    });

    $("#galleryCarousel").on("touchend", function (event) {
      var endX = event.originalEvent.changedTouches[0].clientX;
      var distance = endX - startX;
      var carousel = bootstrap.Carousel.getOrCreateInstance(this);

      if (Math.abs(distance) > 50) {
        if (distance > 0) {
          carousel.prev();
        } else {
          carousel.next();
        }
      }
    });
  });

  (function () {
    if (!window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var revealTargets = document.querySelectorAll(
      "h1:not(footer *), h2:not(footer *), h3:not(footer *), h4:not(footer *), h5:not(footer *), h6:not(footer *), p:not(footer *), div:not(footer *):not(.staff-card-info):not(.staff-card-info *):not(.auth-dialog *), .inventions-section, .staff-card, .mountain-feature"
    );
    if (!revealTargets.length) return;

    document.body.classList.add("has-reveal");
    revealTargets.forEach(function (target, index) {
      target.classList.add("reveal-on-scroll");
      target.style.setProperty("--reveal-delay", (index % 5) * 45 + "ms");
    });

    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealTargets.forEach(function (target) { revealObserver.observe(target); });
  }());
