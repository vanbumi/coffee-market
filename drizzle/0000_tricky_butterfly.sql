CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`product_name` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_number` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`customer_address` text NOT NULL,
	`total_amount` integer NOT NULL,
	`shipping_cost` integer NOT NULL,
	`discount` integer DEFAULT 0,
	`status` text DEFAULT 'pending',
	`payment_method` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`origin` text NOT NULL,
	`region` text,
	`type` text NOT NULL,
	`price` integer NOT NULL,
	`images` text,
	`description` text,
	`tasting_notes` text,
	`processing` text,
	`rating` real DEFAULT 0,
	`featured` integer DEFAULT 0,
	`in_stock` integer DEFAULT 1,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
