
let user = document.querySelector('.user');
let div = document.querySelector('.user-cere');
let body  = document.querySelector('body');

if (user && div) {
    user.addEventListener('click', (event) => {
        div.style.visibility = 'visible';
        event.stopPropagation(); // Prevent the event from propagating to the body
    });

    if(body){
        body.addEventListener('click', () => {
            div.style.visibility = 'hidden';
        });
    }
    

    div.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}



document.getElementById('sidebarToggle').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    // Toggle sidebar visibility
    sidebar.classList.toggle('sidebar-active');
    
    // Toggle overlay visibility
    overlay.classList.toggle('overlay-active');
});

// Close sidebar when clicking on the cross icon
document.getElementById('closeSidebar').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Remove the active classes
    sidebar.classList.remove('sidebar-active');
    overlay.classList.remove('overlay-active');
});

// Close sidebar when clicking outside (on overlay)
document.getElementById('overlay').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Remove the active classes
    sidebar.classList.remove('sidebar-active');
    overlay.classList.remove('overlay-active');
});

document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.getElementById('sidebar').style.left = '0';
    document.getElementById('overlay').style.display = 'block';
  });

  // Close sidebar when overlay is clicked
  document.getElementById('overlay').addEventListener('click', function () {
    document.getElementById('sidebar').style.left = '-250px';
    document.getElementById('overlay').style.display = 'none';
  });

  // Close sidebar when the close button is clicked
  document.getElementById('closeSidebar').addEventListener('click', function () {
    document.getElementById('sidebar').style.left = '-250px';
    document.getElementById('overlay').style.display = 'none';
  });