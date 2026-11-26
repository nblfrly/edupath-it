-- Terapkan sesudah migrasi 001. Riwayat yang sudah ada tetap tersimpan.
USE edupath_it;

-- Kunci per akun membuat dua penyimpanan serentak memeriksa kapasitas secara berurutan.
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS check_cv_review_capacity(IN target_user_id BIGINT UNSIGNED)
BEGIN
    DECLARE locked_user_id BIGINT UNSIGNED;
    DECLARE review_count BIGINT UNSIGNED;

    SELECT id INTO locked_user_id FROM users WHERE id = target_user_id FOR UPDATE;
    SELECT COUNT(*) INTO review_count FROM cv_reviews
        WHERE user_id = target_user_id LOCK IN SHARE MODE;

    IF review_count >= 5 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'History penuh. Hapus satu hasil review sebelum memulai review baru.';
    END IF;
END//

CREATE TRIGGER IF NOT EXISTS cv_reviews_check_insert BEFORE INSERT ON cv_reviews
FOR EACH ROW CALL check_cv_review_capacity(NEW.user_id)//

CREATE TRIGGER IF NOT EXISTS cv_reviews_check_owner BEFORE UPDATE ON cv_reviews
FOR EACH ROW
BEGIN
    IF NEW.user_id <> OLD.user_id THEN
        CALL check_cv_review_capacity(NEW.user_id);
    END IF;
END//
DELIMITER ;
