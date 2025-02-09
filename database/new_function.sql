DELIMITER //

/* ADD APARTMENT */
CREATE PROCEDURE add_apartment(  
    IN p_apartment_id VARCHAR(255),  
    IN p_bedrooms INT,  
    IN p_bathrooms INT,  
    IN p_loggias INT,  
    IN p_area DECIMAL(10,2)  
)  
BEGIN  
    INSERT INTO `apartment` (`apartment_id`, `bedrooms`, `bathrooms`, `loggias`, `area`)  
    VALUES (p_apartment_id, p_bedrooms, p_bathrooms, p_loggias, p_area);  
END //

/* ADD REDIDENT */
CREATE PROCEDURE add_resident(
    IN p_full_name VARCHAR(255),  
    IN p_apartment VARCHAR(255),  
    IN p_birth_date DATE,  
    IN p_phone VARCHAR(255),  
    IN p_email VARCHAR(255)
)
BEGIN  
    INSERT INTO residents (full_name, apartment, birth_date, phone, email)  
    VALUES (p_full_name, p_apartment, p_birth_date, p_phone, p_email);  
END //

/* ADD VEHICLE */
CREATE PROCEDURE add_vehicle(
    IN p_license_plate VARCHAR(255),
    IN p_apartment_id VARCHAR(255),
    IN p_vehicle_type VARCHAR(255),
    IN p_status VARCHAR(255)
)
BEGIN
    INSERT INTO vehicle (license_plate, apartment_id, vehicle_type, status)
    VALUES (p_license_plate, p_apartment_id, p_vehicle_type, p_status);
END //

DROP PROCEDURE IF EXISTS service_fee_all;

/* ALL SERVICE FEE FOR ALL APARTMENTS */
CREATE PROCEDURE service_fee_all()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE apartment_id_fee VARCHAR(50);
    DECLARE num_residents INT DEFAULT 0;
    DECLARE area_add INT DEFAULT 0;
    DECLARE parking_fee_add INT DEFAULT 0;
    DECLARE time_period DATE;
    
    -- Cursor để duyệt qua tất cả căn hộ
    DECLARE cur CURSOR FOR 
        SELECT apartment_id FROM apartment;
    
    -- Xử lý khi kết thúc vòng lặp
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Lấy ngày hiện tại
    SET time_period = CURDATE();
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO apartment_id_fee;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Get number of residents in the apartment
        SELECT COUNT(resident.resident_id) INTO num_residents
        FROM apartment
        LEFT JOIN resident ON apartment.apartment_id = resident.apartment_id
        WHERE apartment.apartment_id = apartment_id_fee;
        
        -- Nếu không có cư dân thì bỏ qua căn hộ này
        IF num_residents = 0 THEN
            ITERATE read_loop;
        END IF;
        
        -- Get apartment area (fix null issue)
        SELECT COALESCE(area, 0) INTO area_add 
        FROM apartment
        WHERE apartment_id = apartment_id_fee;
        
        -- Get total parking fee for vehicles in the apartment (fix wrong condition)
        SELECT COALESCE(SUM(parking_fee), 0) 
        INTO parking_fee_add
        FROM vehicle
        LEFT JOIN vehicle_type ON vehicle.type = vehicle_type.type
        WHERE vehicle.apartment_id = apartment_id_fee;
        
        -- Insert service fee record
        INSERT INTO service_fee(apartment_id, time_period, electricity_usage, water_usage, cleaning_fee, parking_fee, status)
        VALUES (apartment_id_fee, time_period, 0, 0, 1500 * num_residents * area_add, parking_fee_add, 'Pending Payment');
        
    END LOOP;
    
    CLOSE cur;
    
    -- Success message
    SELECT 'Added service fees for all apartments!' AS message;

END $$

/* PAY SERVICE FEE */
DROP PROCEDURE IF EXISTS pay_service_fee $$

CREATE PROCEDURE pay_service_fee(
    IN apartment_id_pay VARCHAR(50), 
    IN month_pay INT
)
BEGIN
    DECLARE service_fee_key INT;

    -- Get the primary key of the service fee record for the given apartment and month
    SELECT id INTO service_fee_key
    FROM service_fee
    WHERE apartment_id = apartment_id_pay
        AND MONTH(time_period) = month_pay
        AND status = 'Pending Payment'
    LIMIT 1;

    -- If no matching record is found, return an error message
    IF service_fee_key IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Payment failed! No pending fee found.';
    END IF;

    -- Update the service fee status to "Paid"
    UPDATE service_fee 
    SET status = 'Paid'
    WHERE id = service_fee_key;

    -- Success message
    SELECT 'Payment successful!' AS message;

END $$

/* Vehicle in */
DROP PROCEDURE IF EXISTS vehicle_in $$

CREATE PROCEDURE vehicle_in (IN license_plate_in VARCHAR(50))
BEGIN
    DECLARE apartment_id_in VARCHAR(50) DEFAULT NULL;
    DECLARE time_in TIMESTAMP DEFAULT NOW(); -- Corrected declaration and initialization
    
    -- Check if the vehicle already exists in the database
    SELECT apartment_id INTO apartment_id_in FROM vehicle WHERE license_plate = license_plate_in;

    IF apartment_id_in IS NULL THEN
        -- If the vehicle is not registered, add it as a visitor
        INSERT INTO vehicle(license_plate, apartment_id, type, status)
        VALUES (license_plate_in, 'guest', 'guest', 'in');
        
        INSERT INTO entry_exit_log(license_plate, time, direction)
        VALUES (license_plate_in, time_in, 'in');
        
        SELECT CONCAT('Vehicle ', license_plate_in, ' has entered the parking lot!') AS message;
    ELSE
        -- If the vehicle is registered, update its status
        UPDATE vehicle SET status = 'in' WHERE license_plate = license_plate_in;
        
        INSERT INTO entry_exit_log(license_plate, time, direction)
        VALUES (license_plate_in, time_in, 'in');
        
        SELECT CONCAT('Vehicle ', license_plate_in, ' has entered the parking lot!') AS message;
    END IF;
    
END $$

/* Vehicle out */

DELIMITER ;
