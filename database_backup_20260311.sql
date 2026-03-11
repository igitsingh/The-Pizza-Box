--
-- PostgreSQL database dump
--

\restrict HbhoxgHtsGeAcRAX9t2wYp0BQopO73lP0Wx1ZMf9NgrH0TxSZ7KMhLwe68SJUqy

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ComplaintStatus; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."ComplaintStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED'
);


ALTER TYPE public."ComplaintStatus" OWNER TO isachinsingh;

--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."DiscountType" AS ENUM (
    'FLAT',
    'PERCENTAGE'
);


ALTER TYPE public."DiscountType" OWNER TO isachinsingh;

--
-- Name: EnquirySource; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."EnquirySource" AS ENUM (
    'CONTACT_FORM',
    'WHATSAPP',
    'CALL_BACK',
    'CHAT',
    'PHONE',
    'EMAIL'
);


ALTER TYPE public."EnquirySource" OWNER TO isachinsingh;

--
-- Name: EnquiryStatus; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."EnquiryStatus" AS ENUM (
    'NEW',
    'IN_PROGRESS',
    'CONTACTED',
    'CONVERTED',
    'CLOSED',
    'SPAM'
);


ALTER TYPE public."EnquiryStatus" OWNER TO isachinsingh;

--
-- Name: MembershipTier; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."MembershipTier" AS ENUM (
    'BRONZE',
    'SILVER',
    'GOLD',
    'PLATINUM'
);


ALTER TYPE public."MembershipTier" OWNER TO isachinsingh;

--
-- Name: NotificationChannel; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."NotificationChannel" AS ENUM (
    'LOG',
    'SMS',
    'WHATSAPP',
    'EMAIL'
);


ALTER TYPE public."NotificationChannel" OWNER TO isachinsingh;

--
-- Name: NotificationEvent; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."NotificationEvent" AS ENUM (
    'ORDER_PLACED',
    'ORDER_ACCEPTED',
    'ORDER_PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'SCHEDULED_ORDER_CONFIRMED'
);


ALTER TYPE public."NotificationEvent" OWNER TO isachinsingh;

--
-- Name: NotificationStatus; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."NotificationStatus" AS ENUM (
    'QUEUED',
    'SENT',
    'FAILED',
    'SKIPPED'
);


ALTER TYPE public."NotificationStatus" OWNER TO isachinsingh;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'SCHEDULED',
    'PENDING',
    'ACCEPTED',
    'PREPARING',
    'BAKING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO isachinsingh;

--
-- Name: OrderType; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."OrderType" AS ENUM (
    'INSTANT',
    'SCHEDULED'
);


ALTER TYPE public."OrderType" OWNER TO isachinsingh;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'COD',
    'UPI',
    'CARD',
    'NET_BANKING'
);


ALTER TYPE public."PaymentMethod" OWNER TO isachinsingh;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO isachinsingh;

--
-- Name: ReferralStatus; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."ReferralStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."ReferralStatus" OWNER TO isachinsingh;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: isachinsingh
--

CREATE TYPE public."Role" AS ENUM (
    'CUSTOMER',
    'ADMIN',
    'MANAGER',
    'CHEF',
    'DELIVERY_PARTNER',
    'ACCOUNTANT'
);


ALTER TYPE public."Role" OWNER TO isachinsingh;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "userId" text NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    zip text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Address" OWNER TO isachinsingh;

--
-- Name: Branch; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Branch" (
    id text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Branch" OWNER TO isachinsingh;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text,
    image text,
    "seoTitle" text,
    "seoDescription" text
);


ALTER TABLE public."Category" OWNER TO isachinsingh;

--
-- Name: Complaint; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Complaint" (
    id text NOT NULL,
    "userId" text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    status public."ComplaintStatus" DEFAULT 'OPEN'::public."ComplaintStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Complaint" OWNER TO isachinsingh;

--
-- Name: Coupon; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Coupon" (
    id text NOT NULL,
    code text NOT NULL,
    type public."DiscountType" NOT NULL,
    value double precision NOT NULL,
    expiry timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "limit" integer,
    "usedCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Coupon" OWNER TO isachinsingh;

--
-- Name: DeliveryPartner; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."DeliveryPartner" (
    id text NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    "vehicleType" text,
    "vehicleNumber" text,
    "currentLocation" text,
    status text DEFAULT 'AVAILABLE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DeliveryPartner" OWNER TO isachinsingh;

--
-- Name: DeliveryZone; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."DeliveryZone" (
    id text NOT NULL,
    name text NOT NULL,
    pincode text NOT NULL,
    charge double precision NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DeliveryZone" OWNER TO isachinsingh;

--
-- Name: Enquiry; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Enquiry" (
    id text NOT NULL,
    name text NOT NULL,
    email text,
    phone text NOT NULL,
    message text NOT NULL,
    source public."EnquirySource" DEFAULT 'CONTACT_FORM'::public."EnquirySource" NOT NULL,
    status public."EnquiryStatus" DEFAULT 'NEW'::public."EnquiryStatus" NOT NULL,
    "assignedTo" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Enquiry" OWNER TO isachinsingh;

--
-- Name: Feedback; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Feedback" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "userId" text,
    "guestPhone" text,
    rating integer NOT NULL,
    review text,
    "adminResponse" text,
    "isVisible" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Feedback" OWNER TO isachinsingh;

--
-- Name: Item; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Item" (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    name text NOT NULL,
    description text,
    price double precision NOT NULL,
    image text,
    slug text,
    "seoTitle" text,
    "seoDescription" text,
    "altText" text,
    "isVeg" boolean DEFAULT true NOT NULL,
    "isSpicy" boolean DEFAULT false NOT NULL,
    "isBestSeller" boolean DEFAULT false NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    stock integer DEFAULT 100 NOT NULL,
    "isStockManaged" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Item" OWNER TO isachinsingh;

--
-- Name: ItemAddon; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."ItemAddon" (
    id text NOT NULL,
    "itemId" text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public."ItemAddon" OWNER TO isachinsingh;

--
-- Name: ItemOption; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."ItemOption" (
    id text NOT NULL,
    "itemId" text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."ItemOption" OWNER TO isachinsingh;

--
-- Name: Location; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Location" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "seoTitle" text,
    "seoDescription" text,
    content text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Location" OWNER TO isachinsingh;

--
-- Name: NotificationLog; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."NotificationLog" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    channel public."NotificationChannel" NOT NULL,
    event public."NotificationEvent" NOT NULL,
    status public."NotificationStatus" NOT NULL,
    message text NOT NULL,
    metadata jsonb,
    error text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."NotificationLog" OWNER TO isachinsingh;

--
-- Name: OptionChoice; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."OptionChoice" (
    id text NOT NULL,
    "optionId" text NOT NULL,
    name text NOT NULL,
    price double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."OptionChoice" OWNER TO isachinsingh;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "orderNumber" integer NOT NULL,
    "userId" text,
    "customerName" text,
    "customerPhone" text,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    total double precision NOT NULL,
    subtotal double precision DEFAULT 0 NOT NULL,
    tax double precision DEFAULT 0 NOT NULL,
    "deliveryFee" double precision DEFAULT 0 NOT NULL,
    "paymentMethod" public."PaymentMethod" DEFAULT 'COD'::public."PaymentMethod" NOT NULL,
    "paymentStatus" public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "paymentDetails" jsonb,
    instructions text,
    "deliveryPartnerId" text,
    "addressId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "guestAddress" jsonb,
    "isRepeated" boolean DEFAULT false NOT NULL,
    "repeatedFromOrderId" text,
    "scheduledFor" timestamp(3) without time zone,
    "orderType" public."OrderType" DEFAULT 'INSTANT'::public."OrderType" NOT NULL,
    "taxBreakup" jsonb,
    "invoiceNumber" text,
    "invoiceGeneratedAt" timestamp(3) without time zone,
    "couponCode" text,
    "discountAmount" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."Order" OWNER TO isachinsingh;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "itemId" text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    quantity integer NOT NULL,
    options jsonb,
    addons jsonb,
    variants jsonb
);


ALTER TABLE public."OrderItem" OWNER TO isachinsingh;

--
-- Name: Order_orderNumber_seq; Type: SEQUENCE; Schema: public; Owner: isachinsingh
--

CREATE SEQUENCE public."Order_orderNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Order_orderNumber_seq" OWNER TO isachinsingh;

--
-- Name: Order_orderNumber_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isachinsingh
--

ALTER SEQUENCE public."Order_orderNumber_seq" OWNED BY public."Order"."orderNumber";


--
-- Name: ReferralTransaction; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."ReferralTransaction" (
    id text NOT NULL,
    "referrerId" text NOT NULL,
    "refereeId" text NOT NULL,
    "rewardAmount" double precision NOT NULL,
    "orderValue" double precision NOT NULL,
    status public."ReferralStatus" DEFAULT 'PENDING'::public."ReferralStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ReferralTransaction" OWNER TO isachinsingh;

--
-- Name: Refund; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Refund" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    amount double precision NOT NULL,
    reason text,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Refund" OWNER TO isachinsingh;

--
-- Name: Settings; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Settings" (
    id text NOT NULL,
    "restaurantName" text NOT NULL,
    "contactPhone" text NOT NULL,
    "contactEmail" text NOT NULL,
    address text NOT NULL,
    "minOrderAmount" double precision DEFAULT 0 NOT NULL,
    "operatingHours" text NOT NULL,
    "isOpen" boolean DEFAULT true NOT NULL,
    "isPaused" boolean DEFAULT false NOT NULL,
    "notificationsEnabled" boolean DEFAULT true NOT NULL,
    "whatsappEnabled" boolean DEFAULT false NOT NULL,
    "smsEnabled" boolean DEFAULT false NOT NULL,
    "emailEnabled" boolean DEFAULT false NOT NULL,
    "closedMessage" text,
    "lastOrderTime" text,
    "seoTitle" text,
    "seoDescription" text,
    "seoOgImage" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Settings" OWNER TO isachinsingh;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "orderId" text,
    amount double precision NOT NULL,
    type text NOT NULL,
    status text NOT NULL,
    method text NOT NULL,
    reference text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO isachinsingh;

--
-- Name: User; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text,
    password text,
    name text NOT NULL,
    role public."Role" DEFAULT 'CUSTOMER'::public."Role" NOT NULL,
    phone text,
    otp text,
    "otpExpiry" timestamp(3) without time zone,
    notes text,
    "isVIP" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "referralCode" text,
    "referredBy" text,
    "referralReward" double precision DEFAULT 0 NOT NULL,
    "totalReferrals" integer DEFAULT 0 NOT NULL,
    "membershipTier" public."MembershipTier" DEFAULT 'BRONZE'::public."MembershipTier" NOT NULL,
    "membershipPoints" integer DEFAULT 0 NOT NULL,
    "lifetimeSpending" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."User" OWNER TO isachinsingh;

--
-- Name: Variant; Type: TABLE; Schema: public; Owner: isachinsingh
--

CREATE TABLE public."Variant" (
    id text NOT NULL,
    "itemId" text NOT NULL,
    type text NOT NULL,
    label text NOT NULL,
    price double precision NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Variant" OWNER TO isachinsingh;

--
-- Name: Order orderNumber; Type: DEFAULT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Order" ALTER COLUMN "orderNumber" SET DEFAULT nextval('public."Order_orderNumber_seq"'::regclass);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Address" (id, "userId", street, city, zip, "isDefault") FROM stdin;
\.


--
-- Data for Name: Branch; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Branch" (id, name, address, phone, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Category" (id, name, slug, image, "seoTitle", "seoDescription") FROM stdin;
ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Pizzas	pizzas	https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80	Order Best Pizzas Online in Meerut | The Pizza Box	Order fresh and hot pizzas online from The Pizza Box. Best pizza delivery in Prabhat Nagar, Meerut. Wide range of veg and non-veg pizzas.
9e0d07db-3ee8-4698-95d9-6ad4823d388f	Burgers	burgers	https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80	Best Burgers in Meerut | Crispy Chicken & Veg Burgers	Craving burgers? Order juicy and crispy burgers from The Pizza Box. Best burger delivery in Meerut.
bc9873c9-7773-43f3-bd33-5a5163c3b0b4	Sides	sides	https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500&q=80	Garlic Bread, Wings & Sides Delivery | The Pizza Box	Complete your meal with our delicious sides. Garlic bread, chicken wings, and more available for delivery in Meerut.
979e17a3-24c2-4be7-a804-da3cb19e9d4d	Beverages	beverages	https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80	Cold Drinks & Shakes Delivery | The Pizza Box	Thirsty? Order cold drinks and thick shakes from The Pizza Box to go with your meal.
e73a2601-e170-48cb-a970-1da4f5bb2787	Desserts	desserts	https://images.unsplash.com/photo-1563729768640-d65d19a33227?w=500&q=80	Delicious Desserts | The Pizza Box	Sweet treats to end your meal. Order desserts online in Meerut.
63abe996-0c91-4dfb-82ec-2931c61bdd21	Deals	deals	https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&q=80	Best Pizza Deals & Offers | The Pizza Box	Save big with our exclusive pizza deals and combos. Best offers in Prabhat Nagar.
82a4e98c-34a6-47e3-90e5-5a3665f358c6	Pasta	pasta	https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80	Creamy Pasta Delivery | The Pizza Box	Order rich and creamy pasta online. White sauce, red sauce, and more.
c7573163-e042-46c3-8179-f8cf1eec2717	New	new	https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=500&q=80	New Arrivals | The Pizza Box	Check out the latest additions to our menu. Try something new today!
\.


--
-- Data for Name: Complaint; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Complaint" (id, "userId", subject, message, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Coupon; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Coupon" (id, code, type, value, expiry, "isActive", "limit", "usedCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: DeliveryPartner; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."DeliveryPartner" (id, name, phone, email, "vehicleType", "vehicleNumber", "currentLocation", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: DeliveryZone; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."DeliveryZone" (id, name, pincode, charge, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Enquiry; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Enquiry" (id, name, email, phone, message, source, status, "assignedTo", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Feedback; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Feedback" (id, "orderId", "userId", "guestPhone", rating, review, "adminResponse", "isVisible", "createdAt") FROM stdin;
\.


--
-- Data for Name: Item; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Item" (id, "categoryId", name, description, price, image, slug, "seoTitle", "seoDescription", "altText", "isVeg", "isSpicy", "isBestSeller", "isAvailable", stock, "isStockManaged", "createdAt", "updatedAt") FROM stdin;
728fb75e-a0ec-4108-8a38-76eed2820ed4	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Cheese & Tomato Pizza	A classic choice loved across Prabhat Nagar. Fresh tomato, rich mozzarella, and a crisp base make this the perfect affordable veg pizza in Meerut for everyday cravings.	169	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80	cheese-and-tomato-pizza	Cheese & Tomato Pizza | Best Veg Pizza in Prabhat Nagar Meerut	Order Cheese & Tomato Pizza online in Meerut. Fresh tomatoes, mozzarella cheese, and crispy crust. Best affordable veg pizza in Prabhat Nagar.	Cheese and Tomato Pizza with fresh toppings	t	f	f	t	100	f	2026-03-10 15:41:04.725	2026-03-10 15:41:04.725
adeddace-bfbb-4c17-8db2-7b90a6b1349c	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Cheese N Corn Pizza	A creamy, cheesy delight topped with sweet American corn. One of the highest-rated veg pizzas in Meerut for its balance of taste and value.	169	https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80	cheese-n-corn-pizza	Cheese N Corn Pizza Delivery | Sweet Corn Pizza Meerut	Delicious Cheese N Corn Pizza with sweet American corn and creamy cheese. Top-rated veg pizza in Meerut available for delivery.	Cheese N Corn Pizza with sweet corn toppings	t	f	f	t	100	f	2026-03-10 15:41:04.739	2026-03-10 15:41:04.739
89312b71-c52c-4ef5-b5e7-01afb0a4e338	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Cheese N Capsicum Pizza	Loaded with fresh capsicum and mozzarella, this pizza is a favourite for those who love light, crunchy toppings with classic Italian flavours.	169	https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80	cheese-n-capsicum-pizza	Cheese N Capsicum Pizza | Crunchy Veg Pizza in Meerut	Order Cheese N Capsicum Pizza. Fresh capsicum and mozzarella cheese on a crispy base. A favorite light and crunchy pizza in Meerut.	Cheese N Capsicum Pizza with fresh green peppers	t	f	f	t	100	f	2026-03-10 15:41:04.753	2026-03-10 15:41:04.753
430267ad-4686-4095-8753-c4ca07520ead	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Cheese N Onion Pizza	Perfectly caramelized onions combined with stretchy cheese create a deliciously comforting pizza, ideal for quick meals or late-night orders in Meerut.	169	https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80	cheese-n-onion-pizza	Cheese N Onion Pizza | Caramelized Onion Pizza Meerut	Comforting Cheese N Onion Pizza with caramelized onions and stretchy cheese. Perfect for late-night cravings in Meerut.	Cheese N Onion Pizza with caramelized onions	t	f	f	t	100	f	2026-03-10 15:41:04.76	2026-03-10 15:41:04.76
5a4cc722-3610-47d9-9fae-5ab077eed058	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Cheese N Paneer With Onion Pizza	Soft paneer cubes, onions, and mozzarella come together to create a rich, flavorful pizza perfect for paneer lovers in Prabhat Nagar.	199	https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80	cheese-n-paneer-with-onion-pizza	Cheese N Paneer Onion Pizza | Paneer Pizza Prabhat Nagar	Rich Cheese N Paneer With Onion Pizza. Soft paneer cubes and onions. A must-try for paneer lovers in Prabhat Nagar, Meerut.	Cheese N Paneer With Onion Pizza loaded with toppings	t	f	f	t	100	f	2026-03-10 15:41:04.769	2026-03-10 15:41:04.769
e9d8dd65-6df1-4404-9e47-1b45c1e6773b	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Cheese N Paneer With Mushroom Pizza	A premium pizza loaded with fresh mushrooms and soft paneer — a popular choice among mushroom fans who love restaurant-style flavours at home.	209	https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80	cheese-n-paneer-with-mushroom-pizza	Cheese N Paneer Mushroom Pizza | Premium Veg Pizza Meerut	Premium Cheese N Paneer With Mushroom Pizza. Fresh mushrooms and soft paneer. Restaurant-style flavor delivered to your home in Meerut.	Cheese N Paneer With Mushroom Pizza	t	f	f	t	100	f	2026-03-10 15:41:04.779	2026-03-10 15:41:04.779
495fd9b6-5aa1-4743-b9bc-ea679c574a0f	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Spicy Sweet Corn Pizza	Combining the sweetness of corn with light spices, this pizza offers a fun flavour twist loved by families and kids in Meerut.	209	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80	spicy-sweet-corn-pizza	Spicy Sweet Corn Pizza | Sweet & Spicy Pizza Meerut	Spicy Sweet Corn Pizza combining sweet corn with light spices. A fun flavor twist loved by kids and families in Meerut.	Spicy Sweet Corn Pizza	t	t	f	t	100	f	2026-03-10 15:41:04.784	2026-03-10 15:41:04.784
00ccd9f8-55a6-4442-92b0-6e839cf059a2	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Spicy Chilli Pizza	A signature spicy pizza layered with green chillies and cheese — perfect for spice lovers searching for bold flavours in Prabhat Nagar.	209	https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80	spicy-chilli-pizza	Spicy Chilli Pizza | Bold Spicy Pizza Prabhat Nagar	Signature Spicy Chilli Pizza with green chillies and cheese. Perfect for spice lovers in Prabhat Nagar looking for bold flavors.	Spicy Chilli Pizza with green chillies	t	t	f	t	100	f	2026-03-10 15:41:04.791	2026-03-10 15:41:04.791
69743ebc-a138-401c-b372-295e52d0cd71	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Chilli Paneer Mushroom Pizza	A fusion pizza that mixes Indo-Chinese taste with Italian crust. Loaded with paneer, mushrooms, chillies — ideal for those who enjoy spicy, tangy blends.	209	https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80	chilli-paneer-mushroom-pizza	Chilli Paneer Mushroom Pizza | Indo-Chinese Fusion Pizza	Fusion Chilli Paneer Mushroom Pizza. Indo-Chinese taste with Italian crust. Spicy and tangy blend with paneer and mushrooms.	Chilli Paneer Mushroom Pizza	t	t	f	t	100	f	2026-03-10 15:41:04.798	2026-03-10 15:41:04.798
15da11f3-a7c8-4628-b735-d6fa10a3e73d	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Chilli Paneer Pizza	One of the best-selling pizzas at The Pizza Box. Soft paneer chunks tossed with chilli seasoning make it a top pick among students & youngsters.	209	https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80	chilli-paneer-pizza	Chilli Paneer Pizza | Best Selling Spicy Paneer Pizza	Chilli Paneer Pizza, a bestseller at The Pizza Box. Soft paneer chunks with chilli seasoning. Top pick for students in Meerut.	Chilli Paneer Pizza with spicy paneer chunks	t	t	t	t	100	f	2026-03-10 15:41:04.804	2026-03-10 15:41:04.804
13c4353a-4a55-482c-8094-3dbccf59fce0	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Paneer Makhani Pizza	Rich makhani gravy, paneer cubes & cheese on a soft crust — North Indian flavours meet Italian style. Extremely popular in Meerut.	209	https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80	paneer-makhani-pizza	Paneer Makhani Pizza | North Indian Fusion Pizza Meerut	Paneer Makhani Pizza with rich makhani gravy and paneer cubes. North Indian flavors on a soft Italian crust. Popular in Meerut.	Paneer Makhani Pizza with rich gravy	t	f	t	t	100	f	2026-03-10 15:41:04.811	2026-03-10 15:41:04.811
4ecb89a3-110a-4841-936d-d94a5625f460	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Tandoori Paneer Pizza	Smoky tandoori paneer, bold spices, and melted cheese create a restaurant-style pizza that’s a hit for parties and family orders.	209	https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80	tandoori-paneer-pizza	Tandoori Paneer Pizza | Smoky Paneer Pizza Delivery	Smoky Tandoori Paneer Pizza with bold spices and melted cheese. Restaurant-style pizza perfect for parties in Meerut.	Tandoori Paneer Pizza with smoky toppings	t	f	t	t	100	f	2026-03-10 15:41:04.817	2026-03-10 15:41:04.817
5ecbe77c-6ee4-4d98-a419-756a469924f2	bc9873c9-7773-43f3-bd33-5a5163c3b0b4	Garlic Breadsticks	Baked to perfection with garlic butter.	129	https://images.unsplash.com/photo-1573140247632-f84660f67627?w=800&q=80	garlic-breadsticks	Garlic Breadsticks | Freshly Baked Sides	Garlic Breadsticks baked to perfection with garlic butter. The perfect side for your pizza.	Garlic Breadsticks	t	f	t	t	100	f	2026-03-10 15:41:04.883	2026-03-10 15:41:04.883
83227007-4a4a-4c49-97bf-0be15f1a0470	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Half Tandoori & Half Veggie Pizza	A dual-flavour pizza giving you two experiences in one — perfect for indecisive eaters or couples sharing a meal.	209	https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80	half-tandoori-half-veggie-pizza	Half Tandoori & Half Veggie Pizza | Dual Flavor Pizza	Half Tandoori & Half Veggie Pizza. Two flavors in one. Perfect for sharing or indecisive eaters in Meerut.	Half Tandoori and Half Veggie Pizza	t	f	f	t	100	f	2026-03-10 15:41:04.822	2026-03-10 15:41:04.822
a448dc7f-796f-4a02-983a-44d1df3f721a	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Half Paneer & Half Margherita Pizza	Simple meets indulgent. Margherita on one side, paneer on the other — ideal for a balanced meal.	209	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80	half-paneer-half-margherita-pizza	Half Paneer & Half Margherita Pizza | Balanced Pizza Choice	Half Paneer & Half Margherita Pizza. Simple Margherita meets indulgent paneer. Ideal balanced meal for pizza lovers.	Half Paneer and Half Margherita Pizza	t	f	f	t	100	f	2026-03-10 15:41:04.828	2026-03-10 15:41:04.828
5c194a09-aebc-414d-ba59-463591c947e5	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Half Veg Loaded & Half Mexican Pizza	Veg loaded for Indian taste + Mexican seasoning for tangy chilli flavour — best of both worlds.	209	https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80	half-veg-loaded-half-mexican-pizza	Half Veg Loaded & Half Mexican Pizza | Indian & Mexican Fusion	Half Veg Loaded & Half Mexican Pizza. Veg loaded for Indian taste plus Mexican seasoning for tangy flavor. Best of both worlds.	Half Veg Loaded and Half Mexican Pizza	t	t	f	t	100	f	2026-03-10 15:41:04.834	2026-03-10 15:41:04.834
4a5cd383-6372-427e-a679-72c97fe76d51	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Half Makhani & Half Spicy Chilli Pizza	A sweet, buttery makhani flavour combined with spicy chilli — great for people who love experimenting.	209	https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80	half-makhani-half-spicy-chilli-pizza	Half Makhani & Half Spicy Chilli Pizza | Sweet & Spicy Combo	Half Makhani & Half Spicy Chilli Pizza. Sweet buttery makhani flavor combined with spicy chilli. Great for experimental pizza lovers.	Half Makhani and Half Spicy Chilli Pizza	t	t	f	t	100	f	2026-03-10 15:41:04.839	2026-03-10 15:41:04.839
60184490-b2f4-4442-8800-9f43270956c7	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Indo Western Veggie Pizza	Olives, tomato, baby corn, mushrooms & mozzarella make this a premium exotic pizza — one of the most flavour-rich veg pizzas in Meerut.	239	https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80	indo-western-veggie-pizza	Indo Western Veggie Pizza | Premium Exotic Veg Pizza	Indo Western Veggie Pizza with olives, tomato, baby corn, and mushrooms. One of the most flavor-rich premium veg pizzas in Meerut.	Indo Western Veggie Pizza with exotic toppings	t	f	f	t	100	f	2026-03-10 15:41:04.844	2026-03-10 15:41:04.844
f5decb18-fa54-41f2-9960-73ab76be9307	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Double Cheese Margherita Pizza	Cheese lovers’ favourite. Extra mozzarella, creamy flavour, and classic Italian taste.	219	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80	double-cheese-margherita-pizza	Double Cheese Margherita Pizza | Extra Cheese Pizza Meerut	Double Cheese Margherita Pizza. A cheese lover's favorite with extra mozzarella and creamy flavor. Classic Italian taste.	Double Cheese Margherita Pizza	t	f	t	t	100	f	2026-03-10 15:41:04.85	2026-03-10 15:41:04.85
b1492631-87a4-46a4-82c4-fbd46748d67e	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Peppy Paneer Pizza	Paneer, capsicum, and red paprika — a Domino’s-style flavour recreated with a local twist.	219	https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80	peppy-paneer-pizza	Peppy Paneer Pizza | Spicy Paneer Pizza with Local Twist	Peppy Paneer Pizza with paneer, capsicum, and red paprika. Domino's-style flavor recreated with a local twist in Meerut.	Peppy Paneer Pizza with red paprika	t	t	t	t	100	f	2026-03-10 15:41:04.855	2026-03-10 15:41:04.855
fc9de2d0-9a22-48f7-b7dd-ef2ac1d6cf94	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Farm House Pizza	Onion, capsicum, tomato, mushrooms create a garden-fresh pizza ideal for veggie lovers.	219	https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80	farm-house-pizza	Farm House Pizza | Garden Fresh Veggie Pizza Meerut	Farm House Pizza with onion, capsicum, tomato, and mushrooms. Garden-fresh pizza ideal for veggie lovers in Meerut.	Farm House Pizza with fresh vegetables	t	f	t	t	100	f	2026-03-10 15:41:04.861	2026-03-10 15:41:04.861
bb30518e-f1cf-4c4b-ba94-453a831a6488	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Mexican Green Wave Pizza	Mexican herbs, jalapenos, capsicum & onions give a spicy-tangy flavour—very popular among students.	219	https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80	mexican-green-wave-pizza	Mexican Green Wave Pizza | Spicy Mexican Pizza Meerut	Mexican Green Wave Pizza with herbs, jalapenos, capsicum, and onions. Spicy-tangy flavor popular among students in Meerut.	Mexican Green Wave Pizza with jalapenos	t	t	f	t	100	f	2026-03-10 15:41:04.867	2026-03-10 15:41:04.867
fbe78ca1-8f27-4a20-aa50-8241a418507b	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Cheesy Mozzarella Delight Pizza	Extra smooth mozzarella and buttery crust — a soft, rich, cheesy experience.	199	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80	cheesy-mozzarella-delight-pizza	Cheesy Mozzarella Delight Pizza | Rich Cheesy Pizza	Cheesy Mozzarella Delight Pizza with extra smooth mozzarella and buttery crust. A soft, rich, and cheesy experience.	Cheesy Mozzarella Delight Pizza	t	f	f	t	100	f	2026-03-10 15:41:04.873	2026-03-10 15:41:04.873
722f98f8-ba5f-415f-b757-0d84a1d80bb9	ef7dc4a5-426f-42d3-adf4-f3d304aac48d	Veggie Island Pizza	Loaded with veggies, mozzarella, olives, capsicum & onion — perfect for group sharing.	239	https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80	veggie-island-pizza	Veggie Island Pizza | Loaded Veggie Pizza for Sharing	Veggie Island Pizza loaded with veggies, mozzarella, olives, capsicum, and onion. Perfect for group sharing in Meerut.	Veggie Island Pizza loaded with veggies	t	f	f	t	100	f	2026-03-10 15:41:04.877	2026-03-10 15:41:04.877
9f279a15-e1c8-4798-af6c-584f1cee801b	9e0d07db-3ee8-4698-95d9-6ad4823d388f	Crispy Chicken Burger	Crispy fried chicken patty with lettuce and mayo.	199	https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80	crispy-chicken-burger	Crispy Chicken Burger | Best Chicken Burger Meerut	Crispy Chicken Burger with fried chicken patty, lettuce, and mayo. Best chicken burger in Meerut.	Crispy Chicken Burger	f	f	t	t	100	f	2026-03-10 15:41:04.881	2026-03-10 15:41:04.881
2d0a265f-cecc-4bc8-87d6-5c7ba21f67d3	9e0d07db-3ee8-4698-95d9-6ad4823d388f	Veggie Burger	A huge vegetable patty with special sauces.	149	https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80	veggie-burger	Veggie Burger | Delicious Veg Burger Meerut	Veggie Burger with a huge vegetable patty and special sauces. Delicious veg burger option in Meerut.	Veggie Burger	t	f	f	t	100	f	2026-03-10 15:41:04.882	2026-03-10 15:41:04.882
bbf8701a-f512-4745-9066-169d546be871	9e0d07db-3ee8-4698-95d9-6ad4823d388f	Spicy Paneer Burger	Rich paneer patty with spicy sauce.	179	https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80	spicy-paneer-burger	Spicy Paneer Burger | Spicy Veg Burger Meerut	Spicy Paneer Burger with rich paneer patty and spicy sauce. A spicy treat for burger lovers in Meerut.	Spicy Paneer Burger	t	t	f	t	100	f	2026-03-10 15:41:04.882	2026-03-10 15:41:04.882
3bbf21d6-7ca4-4621-b7a3-1a17ceb62b8a	bc9873c9-7773-43f3-bd33-5a5163c3b0b4	Stuffed Garlic Bread	Freshly baked garlic bread with cheese and corn filling.	159	https://images.unsplash.com/photo-1619535860434-7f086338b3d2?w=800&q=80	stuffed-garlic-bread	Stuffed Garlic Bread | Cheese & Corn Filled Bread	Stuffed Garlic Bread with cheese and corn filling. Freshly baked and delicious.	Stuffed Garlic Bread	t	f	f	t	100	f	2026-03-10 15:41:04.883	2026-03-10 15:41:04.883
41bdad62-810c-41dc-8656-ab8d7b1bc984	bc9873c9-7773-43f3-bd33-5a5163c3b0b4	Spicy Chicken Wings	Juicy chicken wings tossed in spicy sauce.	249	https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80	spicy-chicken-wings	Spicy Chicken Wings | Juicy Wings Meerut	Juicy Spicy Chicken Wings tossed in spicy sauce. A perfect non-veg side dish.	Spicy Chicken Wings	f	t	f	t	100	f	2026-03-10 15:41:04.884	2026-03-10 15:41:04.884
a402ee80-afa2-4795-94b4-7a4da0170775	979e17a3-24c2-4be7-a804-da3cb19e9d4d	Coke (500ml)	Refreshing carbonated soft drink.	60	https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80	coke-500ml	Coke (500ml) | Refreshing Drink	Refreshing Coke (500ml) to accompany your meal.	Coke Bottle	t	f	f	t	100	f	2026-03-10 15:41:04.884	2026-03-10 15:41:04.884
7261f7a7-c183-4eac-950b-e83f526409ad	979e17a3-24c2-4be7-a804-da3cb19e9d4d	Chocolate Shake	Thick and creamy chocolate milkshake.	149	https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80	chocolate-shake	Chocolate Shake | Creamy Milkshake Meerut	Thick and creamy Chocolate Shake. A sweet treat to end your meal.	Chocolate Shake	t	f	f	t	100	f	2026-03-10 15:41:04.885	2026-03-10 15:41:04.885
409bc72a-f651-4778-bd0f-509b91adff50	e73a2601-e170-48cb-a970-1da4f5bb2787	Choco Lava Cake	Warm, gooey chocolate cake with a molten center.	99	https://images.unsplash.com/photo-1563729768640-d65d19a33227?w=800&q=80	choco-lava-cake	Choco Lava Cake | Molten Chocolate Cake	Warm Choco Lava Cake with a molten chocolate center. A perfect dessert.	Choco Lava Cake	t	f	t	t	100	f	2026-03-10 15:41:04.885	2026-03-10 15:41:04.885
90b30cd6-9490-412a-9700-8fbb8b775b79	e73a2601-e170-48cb-a970-1da4f5bb2787	Brownie with Ice Cream	Fudgy brownie served with vanilla ice cream.	129	https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&q=80	brownie-with-ice-cream	Brownie with Ice Cream | Fudgy Brownie Dessert	Fudgy Brownie served with vanilla ice cream. A classic dessert combination.	Brownie with Ice Cream	t	f	f	t	100	f	2026-03-10 15:41:04.886	2026-03-10 15:41:04.886
3072e54e-bd65-45bb-8bea-2aa493420553	82a4e98c-34a6-47e3-90e5-5a3665f358c6	White Sauce Pasta	Creamy pasta tossed with fresh vegetables and herbs.	199	https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80	white-sauce-pasta	White Sauce Pasta | Creamy Veg Pasta	Creamy White Sauce Pasta tossed with fresh vegetables and herbs. A rich and flavorful dish.	White Sauce Pasta	t	f	t	t	100	f	2026-03-10 15:41:04.886	2026-03-10 15:41:04.886
b4a6a89b-592a-4025-8788-5cb8ecb76d72	82a4e98c-34a6-47e3-90e5-5a3665f358c6	Red Sauce Pasta	Tangy tomato-based pasta with exotic veggies.	199	https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80	red-sauce-pasta	Red Sauce Pasta | Tangy Tomato Pasta	Tangy Red Sauce Pasta with exotic veggies. A classic Italian dish.	Red Sauce Pasta	t	f	f	t	100	f	2026-03-10 15:41:04.887	2026-03-10 15:41:04.887
e9317d65-2fe1-455f-bc67-43b9c84a5dd9	c7573163-e042-46c3-8179-f8cf1eec2717	Paneer Tikka Wrap	Spicy paneer tikka wrapped in a soft tortilla.	149	https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=800&q=80	paneer-tikka-wrap	Paneer Tikka Wrap | Spicy Paneer Roll	Spicy Paneer Tikka Wrap. Paneer tikka wrapped in a soft tortilla. A perfect snack.	Paneer Tikka Wrap	t	f	f	t	100	f	2026-03-10 15:41:04.887	2026-03-10 15:41:04.887
bed124c5-9528-4e44-b2bb-278a0361a9fa	c7573163-e042-46c3-8179-f8cf1eec2717	Chicken Keema Garlic Bread	Garlic bread topped with spicy chicken keema and cheese.	179	https://images.unsplash.com/photo-1573140247632-f84660f67627?w=800&q=80	chicken-keema-garlic-bread	Chicken Keema Garlic Bread | Spicy Chicken Side	Garlic bread topped with spicy chicken keema and cheese. A delicious non-veg side.	Chicken Keema Garlic Bread	f	f	f	t	100	f	2026-03-10 15:41:04.888	2026-03-10 15:41:04.888
\.


--
-- Data for Name: ItemAddon; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."ItemAddon" (id, "itemId", name, price) FROM stdin;
987026e1-18d8-40e9-beb0-477e26d50e78	728fb75e-a0ec-4108-8a38-76eed2820ed4	Extra Cheese	60
66c743bf-79d7-4da3-aa09-6e1ea7bbc73f	728fb75e-a0ec-4108-8a38-76eed2820ed4	Black Olives	40
75e2c558-cf59-491a-b723-0ad069757819	728fb75e-a0ec-4108-8a38-76eed2820ed4	Jalapenos	40
12eabc4a-431e-4830-b4cb-beff41514951	728fb75e-a0ec-4108-8a38-76eed2820ed4	Red Paprika	40
93173619-fbfe-40f9-a3ef-f76447a320fc	728fb75e-a0ec-4108-8a38-76eed2820ed4	Golden Corn	40
53867cb4-a72e-4dfc-95d5-ca42eafaed2e	adeddace-bfbb-4c17-8db2-7b90a6b1349c	Extra Cheese	60
33260ce3-70d3-4b5d-8823-6aed8f6b91e6	adeddace-bfbb-4c17-8db2-7b90a6b1349c	Black Olives	40
9adbf794-f553-4abb-ba8b-11879d6de569	adeddace-bfbb-4c17-8db2-7b90a6b1349c	Jalapenos	40
fe7e3d2c-e481-46fc-833f-ebc7280563b4	adeddace-bfbb-4c17-8db2-7b90a6b1349c	Red Paprika	40
5076ead8-5e88-4300-ade0-9354a4a957be	adeddace-bfbb-4c17-8db2-7b90a6b1349c	Golden Corn	40
2c1da584-6e5c-484b-b2f3-931a69216d61	89312b71-c52c-4ef5-b5e7-01afb0a4e338	Extra Cheese	60
7826ba7b-bdf7-45e1-af62-d48d394432ae	89312b71-c52c-4ef5-b5e7-01afb0a4e338	Black Olives	40
12f19bd5-1d06-4103-8fc3-83445362795d	89312b71-c52c-4ef5-b5e7-01afb0a4e338	Jalapenos	40
8977123f-d5ad-452a-a3c1-8a53409c449c	89312b71-c52c-4ef5-b5e7-01afb0a4e338	Red Paprika	40
ffe69639-157b-4bf0-810f-f834eafbc01c	89312b71-c52c-4ef5-b5e7-01afb0a4e338	Golden Corn	40
f946abd3-6be0-401a-94df-cd7d8f17366a	430267ad-4686-4095-8753-c4ca07520ead	Extra Cheese	60
2553d0ae-b8da-4228-bada-dad8e0c19e09	430267ad-4686-4095-8753-c4ca07520ead	Black Olives	40
57b8de47-e4be-43ee-9f43-be383d513333	430267ad-4686-4095-8753-c4ca07520ead	Jalapenos	40
792f3aab-6a80-4e8d-b67f-69c73bf4177f	430267ad-4686-4095-8753-c4ca07520ead	Red Paprika	40
c8c71721-e7c5-401c-bab7-a63605abcec0	430267ad-4686-4095-8753-c4ca07520ead	Golden Corn	40
64c9fcc7-657a-4026-a6a4-0830baf6664c	5a4cc722-3610-47d9-9fae-5ab077eed058	Extra Cheese	60
956ee29f-6be4-4bbf-ad36-de49e8b825cf	5a4cc722-3610-47d9-9fae-5ab077eed058	Black Olives	40
db5f4cf9-2cb9-4fe0-a761-29cdc932a514	5a4cc722-3610-47d9-9fae-5ab077eed058	Jalapenos	40
26d9ad5d-e0d1-48c4-84e0-f9f2d928b5f2	5a4cc722-3610-47d9-9fae-5ab077eed058	Red Paprika	40
d6353790-f5c7-43e7-9608-34c3489a0e32	5a4cc722-3610-47d9-9fae-5ab077eed058	Golden Corn	40
4457e31c-10fc-4a96-9958-dd92d76b9dc7	e9d8dd65-6df1-4404-9e47-1b45c1e6773b	Extra Cheese	60
c294db96-ca10-46eb-ad6c-699edb144b84	e9d8dd65-6df1-4404-9e47-1b45c1e6773b	Black Olives	40
5eb63639-efe8-4bb9-bf4b-ae5999dffd68	e9d8dd65-6df1-4404-9e47-1b45c1e6773b	Jalapenos	40
249550e2-6d71-4bcc-9ec4-35a306968d0a	e9d8dd65-6df1-4404-9e47-1b45c1e6773b	Red Paprika	40
3021898e-d8c6-49b1-94ec-a7572800d7a5	e9d8dd65-6df1-4404-9e47-1b45c1e6773b	Golden Corn	40
5dfd6f0e-3874-4577-b15f-a1cc4036e5d4	495fd9b6-5aa1-4743-b9bc-ea679c574a0f	Extra Cheese	60
43ae2342-cb72-48a1-a034-d2dc70cbc4d1	495fd9b6-5aa1-4743-b9bc-ea679c574a0f	Black Olives	40
759a9a4c-2404-4884-84c8-31e2c03934ec	495fd9b6-5aa1-4743-b9bc-ea679c574a0f	Jalapenos	40
b409c576-f6cd-4be4-aa87-b6f2f8ca506d	495fd9b6-5aa1-4743-b9bc-ea679c574a0f	Red Paprika	40
38f8d3b0-80a9-4cb8-8ace-e344df8ce8dc	495fd9b6-5aa1-4743-b9bc-ea679c574a0f	Golden Corn	40
cc3ba7a3-2f55-4f91-ac04-29a63053f41a	00ccd9f8-55a6-4442-92b0-6e839cf059a2	Extra Cheese	60
54986d71-7270-4e45-af3e-4e7c1d220b94	00ccd9f8-55a6-4442-92b0-6e839cf059a2	Black Olives	40
6e9bc158-0b8c-4de4-98e7-793a25195138	00ccd9f8-55a6-4442-92b0-6e839cf059a2	Jalapenos	40
c9895ff4-1b44-4f88-bab3-65fe6a200afc	00ccd9f8-55a6-4442-92b0-6e839cf059a2	Red Paprika	40
28901c80-5a26-4744-a337-55d2339c24a4	00ccd9f8-55a6-4442-92b0-6e839cf059a2	Golden Corn	40
56fb1292-b60f-4d69-b739-f32906e104e8	69743ebc-a138-401c-b372-295e52d0cd71	Extra Cheese	60
f31b2823-d5cd-4f28-900b-1c0150db1e79	69743ebc-a138-401c-b372-295e52d0cd71	Black Olives	40
ceb7171c-32e7-4a43-a083-0277a8be1993	69743ebc-a138-401c-b372-295e52d0cd71	Jalapenos	40
dc5f070a-ad5b-46e0-988b-dbafc098561e	69743ebc-a138-401c-b372-295e52d0cd71	Red Paprika	40
d4f944aa-1ff1-419c-bacf-da78a54e9188	69743ebc-a138-401c-b372-295e52d0cd71	Golden Corn	40
976aa650-53fe-42a2-b865-5f3ed82b1e4b	15da11f3-a7c8-4628-b735-d6fa10a3e73d	Extra Cheese	60
585e2a3c-0ac6-4a3a-99a0-f2cbba62905a	15da11f3-a7c8-4628-b735-d6fa10a3e73d	Black Olives	40
2a02b3fd-f92a-44f2-b0d5-976110847f77	15da11f3-a7c8-4628-b735-d6fa10a3e73d	Jalapenos	40
4e1a3d98-9adf-4fbf-b700-b120ebe79af0	15da11f3-a7c8-4628-b735-d6fa10a3e73d	Red Paprika	40
ee6d3dbb-2a26-4310-936b-21f207e086c5	15da11f3-a7c8-4628-b735-d6fa10a3e73d	Golden Corn	40
89c5367b-5d33-4d75-9ae9-4916b44d7f76	13c4353a-4a55-482c-8094-3dbccf59fce0	Extra Cheese	60
6a8af6dc-5064-475d-8428-ef915b6ac70d	13c4353a-4a55-482c-8094-3dbccf59fce0	Black Olives	40
899be9e2-73fc-42ad-9104-def276092c52	13c4353a-4a55-482c-8094-3dbccf59fce0	Jalapenos	40
cef79940-a631-4421-8bb2-7a845dfac81b	13c4353a-4a55-482c-8094-3dbccf59fce0	Red Paprika	40
cdd7b650-5ef6-4ad6-a523-c4663cde9879	13c4353a-4a55-482c-8094-3dbccf59fce0	Golden Corn	40
822cbb3a-f290-4c5d-8720-dbda4fd5161e	4ecb89a3-110a-4841-936d-d94a5625f460	Extra Cheese	60
c7164ffe-f9de-4311-98a3-ee487e56a45f	4ecb89a3-110a-4841-936d-d94a5625f460	Black Olives	40
95f8da79-1c68-4513-af56-225a90775e6b	4ecb89a3-110a-4841-936d-d94a5625f460	Jalapenos	40
ac50c877-883b-4d91-9088-e9d56efd6cf0	4ecb89a3-110a-4841-936d-d94a5625f460	Red Paprika	40
79248835-c8d8-48f3-a570-f4066fc1e1a2	4ecb89a3-110a-4841-936d-d94a5625f460	Golden Corn	40
66e60d41-3241-43cc-adb1-edbba974f1f8	83227007-4a4a-4c49-97bf-0be15f1a0470	Extra Cheese	60
8691d4be-f4b1-40fa-83b2-9d6b33b17966	83227007-4a4a-4c49-97bf-0be15f1a0470	Black Olives	40
dbe4d16f-b0b1-4e78-a017-99659da08917	83227007-4a4a-4c49-97bf-0be15f1a0470	Jalapenos	40
4dfd2acf-57b6-4306-968a-d42ece1ae081	83227007-4a4a-4c49-97bf-0be15f1a0470	Red Paprika	40
4e48ba91-6c6c-4908-8b78-3ab58836e2f3	83227007-4a4a-4c49-97bf-0be15f1a0470	Golden Corn	40
c6de8403-c7d8-4312-a6a4-eb7b3ccde13d	a448dc7f-796f-4a02-983a-44d1df3f721a	Extra Cheese	60
c72234c3-6a42-4535-81bd-e1d089ec3ae9	a448dc7f-796f-4a02-983a-44d1df3f721a	Black Olives	40
5b2dd2c9-696f-48b7-8f30-b34a603d7eb2	a448dc7f-796f-4a02-983a-44d1df3f721a	Jalapenos	40
c9f823e0-a128-4269-98e7-2ccbe7d04fb7	a448dc7f-796f-4a02-983a-44d1df3f721a	Red Paprika	40
36521adc-1738-488a-b1ed-8ca9b91759bf	a448dc7f-796f-4a02-983a-44d1df3f721a	Golden Corn	40
d26da540-350f-412a-a55f-3401b770ecb6	5c194a09-aebc-414d-ba59-463591c947e5	Extra Cheese	60
3f91bc3a-b2be-4247-b982-36c3defc6095	5c194a09-aebc-414d-ba59-463591c947e5	Black Olives	40
9f006fae-e7c0-4567-93dc-013a5e01a763	5c194a09-aebc-414d-ba59-463591c947e5	Jalapenos	40
36c9a0cc-6b11-4f23-b381-3b4af6bafe99	5c194a09-aebc-414d-ba59-463591c947e5	Red Paprika	40
dc4622d2-99eb-46a4-afcb-c60d2ac959c2	5c194a09-aebc-414d-ba59-463591c947e5	Golden Corn	40
e0811838-0e1c-44f6-a6b9-f89be2d4a10f	4a5cd383-6372-427e-a679-72c97fe76d51	Extra Cheese	60
d97b3456-087c-4312-a4e5-609b37c34cfb	4a5cd383-6372-427e-a679-72c97fe76d51	Black Olives	40
a3dc7a4f-fe4d-41c2-8728-b0b19ab7f1b9	4a5cd383-6372-427e-a679-72c97fe76d51	Jalapenos	40
e9facd0f-5577-435e-95dd-8b213514b528	4a5cd383-6372-427e-a679-72c97fe76d51	Red Paprika	40
37b5f4c3-de56-487a-b8c6-939b8b7b71ac	4a5cd383-6372-427e-a679-72c97fe76d51	Golden Corn	40
e14c403b-4de5-4fd7-9dbe-8c084498fbd3	60184490-b2f4-4442-8800-9f43270956c7	Extra Cheese	60
61122772-bb08-4cca-a3db-031650723ea6	60184490-b2f4-4442-8800-9f43270956c7	Black Olives	40
edc14764-9470-4b19-8c7d-12e0eb5367f0	60184490-b2f4-4442-8800-9f43270956c7	Jalapenos	40
9864532c-840b-4706-929d-dec57db9ca06	60184490-b2f4-4442-8800-9f43270956c7	Red Paprika	40
8a2958a7-b34c-45dc-b4d2-12e7d479cbe9	60184490-b2f4-4442-8800-9f43270956c7	Golden Corn	40
c89c38b2-7673-4391-bfd2-8713ffe6c217	f5decb18-fa54-41f2-9960-73ab76be9307	Extra Cheese	60
7a074e91-453f-435c-b2e7-16cfa2bd15f0	f5decb18-fa54-41f2-9960-73ab76be9307	Black Olives	40
7f5b2b2d-a5af-44fb-a245-51356e550e1f	f5decb18-fa54-41f2-9960-73ab76be9307	Jalapenos	40
6ed5a3fb-6680-4861-9120-6cb485359482	f5decb18-fa54-41f2-9960-73ab76be9307	Red Paprika	40
18edfcbb-5cb1-4f05-82a8-54e1d892bdd7	f5decb18-fa54-41f2-9960-73ab76be9307	Golden Corn	40
c898c749-b3d3-4377-b42a-56ada162100c	b1492631-87a4-46a4-82c4-fbd46748d67e	Extra Cheese	60
3dd9d223-3055-4656-9062-84245c7f3eb5	b1492631-87a4-46a4-82c4-fbd46748d67e	Black Olives	40
32f4c3e2-e80f-4eee-9cb4-90ab3a9d4f99	b1492631-87a4-46a4-82c4-fbd46748d67e	Jalapenos	40
2025c844-f8ff-4132-a5f0-269814b105f2	b1492631-87a4-46a4-82c4-fbd46748d67e	Red Paprika	40
83f918a2-d09d-42cb-bcfc-a43919ccbcbe	b1492631-87a4-46a4-82c4-fbd46748d67e	Golden Corn	40
681e9e76-cd0a-4f3e-94ef-4e482e5c8c6d	fc9de2d0-9a22-48f7-b7dd-ef2ac1d6cf94	Extra Cheese	60
e5d60fc7-d730-4659-975f-e533396248cf	fc9de2d0-9a22-48f7-b7dd-ef2ac1d6cf94	Black Olives	40
6c59801b-403b-43d5-850a-0c28f3b5c085	fc9de2d0-9a22-48f7-b7dd-ef2ac1d6cf94	Jalapenos	40
ef74235d-dd20-4b7d-a6f3-b464efa05f31	fc9de2d0-9a22-48f7-b7dd-ef2ac1d6cf94	Red Paprika	40
3f2af8b9-fad2-4cd5-ad07-ab653341d319	fc9de2d0-9a22-48f7-b7dd-ef2ac1d6cf94	Golden Corn	40
52081261-7121-443a-bafa-a16c3d22bb69	bb30518e-f1cf-4c4b-ba94-453a831a6488	Extra Cheese	60
a960bb4f-b893-4631-8c9d-abdfa028a29d	bb30518e-f1cf-4c4b-ba94-453a831a6488	Black Olives	40
4952965e-ecec-4c07-a70b-54a06a999271	bb30518e-f1cf-4c4b-ba94-453a831a6488	Jalapenos	40
682d109d-749d-4ba3-a54a-c76535a4a465	bb30518e-f1cf-4c4b-ba94-453a831a6488	Red Paprika	40
bfcc8e24-117d-479d-ae43-964a3cc6abef	bb30518e-f1cf-4c4b-ba94-453a831a6488	Golden Corn	40
b8fbea22-a2e9-4fbe-bfe3-ed3e9d664e1f	fbe78ca1-8f27-4a20-aa50-8241a418507b	Extra Cheese	60
1fee4ebf-cb6e-4b22-8c7c-4c2bc81ab1d4	fbe78ca1-8f27-4a20-aa50-8241a418507b	Black Olives	40
d282c958-2166-4286-98f0-ee2026dfff07	fbe78ca1-8f27-4a20-aa50-8241a418507b	Jalapenos	40
6625152d-2e67-43d4-b5ad-6cc800cbef4e	fbe78ca1-8f27-4a20-aa50-8241a418507b	Red Paprika	40
34022ff5-c59d-4b73-a8b6-de6554ef1e22	fbe78ca1-8f27-4a20-aa50-8241a418507b	Golden Corn	40
9b2c5f33-3b46-47d1-b995-e4dd2c2ed8fb	722f98f8-ba5f-415f-b757-0d84a1d80bb9	Extra Cheese	60
b2a77849-c6e3-40cd-9877-fe04cf1aa126	722f98f8-ba5f-415f-b757-0d84a1d80bb9	Black Olives	40
61a8a1ea-11e7-4901-b280-e7478275e25f	722f98f8-ba5f-415f-b757-0d84a1d80bb9	Jalapenos	40
bbbd60af-7845-4ca9-8968-3abc5615aac0	722f98f8-ba5f-415f-b757-0d84a1d80bb9	Red Paprika	40
a7e319be-0e3f-472b-b823-b5e0b28135a2	722f98f8-ba5f-415f-b757-0d84a1d80bb9	Golden Corn	40
\.


--
-- Data for Name: ItemOption; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."ItemOption" (id, "itemId", name) FROM stdin;
62e9e16e-6094-44d5-849c-5f5ecb586400	728fb75e-a0ec-4108-8a38-76eed2820ed4	Size
c7d12666-f9e6-416b-a2f5-18af8ad13883	728fb75e-a0ec-4108-8a38-76eed2820ed4	Crust
64c852c8-a84d-405b-beb4-01c78ee34d17	adeddace-bfbb-4c17-8db2-7b90a6b1349c	Size
71414247-35e3-4d8b-ae3a-579bb2fc2780	adeddace-bfbb-4c17-8db2-7b90a6b1349c	Crust
32f92ac9-5f72-44e7-9485-dfb93819be2d	89312b71-c52c-4ef5-b5e7-01afb0a4e338	Size
d2ddf3f0-cef4-43ec-ba9f-8097b49df9a9	89312b71-c52c-4ef5-b5e7-01afb0a4e338	Crust
8ea48f77-2ce8-4276-b881-46038901c5ea	430267ad-4686-4095-8753-c4ca07520ead	Size
89dd970f-89b0-4653-9924-1649dbbe3e7c	430267ad-4686-4095-8753-c4ca07520ead	Crust
fd9d1cfe-7692-4ac6-bab6-e897cb59c4f1	5a4cc722-3610-47d9-9fae-5ab077eed058	Size
dc9bb438-d54e-48ff-8eba-a08587364c5f	5a4cc722-3610-47d9-9fae-5ab077eed058	Crust
9d8a6d70-72ef-4b8c-8307-eb4221b2061f	e9d8dd65-6df1-4404-9e47-1b45c1e6773b	Size
e86b3e86-2ec2-4b5c-a61d-24b85be53a43	e9d8dd65-6df1-4404-9e47-1b45c1e6773b	Crust
366111ec-f5ca-4af3-954c-21a372673103	495fd9b6-5aa1-4743-b9bc-ea679c574a0f	Size
c9907dce-44de-4c23-81bf-a096e4896972	495fd9b6-5aa1-4743-b9bc-ea679c574a0f	Crust
cbaa59ba-13e9-4dd8-84c2-18299bd992a0	00ccd9f8-55a6-4442-92b0-6e839cf059a2	Size
ca75cc93-c8a4-4cb5-9c5b-d9ad67bb835e	00ccd9f8-55a6-4442-92b0-6e839cf059a2	Crust
a1f809cb-f798-4882-9d76-1cfcb0db2fdc	69743ebc-a138-401c-b372-295e52d0cd71	Size
868d018d-fb16-4d34-baf0-e4a1a75abc1f	69743ebc-a138-401c-b372-295e52d0cd71	Crust
dec20662-ddbf-4cfd-b6fa-2a486b7ee9db	15da11f3-a7c8-4628-b735-d6fa10a3e73d	Size
0639f0a7-8062-4e86-8766-985d4c034fe1	15da11f3-a7c8-4628-b735-d6fa10a3e73d	Crust
339a2de2-ae4e-4c04-8fe3-188d1c4962bb	13c4353a-4a55-482c-8094-3dbccf59fce0	Size
3cdcebe5-7b4c-402d-a481-e1f8377b8ad4	13c4353a-4a55-482c-8094-3dbccf59fce0	Crust
3d9dbd57-ea2d-44c1-ac08-2a61260bca7d	4ecb89a3-110a-4841-936d-d94a5625f460	Size
f82b13bb-e5bb-4c2d-bd1c-1161d711fd0c	4ecb89a3-110a-4841-936d-d94a5625f460	Crust
e8b67851-d1f4-497d-b0d2-90ace8281169	83227007-4a4a-4c49-97bf-0be15f1a0470	Size
3ecfb49c-4a5a-41c3-ba72-acef3609469c	83227007-4a4a-4c49-97bf-0be15f1a0470	Crust
b2555fae-2b71-46f5-94c2-b739e5f788b9	a448dc7f-796f-4a02-983a-44d1df3f721a	Size
e354a129-85d5-418f-9de2-f13dd2c99a91	a448dc7f-796f-4a02-983a-44d1df3f721a	Crust
3e3896f9-6167-448f-af9b-839edaa5697d	5c194a09-aebc-414d-ba59-463591c947e5	Size
bf2d3f14-4c90-4d22-956d-a27eca616dc8	5c194a09-aebc-414d-ba59-463591c947e5	Crust
a04cff47-5688-420c-a4c9-ef2156a0945d	4a5cd383-6372-427e-a679-72c97fe76d51	Size
02dbe30a-14b1-4e28-992c-ed4600ff26e0	4a5cd383-6372-427e-a679-72c97fe76d51	Crust
8639e5aa-c3df-497d-ab8a-0188a2ca86eb	60184490-b2f4-4442-8800-9f43270956c7	Size
ae170f90-b326-43b0-b339-6afb747e90d6	60184490-b2f4-4442-8800-9f43270956c7	Crust
3fd48626-b4c0-4826-b7d5-f6e9c6639968	f5decb18-fa54-41f2-9960-73ab76be9307	Size
df6b8511-3b5b-4947-92e3-9c37ae3a2133	f5decb18-fa54-41f2-9960-73ab76be9307	Crust
e8139ce2-25e9-44c4-b83f-dc524199ce7c	b1492631-87a4-46a4-82c4-fbd46748d67e	Size
fc33e62f-7733-43d9-9518-5ffdd7ca6d26	b1492631-87a4-46a4-82c4-fbd46748d67e	Crust
4b9ea231-0869-4e66-a387-9f6b70a44a38	fc9de2d0-9a22-48f7-b7dd-ef2ac1d6cf94	Size
29f66a4b-fa31-4313-944d-f78e9b65d33a	fc9de2d0-9a22-48f7-b7dd-ef2ac1d6cf94	Crust
ffa8c7df-2daa-4fe4-8a6b-6bf708dc8a39	bb30518e-f1cf-4c4b-ba94-453a831a6488	Size
32dacba6-e65f-4282-a552-bbe05a01c041	bb30518e-f1cf-4c4b-ba94-453a831a6488	Crust
021d63a0-8724-4fa8-b0f6-de714b5f3427	fbe78ca1-8f27-4a20-aa50-8241a418507b	Size
ffb41c7d-2dee-4933-b19b-607f39acd00e	fbe78ca1-8f27-4a20-aa50-8241a418507b	Crust
807280b8-bc1a-450f-82a7-8c5eac3857f2	722f98f8-ba5f-415f-b757-0d84a1d80bb9	Size
b7b8d9ed-c46d-4269-b7ac-e6817dcba4e0	722f98f8-ba5f-415f-b757-0d84a1d80bb9	Crust
\.


--
-- Data for Name: Location; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Location" (id, name, slug, "seoTitle", "seoDescription", content, "createdAt", "updatedAt") FROM stdin;
106809ed-8f85-44f0-8e04-7f7752b2d100	Prabhat Nagar	best-pizza-in-prabhat-nagar-meerut	Best Pizza in Prabhat Nagar Meerut | Top Rated Local Delivery	Hungry in Prabhat Nagar? Order the best pizza in Prabhat Nagar, Meerut from The Pizza Box. Hand-tossed, fresh ingredients, and lightning-fast delivery. Order now!	\n                <h1>Best Pizza in Prabhat Nagar Meerut</h1>\n                <p>Welcome to **The Pizza Box**, your #1 destination for authentic, mouth-watering pizzas in the heart of Prabhat Nagar. We take pride in being the most-loved local pizza brand, outperforming national chains with our fresh dough and premium toppings.</p>\n                <h2>Why we are the Top Choice in Prabhat Nagar?</h2>\n                <ul>\n                    <li><strong>Freshly Made:</strong> Every pizza is prepared only after you order.</li>\n                    <li><strong>Local Favorite:</strong> Trusted by thousands of residents in Prabhat Nagar.</li>\n                    <li><strong>Fast Delivery:</strong> Hot and fresh pizza at your doorstep within 30 minutes.</li>\n                </ul>\n                <p>Order today and experience the difference!</p>\n            	2026-03-10 15:41:04.712	2026-03-10 15:41:04.712
ffa0036f-98ef-4bcc-9601-bd51f39a7e72	Veg Pizza in Meerut	best-veg-pizza-in-meerut	Best Veg Pizza in Meerut | Fresh & 100% Pure Veg | The Pizza Box	Craving the best veg pizza in Meerut? The Pizza Box offers a wide range of delicious, 100% pure vegetarian pizzas. From Paneer Makhani to Cheese Burst, order online now!	\n                <h1>Best Veg Pizza in Meerut</h1>\n                <p>Searching for "best veg pizza near me"? Look no further! The Pizza Box is Meerut's specialized vegetarian pizza outlet. We use 100% pure vegetarian ingredients to ensure the most authentic taste.</p>\n                <h2>Our Bestselling Veg Pizzas</h2>\n                <p>Our customers swear by our Paneer Tikka Pizza and Veggie Paradise. Loaded with fresh capsicum, onion, tomato, and premium mozzarella cheese.</p>\n            	2026-03-10 15:41:04.715	2026-03-10 15:41:04.715
e9cbf540-4a04-4439-aecc-883beef86cfd	Affordable Pizza Meerut	affordable-pizza-delivery-meerut	Affordable Pizza in Meerut | Best Taste at Low Price	Get high-quality pizza at student-friendly prices. Affordable pizza delivery in Meerut starting at just ₹169. Quality you can trust, price you can afford.	\n                <h1>Affordable Pizza in Meerut</h1>\n                <p>Luxury taste doesn't have to be expensive. At The Pizza Box, we provide the most affordable pizza in Meerut without compromising on quality or hygiene. Perfect for students and families!</p>\n            	2026-03-10 15:41:04.716	2026-03-10 15:41:04.716
d7287f93-591f-409d-84bf-729007051f55	Late Night Pizza Meerut	late-night-pizza-delivery-meerut	Late Night Pizza Delivery Meerut | Midnight Cravings Fixed	Hungry at midnight? We provide the fastest late-night pizza delivery in Meerut. Order hot and fresh pizzas even after 11 PM. Satisfaction guaranteed.	\n                <h1>Late Night Pizza Delivery Meerut</h1>\n                <p>Don't let midnight hunger pangs ruin your vibe. We are Meerut's favorite late-night food partner. Order from our extensive menu and get it delivered hot to your doorstep anywhere in Meerut.</p>\n            	2026-03-10 15:41:04.716	2026-03-10 15:41:04.716
7df14291-51eb-47a4-8a7a-97a0715f2de6	Cheese Burst Pizza Meerut	cheese-burst-pizza-meerut	Extra Loaded Cheese Burst Pizza in Meerut | Order Online	Love extra cheese? Try our signature Cheese Burst Pizza in Meerut. Infused with creamy liquid cheese that overflows with every bite. The ultimate cheesy delight!	\n                <h1>Cheese Burst Pizza Meerut</h1>\n                <p>Experience the ultimate cheese explosion! Our Cheese Burst crust is famous across Meerut for its rich, creamy filling. Whether it's a simple Margherita or a loaded Veggie Island, our regular cheese burst makes it 10x better.</p>\n            	2026-03-10 15:41:04.717	2026-03-10 15:41:04.717
5ddc6dd8-1b0d-4d7e-bf32-f2b63ad0c920	Saket	pizza-delivery-saket-meerut	Best Pizza Delivery in Saket Meerut | The Pizza Box	Experience the best pizza delivery in Saket, Meerut. Fast, fresh, and delicious pizzas from The Pizza Box. Order online and get exclusive Saket-only deals!	<h1>Pizza Delivery in Saket</h1><p>Residents of Saket trust The Pizza Box for their weekend cravings. We deliver hot and fresh across Saket with a 30-minute guarantee.</p>	2026-03-10 15:41:04.717	2026-03-10 15:41:04.717
8d816993-f922-49c0-b9d7-3b14ea72b162	Shastri Nagar	pizza-delivery-shastri-nagar-meerut	Best Pizza & Burger Delivery in Shastri Nagar Meerut	Order fresh pizza and juicy burgers in Shastri Nagar, Meerut. Fast home delivery from The Pizza Box. Top rated restaurant in Shastri Nagar.	<h1>Food Delivery in Shastri Nagar</h1><p>Enjoy the best pizzas and burgers in Shastri Nagar. We deliver hot and fresh to your doorstep.</p>	2026-03-10 15:41:04.718	2026-03-10 15:41:04.718
5f47dad7-7770-4cb4-ac10-aeea2207bb43	Ganga Nagar	food-delivery-ganga-nagar-meerut	Online Food Delivery in Ganga Nagar Meerut | The Pizza Box	Craving pizza in Ganga Nagar? The Pizza Box offers the fastest food delivery in Ganga Nagar, Meerut. Order online now!	<h1>Ganga Nagar Food Delivery</h1><p>Serving the residents of Ganga Nagar with delicious meals and quick delivery.</p>	2026-03-10 15:41:04.718	2026-03-10 15:41:04.718
adc4c462-a50d-4228-8a47-e5805eb1f84e	Modipuram	pizza-delivery-modipuram-meerut	Pizza Delivery in Modipuram Meerut | Hot & Fresh	Live in Modipuram? Get piping hot pizzas delivered to your home. Best pizza shop near Modipuram, Meerut.	<h1>Pizza Delivery Modipuram</h1><p>We cover Modipuram and nearby areas. Order your favorite pizza today.</p>	2026-03-10 15:41:04.719	2026-03-10 15:41:04.719
7ee8eb79-7fc6-4890-85e3-9118e8443aae	Defence Colony	defence-colony-meerut-food-delivery	Defence Colony Meerut Food Delivery | Pizza & Snacks	Premium food delivery in Defence Colony, Meerut. Order gourmet pizzas, garlic bread, and more from The Pizza Box.	<h1>Defence Colony Delivery</h1><p>Exclusive delivery service for Defence Colony residents.</p>	2026-03-10 15:41:04.719	2026-03-10 15:41:04.719
8261ab98-7c4b-421f-9a00-22d6d0060ca7	Pallavpuram	pallavpuram-meerut-pizza-delivery	Pizza Delivery in Pallavpuram Phase 1 & 2 Meerut	Serving both Phase 1 and Phase 2 of Pallavpuram. Best pizza delivery service in Pallavpuram, Meerut.	<h1>Pallavpuram Pizza Delivery</h1><p>Fast delivery across Pallavpuram. Try our bestsellers today.</p>	2026-03-10 15:41:04.72	2026-03-10 15:41:04.72
ebdcf6e7-952a-4012-a400-cf77378d8b26	Kanker Khera	kanker-khera-meerut-food-delivery	Food Delivery in Kanker Khera Meerut | Order Online	Order food online in Kanker Khera. We deliver pizzas, burgers, and pastas to Kanker Khera, Meerut.	<h1>Kanker Khera Food Delivery</h1><p>Delicious food delivered to Kanker Khera. Order online now.</p>	2026-03-10 15:41:04.72	2026-03-10 15:41:04.72
016f40c4-2ada-4962-9d93-76143d0b38e3	Meerut Cantt	meerut-cantt-pizza-delivery	Pizza Delivery in Meerut Cantt | The Pizza Box	Serving the Meerut Cantt area with the best pizzas in town. Order online for quick delivery to Cantonment area.	<h1>Meerut Cantt Pizza Delivery</h1><p>We are proud to serve the Meerut Cantonment area with premium quality pizzas.</p>	2026-03-10 15:41:04.72	2026-03-10 15:41:04.72
90f235b3-b216-4730-8560-a20ed4894540	Abulane	abulane-meerut-food-delivery	Food Delivery Abulane Meerut | Pizza & Fast Food	Shopping in Abulane? Order a quick bite or get food delivered to your home in Abulane, Meerut.	<h1>Abulane Food Delivery</h1><p>Quick bites and meal delivery in the heart of Meerut, Abulane.</p>	2026-03-10 15:41:04.722	2026-03-10 15:41:04.722
2b911c90-d1ae-441d-a810-3d0f8d0e718d	Begum Bridge	begum-bridge-meerut-pizza	Pizza Delivery near Begum Bridge Meerut	Hot pizza delivery near Begum Bridge. The Pizza Box is your go-to place for tasty food in central Meerut.	<h1>Begum Bridge Pizza</h1><p>Serving the busy area of Begum Bridge with tasty pizzas.</p>	2026-03-10 15:41:04.723	2026-03-10 15:41:04.723
\.


--
-- Data for Name: NotificationLog; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."NotificationLog" (id, "orderId", channel, event, status, message, metadata, error, "createdAt") FROM stdin;
\.


--
-- Data for Name: OptionChoice; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."OptionChoice" (id, "optionId", name, price) FROM stdin;
967ccc30-69f2-418a-a184-92c609c97189	62e9e16e-6094-44d5-849c-5f5ecb586400	Regular	0
25bbc594-a6ae-4d7b-acab-afd54f7af010	62e9e16e-6094-44d5-849c-5f5ecb586400	Medium	200
3df3eff0-2dc6-4486-8d8f-cc9c61bb26fb	62e9e16e-6094-44d5-849c-5f5ecb586400	Large	400
426dbd67-9b04-4b62-a284-85cede687eb0	c7d12666-f9e6-416b-a2f5-18af8ad13883	New Hand Tossed	0
a3b6a636-1093-4016-9f75-f94b5759b459	c7d12666-f9e6-416b-a2f5-18af8ad13883	Wheat Thin Crust	50
f54074c6-b45c-4ef8-905f-bd84685dda09	c7d12666-f9e6-416b-a2f5-18af8ad13883	Cheese Burst	99
01900520-bf00-4c81-8baf-4c18c2bd619b	c7d12666-f9e6-416b-a2f5-18af8ad13883	Fresh Pan Pizza	50
51d9b5aa-bd6a-4243-8195-06c1a825460b	64c852c8-a84d-405b-beb4-01c78ee34d17	Regular	0
6e0922d9-36be-433b-b9d7-ce1dfd30f4b7	64c852c8-a84d-405b-beb4-01c78ee34d17	Medium	200
cdd113d7-2a75-4009-b9cb-f3cab70dc49a	64c852c8-a84d-405b-beb4-01c78ee34d17	Large	400
ea889488-c1d8-4b2f-9349-46be95152fc4	71414247-35e3-4d8b-ae3a-579bb2fc2780	New Hand Tossed	0
a19ee659-b924-410a-92b2-499ab47dd995	71414247-35e3-4d8b-ae3a-579bb2fc2780	Wheat Thin Crust	50
1c136057-6cf4-46c3-8eab-6f226df80142	71414247-35e3-4d8b-ae3a-579bb2fc2780	Cheese Burst	99
7256d060-4725-46cc-9aaf-1e5d1e293102	71414247-35e3-4d8b-ae3a-579bb2fc2780	Fresh Pan Pizza	50
682c2622-6281-4919-85b4-6505fb598efe	32f92ac9-5f72-44e7-9485-dfb93819be2d	Regular	0
a402c668-f515-47e7-a342-11de9a7bf56d	32f92ac9-5f72-44e7-9485-dfb93819be2d	Medium	200
d2e66ee0-0f28-4b53-8fb3-d3fe3c0eb445	32f92ac9-5f72-44e7-9485-dfb93819be2d	Large	400
260c9c91-f0a0-475a-8e7f-13053871c56f	d2ddf3f0-cef4-43ec-ba9f-8097b49df9a9	New Hand Tossed	0
48fc984e-581a-4629-866a-8e52d08ce779	d2ddf3f0-cef4-43ec-ba9f-8097b49df9a9	Wheat Thin Crust	50
e51744db-0fef-4245-b9f7-82b7bfdd5893	d2ddf3f0-cef4-43ec-ba9f-8097b49df9a9	Cheese Burst	99
1cabbe35-ca68-4938-9aa1-cba85f17bbeb	d2ddf3f0-cef4-43ec-ba9f-8097b49df9a9	Fresh Pan Pizza	50
a2181d5a-f9be-448e-b0ad-ec3041c12351	8ea48f77-2ce8-4276-b881-46038901c5ea	Regular	0
a30aba25-e8d2-4aad-9230-44ddcc79bf25	8ea48f77-2ce8-4276-b881-46038901c5ea	Medium	200
67fd553f-6408-4589-83a3-660c5f3985a4	8ea48f77-2ce8-4276-b881-46038901c5ea	Large	400
d3af0113-ab01-4c61-9cd6-be5da59611cc	89dd970f-89b0-4653-9924-1649dbbe3e7c	New Hand Tossed	0
dd5ec93d-8473-416d-97bd-b301f7b82d7d	89dd970f-89b0-4653-9924-1649dbbe3e7c	Wheat Thin Crust	50
c97571aa-158d-46e3-87e1-e6f8e76d904a	89dd970f-89b0-4653-9924-1649dbbe3e7c	Cheese Burst	99
9522bf5b-7f38-4fd4-afd3-343321d333fa	89dd970f-89b0-4653-9924-1649dbbe3e7c	Fresh Pan Pizza	50
0a70f0a3-3075-474c-8c04-0f6f7cf2c6a1	fd9d1cfe-7692-4ac6-bab6-e897cb59c4f1	Regular	0
8c2b6c9d-7db4-4939-9671-f89342420960	fd9d1cfe-7692-4ac6-bab6-e897cb59c4f1	Medium	200
bb63d3bd-7fab-4da3-adae-c714220be5f9	fd9d1cfe-7692-4ac6-bab6-e897cb59c4f1	Large	400
2b50d191-9dd4-4f86-8060-d62b70614b0d	dc9bb438-d54e-48ff-8eba-a08587364c5f	New Hand Tossed	0
d96201cd-24a0-4b44-8e9c-6492dc2e902a	dc9bb438-d54e-48ff-8eba-a08587364c5f	Wheat Thin Crust	50
993a7030-84cc-4666-9c90-15edffefee25	dc9bb438-d54e-48ff-8eba-a08587364c5f	Cheese Burst	99
8e709148-fcee-4538-ac5c-ba50b6abf65c	dc9bb438-d54e-48ff-8eba-a08587364c5f	Fresh Pan Pizza	50
08269106-547b-4e1a-b351-1c7b377bc250	9d8a6d70-72ef-4b8c-8307-eb4221b2061f	Regular	0
7fe05a95-b19e-45b1-bf91-816cf4d0ae34	9d8a6d70-72ef-4b8c-8307-eb4221b2061f	Medium	200
52438b81-7877-4862-9ba9-a6976a63d1ee	9d8a6d70-72ef-4b8c-8307-eb4221b2061f	Large	400
0efa3308-7f7b-4c47-a0c2-6d69f8540c08	e86b3e86-2ec2-4b5c-a61d-24b85be53a43	New Hand Tossed	0
8f1d9439-1e18-4d3d-8bd2-78df84e29cb1	e86b3e86-2ec2-4b5c-a61d-24b85be53a43	Wheat Thin Crust	50
ba705aa2-7539-4d9c-9a3a-957ccdd3a4eb	e86b3e86-2ec2-4b5c-a61d-24b85be53a43	Cheese Burst	99
33481911-1209-40f4-bf23-a62e8e3d18f3	e86b3e86-2ec2-4b5c-a61d-24b85be53a43	Fresh Pan Pizza	50
e78acc7d-e6a4-4c62-8292-8d354a8e6919	366111ec-f5ca-4af3-954c-21a372673103	Regular	0
6de732c6-0419-4bef-b0bc-e067c590039e	366111ec-f5ca-4af3-954c-21a372673103	Medium	200
38133bd2-cb77-4277-bc8f-eb5d9dc50a3a	366111ec-f5ca-4af3-954c-21a372673103	Large	400
2b17628e-3995-4905-a1c4-f48a24082095	c9907dce-44de-4c23-81bf-a096e4896972	New Hand Tossed	0
a9bce2a9-ea22-4468-8f6f-b16ffac9082c	c9907dce-44de-4c23-81bf-a096e4896972	Wheat Thin Crust	50
a0420df2-8ffc-4de4-9db3-0eb7bdfdf5a8	c9907dce-44de-4c23-81bf-a096e4896972	Cheese Burst	99
3e845e15-f829-48eb-90a6-cb891b4c0dee	c9907dce-44de-4c23-81bf-a096e4896972	Fresh Pan Pizza	50
48bc6485-5221-420e-bb81-eafb44345e45	cbaa59ba-13e9-4dd8-84c2-18299bd992a0	Regular	0
85ee64a5-48a7-46d1-8c47-ec64f8f79267	cbaa59ba-13e9-4dd8-84c2-18299bd992a0	Medium	200
c2902f41-4b20-4606-a5a5-7e0b56edb789	cbaa59ba-13e9-4dd8-84c2-18299bd992a0	Large	400
044cceb1-4557-4ae7-aee8-43d5c02b6dd9	ca75cc93-c8a4-4cb5-9c5b-d9ad67bb835e	New Hand Tossed	0
53425c18-82e5-4bfd-9825-ce03405a8fb0	ca75cc93-c8a4-4cb5-9c5b-d9ad67bb835e	Wheat Thin Crust	50
d4235d25-dc97-400b-aaac-915baa9e9902	ca75cc93-c8a4-4cb5-9c5b-d9ad67bb835e	Cheese Burst	99
1ef3341c-8a7d-4148-80d9-7c4352ff6a9d	ca75cc93-c8a4-4cb5-9c5b-d9ad67bb835e	Fresh Pan Pizza	50
baa6fea3-b262-4098-989b-17eb26c827d5	a1f809cb-f798-4882-9d76-1cfcb0db2fdc	Regular	0
f2fa14f8-d1a4-443c-857e-efe8df90b2cb	a1f809cb-f798-4882-9d76-1cfcb0db2fdc	Medium	200
c41dad38-cec8-4ff6-b302-8e27f363cb10	a1f809cb-f798-4882-9d76-1cfcb0db2fdc	Large	400
4499ab9e-7fb8-4456-aafd-edb1faaf81aa	868d018d-fb16-4d34-baf0-e4a1a75abc1f	New Hand Tossed	0
6efa0e7d-67ae-42eb-a079-b6b0a66c3bb8	868d018d-fb16-4d34-baf0-e4a1a75abc1f	Wheat Thin Crust	50
7c5be760-1989-4bfb-990e-cbc4a1ede63a	868d018d-fb16-4d34-baf0-e4a1a75abc1f	Cheese Burst	99
8d57e5a7-1f36-4fce-8a4c-88f92f52d6b8	868d018d-fb16-4d34-baf0-e4a1a75abc1f	Fresh Pan Pizza	50
5a3f7a57-4574-421a-9681-2c83065760e6	dec20662-ddbf-4cfd-b6fa-2a486b7ee9db	Regular	0
0254feca-608d-42db-85ae-b295176c06ca	dec20662-ddbf-4cfd-b6fa-2a486b7ee9db	Medium	200
b0c79e81-8060-48ad-bf93-335e9d0f2158	dec20662-ddbf-4cfd-b6fa-2a486b7ee9db	Large	400
7b66ce10-1a01-4b9a-bf68-1d12f43180ad	0639f0a7-8062-4e86-8766-985d4c034fe1	New Hand Tossed	0
f1b077b1-a06b-4f70-8107-22caf136d306	0639f0a7-8062-4e86-8766-985d4c034fe1	Wheat Thin Crust	50
2e3075ab-bc40-4bb5-b979-a7c699c23127	0639f0a7-8062-4e86-8766-985d4c034fe1	Cheese Burst	99
59edb35b-0d8e-4717-9c50-6ebb6aba3c74	0639f0a7-8062-4e86-8766-985d4c034fe1	Fresh Pan Pizza	50
82796c06-b0a5-4ce5-b1a5-85fdee62bd32	339a2de2-ae4e-4c04-8fe3-188d1c4962bb	Regular	0
d39dcfc5-0055-47b8-a853-73f7804bfd73	339a2de2-ae4e-4c04-8fe3-188d1c4962bb	Medium	200
52faed79-9615-4af8-b09e-6b53fa48d11a	339a2de2-ae4e-4c04-8fe3-188d1c4962bb	Large	400
c1ff26d6-91e1-4c37-9081-99c099bd842e	3cdcebe5-7b4c-402d-a481-e1f8377b8ad4	New Hand Tossed	0
8d9c8a99-c7db-4ed1-8bd8-62b41f654898	3cdcebe5-7b4c-402d-a481-e1f8377b8ad4	Wheat Thin Crust	50
443a83e3-bddc-4a6d-9be6-22353ddcd932	3cdcebe5-7b4c-402d-a481-e1f8377b8ad4	Cheese Burst	99
1c8627bf-b985-4e4b-92c2-1d6738d9b87e	3cdcebe5-7b4c-402d-a481-e1f8377b8ad4	Fresh Pan Pizza	50
b93d343e-9483-4e9e-a4ac-e2d61647c3f6	3d9dbd57-ea2d-44c1-ac08-2a61260bca7d	Regular	0
c05e9315-adbc-408b-b884-262ccccfd63a	3d9dbd57-ea2d-44c1-ac08-2a61260bca7d	Medium	200
75fa1ebe-9be9-4413-8423-a2c38d09a1e3	3d9dbd57-ea2d-44c1-ac08-2a61260bca7d	Large	400
518d9786-495b-46ca-811f-af0fe6d3234f	f82b13bb-e5bb-4c2d-bd1c-1161d711fd0c	New Hand Tossed	0
0fd081a3-b93f-4598-8e8b-a07551086d97	f82b13bb-e5bb-4c2d-bd1c-1161d711fd0c	Wheat Thin Crust	50
793352a9-fdff-4827-89d2-e1f38dc56f27	f82b13bb-e5bb-4c2d-bd1c-1161d711fd0c	Cheese Burst	99
6b25e515-67d9-438c-8633-de7b66d4b924	f82b13bb-e5bb-4c2d-bd1c-1161d711fd0c	Fresh Pan Pizza	50
d674e709-d4ef-4450-bae8-6633f6d138cb	e8b67851-d1f4-497d-b0d2-90ace8281169	Regular	0
c5d78b18-db3a-4158-958c-a7dd033fbd69	e8b67851-d1f4-497d-b0d2-90ace8281169	Medium	200
48a1e2e5-a4d1-493d-b61b-40a8ab019475	e8b67851-d1f4-497d-b0d2-90ace8281169	Large	400
14bb1858-611f-4165-b3fd-e54c88296478	3ecfb49c-4a5a-41c3-ba72-acef3609469c	New Hand Tossed	0
6085bf36-cf3e-49d4-bfbf-9adc0c6c2152	3ecfb49c-4a5a-41c3-ba72-acef3609469c	Wheat Thin Crust	50
06b6a605-8e67-46f3-9dda-16cbfac13bee	3ecfb49c-4a5a-41c3-ba72-acef3609469c	Cheese Burst	99
601aeadc-0167-4169-a754-84049d65c7d6	3ecfb49c-4a5a-41c3-ba72-acef3609469c	Fresh Pan Pizza	50
39d65271-388f-4f7f-81a5-a27727009556	b2555fae-2b71-46f5-94c2-b739e5f788b9	Regular	0
b4660343-156d-442a-a0e5-9c97b11c9c00	b2555fae-2b71-46f5-94c2-b739e5f788b9	Medium	200
c7639db4-fc75-4e86-951f-526da0ddd4f9	b2555fae-2b71-46f5-94c2-b739e5f788b9	Large	400
b4d95ee5-f96c-4702-98be-37a716226489	e354a129-85d5-418f-9de2-f13dd2c99a91	New Hand Tossed	0
ce5e09e4-f356-4694-9c2b-e141641ccee3	e354a129-85d5-418f-9de2-f13dd2c99a91	Wheat Thin Crust	50
63428b3f-d42d-4159-99d1-2249856be90f	e354a129-85d5-418f-9de2-f13dd2c99a91	Cheese Burst	99
9628f246-c51d-4053-99f1-a83854115a8f	e354a129-85d5-418f-9de2-f13dd2c99a91	Fresh Pan Pizza	50
993dac8b-6d4a-4a8d-8f59-b039a667e40f	3e3896f9-6167-448f-af9b-839edaa5697d	Regular	0
a4fe9a59-7fd1-41c0-9454-8688163e4dee	3e3896f9-6167-448f-af9b-839edaa5697d	Medium	200
7d257292-1708-49b4-9dd2-b449fa73efd4	3e3896f9-6167-448f-af9b-839edaa5697d	Large	400
c26e8a2d-0d0d-454d-8b15-b61383af751b	bf2d3f14-4c90-4d22-956d-a27eca616dc8	New Hand Tossed	0
7bafdfbe-75d0-4f42-a78f-187cf312e321	bf2d3f14-4c90-4d22-956d-a27eca616dc8	Wheat Thin Crust	50
5d233fb0-6c7e-4e1c-8b3a-458a8b2030b6	bf2d3f14-4c90-4d22-956d-a27eca616dc8	Cheese Burst	99
0e17ddaf-716a-4b6e-9336-c0a84a4c3553	bf2d3f14-4c90-4d22-956d-a27eca616dc8	Fresh Pan Pizza	50
89b91c67-f6fe-43f4-b186-34a2438605dc	a04cff47-5688-420c-a4c9-ef2156a0945d	Regular	0
b57ce111-d08e-4427-853e-d88fbc95b421	a04cff47-5688-420c-a4c9-ef2156a0945d	Medium	200
56c8c29f-9f36-4b7c-8236-0c83ab7665ef	a04cff47-5688-420c-a4c9-ef2156a0945d	Large	400
f24e2d69-6954-4e2a-ad22-50df0d3cfcab	02dbe30a-14b1-4e28-992c-ed4600ff26e0	New Hand Tossed	0
5e7b2f73-17d2-47b6-a05a-8fe5b78f1618	02dbe30a-14b1-4e28-992c-ed4600ff26e0	Wheat Thin Crust	50
4d7153de-1cf3-44dd-9709-8edae229a6d2	02dbe30a-14b1-4e28-992c-ed4600ff26e0	Cheese Burst	99
966375c4-1354-4a4a-a959-72fc4b9fcd01	02dbe30a-14b1-4e28-992c-ed4600ff26e0	Fresh Pan Pizza	50
9d6512f5-41ae-4906-a8b5-3cc3f7c30169	8639e5aa-c3df-497d-ab8a-0188a2ca86eb	Regular	0
75a7bb85-010b-4208-95d0-eba4f261f6a3	8639e5aa-c3df-497d-ab8a-0188a2ca86eb	Medium	200
e749edd5-3d8d-4f5f-a803-27a8261258c3	8639e5aa-c3df-497d-ab8a-0188a2ca86eb	Large	400
1ff9ced3-40f1-4457-ab03-eb17496fb925	ae170f90-b326-43b0-b339-6afb747e90d6	New Hand Tossed	0
22c936ca-1ae1-4bdf-b802-d06db1b3fc43	ae170f90-b326-43b0-b339-6afb747e90d6	Wheat Thin Crust	50
6517223b-18f8-4ba3-be21-7590bf535011	ae170f90-b326-43b0-b339-6afb747e90d6	Cheese Burst	99
3b1d3395-4ca5-4d64-ac48-6c496cc1723c	ae170f90-b326-43b0-b339-6afb747e90d6	Fresh Pan Pizza	50
a9cd68d8-e233-4581-9da7-f83bea5569a4	3fd48626-b4c0-4826-b7d5-f6e9c6639968	Regular	0
aaead6f4-ed62-462d-a2b5-02ec07c65b0d	3fd48626-b4c0-4826-b7d5-f6e9c6639968	Medium	200
4c7d228c-f332-4993-800d-2a6b3f289c2b	3fd48626-b4c0-4826-b7d5-f6e9c6639968	Large	400
bf24365a-dcf5-44fa-9658-ad49966e5c41	df6b8511-3b5b-4947-92e3-9c37ae3a2133	New Hand Tossed	0
eb9f3f20-7bb4-40c3-8f02-74d1e2b03dcb	df6b8511-3b5b-4947-92e3-9c37ae3a2133	Wheat Thin Crust	50
aa4b27a9-f1c7-43b4-829c-9f2fd0bb89cb	df6b8511-3b5b-4947-92e3-9c37ae3a2133	Cheese Burst	99
052e0d5a-fd67-4a0a-b5ef-65b1f2122efd	df6b8511-3b5b-4947-92e3-9c37ae3a2133	Fresh Pan Pizza	50
8e83103c-1200-4aa7-9d9a-13cc27b781d9	e8139ce2-25e9-44c4-b83f-dc524199ce7c	Regular	0
e1372e2c-e61f-4d78-8040-87b3d151d26d	e8139ce2-25e9-44c4-b83f-dc524199ce7c	Medium	200
baea9506-bc8c-4e87-a3ae-37500378dea4	e8139ce2-25e9-44c4-b83f-dc524199ce7c	Large	400
c4a20b50-90d1-4672-b7e7-356b987d977b	fc33e62f-7733-43d9-9518-5ffdd7ca6d26	New Hand Tossed	0
eb08ddeb-b4d2-497e-804a-1f1f8d9301a6	fc33e62f-7733-43d9-9518-5ffdd7ca6d26	Wheat Thin Crust	50
7e4e8fe4-ef9e-4fe6-b3ef-79d0af3f7c06	fc33e62f-7733-43d9-9518-5ffdd7ca6d26	Cheese Burst	99
9edaba24-e99d-42dd-9116-2e84ecb34884	fc33e62f-7733-43d9-9518-5ffdd7ca6d26	Fresh Pan Pizza	50
a11e7534-15c3-4870-a7b0-b54b05b0c9d6	4b9ea231-0869-4e66-a387-9f6b70a44a38	Regular	0
9c64b2aa-80b3-48c0-97aa-05924a32824f	4b9ea231-0869-4e66-a387-9f6b70a44a38	Medium	200
a6b8ac2e-f62e-4edf-b04f-38a949110356	4b9ea231-0869-4e66-a387-9f6b70a44a38	Large	400
53bf6941-48d0-455f-a0a3-a9d5af162ec4	29f66a4b-fa31-4313-944d-f78e9b65d33a	New Hand Tossed	0
2a9e858e-80e8-44fc-bcc4-6e14d7dd8278	29f66a4b-fa31-4313-944d-f78e9b65d33a	Wheat Thin Crust	50
9708e1c9-1ab2-4574-a272-104fa7128ac4	29f66a4b-fa31-4313-944d-f78e9b65d33a	Cheese Burst	99
15d3129b-24d6-4da2-bca9-925912328d22	29f66a4b-fa31-4313-944d-f78e9b65d33a	Fresh Pan Pizza	50
43140456-ffa9-4700-b468-877cc71b8359	ffa8c7df-2daa-4fe4-8a6b-6bf708dc8a39	Regular	0
9bde65ab-6bd2-4ed3-9c23-2eaf359dcd83	ffa8c7df-2daa-4fe4-8a6b-6bf708dc8a39	Medium	200
df98ba7e-a928-4c4c-ae67-e4dbff6f5071	ffa8c7df-2daa-4fe4-8a6b-6bf708dc8a39	Large	400
d7a41046-8e8c-422b-ac50-5e076e53786e	32dacba6-e65f-4282-a552-bbe05a01c041	New Hand Tossed	0
77d106e1-c240-480b-8a57-f8459c0e2dba	32dacba6-e65f-4282-a552-bbe05a01c041	Wheat Thin Crust	50
c9995ff6-e5c8-4926-a947-b152ee351728	32dacba6-e65f-4282-a552-bbe05a01c041	Cheese Burst	99
12bd736f-3a5b-49a2-a843-bb79709dbb60	32dacba6-e65f-4282-a552-bbe05a01c041	Fresh Pan Pizza	50
bc1f448b-dddb-4fb0-9169-96543fb62256	021d63a0-8724-4fa8-b0f6-de714b5f3427	Regular	0
76171b60-e72a-4147-97b8-6a767a68f7f6	021d63a0-8724-4fa8-b0f6-de714b5f3427	Medium	200
0059c6d8-22e0-47f9-b813-a632f687f5ee	021d63a0-8724-4fa8-b0f6-de714b5f3427	Large	400
06f77acf-7bf0-4e0c-9082-ec06045a553b	ffb41c7d-2dee-4933-b19b-607f39acd00e	New Hand Tossed	0
847135e3-ab67-40c1-ae29-b3f9e77162e9	ffb41c7d-2dee-4933-b19b-607f39acd00e	Wheat Thin Crust	50
2ee620ba-16f1-4786-b8cb-08a7f5e6a6f6	ffb41c7d-2dee-4933-b19b-607f39acd00e	Cheese Burst	99
dbd62660-6958-4d7c-ab7b-45ea9394c1ba	ffb41c7d-2dee-4933-b19b-607f39acd00e	Fresh Pan Pizza	50
2965961e-412e-4944-b5f4-7964fdf5b9d0	807280b8-bc1a-450f-82a7-8c5eac3857f2	Regular	0
01712c8e-4e26-4bcb-bcdc-89c0959c2116	807280b8-bc1a-450f-82a7-8c5eac3857f2	Medium	200
5d0cfc8a-b884-4416-b9a1-8bd3c92680dc	807280b8-bc1a-450f-82a7-8c5eac3857f2	Large	400
1bf3cbd1-3443-41c3-bfb1-364d0a67db59	b7b8d9ed-c46d-4269-b7ac-e6817dcba4e0	New Hand Tossed	0
9aeb20ed-18b0-4276-b60c-1248826e62c4	b7b8d9ed-c46d-4269-b7ac-e6817dcba4e0	Wheat Thin Crust	50
83d8305c-c088-4694-9f23-f59082b267a9	b7b8d9ed-c46d-4269-b7ac-e6817dcba4e0	Cheese Burst	99
4bc60657-46ce-48e7-9ea3-c5dccd051a97	b7b8d9ed-c46d-4269-b7ac-e6817dcba4e0	Fresh Pan Pizza	50
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Order" (id, "orderNumber", "userId", "customerName", "customerPhone", status, total, subtotal, tax, "deliveryFee", "paymentMethod", "paymentStatus", "paymentDetails", instructions, "deliveryPartnerId", "addressId", "createdAt", "updatedAt", "guestAddress", "isRepeated", "repeatedFromOrderId", "scheduledFor", "orderType", "taxBreakup", "invoiceNumber", "invoiceGeneratedAt", "couponCode", "discountAmount") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."OrderItem" (id, "orderId", "itemId", name, price, quantity, options, addons, variants) FROM stdin;
\.


--
-- Data for Name: ReferralTransaction; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."ReferralTransaction" (id, "referrerId", "refereeId", "rewardAmount", "orderValue", status, "createdAt") FROM stdin;
\.


--
-- Data for Name: Refund; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Refund" (id, "orderId", amount, reason, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Settings" (id, "restaurantName", "contactPhone", "contactEmail", address, "minOrderAmount", "operatingHours", "isOpen", "isPaused", "notificationsEnabled", "whatsappEnabled", "smsEnabled", "emailEnabled", "closedMessage", "lastOrderTime", "seoTitle", "seoDescription", "seoOgImage", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Transaction" (id, "orderId", amount, type, status, method, reference, "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."User" (id, email, password, name, role, phone, otp, "otpExpiry", notes, "isVIP", "createdAt", "updatedAt", "referralCode", "referredBy", "referralReward", "totalReferrals", "membershipTier", "membershipPoints", "lifetimeSpending") FROM stdin;
b9aa64f6-ff0f-4981-91d6-222d7b928cec	admin@thepizzabox.com	$2b$10$VUg64G14.Sj35BD/k6Os9.HgGmY4EKzQTLjhKEl17A3nSO9d42OWC	Admin User	ADMIN	1234567890	\N	\N	\N	f	2026-03-10 15:41:04.691	2026-03-10 15:41:04.691	\N	\N	0	0	BRONZE	0	0
\.


--
-- Data for Name: Variant; Type: TABLE DATA; Schema: public; Owner: isachinsingh
--

COPY public."Variant" (id, "itemId", type, label, price, "isAvailable") FROM stdin;
\.


--
-- Name: Order_orderNumber_seq; Type: SEQUENCE SET; Schema: public; Owner: isachinsingh
--

SELECT pg_catalog.setval('public."Order_orderNumber_seq"', 1, false);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: Branch Branch_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Complaint Complaint_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Complaint"
    ADD CONSTRAINT "Complaint_pkey" PRIMARY KEY (id);


--
-- Name: Coupon Coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Coupon"
    ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY (id);


--
-- Name: DeliveryPartner DeliveryPartner_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."DeliveryPartner"
    ADD CONSTRAINT "DeliveryPartner_pkey" PRIMARY KEY (id);


--
-- Name: DeliveryZone DeliveryZone_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."DeliveryZone"
    ADD CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY (id);


--
-- Name: Enquiry Enquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Enquiry"
    ADD CONSTRAINT "Enquiry_pkey" PRIMARY KEY (id);


--
-- Name: Feedback Feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Feedback"
    ADD CONSTRAINT "Feedback_pkey" PRIMARY KEY (id);


--
-- Name: ItemAddon ItemAddon_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."ItemAddon"
    ADD CONSTRAINT "ItemAddon_pkey" PRIMARY KEY (id);


--
-- Name: ItemOption ItemOption_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."ItemOption"
    ADD CONSTRAINT "ItemOption_pkey" PRIMARY KEY (id);


--
-- Name: Item Item_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_pkey" PRIMARY KEY (id);


--
-- Name: Location Location_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY (id);


--
-- Name: NotificationLog NotificationLog_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."NotificationLog"
    ADD CONSTRAINT "NotificationLog_pkey" PRIMARY KEY (id);


--
-- Name: OptionChoice OptionChoice_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."OptionChoice"
    ADD CONSTRAINT "OptionChoice_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ReferralTransaction ReferralTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."ReferralTransaction"
    ADD CONSTRAINT "ReferralTransaction_pkey" PRIMARY KEY (id);


--
-- Name: Refund Refund_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_pkey" PRIMARY KEY (id);


--
-- Name: Settings Settings_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Settings"
    ADD CONSTRAINT "Settings_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Variant Variant_pkey; Type: CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Variant"
    ADD CONSTRAINT "Variant_pkey" PRIMARY KEY (id);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Coupon_code_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "Coupon_code_key" ON public."Coupon" USING btree (code);


--
-- Name: DeliveryPartner_phone_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "DeliveryPartner_phone_key" ON public."DeliveryPartner" USING btree (phone);


--
-- Name: DeliveryZone_pincode_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "DeliveryZone_pincode_key" ON public."DeliveryZone" USING btree (pincode);


--
-- Name: Feedback_orderId_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "Feedback_orderId_key" ON public."Feedback" USING btree ("orderId");


--
-- Name: Item_slug_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "Item_slug_key" ON public."Item" USING btree (slug);


--
-- Name: Location_slug_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "Location_slug_key" ON public."Location" USING btree (slug);


--
-- Name: Order_invoiceNumber_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "Order_invoiceNumber_key" ON public."Order" USING btree ("invoiceNumber");


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: Refund_orderId_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "Refund_orderId_key" ON public."Refund" USING btree ("orderId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: User_referralCode_key; Type: INDEX; Schema: public; Owner: isachinsingh
--

CREATE UNIQUE INDEX "User_referralCode_key" ON public."User" USING btree ("referralCode");


--
-- Name: Address Address_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Complaint Complaint_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Complaint"
    ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enquiry Enquiry_assignedTo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Enquiry"
    ADD CONSTRAINT "Enquiry_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Feedback Feedback_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Feedback"
    ADD CONSTRAINT "Feedback_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Feedback Feedback_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Feedback"
    ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ItemAddon ItemAddon_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."ItemAddon"
    ADD CONSTRAINT "ItemAddon_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."Item"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ItemOption ItemOption_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."ItemOption"
    ADD CONSTRAINT "ItemOption_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."Item"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Item Item_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: NotificationLog NotificationLog_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."NotificationLog"
    ADD CONSTRAINT "NotificationLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OptionChoice OptionChoice_optionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."OptionChoice"
    ADD CONSTRAINT "OptionChoice_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES public."ItemOption"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_deliveryPartnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES public."DeliveryPartner"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ReferralTransaction ReferralTransaction_refereeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."ReferralTransaction"
    ADD CONSTRAINT "ReferralTransaction_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReferralTransaction ReferralTransaction_referrerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."ReferralTransaction"
    ADD CONSTRAINT "ReferralTransaction_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Refund Refund_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_referredBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_referredBy_fkey" FOREIGN KEY ("referredBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Variant Variant_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isachinsingh
--

ALTER TABLE ONLY public."Variant"
    ADD CONSTRAINT "Variant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."Item"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict HbhoxgHtsGeAcRAX9t2wYp0BQopO73lP0Wx1ZMf9NgrH0TxSZ7KMhLwe68SJUqy

