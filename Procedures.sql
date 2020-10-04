
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
DELIMITER ;

-- Procedure to fetch states
DELIMITER $$
CREATE  PROCEDURE `statesFetch`()
BEGIN
SELECT * FROM State;
END$$
DELIMITER ;


-- Procedure to fetch the items from the menu table asked
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
 IN description_check varchar(100), IN _imageURL varchar(300))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO APPETIZER (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description, ImageURL) 
VALUES (ID_check,Dishname_check, Price_check, Cuisine_check , ingredients_check, description_check, _imageURL);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM APPETIZER WHERE AppetizerID=newID;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertBeveragesItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100),IN _imageURL varchar(300))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO BEVERAGES (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description, ImageURL) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check, _imageURL);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM SALADS WHERE BeveragesID=newID;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertDessertsItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100),IN _imageURL varchar(300))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO DESSERTS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description, ImageURL) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check,_imageURL);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM SALADS WHERE DessertsID=newID;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertMainCourseItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100),IN _imageURL varchar(300))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO MAIN_COURSE (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description, ImageURL) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check, _imageURL);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM SALADS WHERE MainCourseID=newID;
commit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `insertSaladsItems` (IN ID_check bigint, IN Dishname_check varchar(60),
 IN Price_check decimal(10,2) , IN Cuisine_check varchar(30), IN ingredients_check varchar(150), 
 IN description_check varchar(100), IN _imageURL varchar(300))
BEGIN
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO SALADS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description, ImageURL) 
VALUES (ID_check,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check, _imageURL);
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
CREATE PROCEDURE `fetchReviews` (IN ID_check bigint)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT R.ReviewID, R.CustomerID, L.Name, R.Ratings, R.Date, R.Review, C.ImageURL
FROM REVIEWS R JOIN CUSTOMER C on R.CustomerID = C.CustomerID
JOIN LOGIN L ON C.ID = L.ID
WHERE R.RestaurantID = ID_check;
commit;
END$$
DELIMITER ;

CALL `yelp`.`fetchReviews`('1');

-- Procedure to extract Restaurant details
delimiter $$
CREATE procedure `getRestaurantCompleteInfoQuery`(in ID_check bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT Name ,Country,State,City,Zip_Code,Street_Address,Contact,Country,Open_Time,
Closing_Time ,EmailID FROM RESTAURANT  JOIN LOGIN  ON UserID = ID 
WHERE UserID= ID_check;

SELECT D.DeliveryID 
FROM DELIVERY_TYPES D JOIN RESTAURANT R ON D.RESTAURANTID = R.RESTAURANTID
WHERE R.UserID= ID_check;
commit;
end $$
delimiter ;

CALL `yelp`.`getRestaurantCompleteInfoQuery`('1');

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
IN _restID bigint, IN _CurbsidePickup boolean, IN _DineIn boolean,IN _YelpDelivery boolean)
BEGIN
declare newID int;
UPDATE RESTAURANT
SET  Country = _country, Contact = _contact, Street_Address = _street, City = _city, 
State = _State, Open_Time= _open, Closing_Time = _close, Zip_Code = _Zip
WHERE RestaurantID= _restID;
set newID =(SELECT UserID FROM RESTAURANT WHERE RestaurantID = _restID);
UPDATE LOGIN
SET Name = _Name
WHERE ID = newID;

DELETE FROM DELIVERY_TYPES
WHERE RestaurantID= _restID;
IF _CurbsidePickup THEN
INSERT  INTO DELIVERY_TYPES(RestaurantID, DeliveryID) VALUES(_restID, 1);
END IF;
IF _DineIn THEN
INSERT  INTO DELIVERY_TYPES(RestaurantID, DeliveryID) VALUES(_restID, 2);
END IF;
IF _YelpDelivery THEN
INSERT  INTO DELIVERY_TYPES(RestaurantID, DeliveryID) VALUES(_restID, 3);
END IF;
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
IN _CuisineID BIGINT, IN _Description varchar(100), IN _price decimal(10,2),IN _did bigint, IN _imageURL varchar(300))
BEGIN
UPDATE APPETIZER
SET Dishname = _Dishname, Price = _Price, CuisineID = _CuisineID, 
Description = _Description, Price = _Price, ImageURL = _imageURL
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

-- Procedure to extract Order details
delimiter $$
CREATE procedure `getOrderDetails`(IN _state varchar(25), IN _ID bigint )
begin
declare newID int;
declare exit handler for sqlexception rollback;
start transaction;
set newID =(SELECT RestaurantID
FROM RESTAURANT JOIN  LOGIN ON ID = UserID
WHERE ID = _ID);
SELECT L.Name, O.CustomerID, O.Date, O.DeliveryMode, O.StatusID, O.State, O.Bill, O.OrderID, C.ImageURL
FROM ORDERS O JOIN CUSTOMER C on O.CustomerID = C.CustomerID
JOIN LOGIN L ON L.ID = C. ID
WHERE O.State LIKE _state AND O.RestaurantID = newID;
commit;
end $$
delimiter ;

-- Procedure to fetch Person Order details
delimiter $$
CREATE procedure `getPersonOrderDetails` (IN _orderID bigint, IN userID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT * 
FROM ORDER_CART JOIN RESTAURANT ON ORDER_CART.RestaurantID = RESTAURANT.RestaurantID
JOIN LOGIN ON  RESTAURANT.UserID = LOGIN.ID
WHERE OrderID = _orderID;
commit;
end $$
delimiter ;

-- Procedure to update Delivery Status
delimiter $$
CREATE procedure `updateDelivery` (IN _deliveryStatus bigint, IN _orderID bigint,
 IN _state varchar(20))
begin
declare exit handler for sqlexception rollback;
start transaction;
UPDATE ORDERS
SET StatusID = _deliveryStatus, State = _state
WHERE OrderID = _orderID;
commit;
end $$
delimiter ;

-- Procedure to fetch delivery states
delimiter $$
CREATE procedure `fetchDeliveryState` ()
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM DELIVERY_STATE
commit;
end $$
delimiter ;

-- Procedure to fetch Restaurant ID
delimiter $$
CREATE procedure `restroIDFetch` (IN _userID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT RestaurantID 
FROM RESTAURANT
WHERE UserID = _userID;
commit;
end $$
delimiter ;

-- Procedure to fetch Events
delimiter $$
CREATE procedure `getEventsQuery` (IN sortValue varchar(20), IN _userID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
IF sortValue = 'upcoming' THEN
SELECT * FROM EVENTS
WHERE EventDate > CURDATE() and EventStartTime > CURTIME() and RestaurantID = _userID;
END IF;

IF sortValue = 'past' THEN
SELECT * FROM EVENTS
WHERE EventDate < CURDATE() and EventEndTime < CURTIME() and RestaurantID = _userID;
END IF;
end $$
delimiter ;

-- Prcocedure to fetch customers who are registered in the event
DELIMITER $$
CREATE PROCEDURE `getEventsCustomers`(IN eventID bigint, IN _userID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM 
EVENT_REGISTRATION ER JOIN EVENTS E on ER.EventID = E.EventID
JOIN CUSTOMER C ON ER.CustomerID = C.CustomerID
JOIN LOGIN L ON C.ID = L.ID
WHERE ER.EventID = eventID and C.CustomerID = _userID;
commit;
end$$
DELIMITER ;


-- Procedure to insert into events table
DELIMITER $$
CREATE PROCEDURE `createEvents`(IN _userID bigint, IN _name varchar(30), IN _description varchar(30), 
IN _eventsdate varchar(20),IN _EventStartTime varchar(30),IN _EventEndTime varchar(30),IN  _address varchar(370),
IN 	_hashtags varchar(30))
begin
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO EVENTS(EventName, RestaurantID, Description, EventStartTime, EventDate,
Location, Hashtags, EventEndTime) VALUES(_name, _userID, _description, _EventStartTime, _eventsdate,
_address, _hashtags, _EventEndTime);
commit;
end$$
DELIMITER ;

-- Procedure to fetch Customer ID
delimiter $$
CREATE procedure `customerIDFetch` (IN _userID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT CustomerID 
FROM CUSTOMER
WHERE ID = _userID;
commit;
end $$
delimiter ;

-- Procedure to fetch Customer Details
delimiter $$
CREATE procedure `getCustomerDetails` (IN _custID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT NickName, DOB, concat(City,', ',State) as Address1, Street_Address AS Address2, Headline, 
Things_Customer_Love, Find_Me_In, YelpingSince, Website, ImageURL 
FROM CUSTOMER 
WHERE CustomerID = _custID;
commit;
end $$
delimiter ;

-- Procedure to fetch Customer Details for updation
delimiter $$
CREATE procedure `getCustDetailsForUpdate` (IN _custID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT L.Name, C.NickName, C.GenderID, C.DOB, C.Country, C.State, C.City, C.Zip_Code, C.Street_Address, C.Headline, 
C.Things_Customer_Love, C.Find_Me_In, C.Website, C.ImageURL 
FROM CUSTOMER C JOIN LOGIN L ON C.ID = L.ID
WHERE C.CustomerID = _custID;

SELECT * FROM  COUNTRY;

SELECT * FROM STATE;

SELECT * FROM GENDER;
commit;
end $$
delimiter ;
CALL `yelp`.`getCustDetailsForUpdate`(2);

-- Procedure to fetch Customer Details for updation
delimiter $$
CREATE procedure `updateCustProfile` (IN _custID bigint, IN _Name varchar(40), IN _NickName varchar(20), IN _Gender int,
IN _DOB varchar(20),IN  _Country varchar(40),IN  _State varchar(20),IN  _City varchar(20), IN _Zip int,IN _Street varchar(60),
IN _Headline varchar(45),IN _I_Love varchar(100), IN _Find_Me_In varchar(100),  IN _Website varchar(100),IN _ImageURL varchar(300))

begin
declare id int;
declare exit handler for sqlexception rollback;
start transaction;
UPDATE CUSTOMER 
SET GenderID = _Gender, DOB = _DOB, NickName = _NickName, Street_Address = _Street, City = _City, State = _State,
Country = _Country, Zip_Code = _Zip, ImageURL =  _ImageURL, Headline = _Headline, 
Find_Me_In = _Find_Me_In, Things_Customer_Love = _I_Love, Website = _Website, ImageURL = _ImageURL
 WHERE CustomerID = _custID;
set id =(SELECT ID FROM CUSTOMER WHERE CustomerID =_custID );
UPDATE LOGIN
SET Name = _Name
WHERE ID = id;
commit;
end $$
delimiter ;


-- Procedure to fetch Customer Contact Information
delimiter $$
CREATE procedure `getCustContact` (IN _custID bigint,IN _userID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT L.Name, L.EmailID, C.Contact 
FROM CUSTOMER C JOIN LOGIN L ON C.ID = L.ID
WHERE C.CustomerID = _custID;
commit;
end $$
delimiter ;

-- Procedure to update Customer Contact Information
delimiter $$
CREATE procedure `updateCustContact` (IN _custID bigint,IN _userID bigint,IN  _Email varchar(60),IN  _Contact bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
UPDATE LOGIN
SET EmailID = _Email
WHERE ID = _userID;

UPDATE CUSTOMER 
SET Contact = _Contact
WHERE CustomerID =_custID;
commit;
end $$
delimiter ;

-- Procedure to return Search Strings


-- procedure to fetch STrings For Search
drop procedure  if exists fetchSearchStrings;

DELIMITER  $$
CREATE PROCEDURE `fetchSearchStrings`()
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;

select Distinct(Name) from LOGIN WHERE Role = 'Restaurant';

SELECT DISTINCT(DishName) as Name FROM APPETIZER UNION SELECT DISTINCT(DishName) as Name FROM BEVERAGES UNION 
SELECT DISTINCT(DishName) as Name FROM DESSERTS UNION SELECT DISTINCT(DishName) as Name FROM MAIN_COURSE UNION 
SELECT DISTINCT(DishName) as Name FROM  SALADS;

SELECT DISTINCT(Cuisine_Name) as Name FROM CUISINE;

SELECT CONCAT(State,', ',City,', ',Street_Address,' ,',Zip_Code) as Name FROM RESTAURANT

commit;
END  $$



DELIMITER  $$
CREATE PROCEDURE `fetchRestaurantResults`(IN _filterCriteria VARCHAR(100), IN _searchedString VARCHAR(100))
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;
 IF _filterCriteria='1' THEN
SELECT RESTAURANT.RestaurantID as ID, LOGIN.Name as Name, 
IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=1),false) 
as CurbsidePickup, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=2),false) 
as DineIn, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=3),false) 
as YelpDelivery,RESTAURANT.ImageURL as ImageUrl,TIME_FORMAT(RESTAURANT.Open_Time, "%h:%i %p") 
 as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime, 
count(REVIEWS.ReviewID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Ratings),0)) as AvgRating
FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.RestaurantID=RESTAURANT.RestaurantID
LEFT JOIN LOGIN ON RESTAURANT.UserID = LOGIN.ID
WHERE RESTAURANT.RestaurantID IN (
SELECT RestaurantID FROM RESTAURANT JOIN LOGIN ON RESTAURANT.UserID = LOGIN.ID 
where LOGIN.Name like  CONCAT('%', _searchedString , '%')
)
 GROUP BY RESTAURANT.RestaurantID, LOGIN.Name,
RESTAURANT.Open_Time, RESTAURANT.Closing_Time;

ELSEIF _filterCriteria='2' THEN
SELECT RESTAURANT.RestaurantID as ID, LOGIN.Name as Name, 
IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=1),false) 
as CurbsidePickup, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=2),false) 
as DineIn, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=3),false) 
as YelpDelivery,RESTAURANT.ImageURL as ImageUrl,
TIME_FORMAT(RESTAURANT.Open_Time, "%h:%i %p") 
 as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime, 
count(REVIEWS.ReviewID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Ratings),0)) as AvgRating
FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.RestaurantID=RESTAURANT.RestaurantID
LEFT JOIN LOGIN ON LOGIN.ID = RESTAURANT.UserID
WHERE RESTAURANT.RestaurantID IN (
SELECT RestaurantID FROM APPETIZER where Dishname like  CONCAT('%', _searchedString , '%') UNION
SELECT RestaurantID FROM BEVERAGES where Dishname like  CONCAT('%', _searchedString , '%') UNION
SELECT RestaurantID FROM MAIN_COURSE where Dishname like  CONCAT('%', _searchedString , '%') UNION
SELECT RestaurantID FROM DESSERTS where Dishname like  CONCAT('%', _searchedString , '%') UNION
SELECT RestaurantID FROM SALADS where Dishname like  CONCAT('%', _searchedString , '%')
)
 GROUP BY RESTAURANT.RestaurantID, LOGIN.Name,
RESTAURANT.Open_Time, RESTAURANT.Closing_Time;

ELSEIF _filterCriteria='3' THEN

SELECT RESTAURANT.RestaurantID as ID, LOGIN.Name as Name, 
IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=1),false) 
as CurbsidePickup, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=2),false) 
as DineIn, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=3),false) 
as YelpDelivery,RESTAURANT.ImageURL as ImageUrl,
TIME_FORMAT(RESTAURANT.Open_Time, "%h:%i %p") 
 as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime,  
count(REVIEWS.ReviewID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Ratings),0)) as AvgRating
FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.RestaurantID=RESTAURANT.RestaurantID
LEFT JOIN LOGIN ON LOGIN.ID = RESTAURANT.UserID
WHERE RESTAURANT.RestaurantID IN (
SELECT RestaurantID FROM APPETIZER JOIN CUISINE ON CUISINE.CuisineID=APPETIZER.CuisineID 
where Cuisine_Name like  CONCAT('%', 'a' , '%') UNION
SELECT RestaurantID FROM BEVERAGES JOIN CUISINE ON CUISINE.CuisineID=BEVERAGES.CuisineID 
where Cuisine_Name like  CONCAT('%', 'a' , '%') UNION
SELECT RestaurantID FROM MAIN_COURSE JOIN CUISINE ON CUISINE.CuisineID=MAIN_COURSE.CuisineID 
where Cuisine_Name like  CONCAT('%', 'a' , '%') UNION
SELECT RestaurantID FROM DESSERTS JOIN CUISINE ON CUISINE.CuisineID=DESSERTS.CuisineID 
where Cuisine_Name like  CONCAT('%', 'a' , '%') UNION
SELECT RestaurantID FROM SALADS JOIN CUISINE ON CUISINE.CuisineID=SALADS.CuisineID 
where Cuisine_Name like  CONCAT('%',  _searchedString , '%')
)
 GROUP BY RESTAURANT.RestaurantID, LOGIN.Name,
RESTAURANT.Open_Time, RESTAURANT.Closing_Time;
ELSE 

SELECT RESTAURANT.RestaurantID as ID, LOGIN.Name as Name, 
IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=1),false) 
as CurbsidePickup, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=2),false) 
as DineIn, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=3),false) 
as YelpDelivery,RESTAURANT.ImageURL as ImageUrl,
TIME_FORMAT(RESTAURANT.Open_Time, "%h:%i %p") 
 as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime,  
count(REVIEWS.ReviewID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Ratings),0)) as AvgRating
FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.RestaurantID=RESTAURANT.RestaurantID
LEFT JOIN LOGIN ON LOGIN.ID = RESTAURANT.UserID
WHERE RESTAURANT.RestaurantID IN (
SELECT RestaurantID FROM RESTAURANT JOIN STATE ON STATE.State_Name=RESTAURANT.State where concat(State,City,Zip_Code,Street_Address) 
like  CONCAT('%', _searchedString , '%')
)
 GROUP BY RESTAURANT.RestaurantID, LOGIN.Name,
RESTAURANT.Open_Time, RESTAURANT.Closing_Time;
END IF;

commit;
END  $$


-- Procedure to fetch items from the menu
delimiter $$
CREATE procedure `fetchRestaurantMenu` (IN _restroID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM APPETIZER WHERE RestaurantID = _restroID;
SELECT * FROM BEVERAGES WHERE RestaurantID = _restroID;
SELECT * FROM MAIN_COURSE WHERE RestaurantID = _restroID;
SELECT * FROM SALADS WHERE RestaurantID = _restroID;
SELECT * FROM DESSERTS WHERE RestaurantID = _restroID;
commit;
end $$
delimiter ;

delimiter $$
CREATE procedure `fetchRestaurantReview` (IN _restroID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT R.ReviewID, R.Ratings, R.Date, R.Review,
R.CustomerID, L.Name, concat(Street_Address,', ',City,', ',State,', ',Country) as Address,
C.ImageURL FROM REVIEWS R JOIN CUSTOMER C ON R.CustomerID = C.CustomerID
JOIN LOGIN L ON C.ID= L.ID WHERE R.RestaurantID = _restroID;
commit;
end $$
delimiter ;

delimiter $$
CREATE procedure `getRestForCust` (IN _restroID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT RESTAURANT.RestaurantID as ID, LOGIN.Name as Name, 
IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=1),false) 
as CurbsidePickup, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=2),false) 
as DineIn, IFNULL((SELECT true FROM DELIVERY_TYPES WHERE 
DELIVERY_TYPES.RestaurantID=RESTAURANT.RestaurantID and DeliveryID=3),false) 
as YelpDelivery, RESTAURANT.ImageURL as ImageUrl,TIME_FORMAT(RESTAURANT.Open_Time, "%h:%i %p") 
 as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime, 
count(REVIEWS.ReviewID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Ratings),0)) as AvgRating
FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.RestaurantID=RESTAURANT.RestaurantID
LEFT JOIN LOGIN ON RESTAURANT.UserID = LOGIN.ID
WHERE RESTAURANT.RestaurantID = _restroID;
commit;
end $$
delimiter ;


-- Procedure to submit review from customer
delimiter $$
CREATE procedure `submitReview` (IN _custID bigint, IN _restroID bigint, IN _review varchar(100),
IN _rating bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO REVIEWS(RestaurantID, CustomerID, Ratings, Date, Review)
VALUES(_restroID, _custID, _rating, CURDATE(),_review);
commit;
end $$
delimiter ;

-- Procedure to fetch Appetizer Dishname corresponding to the dishid 
delimiter $$
CREATE procedure `appetizerDishFetch` (IN _dishID bigint, IN _restroID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT Dishname FROM APPETIZER
WHERE RestaurantID = _restroID and AppetizerID = _dishID;
commit;
end $$
delimiter ;

-- Procedure to fetch Beverages Dishname corresponding to the dishid 
delimiter $$
CREATE procedure `beveragesDishFetch` (IN _dishID bigint, IN _restroID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT Dishname FROM BEVERAGES
WHERE RestaurantID = _restroID and BeveragesID = _dishID;
commit;
end $$
delimiter ;

-- Procedure to fetch MainCourse Dishname corresponding to the dishid 
delimiter $$
CREATE procedure `mainCourseDishFetch` (IN _dishID bigint, IN _restroID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT Dishname FROM MAIN_COURSE
WHERE RestaurantID = _restroID and MainCourseID = _dishID;
commit;
end $$
delimiter ;

-- Procedure to fetch Salads Dishname corresponding to the dishid 
delimiter $$
CREATE procedure `saladsDishFetch` (IN _dishID bigint, IN _restroID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT Dishname FROM SALADS
WHERE RestaurantID = _restroID and SaladsID = _dishID;
commit;
end $$
delimiter ;

-- Procedure to fetch Desserts Dishname corresponding to the dishid 
delimiter $$
CREATE procedure `dessertsDishFetch` (IN _dishID bigint, IN _restroID bigint)
begin
declare exit handler for sqlexception rollback;
start transaction;
SELECT Dishname FROM DESSERTS
WHERE RestaurantID = _restroID and DessertsID = _dishID;
commit;
end $$
delimiter ;



-- Procedure to update customer order
delimiter $$
CREATE procedure `updateCustOrder` (IN _RestroID bigint, IN _custID bigint, 
IN _deliveryMode enum('Delivery','Pickup'),
IN _statusID bigint,IN  _state enum('New','Delivered','Canceled'),IN _Price decimal(10,2), 
IN _Address varchar(60))
begin
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO ORDERS(RestaurantID, CustomerID, DeliveryMode, StatusID, State, Bill, Date, Address)
VALUES(_RestroID, _custID, _deliveryMode, _statusID, _state, _Price, CURDATE(), _Address);

SELECT LAST_INSERT_ID() AS ID;
commit;
end $$
delimiter ;


-- Procedure to finsert Customer Review
delimiter $$
CREATE procedure `updateCustReview` (IN _restroID bigint, IN _custID bigint, IN _ratings enum('1','2','3','4','5'), 
IN review varchar(100))
begin
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO REVIEWS(RestaurantID, CustomerID, Ratings, Date, Review)
VALUE(_restroID, _custID, _ratings, CURDATE(), _review);
commit;
end $$
delimiter ;

