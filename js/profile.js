changeWallpaper('profile');
changeWallpaper('backgroundProfile');

try {
    
    const dropArea = document.getElementById('profile-image');
    const fileInput = document.getElementById('imageInput');

    // Prevent default behaviors (prevent file from being opened)
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    // Remove highlight when item is dragged away
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('hover');
    }

    function unhighlight() {
        dropArea.classList.remove('hover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // This function will handle files for both drag-and-drop and input selection
    function handleFiles(files) {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                localStorage.setItem('profileImage',event.target.result)
                changeWallpaper('profile');
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image file.");
        }
    }

    // Handle file selection and load image
    fileInput.addEventListener('change', (event) => {
        loadingNow(1500);
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                localStorage.setItem('profileImage',event.target.result)
                changeWallpaper('profile');
            };

            // Read the selected image as a data URL
            reader.readAsDataURL(file);
        } 
        else {
            alert("Please select a valid image file.");
        }
    });
}
catch(e){
    console.log(e);
}

try {
    const edit = document.getElementById('edit-icon');
    const fileInput = document.getElementById('backgroundInput')

    edit.onclick = () => {
        fileInput.click();

        // Handle file selection and load image
        fileInput.addEventListener('change', (event) => {
            loadingNow(1500);
            const file = event.target.files[0];

            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    localStorage.setItem('backgroundProfileImage',event.target.result)
                    changeWallpaper('backgroundProfile');
                };

                // Read the selected image as a data URL
                reader.readAsDataURL(file);
            } 
            else {
                alert("Please select a valid image file.");
            }
        });
    }
}
catch(e){
    console.log(e);
}

// Make the fetch request
fetch('https://cads2024.com/php/profile.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({'email' : localStorage.getItem('mailTo')})  // Convert data to URL-encoded format
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);  // Throw error if response is not OK
    }
    return response.json();  // Parse JSON response
})
.then(result => {
    // Handle the response from the server
    if (result.status) {

        localStorage.setItem('user', result.username);

        data = [
            `Status: ${result.stat}`
            , `Username: ${result.username}`
            , `Email: ${result.email}`
        ];

        document.querySelectorAll('.profile-button').forEach((button, index) => {
            button.innerHTML = data[index];
        });
    
        document.querySelectorAll('.input-here').forEach((input, index) => {
            input.placeholder = data[index];
        });

    } else {
        console.log('Error:', result.message);
    }
})
.catch(error => {
    console.log('Fetch error:', error.message);  // Handle fetch errors
});

document.getElementById('panelView').onclick = () => {
    const mail = localStorage.getItem('mailTo');
    const data = {
        email: mail
    };

    // Make the fetch request
    fetch('https://cads2024.com/php/set-panel.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)  // Convert data to URL-encoded format
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);  // Throw error if response is not OK
        }
        return response.json();  // Parse JSON response
    })
    .then(result => {
        // Handle the response from the server
        if (result.status === 'success') {
            window.open('https://cads2024.com/panel', '_blank'); // Opens in a new tab
        } else {
            console.log('Error:', result.message);
        }
    })
    .catch(error => {
        console.log('Fetch error:', error.message);  // Handle fetch errors
    });
}
