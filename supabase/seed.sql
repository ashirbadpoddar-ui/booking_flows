insert into public.businesses (id, name, timezone, currency)
values ('10000000-0000-0000-0000-000000000001', 'North & Row', 'Europe/Warsaw', 'PLN');

insert into public.services (id,business_id,name,description,duration_minutes,price,active) values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Signature Haircut','Consultation, precision cut and tailored finish.',45,120,true),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Beard Trim','Shape, line-up and hot towel finish.',30,70,true),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','Hair + Beard','Complete cut and beard service in one visit.',75,175,true),
('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','Wash & Styling','Wash, care treatment and professional styling.',30,80,true),
('20000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001','Style Consultation','Personal advice on cut, care and daily styling.',20,45,true);

insert into public.staff (id,business_id,name,role_title,active) values
('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Marcin Kowalski','Senior barber',true),
('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Lena Wójcik','Stylist',true),
('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','Tomasz Nowak','Barber',true),
('30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','Amelia Zielińska','Master stylist',true);

insert into public.staff_services (staff_id,service_id)
select s.id, v.id from public.staff s cross join public.services v where s.business_id='10000000-0000-0000-0000-000000000001';

insert into public.availability_rules (staff_id,weekday,start_time,end_time)
select s.id, d.weekday, d.start_time, d.end_time from public.staff s cross join (values
(1,'09:00'::time,'18:00'::time),(2,'09:00','18:00'),(3,'10:00','19:00'),(4,'09:00','18:00'),(5,'09:00','19:00'),(6,'09:00','15:00')) as d(weekday,start_time,end_time)
where s.business_id='10000000-0000-0000-0000-000000000001';
