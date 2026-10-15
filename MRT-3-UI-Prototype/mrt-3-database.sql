-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 15, 2026 at 04:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mrt-3-database`
--

-- --------------------------------------------------------

--
-- Table structure for table `fare`
--

CREATE TABLE `fare` (
  `fare_id` int(10) UNSIGNED NOT NULL,
  `origin_station_id` int(10) UNSIGNED NOT NULL,
  `destination_station_id` int(10) UNSIGNED NOT NULL,
  `fare_type_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL
) ;

--
-- Dumping data for table `fare`
--

INSERT INTO `fare` (`fare_id`, `origin_station_id`, `destination_station_id`, `fare_type_id`, `amount`, `effective_from`, `effective_to`) VALUES
(156, 2, 1, 2, 6.00, '2026-10-15', NULL),
(157, 2, 1, 1, 13.00, '2026-10-15', NULL),
(158, 3, 1, 2, 6.00, '2026-10-15', NULL),
(159, 3, 1, 1, 13.00, '2026-10-15', NULL),
(160, 4, 1, 2, 6.00, '2026-10-15', NULL),
(161, 4, 1, 1, 13.00, '2026-10-15', NULL),
(162, 5, 1, 2, 8.00, '2026-10-15', NULL),
(163, 5, 1, 1, 16.00, '2026-10-15', NULL),
(164, 6, 1, 2, 8.00, '2026-10-15', NULL),
(165, 6, 1, 1, 16.00, '2026-10-15', NULL),
(166, 7, 1, 2, 8.00, '2026-10-15', NULL),
(167, 7, 1, 1, 16.00, '2026-10-15', NULL),
(168, 8, 1, 2, 10.00, '2026-10-15', NULL),
(169, 8, 1, 1, 20.00, '2026-10-15', NULL),
(170, 9, 1, 2, 10.00, '2026-10-15', NULL),
(171, 9, 1, 1, 20.00, '2026-10-15', NULL),
(172, 10, 1, 2, 10.00, '2026-10-15', NULL),
(173, 10, 1, 1, 20.00, '2026-10-15', NULL),
(174, 11, 1, 2, 12.00, '2026-10-15', NULL),
(175, 11, 1, 1, 24.00, '2026-10-15', NULL),
(176, 12, 1, 2, 12.00, '2026-10-15', NULL),
(177, 12, 1, 1, 24.00, '2026-10-15', NULL),
(178, 13, 1, 2, 14.00, '2026-10-15', NULL),
(179, 13, 1, 1, 28.00, '2026-10-15', NULL),
(180, 1, 2, 2, 6.00, '2026-10-15', NULL),
(181, 1, 2, 1, 13.00, '2026-10-15', NULL),
(182, 3, 2, 2, 6.00, '2026-10-15', NULL),
(183, 3, 2, 1, 13.00, '2026-10-15', NULL),
(184, 4, 2, 2, 6.00, '2026-10-15', NULL),
(185, 4, 2, 1, 13.00, '2026-10-15', NULL),
(186, 5, 2, 2, 6.00, '2026-10-15', NULL),
(187, 5, 2, 1, 13.00, '2026-10-15', NULL),
(188, 6, 2, 2, 8.00, '2026-10-15', NULL),
(189, 6, 2, 1, 16.00, '2026-10-15', NULL),
(190, 7, 2, 2, 8.00, '2026-10-15', NULL),
(191, 7, 2, 1, 16.00, '2026-10-15', NULL),
(192, 8, 2, 2, 8.00, '2026-10-15', NULL),
(193, 8, 2, 1, 16.00, '2026-10-15', NULL),
(194, 9, 2, 2, 10.00, '2026-10-15', NULL),
(195, 9, 2, 1, 20.00, '2026-10-15', NULL),
(196, 10, 2, 2, 10.00, '2026-10-15', NULL),
(197, 10, 2, 1, 20.00, '2026-10-15', NULL),
(198, 11, 2, 2, 10.00, '2026-10-15', NULL),
(199, 11, 2, 1, 20.00, '2026-10-15', NULL),
(200, 12, 2, 2, 12.00, '2026-10-15', NULL),
(201, 12, 2, 1, 24.00, '2026-10-15', NULL),
(202, 13, 2, 2, 12.00, '2026-10-15', NULL),
(203, 13, 2, 1, 24.00, '2026-10-15', NULL),
(204, 1, 3, 2, 6.00, '2026-10-15', NULL),
(205, 1, 3, 1, 13.00, '2026-10-15', NULL),
(206, 2, 3, 2, 6.00, '2026-10-15', NULL),
(207, 2, 3, 1, 13.00, '2026-10-15', NULL),
(208, 4, 3, 2, 6.00, '2026-10-15', NULL),
(209, 4, 3, 1, 13.00, '2026-10-15', NULL),
(210, 5, 3, 2, 6.00, '2026-10-15', NULL),
(211, 5, 3, 1, 13.00, '2026-10-15', NULL),
(212, 6, 3, 2, 6.00, '2026-10-15', NULL),
(213, 6, 3, 1, 13.00, '2026-10-15', NULL),
(214, 7, 3, 2, 8.00, '2026-10-15', NULL),
(215, 7, 3, 1, 16.00, '2026-10-15', NULL),
(216, 8, 3, 2, 8.00, '2026-10-15', NULL),
(217, 8, 3, 1, 16.00, '2026-10-15', NULL),
(218, 9, 3, 2, 8.00, '2026-10-15', NULL),
(219, 9, 3, 1, 16.00, '2026-10-15', NULL),
(220, 10, 3, 2, 10.00, '2026-10-15', NULL),
(221, 10, 3, 1, 20.00, '2026-10-15', NULL),
(222, 11, 3, 2, 10.00, '2026-10-15', NULL),
(223, 11, 3, 1, 20.00, '2026-10-15', NULL),
(224, 12, 3, 2, 10.00, '2026-10-15', NULL),
(225, 12, 3, 1, 20.00, '2026-10-15', NULL),
(226, 13, 3, 2, 12.00, '2026-10-15', NULL),
(227, 13, 3, 1, 24.00, '2026-10-15', NULL),
(228, 1, 4, 2, 6.00, '2026-10-15', NULL),
(229, 1, 4, 1, 13.00, '2026-10-15', NULL),
(230, 2, 4, 2, 6.00, '2026-10-15', NULL),
(231, 2, 4, 1, 13.00, '2026-10-15', NULL),
(232, 3, 4, 2, 6.00, '2026-10-15', NULL),
(233, 3, 4, 1, 13.00, '2026-10-15', NULL),
(234, 5, 4, 2, 6.00, '2026-10-15', NULL),
(235, 5, 4, 1, 13.00, '2026-10-15', NULL),
(236, 6, 4, 2, 6.00, '2026-10-15', NULL),
(237, 6, 4, 1, 13.00, '2026-10-15', NULL),
(238, 7, 4, 2, 6.00, '2026-10-15', NULL),
(239, 7, 4, 1, 13.00, '2026-10-15', NULL),
(240, 8, 4, 2, 8.00, '2026-10-15', NULL),
(241, 8, 4, 1, 16.00, '2026-10-15', NULL),
(242, 9, 4, 2, 8.00, '2026-10-15', NULL),
(243, 9, 4, 1, 16.00, '2026-10-15', NULL),
(244, 10, 4, 2, 8.00, '2026-10-15', NULL),
(245, 10, 4, 1, 16.00, '2026-10-15', NULL),
(246, 11, 4, 2, 10.00, '2026-10-15', NULL),
(247, 11, 4, 1, 20.00, '2026-10-15', NULL),
(248, 12, 4, 2, 10.00, '2026-10-15', NULL),
(249, 12, 4, 1, 20.00, '2026-10-15', NULL),
(250, 13, 4, 2, 10.00, '2026-10-15', NULL),
(251, 13, 4, 1, 20.00, '2026-10-15', NULL),
(252, 1, 5, 2, 8.00, '2026-10-15', NULL),
(253, 1, 5, 1, 16.00, '2026-10-15', NULL),
(254, 2, 5, 2, 6.00, '2026-10-15', NULL),
(255, 2, 5, 1, 13.00, '2026-10-15', NULL),
(256, 3, 5, 2, 6.00, '2026-10-15', NULL),
(257, 3, 5, 1, 13.00, '2026-10-15', NULL),
(258, 4, 5, 2, 6.00, '2026-10-15', NULL),
(259, 4, 5, 1, 13.00, '2026-10-15', NULL),
(260, 6, 5, 2, 6.00, '2026-10-15', NULL),
(261, 6, 5, 1, 13.00, '2026-10-15', NULL),
(262, 7, 5, 2, 6.00, '2026-10-15', NULL),
(263, 7, 5, 1, 13.00, '2026-10-15', NULL),
(264, 8, 5, 2, 6.00, '2026-10-15', NULL),
(265, 8, 5, 1, 13.00, '2026-10-15', NULL),
(266, 9, 5, 2, 8.00, '2026-10-15', NULL),
(267, 9, 5, 1, 16.00, '2026-10-15', NULL),
(268, 10, 5, 2, 8.00, '2026-10-15', NULL),
(269, 10, 5, 1, 16.00, '2026-10-15', NULL),
(270, 11, 5, 2, 8.00, '2026-10-15', NULL),
(271, 11, 5, 1, 16.00, '2026-10-15', NULL),
(272, 12, 5, 2, 10.00, '2026-10-15', NULL),
(273, 12, 5, 1, 20.00, '2026-10-15', NULL),
(274, 13, 5, 2, 10.00, '2026-10-15', NULL),
(275, 13, 5, 1, 20.00, '2026-10-15', NULL),
(276, 1, 6, 2, 8.00, '2026-10-15', NULL),
(277, 1, 6, 1, 16.00, '2026-10-15', NULL),
(278, 2, 6, 2, 8.00, '2026-10-15', NULL),
(279, 2, 6, 1, 16.00, '2026-10-15', NULL),
(280, 3, 6, 2, 6.00, '2026-10-15', NULL),
(281, 3, 6, 1, 13.00, '2026-10-15', NULL),
(282, 4, 6, 2, 6.00, '2026-10-15', NULL),
(283, 4, 6, 1, 13.00, '2026-10-15', NULL),
(284, 5, 6, 2, 6.00, '2026-10-15', NULL),
(285, 5, 6, 1, 13.00, '2026-10-15', NULL),
(286, 7, 6, 2, 6.00, '2026-10-15', NULL),
(287, 7, 6, 1, 13.00, '2026-10-15', NULL),
(288, 8, 6, 2, 6.00, '2026-10-15', NULL),
(289, 8, 6, 1, 13.00, '2026-10-15', NULL),
(290, 9, 6, 2, 6.00, '2026-10-15', NULL),
(291, 9, 6, 1, 13.00, '2026-10-15', NULL),
(292, 10, 6, 2, 8.00, '2026-10-15', NULL),
(293, 10, 6, 1, 16.00, '2026-10-15', NULL),
(294, 11, 6, 2, 8.00, '2026-10-15', NULL),
(295, 11, 6, 1, 16.00, '2026-10-15', NULL),
(296, 12, 6, 2, 8.00, '2026-10-15', NULL),
(297, 12, 6, 1, 16.00, '2026-10-15', NULL),
(298, 13, 6, 2, 10.00, '2026-10-15', NULL),
(299, 13, 6, 1, 20.00, '2026-10-15', NULL),
(300, 1, 7, 2, 8.00, '2026-10-15', NULL),
(301, 1, 7, 1, 16.00, '2026-10-15', NULL),
(302, 2, 7, 2, 8.00, '2026-10-15', NULL),
(303, 2, 7, 1, 16.00, '2026-10-15', NULL),
(304, 3, 7, 2, 8.00, '2026-10-15', NULL),
(305, 3, 7, 1, 16.00, '2026-10-15', NULL),
(306, 4, 7, 2, 6.00, '2026-10-15', NULL),
(307, 4, 7, 1, 13.00, '2026-10-15', NULL),
(308, 5, 7, 2, 6.00, '2026-10-15', NULL),
(309, 5, 7, 1, 13.00, '2026-10-15', NULL),
(310, 6, 7, 2, 6.00, '2026-10-15', NULL),
(311, 6, 7, 1, 13.00, '2026-10-15', NULL),
(312, 8, 7, 2, 6.00, '2026-10-15', NULL),
(313, 8, 7, 1, 13.00, '2026-10-15', NULL),
(314, 9, 7, 2, 6.00, '2026-10-15', NULL),
(315, 9, 7, 1, 13.00, '2026-10-15', NULL),
(316, 10, 7, 2, 6.00, '2026-10-15', NULL),
(317, 10, 7, 1, 13.00, '2026-10-15', NULL),
(318, 11, 7, 2, 8.00, '2026-10-15', NULL),
(319, 11, 7, 1, 16.00, '2026-10-15', NULL),
(320, 12, 7, 2, 8.00, '2026-10-15', NULL),
(321, 12, 7, 1, 16.00, '2026-10-15', NULL),
(322, 13, 7, 2, 8.00, '2026-10-15', NULL),
(323, 13, 7, 1, 16.00, '2026-10-15', NULL),
(324, 1, 8, 2, 10.00, '2026-10-15', NULL),
(325, 1, 8, 1, 20.00, '2026-10-15', NULL),
(326, 2, 8, 2, 8.00, '2026-10-15', NULL),
(327, 2, 8, 1, 16.00, '2026-10-15', NULL),
(328, 3, 8, 2, 8.00, '2026-10-15', NULL),
(329, 3, 8, 1, 16.00, '2026-10-15', NULL),
(330, 4, 8, 2, 8.00, '2026-10-15', NULL),
(331, 4, 8, 1, 16.00, '2026-10-15', NULL),
(332, 5, 8, 2, 6.00, '2026-10-15', NULL),
(333, 5, 8, 1, 13.00, '2026-10-15', NULL),
(334, 6, 8, 2, 6.00, '2026-10-15', NULL),
(335, 6, 8, 1, 13.00, '2026-10-15', NULL),
(336, 7, 8, 2, 6.00, '2026-10-15', NULL),
(337, 7, 8, 1, 13.00, '2026-10-15', NULL),
(338, 9, 8, 2, 6.00, '2026-10-15', NULL),
(339, 9, 8, 1, 13.00, '2026-10-15', NULL),
(340, 10, 8, 2, 6.00, '2026-10-15', NULL),
(341, 10, 8, 1, 13.00, '2026-10-15', NULL),
(342, 11, 8, 2, 6.00, '2026-10-15', NULL),
(343, 11, 8, 1, 13.00, '2026-10-15', NULL),
(344, 12, 8, 2, 8.00, '2026-10-15', NULL),
(345, 12, 8, 1, 16.00, '2026-10-15', NULL),
(346, 13, 8, 2, 8.00, '2026-10-15', NULL),
(347, 13, 8, 1, 16.00, '2026-10-15', NULL),
(348, 1, 9, 2, 10.00, '2026-10-15', NULL),
(349, 1, 9, 1, 20.00, '2026-10-15', NULL),
(350, 2, 9, 2, 10.00, '2026-10-15', NULL),
(351, 2, 9, 1, 20.00, '2026-10-15', NULL),
(352, 3, 9, 2, 8.00, '2026-10-15', NULL),
(353, 3, 9, 1, 16.00, '2026-10-15', NULL),
(354, 4, 9, 2, 8.00, '2026-10-15', NULL),
(355, 4, 9, 1, 16.00, '2026-10-15', NULL),
(356, 5, 9, 2, 8.00, '2026-10-15', NULL),
(357, 5, 9, 1, 16.00, '2026-10-15', NULL),
(358, 6, 9, 2, 6.00, '2026-10-15', NULL),
(359, 6, 9, 1, 13.00, '2026-10-15', NULL),
(360, 7, 9, 2, 6.00, '2026-10-15', NULL),
(361, 7, 9, 1, 13.00, '2026-10-15', NULL),
(362, 8, 9, 2, 6.00, '2026-10-15', NULL),
(363, 8, 9, 1, 13.00, '2026-10-15', NULL),
(364, 10, 9, 2, 6.00, '2026-10-15', NULL),
(365, 10, 9, 1, 13.00, '2026-10-15', NULL),
(366, 11, 9, 2, 6.00, '2026-10-15', NULL),
(367, 11, 9, 1, 13.00, '2026-10-15', NULL),
(368, 12, 9, 2, 6.00, '2026-10-15', NULL),
(369, 12, 9, 1, 13.00, '2026-10-15', NULL),
(370, 13, 9, 2, 8.00, '2026-10-15', NULL),
(371, 13, 9, 1, 16.00, '2026-10-15', NULL),
(372, 1, 10, 2, 10.00, '2026-10-15', NULL),
(373, 1, 10, 1, 20.00, '2026-10-15', NULL),
(374, 2, 10, 2, 10.00, '2026-10-15', NULL),
(375, 2, 10, 1, 20.00, '2026-10-15', NULL),
(376, 3, 10, 2, 10.00, '2026-10-15', NULL),
(377, 3, 10, 1, 20.00, '2026-10-15', NULL),
(378, 4, 10, 2, 8.00, '2026-10-15', NULL),
(379, 4, 10, 1, 16.00, '2026-10-15', NULL),
(380, 5, 10, 2, 8.00, '2026-10-15', NULL),
(381, 5, 10, 1, 16.00, '2026-10-15', NULL),
(382, 6, 10, 2, 8.00, '2026-10-15', NULL),
(383, 6, 10, 1, 16.00, '2026-10-15', NULL),
(384, 7, 10, 2, 6.00, '2026-10-15', NULL),
(385, 7, 10, 1, 13.00, '2026-10-15', NULL),
(386, 8, 10, 2, 6.00, '2026-10-15', NULL),
(387, 8, 10, 1, 13.00, '2026-10-15', NULL),
(388, 9, 10, 2, 6.00, '2026-10-15', NULL),
(389, 9, 10, 1, 13.00, '2026-10-15', NULL),
(390, 11, 10, 2, 6.00, '2026-10-15', NULL),
(391, 11, 10, 1, 13.00, '2026-10-15', NULL),
(392, 12, 10, 2, 6.00, '2026-10-15', NULL),
(393, 12, 10, 1, 13.00, '2026-10-15', NULL),
(394, 13, 10, 2, 6.00, '2026-10-15', NULL),
(395, 13, 10, 1, 13.00, '2026-10-15', NULL),
(396, 1, 11, 2, 12.00, '2026-10-15', NULL),
(397, 1, 11, 1, 24.00, '2026-10-15', NULL),
(398, 2, 11, 2, 10.00, '2026-10-15', NULL),
(399, 2, 11, 1, 20.00, '2026-10-15', NULL),
(400, 3, 11, 2, 10.00, '2026-10-15', NULL),
(401, 3, 11, 1, 20.00, '2026-10-15', NULL),
(402, 4, 11, 2, 10.00, '2026-10-15', NULL),
(403, 4, 11, 1, 20.00, '2026-10-15', NULL),
(404, 5, 11, 2, 8.00, '2026-10-15', NULL),
(405, 5, 11, 1, 16.00, '2026-10-15', NULL),
(406, 6, 11, 2, 8.00, '2026-10-15', NULL),
(407, 6, 11, 1, 16.00, '2026-10-15', NULL),
(408, 7, 11, 2, 8.00, '2026-10-15', NULL),
(409, 7, 11, 1, 16.00, '2026-10-15', NULL),
(410, 8, 11, 2, 6.00, '2026-10-15', NULL),
(411, 8, 11, 1, 13.00, '2026-10-15', NULL),
(412, 9, 11, 2, 6.00, '2026-10-15', NULL),
(413, 9, 11, 1, 13.00, '2026-10-15', NULL),
(414, 10, 11, 2, 6.00, '2026-10-15', NULL),
(415, 10, 11, 1, 13.00, '2026-10-15', NULL),
(416, 12, 11, 2, 6.00, '2026-10-15', NULL),
(417, 12, 11, 1, 13.00, '2026-10-15', NULL),
(418, 13, 11, 2, 6.00, '2026-10-15', NULL),
(419, 13, 11, 1, 13.00, '2026-10-15', NULL),
(420, 1, 12, 2, 12.00, '2026-10-15', NULL),
(421, 1, 12, 1, 24.00, '2026-10-15', NULL),
(422, 2, 12, 2, 12.00, '2026-10-15', NULL),
(423, 2, 12, 1, 24.00, '2026-10-15', NULL),
(424, 3, 12, 2, 10.00, '2026-10-15', NULL),
(425, 3, 12, 1, 20.00, '2026-10-15', NULL),
(426, 4, 12, 2, 10.00, '2026-10-15', NULL),
(427, 4, 12, 1, 20.00, '2026-10-15', NULL),
(428, 5, 12, 2, 10.00, '2026-10-15', NULL),
(429, 5, 12, 1, 20.00, '2026-10-15', NULL),
(430, 6, 12, 2, 8.00, '2026-10-15', NULL),
(431, 6, 12, 1, 16.00, '2026-10-15', NULL),
(432, 7, 12, 2, 8.00, '2026-10-15', NULL),
(433, 7, 12, 1, 16.00, '2026-10-15', NULL),
(434, 8, 12, 2, 8.00, '2026-10-15', NULL),
(435, 8, 12, 1, 16.00, '2026-10-15', NULL),
(436, 9, 12, 2, 6.00, '2026-10-15', NULL),
(437, 9, 12, 1, 13.00, '2026-10-15', NULL),
(438, 10, 12, 2, 6.00, '2026-10-15', NULL),
(439, 10, 12, 1, 13.00, '2026-10-15', NULL),
(440, 11, 12, 2, 6.00, '2026-10-15', NULL),
(441, 11, 12, 1, 13.00, '2026-10-15', NULL),
(442, 13, 12, 2, 6.00, '2026-10-15', NULL),
(443, 13, 12, 1, 13.00, '2026-10-15', NULL),
(444, 1, 13, 2, 14.00, '2026-10-15', NULL),
(445, 1, 13, 1, 28.00, '2026-10-15', NULL),
(446, 2, 13, 2, 12.00, '2026-10-15', NULL),
(447, 2, 13, 1, 24.00, '2026-10-15', NULL),
(448, 3, 13, 2, 12.00, '2026-10-15', NULL),
(449, 3, 13, 1, 24.00, '2026-10-15', NULL),
(450, 4, 13, 2, 10.00, '2026-10-15', NULL),
(451, 4, 13, 1, 20.00, '2026-10-15', NULL),
(452, 5, 13, 2, 10.00, '2026-10-15', NULL),
(453, 5, 13, 1, 20.00, '2026-10-15', NULL),
(454, 6, 13, 2, 10.00, '2026-10-15', NULL),
(455, 6, 13, 1, 20.00, '2026-10-15', NULL),
(456, 7, 13, 2, 8.00, '2026-10-15', NULL),
(457, 7, 13, 1, 16.00, '2026-10-15', NULL),
(458, 8, 13, 2, 8.00, '2026-10-15', NULL),
(459, 8, 13, 1, 16.00, '2026-10-15', NULL),
(460, 9, 13, 2, 8.00, '2026-10-15', NULL),
(461, 9, 13, 1, 16.00, '2026-10-15', NULL),
(462, 10, 13, 2, 6.00, '2026-10-15', NULL),
(463, 10, 13, 1, 13.00, '2026-10-15', NULL),
(464, 11, 13, 2, 6.00, '2026-10-15', NULL),
(465, 11, 13, 1, 13.00, '2026-10-15', NULL),
(466, 12, 13, 2, 6.00, '2026-10-15', NULL),
(467, 12, 13, 1, 13.00, '2026-10-15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `fare_type`
--

CREATE TABLE `fare_type` (
  `fare_type_id` int(10) UNSIGNED NOT NULL,
  `type_name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fare_type`
--

INSERT INTO `fare_type` (`fare_type_id`, `type_name`) VALUES
(2, 'Concessionary'),
(1, 'Regular');

-- --------------------------------------------------------

--
-- Table structure for table `id_verification`
--

CREATE TABLE `id_verification` (
  `verification_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `id_type` varchar(40) NOT NULL,
  `front_document_ref` varchar(500) DEFAULT NULL,
  `back_document_ref` varchar(500) DEFAULT NULL,
  `verification_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reviewed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `passenger_category`
--

CREATE TABLE `passenger_category` (
  `passenger_category_id` int(10) UNSIGNED NOT NULL,
  `category_name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `passenger_category`
--

INSERT INTO `passenger_category` (`passenger_category_id`, `category_name`) VALUES
(4, 'PWD'),
(1, 'Regular'),
(3, 'Senior'),
(2, 'Student');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(10) UNSIGNED NOT NULL,
  `ticket_id` int(10) UNSIGNED NOT NULL,
  `payment_method` enum('demo_wallet','gcash_demo','station_counter','other') NOT NULL,
  `payment_status` enum('pending','successful','failed','refunded') NOT NULL DEFAULT 'pending',
  `amount` decimal(10,2) NOT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `provider_reference` varchar(190) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `station`
--

CREATE TABLE `station` (
  `station_id` int(10) UNSIGNED NOT NULL,
  `station_code` varchar(30) NOT NULL,
  `station_name` varchar(120) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `landmarks` text DEFAULT NULL,
  `sequence_order` tinyint(3) UNSIGNED NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `station`
--

INSERT INTO `station` (`station_id`, `station_code`, `station_name`, `city`, `landmarks`, `sequence_order`, `status`) VALUES
(1, 'NTA', 'North Avenue', 'Quezon City', 'North Avenue transport interchange', 1, 'active'),
(2, 'QUE', 'Quezon Avenue', 'Quezon City', 'Quezon Avenue area', 2, 'active'),
(3, 'KAM', 'Kamuning', 'Quezon City', 'Kamuning area', 3, 'active'),
(4, 'CUB', 'Araneta Center-Cubao', 'Quezon City', 'Araneta City', 4, 'active'),
(5, 'SAN', 'Santolan-Annapolis', 'Quezon City', 'Santolan Road area', 5, 'active'),
(6, 'ORT', 'Ortigas', 'Mandaluyong', 'Ortigas Center', 6, 'active'),
(7, 'SHW', 'Shaw Boulevard', 'Mandaluyong', 'Shaw Boulevard area', 7, 'active'),
(8, 'BON', 'Boni', 'Mandaluyong', 'Boni Avenue area', 8, 'active'),
(9, 'GUA', 'Guadalupe', 'Makati', 'Guadalupe area', 9, 'active'),
(10, 'BUE', 'Buendia', 'Makati', 'Gil Puyat Avenue area', 10, 'active'),
(11, 'AYA', 'Ayala', 'Makati', 'Ayala Center', 11, 'active'),
(12, 'MAG', 'Magallanes', 'Makati', 'Magallanes area', 12, 'active'),
(13, 'TAF', 'Taft Avenue', 'Pasay', 'EDSA-Taft transport interchange', 13, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `ticket_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `passenger_category_id` int(10) UNSIGNED NOT NULL,
  `origin_station_id` int(10) UNSIGNED DEFAULT NULL,
  `destination_station_id` int(10) UNSIGNED DEFAULT NULL,
  `pickup_station_id` int(10) UNSIGNED DEFAULT NULL,
  `reference` varchar(80) NOT NULL,
  `ticket_type` enum('single_journey','stored_value_pass') NOT NULL,
  `journey_type` varchar(40) DEFAULT NULL,
  `travel_date` date DEFAULT NULL,
  `quantity` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `card_value` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','used','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cancelled_at` timestamp NULL DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `passenger_category_id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(80) NOT NULL,
  `middle_name` varchar(80) DEFAULT NULL,
  `last_name` varchar(80) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `emergency_name` varchar(160) DEFAULT NULL,
  `emergency_phone` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transaction`
--

CREATE TABLE `wallet_transaction` (
  `wallet_transaction_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `ticket_id` int(10) UNSIGNED DEFAULT NULL,
  `transaction_type` enum('top_up','debit','refund','adjustment') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` varchar(255) DEFAULT NULL
) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fare`
--
ALTER TABLE `fare`
  ADD PRIMARY KEY (`fare_id`),
  ADD UNIQUE KEY `uq_fare_route_type_start` (`origin_station_id`,`destination_station_id`,`fare_type_id`,`effective_from`),
  ADD KEY `idx_fare_destination` (`destination_station_id`),
  ADD KEY `idx_fare_type` (`fare_type_id`);

--
-- Indexes for table `fare_type`
--
ALTER TABLE `fare_type`
  ADD PRIMARY KEY (`fare_type_id`),
  ADD UNIQUE KEY `uq_fare_type_name` (`type_name`);

--
-- Indexes for table `id_verification`
--
ALTER TABLE `id_verification`
  ADD PRIMARY KEY (`verification_id`),
  ADD KEY `idx_verification_user` (`user_id`);

--
-- Indexes for table `passenger_category`
--
ALTER TABLE `passenger_category`
  ADD PRIMARY KEY (`passenger_category_id`),
  ADD UNIQUE KEY `uq_passenger_category_name` (`category_name`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `idx_payment_ticket` (`ticket_id`);

--
-- Indexes for table `station`
--
ALTER TABLE `station`
  ADD PRIMARY KEY (`station_id`),
  ADD UNIQUE KEY `uq_station_code` (`station_code`),
  ADD UNIQUE KEY `uq_station_name` (`station_name`),
  ADD UNIQUE KEY `uq_station_sequence` (`sequence_order`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`ticket_id`),
  ADD UNIQUE KEY `uq_ticket_reference` (`reference`),
  ADD KEY `idx_ticket_user` (`user_id`),
  ADD KEY `idx_ticket_category` (`passenger_category_id`),
  ADD KEY `idx_ticket_origin` (`origin_station_id`),
  ADD KEY `idx_ticket_destination` (`destination_station_id`),
  ADD KEY `idx_ticket_pickup` (`pickup_station_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `uq_user_email` (`email`),
  ADD KEY `idx_user_passenger_category` (`passenger_category_id`);

--
-- Indexes for table `wallet_transaction`
--
ALTER TABLE `wallet_transaction`
  ADD PRIMARY KEY (`wallet_transaction_id`),
  ADD KEY `idx_wallet_transaction_user` (`user_id`),
  ADD KEY `idx_wallet_transaction_ticket` (`ticket_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `fare`
--
ALTER TABLE `fare`
  MODIFY `fare_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fare_type`
--
ALTER TABLE `fare_type`
  MODIFY `fare_type_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `id_verification`
--
ALTER TABLE `id_verification`
  MODIFY `verification_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passenger_category`
--
ALTER TABLE `passenger_category`
  MODIFY `passenger_category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `station`
--
ALTER TABLE `station`
  MODIFY `station_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `ticket_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wallet_transaction`
--
ALTER TABLE `wallet_transaction`
  MODIFY `wallet_transaction_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fare`
--
ALTER TABLE `fare`
  ADD CONSTRAINT `fk_fare_destination_station` FOREIGN KEY (`destination_station_id`) REFERENCES `station` (`station_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fare_origin_station` FOREIGN KEY (`origin_station_id`) REFERENCES `station` (`station_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fare_type` FOREIGN KEY (`fare_type_id`) REFERENCES `fare_type` (`fare_type_id`) ON UPDATE CASCADE;

--
-- Constraints for table `id_verification`
--
ALTER TABLE `id_verification`
  ADD CONSTRAINT `fk_verification_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`ticket_id`) ON UPDATE CASCADE;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `fk_ticket_destination_station` FOREIGN KEY (`destination_station_id`) REFERENCES `station` (`station_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ticket_origin_station` FOREIGN KEY (`origin_station_id`) REFERENCES `station` (`station_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ticket_passenger_category` FOREIGN KEY (`passenger_category_id`) REFERENCES `passenger_category` (`passenger_category_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ticket_pickup_station` FOREIGN KEY (`pickup_station_id`) REFERENCES `station` (`station_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ticket_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_passenger_category` FOREIGN KEY (`passenger_category_id`) REFERENCES `passenger_category` (`passenger_category_id`) ON UPDATE CASCADE;

--
-- Constraints for table `wallet_transaction`
--
ALTER TABLE `wallet_transaction`
  ADD CONSTRAINT `fk_wallet_transaction_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`ticket_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_wallet_transaction_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
