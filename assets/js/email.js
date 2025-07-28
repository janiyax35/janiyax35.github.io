/**
 * Email Service Integration using EmailJS
 * Handles contact form submissions
 * IT24102137 - Janith Deshan
 * 2025-07-26
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your user ID
    emailjs.init("fPKkVwF73NhpvP2VE");
    
    // Contact form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Cache references to elements
            const submitBtn = document.getElementById('submitBtn');
            const formResult = document.getElementById('form-result');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span>Sending...';
            
            // Form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                formResult.textContent = 'All fields are required.';
                formResult.className = 'error';
                formResult.style.display = 'block';
                
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return;
            }
            
            // Generate timestamp and random ID for email template
            const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
            const random_id = 'IT24102137-' + Math.random().toString(36).substring(2, 11);
            
            // Prepare template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: 'janithmihijaya123@gmail.com',
                timestamp: timestamp,
                random_id: random_id
            };
            
            // Send email using EmailJS
            emailjs.send('service_vt4z0ad', 'template_1z6zc59', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Clear the form
                    contactForm.reset();
                    
                    // Show success message
                    formResult.textContent = 'Your message has been sent successfully!';
                    formResult.className = 'success';
                    formResult.style.display = 'block';
                    
                    // Reset button state immediately - no delay
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    
                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        formResult.style.display = 'none';
                    }, 5000);
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    formResult.textContent = 'Failed to send message. Please try again later.';
                    formResult.className = 'error';
                    formResult.style.display = 'block';
                    
                    // Reset button state immediately - no delay
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }
});