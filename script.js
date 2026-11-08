
/* Yasmin's Khaial
   Shared JavaScript for all three pages.

   Change these settings after creating the accounts.
   Never put passwords or private API keys here.
*/

const SETTINGS = {
  commissionForm: "https://formspree.io/f/YOUR-COMMISSION-ID",
  workshopForm: "https://formspree.io/f/YOUR-WORKSHOP-ID",
  bookingLink: ""
};

/*
   THE ARTWORK GALLERY

   When Yasmin sends you her art, create an images folder
   and add each file path below.

   Example:
   image: "images/my-painting.jpg"

   Keep titles, descriptions and alternative text accurate.
*/

const artworks = [
  {
    title: "Artwork 01",
    details: "Medium • Year",
    image: "",
    alt: ""
  },
  {
    title: "Artwork 02",
    details: "Medium • Year",
    image: "",
    alt: ""
  },
  {
    title: "Artwork 03",
    details: "Medium • Year",
    image: "",
    alt: ""
  },
  {
    title: "Artwork 04",
    details: "Medium • Year",
    image: "",
    alt: ""
  },
  {
    title: "Artwork 05",
    details: "Medium • Year",
    image: "",
    alt: ""
  },
  {
    title: "Artwork 06",
    details: "Medium • Year",
    image: "",
    alt: ""
  }
];

/* Mobile navigation */

const menuButton = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  // Close the mobile menu when a page link is selected.
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

/* Keep the copyright year current. */

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

/*
   Build the horizontal artwork gallery from the list above.
   The placeholder is displayed until a real image is assigned.
*/

const gallery = document.querySelector("#gallery");

if (gallery) {
  artworks.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "art-card";

    const surface = document.createElement("div");
    surface.className = "art-surface";

    if (item.image) {
      const img = document.createElement("img");

      img.src = item.image;
      img.alt = item.alt || item.title;
      img.loading = "lazy";

      surface.append(img);
    } else {
      const placeholder = document.createElement("div");

      placeholder.className =
        `art-placeholder art-wash-${(index % 6) + 1}`;

      placeholder.textContent = "Artwork coming soon";
      surface.append(placeholder);
    }

    const meta = document.createElement("div");
    meta.className = "art-meta";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const details = document.createElement("p");
    details.textContent = item.details;

    meta.append(title, details);
    card.append(surface, meta);
    gallery.append(card);
  });

  // Make the gallery arrows move the artwork strip.
  document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction =
        button.dataset.scroll === "right" ? 1 : -1;

      gallery.scrollBy({
        left: direction * 360,
        behavior: "smooth"
      });
    });
  });
}

/*
   Commission consultation selection.

   A client can ask for a call or choose email only.
   The appointment is booked separately, using Calendly.
*/

const callRadios = document.querySelectorAll(
  'input[name="call_requested"]'
);

const callHint = document.querySelector("#call-hint");

callRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const selected = document.querySelector(
      'input[name="call_requested"]:checked'
    );

    if (callHint) {
      callHint.hidden = selected?.value !== "Yes";
    }
  });
});

/*
   FORM SUBMISSION

   GitHub Pages cannot receive form data itself.
   Formspree will process commission and workshop inquiries.

   We check that Formspree actually received the submission
   before telling the visitor that it was successful.
*/

document.querySelectorAll(".inquiry-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Stop if required fields are incomplete.
    if (!form.reportValidity()) return;

    const isCommission = form.dataset.kind === "commission";

    const endpoint = isCommission
      ? SETTINGS.commissionForm
      : SETTINGS.workshopForm;

    const status = form.querySelector(".form-status");
    const button = form.querySelector(
      'button[type="submit"]'
    );

    // Do not pretend a form works before it's connected.
    if (!endpoint || endpoint.includes("YOUR-")) {
      status.textContent =
        "This form is not connected yet. Add your Formspree form ID in script.js.";
      return;
    }

    // Remember the answer before hiding the form.
    const wantsCall =
      isCommission &&
      form.querySelector(
        'input[name="call_requested"]:checked'
      )?.value === "Yes";

    button.disabled = true;
    status.textContent = "Sending your inquiry…";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        status.textContent =
          response.status === 429
            ? "Too many submissions right now. Please try again shortly."
            : "Your inquiry wasn't sent. Please check the form and try again.";
        return;
      }

      // Formspree accepted the message.
      form.hidden = true;

      const success = document.querySelector(
        isCommission
          ? "#commission-success"
          : "#workshop-success"
      );

      success.hidden = false;
      success.focus();

      // Only reveal a booking option if the client requested it.
      if (wantsCall) {
        const hasBooking = SETTINGS.bookingLink.startsWith(
          "https://calendly.com/"
        );

        document.querySelector("#call-next-step").hidden =
          !hasBooking;

        document.querySelector("#manual-call-note").hidden =
          hasBooking;

        if (hasBooking) {
          document.querySelector("#booking-link").href =
            SETTINGS.bookingLink;
        }
      }
    } catch (error) {
      status.textContent =
        "Network error. Please check your connection and try again.";
    } finally {
      button.disabled = false;
    }
  });
});
