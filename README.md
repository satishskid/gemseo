# gbseo

gbseo is a powerful, self-hosted web application designed to generate comprehensive, hyper-local SEO and content strategies for businesses in India. It's specifically tailored for the Healthcare, EdTech, and D2C sectors.

Powered by the Google Gemini API, it provides actionable insights including keywords, technical SEO audits, Google Business Profile recommendations, pillar content, blog posts, and a full campaign calendar.

## Features

-   **Hyper-Local SEO:** Generates keywords and strategies focused on specific Indian pincodes or cities.
-   **Comprehensive Content Generation:** Creates long-form pillar posts, supporting blogs, and conversion-focused landing pages.
-   **Technical SEO Audit:** Provides recommendations for `robots.txt`, schema markup, performance, and more.
-   **Google Business Profile (GBP) Strategy:** Offers actionable steps to optimize your GBP listing for local search.
-   **Campaign Analysis:** (Optional) Analyzes your existing ad campaign data to provide data-driven recommendations.
-   **Interactive Campaign Calendar:** A full-featured calendar to manage and track your content publishing schedule.
-   **Secure & Private:** Your Gemini API key is stored only in your browser's session storage and is never saved to the database.
-   **Simple Authentication:** Passwordless magic link sign-in powered by Supabase.

## Tech Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **Backend (BaaS):** Supabase (Authentication, Database)
-   **AI:** Google Gemini API (`@google/genai`)

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   A code editor like [VS Code](https://code.visualstudio.com/)
-   A free [Supabase](https://supabase.com/) account
-   A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

## Local Setup Instructions

Follow these steps to get the application running on your local machine.

### 1. Download and Unzip the Code

Download the project files and unzip them into a new folder on your computer.

### 2. Install Dependencies

This project uses modern web standards and an `importmap`, so it does not require a complex build step for local development. You just need a simple local server. The easiest way to do this is using the `serve` package.

If you don't have `serve`, you can install it globally from your terminal:
```bash
npm install -g serve
```

### 3. Set Up Supabase

You've already completed the main setup! This includes:
-   Creating a project on Supabase.
-   Enabling the Email provider.
-   Running the SQL script in the SQL Editor to create the `profiles` table and set up the admin roles.

Now, you just need to connect your code to your Supabase project.

### 4. Configure Supabase Credentials

This is a critical step. Your code needs to know how to communicate with your Supabase project.

1.  Open the file: `lib/supabaseClient.ts`
2.  In your Supabase project dashboard, go to **Settings** (gear icon) > **API**.
3.  Under **Project API Keys**, you will find your `URL` and your `anon` `public` key.
4.  Copy these two values and paste them into the `supabaseClient.ts` file, replacing the placeholder values.

**Example `lib/supabaseClient.ts`:**
```ts
import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT SETUP ---
// Replace with your Supabase Project URL and Anon Key
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Paste your URL here
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Paste your Anon Key here
// --- END OF SETUP ---

// ... rest of the file
```

### 5. Configure Supabase Site URL for Local Development

To ensure the magic links work on your local machine:
1.  In your Supabase project dashboard, go to **Authentication** (user icon) > **URL Configuration**.
2.  In the **Site URL** field, enter `http://localhost:3000`.
3.  Under **Additional Redirect URLs**, add `http://localhost:3000/**`.

*Note: `3000` is the default port for the `serve` package. If it uses a different port, update the URL accordingly.*

### 6. Run the Application

1.  Open your terminal in the root directory of the project.
2.  Run the following command:
    ```bash
    serve
    ```
3.  Your terminal will show you the local address, usually `http://localhost:3000`. Open this URL in your web browser.

The application should now be running locally!

## Deployment to Netlify

See the detailed instructions provided separately for deploying your application and configuring it for a live environment.
