-- Run in phpMyAdmin > database `mrt-3-database` > SQL tab. Run once.
ALTER TABLE `user`
  ADD COLUMN `wallet_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `emergency_phone`,
  ADD CONSTRAINT `chk_user_wallet_nonneg` CHECK (`wallet_balance` >= 0);

ALTER TABLE `ticket`
  ADD COLUMN `fare_type_id` INT UNSIGNED NULL AFTER `passenger_category_id`,
  ADD CONSTRAINT `fk_ticket_fare_type` FOREIGN KEY (`fare_type_id`)
    REFERENCES `fare_type` (`fare_type_id`) ON UPDATE CASCADE,
  MODIFY `journey_type` ENUM('BOOK_UNPAID','RESERVE_PAID','BEEP_PASS') NOT NULL;

UPDATE `station` SET `station_name` = 'GMA-Kamuning' WHERE `station_id` = 3;
