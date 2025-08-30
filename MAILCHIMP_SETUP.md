# Mailchimp Newsletter Integration Setup

This theme now includes a Mailchimp newsletter signup integration in the footer. Here's how to set it up:

## Prerequisites

1. **Mailchimp Account**: You need an active Mailchimp account
2. **API Key**: Your Mailchimp API key
3. **Audience/List ID**: The ID of your Mailchimp audience/list
4. **Server Prefix**: Your Mailchimp server location (e.g., us1, us2, eu1)

## Step 1: Get Your Mailchimp API Key

1. Log in to your Mailchimp account
2. Go to **Account** → **Extras** → **API keys**
3. Click **Create A Key**
4. Copy the generated API key (keep it secure!)

## Step 2: Find Your Audience/List ID

1. In Mailchimp, go to **Audience** → **All contacts**
2. Click **Settings** → **Audience name and defaults**
3. Copy the **Audience ID** (this is your List ID)

## Step 3: Find Your Server Prefix

1. In Mailchimp, look at your browser URL
2. It will look like: `https://us1.admin.mailchimp.com/` or `https://eu1.admin.mailchimp.com/`
3. The prefix (us1, eu1, etc.) is your server

## Step 4: Configure in Shopify Theme Editor

1. Go to your Shopify admin → **Online Store** → **Themes**
2. Click **Customize** on your active theme
3. Navigate to the **Footer** section
4. Fill in the new Mailchimp fields:
   - **Mailchimp API Key**: Paste your API key
   - **Mailchimp List ID**: Paste your audience/list ID
   - **Mailchimp Server**: Enter your server prefix (e.g., us1)
5. Click **Save**

## Step 5: Test the Integration

1. Go to your store's frontend
2. Scroll to the footer
3. Enter an email address in the newsletter signup
4. Click Subscribe
5. Check your Mailchimp audience to confirm the subscriber was added

## How It Works

- **Form Submission**: When someone subscribes, the form submits directly to Mailchimp's API
- **Real-time Feedback**: Users see immediate success/error messages
- **Error Handling**: Handles common issues like duplicate emails gracefully
- **Accessibility**: Maintains proper ARIA attributes and keyboard navigation
- **Responsive**: Works on all device sizes

## Troubleshooting

### "API Key Invalid" Error
- Verify your API key is correct
- Ensure the API key hasn't expired
- Check that you copied the entire key

### "List ID Not Found" Error
- Verify your audience/list ID is correct
- Ensure the audience exists and is active
- Check that your API key has access to this audience

### "Server Error" Issues
- Verify your server prefix is correct (us1, eu1, etc.)
- Check that your Mailchimp account is active
- Ensure your API key has the necessary permissions

### Form Not Working
- Check browser console for JavaScript errors
- Verify the mailchimp-newsletter.js file is loading
- Ensure all three configuration fields are filled in

## Security Notes

- **API Key**: Never share your API key publicly
- **HTTPS**: The integration only works on HTTPS-enabled stores
- **Rate Limiting**: Mailchimp has API rate limits (check their documentation)

## Customization

The integration includes:
- Loading states during submission
- Error messages for validation failures
- Success confirmation messages
- Proper form validation
- Accessibility features

You can customize the styling by modifying the CSS classes in the footer section.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all configuration fields are correct
3. Test with a simple email address
4. Contact your theme developer if problems persist

---

**Note**: This integration replaces the previous Shopify customer form newsletter signup. Subscribers will now go directly to Mailchimp instead of your Shopify customer database.
