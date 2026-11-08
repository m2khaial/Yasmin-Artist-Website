/*
  Yasmin's Khaial | Site behaviour (V3)

  This file controls:
  1. The artwork list and gallery
  2. The full-size artwork viewer
  3. The mobile navigation
  4. The two inquiry forms

  Keep passwords and private keys OUT of this file.
  Anything in a GitHub Pages repository can be seen publicly.
*/

// SETUP: add Yasmin's real Formspree and Calendly URLs here.
const SETTINGS = {
  commissionForm: "https://formspree.io/f/YOUR-COMMISSION-ID",
  workshopForm: "https://formspree.io/f/YOUR-WORKSHOP-ID",
  bookingLink: "" // e.g. https://calendly.com/yasmin/intro-call
};

/*
  THE ARTWORK LIST

  The photos are Yasmin's own works supplied for this project.
  Each object is ONE artwork, even if it has multiple photographs.
  'images' is an array so you can show different views of sculptures.

  IMPORTANT: The names and art-medium details have NOT been confirmed.
  Replace 'Artwork 01', etc. with Yasmin's actual titles and add:
    medium: "Oil on canvas, 2024"  (example only)
  ONLY when she supplies the correct details. Do not guess.
*/
const artworks = [
  {
    title: "Artwork 01",
    type: "Painting / 2D work",
    medium: "Title, medium and year to be confirmed",
    images: [
      { src: "images/painting-warm-portrait.webp", alt: "Expressive side-profile portrait in pink, orange and blue brushstrokes" }
    ]
  },
  {
    title: "Artwork 02",
    type: "Painting / 2D work",
    medium: "Title, medium and year to be confirmed",
    images: [
      { src: "images/painting-red-figure.webp", alt: "Red upturned portrait against a black background with two bright starburst forms over the eyes" }
    ]
  },
  {
    title: "Artwork 03",
    type: "Painting / 2D work",
    medium: "Title, medium and year to be confirmed",
    images: [
      { src: "images/painting-monochrome-portrait.webp", alt: "Monochrome portrait of a curly-haired person wearing sunglasses, with a hand near the face" }
    ]
  },
  {
    title: "Artwork 04",
    type: "Sculpture / 3D work",
    medium: "Title, materials and year to be confirmed",
    images: [
      { src: "images/sculpture-reaching-gallery.webp", alt: "Tall, pale textured figurative sculpture with one arm reaching upward, photographed in an exhibition space" },
      { src: "images/sculpture-reaching-studio.webp", alt: "Alternate view of the same reaching sculpture, photographed on a worktable during production" }
    ]
  },
  {
    title: "Artwork 05",
    type: "Sculpture / 3D work",
    medium: "Title, materials and year to be confirmed",
    images: [
      { src: "images/sculpture-amber-bust.webp", alt: "Golden-yellow sculpted bust with a floral relief over one eye" }
    ]
  },
  {
    title: "Artwork 06",
    type: "Sculpture / 3D work",
    medium: "Title, materials and year to be confirmed",
    images: [
      { src: "images/sculpture-organic-form.webp", alt: "Pale sculptural composition with two tall, organically textured forms on a white plinth" }
    ]
  }
];

// -------- MOBILE MENU --------
const menuButton = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}

// Automatically show the current year in the footer.
document.querySelectorAll("[data-year]").forEach(node => {
  node.textContent = String(new Date().getFullYear());
});

// -------- PORTFOLIO GALLERY --------
const gallery = document.querySelector("#gallery");
const artworkDialog = document.querySelector("#artwork-dialog");
let selectedArtworkIndex = 0;
let selectedPhotoIndex = 0;

// Updates the full-size viewer without creating any new browser windows.
function updateArtworkViewer() {
  if (!artworkDialog) return;
  const item = artworks[selectedArtworkIndex];
  const photo = item.images[selectedPhotoIndex];
  const image = artworkDialog.querySelector("#viewer-image");
  image.src = photo.src;
  image.alt = photo.alt;
  artworkDialog.querySelector("#viewer-title").textContent = item.title;
  artworkDialog.querySelector("#viewer-type").textContent = item.type;
  artworkDialog.querySelector("#viewer-medium").textContent = item.medium;
  artworkDialog.querySelector("#viewer-count").textContent =
    `${selectedPhotoIndex + 1} of ${item.images.length} photograph${item.images.length === 1 ? '' : 's'}`;
  const hasExtraPhotos = item.images.length > 1;
  artworkDialog.querySelector("#viewer-prev").hidden = !hasExtraPhotos;
  artworkDialog.querySelector("#viewer-next").hidden = !hasExtraPhotos;
}

function openArtwork(index) {
  if (!artworkDialog) return;
  selectedArtworkIndex = index;
  selectedPhotoIndex = 0;
  updateArtworkViewer();
  artworkDialog.showModal(); // Native HTML dialog handles focus trapping and ESC.
}

if (gallery) {
  artworks.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "art-card";

    // A real button makes the gallery usable by keyboard as well as mouse.
    const openButton = document.createElement("button");
    openButton.className = "art-open";
    openButton.type = "button";
    openButton.setAttribute("aria-label", `View ${item.title} in detail`);
    openButton.addEventListener("click", () => openArtwork(index));

    const surface = document.createElement("span");
    surface.className = "art-surface";
    const image = document.createElement("img");
    image.src = item.images[0].src;
    image.alt = item.images[0].alt;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";
    surface.append(image);
    openButton.append(surface);

    const meta = document.createElement("div");
    meta.className = "art-meta";
    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const type = document.createElement("p");
    type.textContent = item.type;
    text.append(title, type);
    const cue = document.createElement("span");
    cue.className = "art-view-cue";
    cue.textContent = item.images.length > 1 ? "View 2 angles ↗" : "View larger ↗";
    meta.append(text, cue);

    card.append(openButton, meta);
    gallery.append(card);
  });

  // These arrows shift the horizontal strip, which can also be swiped.
  document.querySelectorAll("[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
      const direction = button.dataset.scroll === "right" ? 1 : -1;
      gallery.scrollBy({ left: direction * 360, behavior: "smooth" });
    });
  });
}

if (artworkDialog) {
  artworkDialog.querySelector("#viewer-close").addEventListener("click", () => artworkDialog.close());

  // Move between views of the SAME sculpture, not between different artworks.
  artworkDialog.querySelector("#viewer-prev").addEventListener("click", () => {
    const count = artworks[selectedArtworkIndex].images.length;
    selectedPhotoIndex = (selectedPhotoIndex - 1 + count) % count;
    updateArtworkViewer();
  });
  artworkDialog.querySelector("#viewer-next").addEventListener("click", () => {
    const count = artworks[selectedArtworkIndex].images.length;
    selectedPhotoIndex = (selectedPhotoIndex + 1) % count;
    updateArtworkViewer();
  });

  // Clicking the backdrop, outside the dialog content, closes the viewer.
  artworkDialog.addEventListener("click", event => {
    if (event.target === artworkDialog) artworkDialog.close();
  });
}

// -------- COMMISSION CONSULTATION --------
const callHint = document.querySelector("#call-hint");
document.querySelectorAll('input[name="call_requested"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const chosen = document.querySelector('input[name="call_requested"]:checked');
    if (callHint) callHint.hidden = chosen?.value !== "Yes";
  });
});

// -------- INQUIRY FORMS --------
/*
  GitHub Pages cannot receive submitted forms by itself.
  Formspree handles the message and returns an HTTP response.
  We show the success screen ONLY when that response was successful.
*/
document.querySelectorAll(".inquiry-form").forEach(form => {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const isCommission = form.dataset.kind === "commission";
    const endpoint = isCommission ? SETTINGS.commissionForm : SETTINGS.workshopForm;
    const status = form.querySelector(".form-status");
    const button = form.querySelector('button[type="submit"]');
    if (!endpoint || endpoint.includes("YOUR-")) {
      status.textContent = "The inquiry form is still being connected. Please check back soon.";
      return;
    }

    const wantsCall = isCommission &&
      form.querySelector('input[name="call_requested"]:checked')?.value === "Yes";
    button.disabled = true;
    status.textContent = "Sending your inquiry…";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) {
        status.textContent = "The message was not sent. Please try again.";
        return;
      }

      form.hidden = true;
      const success = document.querySelector(isCommission
        ? "#commission-success" : "#workshop-success");
      if (success) {
        success.hidden = false;
        success.focus();
      }

      // Scheduling is optional and never implies an accepted commission.
      if (wantsCall) {
        const canBook = SETTINGS.bookingLink.startsWith("https://calendly.com/");
        document.querySelector("#call-next-step").hidden = !canBook;
        document.querySelector("#manual-call-note").hidden = canBook;
        if (canBook) document.querySelector("#booking-link").href = SETTINGS.bookingLink;
      }
    } catch (error) {
      status.textContent = "Network error. Check your connection and try again.";
    } finally {
      button.disabled = false;
    }
  });
});