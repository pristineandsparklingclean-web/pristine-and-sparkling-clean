
document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelectorAll("[data-year]");
  year.forEach(el => el.textContent = new Date().getFullYear());

  // Mark the current page in the navigation.
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a[data-page]").forEach(link => {
    const page = link.getAttribute("data-page");
    if (page === current || (current === "" && page === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Quote form: client-side validation + honeypot + minimum-time trap.
  const form = document.querySelector("#quote-form");
  if (!form) return;

  const started = Date.now();
  const status = document.querySelector("#form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== "") {
      status.textContent = "Please use the form normally and try again.";
      return;
    }

    // Reject instant automated submissions while allowing normal visitors.
    if (Date.now() - started < 2500) {
      status.textContent = "Please take a moment to review your request, then submit again.";
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = data.get("name");
    const phone = data.get("phone");
    const email = data.get("email");
    const service = data.get("service");
    const preferred = data.get("preferred");
    const details = data.get("details");

    const subject = encodeURIComponent("Cleaning Quote Request - " + name);
    const body = encodeURIComponent(
      "New cleaning quote request\n\n" +
      "Name: " + name + "\n" +
      "Phone: " + phone + "\n" +
      "Email: " + email + "\n" +
      "Service: " + service + "\n" +
      "Preferred timing: " + preferred + "\n\n" +
      "Details:\n" + details
    );

    status.textContent = "Opening your email app with your quote request...";
    window.location.href =
      "mailto:pristineandsparklingclean@gmail.com?subject=" + subject + "&body=" + body;
  });
});
