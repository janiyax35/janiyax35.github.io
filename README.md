# Cybersecurity Portfolio Website

![Cybersecurity Portfolio](https://img.shields.io/badge/Portfolio-Cybersecurity-brightgreen)
![Status](https://img.shields.io/badge/Status-Active-success)
![Last Updated](https://img.shields.io/badge/Last%20Updated-July%202025-blue)

A modern, responsive cybersecurity-themed portfolio website showcasing my skills, projects, and academic journey. This portfolio features an interactive matrix background animation, terminal-style elements, and secure contact functionality.

## 🔐 Features

- **Cybersecurity Theme** - Dark interface with matrix animation and terminal elements
- **Responsive Design** - Fully responsive across all device sizes
- **Interactive UI** - Animations and visual effects that engage visitors
- **Project Showcase** - Card-based project display linking to GitHub repositories
- **Academic Journey Timeline** - Visual representation of academic progress
- **Skills Visualization** - Visual indicators of proficiency levels
- **Contact Form Integration** - EmailJS powered secure messaging system
- **Social Media Integration** - Links to all professional profiles

## 📁 File Structure

project-root/
├── index.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── animations.css
│   ├── js/
│   │   ├── main.js
│   │   ├── matrix.js
│   │   └── email.js
│   ├── images/
│   │   ├── profile.jpg
│   │   ├── projects/
│   │   └── cyber-frames/
│   └── resume/
│       └── janith_deshan_resume.pdf
└── README.md


## 🚀 Setup Instructions

### Prerequisites

- GitHub account
- Basic knowledge of HTML, CSS, and JavaScript
- EmailJS account (for contact form functionality)

### Installation

1. **Clone the repository**
git clone https://github.com/yourusername/yourusername.github.io.git cd yourusername.github.io


2. **Add your profile picture**
- Add your profile image as `assets/images/profile.jpg`
- Make sure it's a square image for best results

3. **Add your resume**
- Save your resume as PDF at `assets/resume/janith_deshan_resume.pdf`

4. **Set up EmailJS for the contact form**
- Create an account at [EmailJS](https://www.emailjs.com/)
- Create a new Email Service
- Create an Email Template with the following variables:
  - `{{from_name}}` - Sender's name
  - `{{from_email}}` - Sender's email
  - `{{subject}}` - Email subject
  - `{{message}}` - Email message
  - `{{to_email}}` - Your email address
- Get your User ID, Service ID, and Template ID
- Update the placeholders in `assets/js/email.js` with your actual IDs

5. **Test locally**
- Open `index.html` in your browser to preview
- Test all links and the contact form

## 🔧 Customization

### Personal Information

Update the following in `index.html`:

- Name and title
- About me section
- Contact information
- Social media links
- Educational background
- Skills and projects

### GitHub Projects

Update the project cards with:

- Project titles
- Descriptions
- Technologies used
- GitHub repository links

### Styling

Customize the appearance by modifying:

- `assets/css/style.css` - Main styles and colors
- `assets/css/animations.css` - Animation effects

### Colors

The main color scheme variables are defined in `style.css` under the `:root` selector:

```css
:root {
--primary-color: #0f0;           /* Main green color */
--secondary-color: #00eeff;      /* Accent cyan color */
--accent-color: #ff00ff;         /* Magenta accent */
--text-color: #eee;              /* Text color */
--bg-color: #0a0a0a;             /* Background color */
--dark-bg: #080808;              /* Darker background */
--darker-bg: #050505;            /* Darkest background */
--border-color: rgba(0, 255, 0, 0.3); /* Border color */
}

