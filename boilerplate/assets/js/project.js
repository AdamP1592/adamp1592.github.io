
// Function to parse URL parameters
function getUrlParams() {
const params = new URLSearchParams(window.location.search);
const entries = {};
for (const [key, value] of params.entries()) {
    entries[key] = value;
}
return entries;
}

// When page loads, populate content
document.addEventListener("DOMContentLoaded", function () {
const params = getUrlParams();

// Example: Populate page based on 'project' parameter
if (params.project === "network_simulation") {
    fetch("./assets/templates/culture_sim.html")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then(html => {
        document.querySelector("#main .container").innerHTML = html;
      })


}
// You can add more conditions here for different projects
});
