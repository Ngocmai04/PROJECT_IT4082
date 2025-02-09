--Thêm cư dân:
CREATE OR REPLACE FUNCTION add_cu_dan("Họ tên" text,
        	                          "Căn hộ" text,
                                      "Ngày sinh" date,
                                      "SĐT" text,
   								      "Email" text)
RETURNS void AS $$
BEGIN
    	INSERT INTO public."Cư dân"("Họ tên", "Căn hộ","Ngày sinh", "SĐT", "Email")
    	VALUES ("Họ tên", "Căn hộ","Ngày sinh", "SĐT", "Email");
END;
$$ LANGUAGE plpgsql;

--Thêm xe:
CREATE OR REPLACE FUNCTION add_xe("Biển số" text,
                                  "Căn hộ" text,
	                              "Loại xe" text )
RETURNS void AS $$
BEGIN
    	INSERT INTO public."Xe"("Biển số", "Căn hộ", "Loại xe","Trạng thái")
    	VALUES("Biển số", "Căn hộ", "Loại xe", 'In');
END;
$$ LANGUAGE plpgsql;

--Thêm khách:
CREATE OR REPLACE FUNCTION add_khach("Căn hộ" text,
                                     "Họ tên" text,
									 "Ngày sinh" date,
                                     "SĐT" text,
                                     "Email" text,
									 "Thời hạn dịch vụ" date)
RETURNS void AS $$
BEGIN
             	INSERT INTO public."Khách"("Căn hộ","Họ tên","Ngày sinh","SĐT", "Email","Thời hạn dịch vụ")
             	VALUES ("Căn hộ","Họ tên","Ngày sinh","SĐT", "Email","Thời hạn dịch vụ");
             	exception when unique_violation then raise notice 'Đã tồn tại khách hàng này!';
END;
$$ LANGUAGE plpgsql;
 
--Thêm hóa đơn:
CREATE OR REPLACE FUNCTION add_hoa_don(ten TEXT,
   										sdt text,
 										so_tien integer,
 										ra_han date,
   										phuong_thuc_thanh_toan text)
RETURNS VOID AS $$
declare 	
    	id int;
    	thoi_gian date;
BEGIN
                  select "ID" from "Khách" into id
             	where ten="Họ tên" and sdt="SĐT";
             	
             	if id is null
then
raise notice 'Không có khách hàng này!';
return;
end if;
             	
             	select now() into thoi_gian;
             	
             	if ra_han < thoi_gian then raise notice 'Ra hạn không hợp lệ!'; return; end if;
             	
             	update "Khách" set "Thời hạn dịch vụ"=ra_han where "Khách"."ID"=id;
                                 	
             	insert into "Hóa đơn"("ID khách", "Thời gian", "Số tiền", "Ra hạn", "Phương thức thanh toán")
             	values (id, thoi_gian, so_tien, ra_han, phuong_thuc_thanh_toan);
             	
END;
$$ LANGUAGE plpgsql;
 
--Xóa cư dân:
CREATE OR REPLACE FUNCTION delete_cu_dan(ho_ten text,
											can_ho text)
RETURNS void AS $$
BEGIN
    	delete from "Cư dân"
    	where "Họ tên" = ho_ten and "Căn hộ" = can_ho;
END;
$$ LANGUAGE plpgsql;
 
--Xóa xe:
CREATE OR REPLACE FUNCTION delete_xe(bien_so text)
RETURNS void AS $$
BEGIN
             	DELETE FROM "Xe" WHERE "Biển số" = bien_so;
END;
$$ LANGUAGE plpgsql;
 
--Xóa khách dùng dịch vụ:
CREATE OR REPLACE FUNCTION delete_khach(ten text, sdt text)
RETURNS void AS $$
BEGIN
	delete from "Khách" where "Họ tên" = ten and "SĐT" = sdt;
END;
$$ LANGUAGE plpgsql;
 
--Cập nhật thông tin cư dân:
CREATE OR REPLACE FUNCTION update_cu_dan(old_ho_ten text,
 											old_room text,
											new_ho_ten text,
											new_can_ho text,
											ngay_sinh date,
  											sdt text,
  											email text)
RETURNS void AS $$
declare ma_cu_dan int;
BEGIN
select "Mã cư dân" from "Cư dân" into ma_cu_dan
WHERE "Họ tên"=old_ho_ten and "Căn hộ"=room  ;
    	
    	if new_ho_ten is not null
then
update "Cư dân" set "Họ tên"=new_ho_ten where "Mã cư dân"=ma_cu_dan;
end if;
 
if new_can_ho is not null
then
 update "Cư dân" set "Căn hộ"=new_can_ho  where "Mã cư dân"=ma_cu_dan;
end if;
 
    	if ngay_sinh is not null
then
update "Cư dân" set "Ngày sinh"=ngay_sinh where "Mã cư dân"=ma_cu_dan;
end if;
 
    	if sdt is not null
then
update "Cư dân" set "SĐT"=sdt where "Mã cư dân"=ma_cu_dan;
end if;
 
    	if email is not null
then
update "Cư dân" set "Email"=email where "Mã cư dân"=ma_cu_dan;
end if;
 
END;
$$ LANGUAGE plpgsql;
 
--Cập nhật thông tin xe:
CREATE OR REPLACE FUNCTION update_xe(old_bien_xe text,
     									new_bien_xe text,
     									can_ho text,
   										loai_xe text)
RETURNS void AS $$
declare ma_cu_dan int;
BEGIN
    	if new_bien_xe is not null
 then
update "Xe" set "Biển số"=new_bien_xe
where "Biển số"=old_bien_xe;
end if;
 
    	if can_ho is not null
 then
update "Xe" set "Căn hộ"=can_ho
where "Biển số"=old_bien_xe;
end if;
 
    	if loai_xe is not null
then
update "Xe" set "Loại xe"=loai_xe
where "Biển số"=old_bien_xe;
end if;
END;
$$ LANGUAGE plpgsql;
 
--Cập nhật phí đỗ xe:
CREATE OR REPLACE FUNCTION update_phi_doxe(loai_xe text, tien integer)
RETURNS void AS $$
BEGIN 	
    	update "Loại xe" set "Phí đỗ xe"=tien where "Loại xe"=loai_xe;
END;
$$ LANGUAGE plpgsql;
 
--Cập nhật thông tin phí dịch vụ:
CREATE OR REPLACE FUNCTION update_phi_dv(can_ho text,
  											thang integer,
                       	                    so_dien integer,
            								so_nuoc integer,
											phi_vs integer,
											phi_xe integer)
RETURNS void AS $$
declare ma_cu_dan int;
declare id int;
BEGIN 	
    	select "PKey" into id from "Phí dịch vụ"
      	where "Căn hộ"=can_ho
    	and thang = (select EXTRACT(month FROM "Thời gian"))
    	and (select EXTRACT(year FROM "Thời gian"))=(select EXTRACT(year FROM now()));
    	
    	if id is null then raise notice 'Không có thông tin!'; return; end if;
    	
    	if so_dien is not null
then
update "Phí dịch vụ" set "Số điện"=so_dien where "PKey"=id;
end if;
 
    	if so_nuoc is not null
then
update "Phí dịch vụ" set "Số nước"=so_nuoc where "PKey"=id;
end if;
 
    	if phi_vs is not null
 then
 update "Phí dịch vụ" set "Phí vệ sinh"=phi_vs where "PKey"=id;
end if;
 
    	if phi_xe is not null
 then
update "Phí dịch vụ" set "Phí gửi xe"=phi_xe where "PKey"=id;
end if;
 
    	raise notice 'Cập nhật thành công!';    	
END;
$$ LANGUAGE plpgsql;
 
--Cập nhật thông tin khách:
CREATE OR REPLACE FUNCTION update_khach(old_ho_ten text,
										old_sdt text,
										can_ho text,
										new_ho_ten text,
										ngay_sinh date,
										sdt text,
										email text,
										thoi_han_dich_vu text)
RETURNS void AS $$
declare ma_cu_dan int;
declare id int;
declare id int;
BEGIN
    	select "ID" from "Khách" into id where "Họ tên"=old_ho_ten and "SĐT"=old_sdt;
 
    	if can_ho is not null
 then
update "Khách" set "Căn hộ"=can_ho where "ID"=id;
end if;
 
    	if new_ho_ten is not null
then
update "Khách" set "Họ tên"=new_ho_ten where "ID"=id;
end if;
 
    	if ngay_sinh is not null
then
update "Khách" set "Ngày sinh"=ngay_sinh where "ID"=id;
end if;
 
    	if new_sdt is not null
 then
update "Khách" set "SĐT"=new_sdt where "ID"=id;
end if;
 
    	if email is not null
then
update "Khách" set "Email"=email where "ID"=id;
end if;
 
    	if thoi_han_dich_vu is not null
 then
update "Khách" set "Thời hạn dịch vụ"=thoi_han_dich_vu where "ID"=id;
end if;
END;
$$ LANGUAGE plpgsql;
 
--Tìm thông tin của admin:
CREATE OR REPLACE FUNCTION info_admin()
RETURNS TABLE( "Họ tên" character varying,
               "Ngày sinh" date,
               "SĐT" character varying,
               "Email" character varying)
AS $$
BEGIN
    	return query
    	select "Cư dân"."Họ tên", "Cư dân"."Ngày sinh","Cư dân"."SĐT", "Cư dân"."Email"
    	from "Cư dân"
    	where "Cư dân"."Căn hộ"= 'admin';
END;
$$ LANGUAGE plpgsql;
 
--Tìm thông tin của căn hộ:
CREATE OR REPLACE FUNCTION info_can_ho(room TEXT)
RETURNS TABLE("Căn hộ" character varying,
   				"Họ tên" character varying,
   				"SĐT" character varying,
                "Email" character varying,
    	        "Ngày sinh" date)
AS $$
declare 	
    	id int;
    	thoi_gian date;
BEGIN
    	return query
    	select "Cư dân"."Căn hộ",   "Cư dân"."Họ tên",  "Cư dân"."SĐT",   "Cư dân"."Email", "Cư dân"."Ngày sinh"
    	from "Cư dân"
    	where "Cư dân"."Căn hộ"= room
    	
    	union all
 
    	select "Xe"."Căn hộ", "Biển số" as "Họ tên", "Loại xe" as "SĐT", "Trạng thái" as "Email", null as "Ngày sinh"
    	from "Xe"
    	where "Xe"."Căn hộ"= room;
END;
$$ LANGUAGE plpgsql;
 
--Tìm thông tin phí dịch vụ căn hộ:
CREATE OR REPLACE FUNCTION info_phi_dv_can_ho(room TEXT)
RETURNS TABLE("Căn hộ" character varying,
             	"Thời gian" date,
			    "Số điện" integer,
			    "Số nước" integer,
			    "Phí vệ sinh" integer,
			    "Phí gửi xe" integer,
 				"Trạng thái" character varying)
AS $$
declare 	
    	id int;
    	thoi_gian date;
BEGIN
    	return query
    	select "Phí dịch vụ"."Căn hộ", "Phí dịch vụ"."Thời gian",  "Phí dịch vụ"."Số điện",  "Phí dịch vụ"."Số nước",  "Phí dịch vụ"."Phí vệ sinh",  "Phí dịch vụ"."Phí gửi xe",  "Phí dịch vụ"."Trạng thái" 
    	from "Phí dịch vụ"
    	where public."Phí dịch vụ"."Căn hộ" = room;
END;
$$ LANGUAGE plpgsql;
select * from info_phi_dv_can_ho('100');
 
--Tìm thông tin và lịch sử ra vào của xe:
CREATE OR REPLACE FUNCTION info_xe(bien_so TEXT)
RETURNS TABLE(	a character varying,
              	b character varying,
			    c character varying,
			    d timestamp with time zone,
			    e character varying)	AS $$
declare 	
    	id int;
    	thoi_gian date;
BEGIN
    	RETURN QUERY
    	SELECT "Xe"."Biển số" as a,
    	"Xe"."Căn hộ" as b,
    	"Xe"."Loại xe" as c,
    	null as d,
    	"Xe"."Trạng thái" as e
    	FROM "Xe"
    	where "Xe"."Biển số" = bien_so
    	
    	union all
    	
    	SELECT "Lịch sử ra vào"."Biển số" as a,
    	null as b,
    	null as c,
    	"Lịch sử ra vào"."Thời gian" as d,
    	"Lịch sử ra vào"."In/Out" as e
    	FROM "Lịch sử ra vào"
    	where "Lịch sử ra vào"."Biển số" = bien_so;	
END;
$$ LANGUAGE plpgsql;
 
--Thêm phí dịch vụ hàng tháng:
CREATE OR REPLACE FUNCTION phi_dv(can_ho TEXT,
								   so_dien integer,
								   so_nuoc integer)
RETURNS void AS $$
DECLARE
        so_nguoi int;
    	dien_tich int;
    	phi_do_xe int;
    	ngay date;
BEGIN
    	select count("Cư dân"."Mã cư dân") into so_nguoi from "Căn hộ"
    	join "Cư dân" on "Căn hộ"."Căn hộ" = "Cư dân"."Căn hộ"
    	where "Căn hộ"."Căn hộ" = can_ho;
    	
    	if (so_nguoi = 0) then RAISE NOTICE 'Căn hộ không có người ở hoặc không tồn tại căn hộ %!', can_ho; return;  END IF;
    	
    	select "Diện tích" into dien_tich from "Căn hộ"
    	where "Căn hộ" = can_ho;
    	
    	select sum("Phí đỗ xe") into phi_do_xe from "Xe"
    	left join "Loại xe" on "Xe"."Loại xe"="Loại xe"."Loại xe"  	
    	where "Căn hộ" = can_ho
    	group by "Xe"."Loại xe";
    	
    	if phi_do_xe is null then select 0 into phi_do_xe; end if;
    	
    	select CURRENT_DATE into ngay;
    	
	INSERT INTO "Phí dịch vụ"("Căn hộ", "Thời gian", "Số điện", "Số nước", "Phí vệ sinh", "Phí gửi xe", "Trạng thái")
 
    	VALUES (can_ho, ngay, so_dien, so_nuoc, 1500*so_nguoi*dien_tich, phi_do_xe, 'Chưa thanh toán');
    	
    	RAISE NOTICE 'Thêm phí dịch vụ thành công cho căn hộ % ngày %!', can_ho, ngay;
    	
    	exception when unique_violation then raise notice 'Thêm phí dịch vụ thành công cho căn hộ % ngày %!', can_ho, ngay;
END;
$$ LANGUAGE plpgsql;
 
--Thanh toán phí dịch vụ:
CREATE OR REPLACE FUNCTION thanh_toan_phi_dv(can_ho text, thang integer)
RETURNS void AS $$
declare key int;
BEGIN
    	select "PKey" into key from "Phí dịch vụ" where "Căn hộ"=can_ho
    	and thang =     	(select EXTRACT(month FROM "Thời gian"))
    	and "Trạng thái"='Chưa thanh toán';
    	
    	if can_ho is null then raise notice 'Thanh toán không thành công!'; return; end if;
    	
	update "Phí dịch vụ" set "Trạng thái"='Đã thanh toán'
    	where "PKey"=key ;
    	raise notice 'Thanh toán thành công!'; 	
END;
$$ LANGUAGE plpgsql;
 
--Cho xe vào hầm:
CREATE OR REPLACE FUNCTION xe_in(bien_so text)
RETURNS void AS $$
DECLARE
    	trang_thai text;
        thoi_gian TIMESTAMP;
    	can_ho text;
BEGIN
    	select "Căn hộ" from "Xe" into can_ho where "Biển số" = bien_so;
    	
    	if can_ho is NULL then
             	select now() into thoi_gian;  
    	
             	insert into "Xe"("Biển số", "Loại xe", "Trạng thái")
             	values (bien_so, 'Xe vãng lai', 'In');
             	
             	insert into "Lịch sử ra vào"("Biển số", "Thời gian", "In/Out")
             	values (bien_so, thoi_gian, 'In');
    	
             	raise notice 'Đã cho xe % vào hầm!', bien_so;
    	else
             	select now() into thoi_gian;  
             	
             	update "Xe" set "Trạng thái" = 'IN' where "Biển số" = bien_so;
             	
             	insert into "Lịch sử ra vào"("Biển số", "Thời gian", "In/Out")
             	values (bien_so, thoi_gian, 'In');
    	
             	raise notice 'Đã cho xe % vào hầm!', bien_so;
    	end if;
    	exception WHEN unique_violation THEN raise notice 'Xe % đã có trong hầm!', bien_so;
END;
$$ LANGUAGE plpgsql;
 
--Cho xe ra khỏi hầm:
CREATE OR REPLACE FUNCTION xe_out(bien_so text)
RETURNS void AS $$
DECLARE
    	bien_so1 TEXT;
    	trang_thai text;
        thoi_gian TIMESTAMP;
    	can_ho text;
BEGIN
    	select "Biển số" from "Xe" into bien_so1 where "Biển số" = bien_so;
    	if bien_so1 is null then raise notice 'Xe % không có trong hầm!', bien_so; return;
    	end if;
 
    	select "Căn hộ" from "Xe" into can_ho where "Biển số" = bien_so;
    	
    	if can_ho is NULL then
    	
             	select now() into thoi_gian;
    	
             	insert into "Lịch sử ra vào"("Biển số", "Thời gian", "In/Out")
             	values (bien_so, thoi_gian, 'Out');
             	
             	perform delete_xe(bien_so);
    	
             	raise notice 'Đã cho xe % ra khỏi hầm!', bien_so;
    	else
             	select now() into thoi_gian;
             	
             	insert into "Lịch sử ra vào"("Biển số", "Thời gian", "In/Out")
             	values (bien_so, thoi_gian, 'Out');
    	
             	update "Xe" set "Trạng thái" = 'Out' where "Biển số" = bien_so;
    	
             	raise notice 'Đã cho xe % ra khỏi hầm!', bien_so;
    	end if;     	
END;
$$ LANGUAGE plpgsql;