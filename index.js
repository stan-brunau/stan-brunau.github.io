window.onscroll = function() {stickyNavbar()};

let navbar = document.getElementById("navbar");

let sticky = navbar.offsetTop;

function stickyNavbar() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
} 

function addLinkedinBadge() {
  if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))){
    let badgediv = document.getElementById("badge");
    badgediv.innerHTML = '<div class="badge-base LI-profile-badge" data-locale="nl_NL" data-size="medium" data-theme="light" data-type="HORIZONTAL" data-vanity="stan-brunau-a94713244" data-version="v1"></div>';
  }
}

addLinkedinBadge();