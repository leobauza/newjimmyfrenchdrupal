<?php
/**
 * @file
 * Block Info Include
 */

function makeInfo($name) {

  return array(
    'info' => t($name),
    'cache' => DRUPAL_CACHE_PER_PAGE,
  );

}