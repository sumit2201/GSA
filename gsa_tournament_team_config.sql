-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 14, 2019 at 06:17 AM
-- Server version: 5.6.43-cll-lve
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `techni_18032019`
--

-- --------------------------------------------------------

--
-- Table structure for table `gsa_tournament_team_config`
--

CREATE TABLE `gsa_tournament_team_config` (
  `id` int(11) NOT NULL,
  `tournamentId` int(11) NOT NULL,
  `maxNumberOfTeams` int(11) NOT NULL,
  `agegroup` int(11) NOT NULL,
  `directorId` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gsa_tournament_team_config`
--

INSERT INTO `gsa_tournament_team_config` (`id`, `tournamentId`, `maxNumberOfTeams`, `agegroup`, `directorId`) VALUES
(4, 2503, 4, 30, 305),
(3, 2503, 7, 29, 305);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gsa_tournament_team_config`
--
ALTER TABLE `gsa_tournament_team_config`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `gsa_tournament_team_config`
--
ALTER TABLE `gsa_tournament_team_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
