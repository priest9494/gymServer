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

-- Ограничения на таблицы
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

-- Триггер для протоколирования изменений  'types'
CREATE TABLE types_audit (
    operation varchar(1) NOT NULL,
    stamp timestamp NOT NULL,
    id integer,
    title varchar(50),
    cost integer,
    training smallint
);

CREATE FUNCTION process_types_audit() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO types_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO types_audit SELECT 'U', now(), NEW.*;
            RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO types_audit SELECT 'I', now(), NEW.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$$LANGUAGE plpgsql;

CREATE TRIGGER types_audit
AFTER INSERT OR UPDATE OR DELETE ON types
    FOR EACH ROW EXECUTE PROCEDURE process_types_audit();

-- Триггер для протоколирования изменений  'subs'
CREATE TABLE subs_audit (
    operation varchar(1) NOT NULL,
    stamp timestamp NOT NULL,
    id integer,
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

CREATE FUNCTION process_subs_audit() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO subs_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO subs_audit SELECT 'U', now(), NEW.*;
            RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO subs_audit SELECT 'I', now(), NEW.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$$LANGUAGE plpgsql;

CREATE TRIGGER subs_audit
AFTER INSERT OR UPDATE OR DELETE ON subs
    FOR EACH ROW EXECUTE PROCEDURE process_subs_audit();

-- Триггер для протоколирования изменений  'clients'
CREATE TABLE clients_audit (
    operation varchar(1) NOT NULL,
    stamp timestamp NOT NULL,
    id integer,
    fio varchar(100),
    phone_number varchar(18),
    first_visit_date date,
    how_to_find varchar(16),
    inviter_id varchar(18),
    note varchar(200)
);

CREATE FUNCTION process_clients_audit() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO clients_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO clients_audit SELECT 'U', now(), NEW.*;
            RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO clients_audit SELECT 'I', now(), NEW.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$$LANGUAGE plpgsql;

CREATE TRIGGER clients_audit
AFTER INSERT OR UPDATE OR DELETE ON clients
    FOR EACH ROW EXECUTE PROCEDURE process_clients_audit();

-- Триггер для протоколирования изменений  'payments'
CREATE TABLE payments_audit (
    operation varchar(1) NOT NULL,
    stamp timestamp NOT NULL,
    id integer,
    sub_id integer,
    payment_date date,
    payment_amount integer,
    payment_method varchar(3),
    interest_rate integer
);

CREATE FUNCTION process_payments_audit() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO payments_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO payments_audit SELECT 'U', now(), NEW.*;
            RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO payments_audit SELECT 'I', now(), NEW.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$$LANGUAGE plpgsql;

CREATE TRIGGER payments_audit
AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE PROCEDURE process_payments_audit();

-- Триггер для протоколирования изменений  'trainers'
CREATE TABLE trainers_audit (
    operation varchar(1) NOT NULL,
    stamp timestamp NOT NULL,
    id integer,
    fio varchar(100),
    date_birth date
);

CREATE FUNCTION process_trainers_audit() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO trainers_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO trainers_audit SELECT 'U', now(), NEW.*;
            RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO trainers_audit SELECT 'I', now(), NEW.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$$LANGUAGE plpgsql;

CREATE TRIGGER trainers_audit
AFTER INSERT OR UPDATE OR DELETE ON trainers
    FOR EACH ROW EXECUTE PROCEDURE process_trainers_audit();