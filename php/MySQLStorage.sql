DROP TABLE IF EXISTS `elfinder_file`;
CREATE TABLE IF NOT EXISTS `elfinder_file` (
  `id` int(7) unsigned NOT NULL auto_increment,
  `parent_id` int(7) unsigned NOT NULL,
  `name` varchar(256) collate utf8_unicode_ci NOT NULL,
  `content` longblob NOT NULL,
  `size` int(10) unsigned NOT NULL default '0',
  `mtime` int(10) unsigned NOT NULL,
  `mime` varchar(256) collate utf8_unicode_ci NOT NULL default 'unknown',
  `width` int(5) NOT NULL,
  `height` int(5) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `parent_name` (`parent_id`,`name`),
  KEY `parent_id` (`parent_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `elfinder_file` (`id`, `parent_id`, `name`, `content`, `size`, `mtime`, `mime`, `width`, `height`) VALUES 
('1', '0', 'DATABASE', '', '0', '0', 'directory', '0', '0');
