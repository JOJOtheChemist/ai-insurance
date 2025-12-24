--
-- PostgreSQL database dump
--

\restrict zCbdI0WxdONi7WKura22DgnKVpO2Va086cSZdlabX35BX2f39nhlursnu5iNMsj

-- Dumped from database version 15.14 (Homebrew)
-- Dumped by pg_dump version 15.14 (Homebrew)

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
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_sessions (
    id character varying(100) NOT NULL,
    salesperson_id integer NOT NULL,
    title character varying(255),
    summary character varying(500),
    status character varying(50)
);


--
-- Name: client_family; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_family (
    id integer NOT NULL,
    client_id bigint NOT NULL,
    relation character varying(50),
    name character varying(50),
    age integer,
    status character varying(50)
);


--
-- Name: client_family_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.client_family_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: client_family_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.client_family_id_seq OWNED BY public.client_family.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id bigint NOT NULL,
    salesperson_id integer NOT NULL,
    name character varying(50) NOT NULL,
    role character varying(100),
    age integer,
    annual_budget character varying(50),
    marital_status character varying(50),
    annual_income character varying(50),
    location character varying(100),
    risk_factors json,
    needs json,
    resistances json,
    contacts json,
    create_time timestamp without time zone,
    update_time timestamp without time zone,
    proposed_plans json DEFAULT '[]'::json
);


--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: credit_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credit_transactions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    transaction_type character varying(20) NOT NULL,
    amount integer NOT NULL,
    balance_after integer NOT NULL,
    description character varying(255),
    session_id character varying(100),
    token_count integer,
    create_time timestamp with time zone DEFAULT now()
);


--
-- Name: credit_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.credit_transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: credit_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.credit_transactions_id_seq OWNED BY public.credit_transactions.id;


--
-- Name: follow_ups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follow_ups (
    id bigint NOT NULL,
    client_id bigint NOT NULL,
    type character varying(20),
    content text,
    session_id character varying(100),
    create_time timestamp without time zone
);


--
-- Name: follow_ups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.follow_ups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: follow_ups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.follow_ups_id_seq OWNED BY public.follow_ups.id;


--
-- Name: insurance_product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.insurance_product (
    id bigint NOT NULL,
    product_name character varying(100) NOT NULL,
    product_code character varying(50) NOT NULL,
    product_type character varying(50),
    company_name character varying(100),
    min_amount numeric(15,2) DEFAULT 0.00,
    max_amount numeric(15,2) DEFAULT 0.00,
    min_premium numeric(15,2) DEFAULT 0.00,
    max_premium numeric(15,2) DEFAULT 0.00,
    coverage text,
    description character varying(1000),
    details text,
    image_url character varying(255),
    status smallint DEFAULT 1,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tags character varying(500),
    age_range character varying(100),
    insurance_period character varying(100),
    payment_period character varying(100),
    waiting_period character varying(100),
    exclusions text,
    cooling_off_period character varying(100),
    surrender_terms text,
    extend_info jsonb,
    coverage_raw_backup text,
    coverage_structured jsonb
);


--
-- Name: TABLE insurance_product; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.insurance_product IS '保险产品表';


--
-- Name: COLUMN insurance_product.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.id IS '产品ID';


--
-- Name: COLUMN insurance_product.product_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.product_name IS '产品名称';


--
-- Name: COLUMN insurance_product.product_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.product_code IS '产品代码';


--
-- Name: COLUMN insurance_product.product_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.product_type IS '产品类型';


--
-- Name: COLUMN insurance_product.company_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.company_name IS '保险公司';


--
-- Name: COLUMN insurance_product.min_amount; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.min_amount IS '最低保额';


--
-- Name: COLUMN insurance_product.max_amount; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.max_amount IS '最高保额';


--
-- Name: COLUMN insurance_product.min_premium; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.min_premium IS '最低保费';


--
-- Name: COLUMN insurance_product.max_premium; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.max_premium IS '最高保费';


--
-- Name: COLUMN insurance_product.coverage; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.coverage IS '保障范围';


--
-- Name: COLUMN insurance_product.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.description IS '产品描述';


--
-- Name: COLUMN insurance_product.details; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.details IS '产品详情';


--
-- Name: COLUMN insurance_product.image_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.image_url IS '产品图片URL';


--
-- Name: COLUMN insurance_product.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.status IS '产品状态：0-下架 1-上架';


--
-- Name: COLUMN insurance_product.tags; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.tags IS '产品标签';


--
-- Name: COLUMN insurance_product.age_range; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.age_range IS '投保年龄';


--
-- Name: COLUMN insurance_product.insurance_period; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.insurance_period IS '保险期间';


--
-- Name: COLUMN insurance_product.payment_period; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.payment_period IS '交费期间';


--
-- Name: COLUMN insurance_product.waiting_period; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.waiting_period IS '等待期';


--
-- Name: COLUMN insurance_product.exclusions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.exclusions IS '责任免除';


--
-- Name: COLUMN insurance_product.cooling_off_period; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.cooling_off_period IS '犹豫期';


--
-- Name: COLUMN insurance_product.surrender_terms; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.surrender_terms IS '退保说明';


--
-- Name: COLUMN insurance_product.extend_info; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_product.extend_info IS '扩展信息(JSON格式)';


--
-- Name: insurance_product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.insurance_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: insurance_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.insurance_product_id_seq OWNED BY public.insurance_product.id;


--
-- Name: insurance_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.insurance_rates (
    id bigint NOT NULL,
    product_name character varying(200) NOT NULL,
    age integer,
    gender character varying(10),
    premium_term integer,
    premium_due integer,
    health_status character varying(50),
    payment_frequency character varying(50),
    payment_factor numeric(10,2),
    plan character varying(50),
    premium_value numeric(15,2),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE insurance_rates; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.insurance_rates IS '保险产品费率表';


--
-- Name: COLUMN insurance_rates.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.id IS '费率ID';


--
-- Name: COLUMN insurance_rates.product_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.product_name IS '产品名称';


--
-- Name: COLUMN insurance_rates.age; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.age IS '年龄';


--
-- Name: COLUMN insurance_rates.gender; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.gender IS '性别';


--
-- Name: COLUMN insurance_rates.premium_term; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.premium_term IS '缴费期限';


--
-- Name: COLUMN insurance_rates.premium_due; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.premium_due IS '缴费年限';


--
-- Name: COLUMN insurance_rates.health_status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.health_status IS '健康状况 (standard/substandard)';


--
-- Name: COLUMN insurance_rates.payment_frequency; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.payment_frequency IS '缴费频率 (annual/semi_annual/quarterly/monthly)';


--
-- Name: COLUMN insurance_rates.payment_factor; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.payment_factor IS '缴费系数';


--
-- Name: COLUMN insurance_rates.plan; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.plan IS '计划类型';


--
-- Name: COLUMN insurance_rates.premium_value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.premium_value IS '保费值';


--
-- Name: COLUMN insurance_rates.create_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.create_time IS '创建时间';


--
-- Name: COLUMN insurance_rates.update_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.insurance_rates.update_time IS '更新时间';


--
-- Name: insurance_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.insurance_rates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: insurance_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.insurance_rates_id_seq OWNED BY public.insurance_rates.id;


--
-- Name: invite_code; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invite_code (
    id bigint NOT NULL,
    code character varying(64) NOT NULL,
    is_used boolean,
    used_by bigint,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: invite_code_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.invite_code_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: invite_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.invite_code_id_seq OWNED BY public.invite_code.id;


--
-- Name: remarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.remarks (
    id integer NOT NULL,
    target_id character varying NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: remarks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.remarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: remarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.remarks_id_seq OWNED BY public.remarks.id;


--
-- Name: session_client_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session_client_links (
    id integer NOT NULL,
    session_id character varying(100) NOT NULL,
    client_id bigint NOT NULL
);


--
-- Name: session_client_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.session_client_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: session_client_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.session_client_links_id_seq OWNED BY public.session_client_links.id;


--
-- Name: user_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profile (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    profile_visibility character varying(20),
    allow_follow smallint,
    show_study_stats smallint,
    email_notification smallint,
    push_notification smallint,
    theme character varying(20),
    language character varying(10),
    timezone character varying(50),
    create_time timestamp with time zone DEFAULT now(),
    update_time timestamp with time zone DEFAULT now()
);


--
-- Name: user_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_profile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_profile_id_seq OWNED BY public.user_profile.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    invite_code character varying(50),
    is_active boolean,
    is_superuser boolean,
    create_time timestamp with time zone DEFAULT now(),
    update_time timestamp with time zone DEFAULT now(),
    balance integer DEFAULT 30
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: client_family id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_family ALTER COLUMN id SET DEFAULT nextval('public.client_family_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: credit_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions ALTER COLUMN id SET DEFAULT nextval('public.credit_transactions_id_seq'::regclass);


--
-- Name: follow_ups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_ups ALTER COLUMN id SET DEFAULT nextval('public.follow_ups_id_seq'::regclass);


--
-- Name: insurance_product id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_product ALTER COLUMN id SET DEFAULT nextval('public.insurance_product_id_seq'::regclass);


--
-- Name: insurance_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_rates ALTER COLUMN id SET DEFAULT nextval('public.insurance_rates_id_seq'::regclass);


--
-- Name: invite_code id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invite_code ALTER COLUMN id SET DEFAULT nextval('public.invite_code_id_seq'::regclass);


--
-- Name: remarks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.remarks ALTER COLUMN id SET DEFAULT nextval('public.remarks_id_seq'::regclass);


--
-- Name: session_client_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_client_links ALTER COLUMN id SET DEFAULT nextval('public.session_client_links_id_seq'::regclass);


--
-- Name: user_profile id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile ALTER COLUMN id SET DEFAULT nextval('public.user_profile_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: chat_sessions chat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_pkey PRIMARY KEY (id);


--
-- Name: client_family client_family_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_family
    ADD CONSTRAINT client_family_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: credit_transactions credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (id);


--
-- Name: follow_ups follow_ups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_ups
    ADD CONSTRAINT follow_ups_pkey PRIMARY KEY (id);


--
-- Name: insurance_product insurance_product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_product
    ADD CONSTRAINT insurance_product_pkey PRIMARY KEY (id);


--
-- Name: insurance_product insurance_product_product_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_product
    ADD CONSTRAINT insurance_product_product_code_key UNIQUE (product_code);


--
-- Name: insurance_rates insurance_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_rates
    ADD CONSTRAINT insurance_rates_pkey PRIMARY KEY (id);


--
-- Name: invite_code invite_code_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invite_code
    ADD CONSTRAINT invite_code_pkey PRIMARY KEY (id);


--
-- Name: remarks remarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.remarks
    ADD CONSTRAINT remarks_pkey PRIMARY KEY (id);


--
-- Name: session_client_links session_client_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_client_links
    ADD CONSTRAINT session_client_links_pkey PRIMARY KEY (id);


--
-- Name: user_profile user_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_credit_transactions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions USING btree (user_id);


--
-- Name: idx_insurance_product_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insurance_product_company ON public.insurance_product USING btree (company_name);


--
-- Name: idx_insurance_product_desc_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insurance_product_desc_trgm ON public.insurance_product USING gin (description public.gin_trgm_ops);


--
-- Name: idx_insurance_product_description_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insurance_product_description_trgm ON public.insurance_product USING gin (description public.gin_trgm_ops);


--
-- Name: idx_insurance_product_extend_info_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insurance_product_extend_info_trgm ON public.insurance_product USING gin (((extend_info)::text) public.gin_trgm_ops);


--
-- Name: idx_insurance_product_name_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insurance_product_name_trgm ON public.insurance_product USING gin (product_name public.gin_trgm_ops);


--
-- Name: idx_insurance_product_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insurance_product_status ON public.insurance_product USING btree (status);


--
-- Name: idx_insurance_product_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insurance_product_type ON public.insurance_product USING btree (product_type);


--
-- Name: idx_rates_age; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rates_age ON public.insurance_rates USING btree (age);


--
-- Name: idx_rates_gender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rates_gender ON public.insurance_rates USING btree (gender);


--
-- Name: idx_rates_health_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rates_health_status ON public.insurance_rates USING btree (health_status);


--
-- Name: idx_rates_premium_term; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rates_premium_term ON public.insurance_rates USING btree (premium_term);


--
-- Name: idx_rates_product_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rates_product_name ON public.insurance_rates USING btree (product_name);


--
-- Name: ix_chat_sessions_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_chat_sessions_id ON public.chat_sessions USING btree (id);


--
-- Name: ix_client_family_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_client_family_id ON public.client_family USING btree (id);


--
-- Name: ix_clients_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_clients_id ON public.clients USING btree (id);


--
-- Name: ix_credit_transactions_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_credit_transactions_id ON public.credit_transactions USING btree (id);


--
-- Name: ix_credit_transactions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_credit_transactions_user_id ON public.credit_transactions USING btree (user_id);


--
-- Name: ix_follow_ups_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_follow_ups_id ON public.follow_ups USING btree (id);


--
-- Name: ix_invite_code_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_invite_code_code ON public.invite_code USING btree (code);


--
-- Name: ix_invite_code_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_invite_code_id ON public.invite_code USING btree (id);


--
-- Name: ix_remarks_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_remarks_id ON public.remarks USING btree (id);


--
-- Name: ix_remarks_target_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_remarks_target_id ON public.remarks USING btree (target_id);


--
-- Name: ix_session_client_links_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_session_client_links_client_id ON public.session_client_links USING btree (client_id);


--
-- Name: ix_session_client_links_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_session_client_links_id ON public.session_client_links USING btree (id);


--
-- Name: ix_session_client_links_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_session_client_links_session_id ON public.session_client_links USING btree (session_id);


--
-- Name: ix_user_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_user_profile_id ON public.user_profile USING btree (id);


--
-- Name: ix_user_profile_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_user_profile_user_id ON public.user_profile USING btree (user_id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: chat_sessions chat_sessions_salesperson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_salesperson_id_fkey FOREIGN KEY (salesperson_id) REFERENCES public.users(id);


--
-- Name: client_family client_family_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_family
    ADD CONSTRAINT client_family_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);


--
-- Name: clients clients_salesperson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_salesperson_id_fkey FOREIGN KEY (salesperson_id) REFERENCES public.users(id);


--
-- Name: credit_transactions credit_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: follow_ups follow_ups_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_ups
    ADD CONSTRAINT follow_ups_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);


--
-- Name: invite_code invite_code_used_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invite_code
    ADD CONSTRAINT invite_code_used_by_fkey FOREIGN KEY (used_by) REFERENCES public.users(id);


--
-- Name: session_client_links session_client_links_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_client_links
    ADD CONSTRAINT session_client_links_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);


--
-- Name: session_client_links session_client_links_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_client_links
    ADD CONSTRAINT session_client_links_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.chat_sessions(id);


--
-- PostgreSQL database dump complete
--

\unrestrict zCbdI0WxdONi7WKura22DgnKVpO2Va086cSZdlabX35BX2f39nhlursnu5iNMsj

