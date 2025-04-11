-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: techmate
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `article_likes`
--

DROP TABLE IF EXISTS `article_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_likes` (
  `article_like_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `article_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`article_like_id`),
  KEY `FKbtkgmxfbjkfelv3v7ty6mo3n8` (`user_id`),
  CONSTRAINT `FKbtkgmxfbjkfelv3v7ty6mo3n8` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_likes`
--

LOCK TABLES `article_likes` WRITE;
/*!40000 ALTER TABLE `article_likes` DISABLE KEYS */;
INSERT INTO `article_likes` VALUES (2,'2025-02-02 09:50:00.000000','2025-02-02 09:50:00.000000',103,1),(3,'2025-02-01 09:15:00.000000','2025-02-01 09:15:00.000000',201,2),(4,'2025-02-02 11:35:00.000000','2025-02-02 11:35:00.000000',203,2),(5,'2025-02-01 08:35:00.000000','2025-02-01 08:35:00.000000',301,3),(6,'2025-02-01 10:05:00.000000','2025-02-01 10:05:00.000000',401,4),(7,'2025-02-01 09:35:00.000000','2025-02-01 09:35:00.000000',501,5),(8,'2025-02-01 16:50:00.000000','2025-02-01 16:50:00.000000',601,6),(9,'2025-02-02 13:25:00.000000','2025-02-02 13:25:00.000000',701,7),(10,'2025-02-03 11:20:00.000000','2025-02-03 11:20:00.000000',801,8),(11,'2025-02-01 15:05:00.000000','2025-02-01 15:05:00.000000',901,9),(12,'2025-02-02 10:35:00.000000','2025-02-02 10:35:00.000000',1001,10),(15,'2025-03-26 11:14:39.581036','2025-03-26 11:14:39.581036',101,1);
/*!40000 ALTER TABLE `article_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article_reads`
--

DROP TABLE IF EXISTS `article_reads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_reads` (
  `article_read_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `article_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`article_read_id`),
  KEY `FKguvwbx3mrldke2op8esjf50xl` (`user_id`),
  CONSTRAINT `FKguvwbx3mrldke2op8esjf50xl` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_reads`
--

LOCK TABLES `article_reads` WRITE;
/*!40000 ALTER TABLE `article_reads` DISABLE KEYS */;
INSERT INTO `article_reads` VALUES (1,'2025-02-01 10:15:00.000000','2025-02-01 10:15:00.000000',101,1),(2,'2025-02-01 11:30:00.000000','2025-02-01 11:30:00.000000',102,1),(3,'2025-02-02 09:45:00.000000','2025-02-02 09:45:00.000000',103,1),(4,'2025-02-02 14:20:00.000000','2025-02-02 14:20:00.000000',104,1),(5,'2025-02-03 16:00:00.000000','2025-02-03 16:00:00.000000',105,1),(6,'2025-02-01 09:10:00.000000','2025-02-01 09:10:00.000000',201,2),(7,'2025-02-01 13:45:00.000000','2025-02-01 13:45:00.000000',202,2),(8,'2025-02-02 11:30:00.000000','2025-02-02 11:30:00.000000',203,2),(9,'2025-02-03 10:20:00.000000','2025-02-03 10:20:00.000000',204,2),(10,'2025-02-01 08:30:00.000000','2025-02-01 08:30:00.000000',301,3),(11,'2025-02-02 12:15:00.000000','2025-02-02 12:15:00.000000',302,3),(12,'2025-02-03 09:40:00.000000','2025-02-03 09:40:00.000000',303,3),(13,'2025-02-01 10:00:00.000000','2025-02-01 10:00:00.000000',401,4),(14,'2025-02-02 11:00:00.000000','2025-02-02 11:00:00.000000',402,4),(15,'2025-02-01 09:30:00.000000','2025-02-01 09:30:00.000000',501,5),(16,'2025-02-02 14:00:00.000000','2025-02-02 14:00:00.000000',502,5),(17,'2025-02-01 16:45:00.000000','2025-02-01 16:45:00.000000',601,6),(18,'2025-02-02 13:20:00.000000','2025-02-02 13:20:00.000000',701,7),(19,'2025-02-03 11:15:00.000000','2025-02-03 11:15:00.000000',801,8),(20,'2025-02-01 15:00:00.000000','2025-02-01 15:00:00.000000',901,9),(21,'2025-02-02 10:30:00.000000','2025-02-02 10:30:00.000000',1001,10),(22,'2025-03-24 17:14:20.982013','2025-03-24 17:14:20.982013',12,1),(23,'2025-03-24 17:14:50.912629','2025-03-24 17:14:50.912629',201,1),(24,'2025-03-26 13:05:11.285796','2025-03-26 13:05:11.285796',14042,1),(25,'2025-03-27 10:48:16.826392','2025-03-27 10:48:16.826392',1,1),(26,'2025-04-07 10:18:00.364411','2025-04-07 10:18:00.364411',27607,1),(27,'2025-04-07 10:20:06.000000','2025-04-07 10:20:06.000000',27607,2),(28,'2025-04-07 10:20:06.000000','2025-04-07 10:20:06.000000',27607,3),(29,'2025-04-07 10:20:06.000000','2025-04-07 10:20:06.000000',27607,4),(30,'2025-04-07 10:20:06.000000','2025-04-07 10:20:06.000000',27607,5),(31,'2025-04-07 10:20:06.000000','2025-04-07 10:20:06.000000',27607,6),(32,'2025-04-07 10:20:06.000000','2025-04-07 10:20:06.000000',27607,7),(33,'2025-04-07 10:20:06.000000','2025-04-07 10:20:06.000000',27607,8),(34,'2025-04-07 10:20:06.000000','2025-04-07 10:20:06.000000',27607,9),(35,'2025-04-07 10:20:06.000000','2025-04-07 10:20:06.000000',27607,10);
/*!40000 ALTER TABLE `article_reads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folders`
--

DROP TABLE IF EXISTS `folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folders` (
  `folder_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `folder_name` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`folder_id`),
  KEY `FKc2qooq7m62v6o0c8ptaj3x4cj` (`user_id`),
  CONSTRAINT `FKc2qooq7m62v6o0c8ptaj3x4cj` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folders`
--

LOCK TABLES `folders` WRITE;
/*!40000 ALTER TABLE `folders` DISABLE KEYS */;
INSERT INTO `folders` VALUES (1,'2025-01-01 10:00:00.000000','2025-01-01 10:00:00.000000','사용자1의 폴더',1),(2,'2025-01-01 11:00:00.000000','2025-01-01 11:00:00.000000','사용자2의 폴더',2),(3,'2025-01-01 12:00:00.000000','2025-01-01 12:00:00.000000','사용자3의 폴더',3),(4,'2025-01-01 13:00:00.000000','2025-01-01 13:00:00.000000','사용자4의 폴더',4),(5,'2025-01-01 14:00:00.000000','2025-01-01 14:00:00.000000','사용자5의 폴더',5);
/*!40000 ALTER TABLE `folders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memos`
--

DROP TABLE IF EXISTS `memos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memos` (
  `memo_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`memo_id`),
  KEY `FKjfl1v48y7d1vlk2jw1qqm3x42` (`user_id`),
  CONSTRAINT `FKjfl1v48y7d1vlk2jw1qqm3x42` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memos`
--

LOCK TABLES `memos` WRITE;
/*!40000 ALTER TABLE `memos` DISABLE KEYS */;
/*!40000 ALTER TABLE `memos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_results`
--

DROP TABLE IF EXISTS `quiz_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_results` (
  `quiz_result_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `article_id` bigint DEFAULT NULL,
  `is_correct` bit(1) DEFAULT NULL,
  `quiz_id` bigint DEFAULT NULL,
  `selected_option_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`quiz_result_id`),
  KEY `FKc31xkn83q9v6yf9gh2spkvxrc` (`user_id`),
  CONSTRAINT `FKc31xkn83q9v6yf9gh2spkvxrc` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_results`
--

LOCK TABLES `quiz_results` WRITE;
/*!40000 ALTER TABLE `quiz_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scraps`
--

DROP TABLE IF EXISTS `scraps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scraps` (
  `scrap_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `article_id` bigint DEFAULT NULL,
  `folder_id` bigint DEFAULT NULL,
  `memo_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`scrap_id`),
  UNIQUE KEY `UK8j7oxi97eodyustey5tirowwk` (`memo_id`),
  KEY `FKsnv49wdpmt6il76sbx9cd6t1r` (`folder_id`),
  KEY `FKqd3nh3tj8ru0ubnk54qckuh42` (`user_id`),
  CONSTRAINT `FKf49m5btq6arjduuian68bjyv6` FOREIGN KEY (`memo_id`) REFERENCES `memos` (`memo_id`),
  CONSTRAINT `FKqd3nh3tj8ru0ubnk54qckuh42` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKsnv49wdpmt6il76sbx9cd6t1r` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`folder_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scraps`
--

LOCK TABLES `scraps` WRITE;
/*!40000 ALTER TABLE `scraps` DISABLE KEYS */;
INSERT INTO `scraps` VALUES (1,'2025-02-01 10:25:00.000000','2025-02-01 10:25:00.000000',101,1,NULL,1),(2,'2025-02-02 14:25:00.000000','2025-02-02 14:25:00.000000',104,1,NULL,1),(3,'2025-02-01 13:50:00.000000','2025-02-01 13:50:00.000000',202,2,NULL,2),(4,'2025-02-02 12:20:00.000000','2025-02-02 12:20:00.000000',302,3,NULL,3),(5,'2025-02-02 11:05:00.000000','2025-02-02 11:05:00.000000',402,4,NULL,4),(6,'2025-02-02 14:05:00.000000','2025-02-02 14:05:00.000000',502,5,NULL,5);
/*!40000 ALTER TABLE `scraps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_preference`
--

DROP TABLE IF EXISTS `user_preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_preference` (
  `preference_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `article_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`preference_id`),
  KEY `FK7mgxw6j2m7uvuk3svr9vsar8p` (`user_id`),
  CONSTRAINT `FK7mgxw6j2m7uvuk3svr9vsar8p` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_preference`
--

LOCK TABLES `user_preference` WRITE;
/*!40000 ALTER TABLE `user_preference` DISABLE KEYS */;
INSERT INTO `user_preference` VALUES (1,'2025-03-20 17:21:22.826143','2025-03-20 17:21:22.826143',1,1),(2,'2025-03-20 17:21:22.829144','2025-03-20 17:21:22.829144',2,1),(3,'2025-03-20 17:21:22.831614','2025-03-20 17:21:22.831614',3,1),(4,'2025-03-21 09:10:59.032525','2025-03-21 09:10:59.032525',4,1),(5,'2025-03-21 09:10:59.058550','2025-03-21 09:10:59.058550',5,1),(6,'2025-03-21 09:10:59.061545','2025-03-21 09:10:59.061545',6,1),(7,'2025-03-21 09:44:27.734010','2025-03-21 09:44:27.734010',6,1),(8,'2025-03-21 09:44:27.757803','2025-03-21 09:44:27.757803',7,1),(9,'2025-03-21 09:44:27.758810','2025-03-21 09:44:27.758810',8,1),(10,'2025-01-01 11:00:00.000000','2025-01-01 11:00:00.000000',201,2),(11,'2025-01-01 11:00:00.000000','2025-01-01 11:00:00.000000',202,2),(12,'2025-01-01 11:00:00.000000','2025-01-01 11:00:00.000000',203,2),(13,'2025-03-26 12:37:52.977025','2025-03-26 12:37:52.977025',6,1),(14,'2025-03-26 12:37:53.000332','2025-03-26 12:37:53.000332',7,1),(15,'2025-03-26 12:37:53.001584','2025-03-26 12:37:53.001584',8,1);
/*!40000 ALTER TABLE `user_preference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `account_role` enum('ADMIN','USER') DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_new` bit(1) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `oauth_id` varchar(255) DEFAULT NULL,
  `oauth_provider` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2025-03-20 17:21:11.112865','2025-03-27 16:35:29.585473','USER',NULL,_binary '','카리1나','81af7e0a-d874-417f-8ec7-567310d390c7','d457c15e-055d-415d-a085-63ec79473b99'),(2,'2025-03-21 17:22:01.664536','2025-03-21 17:22:01.664536','USER',NULL,_binary '','user-6ff2580c','75aeb23a-d9cc-4eb9-850f-5a6bcb446139','f3acdb26-1c83-4213-a29f-daee6303ea82'),(3,'2025-03-21 17:22:03.826727','2025-03-21 17:22:03.826727','USER',NULL,_binary '','user-58b843d4','158bccfb-830e-4e1d-a17c-d52a80407a02','1feeb148-befe-4255-b5bd-fc75c8072d15'),(4,'2025-03-21 17:22:05.029596','2025-03-21 17:22:05.029596','USER',NULL,_binary '','user-1be60055','73be5557-971f-4c6e-91c3-c0f7bb8aaa36','2688ae5d-75ef-40ee-ad92-afc98d29189b'),(5,'2025-03-21 17:22:06.131152','2025-03-21 17:22:06.131152','USER',NULL,_binary '','user-8aee6765','a2ca6e71-97cd-4394-b5b9-c924b78b3e72','45da5048-ca42-4708-8403-ce4b5fd1f6f2'),(6,'2025-03-21 17:22:06.974523','2025-03-21 17:22:06.974523','USER',NULL,_binary '','user-e985c910','5ecc2cce-71eb-42fb-8412-bfc896cae58a','e716d7a1-5093-48f7-98d6-03b2403a51cf'),(7,'2025-03-21 17:22:16.934347','2025-03-21 17:22:16.934347','USER',NULL,_binary '','user-48ed8d7a','10b1dc2c-e1b0-4021-888d-0460c4a1020a','31d6e5de-09f9-4f63-ba4d-4448b8dc368c'),(8,'2025-03-21 17:22:17.837949','2025-03-21 17:22:17.837949','USER',NULL,_binary '','user-df45bf7f','4d4dfa9b-1e28-4f33-9cfc-d246f8e6c837','d85d0c2b-e08d-4332-97cc-fea9c2966034'),(9,'2025-03-21 17:22:18.571150','2025-03-21 17:22:18.571150','USER',NULL,_binary '','user-2f9f265d','2827a531-a60c-4438-b049-c4bd267bd56a','4532bcae-c4d4-453f-a9e2-f33f6eb3d7b8'),(10,'2025-03-21 17:22:19.249302','2025-03-21 17:22:19.249302','USER',NULL,_binary '','user-b7fa83c1','bac3cbcb-49c3-4fcd-b80c-a998197315f8','c84d5825-be23-4976-b6fc-be8cfe58b7d1');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10  9:52:30
