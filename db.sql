CREATE DATABASE sport;

DROP TABLE types;
DROP TABLE subs;
DROP TABLE clients;
DROP TABLE payments;
DROP TABLE trainers;

CREATE TABLE types (
    id SERIAL PRIMARY KEY,
    title varchar(30),
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

SELECT subs.begin_date, subs.end_date, subs.training_left, subs.left_to_pay, clients.fio, types.title, types.training, types.cost
FROM subs, clients, types
WHERE (subs.type_id = types.id AND subs.client_id = clients.id);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    fio varchar(100),
    phone_number varchar(18),
    first_visit_date date,
    how_to_find varchar(16),
    inviter_id integer,
    note varchar(200),
    photo bytea
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    sub_id integer,
    payment_date date,
    payment_amount integer,
    payment_method varchar(3)
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

ALTER TABLE subs ADD CONSTRAINT membershipfk FOREIGN KEY (client_id) REFERENCES
clients (id) ON UPDATE NO ACTION ON DELETE CASCADE;


INSERT INTO types (title, cost, training) 
    VALUES
        ('Тайский бокс', 1600, 8),
        ('Тайский бокс', 3000, 16),
        ('Кочалочка', 1200, 8);

INSERT INTO payments (sub_id, payment_date, payment_amount, payment_method)
    VALUES
        (2, '20-10-2019', 1200, 'б/н'),
        (3, '20-10-2019', 3500, 'нал'),
        (3, '20-10-2019', 1600, 'б/н');

INSERT INTO trainers (fio, date_birth) 
    VALUES
        ('Тренерова Тренерша Тренеровна', '10-10-2010'),
        ('Занятьева training Занятьевна', '21-12-2013');

INSERT INTO clients (fio, phone_number, first_visit_date, how_to_find, inviter_id, note)
    VALUES
        ('Дунаев Никита Юрьевич', '+7(777)777-77-77', '20-10-2019', '2гис', -1, 'Какое-то note'),
        ('Степанов Мирослав Даниилович', '+7(999)999-99-99', '20-10-2018', 'Яндекс', -1, 'аоаоао'),
        ('Стенаев Никита Мирославочич', '+7(777)999-77-99', '20-10-2014', 'Гугл', 1, '');


INSERT INTO subs (sub_number, type_id, sub_status, client_id, trainer_id, left_to_pay, begin_date, end_date, training_left, start_time, note)
    VALUES
        (01, 1, true, 1, 1, 2500, '20-6-2019', '20-7-2019', 12, '07:00:00', ''),
        (02, 2, true, 2, 1, 2500,'15-1-2019', '15-2-2019', 12, '07:00:00', '111'),
        (03, 3, true, 1, 1, 2500, '06-3-2018', '06-9-2018', 12, '08:00:00', 'asd');


select * from clients;
select * from subs;
select * from trainers;
select * from payments;
select * from types;
