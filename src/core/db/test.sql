-- Diff code generated with pgModeler (PostgreSQL Database Modeler)
-- pgModeler version: 1.1.5
-- Diff date: 2024-12-08 11:19:29
-- Source model: postgres
-- Database: postgres
-- PostgreSQL version: 15.0

-- [ Diff summary ]
-- Dropped objects: 0
-- Created objects: 4
-- Changed objects: 0

SET search_path=public,pg_catalog;
-- ddl-end --


-- [ Created objects ] --
-- object: public.users_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;
CREATE SEQUENCE public.users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.users_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.users | type: TABLE --
-- DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
	id integer NOT NULL DEFAULT nextval('public.users_id_seq'::regclass),
	created_at timestamp with time zone NOT NULL DEFAULT now(),
	updated_at timestamp with time zone NOT NULL DEFAULT now(),
	email character varying NOT NULL,
	password character varying NOT NULL,
	CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id)
);
-- ddl-end --

-- object: public.posts | type: TABLE --
-- DROP TABLE IF EXISTS public.posts CASCADE;
CREATE TABLE public.posts (
	id serial NOT NULL,
	title varchar(250) NOT NULL,
	details text DEFAULT '',
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	created_by integer,
	CONSTRAINT posts_pk PRIMARY KEY (id)
);
-- ddl-end --



-- [ Created foreign keys ] --
-- object: fk_posts_created_by_users_id | type: CONSTRAINT --
-- ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS fk_posts_created_by_users_id CASCADE;
ALTER TABLE public.posts ADD CONSTRAINT fk_posts_created_by_users_id FOREIGN KEY (created_by)
REFERENCES public.users (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE CASCADE;
-- ddl-end --

