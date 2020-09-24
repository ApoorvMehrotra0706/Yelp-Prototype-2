
-- Procedure for user signup check
DELIMITER $$
CREATE PROCEDURE `existingEmail` (IN EmailID_check varchar(60), IN Role_check enum('Restaurant','Customer'))
BEGIN
SELECT * FROM LOGIN 
WHERE EmailID =  EmailID_check AND Role = Role_check;
END$$
DELIMITER ;

-- Procedure to check if userID is valid
DELIMITER $$
CREATE PROCEDURE `validUserID` (IN EmailID_check varchar(60), IN Role_check enum('Restaurant','Customer'))
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT Password,ID FROM LOGIN 
WHERE EmailID =  EmailID_check AND Role = Role_check;
commit;
END$$
DELIMITER ;statesFetch

-- Procedure to fetch states
DELIMITER $$
CREATE  PROCEDURE `statesFetch`()
BEGIN
SELECT * FROM State;
END$$
DELIMITER ;


-- Procedure to fetch the items froM the menu table asked
DELIMITER $$
CREATE PROCEDURE `fetchAppetizerItems` (IN ID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM APPETIZER WHERE RestaurantID = ID_check;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `fetchBeveragesItems` (IN ID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM BEVERAGES WHERE RestaurantID = ID_check;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `fetchDessertsItems` (IN ID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM DESSERTS WHERE RestaurantID = ID_check;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `fetchMainCourseItems` (IN ID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM MAIN_COURSE WHERE RestaurantID = ID_check;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `fetchSaladsItems` (IN ID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM SALADS WHERE RestaurantID = ID_check;
commit;
END$$appetizer
DELIMITER ;

-- Procedure to insert items in the menu
DELIMITER $$
CREATE PROCEDURE `insertAppetizerItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check bigint, IN ingredients_check varchar(150), 
 IN description_check varchar(100))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO APPETIZER (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES (ID_check,Dishname_check, Price_check, Cuisine_check , ingredients_check, description_check);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM SALADS WHERE AppetizerID=newID;
commit;
END$$
DELIMITER ;

CALL `yelp`.`insertAppetizerItems`('1', 'Momos', '12.99', 'Japanese', 'White flour', 'Tasty Meal');
SELECT * FROM APPETIZER;

DELETE FROM APPETIZER 
WHERE AppetizerID = 9;

DELIMITER $$
CREATE PROCEDURE `insertBeveragesItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO BEVERAGES (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM SALADS WHERE BeveragesID=newID;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertDessertsItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO DESSERTS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM SALADS WHERE DessertsID=newID;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertMainCourseItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
set _cuisineId=(SELECT CuisineID FROM CUISINE WHERE Cuisine_Name=Cuisine_check);
INSERT INTO MAIN_COURSE (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM SALADS WHERE MainCourseID=newID;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertSaladsItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
set _cuisineId=(SELECT CuisineID FROM CUISINE WHERE Cuisine_Name=Cuisine_check);
INSERT INTO SALADS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM SALADS WHERE SaladsID=newID;
commit;
END$$
DELIMITER ;

-- Procedure to update items in the menu
DELIMITER $$
CREATE PROCEDURE `updateAppetizerItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100), AppetizerID_check bigint)
BEGIN
declare _cuisineId int;
declare exit handler for sqlexception rollback;
start transaction;
set _cuisineId=(SELECT CuisineID FROM CUISINE WHERE Cuisine_Name=Cuisine_check);
UPDATE  APPETIZER
SET RestaurantID=ID_check, Dishname=Dishname_check, Price=Price_check, CuisineID=_cuisineId, 
Main_Ingredients=ingredients_check, Description=description_check
WHERE AppetizerID= AppetizerID_check and RestaurantID = ID_check;

commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertBeveragesItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100))
BEGIN
declare _cuisineId int;
declare exit handler for sqlexception rollback;
start transaction;
set _cuisineId=(SELECT CuisineID FROM CUISINE WHERE Cuisine_Name=Cuisine_check);
INSERT INTO BEVERAGES (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check);
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertDessertsItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100))
BEGIN
declare _cuisineId int;
declare exit handler for sqlexception rollback;
start transaction;
set _cuisineId=(SELECT CuisineID FROM CUISINE WHERE Cuisine_Name=Cuisine_check);
INSERT INTO DESSERTS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check);
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertMainCourseItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100))
BEGIN
declare _cuisineId int;
declare exit handler for sqlexception rollback;
start transaction;
set _cuisineId=(SELECT CuisineID FROM CUISINE WHERE Cuisine_Name=Cuisine_check);
INSERT INTO MAIN_COURSE (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check);
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertSaladsItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100))
BEGIN
declare _cuisineId int;
declare exit handler for sqlexception rollback;
start transaction;
set _cuisineId=(SELECT CuisineID FROM CUISINE WHERE Cuisine_Name=Cuisine_check);
INSERT INTO SALADS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check);
commit;
END$$
DELIMITER ;


-- Procedure for user Insertion
DELIMITER $$
CREATE PROCEDURE `custInsert`(IN EmailID_check varchar(60), IN Password_check varchar(100),
 IN Role_check enum('Restaurant','Customer') , IN Name_check varchar(60), IN Gender_check int, 
 IN Contact_check bigint, IN Street_Address_check varchar(60), IN City_check varchar(20), 
 IN State_check varchar(20), IN Country_check varchar(20), In Zip_check int)
BEGIN
declare _custmrId int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO LOGIN (EmailID, Password, Role, Name) 
VALUES(EmailID_check,Password_check,Role_check,Name_check);
set _custmrId=(SELECT ID FROM LOGIN WHERE EmailID=EmailID_check and Role="Customer");
INSERT INTO CUSTOMER(ID, GenderID, YelpingSince, Contact, Street_Address, City, State, Country, Zip_Code ) 
VALUES(_custmrId, Gender_check, CURDATE(), Contact_check, Street_Address_check, City_check, State_check, Country_check, Zip_check); 
commit;
END$$
DELIMITER ;

-- Procedure for Restaurant Insertion
DELIMITER $$
CREATE PROCEDURE `userInsert`(IN EmailID_check varchar(60), IN Password_check varchar(100),
 IN Role_check enum('Restaurant','Customer') , IN Name_check varchar(60), IN Contact_check bigint,
 IN Address_Check varchar(60), IN City_check varchar(20), IN State_check varchar(20), IN Country_check varchar(20),
 IN Zip_check int)
BEGIN
declare _custmrId int;
INSERT INTO LOGIN (EmailID, Password, Role, Name) 
VALUES(EmailID_check,Password_check,Role_check,Name_check);
set _custmrId=(SELECT ID FROM LOGIN WHERE EmailID=EmailID_check and Role="Restaurant");
INSERT INTO RESTAURANT(UserID, Contact, Street_Address, City, State, Country,Zip_Code) 
VALUES(_custmrId, Contact_check, Address_check, City_check, State_check, Country_check, Zip_check);
END$$
DELIMITER ;

-- Procedure to delete items from Menu
DELIMITER $$
CREATE PROCEDURE `deleteAppetizerItems` (IN ID_check bigint, IN DID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM APPETIZER WHERE RestaurantID = ID_check AND AppetizerID = DID_check;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `deleteBeveragesItems` (IN ID_check bigint, IN DID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM BEVERAGES WHERE RestaurantID = ID_check AND BeveragesID = DID_check;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `deleteDessertsItems` (IN ID_check bigint, IN DID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM DESSERTS WHERE RestaurantID = ID_check AND Desserts = DID_check;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `deleteMainCourseItems` (IN ID_check bigint, IN DID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM MAIN_COURSE WHERE RestaurantID = ID_check AND MainCourseID = DID_check;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `deleteSaladsItems` (IN ID_check bigint, IN DID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM SALADS WHERE RestaurantID = ID_check AND SaladsID = DID_check;
commit;
END$$
DELIMITER ;

-- Procedure to fetch review for the Restaurant
DELIMITER $$
CREATE PROCEDURE `fetchReviews` (IN DID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT R.ReviewID, R.CustomerID, L.Name, R.Ratings, R.Date, R.Review
FROM REVIEWS R JOIN CUSTOMER C on R.CustomerID = C.CustomerID
JOIN LOGIN L ON C.ID = L.ID
WHERE R.RestaurantID = ID_check;
commit;
END$$
DELIMITER ;

-- Procedure to extract Restaurant details
delimiter $$
CREATE procedure `getRestaurantCompleteInfoQuery`(in ID_check bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT Name ,Country,State,City,Zip_Code,Street_Address,Contact,Country,Open_Time,
Closing_Time ,EmailID FROM RESTAURANT  JOIN LOGIN  ON UserID = ID 
WHERE RestaurantID= ID_check;
commit;
end $$
delimiter ;


-- Procedure to fetch country
DELIMITER $$
CREATE  PROCEDURE `countryFetch`()
BEGIN
SELECT * FROM Country;
END$$
DELIMITER ;

-- Procedure to update Restaurant Profile
DELIMITER $$
CREATE PROCEDURE `updateRestPrfile`(IN _Name varchar(60),IN _country varchar(20), IN _state varchar(20), 
IN _city varchar(20), IN _Zip int, IN _street varchar(60), IN _contact bigint, 
IN _open varchar(20),IN _close varchar(20),
IN _restID bigint)
BEGIN
UPDATE LOGIN, RESTAURANT
SET Name = _Name, Country = _country, Contact = _contact, Street_Address = _street, City = _city, 
State = _State, Open_Time= _open, Closing_Time = _close, Zip_Code = _Zip
WHERE RestaurantID= _restID; 
END$$
DELIMITER ;

-- Procedure to fetch cuisines
DELIMITER $$
CREATE  PROCEDURE `cuisineFetch`()
BEGIN
SELECT * FROM CUISINE;
END$$
DELIMITER ;

-- Proceudre to update Menu
DELIMITER $$
CREATE PROCEDURE `updateAppetizerMenu` (_id bigint, IN _Dishname varchar(60), IN _Main_Ingredients varchar(150),
IN _CuisineID BIGINT, IN _Description varchar(100), IN _price decimal(10,2),IN _did bigint) 
BEGIN
UPDATE APPETIZER
SET Dishname = _Dishname, Price = _Price, CuisineID = _CuisineID, 
Description = _Description, Price = _Price
WHERE RestaurantID = _id AND AppetizerID = _did;
END$$
DELIMITER ;

CALL `yelp`.`updateAppetizerMenu`('1', 'Apricot Ricotta Honey Basil Bites', 'Apricot, Honey, Mint, Mayo', '8', 'Best from the rest', '6.99', '1');

DELETE FROM APPETIZER
 where AppetizerID = 2;
 
select * FROM APPETIZER;

DELIMITER $$
CREATE PROCEDURE `updateBeveragesMenu` (_id bigint, IN _Dishname varchar(60), IN _Main_Ingredients varchar(150),
IN _CuisineID BIGINT, IN _Description varchar(100), IN _price decimal(10,2),IN _did bigint)
BEGIN
UPDATE BEVERAGES
SET Dishname = _Dishname, Price = _Price, CuisineID = _CuisineID, 
Description = _Description, Price = _Price
WHERE RestaurantID = _id AND _id AND BeveragesID = _did;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE `updateSaladsMenu` (_id bigint, IN _Dishname varchar(60), IN _Main_Ingredients varchar(150),
IN _CuisineID BIGINT, IN _Description varchar(100), IN _price decimal(10,2),IN _did bigint)
BEGIN
UPDATE SALADS
SET Dishname = _Dishname, Price = _Price, CuisineID = _CuisineID, 
Description = _Description, Price = _Price
WHERE RestaurantID = _id  AND SaladsID = _did;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE `updateMainCourseMenu` (_id bigint, IN _Dishname varchar(60), IN _Main_Ingredients varchar(150),
IN _CuisineID BIGINT, IN _Description varchar(100), IN _price decimal(10,2),IN _did bigint)
BEGIN
UPDATE MAIN_COURSE
SET Dishname = _Dishname, Price = _Price, CuisineID = _CuisineID, 
Description = _Description, Price = _Price
WHERE RestaurantID = _id AND MainCourseID = _did;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE `updateDessertsMenu` (_id bigint, IN _Dishname varchar(60), IN _Main_Ingredients varchar(150),
IN _CuisineID BIGINT, IN _Description varchar(100), IN _price decimal(10,2),IN _did bigint)
BEGIN
UPDATE DESSERTS
SET Dishname = _Dishname, Price = _Price, CuisineID = _CuisineID, 
Description = _Description, Price = _Price
WHERE RestaurantID = _id AND DESSERTS = _did;
END$$
DELIMITER ;