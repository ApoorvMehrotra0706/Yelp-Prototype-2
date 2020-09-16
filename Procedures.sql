
-- Procedure for user signup check
DELIMITER $$
CREATE PROCEDURE `existingEmail` (IN EmailID_check varchar(60), IN Role_check enum('Restaurant','Customer'))
BEGIN
SELECT * FROM LOGIN 
WHERE EmailID =  EmailID_check AND Role = Role_check;
END$$
DELIMITER ;

-- Procedure for restuarant login insertion
DELIMITER $$
CREATE PROCEDURE `userInsert` (IN EmailID_check varchar(60), IN Password_check varchar(100),
 IN Role_check enum('Restaurant','Customer') , IN Name_check varchar(60))
BEGIN
INSERT INTO LOGIN (EmailID, Password, Role, Name) 
VALUES(EmailID_check,Password_check,Role_check,Name_check);
END$$
DELIMITER ;

-- Procedure for Customer login insert
DELIMITER $$
CREATE PROCEDURE `custInsert` (IN EmailID_check varchar(60), IN Password_check varchar(100),
 IN Role_check enum('Restaurant','Customer') , IN Name_check varchar(60), IN Gender_check int)
BEGIN
declare _custmrId int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO LOGIN (EmailID, Password, Role, Name) 
VALUES(EmailID_check,Password_check,Role_check,Name_check);
set _custmrId=(SELECT ID FROM LOGIN WHERE Email=EmailID_check and Role="Customer");
INSERT INTO CUSTOMER(ID, GenderID, YelpingSince) VALUES(_custmrId, Gender_check, CURDATE()); 
commit;
END$$
DELIMITER ;