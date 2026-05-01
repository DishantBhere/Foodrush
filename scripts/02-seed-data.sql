-- Seed data for the food ordering system
USE food_ordering_system;

-- Insert categories
INSERT INTO categories (name, description, image_url) VALUES
('Appetizers', 'Start your meal with our delicious appetizers', 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop'),
('Main Course', 'Hearty and satisfying main dishes', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'),
('Beverages', 'Refreshing drinks and beverages', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop'),
('Desserts', 'Sweet treats to end your meal', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'),
('Salads & Bowls', 'Fresh and healthy salad options', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop');

-- Insert food items
INSERT INTO food_items (name, description, price, image_url, category_id, preparation_time) VALUES
-- Appetizers
('Chicken Wings', 'Crispy chicken wings with buffalo sauce', 12.99, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop', 1, 15),
('Mozzarella Sticks', 'Golden fried mozzarella with marinara sauce', 8.99, 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop', 1, 10),
('Nachos Supreme', 'Loaded nachos with cheese, jalapeños, and sour cream', 14.99, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop', 1, 12),

-- Main Course
('Grilled Chicken Burger', 'Juicy grilled chicken with lettuce, tomato, and mayo', 16.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', 2, 20),
('Beef Steak', 'Premium beef steak cooked to perfection', 24.99, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', 2, 25),
('Fish and Chips', 'Beer-battered fish with crispy fries', 18.99, 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=300&fit=crop', 2, 18),
('Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil', 15.99, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', 2, 22),

-- Beverages
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop', 3, 5),
('Iced Coffee', 'Cold brew coffee with ice', 3.99, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', 3, 3),
('Smoothie Bowl', 'Mixed berry smoothie in a bowl', 7.99, 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop', 3, 8),

-- Desserts
('Chocolate Cake', 'Rich chocolate cake with ganache', 6.99, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop', 4, 5),
('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and nuts', 5.99, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop', 4, 3),

-- Salads & Bowls
('Caesar Salad', 'Crisp romaine lettuce with Caesar dressing', 11.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', 5, 10),
('Greek Salad', 'Fresh vegetables with feta cheese and olives', 12.99, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', 5, 8);

-- Insert admin user (password: admin123)
INSERT INTO admin_users (username, email, password_hash, role) VALUES
('admin', 'admin@canteen.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'admin');
