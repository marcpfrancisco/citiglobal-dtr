-- ROLE
INSERT INTO role (id, created_at, updated_at, published_at, is_active, name) VALUES (1, NOW(), NOW(), NOW(), 1, 'ROLE_SUPER_ADMIN');
INSERT INTO role (id, created_at, updated_at, published_at, is_active, name) VALUES (2, NOW(), NOW(), NOW(), 1, 'ROLE_ADMIN');
INSERT INTO role (id, created_at, updated_at, published_at, is_active, name) VALUES (3, NOW(), NOW(), NOW(), 1, 'ROLE_USER');

-- SECTION
INSERT INTO section (id, created_at, updated_at, published_at, is_active, name) VALUES (1, NOW(), NOW(), NOW(), 1, 'BT101A');
INSERT INTO section (id, created_at, updated_at, published_at, is_active, name) VALUES (2, NOW(), NOW(), NOW(), 1, 'BT102A');

-- SUBJECT
INSERT INTO subject (id, created_at, updated_at, published_at, is_active, subject_code, description, day, start_time, end_time, grace_period, units, section_id) VALUES (1, NOW(), NOW(), NOW(), 1, 'RTXG', 'SEEDER', 'MONDAY', '08:00', '10:00', '08:15', 3, 1);
INSERT INTO subject (id, created_at, updated_at, published_at, is_active, subject_code, description, day, start_time, end_time, grace_period, units, section_id) VALUES (2, NOW(), NOW(), NOW(), 1, 'GNDR', 'SEEDER', 'MONDAY', '08:00', '10:00', '08:15', 3, 2);
INSERT INTO subject (id, created_at, updated_at, published_at, is_active, subject_code, description, day, start_time, end_time, grace_period, units, section_id) VALUES (3, NOW(), NOW(), NOW(), 1, 'LMQP', 'SEEDER', 'TUESDAY', '08:00', '10:00', '08:15', 3, 2);
INSERT INTO subject (id, created_at, updated_at, published_at, is_active, subject_code, description, day, start_time, end_time, grace_period, units, section_id) VALUES (4, NOW(), NOW(), NOW(), 1, 'ERTX', 'SEEDER', 'WEDNESDAY', '08:00', '10:00', '08:15', 3, 2);

-- -- USER
-- INSERT INTO user (id, created_at, updated_at, published_at, is_active, first_name, middle_name, last_name, mobile_number, student_id, rfid_no, section_id, role_id) VALUES (1, NOW(), NOW(), NOW(), 1, 'JOHN', 'SEEDER', 'DOE', '09123456789', '12345-6789', '1234567', 2, 2);
-- INSERT INTO user (id, created_at, updated_at, published_at, is_active, first_name, middle_name, last_name, mobile_number, student_id, rfid_no, section_id, role_id) VALUES (2, NOW(), NOW(), NOW(), 1, 'MARC', 'PENTATONIX', 'CLAYROE', '09123456789', '123-456', '123456', 2, 3);

-- -- USER LOGIN
-- INSERT INTO user_login (id, created_at, updated_at, username, password) VALUES (1, NOW(), NOW(), 'admin', '$2a$10$6MkbFPutD0h0YVPU9SOv5uFYyapfm5aRta3.UtbJY8wHwS2dogw3q');

