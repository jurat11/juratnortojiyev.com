# Email Setup for Contact Form

## Overview
Your contact form now has a working backend that can send emails directly to your Gmail account when someone submits the form.

## Setup Steps

### 1. Enable 2-Factor Authentication on Gmail
- Go to your Google Account settings
- Navigate to Security
- Enable 2-Step Verification if not already enabled

### 2. Generate an App Password
- Go to Google Account settings
- Navigate to Security → 2-Step Verification
- Scroll down to "App passwords"
- Click "Generate new app password"
- Select "Mail" and "Other (Custom name)"
- Name it "Website Contact Form"
- Copy the generated 16-character password

### 3. Update Email Configuration
- Open `email-config.js`
- Replace `your-gmail-app-password-here` with the actual app password you generated
- Save the file

### 4. Restart Your Server
- Stop your current server (Ctrl+C)
- Run `node server.js` again

## How It Works
1. User fills out the contact form on your website
2. Form data is sent to `/api/contact` endpoint
3. Server uses nodemailer to send an email to your Gmail
4. You receive the inquiry directly in your inbox

## Security Notes
- The `email-config.js` file is already added to `.gitignore`
- Never commit your app password to version control
- The app password is more secure than your regular password
- You can revoke app passwords at any time from Google Account settings

## Testing
1. Fill out the contact form on your website
2. Submit the form
3. Check your Gmail inbox for the inquiry
4. Check the server console for confirmation logs

## Troubleshooting
- If emails aren't sending, check the server console for error messages
- Ensure your Gmail app password is correct
- Make sure 2FA is enabled on your Gmail account
- Check that the server is running and accessible
