DROP DATABASE if EXISTS YELP;

CREATE DATABASE YELP;

USE YELP;

CREATE TABLE LOGIN
(
ID BIGINT NOT NULL AUTO_INCREMENT,
EmailID VARCHAR(60) NOT NULL UNIQUE,
Password VARCHAR(100) NOT NULL,
Role ENUM('Restaurant', 'Customer') NOT NULL,
Name VARCHAR(60) NOT NULL,
PRIMARY KEY(ID)
);


CREATE TABLE RESTAURANT
(
RestaurantID BIGINT NOT NULL AUTO_INCREMENT,
UserID BIGINT NOT NULL,
Contact BIGINT NOT NULL,
Street_Address VARCHAR(60) NOT NULL,
City VARCHAR(20) NOT NULL,
State VARCHAR(20) NOT NULL,
Country VARCHAR(20) NOT NULL,
Zip_Code INT NOT NULL,
Picture VARCHAR(100),
Description VARCHAR(100) DEFAULT NULL,
Open_Time TIME DEFAULT NULL,
Closing_Time TIME DEFAULT NULL,
PRIMARY KEY(RestaurantID)
);

CREATE TABLE DELIVERY_TYPES (
RestaurantID BIGINT NOT NULL AUTO_INCREMENT,
Delivery_Method ENUM('Curbside Pickup', 'Dine In', 'Yelp Delivery') NOT NULL,
PRIMARY KEY(RestaurantID,Delivery_Method)
);

CREATE TABLE DELIVERY_METHODS (
MethodID BIGINT NOT NULL AUTO_INCREMENT,
Delivery_Method ENUM('Curbside Pickup', 'Dine In', 'Yelp Delivery') NOT NULL,
PRIMARY KEY(MethodID)
);


CREATE TABLE STATE (
StateID BIGINT NOT NULL AUTO_INCREMENT,
CountryID INT NOT NULL,
State_Name VARCHAR(40) NOT NULL,
PRIMARY KEY (StateID)
); 

CREATE TABLE COUNTRY (
CountryID INT NOT NULL AUTO_INCREMENT,
Country_Name VARCHAR(40) NOT NULL,
PRIMARY KEY(CountryID)
);

CREATE TABLE CUISINE (
CuisineID BIGINT NOT NULL AUTO_INCREMENT,
Cuisine_Name VARCHAR(30) NOT NULL,
PRIMARY KEY(CuisineID)
);

CREATE TABLE APPETIZER (
AppetizerID BIGINT NOT NULL AUTO_INCREMENT,
RestaurantID BIGINT NOT NULL,
Dishname VARCHAR(60) NOT NULL,
Price DECIMAL(10,2) NOT NULL,
CuisineID BIGINT NOT NULL,
Main_Ingredients VARCHAR(150) NOT NULL,
Description VARCHAR(100) DEFAULT NULL,
ImageURL VARCHAR(100) DEFAULT NULL,
PRIMARY KEY(AppetizerID)
);


CREATE TABLE SALADS (
SaladsID BIGINT NOT NULL AUTO_INCREMENT ,
RestaurantID BIGINT NOT NULL,
Dishname VARCHAR(60) NOT NULL,
Price DECIMAL(10,2)  NOT NULL,
CuisineID BIGINT NOT NULL,
Main_Ingredients VARCHAR(150) NOT NULL,
Description VARCHAR(100) DEFAULT NULL,
ImageURL VARCHAR(100) DEFAULT NULL,
PRIMARY KEY(SaladsID)
);


CREATE TABLE MAIN_COURSE (
MainCourseID BIGINT NOT NULL AUTO_INCREMENT,
RestaurantID BIGINT NOT NULL,
Dishname VARCHAR(60) NOT NULL,
Price DECIMAL(10,2) NOT NULL,
CuisineID BIGINT NOT NULL,
Main_Ingredients VARCHAR(150) NOT NULL,
Description VARCHAR(100) DEFAULT NULL,
ImageURL VARCHAR(100) DEFAULT NULL,
PRIMARY KEY(MainCourseID)
);


CREATE TABLE DESSERTS (
DessertsID BIGINT NOT NULL AUTO_INCREMENT,
RestaurantID BIGINT NOT NULL,
Dishname VARCHAR(60) NOT NULL,
Price DECIMAL(10,2) NOT NULL,
CuisineID BIGINT NOT NULL,
Main_Ingredients VARCHAR(150) NOT NULL,
Description VARCHAR(100) DEFAULT NULL,
ImageURL VARCHAR(100) DEFAULT NULL,
PRIMARY KEY(DessertsID)
);

CREATE TABLE BEVERAGES (
BeveragesID BIGINT NOT NULL AUTO_INCREMENT,
RestaurantID BIGINT NOT NULL,
Dishname VARCHAR(60) NOT NULL,
Price DECIMAL(10,2) NOT NULL,
CuisineID BIGINT NOT NULL,
Main_Ingredients VARCHAR(150) NOT NULL,
Description VARCHAR(100) DEFAULT NULL,
ImageURL VARCHAR(100) DEFAULT NULL,
PRIMARY KEY(BeveragesID)
);

CREATE TABLE REVIEWS (
ReviewID BIGINT NOT NULL AUTO_INCREMENT,
RestaurantID BIGINT NOT NULL,
CustomerID BIGINT NOT NULL,
Ratings ENUM('1', '2', '3', '4', '5') NOT NULL,
Date DATETIME NOT NULL,
Review VARCHAR(100) DEFAULT NULL,
PRIMARY KEY(ReviewID)
);
 
CREATE TABLE DELIVERY_STATE (
DeliveryID BIGINT NOT NULL AUTO_INCREMENT,
Delivery_Status ENUM('Order Received', 'Preparing', 'On the way', 'Delivered', 'Pick up Ready', 'Picked up'),
PRIMARY KEY(DeliveryID)
);

CREATE TABLE CUSTOMER (
ID BIGINT NOT NULL,
CustomerID BIGINT NOT NULL AUTO_INCREMENT,
GenderID INT, 
DOB DATE DEFAULT NULL,
NickName VARCHAR(20) DEFAULT NULL,
Contact BIGINT DEFAULT NULL,
Street_Address VARCHAR(60) NOT NULL,
City VARCHAR(20) NOT NULL,
State VARCHAR(20) NOT NULL,
Country VARCHAR(20) NOT NULL,
Zip_Code INT NOT NULL,
Picture VARCHAR(100) DEFAULT NULL,
Headline VARCHAR(45) DEFAULT NULL,
Find_Me_In VARCHAR(100) DEFAULT NULL,
YelpingSince DATETIME NOT NULL,
Things_Customer_Love VARCHAR(100) DEFAULT NULL,
PRIMARY KEY (CustomerID)
);


CREATE TABLE GENDER (
GenderID INT NOT NULL AUTO_INCREMENT,
GenderName ENUM('Male','Female','Other'),
PRIMARY KEY (GenderID)
);

CREATE TABLE CUSTOMER_FAVORITES (
CustomerID BIGINT NOT NULL,
RestaurantID BIGINT NOT NULL,
PRIMARY KEY (CustomerID, RestaurantID)
);




CREATE TABLE EVENTS (
EventID BIGINT NOT NULL AUTO_INCREMENT,
EventName VARCHAR(60) NOT NULL,
RestaurantID BIGINT NOT NULL,
Description VARCHAR(100) DEFAULT NULL,
EventTime TIME NOT NULL,
EventDate DATE NOT NULL,
Location VARCHAR(100) NOT NULL,
Hashtags VARCHAR(100) DEFAULT NULL,
PRIMARY KEY(EventID)
);

CREATE TABLE EVENT_REGISTRATION (
EventID BIGINT NOT NULL,
CustomerID BIGINT NOT NULL,
RestaurantID BIGINT NOT NULL,
PRIMARY KEY (EventID, CustomerID)
);

CREATE TABLE ORDERS (
OrderID BIGINT AUTO_INCREMENT NOT NULL,
RestaurantID BIGINT NOT NULL,
CustomerID BIGINT NOT NULL,
DeliveryMode ENUM('Delivery','Pickup') NOT NULL,
StatusID BIGINT NOT NULL,
State ENUM('New','Delivered','Canceled'),
Bill DECIMAL(10,2) DEFAULT NULL,
Date DATETIME,
PRIMARY KEY(OrderID)
);


CREATE TABLE ORDER_CART (
CartID bigint NOT NULL AUTO_INCREMENT,
OrderID BIGINT,
CustomerID BIGINT NOT NULL,
RestaurantID BIGINT,
DishName VARCHAR(60) NOT NULL,
Quantity INT NOT NULL,
Price DECIMAL(10,2) NOT NULL,
Total_Price DECIMAL(10,2),
PRIMARY KEY(CartID)
);


ALTER TABLE ORDER_CART
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE ORDER_CART
ADD FOREIGN KEY (OrderID)
  REFERENCES ORDERS (OrderID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;



ALTER TABLE ORDER_CART
ADD FOREIGN KEY (CustomerID)
  REFERENCES CUSTOMER (CustomerID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


ALTER TABLE ORDERS
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;



ALTER TABLE ORDERS
ADD FOREIGN KEY (CustomerID)
  REFERENCES CUSTOMER (CustomerID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;



ALTER TABLE RESTAURANT
ADD FOREIGN KEY (UserID)
  REFERENCES LOGIN (ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


ALTER TABLE DELIVERY_TYPES
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE STATE
ADD FOREIGN KEY (CountryID)
  REFERENCES COUNTRY (CountryID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE APPETIZER
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE APPETIZER
ADD FOREIGN KEY (CuisineID)
  REFERENCES CUISINE (CuisineID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE SALADS
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE SALADS
ADD FOREIGN KEY (CuisineID)
  REFERENCES CUISINE (CuisineID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE MAIN_COURSE
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE MAIN_COURSE
ADD FOREIGN KEY (CuisineID)
  REFERENCES CUISINE (CuisineID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE DESSERTS
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE DESSERTS
ADD FOREIGN KEY (CuisineID)
  REFERENCES CUISINE (CuisineID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


ALTER TABLE BEVERAGES
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE BEVERAGES
ADD FOREIGN KEY (CuisineID)
  REFERENCES CUISINE (CuisineID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE REVIEWS
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE REVIEWS
ADD FOREIGN KEY (CustomerID)
  REFERENCES CUSTOMER (CustomerID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;
  
  


ALTER TABLE CUSTOMER
ADD FOREIGN KEY (ID)
  REFERENCES LOGIN (ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE CUSTOMER
ADD FOREIGN KEY (GenderID)
  REFERENCES GENDER (GenderID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE CUSTOMER_FAVORITES
ADD FOREIGN KEY (CustomerID)
  REFERENCES CUSTOMER (CustomerID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE CUSTOMER_FAVORITES
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;





ALTER TABLE EVENTS
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE EVENT_REGISTRATION
ADD FOREIGN KEY (EventID)
  REFERENCES EVENTS (EventID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


ALTER TABLE EVENT_REGISTRATION
ADD FOREIGN KEY (RestaurantID)
  REFERENCES RESTAURANT (RestaurantID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE EVENT_REGISTRATION
ADD FOREIGN KEY (CustomerID)
  REFERENCES CUSTOMER (CustomerID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


INSERT INTO COUNTRY(Country_Name) VALUES ('United States of America');

select * from COUNTRY;

INSERT INTO STATE(CountryID,State_Name) VALUES (1,'--Select-State--');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Alabama');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Alaska');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Arizona');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Arkansas');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'California');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Colorado');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Connecticut');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Delaware');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Florida');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Georgia');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Hawaii');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Idaho');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Illinois');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Indiana');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Iowa');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Kansas');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Kentucky');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Louisiana');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Maine');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Maryland');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Massachusetts');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Michigan');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Minnesota');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Mississippi');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Missouri');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Montana');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Nebraska');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Nevada');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'New Hampshire');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'New Jersey');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'New Mexico');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'New York');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'North Carolina');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'North Dakota');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Ohio');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Oklahoma');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Oregon');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Pennsylvania');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Rhode Island');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'South Carolina');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'South Dakota');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Tennessee');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Texas');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Utah');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Vermont');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Virginia');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Washington');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'West Virginia');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Wisconsin');
INSERT INTO STATE(CountryID,State_Name) VALUES (1,'Wyoming');

INSERT INTO DELIVERY_METHODS(Delivery_Method) VALUES ('Curbside Pickup');
INSERT INTO DELIVERY_METHODS(Delivery_Method) VALUES ('Dine In');
INSERT INTO DELIVERY_METHODS(Delivery_Method) VALUES ('Yelp Delivery');

INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES ('Order Received');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES ('Preparing');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES ('On the way');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES ('Delivered');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES ('Pick up Ready');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES ('Picked up');

INSERT INTO CUISINE(Cuisine_Name) VALUES ('Indian');
INSERT INTO CUISINE(Cuisine_Name) VALUES ('Chinese');
INSERT INTO CUISINE(Cuisine_Name) VALUES ('Mexican');
INSERT INTO CUISINE(Cuisine_Name) VALUES ('Italian');
INSERT INTO CUISINE(Cuisine_Name) VALUES ('Japanese');
INSERT INTO CUISINE(Cuisine_Name) VALUES ('Greek');
INSERT INTO CUISINE(Cuisine_Name) VALUES ('French');
INSERT INTO CUISINE(Cuisine_Name) VALUES ('Thai');
INSERT INTO CUISINE(Cuisine_Name) VALUES ('Spanish');
INSERT INTO CUISINE(Cuisine_Name) VALUES ('Mediterranean');

INSERT INTO GENDER(GenderName) VALUES ('Male');
INSERT INTO GENDER(GenderName) VALUES ('Female');
INSERT INTO GENDER(GenderName) VALUES ('Other');

INSERT INTO APPETIZER (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Apricot Ricotta Honey Basil Bites", 6.99, 3, "Apricot, Honey, Mint, Mayo", " Best from the rest");

INSERT INTO APPETIZER (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Grilled Salmon Lemon Kebobs", 5.59, 2 , "Lemon, Salmon, oregano, cumin", "Yummy for thr tummy");

INSERT INTO APPETIZER (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Shrimp Taco Bites", 7.59, 4, "Shrimp, Taco, Ranch", "Mouth Watering");

INSERT INTO BEVERAGES (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Filter coffee", 6.00, 1, "coffee, milk", "Keeps you calm");

INSERT INTO BEVERAGES (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Unsweetend Tea", 5.99, 1, "tea, milk", "Rejuvenating and healthy");

INSERT INTO BEVERAGES (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Hot chocolate", 8.99, 1, "chocolate,milk", "Hot and the spot");



INSERT INTO DESSERTS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Chocolate fudge fountain", 12.99, 7, "chocolate, ice, vanila", "treat for the eyes and mouth");

INSERT INTO DESSERTS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Gulab Jamun", 10.99, 1, "White Flour, Sugar", "Sweetend fried balls");

INSERT INTO DESSERTS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "S'mores", 14.99, 3, "marshmallow, graham cracker", "Campfire treat");

INSERT INTO MAIN_COURSE (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Lasagna", 15.99, 4, "Veggies, cheese", "Flavoury treat");

INSERT INTO MAIN_COURSE (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Macaroni and Cheese", 10.99, 3, "macroni,  cheese", "Cheesy and easy");

INSERT INTO MAIN_COURSE (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Burgers", 12.99, 2, "Buns, pork, bacon ", "Yumilicious and compact");

INSERT INTO SALADS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Veg Bowl", 8.99, 2, "Lettuce, Spinach , Bell Peppers ", "vegan style");

INSERT INTO SALADS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Non-Veg Bowl", 9.99, 6, "Bacon, sausage, chicken", "healthy and crunchy");

INSERT INTO SALADS (RestaurantID, Dishname, Price, CuisineID, Main_Ingredients, Description) 
VALUES(1, "Light Bowl", 7.99, 4, "Onion, carrots, red bell peppers", "Burger without a bun");

ALTER TABLE RESTAURANT
MODIFY Open_Time varchar(40);

ALTER TABLE RESTAURANT
MODIFY Closing_Time varchar(40);



ALTER TABLE DELIVERY_STATUS
MODIFY Delivery_State ENUM ('Order Received', 'Preparing', 'On the way', 'Delivered', 'Pick up Ready', 'Picked up', 'Canceled');

INSERT INTO ORDERS(RestaurantID, CustomerID, DeliveryMode, StatusID, State, Bill, Date)
VALUES(1,1,'Delivery', 1, 'New', 29.88, CURDATE());
 
INSERT INTO ORDER_CART(OrderID,CustomerID, RestaurantID, DishName, Quantity, Price, Total_Price )
VALUES (3, 1, 1,"Apple Orange", 2, 14.99, 29.98);

INSERT INTO ORDERS(RestaurantID, CustomerID, DeliveryMode, StatusID, State, Bill, Date)
VALUES(1,1,'Pickup', 1, 'New', 19.88, CURDATE());
 
INSERT INTO ORDER_CART(OrderID,CustomerID, RestaurantID, DishName, Quantity, Price, Total_Price )
VALUES (4, 1, 1,"Banana Mango", 2, 14.99, 29.98);

ALTER TABLE DELIVERY_STATE
MODIFY Delivery_Status ENUM('Order Received','Preparing','On the way','Delivered','Pick up Ready','Picked up');

INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES('Order Received');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES('Preparing');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES('On the way');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES('Pick up Ready');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES('Delivered');
INSERT INTO DELIVERY_STATE(Delivery_Status) VALUES('Picked up');

SELECT * FROM DELIVERY_STATE;

DELETE FROM DELIVERY_STATE WHERE DeliveryID=11;
DELETE FROM DELIVERY_STATE WHERE DeliveryID=12;
DELETE FROM DELIVERY_STATE WHERE DeliveryID=13;
DELETE FROM DELIVERY_STATE WHERE DeliveryID=14;
DELETE FROM DELIVERY_STATE WHERE DeliveryID=15;
DELETE FROM DELIVERY_STATE WHERE DeliveryID=16;
DELETE FROM DELIVERY_STATE WHERE DeliveryID=17;
DELETE FROM DELIVERY_STATE WHERE DeliveryID=18;
DELETE FROM DELIVERY_STATE WHERE DeliveryID=9;
DELETE FROM DELIVERY_STATE WHERE DeliveryID=10;



INSERT INTO ORDER_CART(CustomerID, DishName, Quantity, Price, Total_Price, RestaurantID)
VALUES (1, "Choco lava cake", 2, 14.99, 29.98, 1);

DELETE FROM ORDER_CART WHERE CustomerID =1;









