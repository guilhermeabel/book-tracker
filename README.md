# StudyRats

StudyRats is a web application designed to help you track your study sessions, build consistent habits, and compete with friends in study groups.

## Demo

https://github.com/user-attachments/assets/50e7a2a7-9813-4077-a9ea-fd2541ad0cef

## Features

- **Log Study Sessions:** Easily record your study time, including the subject and a short description.
- **Track Your Progress:** Visualize your study habits over time with detailed statistics and analytics.
- **Study Groups:** Create or join study groups to collaborate and stay motivated with friends.
- **Leaderboards:** Compete with your group members and see who is studying the most.
- **User Authentication:** Secure user accounts and profiles.

## Tech Stack


- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Backend & DB:** [Supabase](https://supabase.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Live Demo

The project is hosted at <https://studyrats.xyz/>. The deployment may be paused occasionally to conserve resources.

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/installation)
- [Supabase Account](https://supabase.com/dashboard)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/book-tracker.git
    cd book-tracker
    ```

2. **Install dependencies:**

    ```bash
    pnpm install
    ```

3. **Set up your Supabase project:**
    - Go to the [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
    - Keep your Project URL and `anon` public key handy.

4. **Set up environment variables:**
    - Create a `.env.local` file in the root of the project.
    - Add your Supabase credentials to it:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

5. **Link your local environment to your Supabase project:**

    ```bash
    supabase login
    supabase link --project-ref YOUR_PROJECT_ID
    ```

    You can get `YOUR_PROJECT_ID` from your project's dashboard URL (`https://supabase.com/dashboard/project/<YOUR_PROJECT_ID>`).

6. **Apply database migrations:**

    ```bash
    supabase db push
    ```

7. **Run the development server:**

    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
