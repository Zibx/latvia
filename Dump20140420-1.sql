CREATE DATABASE  IF NOT EXISTS `latvia` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `latvia`;
-- MySQL dump 10.13  Distrib 5.5.35, for debian-linux-gnu (i686)
--
-- Host: localhost    Database: latvia
-- ------------------------------------------------------
-- Server version	5.5.35-0ubuntu0.13.10.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `creator` bigint(20) NOT NULL,
  `name` text COLLATE utf8_unicode_ci,
  `shortName` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `creation` timestamp NULL DEFAULT NULL,
  `equalVote` tinyint(4) DEFAULT NULL,
  `voteMul` int(11) DEFAULT NULL,
  PRIMARY KEY (`bid`),
  UNIQUE KEY `bid_UNIQUE` (`bid`),
  KEY `creator` (`creator`),
  KEY `blogName` (`shortName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
INSERT INTO `blog` VALUES (1,1,'Латвия','main',NULL,0,1);
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `cid` bigint(20) NOT NULL AUTO_INCREMENT,
  `post` int(11) DEFAULT NULL,
  `creator` bigint(20) DEFAULT NULL,
  `creation` timestamp NULL DEFAULT NULL,
  `content` mediumtext COLLATE utf8_unicode_ci,
  `vote` bigint(20) DEFAULT NULL,
  `voteCount` int(11) DEFAULT NULL,
  `parent` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`cid`),
  UNIQUE KEY `cid_UNIQUE` (`cid`),
  KEY `user` (`creator`),
  KEY `creation` (`creation`),
  KEY `post` (`post`),
  CONSTRAINT `fk_post` FOREIGN KEY (`post`) REFERENCES `post` (`pid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user` FOREIGN KEY (`creator`) REFERENCES `user` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,6,1,'2014-04-24 01:16:21','Коммент',0,0,-1),(2,6,1,'2014-04-24 01:17:01','123',0,0,-1);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invite`
--

DROP TABLE IF EXISTS `invite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invite` (
  `invite` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `creator` bigint(20) DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  `email` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`invite`),
  UNIQUE KEY `invite_UNIQUE` (`invite`),
  KEY `user` (`creator`),
  CONSTRAINT `fk_invite_1` FOREIGN KEY (`creator`) REFERENCES `user` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invite`
--

LOCK TABLES `invite` WRITE;
/*!40000 ALTER TABLE `invite` DISABLE KEYS */;
/*!40000 ALTER TABLE `invite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `creator` bigint(20) NOT NULL,
  `blog` int(11) NOT NULL,
  `title` text COLLATE utf8_unicode_ci,
  `content` longtext COLLATE utf8_unicode_ci,
  `creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `private` tinyint(4) NOT NULL,
  `lastCommentDate` timestamp NULL DEFAULT NULL,
  `vote` bigint(20) DEFAULT NULL,
  `voteCount` int(11) DEFAULT NULL,
  PRIMARY KEY (`pid`),
  KEY `order` (`creation`) USING BTREE,
  KEY `blog` (`blog`) USING BTREE,
  KEY `private` (`private`) USING BTREE,
  KEY `author` (`creator`),
  KEY `lastComment` (`lastCommentDate`) USING BTREE,
  KEY `vote` (`vote`) USING BTREE,
  CONSTRAINT `blog` FOREIGN KEY (`blog`) REFERENCES `blog` (`bid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `creator` FOREIGN KEY (`creator`) REFERENCES `user` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,1,1,NULL,'Первейший пост!\nЛатвия — священная наша держава.','2014-04-11 20:00:00',0,NULL,NULL,NULL),(3,1,1,'','Пыщь','2014-04-23 23:49:24',0,NULL,NULL,NULL),(4,1,1,'','Пыщь','2014-04-23 23:50:12',0,NULL,NULL,NULL),(5,1,1,'','The post','2014-04-24 00:03:45',0,'2014-04-24 00:03:45',0,0),(6,1,1,'','Щачло же','2014-04-24 00:12:31',0,'2014-04-24 00:12:31',0,0);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `uid` bigint(20) NOT NULL AUTO_INCREMENT,
  `login` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `session` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `karma` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `register` timestamp NULL DEFAULT NULL,
  `sex` tinyint(4) DEFAULT NULL,
  `parent` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid_UNIQUE` (`uid`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `session` (`session`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'latvia','777','88b2DeBA-866C-4F4f-9bbF-2B3411Ab15a1',666,66613,NULL,1,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit`
--

DROP TABLE IF EXISTS `visit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit` (
  `type` tinyint(4) NOT NULL,
  `instance` bigint(20) NOT NULL,
  `user` bigint(20) NOT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `viewed` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`type`,`instance`,`user`),
  UNIQUE KEY `type_UNIQUE` (`type`),
  UNIQUE KEY `instance_UNIQUE` (`instance`),
  UNIQUE KEY `user_UNIQUE` (`user`),
  CONSTRAINT `fk_visit_1` FOREIGN KEY (`user`) REFERENCES `user` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit`
--

LOCK TABLES `visit` WRITE;
/*!40000 ALTER TABLE `visit` DISABLE KEYS */;
/*!40000 ALTER TABLE `visit` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-04-24  5:23:17
