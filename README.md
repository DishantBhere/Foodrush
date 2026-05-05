# 🍽️ FoodRush.io
> Smart Campus Canteen Food Ordering System,
It's was my academic final year project. It's a full-stack smart canteen ordering system that replaces the traditional manual canteen process,students can browse the menu, order food, pay online, and track their order in real time, while admins manage everything from a central dashboard.

---

## 📸 Screenshots

**Homepage**
![Homepage](https://github.com/user-attachments/assets/1f950355-44f7-4e3a-89da-ff298dbf6472)

**AI Chatbot**
![Chatbot](https://github.com/user-attachments/assets/28bce8e7-4ddb-4228-95ed-2ed0bdde0f13)

**Menu**
![Menu](https://github.com/user-attachments/assets/a200e019-3fe1-4162-9ba9-18401709519e)

**Payment**
![Payment](https://github.com/user-attachments/assets/dfd50418-b183-4986-a0f4-01c97f5a3f70)

**Order Tracking**
![Tracking](https://github.com/user-attachments/assets/079f0114-7ea6-4626-a5a2-223ad93bd8d2)

---


## FoodRush.io – Full Workflow Demo
https://github.com/user-attachments/assets/afe61286-7763-488d-9566-769ab0c5b025







## 🔄 How It Works

**Customer**
1. Sign up / Login
2. Browse menu by category — Appetizers, Beverages, Desserts, Main Course, Salads & Bowls
3. Use the AI Chatbot (bottom-right of homepage) for recommendations or canteen queries
4. Add items to cart → proceed to Checkout
5. Enter name, table number and email → OTP sent to email → verify to place order
6. Pay via Razorpay
7. Order confirmation bill sent as PDF attachment to email
8. Unique alphanumeric ticket generated → popup appears with a COPY button
9. Go to tracking page → paste ticket → click Track → view live order status

**Order Status Flow**
```
Pending → Confirmed → Preparing → Ready → Done
                                         → Cancelled
```

**Admin**
- Login via separate admin page
- View monthly & weekly revenue charts + order breakdown pie chart
- Manually update order status for each order
- Export order data to Excel

---

## 🛠️ Tech Stack

| | Technology |
|---|---|
| **Framework** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS v4, Radix UI, Shadcn/ui |
| **Animations** | GSAP, Three.js |
| **State** | Zustand |
| **Database** | MySQL (mysql2) |
| **Auth** | bcryptjs, Zod, React Hook Form |
| **Email** | Nodemailer (OTP + PDF bill attachment) |
| **Payment** | Razorpay |
| **AI Chatbot** | Groq API (LLaMA3) |
| **Charts** | Recharts |
| **Export** | Excel (order data), jsPDF (email bill) |

---

## 📁 Project Structure

```
Foodrush/
├── app/
│   ├── page.tsx                  # Homepage + AI Chatbot
│   ├── login/                    # Login page
│   ├── signup/                   # Sign up page
│   ├── checkout/                 # Checkout + OTP verification
│   ├── payment/                  # Razorpay + Ticket popup
│   ├── track/                    # Order tracking
│   ├── admin/                    # Admin dashboard
│   └── api/                      # auth, orders, food-items, send-otp, send-email, export, chat, stats
├── components/
│   ├── admin/                    # Dashboard, orders, stats components
│   └── ui/                       # cart-sidebar, food-card, checkout-form, chatbot, animations
├── hooks/                        # Custom hooks (cart, auth)
├── lib/                          # DB connection, utilities
├── scripts/                      # DB seed scripts
└── styles/
```

---

## ⚙️ Setup

### Before You Start

Download and set up the following:

| What | Why | Where |
|---|---|---|
| **Node.js v18+** | Run the project | [nodejs.org](https://nodejs.org) |
| **pnpm** | Package manager | `npm install -g pnpm` |
| **MySQL 8.0+** | Database | [mysql.com](https://dev.mysql.com/downloads) |
| **Gmail App Password** | OTP + PDF bill emails | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |
| **Razorpay Account** | Payment (test keys) | [razorpay.com](https://razorpay.com) |
| **Groq API Key** | AI Chatbot | [console.groq.com](https://console.groq.com) |

> Everything else — GSAP, Three.js, Recharts, Radix UI, Zustand, Shadcn/ui, bcryptjs, jsPDF and all other packages — install automatically via `pnpm install`.

---

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/DishantBhere/Foodrush.git
cd Foodrush

# 2. Install all dependencies
pnpm install

# 3. Create your env file and fill in the values
cp .env.example .env.local
```

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=food_ordering_system

# Auth
JWT_SECRET=your_jwt_secret

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

```bash
# 4. Set up the database
mysql -u root -p < scripts/schema.sql

# 5. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)  
Admin → [http://localhost:3000/admin](http://localhost:3000/admin)

---

## ⚠️ Notes

- Razorpay runs in **test mode** — no real transactions
- Runs **locally only**, not deployed
- PDF bill is sent as **email attachment** after payment success

---

*Built by [Dishant Bhere](https://github.com/DishantBhere) IT  · University of Mumbai*
