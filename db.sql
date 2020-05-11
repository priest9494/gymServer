CREATE DATABASE sport;

DROP TABLE types;
DROP TABLE subs;
DROP TABLE clients;
DROP TABLE payments;
DROP TABLE trainers;

CREATE TABLE types (
    id SERIAL PRIMARY KEY,
    title varchar(50),
    cost integer,
    training smallint
);

CREATE TABLE subs (
    id SERIAL PRIMARY KEY,
    sub_number varchar(13),
    sub_status boolean,
    type_id integer,
    client_id integer,
    trainer_id integer,
    left_to_pay integer,
    begin_date date,
    end_date date,
    training_left smallint,
    start_time time,
    note varchar(200)
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    fio varchar(100),
    phone_number varchar(18),
    first_visit_date date,
    how_to_find varchar(16),
    inviter_id varchar(18),
    note varchar(200)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    sub_id integer,
    payment_date date,
    payment_amount integer,
    payment_method varchar(3),
    interest_rate integer
);

CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    fio varchar(100),
    date_birth date
);

CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    sub_id integer,
    visit_date date, 
    visit_time time
);

ALTER TABLE subs ADD CHECK (type_id > 0);
ALTER TABLE subs ADD CHECK (client_id > 0);
ALTER TABLE subs ADD CHECK (trainer_id > 0);
ALTER TABLE subs ADD CHECK (begin_date < end_date);

ALTER TABLE subs ADD CONSTRAINT membershipfk FOREIGN KEY (client_id)
REFERENCES clients (id) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE subs ADD CONSTRAINT trainerfk FOREIGN KEY (trainer_id)
REFERENCES trainers (id) ON UPDATE NO ACTION ON DELETE SET NULL;

ALTER TABLE subs ADD CONSTRAINT typefk FOREIGN KEY (type_id)
REFERENCES types (id) ON UPDATE NO ACTION ON DELETE SET NULL;

CREATE TABLE types_audit (
    operation varchar(1) NOT NULL,
    stamp timestamp NOT NULL,
    id SERIAL PRIMARY KEY,
    title varchar(50),
    cost integer,
    training smallint
);

CREATE OR REPLACE FUNCTION process_types_audit() RETURNS TRIGGER AS $types_audit$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO emp_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO emp_audit SELECT 'U', now(), NEW.*;
            RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO emp_audit SELECT 'I', now(), NEW.*;
            RETURN NEW;
        END IF;
        RETURN NULL; -- возвращаемое значение для триггера AFTER игнорируется
    END;
$emp_audit$ LANGUAGE plpgsql;

CREATE TRIGGER types_audit
AFTER INSERT OR UPDATE OR DELETE ON types
    FOR EACH ROW EXECUTE PROCEDURE process_types_audit();
