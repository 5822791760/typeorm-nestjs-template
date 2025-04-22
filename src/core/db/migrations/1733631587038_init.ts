import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
		CREATE SEQUENCE public.users_id_seq
			INCREMENT BY 1
			MINVALUE 1
			MAXVALUE 2147483647
			START WITH 1
			CACHE 1
			NO CYCLE
			OWNED BY NONE;
		CREATE TABLE public.users (
			id integer NOT NULL DEFAULT nextval('public.users_id_seq'::regclass),
			created_at timestamp with time zone NOT NULL DEFAULT now(),
			updated_at timestamp with time zone NOT NULL DEFAULT now(),
			email character varying NOT NULL,
			password character varying NOT NULL,
			CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id)
		);
		CREATE TABLE public.posts (
			id serial NOT NULL,
			title varchar(250) NOT NULL,
			details text DEFAULT '',
			created_at timestamptz NOT NULL DEFAULT now(),
			updated_at timestamptz NOT NULL DEFAULT now(),
			created_by integer,
			CONSTRAINT posts_pk PRIMARY KEY (id)
		);
		ALTER TABLE public.posts ADD CONSTRAINT fk_posts_created_by_users_id FOREIGN KEY (created_by)
		REFERENCES public.users (id) MATCH SIMPLE
		ON DELETE CASCADE ON UPDATE CASCADE;
		ALTER TABLE public.users ADD CONSTRAINT uk_users_email UNIQUE (email);
		ALTER TABLE public.users ADD COLUMN last_signed_in_at timestamptz;
	`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
		ALTER TABLE public.users DROP COLUMN IF EXISTS last_signed_in_at CASCADE;
		ALTER TABLE public.users DROP CONSTRAINT IF EXISTS uk_users_email CASCADE;
		ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS fk_posts_created_by_users_id CASCADE;
		DROP TABLE IF EXISTS public.posts CASCADE;
		DROP TABLE IF EXISTS public.users CASCADE;
		DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE
	`.execute(db);
}
