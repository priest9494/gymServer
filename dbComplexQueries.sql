/* Client register: get client info */
SELECT subs.begin_date, subs.end_date, subs.training_left, subs.left_to_pay, clients.fio, types.title, types.training, types.cost
FROM subs, clients, types
WHERE (subs.type_id = types.id AND subs.client_id = clients.id AND subs.sub_number = '1');

/* Client register: mark visit */
UPDATE subs
SET training_left = training_left - 1
WHERE subs.sub_number = '1';