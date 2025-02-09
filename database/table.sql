START TRANSACTION;

-- Create referenced tables first
CREATE TABLE IF NOT EXISTS `Căn hộ` (
    `Căn hộ` VARCHAR(255) NOT NULL,
    `Số phòng ngủ` INT NOT NULL,
    `Số WC` INT NOT NULL,
    `Số logia` INT NOT NULL,
    `Diện tích` DOUBLE NOT NULL,
    PRIMARY KEY (`Căn hộ`)
);

CREATE TABLE IF NOT EXISTS `Loại xe` (
    `Loại xe` VARCHAR(255) NOT NULL,
    `Phí đỗ xe` INT NOT NULL,
    `Vị trí` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`Loại xe`)
);

-- Create referencing tables
CREATE TABLE IF NOT EXISTS `Cư dân` (
    `Mã cư dân` BIGINT NOT NULL AUTO_INCREMENT,
    `Họ tên` VARCHAR(255) NOT NULL,
    `Căn hộ` VARCHAR(255) NOT NULL,
    `Ngày sinh` DATE NOT NULL,
    `SĐT` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`Mã cư dân`),
    FOREIGN KEY (`Căn hộ`) REFERENCES `Căn hộ` (`Căn hộ`)
);

CREATE TABLE IF NOT EXISTS `Xe` (
    `Biển số` VARCHAR(255) NOT NULL,
    `Căn hộ` VARCHAR(255) NOT NULL,
    `Loại xe` VARCHAR(255) NOT NULL,
    `Trạng thái` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`Biển số`),
    FOREIGN KEY (`Căn hộ`) REFERENCES `Căn hộ` (`Căn hộ`),
    FOREIGN KEY (`Loại xe`) REFERENCES `Loại xe` (`Loại xe`)
);

CREATE TABLE IF NOT EXISTS `Phí dịch vụ` (
    `PKey` BIGINT NOT NULL AUTO_INCREMENT,
    `Căn hộ` VARCHAR(255) NOT NULL,
    `Thời gian` DATE NOT NULL,
    `Số điện` INT NOT NULL,
    `Số nước` INT NOT NULL,
    `Phí vệ sinh` INT NOT NULL,
    `Phí gửi xe` INT NOT NULL,
    `Trạng thái` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`PKey`),
    UNIQUE (`Căn hộ`, `Thời gian`),
    FOREIGN KEY (`Căn hộ`) REFERENCES `Căn hộ` (`Căn hộ`)
);

CREATE TABLE IF NOT EXISTS `Lịch sử ra vào` (
    `PKey` BIGINT NOT NULL AUTO_INCREMENT,
    `Biển số` VARCHAR(255), -- Allow NULL here for SET NULL to work
    `Thời gian` TIME NOT NULL,
    `Ra/Vào` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`PKey`),
    FOREIGN KEY (`Biển số`) REFERENCES `Xe` (`Biển số`) ON UPDATE SET NULL ON DELETE SET NULL
);

COMMIT;

START TRANSACTION;

-- Create referenced tables first
CREATE TABLE IF NOT EXISTS `apartment` (
    `apartment_id` VARCHAR(255) NOT NULL,
    `bedrooms` INT NOT NULL,
    `bathrooms` INT NOT NULL,
    `loggias` INT NOT NULL,
    `area` DOUBLE NOT NULL,
    PRIMARY KEY (`apartment_id`)
);

CREATE TABLE IF NOT EXISTS `vehicle_type` (
    `type` VARCHAR(255) NOT NULL,
    `parking_fee` INT NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`type`)
);

-- Create referencing tables
CREATE TABLE IF NOT EXISTS `resident` (
    `resident_id` BIGINT NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(255) NOT NULL,
    `apartment_id` VARCHAR(255) NOT NULL,
    `birth_date` DATE NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`resident_id`),
    FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`apartment_id`)
);

CREATE TABLE IF NOT EXISTS `vehicle` (
    `license_plate` VARCHAR(255) NOT NULL,
    `apartment_id` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`license_plate`),
    FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`apartment_id`),
    FOREIGN KEY (`type`) REFERENCES `vehicle_type` (`type`)
);

CREATE TABLE IF NOT EXISTS `service_fee` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `apartment_id` VARCHAR(255) NOT NULL,
    `time_period` DATE NOT NULL,
    `electricity_usage` INT NOT NULL,
    `water_usage` INT NOT NULL,
    `cleaning_fee` INT NOT NULL,
    `parking_fee` INT NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`apartment_id`, `time_period`),
    FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`apartment_id`)
);

CREATE TABLE IF NOT EXISTS `entry_exit_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `license_plate` VARCHAR(255), -- Allow NULL here for SET NULL to work
    `time` TIME NOT NULL,
    `direction` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`license_plate`) REFERENCES `vehicle` (`license_plate`) ON UPDATE SET NULL ON DELETE SET NULL
);

COMMIT;
