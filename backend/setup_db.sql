DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admissions_user') THEN
      CREATE ROLE admissions_user LOGIN PASSWORD 'admissions_pass';
   END IF;
END
$$;

SELECT 'CREATE DATABASE admissions_db OWNER admissions_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'admissions_db')\gexec

GRANT ALL PRIVILEGES ON DATABASE admissions_db TO admissions_user;
