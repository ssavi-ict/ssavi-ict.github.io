const startYear = 2018; 
const currentYear = new Date().getFullYear();
const experienceYears = currentYear - startYear;

document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("experience-years");
  if (target) {
    target.textContent = experienceYears;
  }

  const copyrightSpan = document.getElementById("copyright-year");
  if (copyrightSpan) {
    copyrightSpan.textContent = currentYear;
  }

  const dropdownBtn = document.getElementById('leisuresDropdownBtn');
  const dropdownContent = document.getElementById('leisuresDropdownContent');
  const dropdownArrow = document.getElementById('dropdownArrow');

  dropdownBtn.addEventListener('click', function (event) {
      dropdownContent.classList.toggle('show');
      dropdownArrow.classList.toggle('rotate-180'); // Rotate arrow
      event.stopPropagation(); // Prevent document click from immediately closing
  });

  document.addEventListener('click', function (event) {
    if (!dropdownBtn.contains(event.target) && !dropdownContent.contains(event.target)) {
        dropdownContent.classList.remove('show');
        dropdownArrow.classList.remove('rotate-180'); // Reset arrow
    }
  });
});
