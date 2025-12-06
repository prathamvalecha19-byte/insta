# 🚀 Deployment Guide: Instagram Clone

This guide explains how to deploy your project to **Render** (for the web app) and connect it to a **Free Cloud Database**.

---

##  PART 1: Get a Free Cloud Database ☁️

Since `localhost` database doesn't work on the cloud, you need a cloud hosted MySQL database. Here are the two best free options:

### Option A: TiDB Cloud (Recommended - Serverless MySQL)
1.  Go to **[TiDB Cloud](https://tidbcloud.com/)** and sign up (GitHub login is easiest).
2.  Click **"Create Cluster"** -> Select **"Serverless"** (Free Forever).
3.  Give it a name (e.g., `InstaCloneDB`) and create it.
4.  Once created, click **"Connect"** (top right).
5.  In the standard connection tab, you will see your details:
    *   **Host**: `gateway01...tidbcloud.com`
    *   **Port**: `4000`
    *   **User**: `.....`
    *   **Password**: (Click "Reset Password" or "Generate" to get one)
6.  **SAVE THESE DETAILS!**

### Option B: Aiven (Alternative)
1.  Go to **[Aiven.io](https://aiven.io/)** and sign up.
2.  Click **"Create Service"**.
3.  Select **MySQL**.
4.  Select **Cloud Provider**: Google Cloud or AWS (Region: choose closest to you).
5.  **Service Plan**: Select **Free** (Sandbox).
6.  Click **"Create Service"**.
7.  Wait for it to start ("Running" state).
8.  Copy the **Service URI** or individual fields (Host, User, Password, Port).

---

## PART 2: Deploy Web App to Render 🚀

1.  **Push to GitHub**: Make sure your latest code is on GitHub.
2.  **Render Account**: Log in to **[Render Dashboard](https://dashboard.render.com/)**.
3.  **Create Web Service**:
    *   Click **"New +"** -> **"Web Service"**.
    *   Connect your GitHub repo: `insta`.
    *   **Name**: `my-insta-clone` (must be unique).
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install`.
    *   **Start Command**: `node server.js`.
    *   **Instance Type**: **Free**.

4.  **configure Environment Variables**:
    *   Scroll down to **"Environment Variables"**.
    *   Add the following keys using the details you got from TiDB or Aiven:

    | Key           | Value Example                          |
    | :---          | :---                                   |
    | `DB_HOST`     | `gateway01.us-west-2...tidbcloud.com`  |
    | `DB_USER`     | `2SeRx...`                             |
    | `DB_PASSWORD` | `YOUR_GENERATED_PASSWORD`              |
    | `DB_NAME`     | `test` (or `insta_clone_db` if valid)  |
    | `DB_PORT`     | `4000` (TiDB) or `3306` (Aiven)        |

5.  **Deploy**:
    *   Click **"Create Web Service"**.
    *   Watch the logs. If it says "Connected to MySQL", you are golden!

**Verification:**
Open your new Render URL (e.g., `https://my-insta-clone.onrender.com`).
Try to log in. The user should be saved to your Cloud Database!
